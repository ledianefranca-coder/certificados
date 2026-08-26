import React, { useState } from 'react';
import { 
  Code2, 
  Key, 
  Send, 
  Check, 
  Copy, 
  Play, 
  Terminal, 
  Layers, 
  Sparkles, 
  Webhook,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { Student } from '../types';
import { generateCryptoHash } from '../utils/sampleData';

interface ApiIntegrationDocsProps {
  onStudentGeneratedViaApi: (student: Student) => void;
}

export const ApiIntegrationDocs: React.FC<ApiIntegrationDocsProps> = ({
  onStudentGeneratedViaApi,
}) => {
  const [activeLang, setActiveLang] = useState<'curl' | 'node' | 'python' | 'php'>('curl');
  const [selectedPlatform, setSelectedPlatform] = useState('hotmart');
  const [apiKey, setApiKey] = useState('ctf_live_98a72f01bc448e2910d55e');
  const [isCopiedKey, setIsCopiedKey] = useState(false);
  const [isCopiedCode, setIsCopiedCode] = useState(false);

  // Webhook Simulator State
  const [simulatorState, setSimulatorState] = useState({
    studentName: 'MARINA SILVEIRA CASTRO',
    studentCpf: '319.448.102-88',
    studentEmail: 'marina.castro@gmail.com',
    cnhRegister: '09817263541',
    category: 'AD',
    courseName: 'Condutores de Veículos de Transporte de Emergência',
  });

  const [simulatorResponse, setSimulatorResponse] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsCopiedKey(true);
    setTimeout(() => setIsCopiedKey(false), 2000);
  };

  const handleSimulateWebhook = async () => {
    setIsSimulating(true);
    setSimulatorResponse(null);

    await new Promise(r => setTimeout(r, 450));

    const certCode = `${Math.floor(Math.random() * 800 + 100)}/CVTE/2026`;
    const authHash = generateCryptoHash(simulatorState.studentName + simulatorState.studentCpf);

    const createdStudent: Student = {
      id: `api-auto-${Date.now()}`,
      name: simulatorState.studentName.toUpperCase(),
      cpf: simulatorState.studentCpf,
      registrationNumber: simulatorState.cnhRegister,
      category: simulatorState.category,
      email: simulatorState.studentEmail,
      courseId: 'template-iet-qgex',
      courseName: simulatorState.courseName,
      periodStart: '08 de junho de 2026',
      periodEnd: '16 de junho de 2026',
      workload: '50h/a',
      issueDate: '18 de junho de 2026',
      certificateCode: certCode,
      authHash: authHash,
      status: 'approved',
      emailSentStatus: 'delivered',
      emailSentAt: new Date().toISOString(),
      grades: [
        { discipline: 'Legislação de Trânsito', workload: '10h/a', grade: '10', instructor: 'PAULO DE JESUS CAMARGO' },
        { discipline: 'Direção Defensiva', workload: '15h/a', grade: '9,5', instructor: 'ERIK ANDRE RODRIGUES SANTIAGO' },
        { discipline: 'Primeiros Socorros e Atendimento Inicial', workload: '15h/a', grade: '10', instructor: 'FELIPE VILELA DA COSTA' },
        { discipline: 'Comportamento e Convívio Social', workload: '10h/a', grade: '10', instructor: 'ERIK ANDRE RODRIGUES SANTIAGO' },
      ],
    };

    onStudentGeneratedViaApi(createdStudent);

    setSimulatorResponse({
      status: 'success',
      code: 201,
      message: 'Certificado emitido e enviado automaticamente por e-mail com sucesso.',
      data: {
        certificate_id: createdStudent.id,
        certificate_code: certCode,
        auth_hash: authHash,
        validation_url: `${window.location.origin}/?verify=${certCode}&hash=${authHash}`,
        email_dispatched_to: simulatorState.studentEmail,
        generated_in_ms: 114,
      },
    });

    setIsSimulating(false);
  };

  const codeSnippets = {
    curl: `curl -X POST https://api.certificafast.com/v1/certificates/generate \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "student_name": "${simulatorState.studentName}",
    "student_cpf": "${simulatorState.studentCpf}",
    "registration_number": "${simulatorState.cnhRegister}",
    "category": "${simulatorState.category}",
    "student_email": "${simulatorState.studentEmail}",
    "course_id": "template-iet-qgex",
    "send_email_immediately": true
  }'`,
    node: `import axios from 'axios';

const response = await axios.post('https://api.certificafast.com/v1/certificates/generate', {
  student_name: '${simulatorState.studentName}',
  student_cpf: '${simulatorState.studentCpf}',
  registration_number: '${simulatorState.cnhRegister}',
  category: '${simulatorState.category}',
  student_email: '${simulatorState.studentEmail}',
  course_id: 'template-iet-qgex',
  send_email_immediately: true
}, {
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  }
});

console.log('Certificado Emitido:', response.data);`,
    python: `import requests

url = "https://api.certificafast.com/v1/certificates/generate"
headers = {
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json"
}
payload = {
    "student_name": "${simulatorState.studentName}",
    "student_cpf": "${simulatorState.studentCpf}",
    "registration_number": "${simulatorState.cnhRegister}",
    "category": "${simulatorState.category}",
    "student_email": "${simulatorState.studentEmail}",
    "course_id": "template-iet-qgex",
    "send_email_immediately": True
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
    php: `<?php
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.certificafast.com/v1/certificates/generate",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => json_encode([
    "student_name" => "${simulatorState.studentName}",
    "student_cpf" => "${simulatorState.studentCpf}",
    "registration_number" => "${simulatorState.cnhRegister}",
    "category" => "${simulatorState.category}",
    "student_email" => "${simulatorState.studentEmail}",
    "course_id" => "template-iet-qgex",
    "send_email_immediately" => true
  ]),
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer ${apiKey}",
    "Content-Type: application/json"
  ],
]);

$response = curl_exec($curl);
curl_close($curl);
echo $response;
?>`,
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeLang]);
    setIsCopiedCode(true);
    setTimeout(() => setIsCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-white">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center space-x-2">
            <Code2 className="w-6 h-6 text-amber-400" />
            <span>Integração via API &amp; Webhooks com Plataformas LMS</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Conecte Hotmart, Kiwify, Moodle, Eduzz, Teachable ou sistemas próprios para emitir certificados automaticamente após a aprovação do aluno.
          </p>
        </div>

        {/* API Key Box */}
        <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 flex items-center space-x-3">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Sua API Key Secreta</span>
            <code className="text-xs text-amber-400 font-mono font-bold">{apiKey.slice(0, 14)}••••••••</code>
          </div>
          <button
            onClick={handleCopyKey}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            title="Copiar API Key"
          >
            {isCopiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Interactive Webhook Simulator */}
      <div className="bg-slate-900 border-2 border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Webhook className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Simulador de Webhook em Tempo Real</h3>
              <p className="text-xs text-slate-400">Teste o disparo simulando a conclusão de curso de um aluno em um LMS</p>
            </div>
          </div>

          {/* Platform Selector */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['hotmart', 'kiwify', 'moodle', 'eduzz', 'classroom'].map((plat) => (
              <button
                key={plat}
                onClick={() => setSelectedPlatform(plat)}
                className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition-all ${
                  selectedPlatform === plat ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {plat}
              </button>
            ))}
          </div>
        </div>

        {/* Simulator Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div>
            <label className="block text-slate-400 text-xs mb-1">Nome do Aluno Formando</label>
            <input
              type="text"
              value={simulatorState.studentName}
              onChange={(e) => setSimulatorState({ ...simulatorState, studentName: e.target.value })}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-bold uppercase"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs mb-1">CPF do Aluno</label>
            <input
              type="text"
              value={simulatorState.studentCpf}
              onChange={(e) => setSimulatorState({ ...simulatorState, studentCpf: e.target.value })}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs mb-1">E-mail para Disparo</label>
            <input
              type="email"
              value={simulatorState.studentEmail}
              onChange={(e) => setSimulatorState({ ...simulatorState, studentEmail: e.target.value })}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs mb-1">Registro CNH</label>
            <input
              type="text"
              value={simulatorState.cnhRegister}
              onChange={(e) => setSimulatorState({ ...simulatorState, cnhRegister: e.target.value })}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs mb-1">Categoria</label>
            <input
              type="text"
              value={simulatorState.category}
              onChange={(e) => setSimulatorState({ ...simulatorState, category: e.target.value })}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-bold"
            />
          </div>

          <div className="flex items-end">
            <button
              id="btn-simulate-webhook-trigger"
              onClick={handleSimulateWebhook}
              disabled={isSimulating}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg flex items-center justify-center space-x-2 shadow-md transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isSimulating ? 'Emitindo via API...' : `Simular Webhook (${selectedPlatform})`}</span>
            </button>
          </div>
        </div>

        {/* Simulator Response Preview */}
        {simulatorResponse && (
          <div className="bg-slate-950 border border-emerald-500/40 p-4 rounded-xl space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Resposta 201 Created &bull; Certificado Gerado com Sucesso!</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{simulatorResponse.data.generated_in_ms}ms</span>
            </div>
            <pre className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto">
              {JSON.stringify(simulatorResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Code Snippets Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold text-white">Exemplos de Código para Integração</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              {(['curl', 'node', 'python', 'php'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-3 py-1 rounded-md uppercase font-mono font-bold transition-all ${
                    activeLang === lang ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyCode}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs flex items-center space-x-1 transition-colors"
            >
              {isCopiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopiedCode ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        <pre className="p-5 bg-slate-950 font-mono text-xs text-amber-300/90 overflow-x-auto leading-relaxed">
          {codeSnippets[activeLang]}
        </pre>
      </div>
    </div>
  );
};
