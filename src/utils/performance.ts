const isDev = import.meta.env.DEV;

export function trackApiLatency(label: string, startTime: number): void {
  if (!isDev) return;
  const duration = performance.now() - startTime;
  // eslint-disable-next-line no-console
  console.log(`[perf] ${label}: ${duration.toFixed(1)}ms`);
}

export function trackRenderTime(componentName: string): () => void {
  if (!isDev) return () => { /* no-op */ };
  const start = performance.now();
  return () => {
    const duration = performance.now() - start;
    // eslint-disable-next-line no-console
    console.log(`[perf] render ${componentName}: ${duration.toFixed(1)}ms`);
  };
}

export function measureInteraction(label: string, fn: () => void): void {
  if (!isDev) {
    fn();
    return;
  }
  const start = performance.now();
  fn();
  const duration = performance.now() - start;
  // eslint-disable-next-line no-console
  console.log(`[perf] interaction ${label}: ${duration.toFixed(1)}ms`);
}
