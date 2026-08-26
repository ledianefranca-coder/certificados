import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Award, 
  QrCode, 
  Calendar, 
  User, 
  FileText,
  Download,
  Building,
  Check
} from 'lucide-react';
import { CourseTemplate, Student } from '../types';
import { BADM_QGEX_LOGO_SVG, SGEX_LOGO_SVG } from '../utils/assets';
import { generateCertificatePdf } from '../utils/pdfGenerator';

interface PublicValidatorProps {
  students: Student[];
  template: CourseTemplate;
  initialCode?: string;
  initialHash?: string;
}

export const PublicValidator: React.FC<PublicValidatorProps> = ({
  students,
  template,
  initialCode = '',
  initialHash = '',
}) => {
  const [searchCode, setSearchCode] = useState(initialCode || '');
  const [searchedStudent, setSearchedStudent] = useState<Student | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (initialCode || initialHash) {
      const found = students.find(
        (s) =>
          (initialCode && s.certificateCode.toLowerCase() === initialCode.toLowerCase()) ||
          (initialHash && s.authHash.toLowerCase() === initialHash.toLowerCase())
      );
      if (found) {
        setSearchedStudent(found);
        setHasSearched(true);
      }
    } else if (students.length > 0) {
      // Default to first student for instant view
      setSearchedStudent(students[0]);
      setSearchCode(students[0].certificateCode);
      setHasSearched(true);
    }
  }, [initialCode, initialHash, students]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    const term = searchCode.trim().toLowerCase();
    const found = students.find(
      (s) =>
        s.certificateCode.toLowerCase().includes(term) ||
        s.authHash.toLowerCase().includes(term) ||
        s.cpf.replace(/\D/g, '').includes(term.replace(/\D/g, '')) ||
        s.registrationNumber.includes(term)
    );

    setSearchedStudent(found || null);
    setHasSearched(true);
  };

  const handleDownloadVerified = async () => {
    if (!searchedStudent) return;
    setIsDownloading(true);
    try {
      const doc = await generateCertificatePdf(searchedStudent, template);
      doc.save(`Certificado_Autenticado_${searchedStudent.certificateCode.replace(/\//g, '_')}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-white">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30 shadow-lg mb-1">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Portal Público de Validação de Certificados
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Verifique a autenticidade e validade jurídica de certificados emitidos pela IET Forte Caxias e instituições conveniadas.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-wrap sm:flex-nowrap gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            id="public-search-cert-input"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="Digite o Código (Ex: 006/CVTE/2026), CPF ou Chave SHA-256..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
          />
        </div>
        <button
          type="submit"
          id="btn-verify-cert-submit"
          className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm shadow-md transition-all whitespace-nowrap"
        >
          Consultar Registro
        </button>
      </form>

      {/* Validation Result Card */}
      {hasSearched && (
        searchedStudent ? (
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
            {/* Status Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                    Status do Documento
                  </span>
                  <h3 className="text-xl font-extrabold text-white">
                    DOCUMENTO OFICIAL AUTÊNTICO &bull; VÁLIDO
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block font-mono">Registro Oficial Nº</span>
                <span className="text-xl font-black text-amber-400 font-mono">
                  {searchedStudent.certificateCode}
                </span>
              </div>
            </div>

            {/* Student & Course Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 text-xs block font-semibold">Aluno Formando</span>
                <p className="text-base font-bold text-white uppercase">{searchedStudent.name}</p>
                <p className="text-slate-400">CPF: <strong>{searchedStudent.cpf}</strong></p>
                <p className="text-slate-400">Registro CNH: <strong>{searchedStudent.registrationNumber}</strong> (Cat: {searchedStudent.category})</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 text-xs block font-semibold">Curso Concluído</span>
                <p className="text-sm font-bold text-amber-400">{template.courseTitle}</p>
                <p className="text-slate-400">Período: {searchedStudent.periodStart} a {searchedStudent.periodEnd}</p>
                <p className="text-slate-400">Carga Horária: <strong>{searchedStudent.workload}</strong></p>
              </div>
            </div>

            {/* Curricular Breakdown */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-3 bg-slate-900 border-b border-slate-800 font-bold text-xs text-slate-300 flex justify-between">
                <span>Disciplinas Cursadas no Verso do Certificado</span>
                <span className="text-emerald-400">Aprovado em todas</span>
              </div>
              <table className="w-full text-left text-xs">
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {(searchedStudent.grades || template.disciplines).map((g, i) => (
                    <tr key={i} className="hover:bg-slate-900/40">
                      <td className="p-3 font-semibold text-white">{g.discipline}</td>
                      <td className="p-3 text-center text-slate-400">{g.workload}</td>
                      <td className="p-3 text-center font-bold text-amber-400">Nota: {'grade' in g ? g.grade : g.defaultGrade}</td>
                      <td className="p-3 text-right text-slate-400 text-[11px]">{g.instructor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cryptographic Proof */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-0.5 text-xs text-slate-400">
                <p className="text-white font-bold">Chave de Integridade Criptográfica (SHA-256):</p>
                <code className="text-emerald-400 font-mono text-xs">{searchedStudent.authHash}</code>
                <p className="text-[10px] text-slate-500">Expedido em Brasília-DF por {template.directorName} ({template.directorRole})</p>
              </div>

              <button
                onClick={handleDownloadVerified}
                disabled={isDownloading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? 'Baixando...' : 'Baixar Cópia Autenticada'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-8 text-center space-y-3">
            <XCircle className="w-12 h-12 text-red-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Nenhum Registro Encontrado</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Não encontramos nenhum certificado correspondente aos dados informados. Verifique se o código ou CPF foi digitado corretamente.
            </p>
          </div>
        )
      )}
    </div>
  );
};
