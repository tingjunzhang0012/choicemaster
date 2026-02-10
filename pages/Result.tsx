
import React, { useState, useEffect } from 'react';
import { DecisionState } from '../types';
import { RefreshCw, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

interface ResultProps {
  decision: DecisionState;
  onRestart: () => void;
  onFinish: () => void;
  onReject: (optId: string) => void;
}

const Result: React.FC<ResultProps> = ({ decision, onRestart, onFinish, onReject }) => {
  const [ouchTimer, setOuchTimer] = useState(5);
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    if (ouchTimer > 0) {
      const t = setTimeout(() => setOuchTimer(ouchTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [ouchTimer]);

  const handleOuch = () => {
    if (decision.result) {
      setIsRejecting(true);
      setTimeout(() => onReject(decision.result!.id), 500);
    }
  };

  return (
    <div className={`px-6 py-10 flex flex-col items-center justify-center space-y-12 transition-all duration-500 ${isRejecting ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
      <div className="text-center space-y-2">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">最终裁定</p>
        <h2 className="text-5xl font-black text-amber-500 drop-shadow-md tracking-tight">{decision.result?.label}</h2>
      </div>

      {/* Decision Status */}
      <div className="w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl shadow-yellow-100/50 flex flex-col items-center text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <div className="bg-yellow-50 text-amber-500 p-2 rounded-full">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="space-y-4 w-full">
          <p className="text-slate-500 text-xs font-bold leading-relaxed">
            这是基于客观概率与 AI 权重的最优选择。
          </p>
          
          <div className="flex items-center gap-3 justify-center">
            <button 
              className="flex items-center gap-2 text-[10px] font-black text-amber-600 bg-yellow-50 px-3 py-1.5 rounded-lg hover:bg-yellow-100 transition-colors"
              onClick={() => window.open(`https://www.google.com/search?q=${decision.result?.label}`)}
            >
              <ExternalLink size={12} /> 立即搜索并执行
            </button>
          </div>
        </div>

        {ouchTimer > 0 ? (
          <button 
            onClick={handleOuch}
            className="w-full flex items-center justify-center gap-3 bg-slate-50 text-slate-400 border border-slate-100 py-4 rounded-2xl group transition-all hover:bg-amber-50 hover:text-amber-600 hover:border-amber-100"
          >
            <div className="relative">
              <AlertCircle size={20} />
              <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {ouchTimer}
              </div>
            </div>
            <span className="font-bold">Ouch! 我想反悔</span>
          </button>
        ) : (
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest italic">反悔窗口已过期</p>
        )}
      </div>

      <div className="w-full space-y-4">
        <button
          onClick={onFinish}
          className="w-full h-14 bg-yellow-400 text-slate-800 rounded-2xl font-black shadow-lg shadow-yellow-100 transition-all active:scale-[0.98]"
        >
          确定执行
        </button>
        <button
          onClick={onRestart}
          className="w-full h-14 flex items-center justify-center gap-2 text-slate-400 font-bold hover:text-amber-500 transition-colors"
        >
          <RefreshCw size={18} /> 还是重来一遍吧
        </button>
      </div>
    </div>
  );
};

export default Result;
