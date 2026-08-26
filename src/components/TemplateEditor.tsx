import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Save, 
  Trash2, 
  Sparkles, 
  FileCheck, 
  Sliders, 
  BookOpen, 
  ShieldAlert,
  Info
} from 'lucide-react';
import { CourseTemplate } from '../types';
import { ALTERNATIVE_TEMPLATES } from '../utils/sampleData';

interface TemplateEditorProps {
  currentTemplate: CourseTemplate;
  onUpdateTemplate: (template: CourseTemplate) => void;
  onSelectTemplate: (template: CourseTemplate) => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  currentTemplate,
  onUpdateTemplate,
  onSelectTemplate,
}) => {
  const [template, setTemplate] = useState<CourseTemplate>(currentTemplate);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTemplate(template);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddDiscipline = () => {
    setTemplate({
      ...template,
      disciplines: [
        ...template.disciplines,
        {
          discipline: 'Nova Disciplina Especializada',
          workload: '10h/a',
          defaultGrade: '10',
          instructor: 'INSTRUTOR QUALIFICADO',
        },
      ],
    });
  };

  const handleRemoveDiscipline = (index: number) => {
    setTemplate({
      ...template,
      disciplines: template.disciplines.filter((_, i) => i !== index),
    });
  };

  const handleDisciplineChange = (index: number, field: string, value: string) => {
    const updated = [...template.disciplines];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setTemplate({
      ...template,
      disciplines: updated,
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Template Selector Ribbon */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>Modelos de Templates Pré-Configurados</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Selecione um modelo base ou personalize todos os dados institucionais e regulatórios abaixo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {ALTERNATIVE_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => {
                setTemplate(tmpl);
                onSelectTemplate(tmpl);
              }}
              className={`p-4 rounded-xl border text-left transition-all ${
                template.id === tmpl.id
                  ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-amber-300">{tmpl.name}</span>
                {template.id === tmpl.id && (
                  <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-black">
                    ATIVO
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate">{tmpl.institutionName}</p>
              <p className="text-[11px] text-slate-500 mt-2 font-mono">{tmpl.disciplines.length} Disciplinas no Verso</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Template Customizer Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Frente (Front Side Config) */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Dados da Frente do Certificado (Diploma Oficial)</span>
            </h3>
            <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
              Página 1 (Frente)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="sm:col-span-2">
              <label className="block text-slate-400 text-xs mb-1 font-semibold">
                Título Principal do Certificado
              </label>
              <input
                type="text"
                value={template.title}
                onChange={(e) => setTemplate({ ...template, title: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-bold tracking-wider uppercase focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 text-xs mb-1 font-semibold">
                Nome / Subtítulo do Curso Especializado
              </label>
              <input
                type="text"
                value={template.courseTitle}
                onChange={(e) => setTemplate({ ...template, courseTitle: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-bold focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 text-xs mb-1 font-semibold">
                Texto de Abertura / Enquadramento Regulatório e Instrução Normativa
              </label>
              <textarea
                rows={3}
                value={template.regulationText}
                onChange={(e) => setTemplate({ ...template, regulationText: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-amber-500 leading-relaxed font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1 font-semibold">
                Resolução Legal / Amparo Jurídico
              </label>
              <input
                type="text"
                value={template.legalResolution}
                onChange={(e) => setTemplate({ ...template, legalResolution: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1 font-semibold">
                Local de Expedição (Cidade-UF)
              </label>
              <input
                type="text"
                value={template.baseLocation}
                onChange={(e) => setTemplate({ ...template, baseLocation: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1 font-semibold">
                Nome do Diretor Geral / Autoridade Firmadora
              </label>
              <input
                type="text"
                value={template.directorName}
                onChange={(e) => setTemplate({ ...template, directorName: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-bold focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1 font-semibold">
                Cargo e CPF da Autoridade
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Cargo"
                  value={template.directorRole}
                  onChange={(e) => setTemplate({ ...template, directorRole: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-amber-500"
                />
                <input
                  type="text"
                  placeholder="CPF"
                  value={template.directorCpf}
                  onChange={(e) => setTemplate({ ...template, directorCpf: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1 font-semibold">
                CNPJ da Instituição
              </label>
              <input
                type="text"
                value={template.cnpj}
                onChange={(e) => setTemplate({ ...template, cnpj: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs mb-1 font-semibold">
                Nome Institucional no Rodapé
              </label>
              <input
                type="text"
                value={template.institutionName}
                onChange={(e) => setTemplate({ ...template, institutionName: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white uppercase focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Verso (Curricular Content & Disciplines) */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>Grade do Verso (Conteúdo Programático &amp; Instrutores)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Tabela impressa no verso de cada certificado com carga horária e avaliação individual.
              </p>
            </div>
            
            <button
              type="button"
              onClick={handleAddDiscipline}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Disciplina</span>
            </button>
          </div>

          <div className="space-y-3">
            {template.disciplines.map((disc, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 items-center">
                <div className="col-span-12 sm:col-span-4">
                  <span className="text-[10px] text-slate-500 block">Nome da Disciplina</span>
                  <input
                    type="text"
                    value={disc.discipline}
                    onChange={(e) => handleDisciplineChange(idx, 'discipline', e.target.value)}
                    className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-xs font-bold text-white"
                  />
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <span className="text-[10px] text-slate-500 block">Carga Horária</span>
                  <input
                    type="text"
                    value={disc.workload}
                    onChange={(e) => handleDisciplineChange(idx, 'workload', e.target.value)}
                    className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-center text-slate-300"
                  />
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <span className="text-[10px] text-slate-500 block">Nota Padrão</span>
                  <input
                    type="text"
                    value={disc.defaultGrade}
                    onChange={(e) => handleDisciplineChange(idx, 'defaultGrade', e.target.value)}
                    className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-center font-bold text-amber-400"
                  />
                </div>

                <div className="col-span-10 sm:col-span-3">
                  <span className="text-[10px] text-slate-500 block">Nome do Instrutor</span>
                  <input
                    type="text"
                    value={disc.instructor}
                    onChange={(e) => handleDisciplineChange(idx, 'instructor', e.target.value)}
                    className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-slate-300 uppercase"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1 text-right">
                  <button
                    type="button"
                    onClick={() => handleRemoveDiscipline(idx)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-900"
                    title="Remover Disciplina"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Variables Reference Box */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2 mb-2">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Tags e Variáveis Disponíveis na Mala Direta</span>
          </h4>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <span className="bg-slate-950 px-2 py-1 rounded text-amber-400 border border-slate-800">{`{{nome}}`}</span>
            <span className="bg-slate-950 px-2 py-1 rounded text-amber-400 border border-slate-800">{`{{cpf}}`}</span>
            <span className="bg-slate-950 px-2 py-1 rounded text-amber-400 border border-slate-800">{`{{registro}}`}</span>
            <span className="bg-slate-950 px-2 py-1 rounded text-amber-400 border border-slate-800">{`{{categoria}}`}</span>
            <span className="bg-slate-950 px-2 py-1 rounded text-amber-400 border border-slate-800">{`{{curso}}`}</span>
            <span className="bg-slate-950 px-2 py-1 rounded text-amber-400 border border-slate-800">{`{{periodo_inicio}}`}</span>
            <span className="bg-slate-950 px-2 py-1 rounded text-amber-400 border border-slate-800">{`{{periodo_fim}}`}</span>
            <span className="bg-slate-950 px-2 py-1 rounded text-amber-400 border border-slate-800">{`{{carga_horaria}}`}</span>
            <span className="bg-slate-950 px-2 py-1 rounded text-amber-400 border border-slate-800">{`{{codigo_certificado}}`}</span>
            <span className="bg-slate-950 px-2 py-1 rounded text-amber-400 border border-slate-800">{`{{hash_autenticidade}}`}</span>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end space-x-4">
          {saveSuccess && (
            <span className="text-emerald-400 text-xs font-bold flex items-center space-x-1 animate-pulse">
              <FileCheck className="w-4 h-4" />
              <span>Modelo atualizado com sucesso!</span>
            </span>
          )}

          <button
            type="submit"
            id="btn-save-template"
            className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg transition-all"
          >
            <Save className="w-5 h-5" />
            <span>Salvar Alterações no Modelo</span>
          </button>
        </div>
      </form>
    </div>
  );
};
