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
  info: (msg: string, data?: Record<string, unknown>) => emit(createEntry("info", msg, data)),
  warn: (msg: string, data?: Record<string, unknown>) => emit(createEntry("warn", msg, data)),
  error: (msg: string, data?: Record<string, unknown>) => emit(createEntry("error", msg, data)),
  debug: (msg: string, data?: Record<string, unknown>) => emit(createEntry("debug", msg, data)),
};
