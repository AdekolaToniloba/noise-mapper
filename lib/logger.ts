// lib/logger.ts - Centralized logging system
interface LogMetadata {
  userId?: string;
  ip?: string;
  userAgent?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  responseTime?: number;
  error?: string;
  [key: string]: unknown;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error";
  message: string;
  meta?: LogMetadata;
}

// In-memory log store (consider using Redis in production)
let logs: LogEntry[] = [];
const MAX_LOGS = 1000;

export function addLog(
  level: "info" | "warn" | "error",
  message: string,
  meta?: LogMetadata
): void {
  const logEntry: LogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    level,
    message,
    meta,
  };

  logs.unshift(logEntry);

  // Keep only the last MAX_LOGS entries
  if (logs.length > MAX_LOGS) {
    logs = logs.slice(0, MAX_LOGS);
  }

  // Also log to console for Vercel logs
  const logMessage = `[${level.toUpperCase()}] ${message}`;
  if (level === "error") {
    console.error(logMessage, meta);
  } else if (level === "warn") {
    console.warn(logMessage, meta);
  } else {
    console.log(logMessage, meta);
  }
}

export function getLogs(
  level?: "info" | "warn" | "error",
  limit = 50
): LogEntry[] {
  let filteredLogs = logs;

  if (level) {
    filteredLogs = logs.filter((log) => log.level === level);
  }

  return filteredLogs.slice(0, limit);
}

export function getLogsCount(): {
  total: number;
  error: number;
  warn: number;
  info: number;
} {
  return {
    total: logs.length,
    error: logs.filter((log) => log.level === "error").length,
    warn: logs.filter((log) => log.level === "warn").length,
    info: logs.filter((log) => log.level === "info").length,
  };
}
