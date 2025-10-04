"use client";

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const calculatorButtonVariants = cva(
  "h-16 text-2xl font-semibold rounded-2xl transition-all duration-150 active:scale-95 active:shadow-inner-sm shadow-md hover:shadow-lg hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        number: "bg-card/80 text-foreground hover:bg-card",
        operator: "bg-accent text-accent-foreground hover:bg-accent/90",
        action: "bg-primary text-primary-foreground hover:bg-primary/90 text-3xl",
        special: "bg-muted text-muted-foreground hover:bg-muted/80",
        memory: "bg-secondary/70 text-secondary-foreground hover:bg-secondary/90 text-base"
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
  ({ className, variant, gridSpan, children, ...props }, ref) => {
    const gridColumn = gridSpan ? `span ${gridSpan} / span ${gridSpan}` : undefined;
    return (
      <Button
        className={cn(calculatorButtonVariants({ variant, className }))}
        ref={ref}
        style={{ gridColumn }}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
CalculatorButton.displayName = 'CalculatorButton';

export default CalculatorButton;
