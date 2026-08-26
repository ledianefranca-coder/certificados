import React, { useState } from 'react';
import { 
  Github, 
  ExternalLink, 
  Copy, 
  Check, 
  Terminal, 
  Sparkles, 
  Layers, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export const VercelDeployGuide: React.FC = () => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedGit, setCopiedGit] = useState(false);

  const vercelProjectUrl = 'https://gerar-certificado-pro.vercel.app';
  const githubRepoUrl = 'https://github.com/ledianefranca/gerar-certificado-em-massa';

  const handleCopyVercel = () => {
    navigator.clipboard.writeText(vercelProjectUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyGithub = () => {
    navigator.clipboard.writeText(githubRepoUrl);
    setCopiedGit(true);
    setTimeout(() => setCopiedGit(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-white">
      {/* Hero Deploy Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-8 rounded-2xl shadow-xl text-center space-y-4">
        <div className="inline-flex p-3 bg-indigo-500/20 text-indigo-300 rounded-2xl border border-indigo-500/30">
          <Github className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Hospedagem &amp; Deploy: GitHub &amp; Vercel
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          O projeto foi projetado com arquitetura SPA otimizada em React, Vite e TypeScript, pronto para deploy instantâneo na Vercel com CDN global de ultra-baixa latência.
        </p>

        {/* Action Link Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-4 text-left">
          {/* Vercel Live Production URL */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-emerald-400">Link do Projeto Vercel</span>
              <button onClick={handleCopyVercel} className="text-slate-400 hover:text-white text-xs">
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <a
              href={vercelProjectUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-bold text-amber-400 hover:underline flex items-center space-x-1 truncate"
            >
              <span>{vercelProjectUrl}</span>
              <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
            </a>
          </div>

          {/* GitHub Repository URL */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400">Repositório GitHub</span>
              <button onClick={handleCopyGithub} className="text-slate-400 hover:text-white text-xs">
                {copiedGit ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <a
              href={githubRepoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-bold text-indigo-300 hover:underline flex items-center space-x-1 truncate"
            >
              <span>github.com/.../gerar-certificado</span>
              <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
            </a>
          </div>
        </div>
      </div>

      {/* Step by Step Deploy Guide */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Layers className="w-5 h-5 text-amber-400" />
          <span>Passo a Passo para Deploy em Produção</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h4 className="font-bold text-sm text-white">Exportar p/ GitHub</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No menu superior do Google AI Studio, clique em <strong>Export &gt; GitHub</strong> para criar seu repositório sincronizado.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h4 className="font-bold text-sm text-white">Importar na Vercel</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Acesse <strong>vercel.com/new</strong> e conecte sua conta do GitHub para selecionar o repositório <code>gerar-certificado-em-massa</code>.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h4 className="font-bold text-sm text-white">Build &amp; Deploy</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              A Vercel detecta automaticamente o <strong>Vite</strong>. Basta clicar em <strong>Deploy</strong> para obter seu domínio <code>.vercel.app</code> ativo em 30 segundos.
            </p>
          </div>
        </div>

        {/* Build Commands Info */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs text-slate-300">
          <p className="text-slate-500">// Comandos de Build de Produção:</p>
          <p className="text-amber-400">npm run build</p>
          <p className="text-slate-500">// Diretório de Saída (Output Directory):</p>
          <p className="text-emerald-400">dist</p>
        </div>
      </div>
    </div>
  );
};
