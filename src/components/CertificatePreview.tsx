import React, { useState } from 'react';
import { 
  Download, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  QrCode, 
  Eye, 
  FileText, 
  Printer,
  Share2
} from 'lucide-react';
import { CourseTemplate, Student } from '../types';
import { BADM_QGEX_LOGO_SVG, DIGITAL_SIGNATURE_SVG, QGEX_WATERMARK_IMG, SGEX_LOGO_SVG } from '../utils/assets';
import { generateCertificatePdf } from '../utils/pdfGenerator';
import { maskCpf } from '../utils/privacy';

interface CertificatePreviewProps {
  students: Student[];
  currentStudentIndex: number;
  setCurrentStudentIndex: (index: number) => void;
  template: CourseTemplate;
  onNavigateToBenchmark?: () => void;
}

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  students,
  currentStudentIndex,
  setCurrentStudentIndex,
  template,
  onNavigateToBenchmark,
}) => {
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const student = students[currentStudentIndex] || students[0];

  if (!student) {
    return (
      <div className="p-12 text-center text-slate-400">
        Nenhum aluno cadastrado para pré-visualização.
      </div>
    );
  }

  const handleNext = () => {
    if (currentStudentIndex < students.length - 1) {
      setCurrentStudentIndex(currentStudentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStudentIndex > 0) {
      setCurrentStudentIndex(currentStudentIndex - 1);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const doc = await generateCertificatePdf(student, template);
      const filename = `Certificado_${student.certificateCode.replace(/\//g, '_')}_${student.name.replace(/\s+/g, '_')}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error('Erro ao gerar PDF', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const verificationUrl = `${window.location.origin}/?verify=${student.certificateCode}&hash=${student.authHash}`;

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md flex flex-wrap items-center justify-between gap-4">
        {/* Student Carousel Navigation */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <button
              id="btn-prev-student"
              onClick={handlePrev}
              disabled={currentStudentIndex === 0}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 transition-colors"
              title="Aluno Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs sm:text-sm font-semibold px-3 py-1.5 bg-slate-800/80 rounded-lg text-slate-200 border border-slate-700">
              Aluno {currentStudentIndex + 1} de {students.length}
            </span>
            <button
              id="btn-next-student"
              onClick={handleNext}
              disabled={currentStudentIndex === students.length - 1}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 transition-colors"
              title="Próximo Aluno"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="hidden md:block text-left">
            <p className="text-sm font-bold text-white truncate max-w-xs">{student.name}</p>
            <p className="text-xs text-slate-400">CPF: {maskCpf(student.cpf)} • Cód: {student.certificateCode}</p>
          </div>
        </div>

        {/* View Controls (Front/Back toggle, Highlight vars, Download) */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Side Toggle */}
          <div className="inline-flex p-1 bg-slate-800 rounded-lg border border-slate-700">
            <button
              id="btn-side-front"
              onClick={() => setSide('front')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                side === 'front'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Frente (Diploma)
            </button>
            <button
              id="btn-side-back"
              onClick={() => setSide('back')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                side === 'back'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Verso (Conteúdo Programático)
            </button>
          </div>

          {/* Download PDF */}
          <button
            id="btn-download-single-pdf"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPdf ? 'Gerando PDF...' : 'Baixar PDF (2 Páginas)'}</span>
          </button>

          {/* Batch redirect shortcut */}
          {onNavigateToBenchmark && (
            <button
              id="btn-goto-batch-from-preview"
              onClick={onNavigateToBenchmark}
              className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-2 rounded-lg transition-all"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden lg:inline">Gerar Todos em Massa</span>
            </button>
          )}
        </div>
      </div>

      {/* Certificate Frame Preview Canvas (Landscape A4 Aspect Ratio: 1.414) */}
      <div className="relative w-full max-w-5xl mx-auto overflow-hidden bg-slate-950 p-2 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl flex justify-center">
        
        {/* Certificate Landscape Container */}
        <div 
          id="certificate-viewport"
          className="relative w-full bg-[#faf8f1] text-[#252925] rounded-sm shadow-2xl border-[5px] border-[#1f3a2d] selection:bg-amber-100 overflow-hidden"
          style={{
            aspectRatio: '297 / 210',
            maxWidth: '920px',
          }}
        >
          {/* Full-bleed Background Watermark spanning completely across the whole certificate */}
          <img 
            src={QGEX_WATERMARK_IMG}
            alt="Marca d'água Exército Brasileiro"
            className="absolute inset-0 w-full h-full object-fill opacity-[0.18] pointer-events-none z-0 select-none"
          />

          {/* Ornate decorative outer frame */}
          <div className="absolute inset-2 border border-[#b6944b] pointer-events-none z-20"></div>
          <div className="absolute inset-3 border border-[#1f3a2d]/35 pointer-events-none z-20"></div>
          
          {/* 4 Corner Ornaments */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-slate-900 z-20"></div>
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-slate-900 z-20"></div>
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-slate-900 z-20"></div>
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-slate-900 z-20"></div>

          {/* ========================================================= */}
          {/* FRENTE (FRONT SIDE)                                       */}
          {/* ========================================================= */}
          {side === 'front' ? (
            <div className="relative h-full flex flex-col justify-between p-6 sm:p-8 z-10">
              {/* Header Top Section: Logos, Title, Code */}
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  {/* Left SGEX Logo */}
                  <div className="w-12 sm:w-16 flex-shrink-0">
                    <img 
                      src={SGEX_LOGO_SVG} 
                      alt="Brasão SGEX" 
                      className="w-full h-auto drop-shadow-sm" 
                    />
                  </div>

                  {/* Center Title & Subtitle */}
                  <div className="text-center px-4 flex-1">
                    <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.22em] text-[#496a4d]">
                      Instituição de Ensino de Trânsito
                    </p>
                    <h1 
                      className="text-2xl sm:text-4xl font-semibold tracking-wide uppercase font-serif text-[#1f3a2d] mt-1"
                      style={{ letterSpacing: '0.08em' }}
                    >
                      CERTIFICADO
                    </h1>
                    
                    <div className="w-20 sm:w-28 h-px bg-[#b6944b] mx-auto my-1.5"></div>
                    <h2 className="text-[10px] sm:text-sm font-semibold text-[#496a4d] tracking-tight">
                      {template.courseTitle}
                    </h2>
                  </div>

                  {/* Right B-ADM-QGEX Logo & Code */}
                  <div className="w-14 sm:w-20 flex-shrink-0 text-right flex flex-col items-end">
                    <img 
                      src={BADM_QGEX_LOGO_SVG} 
                      alt="Brasão B-ADM-QGEX" 
                      className="w-12 sm:w-16 h-auto drop-shadow-sm" 
                    />
                  </div>
                </div>
              </div>

              {/* Main Body Text */}
              <div className="my-auto px-6 sm:px-12 text-center font-serif">
                <p className="text-[9px] sm:text-xs text-[#496a4d] tracking-wide">Certificamos que</p>
                <h3 className="text-base sm:text-2xl md:text-3xl font-semibold uppercase tracking-[0.08em] text-[#1f3a2d] my-2 sm:my-3">
                  {student.name}
                </h3>
                <div className="w-24 sm:w-36 h-px bg-[#b6944b] mx-auto mb-2 sm:mb-3"></div>
                <p className="text-[9px] sm:text-xs md:text-sm leading-relaxed text-[#252925] max-w-3xl mx-auto">
                  CPF nº <strong>{maskCpf(student.cpf)}</strong> e nº de registro{' '}
                  <strong className="font-semibold text-slate-950">
                    {student.registrationNumber}
                  </strong>
                  , categoria{' '}
                  <strong className="font-bold text-slate-950">
                    "{student.category}"
                  </strong>
                  , concluiu com aproveitamento o{' '}
                  <strong>Curso Especializado para {template.courseTitle}</strong>
                  , realizado pela IET – Forte Caxias, no período de{' '}
                  <span>
                    {student.periodStart} a {student.periodEnd}
                  </span>
                  , com carga horária de <strong>{student.workload}</strong>, conforme {template.legalResolution}.
                </p>
              </div>

              {/* Footer: Date, Signature & CNPJ */}
              <div>
                <div className="text-center font-bold text-xs sm:text-sm text-slate-900 mb-2">
                  {template.baseLocation}, {student.issueDate}
                </div>

                <div className="flex items-end justify-between px-4 sm:px-8 pt-2">
                  {/* Digital Signature on Left */}
                  <div className="text-center flex flex-col items-center">
                    <img 
                      src={DIGITAL_SIGNATURE_SVG} 
                      alt="Assinatura Diretor Geral" 
                      className="h-10 sm:h-12 w-auto -mb-2"
                    />
                    <div className="w-48 sm:w-56 h-[1.5px] bg-slate-900"></div>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-950 mt-0.5">
                      {template.directorName}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-slate-600 leading-tight">
                      {template.directorRole}
                    </p>
                    <p className="text-[8px] sm:text-[9px] text-slate-500">
                      CPF {maskCpf(template.directorCpf)}
                    </p>
                  </div>

                  {/* CNPJ & Base Administrativa on Right */}
                  <div className="text-right">
                    <p className="text-[9px] sm:text-xs font-bold text-slate-950">
                      {template.cnpj}
                    </p>
                    <p className="text-[8px] sm:text-[10px] text-slate-700 uppercase font-medium">
                      {template.institutionName}
                    </p>
                  </div>
                </div>

                {/* Micro Security / Auth Hash */}
                <div className="mt-2 text-center text-[8px] text-slate-500 border-t border-[#b6944b]/40 pt-1 flex justify-between px-4">
                  <span>Certificado nº <strong>{student.certificateCode}</strong></span>
                  <span>Consulte a autenticidade pelo QR Code no verso</span>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* VERSO (BACK SIDE - PROGRAMMATIC CONTENT & QR CODE)        */
            /* ========================================================= */
            <div className="relative h-full flex flex-col justify-between p-5 sm:p-7 z-10">
              <div className="relative z-10 flex flex-col h-full justify-between">
                {/* Header with Logos */}
                <div>
                  <div className="flex items-center justify-between border-b pb-2 border-slate-300">
                    <img src={SGEX_LOGO_SVG} alt="SGEX" className="w-8 sm:w-10 h-auto" />
                    
                    <div className="text-center">
                      <h2 className="text-xs sm:text-base font-black text-slate-950 uppercase tracking-tight">
                        {template.institutionName}
                      </h2>
                      <h3 className="text-[10px] sm:text-sm font-bold text-slate-800">
                        {template.institutionSubtext}
                      </h3>
                    </div>

                    <img src={BADM_QGEX_LOGO_SVG} alt="B-ADM-QGEX" className="w-8 sm:w-10 h-auto" />
                  </div>

                  <div className="flex items-center justify-between my-2 font-bold text-xs sm:text-sm text-slate-950">
                    <span>CONTEÚDO PROGRAMÁTICO</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                      {student.certificateCode}
                    </span>
                  </div>
                </div>

                {/* Curricular Table */}
                <div className="overflow-hidden border border-slate-900 rounded my-auto bg-white/90">
                  <table className="w-full text-left text-[10px] sm:text-xs">
                    <thead className="bg-slate-200/90 text-slate-950 font-bold border-b border-slate-900">
                      <tr>
                        <th className="p-1.5 sm:p-2">DISCIPLINA</th>
                        <th className="p-1.5 sm:p-2 text-center">CARGA HORÁRIA</th>
                        <th className="p-1.5 sm:p-2 text-center">AVALIAÇÃO</th>
                        <th className="p-1.5 sm:p-2">INSTRUTOR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300 font-medium">
                      {(student.grades && student.grades.length > 0 ? student.grades : template.disciplines).map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}>
                          <td className="p-1.5 sm:p-2 font-semibold text-slate-900">{row.discipline}</td>
                          <td className="p-1.5 sm:p-2 text-center text-slate-700">{row.workload}</td>
                          <td className="p-1.5 sm:p-2 text-center font-bold text-slate-950">
                            {'grade' in row ? row.grade : row.defaultGrade}
                          </td>
                          <td className="p-1.5 sm:p-2 text-slate-800 text-[9px] sm:text-[11px]">{row.instructor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Helper Bar */}
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Modelo ativo: <strong>{template.name}</strong></span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Resolução de Impressão: <strong>300 DPI Vetorial</strong></span>
          <span>Formato: <strong>A4 Paisagem (297x210mm)</strong></span>
        </div>
      </div>
    </div>
  );
};
