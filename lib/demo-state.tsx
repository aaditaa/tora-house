"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { DEMO_MONTH, surveyQuestions } from "@/lib/demo-data";

/**
 * All demo state. Held in React and mirrored into localStorage so a reload keeps
 * her place, and wiped entirely by Reset. Nothing leaves the browser — there is no
 * backend, no account and nothing real in here.
 */

const KEY = "tora-demo-v1";

/** Which readings the markers screen is allowed to show. */
export type Horizon = "baseline" | "m3" | "m6";

export type DemoState = {
  /** 1–30. The demo clock is pinned to December 2026 and never reads the real date. */
  day: number;
  /** Ticked action ids, keyed by day: { "1": ["breathing", ...] } */
  ticks: Record<string, string[]>;
  /** Her answers by question id. Her guide takes these on the call, not a form. */
  answers: Record<string, unknown>;
  /** How far down the journey she has been taken. */
  journeyStep: number;
  /** Baseline until someone reveals the later columns for a pitch. */
  horizon: Horizon;
};

export const INITIAL_STATE: DemoState = {
  day: 1,
  ticks: {},
  // Already answered, because by the time she opens the app her guide has been
  // through all 26 with her on a call.
  answers: Object.fromEntries(surveyQuestions.map((q) => [q.id, q.prefill])),
  journeyStep: 0,
  horizon: "baseline",
};

type DemoContextValue = {
  state: DemoState;
  /** Ready only after the first client render, so server and client HTML match. */
  hydrated: boolean;
  set: (patch: Partial<DemoState>) => void;
  toggleTick: (day: number, id: string) => void;
  isTicked: (day: number, id: string) => boolean;
  setAnswer: (id: string, value: unknown) => void;
  reset: () => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

function read(): DemoState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as Partial<DemoState>;
    return {
      ...INITIAL_STATE,
      ...parsed,
      day: clampDay(parsed.day ?? INITIAL_STATE.day),
    };
  } catch {
    // A browser refusing storage simply starts the demo from the top every time.
    return INITIAL_STATE;
  }
}

function write(state: DemoState) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Not worth interrupting a walk-through for.
  }
}

export function clampDay(day: number): number {
  if (!Number.isFinite(day)) return 1;
  return Math.min(Math.max(Math.round(day), 1), DEMO_MONTH.days);
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);

  // Read storage after mount, never during render: the server has no localStorage
  // and a mismatch here would be a hydration error on every screen.
  useEffect(() => {
    setState(read());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) write(state);
  }, [state, hydrated]);

  const value = useMemo<DemoContextValue>(
    () => ({
      state,
      hydrated,
      set: (patch) =>
        setState((prev) => ({
          ...prev,
          ...patch,
          ...(patch.day === undefined ? {} : { day: clampDay(patch.day) }),
        })),
      toggleTick: (day, id) =>
        setState((prev) => {
          const key = String(day);
          const current = prev.ticks[key] ?? [];
          const next = current.includes(id)
            ? current.filter((t) => t !== id)
            : [...current, id];
          return { ...prev, ticks: { ...prev.ticks, [key]: next } };
        }),
      isTicked: (day, id) => (state.ticks[String(day)] ?? []).includes(id),
      setAnswer: (id, answer) =>
        setState((prev) => ({
          ...prev,
          answers: { ...prev.answers, [id]: answer },
        })),
      reset: () => {
        try {
          window.localStorage.removeItem(KEY);
        } catch {
          // Nothing to clear.
        }
        setState(INITIAL_STATE);
      },
    }),
    [state, hydrated],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemo must be used inside DemoProvider");
  return context;
}
