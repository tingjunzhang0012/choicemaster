
import React from 'react';
import { Page } from '../types';
import { Users, Brain, Scan, ChevronRight, Zap } from 'lucide-react';

interface LabProps {
  onNavigate: (page: Page) => void;
}

const Lab: React.FC<LabProps> = ({ onNavigate }) => {
  const experiments = [
    {
      id: 'team-decision',
      title: '多人盲盒',
      desc: 'Socket.io 驱动的实时剔除模式，找出大家共同的交集。',
      icon: <Users size={24} />,
      color: 'bg-yellow-400',
      tag: 'HOT'
    },
    {
      id: 'ai-加权',
      title: '心理扫描',
      desc: '利用 Gemini 深度分析选项背后的心理驱动力。',
      icon: <Brain size={24} />,
      color: 'bg-slate-800',
      tag: 'BETA'
    },
    {
      id: 'subconscious',
      title: '潜意识快照',
      desc: '捕捉瞬间表情反馈，判定你是否真心满意。',
      icon: <Scan size={24} />,
      color: 'bg-slate-800',
      tag: 'OFFLINE'
    }
  ];

  return (
    <div className="px-6 py-6 space-y-8 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-slate-800">决策实验室</h2>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">进阶决策算法与社交同步</p>
      </div>

      <div className="space-y-4">
        {experiments.map((exp) => (
          <button
            key={exp.id}
            onClick={() => exp.id === 'team-decision' && onNavigate('team-decision')}
            className="w-full relative group text-left"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-3xl blur opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white p-6 rounded-3xl border border-slate-50 flex items-start gap-5 shadow-sm">
              <div className={`w-14 h-14 rounded-2xl ${exp.color} text-white flex items-center justify-center shadow-lg shadow-yellow-100`}>
                {exp.icon}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-800">{exp.title}</span>
                  {exp.tag && (
                    <span className="text-[8px] bg-yellow-100 text-amber-600 px-1.5 py-0.5 rounded-full font-black">
                      {exp.tag}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  {exp.desc}
                </p>
              </div>
              <div className="self-center text-slate-200 group-hover:text-yellow-400 transition-colors">
                <ChevronRight size={20} />
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-slate-800 rounded-3xl p-6 text-white overflow-hidden relative">
        <Zap className="absolute -right-4 -bottom-4 text-slate-700 opacity-50" size={100} />
        <div className="relative z-10 space-y-2">
          <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest">PRO 计划</p>
          <p className="text-lg font-black">解锁 AI 全量决策引擎</p>
          <button className="bg-yellow-400 text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase mt-2">
            了解更多
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lab;
