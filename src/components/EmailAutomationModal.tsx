import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  FileText, 
  Settings, 
  History,
  Paperclip,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CourseTemplate, Student } from '../types';

interface EmailAutomationModalProps {
  students: Student[];
  template: CourseTemplate;
  onUpdateStudentEmailStatus: (studentId: string, status: 'pending' | 'sent' | 'delivered' | 'failed') => void;
}

export const EmailAutomationModal: React.FC<EmailAutomationModalProps> = ({
  students,
  template,
  onUpdateStudentEmailStatus,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'send' | 'template' | 'config' | 'logs'>('send');
  const [isSendingBatch, setIsSendingBatch] = useState(false);
  const [currentSendingIdx, setCurrentSendingIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  // Email Template Form State
  const [emailSubject, setEmailSubject] = useState(
    'Seu Certificado Oficial de Conclusão de Curso - IET Forte Caxias'
  );
  const [emailBody, setEmailBody] = useState(
    `Prezado(a) {{aluno_nome}},\n\nÉ com grande satisfação que informamos a conclusão com aproveitamento do curso "{{curso}}".\n\nSeu certificado oficial foi emitido sob o Registro Nº {{codigo_certificado}} e chave de autenticidade {{hash_autenticidade}}.\n\nEm anexo enviamos o seu Certificado em alta resolução (Frente e Verso com Grade Curricular).\n\nVocê também pode validar a autenticidade online a qualquer momento pelo link:\n{{link_validacao}}\n\nAtenciosamente,\n{{instituicao}}\n{{diretor_nome}} - {{diretor_cargo}}`
  );

  // Filter approved students
  const approvedStudents = students.filter((s) => s.status === 'approved');
  const pendingStudents = approvedStudents.filter((s) => s.emailSentStatus !== 'delivered');

  const handleSendAllApproved = async () => {
    setIsSendingBatch(true);
    setProgress(0);

    for (let i = 0; i < approvedStudents.length; i++) {
      setCurrentSendingIdx(i + 1);
      const student = approvedStudents[i];
      onUpdateStudentEmailStatus(student.id, 'sent');
      
      // Simulate realistic ultra-fast delivery latency per student (120ms)
      await new Promise((res) => setTimeout(res, 120));
      onUpdateStudentEmailStatus(student.id, 'delivered');
      
      setProgress(Math.round(((i + 1) / approvedStudents.length) * 100));
    }

    setIsSendingBatch(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleSendSingle = async (student: Student) => {
    onUpdateStudentEmailStatus(student.id, 'sent');
    await new Promise((res) => setTimeout(res, 300));
    onUpdateStudentEmailStatus(student.id, 'delivered');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
            <Mail className="w-6 h-6 text-amber-400" />
            <span>Envio Automático de E-mails para Alunos Aprovados</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Dispare certificados em PDF anexados diretamente para as caixas de entrada dos alunos concluintes.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('send')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'send' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Fila de Disparo
          </button>
          <button
            onClick={() => setActiveSubTab('template')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'template' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Modelo de Mensagem
          </button>
          <button
            onClick={() => setActiveSubTab('config')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'config' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Configurações SMTP / API
          </button>
        </div>
      </div>

      {/* Main Tab View */}
      {activeSubTab === 'send' && (
        <div className="space-y-6">
          {/* Dispatch Banner */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-white">Status da Fila de Notificações:</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                  {approvedStudents.filter(s => s.emailSentStatus === 'delivered').length} Enviados
                </span>
                {pendingStudents.length > 0 && (
                  <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded font-bold border border-amber-500/30">
                    {pendingStudents.length} Pendentes
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                O envio automático gera o PDF criptografado de cada aluno aprovado e dispara para o endereço cadastrado com o link de validação digital.
              </p>
            </div>

            <button
              id="btn-dispatch-all-emails"
              onClick={handleSendAllApproved}
              disabled={isSendingBatch || approvedStudents.length === 0}
              className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black px-6 py-3.5 rounded-xl text-sm shadow-xl flex items-center space-x-2 disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{isSendingBatch ? `Enviando (${currentSendingIdx}/${approvedStudents.length})...` : 'Disparar para Todos os Aprovados'}</span>
            </button>
          </div>

          {/* Progress Bar during batch */}
          {isSendingBatch && (
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Disparando e-mails com anexos em PDF...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                <div className="bg-amber-400 h-full transition-all duration-100" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {/* Recipients Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Lista de Destinatários Aprovados ({approvedStudents.length})</h3>
              <span className="text-xs text-slate-400">Anexo Automático: <strong>Certificado_Frente_Verso.pdf</strong></span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 text-[11px] uppercase">
                  <tr>
                    <th className="p-4">Aluno</th>
                    <th className="p-4">E-mail</th>
                    <th className="p-4">Cód. Certificado</th>
                    <th className="p-4">Status de Envio</th>
                    <th className="p-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {approvedStudents.map((std) => (
                    <tr key={std.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-white">{std.name}</td>
                      <td className="p-4 font-mono text-xs text-slate-300">{std.email}</td>
                      <td className="p-4 font-mono text-amber-400">{std.certificateCode}</td>
                      <td className="p-4">
                        {std.emailSentStatus === 'delivered' ? (
                          <span className="inline-flex items-center space-x-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Entregue com Anexo</span>
                          </span>
                        ) : std.emailSentStatus === 'sent' ? (
                          <span className="inline-flex items-center space-x-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Enviando...</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 bg-slate-800 text-slate-400 border border-slate-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pendente</span>
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleSendSingle(std)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
                        >
                          {std.emailSentStatus === 'delivered' ? 'Reenviar' : 'Enviar Agora'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Template View */}
      {activeSubTab === 'template' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 text-white">
          <h3 className="text-lg font-bold text-amber-400">Personalização do Modelo de E-mail</h3>
          <p className="text-xs text-slate-400">
            Configure o assunto e a mensagem enviada aos formandos. As variáveis entre chaves serão substituídas automaticamente.
          </p>

          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-slate-400 text-xs mb-1 font-semibold">Assunto do E-mail</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-bold focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1 font-semibold">Corpo da Mensagem</label>
              <textarea
                rows={9}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-amber-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <Paperclip className="w-4 h-4 text-amber-400" />
              <span>Anexo Obrigatório: <strong>Certificado_Oficial_Frente_Verso.pdf</strong> (Gerado automaticamente em alta resolução)</span>
            </div>
          </div>
        </div>
      )}

      {/* Config View */}
      {activeSubTab === 'config' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 text-white">
          <h3 className="text-lg font-bold text-amber-400">Provedores de E-mail Suportados (SMTP / Webhooks)</h3>
          <p className="text-xs text-slate-400">
            Conecte o serviço de sua preferência para envio em produção (Resend, SendGrid, Amazon SES, Mailgun ou Servidor SMTP institucional).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm pt-2">
            <div>
              <label className="block text-slate-400 text-xs mb-1">Remetente (From Name)</label>
              <input
                type="text"
                defaultValue="IET Forte Caxias - Base Administrativa QGEx"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1">E-mail Remetente (From Email)</label>
              <input
                type="email"
                defaultValue="certificados@eb.mil.br"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 text-xs mb-1">Serviço de Disparo</label>
              <select className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-bold">
                <option>CertificaFast Cloud Engine (Padrão Integrado)</option>
                <option>Resend API</option>
                <option>SendGrid API</option>
                <option>Amazon Simple Email Service (SES)</option>
                <option>Servidor SMTP Próprio (TLS/SSL)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
