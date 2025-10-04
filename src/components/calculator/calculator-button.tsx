"use client";

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const calculatorButtonVariants = cva(
  "h-16 text-2xl font-medium rounded-2xl transition-transform duration-100 active:scale-95 shadow-lg border-b-4",
  {
    variants: {
      variant: {
        number: "bg-secondary/80 border-secondary hover:bg-secondary text-secondary-foreground",
        operator: "bg-accent border-accent/70 hover:bg-accent/90 text-accent-foreground",
        action: "bg-primary border-primary/70 hover:bg-primary/90 text-primary-foreground",
        special: "bg-muted/80 border-muted hover:bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "number",
    },
  }
);

interface CalculatorButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof calculatorButtonVariants> {
  gridSpan?: number;
}

const CalculatorButton = React.forwardRef<HTMLButtonElement, CalculatorButtonProps>(
  ({ className, variant, gridSpan, ...props }, ref) => {
    const gridColumn = gridSpan ? `span ${gridSpan} / span ${gridSpan}` : undefined;
    return (
      <Button
        className={cn(calculatorButtonVariants({ variant, className }))}
        ref={ref}
        style={{ gridColumn }}
        {...props}
      />
    );
  }
);
CalculatorButton.displayName = 'CalculatorButton';

export default CalculatorButton;
