
import React, { useState, useEffect } from 'react';
import { Option } from '../types';
import { Users, LogOut, Copy, Check, Trash2, Send, Trophy, ArrowLeft } from 'lucide-react';

interface TeamDecisionProps {
  onFinish: () => void;
}

const TeamDecision: React.FC<TeamDecisionProps> = ({ onFinish }) => {
  const [step, setStep] = useState<'entry' | 'lobby' | 'voting' | 'result'>('entry');
  const [roomId, setRoomId] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [options, setOptions] = useState<Option[]>([
    { id: '1', label: '麻辣香锅', weight: 1, vetoCount: 0 },
    { id: '2', label: '麦当劳', weight: 1, vetoCount: 0 },
    { id: '3', label: '萨莉亚', weight: 1, vetoCount: 0 },
    { id: '4', label: '和府捞面', weight: 1, vetoCount: 0 }
  ]);
  const [participants, setParticipants] = useState<string[]>(['我 (房主)']);
  const [myVetoes, setMyVetoes] = useState<Set<string>>(new Set());
  const [finalResult, setFinalResult] = useState<Option | null>(null);

  // Simulation: Mock "someone joined"
  useEffect(() => {
    if (step === 'lobby' && isHost) {
      const timer = setTimeout(() => {
        setParticipants(prev => [...prev, '小王', '阿强', '露西']);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step, isHost]);

  // Simulation: Mock "others voting"
  useEffect(() => {
    if (step === 'voting') {
      const interval = setInterval(() => {
        setOptions(prev => {
          const newOpts = [...prev];
          const randomIdx = Math.floor(Math.random() * newOpts.length);
          newOpts[randomIdx] = { 
            ...newOpts[randomIdx], 
            vetoCount: (newOpts[randomIdx].vetoCount || 0) + 1 
          };
          return newOpts;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [step]);

  const createRoom = () => {
    const id = Math.random().toString(36).substring(2, 7).toUpperCase();
    setRoomId(id);
    setIsHost(true);
    setStep('lobby');
  };

  const joinRoom = () => {
    if (roomId.length === 5) {
      setIsHost(false);
      setParticipants(['房主', '我']);
      setStep('lobby');
    }
  };

  const toggleVeto = (id: string) => {
    const newVetoes = new Set(myVetoes);
    if (newVetoes.has(id)) {
      newVetoes.delete(id);
      // Decrease count in state
      setOptions(prev => prev.map(o => o.id === id ? { ...o, vetoCount: Math.max(0, (o.vetoCount || 0) - 1) } : o));
    } else {
      newVetoes.add(id);
      // Increase count in state
      setOptions(prev => prev.map(o => o.id === id ? { ...o, vetoCount: (o.vetoCount || 0) + 1 } : o));
    }
    setMyVetoes(newVetoes);
  };

  const finalizeDecision = () => {
    // Decision logic: pick from options with the least vetoes
    const sorted = [...options].sort((a, b) => (a.vetoCount || 0) - (b.vetoCount || 0));
    const minVetoes = sorted[0].vetoCount || 0;
    const candidates = sorted.filter(o => (o.vetoCount || 0) === minVetoes);
    const winner = candidates[Math.floor(Math.random() * candidates.length)];
    
    setFinalResult(winner);
    setStep('result');
  };

  return (
    <div className="min-h-full bg-slate-50 flex flex-col animate-in slide-in-from-right-4 duration-300 pb-10">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100">
        <button onClick={onFinish} className="text-slate-400 hover:text-slate-800 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <span className="font-black text-slate-800">多人盲盒 {roomId && `#${roomId}`}</span>
        <div className="w-5" />
      </div>

      <div className="flex-1 px-6 pt-8 space-y-6 overflow-y-auto no-scrollbar">
        
        {step === 'entry' && (
          <div className="space-y-10 py-10">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 bg-yellow-400 rounded-3xl mx-auto flex items-center justify-center text-slate-800 shadow-xl shadow-yellow-100">
                <Users size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-800 pt-4">多人实时同步</h3>
              <p className="text-xs text-slate-400 font-medium">所有人各自划掉不想要的选项，</p>
              <p className="text-xs text-slate-400 font-medium">系统将从重叠结果中随机抽取。</p>
            </div>

            <div className="space-y-4">
              <button onClick={createRoom} className="w-full h-14 bg-yellow-400 text-slate-800 rounded-2xl font-black shadow-lg">
                创建新房间
              </button>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center text-slate-300">#</div>
                <input 
                  type="text" 
                  maxLength={5}
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  placeholder="输入房间号进入"
                  className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-10 font-bold text-slate-800 focus:ring-2 focus:ring-yellow-400 outline-none"
                />
                <button 
                  onClick={joinRoom}
                  disabled={roomId.length !== 5}
                  className="absolute right-2 top-2 h-10 px-4 bg-slate-800 text-white rounded-xl text-xs font-black disabled:bg-slate-200 transition-colors"
                >
                  JOIN
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'lobby' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">待命成员 ({participants.length})</span>
                <span className="text-[10px] text-yellow-500 font-bold flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span> 成员进入中
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {participants.map((p, i) => (
                  <div key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600">
                    {p}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-800">选项预览</h4>
              <div className="space-y-2">
                {options.map(opt => (
                  <div key={opt.id} className="p-4 bg-white rounded-2xl border border-slate-50 shadow-sm text-sm font-bold text-slate-700">
                    {opt.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="fixed bottom-24 left-6 right-6 max-w-md mx-auto">
              {isHost ? (
                <button onClick={() => setStep('voting')} className="w-full h-14 bg-yellow-400 text-slate-800 rounded-2xl font-black shadow-lg">
                  全员开始投票
                </button>
              ) : (
                <div className="text-center p-4 bg-slate-200 rounded-2xl text-slate-400 font-bold text-xs animate-pulse">
                  等待房主开启投票...
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'voting' && (
          <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-800">划掉你不想吃的！</h3>
              <p className="text-[10px] text-slate-400 font-bold">同步剔除，剩下的交给命运</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {options.map((opt) => {
                const isVetoedByMe = myVetoes.has(opt.id);
                const totalVetoes = opt.vetoCount || 0;
                
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleVeto(opt.id)}
                    className={`relative p-5 rounded-3xl border-2 transition-all flex items-center justify-between ${
                      isVetoedByMe 
                        ? 'bg-slate-100 border-slate-200 opacity-60' 
                        : 'bg-white border-white shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${isVetoedByMe ? 'bg-slate-300' : 'bg-yellow-400 shadow-sm shadow-yellow-200'}`} />
                      <span className={`font-black text-base ${isVetoedByMe ? 'line-through text-slate-400 italic' : 'text-slate-700'}`}>
                        {opt.label}
                      </span>
                    </div>
                    
                    {totalVetoes > 0 && (
                      <div className="flex -space-x-1">
                        {Array.from({ length: Math.min(totalVetoes, 3) }).map((_, idx) => (
                          <div key={idx} className="w-5 h-5 rounded-full bg-slate-800 border-2 border-white flex items-center justify-center text-[6px] text-white font-black">
                            {idx === 2 && totalVetoes > 3 ? `+${totalVetoes-2}` : 'V'}
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="fixed bottom-24 left-6 right-6 max-w-md mx-auto">
              {isHost ? (
                <button onClick={finalizeDecision} className="w-full h-14 bg-slate-800 text-white rounded-2xl font-black shadow-lg flex items-center justify-center gap-2">
                  <Send size={18} /> 结束投票并结算
                </button>
              ) : (
                <div className="text-center p-4 bg-white rounded-2xl text-slate-400 font-bold text-xs border border-slate-100">
                  等待房主结算结果...
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'result' && finalResult && (
          <div className="py-10 space-y-10 animate-in zoom-in-95 duration-700">
            <div className="text-center space-y-6">
              <div className="relative inline-block">
                <div className="absolute -inset-4 bg-yellow-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <div className="relative w-32 h-32 bg-yellow-400 rounded-full mx-auto flex items-center justify-center text-slate-800 shadow-2xl">
                  <Trophy size={60} strokeWidth={2.5} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">全员共识结果</p>
                <h3 className="text-5xl font-black text-amber-500 tracking-tighter">{finalResult.label}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <p className="text-center text-[10px] font-black text-slate-300 uppercase">剔除数据分布</p>
              <div className="space-y-3">
                {options.map(opt => (
                   <div key={opt.id} className="flex items-center gap-3">
                      <div className="w-16 text-[10px] font-bold text-slate-400 truncate">{opt.label}</div>
                      <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${opt.id === finalResult.id ? 'bg-yellow-400' : 'bg-slate-200'} transition-all duration-1000`}
                          style={{ width: `${((opt.vetoCount || 0) / participants.length) * 100}%` }}
                        />
                      </div>
                      <div className="text-[10px] font-black text-slate-300">{opt.vetoCount} 弃</div>
                   </div>
                ))}
              </div>
            </div>

            <button onClick={onFinish} className="w-full h-14 bg-slate-800 text-white rounded-2xl font-black shadow-lg">
              完成决策
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default TeamDecision;
