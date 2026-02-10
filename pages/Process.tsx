
import React, { useState, useEffect, useRef } from 'react';
import { DecisionState, Option, DecisionMode } from '../types';
import DecisionWheel from '../components/DecisionWheel';
import { Zap, Sparkles } from 'lucide-react';
import { getAIWeightedOptions } from '../services/geminiService';

interface ProcessProps {
  decision: DecisionState;
  onComplete: (d: DecisionState) => void;
}

const Process: React.FC<ProcessProps> = ({ decision, onComplete }) => {
  const [spinning, setSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [weightedOptions, setWeightedOptions] = useState<Option[]>(decision.options);
  const [targetIdx, setTargetIdx] = useState<number | undefined>();

  useEffect(() => {
    // Initial prep
    const prep = async () => {
      if (decision.mode === DecisionMode.AI_WEIGHTED) {
        setLoading(true);
        const context = {
          time: new Date().toLocaleTimeString(),
          weather: 'Rainy' // Mocked for demo
        };
        const updated = await getAIWeightedOptions(decision.options, context);
        setWeightedOptions(updated);
        setLoading(false);
      }
    };
    prep();
  }, [decision.mode, decision.options]);

  const handleStartSpin = () => {
    if (spinning) return;
    
    // Calculate winning index based on weights
    const totalWeight = weightedOptions.reduce((acc, opt) => acc + (opt.weight || 1), 0);
    let random = Math.random() * totalWeight;
    let winnerIdx = 0;
    
    for (let i = 0; i < weightedOptions.length; i++) {
      random -= (weightedOptions[i].weight || 1);
      if (random <= 0) {
        winnerIdx = i;
        break;
      }
    }

    setTargetIdx(winnerIdx);
    setSpinning(true);
  };

  const handleFinish = (winner: Option) => {
    onComplete({ ...decision, result: winner });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-8 p-6 animate-in zoom-in-95 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">{decision.title}</h2>
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-amber-500 animate-pulse">
            <Zap size={16} /> <span className="text-[10px] font-black uppercase">AI 注入灵魂权重中...</span>
          </div>
        ) : (
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">命运之轮即将开启</p>
        )}
      </div>

      {/* Decorative Icon instead of Camera */}
      <div className="relative w-24 h-24 rounded-full flex items-center justify-center border-4 border-white shadow-xl bg-yellow-50 ring-4 ring-yellow-100">
        <Sparkles size={40} className="text-amber-400 animate-pulse" />
        <div className="absolute bottom-0 left-0 right-0 bg-yellow-400 text-[8px] text-center text-slate-800 font-black py-0.5 uppercase tracking-widest">
          决策计算中
        </div>
      </div>

      <div className="relative">
        <DecisionWheel 
          options={weightedOptions} 
          spinning={spinning} 
          onFinished={handleFinish} 
          targetIndex={targetIdx}
        />
        
        {!spinning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button 
              onClick={handleStartSpin}
              className="pointer-events-auto w-20 h-20 rounded-full bg-yellow-400 text-slate-800 font-black text-sm shadow-xl animate-bounce hover:scale-110 transition-transform flex items-center justify-center ring-4 ring-white"
            >
              GO!
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-4 text-center px-4">
        <p className="text-[10px] text-slate-400 font-bold leading-relaxed italic">
          "相信直觉，让 ChoiceMaster 帮你终结纠结。"
        </p>
        {decision.mode === DecisionMode.AI_WEIGHTED && (
          <div className="text-[10px] text-amber-600 border border-yellow-200 px-3 py-1 rounded-full bg-yellow-50 font-bold">
            由于当前上下文环境，权重已智能动态平衡
          </div>
        )}
      </div>
    </div>
  );
};

export default Process;
