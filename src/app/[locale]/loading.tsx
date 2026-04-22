export default function Loading() {
  return (
    <div className="app-loader" role="status" aria-live="polite">
      <div className="app-loader-card">
        <div className="app-loader-mark" aria-hidden="true">
          <div className="app-loader-dot" />
        </div>
        <div className="app-loader-title">Loading…</div>
        <div className="app-loader-sub">
          Preparing your experience. This will only take a moment.
        </div>
      </div>
    </div>
  );
}

