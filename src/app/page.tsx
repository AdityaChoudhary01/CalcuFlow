"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalculatorIcon, History, Ruler } from 'lucide-react';

import Header from '@/components/header';
import Calculator from '@/components/calculator/calculator';
import HistoryTab from '@/components/calculator/history-tab';
import UnitConverterTab from '@/components/calculator/unit-converter-tab';

export type HistoryEntry = {
  expression: string;
  result: string;
};

export default function Home() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState('calculator');
  const [valueFromHistory, setValueFromHistory] = useState<string | null>(null);

  const addToHistory = (entry: HistoryEntry) => {
    setHistory(prev => [entry, ...prev].slice(0, 50)); // Keep last 50 calculations
  };

  const clearHistory = () => {
    setHistory([]);
  };
  
  const handleSelectHistory = (value: string) => {
    setValueFromHistory(value);
    setActiveTab('calculator');
  }

  const handleValueFromHistoryUsed = () => {
    setValueFromHistory(null);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-2 sm:p-4 aurora-background">
      <Card className="w-full max-w-[380px] rounded-3xl shadow-2xl overflow-hidden border-2 border-white/10 bg-card/10 backdrop-blur-2xl animate-in">
        <CardHeader className="p-4">
          <Header />
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-transparent rounded-none h-14 px-2">
              <TabsTrigger value="calculator" className="h-full text-xs sm:text-sm gap-1.5 data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground rounded-lg transition-all duration-300">
                <CalculatorIcon className="size-4" /> Calculator
              </TabsTrigger>
              <TabsTrigger value="history" className="h-full text-xs sm:text-sm gap-1.5 data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground rounded-lg transition-all duration-300">
                <History className="size-4" /> History
              </TabsTrigger>
              <TabsTrigger value="converter" className="h-full text-xs sm:text-sm gap-1.5 data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground rounded-lg transition-all duration-300">
                <Ruler className="size-4" /> Converter
              </TabsTrigger>
            </TabsList>
            <div className="p-4">
              <TabsContent value="calculator" className="m-0 animate-in">
                <Calculator 
                  addToHistory={addToHistory} 
                  valueFromHistory={valueFromHistory}
                  onValueFromHistoryUsed={handleValueFromHistoryUsed}
                />
              </TabsContent>
              <TabsContent value="history" className="m-0 animate-in">
                <HistoryTab history={history} clearHistory={clearHistory} onSelectHistory={handleSelectHistory} />
              </TabsContent>
              <TabsContent value="converter" className="m-0 animate-in">
                <UnitConverterTab />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
