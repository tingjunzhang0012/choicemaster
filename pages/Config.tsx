
import React, { useState } from 'react';
import { DecisionState, Option, DecisionMode } from '../types';
import { X, Plus, Info, Zap, ShieldCheck, Scale } from 'lucide-react';

interface ConfigProps {
  decision: DecisionState;
  onUpdate: (d: DecisionState) => void;
  onConfirm: () => void;
  timeSpent: number;
}

const Config: React.FC<ConfigProps> = ({ decision, onUpdate, onConfirm, timeSpent }) => {
  const [newOptionLabel, setNewOptionLabel] = useState('');

  const addOption = () => {
    if (!newOptionLabel.trim()) return;
    const newOpt: Option = {
      id: Math.random().toString(36).substr(2, 9),
      label: newOptionLabel.trim(),
      weight: 1.0
    };
    onUpdate({ ...decision, options: [...decision.options, newOpt] });
    setNewOptionLabel('');
  };

  const removeOption = (id: string) => {
    onUpdate({ ...decision, options: decision.options.filter(o => o.id !== id) });
  };

  const modes = [
    { id: DecisionMode.STANDARD, name: '标准模式', icon: <Scale size={18} />, desc: '纯随机均匀概率' },
    { id: DecisionMode.AI_WEIGHTED, name: 'AI 加权', icon: <Zap size={18} />, desc: '基于天气/时间的智能权重调整' },
    { id: DecisionMode.COMMITMENT, name: '承诺模式', icon: <ShieldCheck size={18} />, desc: '开启决策任务，不可反悔' },
  ];

  const canProceed = decision.options.length >= 2;

  return (
    <div className="px-6 py-4 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 pb-10">
      {/* Title Header */}
      <div>
        <input 
          type="text"
          value={decision.title}
          onChange={(e) => onUpdate({...decision, title: e.target.value})}
          className="bg-transparent border-none text-2xl font-black text-slate-800 w-full focus:ring-0 placeholder:text-slate-300"
          placeholder="给这次抉择起个名字..."
        />
        <p className="text-[10px] text-amber-600 font-bold mt-1 flex items-center gap-1">
          <Info size={12} /> 已沉思 {Math.floor(timeSpent / 60)}分{timeSpent % 60}秒，时间就是金钱！
        </p>
      </div>

      {/* Options List */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">我的选项</label>
        <div className="space-y-2">
          {decision.options.map((opt) => (
            <div key={opt.id} className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl border border-slate-100">
              <span className="flex-1 font-bold text-slate-700">{opt.label}</span>
              <button onClick={() => removeOption(opt.id)} className="text-slate-300 hover:text-amber-500">
                <X size={18} />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2 bg-slate-100/50 px-4 py-3 rounded-2xl border border-dashed border-slate-200">
            <input 
              type="text"
              value={newOptionLabel}
              onChange={(e) => setNewOptionLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addOption()}
              placeholder="添加新选项..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium"
            />
            <button 
              onClick={addOption}
              className="p-1 rounded-full bg-yellow-400 text-slate-800 shadow-sm disabled:bg-slate-300"
              disabled={!newOptionLabel.trim()}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">决策模式</label>
        <div className="grid grid-cols-1 gap-2">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => onUpdate({ ...decision, mode: m.id })}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                decision.mode === m.id 
                  ? 'border-yellow-400 bg-yellow-50 ring-2 ring-yellow-400 ring-offset-2' 
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                decision.mode === m.id ? 'bg-yellow-400 text-slate-800' : 'bg-slate-50 text-slate-400'
              }`}>
                {m.icon}
              </div>
              <div className="flex-1 text-left">
                <p className={`font-black ${decision.mode === m.id ? 'text-amber-700' : 'text-slate-800'}`}>{m.name}</p>
                <p className="text-[10px] text-slate-400 font-bold">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="sticky bottom-0 pt-4 bg-slate-50">
        <button
          onClick={onConfirm}
          disabled={!canProceed}
          className="w-full h-14 bg-yellow-400 text-slate-800 rounded-2xl font-black shadow-lg shadow-yellow-200 active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none transition-all"
        >
          {canProceed ? '准备好了，开摇！' : '至少添加两个选项'}
        </button>
      </div>
    </div>
  );
};

export default Config;
