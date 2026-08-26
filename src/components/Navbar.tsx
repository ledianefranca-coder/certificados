import React from 'react';
import { 
  Award, 
  Users, 
  Layers, 
  Mail, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingCount?: number;
  studentsCount?: number;
  issuedCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  pendingCount = 0,
  studentsCount = 0,
  issuedCount = 0,
}) => {
  interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    highlight?: boolean;
  }

  const navItems: NavItem[] = [
    { id: 'generator', label: 'Gerar certificado', icon: Award },
    { id: 'students', label: `Alunos (${studentsCount})`, icon: Users },
    { id: 'certificates', label: `Certificados (${issuedCount})`, icon: CheckCircle2 },
    { id: 'templates', label: 'Modelos', icon: Layers },
    { id: 'emails', label: `Enviar por e-mail ${pendingCount > 0 ? `(${pendingCount})` : ''}`, icon: Mail },
    { id: 'validator', label: 'Validar certificado', icon: Sparkles },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div 
            id="brand-logo"
            onClick={() => setActiveTab('generator')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#b6944b] flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-105 transition-transform">
              <Award className="w-6 h-6 text-[#14271d]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">Certifica IET</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Instituição de Ensino de Trânsito da Base Administrativa do QGEx
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Nav Tabs */}
        <div className="flex space-x-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#b6944b] text-[#14271d] font-semibold shadow-sm'
                    : item.highlight
                    ? 'bg-slate-800 text-amber-400 hover:bg-slate-700/80 border border-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
