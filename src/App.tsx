/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CertificatePreview } from './components/CertificatePreview';
import { BenchmarkRunner } from './components/BenchmarkRunner';
import { StudentManager } from './components/StudentManager';
import { CertificateManager } from './components/CertificateManager';
import { TemplateEditor } from './components/TemplateEditor';
import { EmailAutomationModal } from './components/EmailAutomationModal';
import { ApiIntegrationDocs } from './components/ApiIntegrationDocs';
import { PublicValidator } from './components/PublicValidator';
import { VercelDeployGuide } from './components/VercelDeployGuide';
import { CourseTemplate, Student } from './types';
import { DEFAULT_TEMPLATE, INITIAL_STUDENTS } from './utils/sampleData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('generator');
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('cert_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [currentTemplate, setCurrentTemplate] = useState<CourseTemplate>(() => {
    const saved = localStorage.getItem('cert_template');
    return saved ? JSON.parse(saved) : DEFAULT_TEMPLATE;
  });

  const [currentStudentIndex, setCurrentStudentIndex] = useState<number>(0);
  const [verifyParamCode, setVerifyParamCode] = useState<string>('');
  const [verifyParamHash, setVerifyParamHash] = useState<string>('');

  // Check URL query params for verification link: e.g. ?verify=006/CVTE/2026&hash=SHA-...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verifyCode = params.get('verify');
    const verifyHash = params.get('hash');

    if (verifyCode || verifyHash) {
      setVerifyParamCode(verifyCode || '');
      setVerifyParamHash(verifyHash || '');
      setActiveTab('validator');
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('cert_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('cert_template', JSON.stringify(currentTemplate));
  }, [currentTemplate]);

  // Handlers
  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (currentStudentIndex >= students.length - 1) {
      setCurrentStudentIndex(Math.max(0, students.length - 2));
    }
  };

  const handleUpdateEmailStatus = (
    studentId: string,
    status: 'pending' | 'sent' | 'delivered' | 'failed'
  ) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              emailSentStatus: status,
              emailSentAt: status === 'delivered' ? new Date().toISOString() : s.emailSentAt,
            }
          : s
      )
    );
  };

  const handleSelectStudentForPreview = (index: number) => {
    setCurrentStudentIndex(index);
    setActiveTab('generator');
  };

  const pendingEmailCount = students.filter(
    (s) => s.status === 'approved' && s.emailSentStatus !== 'delivered'
  ).length;

  const approvedCount = students.filter((s) => s.status === 'approved').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingEmailCount}
        studentsCount={students.length}
        issuedCount={approvedCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'generator' && (
          <CertificatePreview
            students={students}
            currentStudentIndex={currentStudentIndex}
            setCurrentStudentIndex={setCurrentStudentIndex}
            template={currentTemplate}
            onNavigateToBenchmark={() => setActiveTab('benchmark')}
          />
        )}

        {activeTab === 'benchmark' && (
          <BenchmarkRunner
            students={students}
            template={currentTemplate}
            onOpenEmailModal={() => setActiveTab('emails')}
          />
        )}

        {activeTab === 'students' && (
          <StudentManager
            students={students}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onSelectStudentForPreview={handleSelectStudentForPreview}
          />
        )}

        {activeTab === 'certificates' && (
          <CertificateManager
            students={students}
            template={currentTemplate}
            onSelectForPreview={handleSelectStudentForPreview}
            onSendEmailToStudent={(std) => {
              handleUpdateEmailStatus(std.id, 'delivered');
              setActiveTab('emails');
            }}
          />
        )}

        {activeTab === 'templates' && (
          <TemplateEditor
            currentTemplate={currentTemplate}
            onUpdateTemplate={setCurrentTemplate}
            onSelectTemplate={setCurrentTemplate}
          />
        )}

        {activeTab === 'emails' && (
          <EmailAutomationModal
            students={students}
            template={currentTemplate}
            onUpdateStudentEmailStatus={handleUpdateEmailStatus}
          />
        )}

        {activeTab === 'api' && (
          <ApiIntegrationDocs
            onStudentGeneratedViaApi={(newStd) => {
              handleAddStudent(newStd);
              setCurrentStudentIndex(0);
            }}
          />
        )}

        {activeTab === 'validator' && (
          <PublicValidator
            students={students}
            template={currentTemplate}
            initialCode={verifyParamCode}
            initialHash={verifyParamHash}
          />
        )}

        {activeTab === 'deploy' && <VercelDeployGuide />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-left">
            <span className="font-bold text-slate-200">Certificado</span>
            <span>&bull;</span>
            <span>Sistema Oficial de Geração de Certificados IET</span>
          </div>
          <div className="text-slate-400">
            Base Administrativa do Quartel-General do Exército &bull; Forte Caxias
          </div>
        </div>
      </footer>
    </div>
  );
}
