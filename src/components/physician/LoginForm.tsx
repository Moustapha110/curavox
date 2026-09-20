"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { DEMO_CREDENTIALS, ROUTES } from "@/lib/constants";
import { loginPhysician } from "@/lib/physician-session";

const INPUT_CLASS =
  "h-12 w-full rounded-xl border border-line bg-surface px-4 text-[16px] text-ink placeholder:text-mist/60 outline-none transition-colors focus:border-accent/60 focus:ring-2 focus:ring-accent/25";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  function fillDemo() {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setError(null);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    timerRef.current = window.setTimeout(() => {
      const ok =
        email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
        password === DEMO_CREDENTIALS.password;
      if (ok) {
        loginPhysician();
        router.push(ROUTES.dashboard);
        return;
      }
      setLoading(false);
      setError("Those credentials don't match. Use the demo account below.");
      setShakeKey((k) => k + 1);
    }, 600);
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl border border-line bg-surface p-6 shadow-sm sm:p-8">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
            Physician sign in
          </h1>
          <p className="mt-1 text-sm text-mist">
            Create medication companions for your patients.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-mist"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@clinic.com"
              className={INPUT_CLASS}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-mist"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className={`${INPUT_CLASS} pr-20`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-mist transition-colors hover:text-ink"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                key={shakeKey}
                role="alert"
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: [0, -8, 8, -6, 6, -3, 3, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-500"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <Button type="submit" fullWidth loading={loading} size="lg">
            {loading ? "Signing in" : "Sign in"}
          </Button>

          <button
            type="button"
            onClick={fillDemo}
            className="w-full text-center text-sm font-medium text-accent transition-colors hover:text-ink"
          >
            Use demo credentials
          </button>
        </form>
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-surface-2 px-4 py-3 text-xs leading-relaxed text-mist">
        <p className="font-semibold text-ink">Demo account</p>
        <p>
          <span className="font-mono text-accent">
            {DEMO_CREDENTIALS.email}
          </span>
          {" · "}
          <span className="font-mono text-accent">
            {DEMO_CREDENTIALS.password}
          </span>
        </p>
        <p className="mt-1 text-mist/70">
          Sign-in is a browser-only demo session. No physician data is stored on
          a server.
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
