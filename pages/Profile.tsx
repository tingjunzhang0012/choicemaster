
import React from 'react';
import { DecisionState } from '../types';
import { Trophy, Award, Settings, Shield } from 'lucide-react';

interface ProfileProps {
  history: DecisionState[];
}

const Profile: React.FC<ProfileProps> = ({ history }) => {
  const level = Math.floor(history.length / 5) + 1;
  const progress = (history.length % 5) * 20;

  return (
    <div className="px-6 py-4 space-y-8">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mt-4">
        <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl bg-yellow-50 flex items-center justify-center text-amber-500 overflow-hidden ring-4 ring-yellow-50">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${history.length}`} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-800">抉择见习生</h2>
          <div className="flex items-center gap-2">
             <span className="text-[10px] bg-slate-800 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Lv. {level}</span>
             <span className="text-[10px] text-slate-400 font-bold uppercase">距离下个等级还差 {5 - (history.length % 5)}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50 space-y-3">
        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span>成长进度</span>
          <span className="text-amber-500">{progress}%</span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-400 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Achievements Grid */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">成就勋章</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: <Trophy size={20} />, name: '初试啼声', active: history.length >= 1 },
            { icon: <Shield size={20} />, name: '不再纠结', active: history.length >= 5 },
            { icon: <Award size={20} />, name: '决策大师', active: history.length >= 10 },
            { icon: <Award size={20} />, name: '效率之神', active: history.length >= 20 },
          ].map((a, i) => (
            <div key={i} className={`flex flex-col items-center gap-2 transition-all duration-500 ${a.active ? 'opacity-100 scale-100' : 'opacity-20 grayscale scale-90'}`}>
              <div className="w-12 h-12 rounded-2xl bg-yellow-50 text-amber-500 flex items-center justify-center shadow-sm ring-1 ring-yellow-100">
                {a.icon}
              </div>
              <span className="text-[8px] font-black text-slate-500 text-center leading-tight">{a.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Settings List */}
      <section className="space-y-3">
        <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-50 shadow-sm text-slate-600 font-bold text-sm">
          <div className="flex items-center gap-3">
            <Settings size={18} className="text-slate-400" /> 偏好设置
          </div>
          <div className="text-[10px] text-slate-300 font-black uppercase">模式/通知</div>
        </button>
      </section>
    </div>
  );
};

export default Profile;
