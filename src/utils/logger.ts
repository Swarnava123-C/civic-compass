type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: Record<string, unknown>;
}

function createEntry(level: LogLevel, message: string, data?: Record<string, unknown>): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    data,
  };
}

function emit(entry: LogEntry): void {
  if (import.meta.env.PROD) return; // silent in production; swap for external sink
  const fn = entry.level === "error" ? console.error : entry.level === "warn" ? console.warn : console.log; // eslint-disable-line no-console
  fn(JSON.stringify(entry));
}

export const logger = {
  /**
   * Logs an informational message.
   * @param {string} msg - The message to log.
   * @param {Record<string, unknown>} [data] - Optional metadata to include.
   */
  info: (msg: string, data?: Record<string, unknown>) => emit(createEntry("info", msg, data)),

  /**
   * Logs a warning message.
   * @param {string} msg - The warning message.
   * @param {Record<string, unknown>} [data] - Optional metadata to include.
   */
  warn: (msg: string, data?: Record<string, unknown>) => emit(createEntry("warn", msg, data)),

  /**
   * Logs an error message.
   * @param {string} msg - The error message.
   * @param {Record<string, unknown>} [data] - Optional metadata to include.
   */
  error: (msg: string, data?: Record<string, unknown>) => emit(createEntry("error", msg, data)),

  /**
   * Logs a debug message (only emitted in development).
   * @param {string} msg - The debug message.
   * @param {Record<string, unknown>} [data] - Optional metadata to include.
   */
  debug: (msg: string, data?: Record<string, unknown>) => emit(createEntry("debug", msg, data)),
};
