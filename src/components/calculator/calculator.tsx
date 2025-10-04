"use client"

import React, { useReducer, useEffect, useState } from "react";
import CalculatorDisplay from "./calculator-display";
import CalculatorButton from "./calculator-button";
import type { HistoryEntry } from "@/app/page";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sigma, Scissors } from 'lucide-react';

interface CalculatorProps {
  addToHistory: (entry: HistoryEntry) => void;
  valueFromHistory: string | null;
  onValueFromHistoryUsed: () => void;
}

type State = {
  currentOperand: string;
  previousOperand: string | null;
  operation: string | null;
  expression: string;
  memory: number;
  overwrite: boolean;
};

const initialState: State = {
  currentOperand: "0",
  previousOperand: null,
  operation: null,
  expression: "",
  memory: 0,
  overwrite: true,
};

type Action =
  | { type: "ADD_DIGIT"; payload: string }
  | { type: "CHOOSE_OPERATION"; payload: string }
  | { type: "CLEAR" }
  | { type: "EVALUATE" }
  | { type: "TOGGLE_SIGN" }
  | { type: "PERCENTAGE" }
  | { type: "MEMORY_CLEAR" }
  | { type: "MEMORY_ADD" }
  | { type: "MEMORY_SUBTRACT" }
  | { type: "MEMORY_RECALL" }
  | { type: "SET_VALUE"; payload: string }
  | { type: "BACKSPACE" };


function evaluate({ currentOperand, previousOperand, operation }: Pick<State, 'currentOperand' | 'previousOperand' | 'operation'>): number {
  const prev = parseFloat(previousOperand!);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return NaN;
  
  let computation = 0;
  switch (operation) {
    case "+": computation = prev + current; break;
    case "-": computation = prev - current; break;
    case "*": computation = prev * current; break;
    case "/": computation = prev / current; break;
    case "^": computation = Math.pow(prev, current); break;
  }
  return computation;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_DIGIT":
      if (state.overwrite) {
        return { ...state, currentOperand: action.payload, overwrite: false, expression: state.previousOperand ? state.expression : "" };
      }
      if (action.payload === "0" && state.currentOperand === "0") return state;
      if (action.payload === "." && state.currentOperand.includes(".")) return state;
      return { ...state, currentOperand: `${state.currentOperand}${action.payload}` };

    case "CHOOSE_OPERATION":
      if (state.currentOperand === "0" && state.previousOperand === null) return state;

      if (state.previousOperand === null) {
        return {
          ...state,
          operation: action.payload,
          previousOperand: state.currentOperand,
          expression: `${formatOperand(state.currentOperand)} ${action.payload}`,
          overwrite: true,
        };
      }

      if (state.overwrite) {
        return {
            ...state,
            operation: action.payload,
            expression: `${formatOperand(state.previousOperand)} ${action.payload}`,
        }
      }

      const result = evaluate(state);
      return {
        ...state,
        previousOperand: result.toString(),
        operation: action.payload,
        expression: `${formatOperand(result.toString())} ${action.payload}`,
        currentOperand: result.toString(),
        overwrite: true,
      };

    case "EVALUATE":
      if (state.operation == null || state.previousOperand == null) {
        return state;
      }
      const finalResult = evaluate(state);
      return {
        ...initialState,
        currentOperand: finalResult.toString(),
        expression: `${state.expression} ${formatOperand(state.currentOperand)} =`,
      };

    case "CLEAR":
      return initialState;

    case "BACKSPACE":
      if (state.overwrite) return { ...state, currentOperand: "0", overwrite: false };
      if (state.currentOperand.length === 1) return { ...state, currentOperand: "0" };
      return { ...state, currentOperand: state.currentOperand.slice(0, -1) };

    case "TOGGLE_SIGN":
      return { ...state, currentOperand: (parseFloat(state.currentOperand) * -1).toString() };

    case "PERCENTAGE":
      return { ...state, currentOperand: (parseFloat(state.currentOperand) / 100).toString() };
    
    case "MEMORY_CLEAR": return { ...state, memory: 0 };
    case "MEMORY_ADD": return { ...state, memory: state.memory + parseFloat(state.currentOperand) };
    case "MEMORY_SUBTRACT": return { ...state, memory: state.memory - parseFloat(state.currentOperand) };
    case "MEMORY_RECALL": return { ...state, currentOperand: state.memory.toString(), overwrite: true };

    case "SET_VALUE":
      return {
        ...initialState,
        currentOperand: action.payload,
        overwrite: true,
      };

    default:
      return state;
  }
}

const formatOperand = (operand: string | null) => {
    if (operand == null) return "";
    const [integer, decimal] = operand.split(".");
    if (decimal == null) {
        return new Intl.NumberFormat('en-US', {maximumFractionDigits: 10}).format(parseFloat(integer));
    }
    return `${new Intl.NumberFormat('en-US').format(parseInt(integer))}.${decimal}`;
}

const Calculator: React.FC<CalculatorProps> = ({ addToHistory, valueFromHistory, onValueFromHistoryUsed }) => {
  const [{ currentOperand, previousOperand, operation, expression, memory }, dispatch] = useReducer(reducer, initialState);
  const [isScientific, setIsScientific] = useState(false);

  useEffect(() => {
    if (valueFromHistory !== null) {
      dispatch({ type: 'SET_VALUE', payload: valueFromHistory });
      onValueFromHistoryUsed();
    }
  }, [valueFromHistory, onValueFromHistoryUsed]);

  const handleEvaluate = () => {
    const fullExpression = `${expression} ${formatOperand(currentOperand)}`;
    const evaluationState = { currentOperand, previousOperand, operation };
    const result = evaluate(evaluationState);
    if (!isNaN(result)) {
      addToHistory({ expression: fullExpression, result: result.toString() });
    }
    dispatch({ type: "EVALUATE" });
  };

  const handleUnaryOperation = (op: string) => {
    const current = parseFloat(currentOperand);
    if (isNaN(current)) return;
    let result: number;
    let exp: string;
    switch(op) {
        case 'sin': result = Math.sin(current); exp = `sin(${currentOperand})`; break;
        case 'cos': result = Math.cos(current); exp = `cos(${currentOperand})`; break;
        case 'tan': result = Math.tan(current); exp = `tan(${currentOperand})`; break;
        case 'ln': result = Math.log(current); exp = `ln(${currentOperand})`; break;
        case 'log': result = Math.log10(current); exp = `log(${currentOperand})`; break;
        case '√': result = Math.sqrt(current); exp = `√(${currentOperand})`; break;
        case 'x!':
            if (current < 0 || !Number.isInteger(current)) return;
            let f = 1;
            for(let i=1; i<=current; i++) f *= i;
            result = f;
            exp = `fact(${currentOperand})`;
            break;
        default: return;
    }
    addToHistory({ expression: exp, result: result.toString() });
    dispatch({ type: "SET_VALUE", payload: result.toString() });
  }

  const handleConstant = (c: string) => {
    switch(c) {
        case 'π': dispatch({type: 'SET_VALUE', payload: Math.PI.toString()}); break;
        case 'e': dispatch({type: 'SET_VALUE', payload: Math.E.toString()}); break;
    }
  }

  return (
    <div className="flex flex-col">
      <CalculatorDisplay expression={expression} displayValue={formatOperand(currentOperand)} />

      <div className="flex items-center space-x-2 mb-4">
        <Switch id="scientific-mode" checked={isScientific} onCheckedChange={setIsScientific} />
        <Label htmlFor="scientific-mode" className="flex items-center gap-2">
            <Sigma className="size-4" /> Scientific Mode
        </Label>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {isScientific && (
            <>
                <CalculatorButton variant="special" onClick={() => handleUnaryOperation('sin')}>sin</CalculatorButton>
                <CalculatorButton variant="special" onClick={() => handleUnaryOperation('cos')}>cos</CalculatorButton>
                <CalculatorButton variant="special" onClick={() => handleUnaryOperation('tan')}>tan</CalculatorButton>
                <CalculatorButton variant="special" onClick={() => handleConstant('π')}>π</CalculatorButton>

                <CalculatorButton variant="special" onClick={() => dispatch({type: 'CHOOSE_OPERATION', payload: '^'})}>xʸ</CalculatorButton>
                <CalculatorButton variant="special" onClick={() => handleUnaryOperation('log')}>log</CalculatorButton>
                <CalculatorButton variant="special" onClick={() => handleUnaryOperation('ln')}>ln</CalculatorButton>
                <CalculatorButton variant="special" onClick={() => handleConstant('e')}>e</CalculatorButton>

                <CalculatorButton variant="special" onClick={() => handleUnaryOperation('√')}>√</CalculatorButton>
                <CalculatorButton variant="special" onClick={() => handleUnaryOperation('x!')}>x!</CalculatorButton>
                <CalculatorButton variant="special" onClick={() => dispatch({ type: "ADD_DIGIT", payload: '(' })}>(</CalculatorButton>
                <CalculatorButton variant="special" onClick={() => dispatch({ type: "ADD_DIGIT", payload: ')' })}>)</CalculatorButton>
            </>
        )}
        
        <CalculatorButton variant="special" onClick={() => dispatch({ type: "CLEAR" })}>AC</CalculatorButton>
        <CalculatorButton variant="special" onClick={() => dispatch({ type: "TOGGLE_SIGN" })}>+/-</CalculatorButton>
        <CalculatorButton variant="special" onClick={() => dispatch({ type: "PERCENTAGE" })}>%</CalculatorButton>
        <CalculatorButton variant="operator" onClick={() => dispatch({ type: "CHOOSE_OPERATION", payload: "/" })}>÷</CalculatorButton>

        <CalculatorButton onClick={() => dispatch({ type: "ADD_DIGIT", payload: "7" })}>7</CalculatorButton>
        <CalculatorButton onClick={() => dispatch({ type: "ADD_DIGIT", payload: "8" })}>8</CalculatorButton>
        <CalculatorButton onClick={() => dispatch({ type: "ADD_DIGIT", payload: "9" })}>9</CalculatorButton>
        <CalculatorButton variant="operator" onClick={() => dispatch({ type: "CHOOSE_OPERATION", payload: "*" })}>×</CalculatorButton>

        <CalculatorButton onClick={() => dispatch({ type: "ADD_DIGIT", payload: "4" })}>4</CalculatorButton>
        <CalculatorButton onClick={() => dispatch({ type: "ADD_DIGIT", payload: "5" })}>5</CalculatorButton>
        <CalculatorButton onClick={() => dispatch({ type: "ADD_DIGIT", payload: "6" })}>6</CalculatorButton>
        <CalculatorButton variant="operator" onClick={() => dispatch({ type: "CHOOSE_OPERATION", payload: "-" })}>−</CalculatorButton>

        <CalculatorButton onClick={() => dispatch({ type: "ADD_DIGIT", payload: "1" })}>1</CalculatorButton>
        <CalculatorButton onClick={() => dispatch({ type: "ADD_DIGIT", payload: "2" })}>2</CalculatorButton>
        <CalculatorButton onClick={() => dispatch({ type: "ADD_DIGIT", payload: "3" })}>3</CalculatorButton>
        <CalculatorButton variant="operator" onClick={() => dispatch({ type: "CHOOSE_OPERATION", payload: "+" })}>+</CalculatorButton>

        <CalculatorButton gridSpan={1} onClick={() => dispatch({ type: "ADD_DIGIT", payload: "0" })}>0</CalculatorButton>
        <CalculatorButton onClick={() => dispatch({ type: "ADD_DIGIT", payload: "." })}>.</CalculatorButton>
        <CalculatorButton variant="special" onClick={() => dispatch({ type: "BACKSPACE" })}>
          <Scissors className="size-5" />
        </CalculatorButton>
        <CalculatorButton variant="action" onClick={handleEvaluate}>=</CalculatorButton>
      </div>

       <div className="grid grid-cols-4 gap-3 mt-3">
            <CalculatorButton variant="memory" onClick={() => dispatch({ type: "MEMORY_CLEAR" })}>MC</CalculatorButton>
            <CalculatorButton variant="memory" onClick={() => dispatch({ type: "MEMORY_RECALL" })}>MR</CalculatorButton>
            <CalculatorButton variant="memory" onClick={() => dispatch({ type: "MEMORY_ADD" })}>M+</CalculatorButton>
            <CalculatorButton variant="memory" onClick={() => dispatch({ type: "MEMORY_SUBTRACT" })}>M-</CalculatorButton>
        </div>
    </div>
  );
};

export default Calculator;

    