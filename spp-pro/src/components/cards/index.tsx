import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  change?: number;
  changeLabel?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  background?: boolean;
}

export const MetricCard = ({
  title,
  value,
  unit,
  icon,
  change,
  changeLabel,
  color = 'blue',
  background = true,
}: MetricCardProps) => {
  const colorStyles = {
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    green: 'bg-green-500/10 border-green-500/30 text-green-400',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    orange: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-4 h-4" />;
    if (value < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-400';
    if (value < 0) return 'text-red-400';
    return 'text-slate-400';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${background ? colorStyles[color] : ''}`}>
            {icon}
          </div>
          {change !== undefined && (
            <div
              className={`flex items-center gap-1 text-sm font-semibold ${getTrendColor(
                change
              )}`}
            >
              {getTrendIcon(change)}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <p className="text-slate-400 text-sm mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">
          {value}
          {unit && <span className="text-sm text-slate-400 ml-1">{unit}</span>}
        </p>
        {changeLabel && <p className="text-xs text-slate-500 mt-2">{changeLabel}</p>}
      </Card>
    </motion.div>
  );
};

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  compact?: boolean;
}

export const ChartCard = ({
  title,
  description,
  children,
  footer,
  compact = false,
}: ChartCardProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className={compact ? 'p-4' : ''}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
        </div>
        <div className="w-full overflow-x-auto">{children}</div>
        {footer && <div className="mt-4 pt-4 border-t border-white/10">{footer}</div>}
      </Card>
    </motion.div>
  );
};

interface StatBoxProps {
  label: string;
  value: string | number;
  color?: string;
}

export const StatBox = ({ label, value, color = 'blue' }: StatBoxProps) => {
  const colorBg = {
    blue: 'bg-blue-500/20',
    green: 'bg-green-500/20',
    orange: 'bg-orange-500/20',
    red: 'bg-red-500/20',
  }[color] || 'bg-blue-500/20';

  return (
    <div className={`p-4 rounded-xl ${colorBg} border border-white/10`}>
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
};

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  color?: 'blue' | 'green' | 'orange' | 'red';
  showValue?: boolean;
}

export const ProgressBar = ({
  value,
  max = 100,
  label,
  color = 'blue',
  showValue = true,
}: ProgressBarProps) => {
  const percentage = (value / max) * 100;
  const colorClass = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  }[color];

  return (
    <div>
      {label && (
        <div className="flex justify-between mb-2">
          <span className="text-sm text-slate-300">{label}</span>
          {showValue && <span className="text-sm font-semibold text-white">{value}%</span>}
        </div>
      )}
      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
