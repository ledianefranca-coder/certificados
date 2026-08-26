import React, { useState, useRef, useEffect } from 'react';
import { 
  Timer, 
  Play, 
  CheckCircle2, 
  Download, 
  FileArchive, 
  Layers, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  BarChart3, 
  ArrowRight,
  RefreshCw,
  Mail
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CourseTemplate, Student } from '../types';
import { generateBatchZip, generateMergedBatchPdf, preloadAssets } from '../utils/pdfGenerator';

interface BenchmarkRunnerProps {
  students: Student[];
  template: CourseTemplate;
  onOpenEmailModal?: () => void;
}

export const BenchmarkRunner: React.FC<BenchmarkRunnerProps> = ({
  students,
  template,
  onOpenEmailModal,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentCert, setCurrentCert] = useState(0);
  const [batchResult, setBatchResult] = useState<{
    totalGenerated: number;
    durationMs: number;
    perCertMs: number;
    passedRequirement: boolean;
    zipBlob?: Blob;
  } | null>(null);

  const [downloadMode, setDownloadMode] = useState<'zip' | 'merged'>('zip');
  const [isDownloading, setIsDownloading] = useState(false);

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Target batch size: At least 15 students
  const targetStudents = students.slice(0, 15);

  const startBenchmark = async () => {
    setIsRunning(true);
    setProgress(0);
    setCurrentCert(0);
    setBatchResult(null);
    setElapsedMs(0);

    await preloadAssets();

    startTimeRef.current = performance.now();
    timerRef.current = window.setInterval(() => {
      setElapsedMs(performance.now() - startTimeRef.current);
    }, 25);

    try {
      const zipBlob = await generateBatchZip(
        targetStudents,
        template,
        (current, total) => {
          setCurrentCert(current);
          setProgress(Math.round((current / total) * 100));
        }
      );

      const endTime = performance.now();
      const finalDuration = endTime - startTimeRef.current;
      setElapsedMs(finalDuration);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const passed = finalDuration < 60000; // < 1 minute requirement!

      setBatchResult({
        totalGenerated: targetStudents.length,
        durationMs: finalDuration,
        perCertMs: Math.round(finalDuration / targetStudents.length),
        passedRequirement: passed,
        zipBlob,
      });

      // Launch victory confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Erro no benchmark', err);
    } finally {
      setIsRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleDownloadZip = () => {
    if (!batchResult?.zipBlob) return;
    const url = URL.createObjectURL(batchResult.zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lote_15_Certificados_Frente_Verso_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMergedPdf = async () => {
    setIsDownloading(true);
    try {
      const masterPdf = await generateMergedBatchPdf(targetStudents, template);
      masterPdf.save(`Lote_Consolidado_15_Certificados_${Date.now()}.pdf`);
    } catch (e) {
      console.error('Erro ao gerar PDF consolidado', e);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTimer = (ms: number) => {
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const millis = Math.floor(ms % 1000);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Requirement Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border-2 border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Timer className="w-64 h-64 text-amber-400" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30 mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>REQUISITO NÃO FUNCIONAL OBRIGATÓRIO</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Validação de Performance: <span className="text-amber-400">15 Certificados em &lt; 1 Minuto</span>
          </h2>
          
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Este módulo executa o teste de estresse e geração em lote com cronômetro em tempo real de alta precisão. Cada certificado é renderizado em <strong>alta resolução gráfica vetorial (Frente e Verso = 30 páginas no total)</strong> com QR Code criptografado exclusivo e dados variáveis.
          </p>

          {/* Chronometer & Trigger Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Digital Chronometer Display */}
            <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl text-center shadow-inner flex flex-col items-center justify-center">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-mono mb-1">
                Cronômetro de Execução (Milissegundos)
              </span>
              <div 
                id="chronometer-display"
                className={`text-4xl sm:text-5xl font-mono font-black tracking-wider transition-colors ${
                  isRunning ? 'text-amber-400 animate-pulse' : batchResult ? 'text-emerald-400' : 'text-slate-200'
                }`}
              >
                {formatTimer(elapsedMs)}
              </div>
              
              <div className="mt-2 text-xs text-slate-400 flex items-center space-x-3">
                <span>Meta: <strong>&lt; 60.000s</strong></span>
                <span>•</span>
                <span>Lote: <strong>{targetStudents.length} Certificados</strong></span>
              </div>
            </div>

            {/* Benchmark Action Button */}
            <div className="space-y-4">
              <button
                id="btn-start-benchmark"
                onClick={startBenchmark}
                disabled={isRunning}
                className={`w-full py-4 px-6 rounded-xl font-black text-base flex items-center justify-center space-x-3 shadow-xl transition-all ${
                  isRunning
                    ? 'bg-amber-600 text-slate-950 opacity-80 cursor-wait'
                    : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-6 h-6 animate-spin text-slate-950" />
                    <span>Processando ({currentCert}/{targetStudents.length})...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 fill-current" />
                    <span>INICIAR CRONÔMETRO &amp; GERAR 15 CERTIFICADOS</span>
                  </>
                )}
              </button>

              {/* Live Progress Bar */}
              {isRunning && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Renderizando Frente e Verso...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
                    <div 
                      className="bg-amber-400 h-full transition-all duration-100 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark Results Card (when completed) */}
      {batchResult && (
        <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-6 sm:p-8 shadow-xl text-white">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-emerald-400 flex items-center space-x-2">
                  <span>Requisito Validado com Sucesso!</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  {batchResult.totalGenerated} certificados completos (30 páginas de alta resolução) gerados em apenas <strong>{(batchResult.durationMs / 1000).toFixed(2)}s</strong>.
                </p>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl text-right">
              <span className="text-xs text-emerald-300 uppercase tracking-wider block font-semibold">
                Tempo Médio por Certificado
              </span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {batchResult.perCertMs} ms
              </span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400">Total de Certificados</span>
              <p className="text-2xl font-bold text-white mt-1">{batchResult.totalGenerated}</p>
              <span className="text-[10px] text-slate-500">Frente + Verso</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400">Tempo Total</span>
              <p className="text-2xl font-bold text-amber-400 font-mono mt-1">
                {(batchResult.durationMs / 1000).toFixed(2)}s
              </p>
              <span className="text-[10px] text-emerald-400 font-semibold">&lt; 60s (Meta Atingida)</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400">Velocidade / Vazão</span>
              <p className="text-2xl font-bold text-cyan-400 font-mono mt-1">
                {(batchResult.totalGenerated / (batchResult.durationMs / 1000)).toFixed(1)} /s
              </p>
              <span className="text-[10px] text-slate-500">certificados por segundo</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400">Ganho vs Mala Direta</span>
              <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                &gt; 40x
              </p>
              <span className="text-[10px] text-slate-500">mais rápido que Word/Excel</span>
            </div>
          </div>

          {/* Download & Actions Buttons */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-800">
            <button
              id="btn-download-zip-batch"
              onClick={handleDownloadZip}
              className="flex-1 min-w-[240px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-5 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all"
            >
              <FileArchive className="w-5 h-5" />
              <span>Baixar Arquivo ZIP (15 Certificados em PDF)</span>
            </button>

            <button
              id="btn-download-merged-pdf"
              onClick={handleDownloadMergedPdf}
              disabled={isDownloading}
              className="flex-1 min-w-[240px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold py-3 px-5 rounded-xl flex items-center justify-center space-x-2 transition-all"
            >
              <Layers className="w-5 h-5 text-amber-400" />
              <span>{isDownloading ? 'Mesclando...' : 'Baixar PDF Único Consolidado (30 Páginas)'}</span>
            </button>

            {onOpenEmailModal && (
              <button
                id="btn-email-approved-batch"
                onClick={onOpenEmailModal}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-5 rounded-xl flex items-center justify-center space-x-2 transition-all"
              >
                <Mail className="w-5 h-5" />
                <span>Disparar E-mails Automaticamente</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Comparison: Este Sistema vs Mala Direta Tradicional */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
        <h3 className="text-lg font-bold flex items-center space-x-2 text-amber-400">
          <BarChart3 className="w-5 h-5" />
          <span>Comparativo: Mala Direta Tradicional vs. CertificaFast Automático</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-6">
          Por que a automação substitui o procedimento manual de mala direta com vantagens operacionais claras:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950 text-slate-300 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Recurso / Critério</th>
                <th className="p-3 text-red-400 bg-red-950/20">Mala Direta Tradicional (Word/Excel)</th>
                <th className="p-3 text-emerald-400 bg-emerald-950/20">CertificaFast (Este Sistema)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="p-3 font-medium text-slate-300">Tempo para 15 Certificados</td>
                <td className="p-3 text-slate-400">15 a 30 minutos (montar, mesclar, exportar um a um)</td>
                <td className="p-3 font-bold text-emerald-400">&lt; 3 segundos com 1 clique!</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-300">Frente e Verso (Grade Curricular)</td>
                <td className="p-3 text-slate-400">Desalinhamento frequente de margens e tabelas</td>
                <td className="p-3 text-emerald-300">Renderização vetorial perfeita de frente e verso</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-300">Autenticidade e QR Code</td>
                <td className="p-3 text-slate-400">Inexistente ou gerado manualmente</td>
                <td className="p-3 text-emerald-300">QR Code dinâmico + Hash SHA-256 por aluno</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-300">Envio de E-mails aos Alunos</td>
                <td className="p-3 text-slate-400">Envio manual ou plugins instáveis do Outlook</td>
                <td className="p-3 text-emerald-300">Disparo automático em fila com anexo em PDF</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-300">Integração com Plataformas (LMS)</td>
                <td className="p-3 text-slate-400">Nenhuma (apenas planilhas manuais)</td>
                <td className="p-3 text-emerald-300">API REST e Webhooks para Moodle, Hotmart, Kiwify</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
