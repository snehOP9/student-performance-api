"use client";

import { motion } from "framer-motion";
import {
  Moon,
  Sun,
  Sparkles,
  Zap,
  Copy,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";
import { initTheme, toggleTheme } from "@/lib/theme";
import { useEffect, useMemo, useState } from "react";
import { fetchOpenAPI, predict, recommend, uncertainty } from "@/lib/api";

type StudentInputSchema = {
  properties: Record<string, any>;
  required?: string[];
};

type Field = {
  name: string;
  title: string;
  type: "number" | "integer";
  required: boolean;
  defaultValue: number;
};

function titleize(s: string) {
  return s
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function prefixGroup(name: string) {
  if (name.startsWith("gender_")) return "Gender";
  if (name.startsWith("socio_econ_")) return "Socio-economic";
  if (name.startsWith("school_type_")) return "School Type";
  if (name.startsWith("parent_education_")) return "Parent Education";
  return null;
}

function isBinary(def: any, fieldName: string) {
  if (fieldName === "internet_access" || fieldName === "tutoring") return true;
  const t = def?.type;
  const dv = def?.default;
  return t === "integer" && (dv === 0 || dv === 1);
}

const EXAMPLE: Record<string, number> = {
  study_hours_sum: 20,
  study_hours_mean: 2,
  clicks_sum: 120,
  resources_sum: 30,
  forum_posts_sum: 2,
  attendance_mean: 0.85,
  sleep_mean: 7.2,
  study_habits_index_mean: 60,
  consistency_score_mean: 55,
  cramming_indicator_mean: 0.2,
  age: 18,
  internet_access: 1,
  tutoring: 0,
  gender_M: 1,
  gender_F: 0,
  gender_Other: 0,
  socio_econ_low: 0,
  socio_econ_middle: 1,
  socio_econ_high: 0,
  school_type_public: 1,
  school_type_private: 0,
  parent_education_none: 0,
  parent_education_primary: 0,
  parent_education_secondary: 0,
  parent_education_bachelor: 1,
  parent_education_master_: 0,
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function niceNumber(v: any) {
  try {
    if (typeof v === "number") return Number.isInteger(v) ? String(v) : v.toFixed(4);
  } catch {}
  return String(v);
}

export default function Page() {
  // ✅ FIX: initTheme inside component
  useEffect(() => {
    initTheme();
  }, []);

  const [dark, setDark] = useState(false);

  const [schemaLoading, setSchemaLoading] = useState(true);
  const [runLoading, setRunLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fields, setFields] = useState<Field[]>([]);
  const [groups, setGroups] = useState<Record<string, { label: string; options: string[] }>>({});
  const [binaryFields, setBinaryFields] = useState<string[]>([]);
  const [form, setForm] = useState<Record<string, number>>({});

  const [risk, setRisk] = useState<any>(null);
  const [unc, setUnc] = useState<any>(null);
  const [recs, setRecs] = useState<any>(null);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // quick read current theme from html class (optional)
    setDark(typeof document !== "undefined" && document.documentElement.classList.contains("dark"));
  }, []);

  // Load schema once
  useEffect(() => {
    (async () => {
      setSchemaLoading(true);
      setError(null);
      try {
        const spec = await fetchOpenAPI();
        const studentInput: StudentInputSchema | undefined = spec?.components?.schemas?.StudentInput;
        if (!studentInput?.properties) throw new Error("StudentInput schema not found in OpenAPI");

        const required = new Set(studentInput.required || []);
        const props = studentInput.properties;

        const parsed: Field[] = Object.entries(props).map(([name, def]) => {
          const type: "number" | "integer" = def?.type === "integer" ? "integer" : "number";
          const dv = typeof def?.default === "number" ? def.default : type === "integer" ? 0 : 0;
          return {
            name,
            title: def?.title || titleize(name),
            type,
            required: required.has(name),
            defaultValue: dv,
          };
        });

        const initial: Record<string, number> = {};
        parsed.forEach((f) => (initial[f.name] = f.defaultValue));

        const g: Record<string, { label: string; options: string[] }> = {};
        const binaries: string[] = [];

        for (const [name, def] of Object.entries(props)) {
          const label = prefixGroup(name);
          if (label) {
            if (!g[label]) g[label] = { label, options: [] };
            g[label].options.push(name);
            initial[name] = Number(def?.default ?? 0) || 0;
          } else if (isBinary(def, name)) {
            binaries.push(name);
            initial[name] = Number(def?.default ?? initial[name] ?? 0) || 0;
          }
        }

        // Normalize one-hot groups: ensure exactly one = 1
        Object.values(g).forEach((grp) => {
          const hasOne = grp.options.some((o) => initial[o] === 1);
          if (!hasOne && grp.options.length) initial[grp.options[0]] = 1;
          let seen = false;
          grp.options.forEach((o) => {
            if (initial[o] === 1 && !seen) seen = true;
            else if (initial[o] === 1 && seen) initial[o] = 0;
          });
        });

        setFields(parsed.filter((f) => !prefixGroup(f.name) && !binaries.includes(f.name)));
        setGroups(g);
        setBinaryFields(binaries);
        setForm(initial);
      } catch (e: any) {
        setError(e?.message || String(e));
      } finally {
        setSchemaLoading(false);
      }
    })();
  }, []);

  const numericFields = useMemo(() => {
    return [...fields].sort((a, b) => a.name.localeCompare(b.name));
  }, [fields]);

  function setRadio(groupLabel: string, chosen: string) {
    const grp = groups[groupLabel];
    if (!grp) return;
    const next = { ...form };
    grp.options.forEach((o) => (next[o] = 0));
    next[chosen] = 1;
    setForm(next);
  }

  function fillExample() {
    const next = { ...form };
    Object.entries(EXAMPLE).forEach(([k, v]) => (next[k] = v));

    Object.entries(groups).forEach(([label, grp]) => {
      const selected = grp.options.find((o) => next[o] === 1) || grp.options[0];
      grp.options.forEach((o) => (next[o] = 0));
      if (selected) next[selected] = 1;
    });

    setForm(next);
  }

  async function runAll() {
    setRunLoading(true);
    setError(null);
    setRisk(null);
    setUnc(null);
    setRecs(null);
    try {
      const [p, u, r] = await Promise.all([predict(form), uncertainty(form), recommend(form)]);
      setRisk(p);
      setUnc(u);
      setRecs(r);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch");
    } finally {
      setRunLoading(false);
    }
  }

  function resetAll() {
    const next: Record<string, number> = {};
    fields.forEach((f) => (next[f.name] = f.defaultValue));
    Object.entries(groups).forEach(([_, grp]) => {
      grp.options.forEach((o, idx) => (next[o] = idx === 0 ? 1 : 0));
    });
    binaryFields.forEach((b) => (next[b] = 0));
    setForm(next);
    setRisk(null);
    setUnc(null);
    setRecs(null);
    setError(null);
  }

  async function copyResults() {
    try {
      const payload = { risk, uncertainty: unc, recommendations: recs };
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  const riskScore = useMemo(() => {
    // best-effort: try to find a number in response
    const candidates: any[] = [];
    if (risk && typeof risk === "object") {
      Object.values(risk).forEach((v) => candidates.push(v));
    }
    const num = candidates.find((v) => typeof v === "number");
    if (typeof num === "number") return clamp(num, 0, 1);
    return null;
  }, [risk]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-purple-400/30 to-cyan-400/30 blur-3xl" />
        <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-gradient-to-tr from-pink-400/25 to-amber-300/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-gradient-to-tr from-emerald-400/20 to-blue-400/20 blur-3xl" />
        <motion.div
          className="absolute inset-0 opacity-[0.06]"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 18, repeat: Infinity, repeatType: "reverse" }}
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.6) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <main className="relative mx-auto max-w-6xl px-5 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold tracking-tight"
            >
              Student Performance Predictor
            </motion.h1>
            <p className="mt-1 text-sm text-gray-600">
              Dynamic UI generated from FastAPI OpenAPI schema. Clean. Fast. Deploy-ready.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold " +
                  (schemaLoading
                    ? "bg-white/60 text-gray-700"
                    : "bg-emerald-50 text-emerald-800 border-emerald-200")
                }
              >
                {schemaLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                {schemaLoading ? "Loading schema…" : "Schema loaded"}
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border bg-white/60 px-3 py-1 text-xs font-semibold text-gray-700">
                <Zap className="h-3.5 w-3.5" />
                One-click run
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border bg-white/60 px-3 py-1 text-xs font-semibold text-gray-700">
                <Sparkles className="h-3.5 w-3.5" />
                Better UX
              </span>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4" />
                  <div className="leading-relaxed">
                    <div className="font-semibold">Error</div>
                    <div className="text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                toggleTheme();
                setDark((d) => !d);
              }}
              className="inline-flex items-center gap-2 rounded-xl border bg-white/70 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur hover:bg-white"
              type="button"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              Theme
            </button>

            <button
              onClick={fillExample}
              disabled={schemaLoading}
              className="inline-flex items-center gap-2 rounded-xl border bg-white/70 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur hover:bg-white disabled:opacity-60"
              type="button"
            >
              <Sparkles className="h-4 w-4" />
              Fill Example
            </button>

            <button
              onClick={resetAll}
              disabled={schemaLoading}
              className="inline-flex items-center gap-2 rounded-xl border bg-white/70 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur hover:bg-white disabled:opacity-60"
              type="button"
            >
              <RefreshCcw className="h-4 w-4" />
              Reset
            </button>

            <button
              onClick={runAll}
              disabled={schemaLoading || runLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 disabled:opacity-60"
              type="button"
            >
              {runLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              {runLoading ? "Running…" : "Run All"}
            </button>
          </div>
        </div>

        {/* Main grid */}
        <section className="mt-7 grid gap-6 md:grid-cols-2">
          {/* Inputs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border bg-white/70 p-5 shadow-sm backdrop-blur"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Inputs</h2>
              <span className="rounded-full border bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                Ready
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Pro tip: Fill Example → Run All.
            </p>

            <div className="mt-6 space-y-7">
              {/* Numeric */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-800">Numeric Features</h3>
                  <span className="text-xs text-gray-500">{numericFields.length} fields</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {numericFields.map((f) => {
                    const value = form[f.name] ?? 0;
                    const isFloat = f.type !== "integer";

                    // quick heuristic slider ranges
                    const range =
                      f.name.includes("mean") || f.name.includes("indicator")
                        ? { min: 0, max: 1, step: 0.01 }
                        : f.name.includes("age")
                        ? { min: 10, max: 60, step: 1 }
                        : f.name.includes("sleep")
                        ? { min: 0, max: 12, step: 0.1 }
                        : { min: 0, max: 300, step: isFloat ? 0.1 : 1 };

                    return (
                      <div key={f.name} className="rounded-xl border bg-white p-3 shadow-sm">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="text-xs font-semibold text-gray-800">{f.title}</div>
                              {f.required && (
                                <span className="rounded-full border px-2 py-0.5 text-[10px] font-semibold text-gray-700">
                                  required
                                </span>
                              )}
                            </div>
                            <div className="mt-1 text-[11px] text-gray-500">{f.name}</div>
                          </div>
                          <div className="text-xs font-semibold text-gray-900">{niceNumber(value)}</div>
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-2">
                          <input
                            className="w-full accent-black"
                            type="range"
                            min={range.min}
                            max={range.max}
                            step={range.step}
                            value={clamp(value, range.min, range.max)}
                            onChange={(e) =>
                              setForm({ ...form, [f.name]: Number(e.target.value) })
                            }
                          />
                          <input
                            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                            type="number"
                            step={f.type === "integer" ? 1 : "any"}
                            value={value}
                            onChange={(e) => setForm({ ...form, [f.name]: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Demographics */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Demographics (choose one)</h3>
                <div className="mt-3 space-y-4">
                  {Object.entries(groups).map(([label, grp]) => {
                    const selected = grp.options.find((o) => form[o] === 1) || grp.options[0];

                    return (
                      <div key={label} className="rounded-xl border bg-white p-4 shadow-sm">
                        <div className="mb-2 text-xs font-semibold text-gray-700">{label}</div>
                        <div className="flex flex-wrap gap-2">
                          {grp.options.map((o) => {
                            const optLabel = titleize(
                              o.replace(/^(gender|socio_econ|school_type|parent_education)_/, "")
                            );
                            const active = selected === o;

                            return (
                              <button
                                key={o}
                                type="button"
                                onClick={() => setRadio(label, o)}
                                className={
                                  "rounded-full px-3 py-1.5 text-xs font-semibold border transition " +
                                  (active
                                    ? "bg-black text-white border-black shadow-sm"
                                    : "bg-white text-gray-800 hover:bg-gray-50")
                                }
                              >
                                {optLabel}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Binary */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Access</h3>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {binaryFields.map((name) => {
                    const v = form[name] ?? 0;
                    return (
                      <div key={name} className="rounded-xl border bg-white p-4 shadow-sm">
                        <div className="text-xs font-semibold text-gray-800">{titleize(name)}</div>
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, [name]: 1 })}
                            className={
                              "flex-1 rounded-xl px-3 py-2 text-xs font-semibold border transition " +
                              (v === 1 ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50")
                            }
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, [name]: 0 })}
                            className={
                              "flex-1 rounded-xl px-3 py-2 text-xs font-semibold border transition " +
                              (v === 0 ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50")
                            }
                          >
                            No
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-2xl border bg-white/70 p-5 shadow-sm backdrop-blur"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Results</h2>

              <button
                onClick={copyResults}
                className="inline-flex items-center gap-2 rounded-xl border bg-white/70 px-3 py-2 text-xs font-semibold hover:bg-white"
                type="button"
              >
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy JSON"}
              </button>
            </div>

            {/* Risk Meter */}
            <div className="mt-4 rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-gray-700">Risk Meter</div>
                <div className="text-xs font-semibold text-gray-900">
                  {riskScore === null ? "—" : `${Math.round(riskScore * 100)}%`}
                </div>
              </div>
              <div className="mt-3 h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: riskScore === null ? "0%" : `${riskScore * 100}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                  className="h-full rounded-full bg-black"
                />
              </div>
              <div className="mt-2 text-[11px] text-gray-500">
                (Auto-detected from response if numeric value exists.)
              </div>
            </div>

            {/* Panels */}
            <div className="mt-4 space-y-4">
              <ResultCard
                title="Risk"
                icon={<Zap className="h-4 w-4" />}
                loading={runLoading}
                data={risk}
              />
              <ResultCard
                title="Uncertainty"
                icon={<Sparkles className="h-4 w-4" />}
                loading={runLoading}
                data={unc}
              />
              <ResultCard
                title="Recommendations"
                icon={<CheckCircle2 className="h-4 w-4" />}
                loading={runLoading}
                data={recs}
              />
            </div>

            <div className="mt-6 text-xs text-gray-500">
              Local dev: backend (8000) + UI (3000). If hosted separately, ensure CORS or use Next proxy.
            </div>
          </motion.div>
        </section>
      </main>

      {/* Toast-ish success */}
      {copied && (
        <div className="fixed bottom-5 right-5 rounded-2xl border bg-white px-4 py-3 text-sm font-semibold shadow-lg">
          ✅ Copied results JSON
        </div>
      )}
    </div>
  );
}

function ResultCard({
  title,
  icon,
  data,
  loading,
}: {
  title: string;
  icon: React.ReactNode;
  data: any;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
        <span className="inline-flex items-center justify-center rounded-lg border bg-white p-1">
          {icon}
        </span>
        {title}
      </div>

      <div className="mt-3">
        {loading ? (
          <div className="space-y-2">
            <div className="h-3 w-5/6 rounded bg-gray-100 animate-pulse" />
            <div className="h-3 w-4/6 rounded bg-gray-100 animate-pulse" />
            <div className="h-3 w-3/6 rounded bg-gray-100 animate-pulse" />
          </div>
        ) : (
          <pre className="text-xs whitespace-pre-wrap text-gray-800">
            {data ? JSON.stringify(data, null, 2) : "—"}
          </pre>
        )}
      </div>
    </div>
  );
}