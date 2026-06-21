/**
 * Performance Monitor
 * Tracks CPU and Memory usage.
 */

import os from 'os';

export const getSystemPerformance = () => {
  return {
    cpuLoad: os.loadavg()[0],
    memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
    uptime: process.uptime()
  };
};
