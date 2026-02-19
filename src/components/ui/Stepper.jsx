import { motion } from 'framer-motion';

export function Stepper({
  steps = [],
  currentStep = 0,
  onStepClick,
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center flex-1">
            {/* Step Circle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onStepClick?.(idx)}
              disabled={idx > currentStep}
              className={`relative flex h-10 w-10 items-center justify-center rounded-full font-semibold text-sm transition ${
                idx < currentStep
                  ? 'bg-green-500/20 border border-green-500/50 text-green-300 cursor-pointer'
                  : idx === currentStep
                    ? 'bg-leather-accent border-2 border-leather-accent text-black'
                    : 'bg-stone-800 border border-white/20 text-stone-400 cursor-not-allowed'
              }`}
            >
              {idx < currentStep ? '✓' : idx + 1}
            </motion.button>

            {/* Connector Line */}
            {idx < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`h-1 flex-1 mx-2 transition ${
                  idx < currentStep
                    ? 'bg-green-500/50'
                    : 'bg-stone-700'
                }`}
                style={{ originX: 0 }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex items-center justify-between mt-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex-1 text-center px-2">
            <p className="text-xs font-medium uppercase text-stone-300 truncate">
              {step.label}
            </p>
            {step.description && (
              <p className="text-xs text-stone-400 mt-1 truncate">
                {step.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
