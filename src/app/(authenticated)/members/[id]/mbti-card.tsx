"use client";

import { useState, useEffect } from "react";
import { Brain, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getMBTISummary, getMBTIColorClass } from "@/lib/constants/mbti-summaries";
import { getRandomMBTIJoke } from "@/lib/constants/mbti-placeholders";

type MBTICardProps = {
    mbti: string | null;
    memberName: string;
};

export function MBTICard({ mbti, memberName }: MBTICardProps) {
    const [joke, setJoke] = useState<string>("");

    // Client-side only random selection to prevent hydration mismatch
    useEffect(() => {
        if (!mbti) {
            setJoke(getRandomMBTIJoke());
        }
    }, [mbti]);

    // If MBTI exists, show the summary
    if (mbti) {
        const mbtiSummary = getMBTISummary(mbti);
        const mbtiColorClass = getMBTIColorClass(mbti);

        if (!mbtiSummary) return null;

        return (
            <Card className="shadow-sm border-neutral-100 rounded-2xl overflow-hidden py-0">
                <CardContent className="p-0">
                    {/* MBTI Header */}
                    <div className={`px-5 py-4 ${mbtiColorClass} flex items-center gap-3`}>
                        <Brain className="w-6 h-6" />
                        <div>
                            <p className="font-bold text-lg">{mbti}</p>
                            <p className="text-sm opacity-80">{mbtiSummary.title}</p>
                        </div>
                    </div>

                    {/* MBTI Summary */}
                    <div className="px-5 py-4 space-y-4">
                        <p className="text-sm text-neutral-600 leading-relaxed">
                            {mbtiSummary.summary}
                        </p>

                        {/* Strengths */}
                        <div className="flex flex-wrap gap-2">
                            {mbtiSummary.strengths.map((strength) => (
                                <span
                                    key={strength}
                                    className="px-2.5 py-1 text-xs bg-neutral-100 text-neutral-600 rounded-full"
                                >
                                    {strength}
                                </span>
                            ))}
                        </div>

                        {/* Community Insight */}
                        <div className="pt-3 border-t border-neutral-100">
                            <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1.5">
                                Dalam Komunitas
                            </p>
                            <p className="text-sm text-neutral-700 leading-relaxed">
                                {mbtiSummary.inCommunity}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Empty state with playful joke
    return (
        <Card className="shadow-sm border-neutral-100 rounded-2xl overflow-hidden py-0">
            <CardContent className="p-0">
                {/* Header */}
                <div className="px-5 py-4 bg-neutral-100 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-neutral-400" />
                    <div>
                        <p className="font-bold text-lg text-neutral-600">MBTI?</p>
                        <p className="text-sm text-neutral-500">Kepribadian Belum Diisi</p>
                    </div>
                </div>

                {/* Joke Quote */}
                <div className="px-5 py-4">
                    <div className="bg-neutral-50 rounded-xl p-4">
                        <p className="text-sm text-neutral-500 italic leading-relaxed">
                            "{joke || "Loading quote..."}"
                        </p>
                        <p className="text-xs text-neutral-400 mt-2 text-right">
                            — {memberName.split(" ")[0]}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
