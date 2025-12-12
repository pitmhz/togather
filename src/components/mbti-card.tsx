"use client";

import { useState, useTransition } from "react";
import { Brain, Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { type ActionState } from "@/app/(authenticated)/profile/actions";

interface MbtiCardProps {
  mbtiType: string | null;
  summary: string | null;
  memberName: string;
  onGenerate: () => Promise<ActionState>;
  canGenerate: boolean;
}

export function MbtiCard({ 
  mbtiType, 
  summary, 
  memberName, 
  onGenerate, 
  canGenerate 
}: MbtiCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    startTransition(async () => {
      const result = await onGenerate();
      if (result?.success) {
        toast.success(result.message);
      } else {
        toast.error(result?.message || "Gagal generate summary.");
      }
    });
  };

  // State A: Empty
  if (!mbtiType) {
    return (
      <div className="p-4 border border-dashed border-gray-200 rounded-lg bg-gray-50/50 flex flex-col items-center justify-center text-center gap-2">
         <Brain className="w-8 h-8 text-gray-300" />
         <p className="text-sm text-gray-500">Belum ada data kepribadian.</p>
      </div>
    );
  }

  // Get Color Theme based on MBTI Group
  const getTheme = (type: string) => {
    const t = type.toUpperCase();
    if (['INTJ', 'INTP', 'ENTJ', 'ENTP'].includes(t)) return { border: 'border-purple-200', bg: 'bg-purple-50', text: 'text-purple-900', icon: 'text-purple-600' }; // Analysts
    if (['INFJ', 'INFP', 'ENFJ', 'ENFP'].includes(t)) return { border: 'border-green-200', bg: 'bg-green-50', text: 'text-green-900', icon: 'text-green-600' }; // Diplomats
    if (['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'].includes(t)) return { border: 'border-blue-200', bg: 'bg-blue-50', text: 'text-blue-900', icon: 'text-blue-600' }; // Sentinels
    if (['ISTP', 'ISFP', 'ESTP', 'ESFP'].includes(t)) return { border: 'border-yellow-200', bg: 'bg-yellow-50', text: 'text-yellow-900', icon: 'text-yellow-600' }; // Explorers
    return { border: 'border-gray-200', bg: 'bg-gray-50', text: 'text-gray-900', icon: 'text-gray-600' };
  };

  const theme = getTheme(mbtiType);

  return (
    <div className={`rounded-xl border ${theme.border} ${theme.bg} overflow-hidden shadow-sm transition-all`}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
           <div>
             <div className="flex items-center gap-2 mb-1">
               <span className={`text-xs font-bold uppercase tracking-wider bg-white/60 px-2 py-0.5 rounded-md ${theme.text}`}>
                 Personality Data
               </span>
             </div>
             <h3 className={`text-3xl font-heading font-bold ${theme.text}`}>
               {mbtiType}
             </h3>
           </div>
           <div className={`p-2 bg-white/50 rounded-lg ${theme.icon}`}>
             <Brain className="w-6 h-6" />
           </div>
        </div>

        {/* State B: Raw Data Only */}
        {!summary && (
           <div className="bg-white/60 rounded-lg p-4 text-center">
             <p className="text-sm text-gray-600 mb-3">
               Belum ada analisa AI untuk tipe ini.
             </p>
             {canGenerate ? (
                <Button 
                  onClick={handleGenerate} 
                  disabled={isPending}
                  size="sm"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md relative overflow-hidden"
                >
                  {isPending ? (
                     <>
                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                       Sedang Menganalisa...
                     </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analisa via AI
                    </>
                  )}
                </Button>
             ) : (
               <p className="text-xs text-gray-400 italic">Hubungi admin untuk generate.</p>
             )}
           </div>
        )}

        {/* State C: Complete */}
        {summary && (
          <div className="prose prose-sm prose-indigo max-w-none">
             <div className="text-sm text-gray-700/90 leading-relaxed whitespace-pre-wrap">
               {summary}
             </div>
             {canGenerate && (
               <div className="mt-4 pt-3 border-t border-black/5 flex justify-end">
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   onClick={handleGenerate}
                   disabled={isPending}
                   className="h-7 text-xs text-gray-400 hover:text-indigo-600"
                 >
                   <RefreshCw className={`w-3 h-3 mr-1.5 ${isPending ? 'animate-spin' : ''}`} />
                   {isPending ? 'Refreshing...' : 'Refresh Analisa'}
                 </Button>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
