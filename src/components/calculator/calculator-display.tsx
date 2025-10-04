"use client";

import React from 'react';

interface CalculatorDisplayProps {
  expression: string;
  displayValue: string;
}

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({ expression, displayValue }) => {
  const displayFontSize = React.useMemo(() => {
    const len = displayValue.length;
    if (len > 16) return '1.8rem';
    if (len > 11) return '2.5rem';
    if (len > 8) return '3.2rem';
    return '4rem';
  }, [displayValue]);

  return (
    <div className="bg-transparent rounded-xl p-4 mb-4 text-right break-all min-h-[128px] flex flex-col justify-end">
      <div className="text-muted-foreground text-xl h-8 opacity-70 transition-opacity duration-300">{expression || ' '}</div>
      <div 
        key={displayValue}
        className="text-foreground font-bold transition-all duration-200 animate-in"
        style={{ fontSize: displayFontSize, lineHeight: '1.1' }}
      >
        {displayValue}
      </div>
    </div>
  );
};

export default CalculatorDisplay;
