"""
Student Risk Intelligence Center — Premium UI v2.0
Dark glassmorphism theme · Three.js 3D brain · SHAP Explainability
What-If Simulator · Batch Analysis · Student Comparison · Session History
"""

import base64
import csv
import io
import json
import math
from datetime import datetime
from urllib import error, request

import numpy as np
import pandas as pd
import plotly.graph_objects as go
import streamlit as st
import streamlit.components.v1 as components

# ─── Page config ───────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Student Risk Intelligence Center",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded",
)

API_BASE = "http://127.0.0.1:8000"

# ─── Session state init ───────────────────────────────────────────────────────
if "history" not in st.session_state:
    st.session_state.history = []
if "last_payload" not in st.session_state:
    st.session_state.last_payload = None
if "last_result" not in st.session_state:
    st.session_state.last_result = None

# ─── CSS: dark theme, glassmorphism, animations ───────────────────────────────
GLOBAL_CSS = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
    --bg-primary: #0a0e1a;
    --bg-secondary: #111827;
    --bg-card: rgba(17, 24, 39, 0.7);
    --bg-glass: rgba(255, 255, 255, 0.03);
    --border-glass: rgba(255, 255, 255, 0.08);
    --accent-blue: #3b82f6;
    --accent-cyan: #06b6d4;
    --accent-purple: #8b5cf6;
    --accent-green: #10b981;
    --accent-amber: #f59e0b;
    --accent-red: #ef4444;
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;
    --glow-blue: 0 0 20px rgba(59, 130, 246, 0.3);
    --glow-purple: 0 0 20px rgba(139, 92, 246, 0.3);
    --glow-cyan: 0 0 20px rgba(6, 182, 212, 0.3);
}

.stApp, [data-testid="stAppViewContainer"], .main, section[data-testid="stSidebar"] {
    background: var(--bg-primary) !important;
    color: var(--text-primary) !important;
    font-family: 'Inter', sans-serif !important;
}
header[data-testid="stHeader"] { background: transparent !important; }
[data-testid="stSidebar"] {
    background: var(--bg-secondary) !important;
    border-right: 1px solid var(--border-glass) !important;
}
#MainMenu, footer, .stDeployButton { display: none !important; }

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-primary); }
::-webkit-scrollbar-thumb { background: var(--border-glass); border-radius: 3px; }

.stApp::before {
    content: '';
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background:
        radial-gradient(ellipse 80% 60% at 20% 10%, rgba(59,130,246,0.08), transparent),
        radial-gradient(ellipse 60% 50% at 80% 80%, rgba(139,92,246,0.06), transparent),
        radial-gradient(ellipse 50% 40% at 50% 50%, rgba(6,182,212,0.04), transparent);
    pointer-events: none; z-index: 0;
    animation: bgShift 20s ease-in-out infinite alternate;
}
@keyframes bgShift { 0% { opacity:1; } 50% { opacity:0.7; } 100% { opacity:1; } }

.glass-card {
    background: var(--bg-glass);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border-glass); border-radius: 16px;
    padding: 24px; margin-bottom: 16px;
    animation: fadeSlideUp 0.6s ease-out both;
}
@keyframes fadeSlideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }

.metric-card {
    background: var(--bg-glass);
    backdrop-filter: blur(16px);
    border: 1px solid var(--border-glass); border-radius: 14px;
    padding: 20px 18px; text-align: center;
    transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
    animation: fadeSlideUp 0.6s ease-out both;
    position: relative; overflow: hidden;
}
.metric-card:hover { transform: translateY(-4px); border-color: rgba(59,130,246,0.3); box-shadow: var(--glow-blue); }
.metric-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; border-radius:14px 14px 0 0; }
.metric-card.blue::before  { background: linear-gradient(90deg, var(--accent-blue), var(--accent-cyan)); }
.metric-card.purple::before { background: linear-gradient(90deg, var(--accent-purple), var(--accent-blue)); }
.metric-card.green::before  { background: linear-gradient(90deg, var(--accent-green), var(--accent-cyan)); }
.metric-card.amber::before  { background: linear-gradient(90deg, var(--accent-amber), var(--accent-red)); }
.metric-card.red::before    { background: linear-gradient(90deg, var(--accent-red), var(--accent-amber)); }
.metric-card .metric-icon   { font-size: 28px; margin-bottom: 8px; }
.metric-card .metric-label  { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:1.2px; color:var(--text-muted); margin-bottom:6px; }
.metric-card .metric-value  { font-size:28px; font-weight:800; font-family:'JetBrains Mono',monospace;
    background: linear-gradient(135deg, var(--text-primary), var(--accent-cyan));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

.risk-badge { display:inline-flex; align-items:center; gap:8px; padding:6px 16px; border-radius:999px; font-size:13px; font-weight:600; animation:pulseBadge 2s ease-in-out infinite; }
.risk-badge.low    { background:rgba(16,185,129,0.15); color:#34d399; border:1px solid rgba(16,185,129,0.3); }
.risk-badge.medium { background:rgba(245,158,11,0.15); color:#fbbf24; border:1px solid rgba(245,158,11,0.3); }
.risk-badge.high   { background:rgba(239,68,68,0.15);  color:#f87171; border:1px solid rgba(239,68,68,0.3); }
@keyframes pulseBadge { 0%,100% { box-shadow:0 0 0 0 rgba(59,130,246,0.2); } 50% { box-shadow:0 0 0 6px rgba(59,130,246,0); } }

.rec-card {
    background: var(--bg-glass); border:1px solid var(--border-glass);
    border-radius:12px; padding:16px; margin-bottom:10px;
    transition: all 0.3s ease; animation: fadeSlideUp 0.5s ease-out both;
}
.rec-card:hover { border-color:rgba(139,92,246,0.3); box-shadow:var(--glow-purple); transform:translateX(4px); }
.rec-bar-track { height:6px; background:rgba(255,255,255,0.06); border-radius:3px; margin-top:8px; overflow:hidden; }
.rec-bar-fill  { height:100%; border-radius:3px; background:linear-gradient(90deg,var(--accent-cyan),var(--accent-blue)); animation:barGrow 1.2s cubic-bezier(0.4,0,0.2,1) both; }
@keyframes barGrow { from { width:0; } }

.section-title { font-size:20px; font-weight:700; margin:28px 0 14px 0; display:flex; align-items:center; gap:10px; }
.section-title .dot { width:8px; height:8px; border-radius:50%; background:var(--accent-blue); box-shadow:0 0 8px var(--accent-blue); animation:dotPulse 2s ease-in-out infinite; }
@keyframes dotPulse { 0%,100% { transform:scale(1); opacity:1; } 50% { transform:scale(1.5); opacity:0.6; } }

.hero-title {
    font-size:42px; font-weight:900; line-height:1.1;
    background:linear-gradient(135deg,#f1f5f9 0%,#3b82f6 40%,#8b5cf6 70%,#06b6d4 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-size:200% 200%; animation:gradientMove 6s ease-in-out infinite; margin-bottom:6px;
}
@keyframes gradientMove { 0% { background-position:0% 50%; } 50% { background-position:100% 50%; } 100% { background-position:0% 50%; } }
.hero-subtitle { font-size:15px; color:var(--text-secondary); font-weight:400; letter-spacing:0.3px; max-width:520px; }

.stForm { border:none !important; padding:0 !important; }
div.stButton > button, button[kind="primary"],
button[data-testid="stFormSubmitButton"] > button,
.stFormSubmitButton > button {
    background:linear-gradient(135deg,var(--accent-blue),var(--accent-purple)) !important;
    color:white !important; border:none !important; border-radius:12px !important;
    padding:12px 32px !important; font-weight:700 !important; font-size:15px !important;
    letter-spacing:0.5px !important; transition:all 0.3s ease !important;
    box-shadow:0 4px 15px rgba(59,130,246,0.3) !important;
}
div.stButton > button:hover, .stFormSubmitButton > button:hover {
    transform:translateY(-2px) !important; box-shadow:0 8px 25px rgba(59,130,246,0.5) !important;
}

[data-testid="stSlider"] > div > div > div > div { background-color:var(--accent-blue) !important; }
div[data-baseweb="slider"] > div { background:rgba(255,255,255,0.06) !important; }

[data-baseweb="select"] > div, [data-baseweb="input"] > div {
    background:rgba(255,255,255,0.04) !important; border-color:var(--border-glass) !important;
    border-radius:10px !important; color:var(--text-primary) !important;
}
.stSelectbox label, .stSlider label, .stTextInput label, .stNumberInput label {
    color:var(--text-secondary) !important; font-weight:500 !important; font-size:13px !important;
}

.stTabs [data-baseweb="tab-list"] { gap:4px; background:var(--bg-glass); border-radius:12px; padding:4px; border:1px solid var(--border-glass); }
.stTabs [data-baseweb="tab"] { border-radius:10px !important; color:var(--text-secondary) !important; font-weight:600 !important; padding:8px 20px !important; }
.stTabs [aria-selected="true"] { background:linear-gradient(135deg,rgba(59,130,246,0.2),rgba(139,92,246,0.2)) !important; color:var(--text-primary) !important; border-bottom:none !important; }
.stTabs [data-baseweb="tab-highlight"] { display:none; }
.stTabs [data-baseweb="tab-border"] { display:none; }

[data-testid="stToggle"] label span { color:var(--text-secondary) !important; }
[data-testid="stExpander"] { background:var(--bg-glass) !important; border:1px solid var(--border-glass) !important; border-radius:12px !important; }
.stPlotlyChart { border-radius:16px; overflow:hidden; }
.stSpinner > div { border-color:var(--accent-blue) transparent transparent !important; }

.shap-pos { background:linear-gradient(90deg, rgba(239,68,68,0.3), rgba(239,68,68,0.1)); border-left:3px solid var(--accent-red); }
.shap-neg { background:linear-gradient(90deg, rgba(16,185,129,0.3), rgba(16,185,129,0.1)); border-left:3px solid var(--accent-green); }
.shap-row { padding:10px 14px; border-radius:8px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center; }

.history-card {
    background:var(--bg-glass); border:1px solid var(--border-glass);
    border-radius:10px; padding:10px 14px; margin-bottom:8px;
    font-size:12px; transition:all 0.2s; cursor:default;
}
.history-card:hover { border-color:rgba(59,130,246,0.3); }
</style>
"""
st.markdown(GLOBAL_CSS, unsafe_allow_html=True)


# ─── Three.js Hero ────────────────────────────────────────────────────────────
THREE_JS_HERO = """
<div id="hero3d" style="width:100%;height:380px;border-radius:16px;overflow:hidden;
    background:radial-gradient(ellipse at center,rgba(17,24,39,0.9),#0a0e1a);
    border:1px solid rgba(255,255,255,0.06);position:relative;">
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
(function(){
const container = document.getElementById('hero3d');
const W = container.clientWidth, H = container.clientHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, W/H, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
renderer.setSize(W, H); renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const nodes = [];
const nodeGeo = new THREE.SphereGeometry(0.04, 12, 12);
const COUNT = 120;
for(let i=0; i<COUNT; i++){
    const phi = Math.acos(-1 + (2*i)/COUNT);
    const theta = Math.sqrt(COUNT*Math.PI)*phi;
    const r = 1.8;
    const x = r*Math.cos(theta)*Math.sin(phi), y = r*Math.sin(theta)*Math.sin(phi), z = r*Math.cos(phi);
    const hue = 0.55 + 0.15*Math.random();
    const mat = new THREE.MeshBasicMaterial({color: new THREE.Color().setHSL(hue, 0.8, 0.6)});
    const mesh = new THREE.Mesh(nodeGeo, mat);
    mesh.position.set(x, y, z);
    mesh.userData = {baseX:x, baseY:y, baseZ:z, phase: Math.random()*Math.PI*2};
    scene.add(mesh); nodes.push(mesh);
}

const lineMat = new THREE.LineBasicMaterial({color:0x3b82f6, transparent:true, opacity:0.12});
for(let i=0; i<nodes.length; i++){
    for(let j=i+1; j<nodes.length; j++){
        if(nodes[i].position.distanceTo(nodes[j].position) < 1.0){
            const geo = new THREE.BufferGeometry().setFromPoints([nodes[i].position.clone(), nodes[j].position.clone()]);
            scene.add(new THREE.Line(geo, lineMat));
        }
    }
}

const ringGeo = new THREE.TorusGeometry(2.3, 0.015, 8, 120);
const ring1 = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({color:0x8b5cf6, transparent:true, opacity:0.3}));
ring1.rotation.x = Math.PI/2; scene.add(ring1);
const ring2 = new THREE.Mesh(ringGeo.clone(), new THREE.MeshBasicMaterial({color:0x06b6d4, transparent:true, opacity:0.2}));
ring2.rotation.x = Math.PI/3; ring2.rotation.z = Math.PI/4; scene.add(ring2);

const pCount = 200; const pGeo = new THREE.BufferGeometry();
const pPos = new Float32Array(pCount*3);
for(let i=0;i<pCount*3;i++) pPos[i]=(Math.random()-0.5)*12;
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos,3));
scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({color:0x3b82f6, size:0.02, transparent:true, opacity:0.4})));

let t = 0;
function animate(){
    requestAnimationFrame(animate); t += 0.008;
    nodes.forEach(n => { const d=n.userData; const p=1+0.05*Math.sin(t*2+d.phase); n.position.set(d.baseX*p, d.baseY*p, d.baseZ*p); });
    ring1.rotation.z = t*0.3; ring2.rotation.z = -t*0.2; ring2.rotation.y = t*0.15;
    camera.position.x = Math.sin(t*0.4)*1.5; camera.position.y = Math.cos(t*0.3)*0.8;
    camera.lookAt(0,0,0); renderer.render(scene, camera);
}
animate();
window.addEventListener('resize', ()=>{ const w=container.clientWidth, h=container.clientHeight; renderer.setSize(w,h); camera.aspect=w/h; camera.updateProjectionMatrix(); });
})();
</script>
"""


# ─── Helpers ───────────────────────────────────────────────────────────────────
def post_json(url: str, payload: dict, timeout: int = 20) -> dict:
    data = json.dumps(payload).encode("utf-8")
    req = request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")
    with request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def get_json(url: str, timeout: int = 10) -> dict:
    with request.urlopen(url, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def build_payload(v: dict) -> dict:
    return {
        "study_hours_sum": v["study_hours_sum"],
        "study_hours_mean": v["study_hours_mean"],
        "clicks_sum": v["clicks_sum"],
        "resources_sum": v["resources_sum"],
        "forum_posts_sum": v["forum_posts_sum"],
        "attendance_mean": v["attendance_mean"],
        "sleep_mean": v["sleep_mean"],
        "study_habits_index_mean": v["study_habits_index_mean"],
        "consistency_score_mean": v["consistency_score_mean"],
        "cramming_indicator_mean": v["cramming_indicator_mean"],
        "age": v["age"],
        "gender_F": int(v["gender"] == "F"),
        "gender_M": int(v["gender"] == "M"),
        "gender_Other": int(v["gender"] == "Other"),
        "socio_econ_low": int(v["socio_econ"] == "low"),
        "socio_econ_middle": int(v["socio_econ"] == "middle"),
        "socio_econ_high": int(v["socio_econ"] == "high"),
        "school_type_public": int(v["school_type"] == "public"),
        "school_type_private": int(v["school_type"] == "private"),
        "parent_education_none": int(v["parent_education"] == "none"),
        "parent_education_primary": int(v["parent_education"] == "primary"),
        "parent_education_secondary": int(v["parent_education"] == "secondary"),
        "parent_education_bachelor": int(v["parent_education"] == "bachelor"),
        "parent_education_master_": int(v["parent_education"] == "master_"),
        "internet_access": int(v["internet_access"]),
        "tutoring": int(v["tutoring"]),
    }


def svg_ring_gauge(probability: float) -> str:
    pct = probability * 100
    if pct < 35:
        color, glow, label = "#10b981", "rgba(16,185,129,0.4)", "LOW RISK"
    elif pct < 65:
        color, glow, label = "#f59e0b", "rgba(245,158,11,0.4)", "MEDIUM RISK"
    else:
        color, glow, label = "#ef4444", "rgba(239,68,68,0.4)", "HIGH RISK"
    circumference = 2 * math.pi * 80
    dash = circumference * probability
    gap = circumference - dash
    return f"""
    <div style="display:flex;flex-direction:column;align-items:center;animation:fadeSlideUp .7s ease-out both;">
      <svg width="220" height="220" viewBox="0 0 220 220" style="filter:drop-shadow(0 0 20px {glow});">
        <defs><linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="{color}"/><stop offset="100%" stop-color="#3b82f6"/>
        </linearGradient></defs>
        <circle cx="110" cy="110" r="80" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="12"/>
        <circle cx="110" cy="110" r="80" fill="none" stroke="url(#rg)" stroke-width="12"
          stroke-linecap="round" stroke-dasharray="{dash:.1f} {gap:.1f}"
          transform="rotate(-90 110 110)"
          style="animation:ringDraw 1.5s cubic-bezier(0.4,0,0.2,1) both;"/>
        <text x="110" y="100" text-anchor="middle" fill="{color}"
          style="font-family:'JetBrains Mono',monospace;font-size:36px;font-weight:900;">{pct:.1f}%</text>
        <text x="110" y="125" text-anchor="middle" fill="#64748b"
          style="font-size:11px;letter-spacing:2px;font-weight:600;">{label}</text>
      </svg>
    </div>
    <style>@keyframes ringDraw {{ from {{ stroke-dasharray: 0 {circumference:.1f}; }} }}</style>
    """


def make_radar(v: dict) -> go.Figure:
    categories = ["Study Hours", "Attendance", "Sleep", "Study Habits", "Consistency", "Resources"]
    raw = [min(v["study_hours_sum"]/120,1), v["attendance_mean"], min(v["sleep_mean"]/10,1),
           min(v["study_habits_index_mean"]/100,1), min(v["consistency_score_mean"]/100,1), min(v["resources_sum"]/600,1)]
    fig = go.Figure()
    fig.add_trace(go.Scatterpolar(r=raw+[raw[0]], theta=categories+[categories[0]], fill="toself",
        fillcolor="rgba(59,130,246,0.12)", line=dict(color="#3b82f6", width=2),
        marker=dict(size=6, color="#06b6d4"), name="Student"))
    fig.update_layout(
        polar=dict(bgcolor="rgba(0,0,0,0)", radialaxis=dict(visible=True, range=[0,1], showticklabels=False, gridcolor="rgba(255,255,255,0.05)"),
                    angularaxis=dict(gridcolor="rgba(255,255,255,0.05)", tickfont=dict(color="#94a3b8", size=11))),
        showlegend=False, height=320, margin=dict(l=50,r=50,t=30,b=30), paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)")
    return fig


def make_3d_surface(base_values: dict) -> go.Figure:
    N = 18
    study_delta = np.linspace(-8, 15, N)
    attend_delta = np.linspace(-0.15, 0.18, N)
    z = np.zeros((N, N))
    for i, ad in enumerate(attend_delta):
        for j, sd in enumerate(study_delta):
            scenario = dict(base_values)
            scenario["study_hours_sum"] = max(0.0, scenario["study_hours_sum"] + float(sd))
            scenario["attendance_mean"] = min(1.0, max(0.0, scenario["attendance_mean"] + float(ad)))
            try:
                res = post_json(f"{API_BASE}/predict", build_payload(scenario))
                z[i, j] = float(res["risk_probability"])
            except Exception:
                z[i, j] = np.nan
    x = base_values["study_hours_sum"] + study_delta
    y = (base_values["attendance_mean"] + attend_delta) * 100
    fig = go.Figure(data=[go.Surface(x=x, y=y, z=z,
        colorscale=[[0,"#10b981"],[0.35,"#06b6d4"],[0.5,"#3b82f6"],[0.65,"#8b5cf6"],[0.85,"#f59e0b"],[1,"#ef4444"]],
        colorbar=dict(title=dict(text="Risk", font=dict(color="#94a3b8")), tickfont=dict(color="#94a3b8"), bgcolor="rgba(0,0,0,0)"),
        contours=dict(z=dict(show=True, usecolormap=True, highlightcolor="white", project_z=True)),
        lighting=dict(ambient=0.6, diffuse=0.8, specular=0.3, roughness=0.5))])
    try:
        curr_z = float(post_json(f"{API_BASE}/predict", build_payload(base_values))["risk_probability"])
    except Exception:
        curr_z = 0.5
    fig.add_trace(go.Scatter3d(x=[base_values["study_hours_sum"]], y=[base_values["attendance_mean"]*100], z=[curr_z],
        mode="markers+text", marker=dict(size=8, color="#f1f5f9", symbol="diamond", line=dict(color="#3b82f6", width=2)),
        text=["YOU"], textposition="top center", textfont=dict(color="#f1f5f9", size=12), name="Current"))
    scene_ax = lambda t: dict(title=t, backgroundcolor="rgba(0,0,0,0)", gridcolor="rgba(255,255,255,0.05)",
        showbackground=True, zerolinecolor="rgba(255,255,255,0.08)", titlefont=dict(color="#94a3b8"), tickfont=dict(color="#64748b"))
    fig.update_layout(scene=dict(xaxis=scene_ax("Study Hours"), yaxis=scene_ax("Attendance %"), zaxis=scene_ax("Risk"), bgcolor="rgba(0,0,0,0)"),
        height=560, margin=dict(l=0,r=0,t=10,b=0), paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
        font=dict(color="#94a3b8"), legend=dict(font=dict(color="#94a3b8")))
    return fig


def make_waterfall(recs: list) -> go.Figure:
    if not recs:
        return None
    labels = [f"{r['feature'].replace('_',' ').title()}\n({r['change']})" for r in recs]
    reductions = [r["risk_reduction"]*100 for r in recs]
    fig = go.Figure(go.Bar(x=reductions, y=labels, orientation="h",
        marker=dict(color=reductions, colorscale=[[0,"#06b6d4"],[1,"#10b981"]], line=dict(width=0), cornerradius=6),
        text=[f"-{v:.1f}%" for v in reductions], textposition="outside",
        textfont=dict(color="#94a3b8", size=12, family="JetBrains Mono")))
    fig.update_layout(height=max(200,len(recs)*70), margin=dict(l=10,r=60,t=10,b=10),
        paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
        xaxis=dict(title="Risk Reduction %", gridcolor="rgba(255,255,255,0.04)", zerolinecolor="rgba(255,255,255,0.06)",
                   tickfont=dict(color="#64748b"), titlefont=dict(color="#94a3b8")),
        yaxis=dict(tickfont=dict(color="#94a3b8", size=11), autorange="reversed"), font=dict(color="#94a3b8"))
    return fig


def make_shap_waterfall(features_data: list, base_value: float, risk_prob: float) -> go.Figure:
    top = features_data[:12]
    top.reverse()
    names = [f["feature"].replace("_", " ").title() for f in top]
    shap_vals = [f["shap_value"] for f in top]
    colors = ["#ef4444" if v > 0 else "#10b981" for v in shap_vals]
    fig = go.Figure(go.Bar(
        y=names, x=shap_vals, orientation="h",
        marker=dict(color=colors, line=dict(width=0), cornerradius=4),
        text=[f"{v:+.4f}" for v in shap_vals], textposition="outside",
        textfont=dict(color="#94a3b8", size=11, family="JetBrains Mono"),
    ))
    fig.add_vline(x=0, line_dash="dash", line_color="rgba(255,255,255,0.15)")
    fig.update_layout(
        height=max(300, len(top)*45), margin=dict(l=10, r=80, t=30, b=30),
        paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
        xaxis=dict(title="SHAP Value (impact on risk)", gridcolor="rgba(255,255,255,0.04)",
                   zerolinecolor="rgba(255,255,255,0.1)", tickfont=dict(color="#64748b"), titlefont=dict(color="#94a3b8")),
        yaxis=dict(tickfont=dict(color="#94a3b8", size=11)), font=dict(color="#94a3b8"),
        title=dict(text=f"Base: {base_value:.4f} → Prediction: {risk_prob:.4f}", font=dict(size=13, color="#64748b"), x=0.5),
    )
    return fig


def make_sensitivity_curve(sweep_vals, risk_vals, current_val, current_risk, feature_name):
    colors = ["#10b981" if r < 0.35 else ("#f59e0b" if r < 0.65 else "#ef4444") for r in risk_vals]
    fig = go.Figure()
    fig.add_hrect(y0=0, y1=0.35, fillcolor="rgba(16,185,129,0.05)", line_width=0)
    fig.add_hrect(y0=0.35, y1=0.65, fillcolor="rgba(245,158,11,0.05)", line_width=0)
    fig.add_hrect(y0=0.65, y1=1.0, fillcolor="rgba(239,68,68,0.05)", line_width=0)
    fig.add_trace(go.Scatter(x=sweep_vals, y=risk_vals, mode="lines",
        line=dict(color="#3b82f6", width=3, shape="spline"), fill="tozeroy",
        fillcolor="rgba(59,130,246,0.08)", name="Risk"))
    fig.add_trace(go.Scatter(x=sweep_vals, y=risk_vals, mode="markers",
        marker=dict(color=colors, size=6, line=dict(width=1, color="rgba(255,255,255,0.2)")),
        showlegend=False, hovertemplate="%{x:.2f} → %{y:.3f}<extra></extra>"))
    fig.add_trace(go.Scatter(x=[current_val], y=[current_risk], mode="markers+text",
        marker=dict(size=14, color="#f1f5f9", symbol="diamond", line=dict(color="#3b82f6", width=2)),
        text=["Current"], textposition="top center", textfont=dict(color="#f1f5f9", size=12),
        name="Current Value"))
    nice = feature_name.replace("_", " ").title()
    fig.update_layout(
        xaxis=dict(title=nice, gridcolor="rgba(255,255,255,0.04)", tickfont=dict(color="#64748b"), titlefont=dict(color="#94a3b8")),
        yaxis=dict(title="Dropout Risk", range=[0, 1], gridcolor="rgba(255,255,255,0.04)",
                   tickfont=dict(color="#64748b"), titlefont=dict(color="#94a3b8")),
        height=420, margin=dict(l=40, r=20, t=30, b=40),
        paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
        font=dict(color="#94a3b8"), legend=dict(font=dict(color="#94a3b8"), bgcolor="rgba(0,0,0,0)"))
    return fig


def make_comparison_radar(vals_a, vals_b):
    categories = ["Study Hours", "Attendance", "Sleep", "Study Habits", "Consistency", "Resources"]
    def normalize(v):
        return [min(v["study_hours_sum"]/120,1), v["attendance_mean"], min(v["sleep_mean"]/10,1),
                min(v["study_habits_index_mean"]/100,1), min(v["consistency_score_mean"]/100,1), min(v["resources_sum"]/600,1)]
    ra, rb = normalize(vals_a), normalize(vals_b)
    fig = go.Figure()
    fig.add_trace(go.Scatterpolar(r=ra+[ra[0]], theta=categories+[categories[0]], fill="toself",
        fillcolor="rgba(59,130,246,0.12)", line=dict(color="#3b82f6", width=2), name="Student A"))
    fig.add_trace(go.Scatterpolar(r=rb+[rb[0]], theta=categories+[categories[0]], fill="toself",
        fillcolor="rgba(139,92,246,0.12)", line=dict(color="#8b5cf6", width=2), name="Student B"))
    fig.update_layout(
        polar=dict(bgcolor="rgba(0,0,0,0)", radialaxis=dict(visible=True, range=[0,1], showticklabels=False,
            gridcolor="rgba(255,255,255,0.05)"), angularaxis=dict(gridcolor="rgba(255,255,255,0.05)", tickfont=dict(color="#94a3b8", size=11))),
        height=380, margin=dict(l=50,r=50,t=30,b=30), paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
        legend=dict(font=dict(color="#94a3b8"), bgcolor="rgba(0,0,0,0)"))
    return fig


def make_feature_importance_chart(data):
    top = data[:15]
    top.reverse()
    fig = go.Figure(go.Bar(
        y=[d["feature"].replace("_"," ").title() for d in top],
        x=[d["importance_gain"] for d in top], orientation="h",
        marker=dict(color=[d["importance_gain"] for d in top],
                    colorscale=[[0,"#06b6d4"],[0.5,"#3b82f6"],[1,"#8b5cf6"]], cornerradius=4),
        text=[f'{d["importance_gain"]:.0f}' for d in top], textposition="outside",
        textfont=dict(color="#94a3b8", size=11, family="JetBrains Mono")))
    fig.update_layout(
        height=max(350, len(top)*40), margin=dict(l=10, r=60, t=10, b=10),
        paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
        xaxis=dict(title="Importance (Gain)", gridcolor="rgba(255,255,255,0.04)", tickfont=dict(color="#64748b"), titlefont=dict(color="#94a3b8")),
        yaxis=dict(tickfont=dict(color="#94a3b8", size=11)), font=dict(color="#94a3b8"))
    return fig


def generate_html_report(values, risk_p, unc_level, pred_set, recs, shap_data=None):
    badge_color = "#10b981" if risk_p < 0.35 else ("#f59e0b" if risk_p < 0.65 else "#ef4444")
    risk_label = "LOW" if risk_p < 0.35 else ("MEDIUM" if risk_p < 0.65 else "HIGH")
    recs_html = ""
    for r in (recs or []):
        recs_html += f'<tr><td>{r["feature"].replace("_"," ").title()}</td><td>{r["change"]}</td><td>{r["risk_reduction"]*100:.1f}%</td></tr>'
    shap_html = ""
    if shap_data:
        for f in shap_data[:10]:
            shap_html += f'<tr><td>{f["feature"].replace("_"," ").title()}</td><td>{f["value"]:.3f}</td><td style="color:{"#ef4444" if f["shap_value"]>0 else "#10b981"}">{f["shap_value"]:+.5f}</td></tr>'
    return f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Student Risk Report</title>
<style>body{{font-family:Inter,sans-serif;background:#0a0e1a;color:#f1f5f9;padding:40px;max-width:900px;margin:auto}}
h1{{background:linear-gradient(135deg,#3b82f6,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:32px}}
.badge{{display:inline-block;padding:6px 18px;border-radius:999px;background:{badge_color}22;color:{badge_color};font-weight:700;border:1px solid {badge_color}44}}
table{{width:100%;border-collapse:collapse;margin:16px 0}}th,td{{padding:10px 14px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.06)}}
th{{color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px}}
.card{{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin:16px 0}}
</style></head><body>
<h1>Student Risk Intelligence Report</h1>
<p style="color:#94a3b8">Generated {datetime.now().strftime('%Y-%m-%d %H:%M')}</p>
<div class="card"><h2>Risk Assessment</h2>
<p style="font-size:48px;font-weight:900;color:{badge_color}">{risk_p*100:.1f}%</p>
<span class="badge">{risk_label} RISK</span>
<p style="margin-top:12px;color:#94a3b8">Uncertainty: {unc_level.replace("_"," ").title()} &middot; Prediction Set: {pred_set}</p></div>
<div class="card"><h2>Student Profile</h2><table>
<tr><th>Feature</th><th>Value</th></tr>
<tr><td>Age</td><td>{values["age"]}</td></tr>
<tr><td>Study Hours (total)</td><td>{values["study_hours_sum"]}</td></tr>
<tr><td>Attendance</td><td>{values["attendance_mean"]*100:.0f}%</td></tr>
<tr><td>Sleep (avg hrs)</td><td>{values["sleep_mean"]}</td></tr>
<tr><td>Study Habits Index</td><td>{values["study_habits_index_mean"]}</td></tr>
<tr><td>Consistency Score</td><td>{values["consistency_score_mean"]}</td></tr>
<tr><td>Platform Clicks</td><td>{values["clicks_sum"]}</td></tr>
<tr><td>Resources Accessed</td><td>{values["resources_sum"]}</td></tr>
<tr><td>Forum Posts</td><td>{values["forum_posts_sum"]}</td></tr>
</table></div>
{"<div class='card'><h2>AI Recommendations</h2><table><tr><th>Action</th><th>Change</th><th>Risk Reduction</th></tr>" + recs_html + "</table></div>" if recs_html else ""}
{"<div class='card'><h2>SHAP Feature Impact</h2><table><tr><th>Feature</th><th>Value</th><th>SHAP Impact</th></tr>" + shap_html + "</table></div>" if shap_html else ""}
<p style="text-align:center;color:#334155;font-size:12px;margin-top:40px">Student Risk Intelligence Center &middot; AI-Powered Analysis</p>
</body></html>"""


# ═══════════════════════════════════════════════════════════════════════════════
# SIDEBAR — Session History
# ═══════════════════════════════════════════════════════════════════════════════
with st.sidebar:
    st.markdown(
        '<div style="padding:16px 0"><span style="font-size:20px;font-weight:800;'
        'background:linear-gradient(135deg,#3b82f6,#8b5cf6);'
        '-webkit-background-clip:text;-webkit-text-fill-color:transparent;">🧠 SRI Center</span></div>',
        unsafe_allow_html=True)
    st.markdown(
        '<div class="section-title" style="font-size:14px;margin-top:8px">'
        '<span class="dot"></span> Session History</div>',
        unsafe_allow_html=True)
    if st.session_state.history:
        for idx, h in enumerate(reversed(st.session_state.history)):
            risk_col = "#10b981" if h["risk"] < 0.35 else ("#f59e0b" if h["risk"] < 0.65 else "#ef4444")
            st.markdown(
                f'<div class="history-card">'
                f'<div style="display:flex;justify-content:space-between">'
                f'<span style="color:#94a3b8">#{len(st.session_state.history)-idx}</span>'
                f'<span style="color:{risk_col};font-weight:700;font-family:JetBrains Mono">{h["risk"]*100:.1f}%</span></div>'
                f'<div style="color:#64748b;font-size:11px;margin-top:4px">'
                f'Age {h["age"]} &middot; Study {h["study_hrs"]:.0f}h &middot; Att {h["attendance"]*100:.0f}%</div>'
                f'<div style="color:#334155;font-size:10px;margin-top:2px">{h["time"]}</div>'
                f'</div>', unsafe_allow_html=True)
        if st.button("Clear History", use_container_width=True):
            st.session_state.history = []
            st.rerun()
    else:
        st.markdown(
            '<div style="color:#64748b;font-size:13px;padding:12px 0">'
            'No analyses yet. Run an analysis to build your session history.</div>',
            unsafe_allow_html=True)
    st.markdown("---")
    st.markdown(
        '<div style="color:#334155;font-size:11px">'
        'v2.0 &middot; SHAP &middot; What-If &middot; Batch &middot; Compare</div>',
        unsafe_allow_html=True)


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN LAYOUT
# ═══════════════════════════════════════════════════════════════════════════════
health_ok = False
try:
    health_ok = get_json(f"{API_BASE}/").get("status") == "ok"
except Exception:
    pass

# ── Hero ──────────────────────────────────────────────────────────────────────
hero_left, hero_right = st.columns([1, 1.2])
with hero_left:
    st.markdown('<div style="padding-top:40px">', unsafe_allow_html=True)
    st.markdown('<div class="hero-title">Student Risk<br>Intelligence Center</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="hero-subtitle">'
        "AI-powered dropout risk analysis with SHAP explainability, what-if simulation, "
        "conformal uncertainty, batch processing, and interactive 3D scenario exploration."
        "</div>", unsafe_allow_html=True)
    if health_ok:
        st.markdown(
            '<div style="margin-top:18px">'
            '<span style="display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:999px;'
            'background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.3);color:#34d399;font-size:12px;font-weight:600;">'
            '<span style="width:7px;height:7px;border-radius:50%;background:#10b981;animation:dotPulse 1.5s infinite;"></span>'
            "API Connected &middot; v2.0</span></div>", unsafe_allow_html=True)
    else:
        st.markdown(
            '<div style="margin-top:18px">'
            '<span style="display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:999px;'
            'background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);color:#f87171;font-size:12px;font-weight:600;">'
            "API Offline — start FastAPI first</span></div>", unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)
with hero_right:
    components.html(THREE_JS_HERO, height=395)

st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)

# ── Tabs ──────────────────────────────────────────────────────────────────────
tab_analyze, tab_shap, tab_whatif, tab_batch, tab_compare, tab_3d, tab_about = st.tabs([
    "  Analyze  ", "  SHAP Explain  ", "  What-If  ",
    "  Batch Analysis  ", "  Compare  ", "  3D Explorer  ", "  About  ",
])


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 1 — Analyze Student
# ═══════════════════════════════════════════════════════════════════════════════
with tab_analyze:
    col_form, col_spacer, col_results = st.columns([1.15, 0.05, 1])
    with col_form:
        st.markdown('<div class="section-title"><span class="dot"></span> Student Profile</div>', unsafe_allow_html=True)
        with st.form("student_form", border=False):
            st.markdown(
                '<div class="glass-card"><span style="font-size:13px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">'
                "Academic &amp; Engagement</span></div>", unsafe_allow_html=True)
            r1a, r1b, r1c = st.columns(3)
            with r1a:
                study_hours_sum = st.slider("Study Hours (total)", 0.0, 120.0, 42.0, 0.5)
                study_hours_mean = st.slider("Study Hours (avg/week)", 0.0, 12.0, 2.8, 0.1)
            with r1b:
                clicks_sum = st.slider("Platform Clicks", 0.0, 2500.0, 600.0, 5.0)
                resources_sum = st.slider("Resources Accessed", 0.0, 600.0, 140.0, 1.0)
            with r1c:
                forum_posts_sum = st.slider("Forum Posts", 0.0, 180.0, 18.0, 1.0)
                attendance_mean = st.slider("Attendance Rate", 0.0, 1.0, 0.82, 0.01)

            st.markdown(
                '<div class="glass-card" style="animation-delay:0.1s"><span style="font-size:13px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">'
                "Lifestyle &amp; Habits</span></div>", unsafe_allow_html=True)
            r2a, r2b, r2c = st.columns(3)
            with r2a:
                sleep_mean = st.slider("Avg Sleep (hrs)", 2.0, 10.0, 6.6, 0.1)
                study_habits_index_mean = st.slider("Study Habits Index", 0.0, 100.0, 62.0, 1.0)
            with r2b:
                consistency_score_mean = st.slider("Consistency Score", 0.0, 100.0, 58.0, 1.0)
                cramming_indicator_mean = st.slider("Cramming Indicator", 0.0, 1.0, 0.32, 0.01)
            with r2c:
                age = st.slider("Age", 14, 30, 18)
                internet_access = st.toggle("Internet Access", value=True)
                tutoring = st.toggle("Has Tutoring", value=False)

            st.markdown(
                '<div class="glass-card" style="animation-delay:0.2s"><span style="font-size:13px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">'
                "Demographics</span></div>", unsafe_allow_html=True)
            d1, d2, d3, d4 = st.columns(4)
            with d1: gender = st.selectbox("Gender", ["F", "M", "Other"])
            with d2: socio_econ = st.selectbox("Socio-Economic", ["low", "middle", "high"], index=1)
            with d3: school_type = st.selectbox("School Type", ["public", "private"])
            with d4: parent_education = st.selectbox("Parent Education", ["none","primary","secondary","bachelor","master_"], index=2)

            st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)
            run = st.form_submit_button("Analyze Student", use_container_width=True)

    values = dict(
        age=age, study_hours_sum=study_hours_sum, study_hours_mean=study_hours_mean,
        clicks_sum=clicks_sum, resources_sum=resources_sum, forum_posts_sum=forum_posts_sum,
        attendance_mean=attendance_mean, sleep_mean=sleep_mean,
        study_habits_index_mean=study_habits_index_mean,
        consistency_score_mean=consistency_score_mean,
        cramming_indicator_mean=cramming_indicator_mean,
        internet_access=internet_access, tutoring=tutoring,
        gender=gender, socio_econ=socio_econ, school_type=school_type,
        parent_education=parent_education,
    )

    with col_results:
        st.markdown('<div class="section-title"><span class="dot"></span> Intelligence Report</div>', unsafe_allow_html=True)
        if run and health_ok:
            payload = build_payload(values)
            try:
                pred = post_json(f"{API_BASE}/predict", payload)
                unc = post_json(f"{API_BASE}/uncertainty", payload)
                rec = post_json(f"{API_BASE}/recommend", payload)
                explain = post_json(f"{API_BASE}/explain", payload)
                risk_p = float(pred["risk_probability"])
                unc_level = unc.get("uncertainty_level", "N/A")
                pred_set = unc.get("prediction_set", "N/A")
                recs = rec.get("recommendations", [])
                baseline = rec.get("baseline_risk", risk_p)
                shap_features = explain.get("top_features", [])

                st.session_state.last_payload = payload
                st.session_state.last_result = {
                    "risk_p": risk_p, "unc_level": unc_level, "pred_set": pred_set,
                    "recs": recs, "baseline": baseline, "shap_features": shap_features,
                    "base_value": explain.get("base_value", 0),
                }
                st.session_state.history.append({
                    "risk": risk_p, "age": values["age"],
                    "study_hrs": values["study_hours_sum"],
                    "attendance": values["attendance_mean"],
                    "time": datetime.now().strftime("%H:%M:%S"),
                })

                st.markdown(svg_ring_gauge(risk_p), unsafe_allow_html=True)

                m1, m2, m3 = st.columns(3)
                with m1:
                    st.markdown(
                        f'<div class="metric-card blue" style="animation-delay:0.15s">'
                        f'<div class="metric-icon">🎲</div><div class="metric-label">Prediction Set</div>'
                        f'<div class="metric-value">{pred_set}</div></div>', unsafe_allow_html=True)
                with m2:
                    st.markdown(
                        f'<div class="metric-card purple" style="animation-delay:0.25s">'
                        f'<div class="metric-icon">🔬</div><div class="metric-label">Uncertainty</div>'
                        f'<div class="metric-value" style="font-size:14px">{unc_level.replace("_"," ").title()}</div></div>', unsafe_allow_html=True)
                with m3:
                    card_cls = "green" if risk_p < 0.5 else "amber"
                    st.markdown(
                        f'<div class="metric-card {card_cls}" style="animation-delay:0.35s">'
                        f'<div class="metric-icon">📊</div><div class="metric-label">Baseline Risk</div>'
                        f'<div class="metric-value">{baseline*100:.1f}%</div></div>', unsafe_allow_html=True)

                st.markdown(
                    '<div class="section-title" style="font-size:16px;margin-top:20px">'
                    '<span class="dot"></span> Student Profile Radar</div>', unsafe_allow_html=True)
                st.plotly_chart(make_radar(values), use_container_width=True)

                st.markdown(
                    '<div class="section-title" style="font-size:16px">'
                    '<span class="dot"></span> AI Recommendations</div>', unsafe_allow_html=True)
                if recs:
                    wf = make_waterfall(recs)
                    if wf:
                        st.plotly_chart(wf, use_container_width=True)
                    for idx, r in enumerate(recs):
                        feat_nice = r["feature"].replace("_"," ").title()
                        st.markdown(
                            f'<div class="rec-card" style="animation-delay:{0.1*idx:.1f}s">'
                            f'<div style="display:flex;justify-content:space-between;align-items:center">'
                            f'<span style="font-weight:600;color:#f1f5f9">{feat_nice}</span>'
                            f'<span style="font-family:JetBrains Mono;color:#10b981;font-weight:700">&#8595; {r["risk_reduction"]*100:.1f}%</span></div>'
                            f'<div style="font-size:12px;color:#64748b;margin-top:4px">'
                            f'Change: {r["change"]}  &middot;  {r["risk_before"]*100:.1f}% &rarr; {r["risk_after"]*100:.1f}%</div>'
                            f'<div class="rec-bar-track"><div class="rec-bar-fill" style="width:{min(r["risk_reduction"]*500,100):.0f}%"></div></div></div>',
                            unsafe_allow_html=True)
                else:
                    st.info("Profile is already low-risk. No further improvements suggested.")

                st.markdown("<div style='height:16px'></div>", unsafe_allow_html=True)
                report_html = generate_html_report(values, risk_p, unc_level, pred_set, recs, shap_features)
                b64 = base64.b64encode(report_html.encode()).decode()
                st.markdown(
                    f'<a href="data:text/html;base64,{b64}" download="student_risk_report.html" '
                    f'style="display:inline-flex;align-items:center;gap:8px;padding:10px 24px;border-radius:10px;'
                    f'background:linear-gradient(135deg,rgba(16,185,129,0.2),rgba(6,182,212,0.2));'
                    f'border:1px solid rgba(16,185,129,0.3);color:#34d399;font-weight:600;font-size:14px;'
                    f'text-decoration:none;transition:all 0.3s">'
                    f'📄 Download Full Report (HTML)</a>', unsafe_allow_html=True)

            except error.HTTPError as exc:
                st.error(f"API error: HTTP {exc.code}")
            except Exception as exc:
                st.error(f"Error: {exc}")
        elif run and not health_ok:
            st.warning("Start the FastAPI server first: `uvicorn api.main:app --reload`")
        else:
            st.markdown(
                '<div class="glass-card" style="text-align:center;padding:60px 24px;">'
                '<div style="font-size:48px;margin-bottom:16px;animation:dotPulse 2s infinite">🧠</div>'
                '<div style="font-size:18px;font-weight:600;color:#f1f5f9;margin-bottom:8px">Awaiting Analysis</div>'
                '<div style="font-size:13px;color:#64748b;max-width:320px;margin:0 auto">'
                "Fill in the student profile and press <b>Analyze Student</b> to generate "
                "risk predictions, uncertainty estimates, and AI recommendations.</div></div>",
                unsafe_allow_html=True)


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 2 — SHAP Explainability
# ═══════════════════════════════════════════════════════════════════════════════
with tab_shap:
    st.markdown(
        '<div class="section-title"><span class="dot"></span> SHAP Feature Explainability</div>'
        '<div style="color:#94a3b8;font-size:13px;margin-bottom:16px">'
        "Understand <b>why</b> the model made its prediction. SHAP values show each feature's "
        "contribution: <span style='color:#ef4444'>red = increases risk</span>, "
        "<span style='color:#10b981'>green = decreases risk</span>.</div>",
        unsafe_allow_html=True)

    if st.session_state.last_result and st.session_state.last_result.get("shap_features"):
        result = st.session_state.last_result
        risk_p = result["risk_p"]
        base_val = result["base_value"]
        feats = result["shap_features"]

        sc1, sc2 = st.columns([1.4, 1])
        with sc1:
            st.markdown(
                '<div class="section-title" style="font-size:16px"><span class="dot"></span> SHAP Waterfall</div>',
                unsafe_allow_html=True)
            fig_shap = make_shap_waterfall(feats, base_val, risk_p)
            st.plotly_chart(fig_shap, use_container_width=True)
        with sc2:
            st.markdown(
                '<div class="section-title" style="font-size:16px"><span class="dot"></span> Top Impact Features</div>',
                unsafe_allow_html=True)
            for f in feats[:10]:
                cls = "shap-pos" if f["shap_value"] > 0 else "shap-neg"
                arrow = "&#8593;" if f["shap_value"] > 0 else "&#8595;"
                color = "#ef4444" if f["shap_value"] > 0 else "#10b981"
                nice = f["feature"].replace("_", " ").title()
                st.markdown(
                    f'<div class="shap-row {cls}">'
                    f'<div><span style="font-weight:600;color:#f1f5f9">{nice}</span>'
                    f'<span style="color:#64748b;font-size:11px;margin-left:8px">= {f["value"]:.3f}</span></div>'
                    f'<span style="font-family:JetBrains Mono;color:{color};font-weight:700">'
                    f'{arrow} {abs(f["shap_value"]):.5f}</span></div>',
                    unsafe_allow_html=True)

            pos_impact = sum(f["shap_value"] for f in feats if f["shap_value"] > 0)
            neg_impact = sum(f["shap_value"] for f in feats if f["shap_value"] < 0)
            st.markdown(
                f'<div class="glass-card" style="margin-top:16px;padding:16px">'
                f'<div style="font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Impact Summary</div>'
                f'<div style="display:flex;gap:16px">'
                f'<div style="flex:1;text-align:center"><div style="color:#ef4444;font-size:20px;font-weight:800;font-family:JetBrains Mono">+{pos_impact:.4f}</div>'
                f'<div style="color:#64748b;font-size:11px">Risk Increasing</div></div>'
                f'<div style="flex:1;text-align:center"><div style="color:#10b981;font-size:20px;font-weight:800;font-family:JetBrains Mono">{neg_impact:.4f}</div>'
                f'<div style="color:#64748b;font-size:11px">Risk Decreasing</div></div></div></div>',
                unsafe_allow_html=True)
    else:
        st.markdown(
            '<div class="glass-card" style="text-align:center;padding:60px 24px">'
            '<div style="font-size:48px;margin-bottom:16px">🔍</div>'
            '<div style="font-size:18px;font-weight:600;color:#f1f5f9;margin-bottom:8px">No SHAP Data Yet</div>'
            '<div style="font-size:13px;color:#64748b;max-width:400px;margin:0 auto">'
            "Run an analysis in the <b>Analyze</b> tab first. SHAP explanations will appear automatically here.</div></div>",
            unsafe_allow_html=True)


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 3 — What-If Simulator
# ═══════════════════════════════════════════════════════════════════════════════
with tab_whatif:
    st.markdown(
        '<div class="section-title"><span class="dot"></span> What-If Simulator</div>'
        '<div style="color:#94a3b8;font-size:13px;margin-bottom:16px">'
        "Explore how changing a <b>single feature</b> affects dropout risk. "
        "Select a feature and range, then watch the risk curve update.</div>",
        unsafe_allow_html=True)

    if health_ok:
        SIMULATABLE = {
            "study_hours_sum": (0, 120, "Total study hours"),
            "study_hours_mean": (0, 12, "Avg study hours/week"),
            "clicks_sum": (0, 2500, "Platform clicks"),
            "resources_sum": (0, 600, "Resources accessed"),
            "forum_posts_sum": (0, 180, "Forum posts"),
            "attendance_mean": (0, 1.0, "Attendance rate"),
            "sleep_mean": (2, 10, "Avg sleep hours"),
            "study_habits_index_mean": (0, 100, "Study habits index"),
            "consistency_score_mean": (0, 100, "Consistency score"),
            "cramming_indicator_mean": (0, 1.0, "Cramming indicator"),
            "age": (14, 30, "Student age"),
        }

        wi_col1, wi_col2 = st.columns([0.4, 0.6])
        with wi_col1:
            feat_choice = st.selectbox("Feature to simulate",
                list(SIMULATABLE.keys()),
                format_func=lambda x: f"{SIMULATABLE[x][2]} ({x})")
            fmin, fmax, _ = SIMULATABLE[feat_choice]
            sim_range = st.slider("Simulation range", float(fmin), float(fmax), (float(fmin), float(fmax)))
            sim_steps = st.slider("Resolution (steps)", 10, 60, 30)
            run_sim = st.button("Run Simulation", use_container_width=True)

        with wi_col2:
            if run_sim and st.session_state.last_payload:
                with st.spinner("Simulating scenarios..."):
                    sim_payload = {
                        "student": st.session_state.last_payload,
                        "feature": feat_choice,
                        "min_val": sim_range[0],
                        "max_val": sim_range[1],
                        "steps": sim_steps,
                    }
                    try:
                        sim_result = post_json(f"{API_BASE}/simulate", sim_payload)
                        fig = make_sensitivity_curve(
                            sim_result["sweep_values"], sim_result["risk_values"],
                            sim_result["current_value"], sim_result["current_risk"],
                            feat_choice)
                        st.plotly_chart(fig, use_container_width=True)

                        min_risk = min(sim_result["risk_values"])
                        max_risk = max(sim_result["risk_values"])
                        best_val = sim_result["sweep_values"][sim_result["risk_values"].index(min_risk)]
                        ic1, ic2, ic3 = st.columns(3)
                        with ic1:
                            st.markdown(
                                f'<div class="metric-card green"><div class="metric-icon">✅</div>'
                                f'<div class="metric-label">Lowest Risk</div>'
                                f'<div class="metric-value">{min_risk*100:.1f}%</div>'
                                f'<div style="color:#64748b;font-size:11px">at {best_val:.2f}</div></div>', unsafe_allow_html=True)
                        with ic2:
                            st.markdown(
                                f'<div class="metric-card red"><div class="metric-icon">⚠️</div>'
                                f'<div class="metric-label">Highest Risk</div>'
                                f'<div class="metric-value">{max_risk*100:.1f}%</div></div>', unsafe_allow_html=True)
                        with ic3:
                            spread = max_risk - min_risk
                            st.markdown(
                                f'<div class="metric-card purple"><div class="metric-icon">📐</div>'
                                f'<div class="metric-label">Risk Spread</div>'
                                f'<div class="metric-value">{spread*100:.1f}%</div></div>', unsafe_allow_html=True)
                    except Exception as exc:
                        st.error(f"Simulation error: {exc}")
            elif run_sim:
                st.warning("Run an analysis in the Analyze tab first to set a student profile.")
            else:
                st.markdown(
                    '<div class="glass-card" style="text-align:center;padding:60px 24px">'
                    '<div style="font-size:48px;margin-bottom:16px">🎛️</div>'
                    '<div style="font-size:16px;font-weight:600;color:#f1f5f9;margin-bottom:8px">Select &amp; Simulate</div>'
                    '<div style="font-size:13px;color:#64748b;max-width:400px;margin:0 auto">'
                    "Choose a feature and click <b>Run Simulation</b> to see how it affects risk.</div></div>",
                    unsafe_allow_html=True)
    else:
        st.warning("Connect to the API to run simulations.")


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 4 — Batch Analysis
# ═══════════════════════════════════════════════════════════════════════════════
with tab_batch:
    st.markdown(
        '<div class="section-title"><span class="dot"></span> Batch Student Analysis</div>'
        '<div style="color:#94a3b8;font-size:13px;margin-bottom:16px">'
        "Upload a CSV file with multiple student records to analyze them all at once. "
        "Get risk scores, distribution statistics, and identify at-risk students.</div>",
        unsafe_allow_html=True)

    if health_ok:
        uploaded = st.file_uploader("Upload CSV", type=["csv"], label_visibility="collapsed")

        with st.expander("CSV Format Guide"):
            st.markdown(
                '<div style="color:#94a3b8;font-size:13px">'
                "Required numeric columns: <code>study_hours_sum, study_hours_mean, clicks_sum, resources_sum, "
                "forum_posts_sum, attendance_mean, sleep_mean, study_habits_index_mean, consistency_score_mean, "
                "cramming_indicator_mean, age</code><br><br>"
                "Optional categorical columns: <code>gender, socio_econ, school_type, parent_education, "
                "internet_access, tutoring</code></div>",
                unsafe_allow_html=True)

        if uploaded:
            try:
                df = pd.read_csv(uploaded)
                st.markdown(
                    f'<div class="glass-card" style="padding:14px">'
                    f'<span style="color:#94a3b8;font-size:13px">Loaded <b>{len(df)}</b> student records with <b>{len(df.columns)}</b> columns</span></div>',
                    unsafe_allow_html=True)

                if st.button("Analyze Batch", use_container_width=True):
                    with st.spinner(f"Analyzing {len(df)} students..."):
                        REQUIRED_NUM = ["study_hours_sum","study_hours_mean","clicks_sum","resources_sum",
                            "forum_posts_sum","attendance_mean","sleep_mean","study_habits_index_mean",
                            "consistency_score_mean","cramming_indicator_mean","age"]
                        missing = [c for c in REQUIRED_NUM if c not in df.columns]
                        if missing:
                            st.error(f"Missing columns: {', '.join(missing)}")
                        else:
                            students = []
                            for _, row in df.iterrows():
                                s = {}
                                for c in REQUIRED_NUM:
                                    s[c] = int(row[c]) if c == "age" else float(row[c])
                                gender = str(row.get("gender", "M"))
                                s["gender_F"] = int(gender == "F")
                                s["gender_M"] = int(gender == "M")
                                s["gender_Other"] = int(gender == "Other")
                                se = str(row.get("socio_econ", "middle"))
                                s["socio_econ_low"] = int(se == "low")
                                s["socio_econ_middle"] = int(se == "middle")
                                s["socio_econ_high"] = int(se == "high")
                                st_val = str(row.get("school_type", "public"))
                                s["school_type_public"] = int(st_val == "public")
                                s["school_type_private"] = int(st_val == "private")
                                pe = str(row.get("parent_education", "secondary"))
                                s["parent_education_none"] = int(pe == "none")
                                s["parent_education_primary"] = int(pe == "primary")
                                s["parent_education_secondary"] = int(pe == "secondary")
                                s["parent_education_bachelor"] = int(pe == "bachelor")
                                s["parent_education_master_"] = int(pe == "master_")
                                s["internet_access"] = int(row.get("internet_access", 1))
                                s["tutoring"] = int(row.get("tutoring", 0))
                                students.append(s)

                            batch_result = post_json(f"{API_BASE}/predict/batch", {"students": students}, timeout=120)
                            preds = batch_result["predictions"]
                            summary = batch_result["summary"]

                            s1, s2, s3, s4 = st.columns(4)
                            with s1:
                                st.markdown(
                                    f'<div class="metric-card blue"><div class="metric-icon">👥</div>'
                                    f'<div class="metric-label">Students</div>'
                                    f'<div class="metric-value">{summary["count"]}</div></div>', unsafe_allow_html=True)
                            with s2:
                                st.markdown(
                                    f'<div class="metric-card green"><div class="metric-icon">✅</div>'
                                    f'<div class="metric-label">Low Risk</div>'
                                    f'<div class="metric-value">{summary["low_risk_count"]}</div></div>', unsafe_allow_html=True)
                            with s3:
                                st.markdown(
                                    f'<div class="metric-card amber"><div class="metric-icon">⚠️</div>'
                                    f'<div class="metric-label">Medium Risk</div>'
                                    f'<div class="metric-value">{summary["medium_risk_count"]}</div></div>', unsafe_allow_html=True)
                            with s4:
                                st.markdown(
                                    f'<div class="metric-card red"><div class="metric-icon">🚨</div>'
                                    f'<div class="metric-label">High Risk</div>'
                                    f'<div class="metric-value">{summary["high_risk_count"]}</div></div>', unsafe_allow_html=True)

                            st.markdown(
                                '<div class="section-title" style="font-size:16px"><span class="dot"></span> Risk Distribution</div>',
                                unsafe_allow_html=True)
                            risk_vals = [p["risk_probability"] for p in preds]
                            fig_hist = go.Figure()
                            fig_hist.add_trace(go.Histogram(
                                x=risk_vals, nbinsx=30,
                                marker=dict(color="rgba(59,130,246,0.6)", line=dict(color="#3b82f6", width=1))))
                            fig_hist.add_vline(x=0.35, line_dash="dash", line_color="#10b981", annotation_text="Low/Med", annotation_font_color="#10b981")
                            fig_hist.add_vline(x=0.65, line_dash="dash", line_color="#ef4444", annotation_text="Med/High", annotation_font_color="#ef4444")
                            fig_hist.update_layout(
                                xaxis=dict(title="Risk Probability", gridcolor="rgba(255,255,255,0.04)", tickfont=dict(color="#64748b"), titlefont=dict(color="#94a3b8")),
                                yaxis=dict(title="Count", gridcolor="rgba(255,255,255,0.04)", tickfont=dict(color="#64748b"), titlefont=dict(color="#94a3b8")),
                                height=350, margin=dict(l=40,r=20,t=30,b=40),
                                paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)", font=dict(color="#94a3b8"))
                            st.plotly_chart(fig_hist, use_container_width=True)

                            st.markdown(
                                '<div class="section-title" style="font-size:16px"><span class="dot"></span> Detailed Results</div>',
                                unsafe_allow_html=True)
                            result_df = df.copy()
                            result_df["Risk %"] = [f'{p["risk_probability"]*100:.1f}%' for p in preds]
                            result_df["Level"] = [p["uncertainty_level"].replace("_"," ").title() for p in preds]
                            result_df["Risk Score"] = [p["risk_probability"] for p in preds]
                            result_df = result_df.sort_values("Risk Score", ascending=False)
                            st.dataframe(result_df.drop(columns=["Risk Score"], errors="ignore"), use_container_width=True, height=400)

                            csv_out = result_df.to_csv(index=False)
                            b64_csv = base64.b64encode(csv_out.encode()).decode()
                            st.markdown(
                                f'<a href="data:text/csv;base64,{b64_csv}" download="batch_risk_results.csv" '
                                f'style="display:inline-flex;align-items:center;gap:8px;padding:10px 24px;border-radius:10px;'
                                f'background:linear-gradient(135deg,rgba(16,185,129,0.2),rgba(6,182,212,0.2));'
                                f'border:1px solid rgba(16,185,129,0.3);color:#34d399;font-weight:600;font-size:14px;'
                                f'text-decoration:none">📊 Download Results CSV</a>', unsafe_allow_html=True)
            except Exception as exc:
                st.error(f"Error: {exc}")
    else:
        st.warning("Connect to the API to run batch analysis.")


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 5 — Student Comparison
# ═══════════════════════════════════════════════════════════════════════════════
with tab_compare:
    st.markdown(
        '<div class="section-title"><span class="dot"></span> Student Comparison</div>'
        '<div style="color:#94a3b8;font-size:13px;margin-bottom:16px">'
        "Compare two student profiles side-by-side. See how their risk profiles differ "
        "and which features drive the biggest differences.</div>",
        unsafe_allow_html=True)

    if health_ok:
        cmp_a, cmp_spacer, cmp_b = st.columns([1, 0.05, 1])

        def student_form(col, label, prefix, defaults):
            with col:
                st.markdown(
                    f'<div class="glass-card" style="padding:16px">'
                    f'<span style="font-size:14px;font-weight:700;color:{"#3b82f6" if prefix=="a" else "#8b5cf6"}">{label}</span></div>',
                    unsafe_allow_html=True)
                shs = st.slider("Study Hours (total)", 0.0, 120.0, defaults[0], 1.0, key=f"{prefix}_shs")
                shm = st.slider("Study Hours (avg)", 0.0, 12.0, defaults[1], 0.1, key=f"{prefix}_shm")
                cl  = st.slider("Clicks", 0.0, 2500.0, defaults[2], 5.0, key=f"{prefix}_cl")
                res = st.slider("Resources", 0.0, 600.0, defaults[3], 1.0, key=f"{prefix}_res")
                fp  = st.slider("Forum Posts", 0.0, 180.0, defaults[4], 1.0, key=f"{prefix}_fp")
                att = st.slider("Attendance", 0.0, 1.0, defaults[5], 0.01, key=f"{prefix}_att")
                slp = st.slider("Sleep (hrs)", 2.0, 10.0, defaults[6], 0.1, key=f"{prefix}_slp")
                shi = st.slider("Study Habits", 0.0, 100.0, defaults[7], 1.0, key=f"{prefix}_shi")
                csc = st.slider("Consistency", 0.0, 100.0, defaults[8], 1.0, key=f"{prefix}_csc")
                crm = st.slider("Cramming", 0.0, 1.0, defaults[9], 0.01, key=f"{prefix}_crm")
                ag  = st.slider("Age", 14, 30, defaults[10], key=f"{prefix}_age")
                return dict(
                    study_hours_sum=shs, study_hours_mean=shm, clicks_sum=cl, resources_sum=res,
                    forum_posts_sum=fp, attendance_mean=att, sleep_mean=slp,
                    study_habits_index_mean=shi, consistency_score_mean=csc,
                    cramming_indicator_mean=crm, age=ag, internet_access=True, tutoring=False,
                    gender="M", socio_econ="middle", school_type="public", parent_education="secondary")

        vals_a = student_form(cmp_a, "Student A", "a", [42.0, 2.8, 600.0, 140.0, 18.0, 0.82, 6.6, 62.0, 58.0, 0.32, 18])
        vals_b = student_form(cmp_b, "Student B", "b", [25.0, 1.5, 300.0, 60.0, 5.0, 0.55, 5.0, 35.0, 30.0, 0.65, 20])

        if st.button("Compare Students", use_container_width=True):
            with st.spinner("Comparing..."):
                try:
                    pay_a = build_payload(vals_a)
                    pay_b = build_payload(vals_b)
                    cmp_result = post_json(f"{API_BASE}/compare", {"student_a": pay_a, "student_b": pay_b})
                    risk_a = cmp_result["risk_a"]
                    risk_b = cmp_result["risk_b"]
                    diff = cmp_result["risk_diff"]
                    top_diffs = cmp_result["top_differences"]

                    rc1, rc2, rc3 = st.columns(3)
                    col_a = "#10b981" if risk_a < 0.35 else ("#f59e0b" if risk_a < 0.65 else "#ef4444")
                    col_b = "#10b981" if risk_b < 0.35 else ("#f59e0b" if risk_b < 0.65 else "#ef4444")
                    with rc1:
                        st.markdown(
                            f'<div class="metric-card blue"><div class="metric-icon">🅰️</div>'
                            f'<div class="metric-label">Student A Risk</div>'
                            f'<div class="metric-value" style="-webkit-text-fill-color:{col_a}">{risk_a*100:.1f}%</div></div>', unsafe_allow_html=True)
                    with rc2:
                        st.markdown(
                            f'<div class="metric-card purple"><div class="metric-icon">🅱️</div>'
                            f'<div class="metric-label">Student B Risk</div>'
                            f'<div class="metric-value" style="-webkit-text-fill-color:{col_b}">{risk_b*100:.1f}%</div></div>', unsafe_allow_html=True)
                    with rc3:
                        diff_color = "#ef4444" if diff > 0 else "#10b981"
                        st.markdown(
                            f'<div class="metric-card amber"><div class="metric-icon">📊</div>'
                            f'<div class="metric-label">Risk Difference</div>'
                            f'<div class="metric-value" style="-webkit-text-fill-color:{diff_color}">{diff*100:+.1f}%</div></div>', unsafe_allow_html=True)

                    cr1, cr2 = st.columns([1, 1])
                    with cr1:
                        st.markdown(
                            '<div class="section-title" style="font-size:16px"><span class="dot"></span> Profile Overlay</div>',
                            unsafe_allow_html=True)
                        st.plotly_chart(make_comparison_radar(vals_a, vals_b), use_container_width=True)
                    with cr2:
                        st.markdown(
                            '<div class="section-title" style="font-size:16px"><span class="dot"></span> Top SHAP Differences</div>',
                            unsafe_allow_html=True)
                        top_d = top_diffs[:8]
                        top_d.reverse()
                        fig_diff = go.Figure(go.Bar(
                            y=[d["feature"].replace("_"," ").title() for d in top_d],
                            x=[d["shap_diff"] for d in top_d], orientation="h",
                            marker=dict(
                                color=["#ef4444" if d["shap_diff"]>0 else "#10b981" for d in top_d],
                                cornerradius=4),
                            text=[f'{d["shap_diff"]:+.5f}' for d in top_d], textposition="outside",
                            textfont=dict(color="#94a3b8", size=11, family="JetBrains Mono")))
                        fig_diff.add_vline(x=0, line_dash="dash", line_color="rgba(255,255,255,0.15)")
                        fig_diff.update_layout(
                            height=350, margin=dict(l=10,r=80,t=10,b=10),
                            paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
                            xaxis=dict(title="SHAP Diff (B-A)", gridcolor="rgba(255,255,255,0.04)",
                                       tickfont=dict(color="#64748b"), titlefont=dict(color="#94a3b8")),
                            yaxis=dict(tickfont=dict(color="#94a3b8", size=11)), font=dict(color="#94a3b8"))
                        st.plotly_chart(fig_diff, use_container_width=True)
                except Exception as exc:
                    st.error(f"Comparison error: {exc}")
    else:
        st.warning("Connect to the API to compare students.")


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 6 — 3D Risk Explorer
# ═══════════════════════════════════════════════════════════════════════════════
with tab_3d:
    st.markdown(
        '<div class="section-title"><span class="dot"></span> 3D Risk Landscape</div>'
        '<div style="color:#94a3b8;font-size:13px;margin-bottom:16px">'
        "Interactive 3D surface showing how <b>study hours</b> and <b>attendance</b> "
        "jointly affect dropout risk. Rotate, zoom, and hover to explore scenarios. "
        "Your current profile is marked with a diamond.</div>", unsafe_allow_html=True)
    if health_ok:
        gen_3d = st.button("Generate 3D Risk Surface", use_container_width=True)
        if gen_3d:
            with st.spinner("Computing 324 scenarios across the risk landscape..."):
                fig_3d = make_3d_surface(values)
                st.plotly_chart(fig_3d, use_container_width=True)
    else:
        st.warning("Connect to the API to generate the 3D risk landscape.")


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 7 — About
# ═══════════════════════════════════════════════════════════════════════════════
with tab_about:
    a1, a2 = st.columns(2)
    with a1:
        st.markdown(
            '<div class="glass-card">'
            '<div class="section-title" style="margin-top:0"><span class="dot"></span> Model Architecture</div>'
            '<ul style="color:#94a3b8;font-size:14px;line-height:2">'
            "<li><b>Algorithm:</b> LightGBM binary classifier</li>"
            "<li><b>Calibration:</b> Conformal prediction with pre-computed q-hat</li>"
            "<li><b>Explainability:</b> SHAP TreeExplainer for local/global interpretation</li>"
            "<li><b>Features:</b> 25+ engineered behavioural &amp; demographic signals</li>"
            "<li><b>Training data:</b> 400K synthetic student records</li>"
            "</ul></div>", unsafe_allow_html=True)
    with a2:
        st.markdown(
            '<div class="glass-card">'
            '<div class="section-title" style="margin-top:0"><span class="dot"></span> API Endpoints (v2.0)</div>'
            '<ul style="color:#94a3b8;font-size:14px;line-height:2">'
            "<li><b>/predict</b> — Dropout probability</li>"
            "<li><b>/uncertainty</b> — Conformal prediction sets</li>"
            "<li><b>/recommend</b> — Counterfactual recommendations</li>"
            "<li><b>/explain</b> — SHAP feature explanations</li>"
            "<li><b>/simulate</b> — What-if sensitivity analysis</li>"
            "<li><b>/predict/batch</b> — Batch scoring (up to 500)</li>"
            "<li><b>/compare</b> — Side-by-side comparison</li>"
            "<li><b>/feature-importance</b> — Global importance</li>"
            "<li><b>/model-info</b> — Model metadata</li>"
            "</ul></div>", unsafe_allow_html=True)

    st.markdown(
        '<div class="section-title"><span class="dot"></span> Global Feature Importance</div>',
        unsafe_allow_html=True)
    if health_ok:
        try:
            fi_data = get_json(f"{API_BASE}/feature-importance")
            st.plotly_chart(make_feature_importance_chart(fi_data["feature_importance"]), use_container_width=True)
        except Exception:
            st.info("Feature importance will load when the API is available.")
    else:
        st.info("Connect to the API to view feature importance.")

    if health_ok:
        try:
            mi = get_json(f"{API_BASE}/model-info")
            mi1, mi2, mi3, mi4 = st.columns(4)
            with mi1:
                st.markdown(
                    f'<div class="metric-card blue"><div class="metric-icon">🌳</div>'
                    f'<div class="metric-label">Trees</div>'
                    f'<div class="metric-value">{mi["n_estimators"]}</div></div>', unsafe_allow_html=True)
            with mi2:
                st.markdown(
                    f'<div class="metric-card purple"><div class="metric-icon">📊</div>'
                    f'<div class="metric-label">Features</div>'
                    f'<div class="metric-value">{mi["n_features"]}</div></div>', unsafe_allow_html=True)
            with mi3:
                st.markdown(
                    f'<div class="metric-card green"><div class="metric-icon">🎯</div>'
                    f'<div class="metric-label">Conformal q&#770;</div>'
                    f'<div class="metric-value" style="font-size:18px">{mi["conformal_qhat"]:.4f}</div></div>', unsafe_allow_html=True)
            with mi4:
                st.markdown(
                    f'<div class="metric-card amber"><div class="metric-icon">🔌</div>'
                    f'<div class="metric-label">Endpoints</div>'
                    f'<div class="metric-value">{len(mi["endpoints"])}</div></div>', unsafe_allow_html=True)
        except Exception:
            pass

    st.markdown(
        '<div style="text-align:center;color:#334155;font-size:12px;margin-top:32px">'
        "Student Risk Intelligence Center v2.0 &middot; Built with FastAPI + LightGBM + SHAP + Streamlit + Three.js"
        "</div>", unsafe_allow_html=True)
