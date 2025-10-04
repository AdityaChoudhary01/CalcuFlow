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
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex flex-col items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-[360px] rounded-2xl shadow-2xl overflow-hidden border-2 border-card/50 backdrop-blur-sm bg-card/80">
        <CardHeader className="p-4">
          <Header />
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 rounded-none h-14">
              <TabsTrigger value="calculator" className="h-full text-xs sm:text-sm gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <CalculatorIcon className="size-4" /> Calculator
              </TabsTrigger>
              <TabsTrigger value="history" className="h-full text-xs sm:text-sm gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <History className="size-4" /> History
              </TabsTrigger>
              <TabsTrigger value="converter" className="h-full text-xs sm:text-sm gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Ruler className="size-4" /> Converter
              </TabsTrigger>
            </TabsList>
            <div className="p-4">
              <TabsContent value="calculator" className="m-0">
                <Calculator 
                  addToHistory={addToHistory} 
                  valueFromHistory={valueFromHistory}
                  onValueFromHistoryUsed={handleValueFromHistoryUsed}
                />
              </TabsContent>
              <TabsContent value="history" className="m-0">
                <HistoryTab history={history} clearHistory={clearHistory} onSelectHistory={handleSelectHistory} />
              </TabsContent>
              <TabsContent value="converter" className="m-0">
                <UnitConverterTab />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
