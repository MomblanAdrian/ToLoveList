import { motion } from 'framer-motion';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  disabled?: boolean;
}

const valueColors = [
  'from-red-500 to-red-400',
  'from-orange-500 to-orange-400',
  'from-yellow-500 to-yellow-400',
  'from-lime-500 to-lime-400',
  'from-green-500 to-green-400',
  'from-emerald-500 to-emerald-400',
];

function getColorIndex(value: number): number {
  if (value <= 15) return 0;
  if (value <= 30) return 1;
  if (value <= 50) return 2;
  if (value <= 70) return 3;
  if (value <= 85) return 4;
  return 5;
}

export function Slider({ value, onChange, min = 0, max = 100, step = 1, label, disabled }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  const colorIndex = getColorIndex(value);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-surface-400">{label}</span>
          <motion.span
            key={value}
            initial={{ scale: 1.3, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r ${valueColors[colorIndex]}`}
          >
            {value}
          </motion.span>
        </div>
      )}

      <div className="relative">
        <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${valueColors[colorIndex]}`}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          />
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 1 }}
        />

        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-surface-500">Strongly Dislike</span>
          <span className="text-xs text-surface-500">Absolutely Love</span>
        </div>
      </div>
    </div>
  );
}
