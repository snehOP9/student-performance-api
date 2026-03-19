"""
Student Risk Intelligence Center — Premium UI
Dark glassmorphism theme · Three.js 3D brain model · CSS animations
Plotly 3D risk landscape · Animated dashboard cards
"""

import json
import math
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
    initial_sidebar_state="collapsed",
)

API_BASE = "http://127.0.0.1:8000"

# ─── Massive CSS injection: dark theme, glassmorphism, animations ──────────────
GLOBAL_CSS = """
<style>
/* ── Import font ──────────────────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');

/* ── Root variables ───────────────────────────────────────────── */
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

/* ── Global resets ────────────────────────────────────────────── */
.stApp, [data-testid="stAppViewContainer"], .main, section[data-testid="stSidebar"] {
    background: var(--bg-primary) !important;
    color: var(--text-primary) !important;
    font-family: 'Inter', sans-serif !important;
}
header[data-testid="stHeader"] {
    background: transparent !important;
}
[data-testid="stSidebar"] {
    background: var(--bg-secondary) !important;
    border-right: 1px solid var(--border-glass) !important;
}

/* ── Hide default branding ────────────────────────────────────── */
#MainMenu, footer, .stDeployButton { display: none !important; }

/* ── Scrollbar ────────────────────────────────────────────────── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-primary); }
::-webkit-scrollbar-thumb { background: var(--border-glass); border-radius: 3px; }

/* ── Animated gradient background ─────────────────────────────── */
.stApp::before {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background:
        radial-gradient(ellipse 80% 60% at 20% 10%, rgba(59,130,246,0.08), transparent),
        radial-gradient(ellipse 60% 50% at 80% 80%, rgba(139,92,246,0.06), transparent),
        radial-gradient(ellipse 50% 40% at 50% 50%, rgba(6,182,212,0.04), transparent);
    pointer-events: none;
    z-index: 0;
    animation: bgShift 20s ease-in-out infinite alternate;
}
@keyframes bgShift {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
}

/* ── Glass card ───────────────────────────────────────────────── */
.glass-card {
    background: var(--bg-glass);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border-glass);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 16px;
    animation: fadeSlideUp 0.6s ease-out both;
}
@keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* ── Metric card ──────────────────────────────────────────────── */
.metric-card {
    background: var(--bg-glass);
    backdrop-filter: blur(16px);
    border: 1px solid var(--border-glass);
    border-radius: 14px;
    padding: 20px 18px;
    text-align: center;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fadeSlideUp 0.6s ease-out both;
    position: relative;
    overflow: hidden;
}
.metric-card:hover {
    transform: translateY(-4px);
    border-color: rgba(59, 130, 246, 0.3);
    box-shadow: var(--glow-blue);
}
.metric-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    border-radius: 14px 14px 0 0;
}
.metric-card.blue::before  { background: linear-gradient(90deg, var(--accent-blue), var(--accent-cyan)); }
.metric-card.purple::before { background: linear-gradient(90deg, var(--accent-purple), var(--accent-blue)); }
.metric-card.green::before  { background: linear-gradient(90deg, var(--accent-green), var(--accent-cyan)); }
.metric-card.amber::before  { background: linear-gradient(90deg, var(--accent-amber), var(--accent-red)); }
.metric-card .metric-icon { font-size: 28px; margin-bottom: 8px; }
.metric-card .metric-label {
    font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 1.2px;
    color: var(--text-muted); margin-bottom: 6px;
}
.metric-card .metric-value {
    font-size: 28px; font-weight: 800;
    font-family: 'JetBrains Mono', monospace;
    background: linear-gradient(135deg, var(--text-primary), var(--accent-cyan));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}

/* ── Risk badge ───────────────────────────────────────────────── */
.risk-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 16px; border-radius: 999px;
    font-size: 13px; font-weight: 600;
    animation: pulseBadge 2s ease-in-out infinite;
}
.risk-badge.low    { background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.3); }
.risk-badge.medium { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3); }
.risk-badge.high   { background: rgba(239,68,68,0.15);  color: #f87171; border: 1px solid rgba(239,68,68,0.3); }
@keyframes pulseBadge {
    0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.2); }
    50% { box-shadow: 0 0 0 6px rgba(59,130,246,0); }
}

/* ── Recommendation card ──────────────────────────────────────── */
.rec-card {
    background: var(--bg-glass);
    border: 1px solid var(--border-glass);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 10px;
    transition: all 0.3s ease;
    animation: fadeSlideUp 0.5s ease-out both;
}
.rec-card:hover {
    border-color: rgba(139, 92, 246, 0.3);
    box-shadow: var(--glow-purple);
    transform: translateX(4px);
}
.rec-bar-track {
    height: 6px; background: rgba(255,255,255,0.06);
    border-radius: 3px; margin-top: 8px; overflow: hidden;
}
.rec-bar-fill {
    height: 100%; border-radius: 3px;
    background: linear-gradient(90deg, var(--accent-cyan), var(--accent-blue));
    animation: barGrow 1.2s cubic-bezier(0.4, 0, 0.2, 1) both;
}
@keyframes barGrow { from { width: 0; } }

/* ── Section title ────────────────────────────────────────────── */
.section-title {
    font-size: 20px; font-weight: 700; margin: 28px 0 14px 0;
    display: flex; align-items: center; gap: 10px;
}
.section-title .dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--accent-blue);
    box-shadow: 0 0 8px var(--accent-blue);
    animation: dotPulse 2s ease-in-out infinite;
}
@keyframes dotPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.5); opacity: 0.6; }
}

/* ── Hero title ───────────────────────────────────────────────── */
.hero-title {
    font-size: 42px; font-weight: 900; line-height: 1.1;
    background: linear-gradient(135deg, #f1f5f9 0%, #3b82f6 40%, #8b5cf6 70%, #06b6d4 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-size: 200% 200%;
    animation: gradientMove 6s ease-in-out infinite;
    margin-bottom: 6px;
}
@keyframes gradientMove {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
.hero-subtitle {
    font-size: 15px; color: var(--text-secondary);
    font-weight: 400; letter-spacing: 0.3px;
    max-width: 520px;
}

/* ── Streamlit form / button overrides ────────────────────────── */
.stForm { border: none !important; padding: 0 !important; }
div.stButton > button, button[kind="primary"],
button[data-testid="stFormSubmitButton"] > button,
.stFormSubmitButton > button {
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple)) !important;
    color: white !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 12px 32px !important;
    font-weight: 700 !important;
    font-size: 15px !important;
    letter-spacing: 0.5px !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3) !important;
}
div.stButton > button:hover, .stFormSubmitButton > button:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5) !important;
}

/* slider overrides */
[data-testid="stSlider"] > div > div > div > div {
    background-color: var(--accent-blue) !important;
}
div[data-baseweb="slider"] > div { background: rgba(255,255,255,0.06) !important; }

/* selectbox / input overrides */
[data-baseweb="select"] > div,
[data-baseweb="input"] > div {
    background: rgba(255,255,255,0.04) !important;
    border-color: var(--border-glass) !important;
    border-radius: 10px !important;
    color: var(--text-primary) !important;
}
.stSelectbox label, .stSlider label, .stTextInput label, .stNumberInput label {
    color: var(--text-secondary) !important;
    font-weight: 500 !important;
    font-size: 13px !important;
}

/* tabs */
.stTabs [data-baseweb="tab-list"] {
    gap: 4px;
    background: var(--bg-glass);
    border-radius: 12px;
    padding: 4px;
    border: 1px solid var(--border-glass);
}
.stTabs [data-baseweb="tab"] {
    border-radius: 10px !important;
    color: var(--text-secondary) !important;
    font-weight: 600 !important;
    padding: 8px 20px !important;
}
.stTabs [aria-selected="true"] {
    background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2)) !important;
    color: var(--text-primary) !important;
    border-bottom: none !important;
}
.stTabs [data-baseweb="tab-highlight"] { display: none; }
.stTabs [data-baseweb="tab-border"] { display: none; }

/* toggle overrides */
[data-testid="stToggle"] label span { color: var(--text-secondary) !important; }

/* expander */
[data-testid="stExpander"] {
    background: var(--bg-glass) !important;
    border: 1px solid var(--border-glass) !important;
    border-radius: 12px !important;
}

/* plotly chart container */
.stPlotlyChart { border-radius: 16px; overflow: hidden; }

/* spinner */
.stSpinner > div { border-color: var(--accent-blue) transparent transparent !important; }

</style>
"""
st.markdown(GLOBAL_CSS, unsafe_allow_html=True)


# ─── Three.js 3D Hero component ───────────────────────────────────────────────
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
renderer.setSize(W, H);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// === Neural network brain sphere ===
const nodes = [];
const nodeGeo = new THREE.SphereGeometry(0.04, 12, 12);

// Create nodes on a sphere surface
const COUNT = 120;
for(let i=0; i<COUNT; i++){
    const phi = Math.acos(-1 + (2*i)/COUNT);
    const theta = Math.sqrt(COUNT*Math.PI)*phi;
    const r = 1.8;
    const x = r*Math.cos(theta)*Math.sin(phi);
    const y = r*Math.sin(theta)*Math.sin(phi);
    const z = r*Math.cos(phi);

    const hue = 0.55 + 0.15*Math.random();
    const mat = new THREE.MeshBasicMaterial({color: new THREE.Color().setHSL(hue, 0.8, 0.6)});
    const mesh = new THREE.Mesh(nodeGeo, mat);
    mesh.position.set(x, y, z);
    mesh.userData = {baseX:x, baseY:y, baseZ:z, phase: Math.random()*Math.PI*2};
    scene.add(mesh);
    nodes.push(mesh);
}

// === Edges (connections) ===
const lineMat = new THREE.LineBasicMaterial({color:0x3b82f6, transparent:true, opacity:0.12});
for(let i=0; i<nodes.length; i++){
    for(let j=i+1; j<nodes.length; j++){
        const d = nodes[i].position.distanceTo(nodes[j].position);
        if(d < 1.0){
            const geo = new THREE.BufferGeometry().setFromPoints([nodes[i].position.clone(), nodes[j].position.clone()]);
            scene.add(new THREE.Line(geo, lineMat));
        }
    }
}

// === Outer ring ===
const ringGeo = new THREE.TorusGeometry(2.3, 0.015, 8, 120);
const ringMat = new THREE.MeshBasicMaterial({color:0x8b5cf6, transparent:true, opacity:0.3});
const ring1 = new THREE.Mesh(ringGeo, ringMat);
ring1.rotation.x = Math.PI/2;
scene.add(ring1);

const ring2 = new THREE.Mesh(ringGeo.clone(), new THREE.MeshBasicMaterial({color:0x06b6d4, transparent:true, opacity:0.2}));
ring2.rotation.x = Math.PI/3;
ring2.rotation.z = Math.PI/4;
scene.add(ring2);

// === Floating particles ===
const pCount = 200;
const pGeo = new THREE.BufferGeometry();
const pPos = new Float32Array(pCount*3);
for(let i=0;i<pCount*3;i++) pPos[i]=(Math.random()-0.5)*12;
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos,3));
const pMat = new THREE.PointsMaterial({color:0x3b82f6, size:0.02, transparent:true, opacity:0.4});
scene.add(new THREE.Points(pGeo, pMat));

// === Animation loop ===
let t = 0;
function animate(){
    requestAnimationFrame(animate);
    t += 0.008;

    // rotate the whole brain
    nodes.forEach(n => {
        const d = n.userData;
        const pulse = 1 + 0.05*Math.sin(t*2 + d.phase);
        n.position.set(d.baseX*pulse, d.baseY*pulse, d.baseZ*pulse);
    });

    ring1.rotation.z = t*0.3;
    ring2.rotation.z = -t*0.2;
    ring2.rotation.y = t*0.15;

    // camera orbit
    camera.position.x = Math.sin(t*0.4)*1.5;
    camera.position.y = Math.cos(t*0.3)*0.8;
    camera.lookAt(0,0,0);

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', ()=>{
    const w=container.clientWidth, h=container.clientHeight;
    renderer.setSize(w,h);
    camera.aspect=w/h;
    camera.updateProjectionMatrix();
});
})();
</script>
"""


# ─── Animated Ring Gauge (SVG + CSS) ──────────────────────────────────────────
def svg_ring_gauge(probability: float) -> str:
    pct = probability * 100
    if pct < 35:
        color, glow, label = "#10b981", "rgba(16,185,129, 0.4)", "LOW RISK"
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
        <defs>
          <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="{color}"/>
            <stop offset="100%" stop-color="#3b82f6"/>
          </linearGradient>
        </defs>
        <circle cx="110" cy="110" r="80" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="12"/>
        <circle cx="110" cy="110" r="80" fill="none" stroke="url(#rg)" stroke-width="12"
          stroke-linecap="round"
          stroke-dasharray="{dash:.1f} {gap:.1f}"
          transform="rotate(-90 110 110)"
          style="animation:ringDraw 1.5s cubic-bezier(0.4,0,0.2,1) both;"/>
        <text x="110" y="100" text-anchor="middle" fill="{color}"
          style="font-family:'JetBrains Mono',monospace;font-size:36px;font-weight:900;">
          {pct:.1f}%
        </text>
        <text x="110" y="125" text-anchor="middle" fill="#64748b"
          style="font-size:11px;letter-spacing:2px;font-weight:600;">
          {label}
        </text>
      </svg>
    </div>
    <style>
      @keyframes ringDraw {{
        from {{ stroke-dasharray: 0 {circumference:.1f}; }}
      }}
    </style>
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


def make_gauge_plotly(prob: float) -> go.Figure:
    if prob < 0.35:
        color = "#10b981"
    elif prob < 0.65:
        color = "#f59e0b"
    else:
        color = "#ef4444"

    fig = go.Figure(go.Indicator(
        mode="gauge+number",
        value=prob * 100,
        number={"suffix": "%", "font": {"size": 44, "family": "JetBrains Mono", "color": color}},
        title={"text": "Dropout Risk Score", "font": {"size": 16, "color": "#94a3b8"}},
        gauge={
            "axis": {"range": [0, 100], "tickcolor": "#334155", "tickwidth": 1},
            "bar": {"color": color, "thickness": 0.3},
            "bgcolor": "rgba(0,0,0,0)",
            "borderwidth": 0,
            "steps": [
                {"range": [0, 35], "color": "rgba(16,185,129,0.08)"},
                {"range": [35, 65], "color": "rgba(245,158,11,0.08)"},
                {"range": [65, 100], "color": "rgba(239,68,68,0.08)"},
            ],
            "threshold": {"line": {"color": "#f1f5f9", "width": 2}, "value": prob * 100},
        },
    ))
    fig.update_layout(
        height=280,
        margin=dict(l=20, r=20, t=50, b=10),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font={"color": "#94a3b8"},
    )
    return fig


def make_radar(v: dict) -> go.Figure:
    categories = ["Study Hours", "Attendance", "Sleep", "Study Habits", "Consistency", "Resources"]
    raw = [
        min(v["study_hours_sum"] / 120, 1),
        v["attendance_mean"],
        min(v["sleep_mean"] / 10, 1),
        min(v["study_habits_index_mean"] / 100, 1),
        min(v["consistency_score_mean"] / 100, 1),
        min(v["resources_sum"] / 600, 1),
    ]
    fig = go.Figure()
    fig.add_trace(go.Scatterpolar(
        r=raw + [raw[0]], theta=categories + [categories[0]],
        fill="toself",
        fillcolor="rgba(59,130,246,0.12)",
        line=dict(color="#3b82f6", width=2),
        marker=dict(size=6, color="#06b6d4"),
        name="Student",
    ))
    fig.update_layout(
        polar=dict(
            bgcolor="rgba(0,0,0,0)",
            radialaxis=dict(visible=True, range=[0, 1], showticklabels=False, gridcolor="rgba(255,255,255,0.05)"),
            angularaxis=dict(gridcolor="rgba(255,255,255,0.05)", tickfont=dict(color="#94a3b8", size=11)),
        ),
        showlegend=False,
        height=320,
        margin=dict(l=50, r=50, t=30, b=30),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
    )
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
    y = (base_values["attendance_mean"] + attend_delta) * 100  # show as %

    fig = go.Figure(data=[go.Surface(
        x=x, y=y, z=z,
        colorscale=[
            [0.0, "#10b981"], [0.35, "#06b6d4"],
            [0.5, "#3b82f6"], [0.65, "#8b5cf6"],
            [0.85, "#f59e0b"], [1.0, "#ef4444"],
        ],
        colorbar=dict(
            title=dict(text="Risk", font=dict(color="#94a3b8")),
            tickfont=dict(color="#94a3b8"),
            bgcolor="rgba(0,0,0,0)",
        ),
        contours=dict(z=dict(show=True, usecolormap=True, highlightcolor="white", project_z=True)),
        lighting=dict(ambient=0.6, diffuse=0.8, specular=0.3, roughness=0.5),
    )])

    # mark current student position
    curr_x = base_values["study_hours_sum"]
    curr_y = base_values["attendance_mean"] * 100
    try:
        curr_z = float(post_json(f"{API_BASE}/predict", build_payload(base_values))["risk_probability"])
    except Exception:
        curr_z = 0.5

    fig.add_trace(go.Scatter3d(
        x=[curr_x], y=[curr_y], z=[curr_z],
        mode="markers+text",
        marker=dict(size=8, color="#f1f5f9", symbol="diamond",
                    line=dict(color="#3b82f6", width=2)),
        text=["YOU"], textposition="top center",
        textfont=dict(color="#f1f5f9", size=12, family="Inter"),
        name="Current",
    ))

    fig.update_layout(
        scene=dict(
            xaxis=dict(title="Study Hours", backgroundcolor="rgba(0,0,0,0)", gridcolor="rgba(255,255,255,0.05)",
                       showbackground=True, zerolinecolor="rgba(255,255,255,0.08)", titlefont=dict(color="#94a3b8"),
                       tickfont=dict(color="#64748b")),
            yaxis=dict(title="Attendance %", backgroundcolor="rgba(0,0,0,0)", gridcolor="rgba(255,255,255,0.05)",
                       showbackground=True, zerolinecolor="rgba(255,255,255,0.08)", titlefont=dict(color="#94a3b8"),
                       tickfont=dict(color="#64748b")),
            zaxis=dict(title="Risk", backgroundcolor="rgba(0,0,0,0)", gridcolor="rgba(255,255,255,0.05)",
                       showbackground=True, zerolinecolor="rgba(255,255,255,0.08)", titlefont=dict(color="#94a3b8"),
                       tickfont=dict(color="#64748b")),
            bgcolor="rgba(0,0,0,0)",
        ),
        height=560,
        margin=dict(l=0, r=0, t=10, b=0),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(color="#94a3b8"),
        legend=dict(font=dict(color="#94a3b8")),
    )
    return fig


def make_waterfall(recs: list) -> go.Figure:
    if not recs:
        return None
    labels = [f"{r['feature'].replace('_', ' ').title()}\n({r['change']})" for r in recs]
    reductions = [r["risk_reduction"] * 100 for r in recs]

    fig = go.Figure(go.Bar(
        x=reductions, y=labels, orientation="h",
        marker=dict(
            color=reductions,
            colorscale=[[0, "#06b6d4"], [1, "#10b981"]],
            line=dict(width=0),
            cornerradius=6,
        ),
        text=[f"-{v:.1f}%" for v in reductions],
        textposition="outside",
        textfont=dict(color="#94a3b8", size=12, family="JetBrains Mono"),
    ))
    fig.update_layout(
        height=max(200, len(recs) * 70),
        margin=dict(l=10, r=60, t=10, b=10),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        xaxis=dict(title="Risk Reduction %", gridcolor="rgba(255,255,255,0.04)",
                   zerolinecolor="rgba(255,255,255,0.06)", tickfont=dict(color="#64748b"),
                   titlefont=dict(color="#94a3b8")),
        yaxis=dict(tickfont=dict(color="#94a3b8", size=11), autorange="reversed"),
        font=dict(color="#94a3b8"),
    )
    return fig


# ═══════════════════════════════════════════════════════════════════════════════
# LAYOUT
# ═══════════════════════════════════════════════════════════════════════════════

# ── API health ────────────────────────────────────────────────────────────────
health_ok = False
try:
    health_ok = get_json(f"{API_BASE}/").get("status") == "ok"
except Exception:
    pass

# ── Hero section ──────────────────────────────────────────────────────────────
hero_left, hero_right = st.columns([1, 1.2])

with hero_left:
    st.markdown('<div style="padding-top:40px">', unsafe_allow_html=True)
    st.markdown('<div class="hero-title">Student Risk<br>Intelligence Center</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="hero-subtitle">'
        "AI-powered dropout risk analysis with conformal uncertainty, "
        "counterfactual recommendations, and interactive 3D scenario simulation."
        "</div>",
        unsafe_allow_html=True,
    )

    if health_ok:
        st.markdown(
            '<div style="margin-top:18px">'
            '<span style="display:inline-flex;align-items:center;gap:6px;padding:5px 14px;'
            'border-radius:999px;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.3);'
            'color:#34d399;font-size:12px;font-weight:600;">'
            '<span style="width:7px;height:7px;border-radius:50%;background:#10b981;'
            'animation:dotPulse 1.5s infinite;"></span>'
            "API Connected</span></div>",
            unsafe_allow_html=True,
        )
    else:
        st.markdown(
            '<div style="margin-top:18px">'
            '<span style="display:inline-flex;align-items:center;gap:6px;padding:5px 14px;'
            'border-radius:999px;background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);'
            'color:#f87171;font-size:12px;font-weight:600;">'
            "API Offline — start FastAPI first</span></div>",
            unsafe_allow_html=True,
        )
    st.markdown("</div>", unsafe_allow_html=True)

with hero_right:
    components.html(THREE_JS_HERO, height=395)

st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)

# ── Tab navigation ────────────────────────────────────────────────────────────
tab_analyze, tab_3d, tab_about = st.tabs(["  Analyze Student  ", "  3D Risk Explorer  ", "  About Model  "])

# ═══════════════════════════════════════════════════════════════════════════════
# TAB 1 — Analyze
# ═══════════════════════════════════════════════════════════════════════════════
with tab_analyze:
    col_form, col_spacer, col_results = st.columns([1.15, 0.05, 1])

    with col_form:
        st.markdown(
            '<div class="section-title"><span class="dot"></span> Student Profile</div>',
            unsafe_allow_html=True,
        )

        with st.form("student_form", border=False):
            # ── Row 1: Academic behaviour ──
            st.markdown(
                '<div class="glass-card"><span style="font-size:13px;font-weight:600;'
                'color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">'
                "Academic & Engagement</span></div>",
                unsafe_allow_html=True,
            )
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

            # ── Row 2: Lifestyle ──
            st.markdown(
                '<div class="glass-card" style="animation-delay:0.1s">'
                '<span style="font-size:13px;font-weight:600;color:#94a3b8;'
                'text-transform:uppercase;letter-spacing:1px;">'
                "Lifestyle & Habits</span></div>",
                unsafe_allow_html=True,
            )
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

            # ── Row 3: Demographics ──
            st.markdown(
                '<div class="glass-card" style="animation-delay:0.2s">'
                '<span style="font-size:13px;font-weight:600;color:#94a3b8;'
                'text-transform:uppercase;letter-spacing:1px;">'
                "Demographics</span></div>",
                unsafe_allow_html=True,
            )
            d1, d2, d3, d4 = st.columns(4)
            with d1:
                gender = st.selectbox("Gender", ["F", "M", "Other"])
            with d2:
                socio_econ = st.selectbox("Socio-Economic", ["low", "middle", "high"], index=1)
            with d3:
                school_type = st.selectbox("School Type", ["public", "private"])
            with d4:
                parent_education = st.selectbox("Parent Education",
                                                ["none", "primary", "secondary", "bachelor", "master_"], index=2)

            st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)
            run = st.form_submit_button("Analyze Student", use_container_width=True)

    # ── Collect values ────────────────────────────────────────────────────────
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

    # ── Results column ────────────────────────────────────────────────────────
    with col_results:
        st.markdown(
            '<div class="section-title"><span class="dot"></span> Intelligence Report</div>',
            unsafe_allow_html=True,
        )

        if run and health_ok:
            payload = build_payload(values)
            try:
                pred = post_json(f"{API_BASE}/predict", payload)
                unc = post_json(f"{API_BASE}/uncertainty", payload)
                rec = post_json(f"{API_BASE}/recommend", payload)
                risk_p = float(pred["risk_probability"])
                unc_level = unc.get("uncertainty_level", "N/A")
                pred_set = unc.get("prediction_set", "N/A")
                recs = rec.get("recommendations", [])
                baseline = rec.get("baseline_risk", risk_p)

                # ── SVG Ring Gauge ──
                st.markdown(svg_ring_gauge(risk_p), unsafe_allow_html=True)

                # Metric cards row
                if risk_p < 0.35:
                    badge_cls, badge_txt = "low", "Low Risk"
                elif risk_p < 0.65:
                    badge_cls, badge_txt = "medium", "Medium Risk"
                else:
                    badge_cls, badge_txt = "high", "High Risk"

                m1, m2, m3 = st.columns(3)
                with m1:
                    st.markdown(
                        f'<div class="metric-card blue" style="animation-delay:0.15s">'
                        f'<div class="metric-icon">🎲</div>'
                        f'<div class="metric-label">Prediction Set</div>'
                        f'<div class="metric-value">{pred_set}</div></div>',
                        unsafe_allow_html=True,
                    )
                with m2:
                    st.markdown(
                        f'<div class="metric-card purple" style="animation-delay:0.25s">'
                        f'<div class="metric-icon">🔬</div>'
                        f'<div class="metric-label">Uncertainty</div>'
                        f'<div class="metric-value" style="font-size:14px">{unc_level.replace("_", " ").title()}</div></div>',
                        unsafe_allow_html=True,
                    )
                with m3:
                    st.markdown(
                        f'<div class="metric-card {"green" if risk_p < 0.5 else "amber"}" style="animation-delay:0.35s">'
                        f'<div class="metric-icon">📊</div>'
                        f'<div class="metric-label">Baseline Risk</div>'
                        f'<div class="metric-value">{baseline * 100:.1f}%</div></div>',
                        unsafe_allow_html=True,
                    )

                # ── Radar ──
                st.markdown(
                    '<div class="section-title" style="font-size:16px;margin-top:20px">'
                    '<span class="dot"></span> Student Profile Radar</div>',
                    unsafe_allow_html=True,
                )
                st.plotly_chart(make_radar(values), use_container_width=True)

                # ── Recommendations ──
                st.markdown(
                    '<div class="section-title" style="font-size:16px">'
                    '<span class="dot"></span> AI Recommendations</div>',
                    unsafe_allow_html=True,
                )
                if recs:
                    wf = make_waterfall(recs)
                    if wf:
                        st.plotly_chart(wf, use_container_width=True)

                    for idx, r in enumerate(recs):
                        feat_nice = r["feature"].replace("_", " ").title()
                        st.markdown(
                            f'<div class="rec-card" style="animation-delay:{0.1 * idx:.1f}s">'
                            f'<div style="display:flex;justify-content:space-between;align-items:center">'
                            f'<span style="font-weight:600;color:#f1f5f9">{feat_nice}</span>'
                            f'<span style="font-family:JetBrains Mono;color:#10b981;font-weight:700">'
                            f'↓ {r["risk_reduction"] * 100:.1f}%</span></div>'
                            f'<div style="font-size:12px;color:#64748b;margin-top:4px">'
                            f'Change: {r["change"]}  ·  '
                            f'{r["risk_before"] * 100:.1f}% → {r["risk_after"] * 100:.1f}%</div>'
                            f'<div class="rec-bar-track">'
                            f'<div class="rec-bar-fill" style="width:{min(r["risk_reduction"] * 500, 100):.0f}%"></div>'
                            f"</div></div>",
                            unsafe_allow_html=True,
                        )
                else:
                    st.info("Profile is already low-risk. No further improvements suggested.")

            except error.HTTPError as exc:
                st.error(f"API error: HTTP {exc.code}")
            except Exception as exc:
                st.error(f"Error: {exc}")

        elif run and not health_ok:
            st.warning("Start the FastAPI server first: `uvicorn api.main:app --reload`")
        else:
            # placeholder
            st.markdown(
                '<div class="glass-card" style="text-align:center;padding:60px 24px;">'
                '<div style="font-size:48px;margin-bottom:16px;animation:dotPulse 2s infinite">🧠</div>'
                '<div style="font-size:18px;font-weight:600;color:#f1f5f9;margin-bottom:8px">'
                "Awaiting Analysis</div>"
                '<div style="font-size:13px;color:#64748b;max-width:320px;margin:0 auto">'
                "Fill in the student profile and press <b>Analyze Student</b> to generate "
                "risk predictions, uncertainty estimates, and AI recommendations."
                "</div></div>",
                unsafe_allow_html=True,
            )


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 2 — 3D Risk Explorer
# ═══════════════════════════════════════════════════════════════════════════════
with tab_3d:
    st.markdown(
        '<div class="section-title"><span class="dot"></span> 3D Risk Landscape</div>'
        '<div style="color:#94a3b8;font-size:13px;margin-bottom:16px">'
        "Interactive 3D surface showing how <b>study hours</b> and <b>attendance</b> "
        "jointly affect dropout risk. Rotate, zoom, and hover to explore scenarios. "
        "Your current profile is marked with a diamond.</div>",
        unsafe_allow_html=True,
    )

    if health_ok:
        gen_3d = st.button("Generate 3D Risk Surface", use_container_width=True)
        if gen_3d:
            with st.spinner("Computing 324 scenarios across the risk landscape..."):
                fig_3d = make_3d_surface(values)
                st.plotly_chart(fig_3d, use_container_width=True)
    else:
        st.warning("Connect to the API to generate the 3D risk landscape.")


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 3 — About
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
            "<li><b>Features:</b> 25+ engineered behavioural &amp; demographic signals</li>"
            "<li><b>Training data:</b> 400K synthetic student records</li>"
            "<li><b>Endpoints:</b> /predict · /uncertainty · /recommend</li>"
            "</ul></div>",
            unsafe_allow_html=True,
        )
    with a2:
        st.markdown(
            '<div class="glass-card">'
            '<div class="section-title" style="margin-top:0"><span class="dot"></span> How It Works</div>'
            '<ol style="color:#94a3b8;font-size:14px;line-height:2">'
            "<li><b>Predict:</b> Model outputs dropout probability (0–1)</li>"
            "<li><b>Uncertainty:</b> Conformal sets quantify whether the prediction is "
            "confident or needs more data</li>"
            "<li><b>Recommend:</b> Counterfactual analysis finds which small behavioural "
            "changes most reduce risk</li>"
            "<li><b>3D Explorer:</b> Visualize how two key levers (study hours &amp; attendance) "
            "reshape the risk surface</li>"
            "</ol></div>",
            unsafe_allow_html=True,
        )

    st.markdown(
        '<div style="text-align:center;color:#334155;font-size:12px;margin-top:32px">'
        "Student Risk Intelligence Center · Built with FastAPI + LightGBM + Streamlit + Three.js"
        "</div>",
        unsafe_allow_html=True,
    )
