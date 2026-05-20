/**
 * Next.js instrumentation hook.
 * Runs once per server boot. Wire up Sentry, OpenTelemetry, or
 * other monitoring providers here.
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // e.g. await import('./sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    // e.g. await import('./sentry.edge.config');
  }
}
