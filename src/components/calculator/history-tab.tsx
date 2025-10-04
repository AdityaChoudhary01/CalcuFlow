"use client";

import type { HistoryEntry } from "@/app/page";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Copy } from 'lucide-react';

interface HistoryTabProps {
  history: HistoryEntry[];
  clearHistory: () => void;
  onSelectHistory: (value: string) => void;
}

const HistoryTab: React.FC<HistoryTabProps> = ({ history, clearHistory, onSelectHistory }) => {
  return (
    <div className="flex flex-col h-[480px]">
      {history.length > 0 ? (
        <>
          <ScrollArea className="flex-grow pr-3">
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div 
                  key={index}
                  className="text-right p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onSelectHistory(entry.result)}
                  title="Click to use this result"
                >
                  <p className="text-sm text-muted-foreground break-words">{entry.expression}</p>
                  <p className="text-2xl font-semibold text-foreground">{entry.result}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="mt-4 flex-shrink-0">
            <Button variant="destructive" className="w-full" onClick={clearHistory}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear History
            </Button>
          </div>
        </>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-muted-foreground text-center">
          <History className="w-16 h-16 mb-4" />
          <p className="text-lg font-medium">No History Yet</p>
          <p className="text-sm">Your past calculations will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default HistoryTab;
