export interface Student {
  id: string;
  name: string;
  cpf: string;
  registrationNumber: string; // Nº Registro CNH/Aluno
  category: string; // Ex: "AD", "B", "D", "E"
  email: string;
  phone?: string;
  courseId: string;
  courseName: string;
  periodStart: string;
  periodEnd: string;
  workload: string; // e.g. "50h/a"
  issueDate: string; // e.g. "18 de junho de 2026"
  certificateCode: string; // e.g. "006/CVTE/2026"
  authHash: string; // Unique cryptographic validation code
  status: 'approved' | 'in_progress' | 'failed';
  emailSentStatus?: 'pending' | 'sent' | 'delivered' | 'failed';
  emailSentAt?: string;
  grades: {
    discipline: string;
    workload: string;
    grade: string | number;
    instructor: string;
  }[];
}

export interface CourseTemplate {
  id: string;
  name: string;
  institutionName: string;
  institutionSubtext: string;
  regulationText: string;
  title: string;
  courseTitle: string;
  directorName: string;
  directorRole: string;
  directorCpf: string;
  cnpj: string;
  baseLocation: string; // e.g. "Brasília-DF"
  validityYears: number; // e.g. 5
  legalResolution: string; // e.g. "Resolução Nº 1.020/2025 do CONTRAN"
  theme: 'military' | 'corporate' | 'academic' | 'modern';
  disciplines: {
    discipline: string;
    workload: string;
    defaultGrade: string;
    instructor: string;
  }[];
  customLogoLeft?: string;
  customLogoRight?: string;
  customSignature?: string;
}

export interface IssuedCertificate {
  id: string;
  certificateCode: string;
  authHash: string;
  studentId: string;
  studentName: string;
  studentCpf: string;
  courseName: string;
  issueDate: string;
  status: 'valid' | 'revoked';
  templateId: string;
  emailSent: boolean;
  generatedAt: string;
}

export interface BenchmarkResult {
  totalCount: number;
  durationMs: number;
  perCertificateMs: number;
  successCount: number;
  failedCount: number;
  timestamp: string;
}
