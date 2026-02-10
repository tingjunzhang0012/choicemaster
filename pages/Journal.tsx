
import React from 'react';
import { DecisionState } from '../types';
import { Calendar, ChevronRight } from 'lucide-react';

interface JournalProps {
  history: DecisionState[];
}

const Journal: React.FC<JournalProps> = ({ history }) => {
  return (
    <div className="px-6 py-4 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">决策日志</h2>
      
      {history.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-300 space-y-2">
          <Calendar size={48} strokeWidth={1} />
          <p className="text-sm font-bold uppercase">暂无决策记录</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((h) => (
            <div key={h.id} className="bg-white p-5 rounded-3xl border border-slate-50 shadow-sm flex items-center gap-4 hover:border-yellow-200 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-amber-500 font-black text-xs ring-1 ring-yellow-100">
                {new Date(h.timestamp).getDate()}
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 tracking-tight">{h.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] bg-yellow-400 text-slate-800 px-2 py-0.5 rounded-full font-black">
                    {h.result?.label}
                  </span>
                  <span className="text-[10px] text-slate-300 font-bold uppercase">
                    {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-200" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Journal;
