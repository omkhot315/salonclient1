import { motion } from 'framer-motion';

/* ── Inline spinner for buttons / small contexts ── */
export function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

/* ── Full-area overlay loader ── */
export function LoadingOverlay({ label = 'Loading…' }: { label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center gap-3 py-10 w-full"
    >
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-yellow-500/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-400 animate-spin" />
        <div className="absolute inset-2 rounded-full bg-yellow-500/10 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
        </div>
      </div>
      <p className="text-xs font-medium text-neutral-400 animate-pulse">{label}</p>
    </motion.div>
  );
}

/* ── Card skeleton placeholder ── */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden animate-pulse ${className}`}>
      <div className="h-28 bg-neutral-800" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-neutral-800 rounded-full w-3/4" />
        <div className="h-2.5 bg-neutral-800 rounded-full w-1/2" />
        <div className="flex justify-between mt-1">
          <div className="h-2.5 bg-neutral-800 rounded-full w-1/3" />
          <div className="h-2.5 bg-neutral-800 rounded-full w-1/4" />
        </div>
      </div>
    </div>
  );
}

/* ── Service-card skeleton (no image, just text) ── */
export function SkeletonServiceCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-neutral-900 border border-neutral-800 p-4 animate-pulse ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-neutral-800 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-neutral-800 rounded-full w-2/3" />
          <div className="h-2.5 bg-neutral-800 rounded-full w-full" />
          <div className="flex gap-3 mt-1">
            <div className="h-2.5 bg-neutral-800 rounded-full w-16" />
            <div className="h-2.5 bg-neutral-800 rounded-full w-12" />
          </div>
        </div>
        <div className="w-6 h-6 rounded-full bg-neutral-800 flex-shrink-0" />
      </div>
    </div>
  );
}

/* ── Admin stat-card skeleton ── */
export function SkeletonStatCard() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 bg-slate-200 rounded-full w-24" />
        <div className="w-9 h-9 rounded-xl bg-slate-200" />
      </div>
      <div className="h-7 bg-slate-200 rounded-full w-20 mb-1" />
      <div className="h-2.5 bg-slate-100 rounded-full w-16" />
    </div>
  );
}

/* ── Admin table-row skeleton ── */
export function SkeletonTableRow({ cols = 6 }: { cols?: number }) {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 bg-slate-200 rounded-full" style={{ width: `${60 + (i % 3) * 15}%` }} />
        </td>
      ))}
    </tr>
  );
}

/* ── Admin full-page spinner ── */
export function AdminLoadingSpinner({ label = 'Loading data…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 w-full">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-500 animate-spin" />
      </div>
      <p className="text-sm text-slate-400 animate-pulse">{label}</p>
    </div>
  );
}
