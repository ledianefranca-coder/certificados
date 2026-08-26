import React, { useState } from 'react';
import { 
  Award, 
  Search, 
  Download, 
  Mail, 
  ShieldCheck, 
  AlertTriangle, 
  Eye, 
  Copy, 
  Check, 
  ExternalLink,
  QrCode,
  FileArchive,
  RefreshCw
} from 'lucide-react';
import { CourseTemplate, Student } from '../types';
import { generateCertificatePdf } from '../utils/pdfGenerator';

interface CertificateManagerProps {
  students: Student[];
  template: CourseTemplate;
  onSelectForPreview: (index: number) => void;
  onSendEmailToStudent: (student: Student) => void;
  onToggleRevokeCertificate?: (studentId: string) => void;
}

export const CertificateManager: React.FC<CertificateManagerProps> = ({
  students,
  template,
  onSelectForPreview,
  onSendEmailToStudent,
  onToggleRevokeCertificate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Filter approved students (only approved receive issued certificates)
  const approvedStudents = students.filter(s => s.status === 'approved');

  const filteredCertificates = approvedStudents.filter(std => {
    return (
      std.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.cpf.includes(searchTerm) ||
      std.certificateCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.authHash.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCopyLink = (code: string, hash: string) => {
    const url = `${window.location.origin}/?verify=${code}&hash=${hash}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleDownloadSingle = async (student: Student) => {
    setDownloadingId(student.id);
    try {
      const doc = await generateCertificatePdf(student, template);
      doc.save(`Certificado_${student.certificateCode.replace(/\//g, '_')}_${student.name.replace(/\s+/g, '_')}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total de Certificados Emitidos</p>
            <p className="text-2xl font-black text-white">{approvedStudents.length}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Autenticidade e Validade</p>
            <p className="text-2xl font-black text-emerald-400">100% Válidos</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">E-mails Disparados</p>
            <p className="text-2xl font-black text-blue-400">
              {students.filter(s => s.emailSentStatus === 'delivered').length} / {approvedStudents.length}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Consultas Públicas QR</p>
            <p className="text-2xl font-black text-purple-400">Ativo</p>
          </div>
        </div>
      </div>

      {/* Main Admin Panel Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
            <span>Painel Administrativo: Certificados Oficiais Emitidos</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Controle de registros, consulta de hash de segurança, reenvio de diplomas e auditoria.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            id="admin-search-cert-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por Registro, Nome ou CPF..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Certificates List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Registro / Código</th>
                <th className="p-4">Aluno Formando</th>
                <th className="p-4">Chave Criptográfica SHA</th>
                <th className="p-4">Data Emissão</th>
                <th className="p-4">Status &amp; E-mail</th>
                <th className="p-4 text-right">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredCertificates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Nenhum certificado emitido encontrado para os termos da busca.
                  </td>
                </tr>
              ) : (
                filteredCertificates.map((std) => {
                  const globalIdx = students.findIndex(s => s.id === std.id);
                  const isCopied = copiedCode === std.certificateCode;
                  return (
                    <tr key={std.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-bold text-amber-400 text-sm block">
                          {std.certificateCode}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {template.courseTitle}
                        </span>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-white">{std.name}</p>
                        <p className="text-xs text-slate-400">CPF: {std.cpf} • Cat: {std.category}</p>
                      </td>

                      <td className="p-4 font-mono">
                        <div className="flex items-center space-x-1.5">
                          <span className="bg-slate-950 px-2 py-1 rounded text-emerald-400 text-xs border border-slate-800">
                            {std.authHash}
                          </span>
                          <button
                            onClick={() => handleCopyLink(std.certificateCode, std.authHash)}
                            className="p-1 text-slate-400 hover:text-white transition-colors"
                            title="Copiar Link de Validação"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      <td className="p-4 text-xs text-slate-300">
                        {std.issueDate}
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          <span className="inline-flex items-center space-x-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] px-2 py-0.5 rounded-full font-semibold">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Oficial Válido</span>
                          </span>
                          <span className={`block text-[10px] ${std.emailSentStatus === 'delivered' ? 'text-blue-400' : 'text-slate-500'}`}>
                            {std.emailSentStatus === 'delivered' ? '✓ E-mail enviado' : '• E-mail não enviado'}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            id={`btn-cert-preview-${std.id}`}
                            onClick={() => onSelectForPreview(globalIdx >= 0 ? globalIdx : 0)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
                            title="Visualizar Frente/Verso"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            id={`btn-cert-download-${std.id}`}
                            onClick={() => handleDownloadSingle(std)}
                            disabled={downloadingId === std.id}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-950 text-emerald-400 transition-colors disabled:opacity-50"
                            title="Baixar PDF de Alta Resolução"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          <button
                            id={`btn-cert-send-mail-${std.id}`}
                            onClick={() => onSendEmailToStudent(std)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-blue-950 text-blue-400 transition-colors"
                            title="Disparar E-mail com PDF Anexo"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
