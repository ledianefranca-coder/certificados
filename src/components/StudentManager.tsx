import React, { useState } from 'react';
import { 
  UserPlus, 
  UploadCloud, 
  Search, 
  Trash2, 
  Edit, 
  CheckCircle, 
  Clock, 
  XCircle, 
  FileSpreadsheet, 
  Download,
  Award,
  Sparkles,
  Eye
} from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Student } from '../types';
import { generateCryptoHash } from '../utils/sampleData';

interface StudentManagerProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onSelectStudentForPreview: (index: number) => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onSelectStudentForPreview,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'in_progress' | 'failed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // CSV Paste content
  const [csvText, setCsvText] = useState('');
  const [spreadsheetFile, setSpreadsheetFile] = useState<File | null>(null);
  const [isImportingSpreadsheet, setIsImportingSpreadsheet] = useState(false);
  const [importFeedback, setImportFeedback] = useState('');

  // Form State for Add / Edit
  const [formState, setFormState] = useState({
    name: '',
    cpf: '',
    registrationNumber: '',
    category: 'AD',
    email: '',
    phone: '',
    periodStart: '08 de junho de 2026',
    periodEnd: '16 de junho de 2026',
    workload: '50h/a',
    issueDate: '18 de junho de 2026',
    certificateCode: '',
    status: 'approved' as 'approved' | 'in_progress' | 'failed',
    grade1: '10',
    grade2: '9,0',
    grade3: '10',
    grade4: '10',
  });

  const filteredStudents = students.filter((std) => {
    const matchesSearch = 
      std.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.cpf.includes(searchTerm) ||
      std.certificateCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || std.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    const highestSequence = students.reduce((highest, student) => {
      const sequence = Number.parseInt(student.certificateCode.split('/')[0], 10);
      return Number.isFinite(sequence) ? Math.max(highest, sequence) : highest;
    }, 0);
    const nextSeq = (highestSequence + 1).toString().padStart(3, '0');
    setEditingStudent(null);
    setFormState({
      name: '',
      cpf: '',
      registrationNumber: '',
      category: 'AD',
      email: '',
      phone: '',
      periodStart: '08 de junho de 2026',
      periodEnd: '16 de junho de 2026',
      workload: '50h/a',
      issueDate: '18 de junho de 2026',
      certificateCode: `${nextSeq}/CVTE/2026`,
      status: 'approved',
      grade1: '10',
      grade2: '9,5',
      grade3: '10',
      grade4: '10',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormState({
      name: student.name,
      cpf: student.cpf.replace(/\D/g, '').slice(0, 11),
      registrationNumber: student.registrationNumber.replace(/\D/g, '').slice(0, 11),
      category: student.category,
      email: student.email,
      phone: student.phone || '',
      periodStart: student.periodStart,
      periodEnd: student.periodEnd,
      workload: student.workload,
      issueDate: student.issueDate,
      certificateCode: student.certificateCode,
      status: student.status,
      grade1: String(student.grades?.[0]?.grade || '10'),
      grade2: String(student.grades?.[1]?.grade || '9,0'),
      grade3: String(student.grades?.[2]?.grade || '10'),
      grade4: String(student.grades?.[3]?.grade || '10'),
    });
    setIsModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formState.name ||
      !formState.cpf ||
      !formState.registrationNumber ||
      !formState.category ||
      !formState.certificateCode ||
      !formState.periodStart ||
      !formState.periodEnd ||
      !formState.workload ||
      !formState.issueDate
    ) return;

    if (formState.cpf.length !== 11 || formState.registrationNumber.length !== 11) return;

    const grades = [
      { discipline: 'Legislação de Trânsito', workload: '10h/a', grade: formState.grade1, instructor: 'PAULO DE JESUS CAMARGO' },
      { discipline: 'Direção Defensiva', workload: '15h/a', grade: formState.grade2, instructor: 'ERIK ANDRE RODRIGUES SANTIAGO' },
      { discipline: 'Primeiros Socorros e Atendimento Inicial', workload: '15h/a', grade: formState.grade3, instructor: 'FELIPE VILELA DA COSTA' },
      { discipline: 'Comportamento e Convívio Social', workload: '10h/a', grade: formState.grade4, instructor: 'ERIK ANDRE RODRIGUES SANTIAGO' },
    ];

    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        name: formState.name,
        cpf: formState.cpf,
        registrationNumber: formState.registrationNumber,
        category: formState.category,
        email: formState.email,
        phone: formState.phone,
        periodStart: formState.periodStart,
        periodEnd: formState.periodEnd,
        workload: formState.workload,
        issueDate: formState.issueDate,
        certificateCode: formState.certificateCode,
        status: formState.status,
        grades,
      });
    } else {
      const newStudent: Student = {
        id: `std-${Date.now()}`,
        name: formState.name,
        cpf: formState.cpf,
        registrationNumber: formState.registrationNumber,
        category: formState.category,
        email: formState.email || `${formState.name.toLowerCase().replace(/\s+/g, '.')}@exemplo.com`,
        phone: formState.phone,
        courseId: 'template-iet-qgex',
        courseName: 'Condutores de Veículos de Transporte de Emergência',
        periodStart: formState.periodStart,
        periodEnd: formState.periodEnd,
        workload: formState.workload,
        issueDate: formState.issueDate,
        certificateCode: formState.certificateCode,
        authHash: generateCryptoHash(formState.name + formState.cpf),
        status: formState.status,
        emailSentStatus: 'pending',
        grades,
      };
      onAddStudent(newStudent);
    }
    setIsModalOpen(false);
  };

  const getCell = (row: Record<string, unknown>, aliases: string[]) => {
    for (const alias of aliases) {
      const value = row[alias];
      if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
    }
    return '';
  };

  const processSpreadsheetRows = (rows: Record<string, unknown>[]) => {
    let importedCount = 0;
    let invalidCount = 0;

    rows.forEach((row, index) => {
      const name = getCell(row, ['Nome', 'nome', 'NOME', 'Aluno']);
      const cpf = getCell(row, ['CPF', 'cpf']).replace(/\D/g, '').slice(0, 11);
      const registrationNumber = getCell(row, ['Registro', 'CNH', 'registro']).replace(/\D/g, '').slice(0, 11);
      const category = getCell(row, ['Categoria', 'categoria', 'cat']);
      const certificateCode = getCell(row, ['Código do Certificado', 'Codigo do Certificado', 'Código', 'Codigo']);
      const periodStart = getCell(row, ['Início', 'Inicio', 'Data Inicial']);
      const periodEnd = getCell(row, ['Fim', 'Data Final']);
      const workload = getCell(row, ['Carga Horária', 'Carga Horaria', 'Carga']);
      const issueDate = getCell(row, ['Data de Emissão', 'Data de Emissao', 'Emissão', 'Emissao']);

      if (
        !name || cpf.length !== 11 || registrationNumber.length !== 11 || !category ||
        !certificateCode || !periodStart || !periodEnd || !workload || !issueDate
      ) {
        invalidCount++;
        return;
      }

      const email = getCell(row, ['Email', 'E-mail', 'email']);
      const phone = getCell(row, ['Telefone', 'telefone']);
      const newStudent: Student = {
        id: `planilha-${Date.now()}-${index}`,
        name: name.toUpperCase(),
        cpf,
        registrationNumber,
        category: category.toUpperCase(),
        email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
        phone,
        courseId: 'template-iet-qgex',
        courseName: 'Condutores de Veículos de Transporte de Emergência',
        periodStart,
        periodEnd,
        workload,
        issueDate,
        certificateCode,
        authHash: generateCryptoHash(name + cpf + certificateCode),
        status: 'approved',
        emailSentStatus: 'pending',
        grades: [
          { discipline: 'Legislação de Trânsito', workload: '10h/a', grade: getCell(row, ['Nota Legislação', 'Nota Legislacao']) || '10', instructor: 'PAULO DE JESUS CAMARGO' },
          { discipline: 'Direção Defensiva', workload: '15h/a', grade: getCell(row, ['Nota Direção Defensiva', 'Nota Direcao Defensiva']) || '10', instructor: 'ERIK ANDRE RODRIGUES SANTIAGO' },
          { discipline: 'Primeiros Socorros e Atendimento Inicial', workload: '15h/a', grade: getCell(row, ['Nota Primeiros Socorros']) || '10', instructor: 'FELIPE VILELA DA COSTA' },
          { discipline: 'Comportamento e Convívio Social', workload: '10h/a', grade: getCell(row, ['Nota Convívio Social', 'Nota Convivio Social']) || '10', instructor: 'ERIK ANDRE RODRIGUES SANTIAGO' },
        ],
      };

      onAddStudent(newStudent);
      importedCount++;
    });

    setImportFeedback(`${importedCount} aluno(s) importado(s).${invalidCount ? ` ${invalidCount} linha(s) ignorada(s) por dados ausentes ou inválidos.` : ''}`);
    setCsvText('');
    setSpreadsheetFile(null);
    if (importedCount > 0) setIsCsvModalOpen(false);
  };

  const handleCsvImport = () => {
    if (!csvText.trim()) return;
    Papa.parse<Record<string, unknown>>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => processSpreadsheetRows(results.data),
    });
  };

  const handleSpreadsheetImport = async () => {
    if (!spreadsheetFile) return;
    setIsImportingSpreadsheet(true);
    setImportFeedback('');

    try {
      const data = await spreadsheetFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array', cellDates: true });
      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) throw new Error('A planilha não possui abas.');
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[firstSheetName], {
        defval: '',
        raw: false,
      });
      processSpreadsheetRows(rows);
    } catch (error) {
      setImportFeedback(error instanceof Error ? error.message : 'Não foi possível ler a planilha.');
    } finally {
      setIsImportingSpreadsheet(false);
    }
  };

  const handleDownloadSpreadsheetTemplate = () => {
    const rows = [
      {
        Nome: 'CARLOS HENRIQUE CAETANO DA SILVA', CPF: '06744073184', Registro: '07575025319', Categoria: 'AD',
        'Código do Certificado': '006/CVTE/2026', Início: '08 de junho de 2026', Fim: '16 de junho de 2026',
        'Carga Horária': '50h/a', 'Data de Emissão': '18 de junho de 2026', Email: 'carlos.caetano@exemplo.com', Telefone: '(61) 98112-4091',
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [
      { wch: 38 }, { wch: 14 }, { wch: 15 }, { wch: 12 }, { wch: 24 },
      { wch: 22 }, { wch: 22 }, { wch: 16 }, { wch: 22 }, { wch: 34 }, { wch: 18 },
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Alunos');
    XLSX.writeFile(workbook, 'modelo_importacao_certificados.xlsx');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with Title & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
            <span>Gestão de Alunos &amp; Mala Direta</span>
            <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
              {students.length} Cadastrados
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Importe listas de formandos de planilhas ou cadastre individualmente para emissão em massa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="btn-open-csv-modal"
            onClick={() => setIsCsvModalOpen(true)}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
          >
            <UploadCloud className="w-4 h-4 text-amber-400" />
            <span>Importar CSV / Planilha</span>
          </button>

          <button
            id="btn-add-single-student"
            onClick={handleOpenAdd}
            className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Adicionar Aluno</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            id="search-students-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, CPF, código ou e-mail..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Filtrar:</span>
          {(['all', 'approved', 'in_progress', 'failed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {st === 'all' ? 'Todos' : st === 'approved' ? 'Aprovados' : st === 'in_progress' ? 'Cursando' : 'Reprovados'}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Aluno / CPF</th>
                <th className="p-4">Registro / Cat</th>
                <th className="p-4">Cód. Certificado</th>
                <th className="p-4">Status Aprovação</th>
                <th className="p-4">E-mail</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Nenhum aluno encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => {
                  const globalIdx = students.findIndex((s) => s.id === std.id);
                  return (
                    <tr key={std.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-white">{std.name}</p>
                        <p className="text-xs text-slate-400">CPF: {std.cpf}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-mono text-slate-300">{std.registrationNumber}</p>
                        <span className="inline-block bg-slate-800 text-amber-300 font-bold px-1.5 py-0.5 rounded text-[10px] border border-amber-500/20">
                          Cat: {std.category}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-amber-400">
                        {std.certificateCode}
                      </td>
                      <td className="p-4">
                        {std.status === 'approved' ? (
                          <span className="inline-flex items-center space-x-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full font-semibold">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Aprovado</span>
                          </span>
                        ) : std.status === 'in_progress' ? (
                          <span className="inline-flex items-center space-x-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2.5 py-1 rounded-full font-semibold">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Em Andamento</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-2.5 py-1 rounded-full font-semibold">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reprovado</span>
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-xs text-slate-300">
                        <p className="truncate max-w-[180px]">{std.email}</p>
                        <span className={`text-[10px] ${std.emailSentStatus === 'delivered' ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {std.emailSentStatus === 'delivered' ? '✓ E-mail entregue' : 'Pendente'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            id={`btn-view-preview-${std.id}`}
                            onClick={() => onSelectStudentForPreview(globalIdx >= 0 ? globalIdx : 0)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
                            title="Ver Certificado"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            id={`btn-edit-student-${std.id}`}
                            onClick={() => handleOpenEdit(std)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                            title="Editar Aluno"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            id={`btn-delete-student-${std.id}`}
                            onClick={() => onDeleteStudent(std.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-red-400 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* CSV / Planilha Mala Direta Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold flex items-center space-x-2 text-amber-400">
                <FileSpreadsheet className="w-5 h-5" />
                <span>Gerar certificados por planilha Excel</span>
              </h3>
              <button onClick={() => setIsCsvModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Selecione uma planilha preenchida no modelo abaixo. O sistema lê cada linha, cadastra os alunos e prepara os certificados para geração em massa.
            </p>

            <label className="block rounded-xl border-2 border-dashed border-amber-500/40 bg-slate-950/60 p-5 text-center cursor-pointer hover:border-amber-400 transition-colors">
              <UploadCloud className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <span className="block text-sm font-bold text-white">
                {spreadsheetFile ? spreadsheetFile.name : 'Selecionar planilha do Excel'}
              </span>
              <span className="block text-[11px] text-slate-400 mt-1">Formatos aceitos: .xlsx, .xls e .csv</span>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="sr-only"
                onChange={(event) => {
                  setSpreadsheetFile(event.target.files?.[0] || null);
                  setImportFeedback('');
                }}
              />
            </label>

            <button
              type="button"
              onClick={handleSpreadsheetImport}
              disabled={!spreadsheetFile || isImportingSpreadsheet}
              className="w-full px-5 py-3 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isImportingSpreadsheet ? 'Lendo planilha...' : 'Importar planilha e gerar certificados'}
            </button>

            {importFeedback && (
              <p className="rounded-lg bg-slate-950 border border-slate-700 p-3 text-xs text-slate-200">
                {importFeedback}
              </p>
            )}

            <details className="border-t border-slate-800 pt-3">
              <summary className="text-xs text-slate-400 cursor-pointer hover:text-white">Ou colar dados em formato CSV</summary>

              <textarea
                rows={5}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="Nome,CPF,Registro,Categoria,Código do Certificado,Início,Fim,Carga Horária,Data de Emissão"
                className="w-full mt-3 p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleCsvImport}
                disabled={!csvText.trim()}
                className="mt-2 px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40"
              >
                Importar texto CSV
              </button>
            </details>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadSpreadsheetTemplate}
                className="text-xs text-amber-400 hover:underline flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar modelo Excel (.xlsx)</span>
              </button>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCsvModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-amber-400">
                {editingStudent ? 'Editar Dados do Formando' : 'Novo Aluno / Formando'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4 text-xs sm:text-sm">
              <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3">
                <p className="font-bold text-emerald-300">Dados institucionais fixos</p>
                <p className="mt-1 text-xs text-slate-300">
                  Instituição: Base Administrativa do Quartel-General do Exército - Forte Caxias
                </p>
                <p className="text-xs text-slate-300">
                  Curso: Condutores de Veículos de Transporte de Emergência
                </p>
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Dados variáveis do certificado
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 text-xs mb-1">Nome Completo do Aluno *</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-semibold uppercase focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs mb-1">CPF *</label>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    pattern="[0-9]{11}"
                    maxLength={11}
                    minLength={11}
                    title="Digite exatamente 11 números"
                    placeholder="00000000000"
                    value={formState.cpf}
                    onChange={(e) => setFormState({ ...formState, cpf: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs mb-1">Nº Registro CNH *</label>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    pattern="[0-9]{11}"
                    maxLength={11}
                    minLength={11}
                    title="Digite exatamente 11 números"
                    placeholder="00000000000"
                    value={formState.registrationNumber}
                    onChange={(e) => setFormState({ ...formState, registrationNumber: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs mb-1">Categoria CNH *</label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="AD">AD (Emergência)</option>
                    <option value="D">D (Passageiros)</option>
                    <option value="E">E (Articulados)</option>
                    <option value="B">B (Leves)</option>
                    <option value="A">A (Motocicletas)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-xs mb-1">Código do Certificado *</label>
                  <input
                    type="text"
                    required
                    placeholder="006/CVTE/2026"
                    value={formState.certificateCode}
                    onChange={(e) => setFormState({ ...formState, certificateCode: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <div>
                    <label className="block text-slate-400 text-xs mb-1">Início do curso *</label>
                    <input
                      type="text"
                      required
                      placeholder="08 de junho de 2026"
                      value={formState.periodStart}
                      onChange={(e) => setFormState({ ...formState, periodStart: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs mb-1">Fim do curso *</label>
                    <input
                      type="text"
                      required
                      placeholder="16 de junho de 2026"
                      value={formState.periodEnd}
                      onChange={(e) => setFormState({ ...formState, periodEnd: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs mb-1">Carga horária *</label>
                    <input
                      type="text"
                      required
                      placeholder="50h/a"
                      value={formState.workload}
                      onChange={(e) => setFormState({ ...formState, workload: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs mb-1">Data de emissão *</label>
                    <input
                      type="text"
                      required
                      placeholder="18 de junho de 2026"
                      value={formState.issueDate}
                      onChange={(e) => setFormState({ ...formState, issueDate: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-xs mb-1">E-mail para Envio Automático</label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs mb-1">Status de Aprovação</label>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-semibold focus:outline-none focus:border-amber-500"
                  >
                    <option value="approved">Aprovado (Emitir Certificado)</option>
                    <option value="in_progress">Em Andamento</option>
                    <option value="failed">Reprovado</option>
                  </select>
                </div>
              </div>

              {/* Grades for Back Side */}
              <div className="border-t border-slate-800 pt-3">
                <label className="block text-slate-300 text-xs font-bold mb-2">
                  Avaliações das Disciplinas (Verso / Conteúdo Programático):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block truncate">Legislação</span>
                    <input
                      type="text"
                      value={formState.grade1}
                      onChange={(e) => setFormState({ ...formState, grade1: e.target.value })}
                      className="w-full p-1.5 bg-slate-950 border border-slate-800 rounded text-center text-xs font-bold text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block truncate">Direção Def.</span>
                    <input
                      type="text"
                      value={formState.grade2}
                      onChange={(e) => setFormState({ ...formState, grade2: e.target.value })}
                      className="w-full p-1.5 bg-slate-950 border border-slate-800 rounded text-center text-xs font-bold text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block truncate">1º Socorros</span>
                    <input
                      type="text"
                      value={formState.grade3}
                      onChange={(e) => setFormState({ ...formState, grade3: e.target.value })}
                      className="w-full p-1.5 bg-slate-950 border border-slate-800 rounded text-center text-xs font-bold text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block truncate">Convívio Social</span>
                    <input
                      type="text"
                      value={formState.grade4}
                      onChange={(e) => setFormState({ ...formState, grade4: e.target.value })}
                      className="w-full p-1.5 bg-slate-950 border border-slate-800 rounded text-center text-xs font-bold text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md"
                >
                  {editingStudent ? 'Salvar alterações' : 'Salvar e gerar certificado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
