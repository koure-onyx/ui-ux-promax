'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Activity, Droplets, Thermometer, Wind, Leaf } from 'lucide-react';
import { cn, formatNumber, getStatusColor } from '@/lib/utils';

interface MetricData {
  value: number;
  change: number;
  unit: string;
  status: string;
}

interface TelemetryWidgetProps {
  label: string;
  data: MetricData;
  icon?: React.ReactNode;
  delay?: number;
  compact?: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  temp: <Thermometer size={18} />,
  co2: <Activity size={18} />,
  ocean: <Droplets size={18} />,
  forest: <Leaf size={18} />,
  energy: <Wind size={18} />,
  biodiversity: <Activity size={18} />,
};

export function TelemetryWidget({ 
  label, 
  data, 
  icon,
  delay = 0,
  compact = false 
}: TelemetryWidgetProps) {
  const isPositive = data.change >= 0;
  const statusColor = getStatusColor(data.status);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        transition: { duration: 0.2 }
      }}
      className={cn(
        'glass-panel relative overflow-hidden',
        'transition-all duration-300 cursor-pointer',
        compact ? 'p-3' : 'p-4'
      )}
      style={{
        boxShadow: `0 0 20px ${statusColor}15`,
      }}
    >
      {/* Animated background gradient */}
      <div 
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${statusColor}15, transparent 70%)`,
        }}
      />
      
      {/* Status indicator dot */}
      <motion.div
        className="absolute top-3 right-3 w-2 h-2 rounded-full"
        style={{ backgroundColor: statusColor }}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="relative z-10">
        {/* Label */}
        <div className="flex items-center gap-2 mb-2">
          {icon || iconMap[label.toLowerCase().split(' ')[0]]}
          <span className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
            {label}
          </span>
        </div>
        
        {/* Value */}
        <motion.div 
          className={cn("font-bold", compact ? 'text-2xl' : 'text-3xl')}
          style={{ color: statusColor }}
          key={data.value.toFixed(2)}
          initial={{ opacity: 0.5, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {formatNumber(data.value, label.includes('Index') ? 3 : 2)}
          <span className="text-sm ml-1 text-[var(--foreground-muted)]">{data.unit}</span>
        </motion.div>
        
        {/* Change indicator */}
        <div className="flex items-center gap-1 mt-2">
          <motion.div
            initial={{ rotate: isPositive ? -45 : 45 }}
            animate={{ rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {isPositive ? (
              <TrendingUp size={14} className={data.change > 0.1 ? 'text-red-400' : 'text-green-400'} />
            ) : (
              <TrendingDown size={14} className="text-green-400" />
            )}
          </motion.div>
          <span className={cn(
            "text-xs font-mono",
            Math.abs(data.change) > 0.1 ? 'text-red-400' : 'text-green-400'
          )}>
            {isPositive ? '+' : ''}{formatNumber(data.change, 3)}{data.unit}
          </span>
        </div>
        
        {/* Mini sparkline placeholder */}
        <div className="mt-3 h-8 flex items-end gap-px opacity-50">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t"
              style={{ 
                backgroundColor: statusColor,
                height: `${20 + Math.random() * 80}%`
              }}
              initial={{ height: '20%' }}
              animate={{ 
                height: `${20 + Math.sin(i * 0.5 + Date.now() * 0.002) * 40}%`
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Anomaly Alert Card
export function AnomalyAlert({ anomaly, delay = 0 }: { anomaly: any; delay?: number }) {
  const severityColors: Record<string, string> = {
    moderate: 'var(--primary)',
    high: 'var(--warning)',
    critical: 'var(--accent)',
    accelerating: 'var(--warning)',
    steady: 'var(--primary)',
  };
  
  const typeIcons: Record<string, React.ReactNode> = {
    heatwave: <Thermometer size={16} />,
    coral_bleaching: <Droplets size={16} />,
    ice_melt: <Activity size={16} />,
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ x: 4, transition: { duration: 0.2 } }}
      className="glass-panel p-3 mb-2 cursor-pointer group"
      style={{
        borderLeft: `3px solid ${severityColors[anomaly.severity]}`,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ color: severityColors[anomaly.severity] }}
          >
            {typeIcons[anomaly.type]}
          </motion.div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--secondary)] transition-colors">
              {anomaly.location}
            </h4>
            <p className="text-xs text-[var(--foreground-muted)] capitalize">
              {anomaly.type.replace('_', ' ')}
            </p>
          </div>
        </div>
        <motion.span 
          className="text-xs px-2 py-1 rounded-full"
          style={{ 
            backgroundColor: `${severityColors[anomaly.severity]}20`,
            color: severityColors[anomaly.severity]
          }}
          whileHover={{ scale: 1.1 }}
        >
          {anomaly.severity}
        </motion.span>
      </div>
    </motion.div>
  );
}

// Rewilding Project Card
export function RewildingCard({ project, delay = 0 }: { project: any; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="glass-panel p-4 cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--primary-glow)] transition-colors">
          {project.name}
        </h4>
        <Leaf size={16} className="text-[var(--primary)] opacity-70 group-hover:opacity-100 transition-opacity" />
      </div>
      
      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[var(--foreground-muted)]">Progress</span>
          <span className="text-[var(--primary-glow)]">{project.progress}%</span>
        </div>
        <div className="h-2 bg-[var(--biosphere-deep)] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 1, delay: delay + 0.3, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, var(--primary), var(--primary-glow))',
            }}
          />
        </div>
      </div>
      
      {/* Stats */}
      <div className="flex justify-between text-xs text-[var(--foreground-muted)]">
        <span>{project.area}</span>
        <span>{project.species} species</span>
      </div>
    </motion.div>
  );
}

export default TelemetryWidget;
