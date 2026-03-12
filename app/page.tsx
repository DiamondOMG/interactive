'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Mock login logic
    setTimeout(() => {
      if (username === "admin" && password === "1234") {
        router.push("/dashboard");
      } else {
        setError("Invalid username or password");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#fdfaff] font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* Dynamic Background Elements */}
      <div className="absolute -left-24 -top-24 h-[500px] w-[500px] rounded-full bg-purple-200/40 blur-[100px] animate-pulse"></div>
      <div className="absolute -right-24 -bottom-24 h-[500px] w-[500px] rounded-full bg-indigo-200/40 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-white/30 blur-[120px]"></div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6 backdrop-blur-[2px]">
        <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
          {/* Logo & Header */}
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full scale-150"></div>
              <div className="relative flex h-20 w-20 items-center justify-center rounded-[24px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-white/80">
                <div className="h-14 w-14 rounded-[18px] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30 transition-transform hover:scale-105 duration-500">
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              Welcome Back
            </h1>
            <p className="max-w-[280px] text-slate-400 font-medium leading-relaxed opacity-80">
              Access the interactive content management system
            </p>
          </div>

          {/* Login Card with Glassmorphism */}
          <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/70 p-10 shadow-[0_20px_50px_rgba(148,163,184,0.15)] backdrop-blur-2xl transition-all">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2.5">
                <label
                  htmlFor="username"
                  className="ml-1 block text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400"
                >
                  Username
                </label>
                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-purple-500 transition-colors">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-200/50 bg-white/50 py-4 pl-12 pr-4 text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:border-purple-500/50 focus:bg-white focus:ring-4 focus:ring-purple-500/5 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label
                  htmlFor="password"
                  className="ml-1 block text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400"
                >
                  Password
                </label>
                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-purple-500 transition-colors">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-200/50 bg-white/50 py-4 pl-12 pr-4 text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:border-purple-500/50 focus:bg-white focus:ring-4 focus:ring-purple-500/5 transition-all outline-none"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-2xl bg-red-50/80 p-4 text-xs font-bold text-red-500 border border-red-100/50 animate-in fade-in slide-in-from-top-2 duration-300">
                  <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 py-4.5 text-[15px] font-bold text-white shadow-xl shadow-purple-500/20 transition-all hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 h-[56px]"
              >
                {isLoading ? (
                  <svg className="h-6 w-6 animate-spin text-white/50" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <>
                    Sign In
                    <div className="flex items-center transition-transform group-hover:translate-x-1.5 duration-300">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </>
                )}
              </button>
            </form>
          </div>

          <footer className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 border border-white/60 shadow-sm backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">
                System Status: Operational
              </p>
            </div>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">
              © 2026 OMG INTERACTIVE
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
