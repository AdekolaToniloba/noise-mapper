// components/HealthDashboard.tsx - Enhanced monitoring dashboard
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Server,
  Database,
  Shield,
  Globe,
} from "lucide-react";

interface HealthData {
  overall: string;
  timestamp: string;
  uptime: number;
  checks: Array<{
    service: string;
    status: string;
    responseTime: number;
    error?: string;
  }>;
  system: {
    nodeVersion: string;
    platform: string;
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
  };
}

interface LogData {
  logs: Array<{
    id: string;
    timestamp: string;
    level: string;
    message: string;
    meta?: Record<string, unknown>;
  }>;
  counts: {
    total: number;
    error: number;
    warn: number;
    info: number;
  };
}

interface EndpointData {
  summary: {
    total: number;
    healthy: number;
    unhealthy: number;
    healthPercentage: number;
  };
  checks: Array<{
    endpoint: string;
    method: string;
    status: number;
    responseTime: number;
    healthy: boolean;
    error?: string;
  }>;
}

export function HealthDashboard() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [logs, setLogs] = useState<LogData | null>(null);
  const [endpoints, setEndpoints] = useState<EndpointData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"health" | "logs" | "endpoints">(
    "health"
  );
  const [logLevel, setLogLevel] = useState<"all" | "error" | "warn" | "info">(
    "all"
  );
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fixed: Wrap fetchData in useCallback to prevent dependency changes
  const fetchData = useCallback(async () => {
    try {
      const [healthRes, logsRes, endpointsRes] = await Promise.all([
        fetch("/api/health"),
        fetch(
          `/api/logs?${logLevel !== "all" ? `level=${logLevel}&` : ""}limit=100`
        ),
        fetch("/api/health/endpoints"),
      ]);

      if (healthRes.ok) {
        const healthData = await healthRes.json();
        setHealth(healthData);
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData);
      }

      if (endpointsRes.ok) {
        const endpointsData = await endpointsRes.json();
        setEndpoints(endpointsData);
      }
    } catch (error) {
      console.error("Failed to fetch monitoring data:", error);
    } finally {
      setLoading(false);
    }
  }, [logLevel]); // Only depend on logLevel

  useEffect(() => {
    fetchData();

    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchData, autoRefresh]); // Now fetchData is stable due to useCallback

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "degraded":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "unhealthy":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Server className="w-5 h-5 text-gray-500" />;
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case "database":
        return <Database className="w-4 h-4" />;
      case "auth":
        return <Shield className="w-4 h-4" />;
      case "google-oauth":
        return <Globe className="w-4 h-4" />;
      default:
        return <Server className="w-4 h-4" />;
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              System Monitoring
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time health and logging dashboard
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-600">Auto-refresh</span>
            </label>

            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Overall Status */}
        {health && (
          <div className="bg-white rounded-lg shadow-sm border mb-6 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getStatusIcon(health.overall)}
                <div>
                  <h2 className="text-xl font-semibold">System Status</h2>
                  <p className="text-gray-600 capitalize">{health.overall}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-600">Uptime</div>
                <div className="font-mono text-lg">
                  {formatUptime(health.uptime)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {["health", "logs", "endpoints"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`px-6 py-3 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Health Tab */}
        {activeTab === "health" && health && (
          <div className="space-y-6">
            {/* Service Health */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Service Health</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {health.checks.map((check, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getServiceIcon(check.service)}
                        <h4 className="font-medium capitalize">
                          {check.service}
                        </h4>
                      </div>
                      {getStatusIcon(check.status)}
                    </div>

                    <div className="text-sm text-gray-600">
                      Response: {check.responseTime}ms
                    </div>

                    {check.error && (
                      <div className="text-red-500 text-xs mt-2 p-2 bg-red-50 rounded">
                        {check.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* System Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">System Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-gray-600">Node Version</div>
                  <div className="font-mono">{health.system.nodeVersion}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Platform</div>
                  <div className="font-mono">{health.system.platform}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Memory Usage</div>
                  <div className="font-mono">
                    {health.system.memory.used}MB / {health.system.memory.total}
                    MB ({health.system.memory.percentage}%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === "logs" && logs && (
          <div className="space-y-6">
            {/* Log Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Log Statistics</h3>
                <select
                  value={logLevel}
                  onChange={(e) =>
                    setLogLevel(e.target.value as typeof logLevel)
                  }
                  className="px-3 py-1 border rounded-md"
                >
                  <option value="all">All Levels</option>
                  <option value="error">Errors Only</option>
                  <option value="warn">Warnings Only</option>
                  <option value="info">Info Only</option>
                </select>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {logs.counts.total}
                  </div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {logs.counts.error}
                  </div>
                  <div className="text-sm text-gray-600">Errors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {logs.counts.warn}
                  </div>
                  <div className="text-sm text-gray-600">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {logs.counts.info}
                  </div>
                  <div className="text-sm text-gray-600">Info</div>
                </div>
              </div>
            </div>

            {/* Recent Logs */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Recent Logs</h3>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {logs.logs.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No logs found
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {logs.logs.map((log) => (
                      <div key={log.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`inline-block w-2 h-2 rounded-full ${
                                  log.level === "error"
                                    ? "bg-red-500"
                                    : log.level === "warn"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                                }`}
                              />
                              <span className="font-medium text-sm capitalize">
                                {log.level}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                            </div>

                            <div className="text-sm text-gray-900 mb-1">
                              {log.message}
                            </div>

                            {log.meta && (
                              <details className="text-xs text-gray-600">
                                <summary className="cursor-pointer hover:text-gray-800">
                                  Show metadata
                                </summary>
                                <pre className="mt-1 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                                  {JSON.stringify(log.meta, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Endpoints Tab */}
        {activeTab === "endpoints" && endpoints && (
          <div className="space-y-6">
            {/* Endpoint Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">
                Endpoint Health Summary
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {endpoints.summary.total}
                  </div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {endpoints.summary.healthy}
                  </div>
                  <div className="text-sm text-gray-600">Healthy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {endpoints.summary.unhealthy}
                  </div>
                  <div className="text-sm text-gray-600">Unhealthy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {endpoints.summary.healthPercentage}%
                  </div>
                  <div className="text-sm text-gray-600">Health Rate</div>
                </div>
              </div>

              {/* Health Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${endpoints.summary.healthPercentage}%`,
                  }}
                />
              </div>
            </div>

            {/* Endpoint Details */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Endpoint Details</h3>
              </div>

              <div className="divide-y divide-gray-100">
                {endpoints.checks.map((check, index) => (
                  <div key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            check.healthy ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <div>
                          <div className="font-medium">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded mr-2">
                              {check.method}
                            </span>
                            {check.endpoint}
                          </div>
                          {check.error && (
                            <div className="text-sm text-red-600 mt-1">
                              {check.error}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {check.status > 0 ? check.status : "Failed"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {check.responseTime}ms
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Last updated:{" "}
          {health?.timestamp
            ? new Date(health.timestamp).toLocaleString()
            : "Never"}
        </div>
      </div>
    </div>
  );
}
