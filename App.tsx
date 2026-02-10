
import React, { useState, useEffect } from 'react';
import { Page, DecisionState, DecisionMode, Option } from './types';
import Home from './pages/Home';
import Config from './pages/Config';
import Process from './pages/Process';
import Result from './pages/Result';
import Journal from './pages/Journal';
import Profile from './pages/Profile';
import Lab from './pages/Lab';
import TeamDecision from './pages/TeamDecision';
import { Home as HomeIcon, FlaskConical, ClipboardList, User } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [decision, setDecision] = useState<DecisionState | null>(null);
  const [history, setHistory] = useState<DecisionState[]>([]);
  const [timeSpent, setTimeSpent] = useState(0); 

  useEffect(() => {
    let interval: any;
    if (currentPage === 'config' || currentPage === 'process') {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentPage]);

  const startNewDecision = (templateTitle?: string, initialOptions?: Option[]) => {
    const newDecision: DecisionState = {
      id: Math.random().toString(36).substr(2, 9),
      title: templateTitle || '新抉择',
      options: initialOptions || [],
      mode: DecisionMode.STANDARD,
      timestamp: Date.now()
    };
    setDecision(newDecision);
    setCurrentPage('config');
  };

  const handleDecisionComplete = (finalDecision: DecisionState) => {
    setHistory(prev => [finalDecision, ...prev]);
    setDecision(finalDecision);
    setCurrentPage('result');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onStart={startNewDecision} history={history} />;
      case 'config':
        return decision ? (
          <Config 
            decision={decision} 
            onUpdate={setDecision} 
            onConfirm={() => setCurrentPage('process')}
            timeSpent={timeSpent}
          />
        ) : null;
      case 'process':
        return decision ? (
          <Process 
            decision={decision} 
            onComplete={handleDecisionComplete} 
          />
        ) : null;
      case 'result':
        return decision ? (
          <Result 
            decision={decision} 
            onRestart={() => setCurrentPage('config')}
            onFinish={() => setCurrentPage('home')}
            onReject={(optId) => {
              const updatedOptions = decision.options.filter(o => o.id !== optId);
              setDecision({ ...decision, options: updatedOptions, result: undefined });
              setCurrentPage('config');
            }}
          />
        ) : null;
      case 'journal':
        return <Journal history={history} />;
      case 'profile':
        return <Profile history={history} />;
      case 'lab':
        return <Lab onNavigate={setCurrentPage} />;
      case 'team-decision':
        return <TeamDecision onFinish={() => setCurrentPage('home')} />;
      default:
        return <Home onStart={startNewDecision} history={history} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 overflow-hidden relative shadow-2xl">
      <header className="px-6 pt-6 pb-2 glass-morphism sticky top-0 z-50 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">ChoiceMaster</h1>
        {timeSpent > 120 && (currentPage === 'config') && (
          <div className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
            已耗时 {Math.floor(timeSpent / 60)}分
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {renderPage()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 bg-white/90 backdrop-blur-md border-t border-slate-100 flex items-center justify-around px-4 z-50">
        <button 
          onClick={() => setCurrentPage('home')}
          className={`flex flex-col items-center gap-1 ${currentPage === 'home' ? 'text-amber-500' : 'text-slate-400'}`}
        >
          <HomeIcon size={24} />
          <span className="text-[10px] font-bold">抉择</span>
        </button>
        <button 
          onClick={() => setCurrentPage('lab')}
          className={`flex flex-col items-center gap-1 ${(currentPage === 'lab' || currentPage === 'team-decision') ? 'text-amber-500' : 'text-slate-400'}`}
        >
          <FlaskConical size={24} />
          <span className="text-[10px] font-bold">实验室</span>
        </button>
        <button 
          onClick={() => setCurrentPage('journal')}
          className={`flex flex-col items-center gap-1 ${currentPage === 'journal' ? 'text-amber-500' : 'text-slate-400'}`}
        >
          <ClipboardList size={24} />
          <span className="text-[10px] font-bold">日志</span>
        </button>
        <button 
          onClick={() => setCurrentPage('profile')}
          className={`flex flex-col items-center gap-1 ${currentPage === 'profile' ? 'text-amber-500' : 'text-slate-400'}`}
        >
          <User size={24} />
          <span className="text-[10px] font-bold">我的</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
