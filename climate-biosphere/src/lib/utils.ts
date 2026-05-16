import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Design Tokens based on UI/UX Pro Max system
export const designTokens = {
  colors: {
    background: {
      black: '#020203',
      deep: '#050507',
      base: '#0a0a0f',
      elevated: '#12121a',
    },
    primary: {
      DEFAULT: '#059669',
      glow: '#10b981',
      dim: 'rgba(5, 150, 105, 0.2)',
    },
    secondary: {
      DEFAULT: '#00d4ff',
      glow: 'rgba(0, 212, 255, 0.3)',
    },
    accent: {
      DEFAULT: '#ff3d6e',
      glow: 'rgba(255, 61, 110, 0.3)',
    },
    warning: {
      DEFAULT: '#fbbf24',
      glow: 'rgba(251, 191, 36, 0.3)',
    },
    foreground: {
      DEFAULT: '#e8eef5',
      muted: '#8a94a8',
      dim: '#4a5568',
    },
    glass: {
      bg: 'rgba(18, 18, 26, 0.6)',
      border: 'rgba(255, 255, 255, 0.08)',
      blur: '20px',
    },
  },
  animation: {
    easeCinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    easeSmooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  spacing: {
    section: 'clamp(2rem, 5vw, 4rem)',
    card: 'clamp(1rem, 2vw, 1.5rem)',
    widget: 'clamp(0.75rem, 1.5vw, 1rem)',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  shadows: {
    glow: '0 0 20px currentColor',
    glowSm: '0 0 10px currentColor',
    depth: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },
};

// Simulated real-time telemetry data generator
export function generateTelemetryData() {
  const now = new Date();
  
  return {
    timestamp: now.toISOString(),
    globalTemp: {
      value: 14.8 + Math.random() * 0.5,
      change: (Math.random() - 0.3) * 0.1,
      unit: '°C',
      status: Math.random() > 0.7 ? 'warning' : 'normal',
    },
    co2Level: {
      value: 420 + Math.random() * 5,
      change: (Math.random() - 0.2) * 2,
      unit: 'ppm',
      status: 'warning',
    },
    oceanPh: {
      value: 8.1 - Math.random() * 0.05,
      change: -(Math.random() * 0.01),
      unit: 'pH',
      status: Math.random() > 0.8 ? 'critical' : 'normal',
    },
    forestCover: {
      value: 31.5 - Math.random() * 0.1,
      change: -(Math.random() * 0.05),
      unit: '%',
      status: 'normal',
    },
    renewableEnergy: {
      value: 29 + Math.random() * 2,
      change: Math.random() * 0.5,
      unit: '%',
      status: 'positive',
    },
    biodiversityIndex: {
      value: 0.68 + Math.random() * 0.04,
      change: (Math.random() - 0.4) * 0.02,
      unit: 'index',
      status: Math.random() > 0.6 ? 'declining' : 'stable',
    },
    anomalies: [
      {
        id: 1,
        type: 'heatwave',
        location: 'Pacific Northwest',
        severity: Math.random() > 0.5 ? 'high' : 'moderate',
        coordinates: [47.6, -122.3],
      },
      {
        id: 2,
        type: 'coral_bleaching',
        location: 'Great Barrier Reef',
        severity: Math.random() > 0.7 ? 'critical' : 'high',
        coordinates: [-18.2, 147.7],
      },
      {
        id: 3,
        type: 'ice_melt',
        location: 'Greenland Ice Sheet',
        severity: Math.random() > 0.4 ? 'accelerating' : 'steady',
        coordinates: [71.7, -42.6],
      },
    ].filter(() => Math.random() > 0.3),
    rewildingProjects: [
      {
        id: 1,
        name: 'Amazon Restoration Corridor',
        progress: Math.floor(Math.random() * 100),
        area: `${(Math.random() * 500).toFixed(0)} km²`,
        species: Math.floor(Math.random() * 50) + 10,
        coordinates: [-3.4, -62.2],
      },
      {
        id: 2,
        name: 'European Green Belt',
        progress: Math.floor(Math.random() * 100),
        area: `${(Math.random() * 300).toFixed(0)} km²`,
        species: Math.floor(Math.random() * 30) + 5,
        coordinates: [51.1, 10.4],
      },
      {
        id: 3,
        name: 'African Wildlife Corridor',
        progress: Math.floor(Math.random() * 100),
        area: `${(Math.random() * 800).toFixed(0)} km²`,
        species: Math.floor(Math.random() * 80) + 20,
        coordinates: [-1.3, 36.8],
      },
    ],
  };
}

// Format numbers with locale
export function formatNumber(num: number, decimals = 2): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Get status color
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    normal: 'var(--primary)',
    positive: 'var(--primary-glow)',
    warning: 'var(--warning)',
    critical: 'var(--accent)',
    declining: 'var(--accent)',
    stable: 'var(--secondary)',
    accelerating: 'var(--warning)',
    steady: 'var(--primary)',
    high: 'var(--warning)',
    moderate: 'var(--primary)',
  };
  return colors[status] || 'var(--foreground-muted)';
}
