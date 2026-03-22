"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function getRgbVar(name: string, fallback: [number, number, number]): THREE.Color {
  if (typeof window === "undefined") return new THREE.Color(`rgb(${fallback[0]}, ${fallback[1]}, ${fallback[2]})`);
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!raw) return new THREE.Color(`rgb(${fallback[0]}, ${fallback[1]}, ${fallback[2]})`);
  const parts = raw.split(" ").map((v) => Number(v));
  if (parts.length !== 3 || parts.some((v) => Number.isNaN(v))) {
    return new THREE.Color(`rgb(${fallback[0]}, ${fallback[1]}, ${fallback[2]})`);
  }
  return new THREE.Color(`rgb(${parts[0]}, ${parts[1]}, ${parts[2]})`);
}

export default function Hero3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    const width = mountEl.clientWidth;
    const height = mountEl.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountEl.appendChild(renderer.domElement);

    const fg = getRgbVar("--fg", [10, 10, 10]);
    const bg = getRgbVar("--bg", [255, 255, 255]);

    const ambient = new THREE.AmbientLight(fg, 0.85);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(new THREE.Color("#6366f1"), 1.1);
    key.position.set(2, 3, 4);
    scene.add(key);

    const rim = new THREE.DirectionalLight(new THREE.Color("#22c55e"), 0.45);
    rim.position.set(-3, -1, -2);
    scene.add(rim);

    const group = new THREE.Group();
    scene.add(group);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.05, 1),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#6366f1"),
        metalness: 0.2,
        roughness: 0.35,
        emissive: new THREE.Color("#6366f1"),
        emissiveIntensity: 0.08,
      })
    );
    group.add(core);

    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.3, 1)),
      new THREE.LineBasicMaterial({ color: fg, transparent: true, opacity: 0.23 })
    );
    group.add(wire);

    const torusA = new THREE.Mesh(
      new THREE.TorusGeometry(1.8, 0.03, 16, 160),
      new THREE.MeshBasicMaterial({ color: new THREE.Color("#ec4899"), transparent: true, opacity: 0.45 })
    );
    torusA.rotation.x = Math.PI / 2;
    group.add(torusA);

    const torusB = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.02, 12, 120),
      new THREE.MeshBasicMaterial({ color: new THREE.Color("#22c55e"), transparent: true, opacity: 0.35 })
    );
    torusB.rotation.set(Math.PI / 3, 0, Math.PI / 5);
    group.add(torusB);

    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const r = 5.5 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: bg,
        size: 0.04,
        transparent: true,
        opacity: 0.55,
      })
    );
    scene.add(particles);

    const pointer = new THREE.Vector2(0, 0);
    const targetRotation = new THREE.Vector2(0, 0);

    const onPointerMove = (event: PointerEvent) => {
      const rect = mountEl.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      targetRotation.x = pointer.y * 0.35;
      targetRotation.y = pointer.x * 0.45;
    };

    mountEl.addEventListener("pointermove", onPointerMove);

    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      group.rotation.x += (targetRotation.x - group.rotation.x) * 0.05;
      group.rotation.y += (targetRotation.y + t * 0.06 - group.rotation.y) * 0.05;

      core.rotation.y += 0.004;
      wire.rotation.x -= 0.0025;
      torusA.rotation.z += 0.002;
      torusB.rotation.x -= 0.0015;
      particles.rotation.y = t * 0.015;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
      const nextWidth = mountEl.clientWidth;
      const nextHeight = mountEl.clientHeight;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    };

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      mountEl.removeEventListener("pointermove", onPointerMove);

      particleGeometry.dispose();
      (particles.material as THREE.Material).dispose();
      core.geometry.dispose();
      (core.material as THREE.Material).dispose();
      wire.geometry.dispose();
      (wire.material as THREE.Material).dispose();
      torusA.geometry.dispose();
      (torusA.material as THREE.Material).dispose();
      torusB.geometry.dispose();
      (torusB.material as THREE.Material).dispose();
      renderer.dispose();

      if (mountEl.contains(renderer.domElement)) {
        mountEl.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="glass soft-shadow relative overflow-hidden rounded-2xl border p-2">
      <div className="absolute left-4 top-3 z-10 rounded-full border bg-white/55 px-3 py-1 text-[11px] font-semibold dark:bg-slate-900/65">
        3D Risk Intelligence Scene
      </div>
      <div ref={mountRef} className="h-[260px] w-full rounded-xl" aria-label="3D visualization scene" />
    </div>
  );
}
