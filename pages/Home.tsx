
import React from 'react';
import { DecisionState, Option } from '../types';
import { PlusCircle, Utensils, ShoppingCart, HelpCircle, ChevronRight } from 'lucide-react';

interface HomeProps {
  onStart: (title?: string, options?: Option[]) => void;
  history: DecisionState[];
}

const Home: React.FC<HomeProps> = ({ onStart, history }) => {
  const savedMinutes = history.length * 5; // Assume 5 mins saved per decision

  const templates = [
    { title: '中午吃什么', icon: <Utensils size={18} />, options: ['火锅', '日料', '粤菜', '汉堡', '麻辣烫', '减脂餐'] },
    { title: '买不买', icon: <ShoppingCart size={18} />, options: ['买买买', '算了，省钱', '再等三天', '看看闲鱼'] },
    { title: '谁去拿外卖', icon: <HelpCircle size={18} />, options: ['我本人', '你本人', '剪刀石头布', '随机点名'] },
  ];

  return (
    <div className="px-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Board */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-50">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">今日已决策</p>
          <p className="text-2xl font-black text-slate-800 mt-1">{history.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-3xl border border-yellow-100">
          <p className="text-amber-600 text-xs font-medium uppercase tracking-wider">节省时间</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-amber-500">{savedMinutes}</span>
            <span className="text-amber-400 text-xs font-bold">min</span>
          </div>
        </div>
      </div>

      {/* Main Action */}
      <div className="flex flex-col items-center justify-center py-10">
        <button 
          onClick={() => onStart()}
          className="group relative w-48 h-48 rounded-full bg-yellow-400 flex items-center justify-center shadow-2xl shadow-yellow-200 transition-all active:scale-95"
        >
          <div className="absolute inset-0 rounded-full border-4 border-yellow-200/50 scale-110 group-hover:scale-125 transition-transform duration-700 animate-pulse" />
          <div className="flex flex-col items-center text-slate-800">
            <PlusCircle size={40} strokeWidth={2.5} />
            <span className="mt-2 font-black text-lg">开始决策</span>
          </div>
        </button>
      </div>

      {/* Templates */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-800">快捷模板</h2>
          <button className="text-xs text-amber-500 font-bold flex items-center gap-0.5">
            查看更多 <ChevronRight size={14} />
          </button>
        </div>
        <div className="space-y-3">
          {templates.map((t, idx) => (
            <button
              key={idx}
              onClick={() => onStart(t.title, t.options.map(label => ({ id: Math.random().toString(), label, weight: 1 })))}
              className="w-full flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 hover:border-yellow-200 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-amber-500">
                {t.icon}
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-slate-800">{t.title}</p>
                <p className="text-[10px] text-slate-400 font-medium">{t.options.join(', ')}</p>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
