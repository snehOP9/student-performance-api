"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Sparkles, Target } from "lucide-react";

type Tilt = { x: number; y: number };

type Panel = {
  title: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
};

const PANELS: Panel[] = [
  {
    title: "Predictive Intelligence",
    description:
      "Transforms behavior signals into academic risk forecasts with confidence-aware guidance.",
    icon: <Brain className="h-5 w-5" />,
    badge: "Model Core",
  },
  {
    title: "Uncertainty Optics",
    description:
      "Highlights confidence quality so educators can prioritize high-impact interventions safely.",
    icon: <Sparkles className="h-5 w-5" />,
    badge: "Decision Layer",
  },
  {
    title: "Intervention Engine",
    description:
      "Produces ranked actions and tracks response quality over time for measurable improvement.",
    icon: <Target className="h-5 w-5" />,
    badge: "Outcome Layer",
  },
];

function computeTilt(
  event: React.MouseEvent<HTMLDivElement, MouseEvent>
): Tilt {
  const rect = event.currentTarget.getBoundingClientRect();
  const px = (event.clientX - rect.left) / rect.width;
  const py = (event.clientY - rect.top) / rect.height;

  return {
    x: (0.5 - py) * 8,
    y: (px - 0.5) * 10,
  };
}

function UltraPanel({ panel, index }: { panel: Panel; index: number }) {
  const [tilt, setTilt] = useState<Tilt>({ x: 0, y: 0 });
  const glow = useMemo(
    () =>
      `radial-gradient(500px circle at ${50 + tilt.y * 3}% ${50 - tilt.x * 3}%, rgba(34,211,238,0.18), transparent 40%)`,
    [tilt.x, tilt.y]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      className="h-full"
      style={{ perspective: 1200 }}
    >
      <motion.div
        onMouseMove={(event) => setTilt(computeTilt(event))}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 120, damping: 16, mass: 0.6 }}
        className="group relative h-full overflow-hidden rounded-2xl border border-cyan-300/20 bg-slate-900/65 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
      >
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: glow }}
        />
        <motion.div
          className="pointer-events-none absolute -inset-24 rounded-full bg-cyan-300/10 blur-3xl"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold text-cyan-100">
            {panel.badge}
          </div>

          <div className="mb-3 inline-flex rounded-xl border border-white/10 bg-white/5 p-2 text-cyan-200">
            {panel.icon}
          </div>

          <h3 className="text-lg font-bold text-slate-100">{panel.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{panel.description}</p>

          <div className="mt-5 inline-flex items-center text-sm font-semibold text-cyan-200 transition-transform group-hover:translate-x-1">
            Explore module <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Ultra3DPanels() {
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-100">Antigravity-style Intelligence Layers</h2>
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-300">
          Ultra 3D panels
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {PANELS.map((panel, index) => (
          <UltraPanel key={panel.title} panel={panel} index={index} />
        ))}
      </div>
    </section>
  );
}
