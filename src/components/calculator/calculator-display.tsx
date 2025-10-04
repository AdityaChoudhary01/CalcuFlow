"use client";

import React from 'react';

interface CalculatorDisplayProps {
  expression: string;
  displayValue: string;
}

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({ expression, displayValue }) => {
  const displayFontSize = React.useMemo(() => {
    const len = displayValue.length;
    if (len > 16) return '1.5rem';
    if (len > 11) return '2rem';
    if (len > 8) return '2.5rem';
    return '3rem';
  }, [displayValue]);

  return (
    <div className="bg-muted/30 rounded-xl p-4 mb-4 text-right break-all min-h-[108px] flex flex-col justify-end">
      <div className="text-muted-foreground text-lg h-8 opacity-80">{expression || ' '}</div>
      <div 
        className="text-foreground font-semibold transition-all duration-200"
        style={{ fontSize: displayFontSize, lineHeight: '1.2' }}
      >
        {displayValue}
      </div>
    </div>
  );
};

export default CalculatorDisplay;
