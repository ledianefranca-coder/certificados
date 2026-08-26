import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { CourseTemplate, Student } from '../types';
import { BADM_QGEX_LOGO_SVG, DIGITAL_SIGNATURE_SVG, QGEX_WATERMARK_IMG, SGEX_LOGO_SVG } from './assets';

/**
 * Converts SVG Data URI to an Image element or Canvas data URL for jsPDF embedding
 */
function svgToPngDataUrl(svgDataUri: string, width = 300, height = 300): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/png'));
      } else {
        resolve('');
      }
    };
    img.onerror = () => resolve('');
    img.src = svgDataUri;
  });
}

function loadWatermarkDataUrl(imgSrc: string, opacity = 0.15): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1188; // 4 * 297
      canvas.height = 840; // 4 * 210
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.globalAlpha = opacity;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png'));
      } else {
        resolve('');
      }
    };
    img.onerror = () => resolve('');
    img.src = imgSrc;
  });
}

// Cache rasterized badges for ultra-fast generation
let cachedSgexPng = '';
let cachedBadmPng = '';
let cachedSignaturePng = '';
let cachedWatermarkPng = '';

export async function preloadAssets(): Promise<void> {
  if (!cachedSgexPng) {
    cachedSgexPng = await svgToPngDataUrl(SGEX_LOGO_SVG, 320, 440);
  }
  if (!cachedBadmPng) {
    cachedBadmPng = await svgToPngDataUrl(BADM_QGEX_LOGO_SVG, 320, 440);
  }
  if (!cachedSignaturePng) {
    cachedSignaturePng = await svgToPngDataUrl(DIGITAL_SIGNATURE_SVG, 520, 180);
  }
  if (!cachedWatermarkPng) {
    cachedWatermarkPng = await loadWatermarkDataUrl(QGEX_WATERMARK_IMG, 0.13);
  }
}

/**
 * Generates a complete 2-page PDF (Frente & Verso) for a given student & template
 */
export async function generateCertificatePdf(
  student: Student,
  template: CourseTemplate,
  existingDoc?: jsPDF,
  validationBaseUrl = window.location.origin
): Promise<jsPDF> {
  await preloadAssets();

  // A4 Landscape dimensions: 297mm x 210mm
  const doc = existingDoc || new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // Generate QR Code URL
  const verifyUrl = `${validationBaseUrl}/?verify=${student.certificateCode}&hash=${student.authHash}`;
  let qrCodeDataUrl = '';
  try {
    qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
      margin: 1,
      width: 140,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
      },
    });
  } catch (e) {
    console.error('Error generating QR code', e);
  }

  // ==========================================
  // PAGE 1: FRENTE (FRONT)
  // ==========================================
  drawFrontPage(doc, student, template, pageWidth, pageHeight);

  // ==========================================
  // PAGE 2: VERSO (BACK)
  // ==========================================
  doc.addPage('a4', 'landscape');
  drawBackPage(doc, student, template, pageWidth, pageHeight, qrCodeDataUrl);

  return doc;
}

function drawFrontPage(
  doc: jsPDF,
  student: Student,
  template: CourseTemplate,
  w: number,
  h: number
) {
  // Marfim suave e moldura institucional contemporânea
  doc.setFillColor(250, 248, 241);
  doc.rect(0, 0, w, h, 'F');

  // Watermark Background (Full Certificate Coverage)
  if (cachedWatermarkPng) {
    doc.addImage(cachedWatermarkPng, 'PNG', 0, 0, w, h);
  }

  // Ornate double border
  doc.setDrawColor(31, 58, 45);
  doc.setLineWidth(1.5);
  doc.rect(10, 10, w - 20, h - 20);

  doc.setDrawColor(182, 148, 75);
  doc.setLineWidth(0.55);
  doc.rect(12.5, 12.5, w - 25, h - 25);

  // Top Logos (SGEX on left, B-ADM-QGEX on right)
  if (cachedSgexPng) {
    doc.addImage(cachedSgexPng, 'PNG', 18, 16, 18, 24.75);
  }
  if (cachedBadmPng) {
    doc.addImage(cachedBadmPng, 'PNG', w - 36, 16, 18, 24.75);
  }

  doc.setTextColor(73, 106, 77);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('INSTITUIÇÃO DE ENSINO DE TRÂNSITO', w / 2, 22, { align: 'center', charSpace: 1.2 });

  // Título principal
  doc.setTextColor(31, 58, 45);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(27);
  doc.text(template.title || 'CERTIFICADO', w / 2, 34, { align: 'center', charSpace: 1.6 });

  // Center ornament underline
  doc.setDrawColor(182, 148, 75);
  doc.setLineWidth(0.55);
  doc.line(w / 2 - 28, 39, w / 2 + 28, 39);

  // Subtitle / Course Name
  doc.setTextColor(73, 106, 77);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Certificamos que', w / 2, 57, { align: 'center' });

  doc.setTextColor(31, 58, 45);
  doc.setFont('times', 'bold');
  doc.setFontSize(student.name.length > 36 ? 20 : 24);
  doc.text(student.name.toUpperCase(), w / 2, 72, { align: 'center', maxWidth: w - 64 });

  doc.setDrawColor(182, 148, 75);
  doc.setLineWidth(0.45);
  doc.line(w / 2 - 42, 78, w / 2 + 42, 78);

  const bodyText = `CPF nº ${student.cpf} e nº de registro ${student.registrationNumber}, categoria "${student.category}", concluiu com aproveitamento o Curso Especializado para ${template.courseTitle}, realizado pela IET – Forte Caxias, no período de ${student.periodStart} a ${student.periodEnd}, com carga horária de ${student.workload}, conforme ${template.legalResolution}.`;

  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(37, 41, 37);
  const textLines = doc.splitTextToSize(bodyText, w - 70);
  doc.text(textLines, w / 2, 91, { align: 'center', lineHeightFactor: 1.45, maxWidth: w - 70 });

  // City & Date
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(31, 58, 45);
  doc.text(`${template.baseLocation}, ${student.issueDate}`, w / 2, 137, { align: 'center' });

  // Digital Signature on bottom left
  if (cachedSignaturePng) {
    doc.addImage(cachedSignaturePng, 'PNG', 32, 142, 38, 13);
  }

  // Signature line & Director details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(template.directorName, 48, 159, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(template.directorRole, 48, 163, { align: 'center' });
  doc.text(`CPF ${template.directorCpf}`, 48, 167, { align: 'center' });

  // Institution CNPJ on bottom right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(template.cnpj, w - 24, 160, { align: 'right' });
  doc.setFontSize(7.5);
  doc.text(template.institutionName, w - 24, 164, { align: 'right' });

  // Identificação e orientação de verificação
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Certificado nº ${student.certificateCode}  •  Consulte a autenticidade pelo QR Code no verso`, w / 2, h - 14, { align: 'center' });
}

function drawBackPage(
  doc: jsPDF,
  student: Student,
  template: CourseTemplate,
  w: number,
  h: number,
  qrCodeDataUrl: string
) {
  // Fundo e moldura em continuidade com a frente
  doc.setFillColor(250, 248, 241);
  doc.rect(0, 0, w, h, 'F');

  // Watermark Background (Full Certificate Coverage)
  if (cachedWatermarkPng) {
    doc.addImage(cachedWatermarkPng, 'PNG', 0, 0, w, h);
  }

  // Outer border
  doc.setDrawColor(31, 58, 45);
  doc.setLineWidth(1.5);
  doc.rect(10, 10, w - 20, h - 20);
  doc.setDrawColor(182, 148, 75);
  doc.setLineWidth(0.55);
  doc.rect(12.5, 12.5, w - 25, h - 25);

  // Top Header: SGEX, Institution Name, B-ADM-QGEX
  if (cachedSgexPng) {
    doc.addImage(cachedSgexPng, 'PNG', 18, 16, 16, 22);
  }
  if (cachedBadmPng) {
    doc.addImage(cachedBadmPng, 'PNG', w - 34, 16, 16, 22);
  }

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(15, 23, 42);
  doc.text(template.institutionName, w / 2, 24, { align: 'center' });
  doc.setFontSize(13);
  doc.text(template.institutionSubtext, w / 2, 30, { align: 'center' });

  // Programmatic Content & Code
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('CONTEÚDO PROGRAMÁTICO', w / 2, 42, { align: 'center' });
  doc.text(student.certificateCode, w - 28, 42, { align: 'center' });

  // Disciplines Table
  const tableX = 22;
  const tableY = 48;
  const tableW = w - 44;
  const colW = [tableW * 0.35, tableW * 0.18, tableW * 0.15, tableW * 0.32]; // Disciplina, Carga, Nota, Instrutor

  // Header Row
  doc.setFillColor(241, 245, 249);
  doc.rect(tableX, tableY, tableW, 9, 'FD');
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.3);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('DISCIPLINA', tableX + 4, tableY + 6);
  doc.text('CARGA HORÁRIA', tableX + colW[0] + colW[1] / 2, tableY + 6, { align: 'center' });
  doc.text('AVALIAÇÃO', tableX + colW[0] + colW[1] + colW[2] / 2, tableY + 6, { align: 'center' });
  doc.text('INSTRUTOR', tableX + colW[0] + colW[1] + colW[2] + 4, tableY + 6);

  // Table rows
  let currentY = tableY + 9;
  const studentGrades = student.grades && student.grades.length > 0 ? student.grades : template.disciplines.map(d => ({
    discipline: d.discipline,
    workload: d.workload,
    grade: d.defaultGrade,
    instructor: d.instructor,
  }));

  studentGrades.forEach((item, index) => {
    const rowHeight = 12;
    // Row background (subtle light stripes)
    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(tableX, currentY, tableW, rowHeight, 'F');
    }

    // Grid lines
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.2);
    doc.rect(tableX, currentY, tableW, rowHeight);
    doc.line(tableX + colW[0], currentY, tableX + colW[0], currentY + rowHeight);
    doc.line(tableX + colW[0] + colW[1], currentY, tableX + colW[0] + colW[1], currentY + rowHeight);
    doc.line(tableX + colW[0] + colW[1] + colW[2], currentY, tableX + colW[0] + colW[1] + colW[2], currentY + rowHeight);

    // Row texts
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    
    // Split long discipline names
    const discLines = doc.splitTextToSize(item.discipline, colW[0] - 6);
    doc.text(discLines, tableX + 4, currentY + (discLines.length > 1 ? 4.5 : 7));

    doc.setFont('helvetica', 'normal');
    doc.text(item.workload, tableX + colW[0] + colW[1] / 2, currentY + 7, { align: 'center' });
    
    doc.setFont('helvetica', 'bold');
    doc.text(String(item.grade), tableX + colW[0] + colW[1] + colW[2] / 2, currentY + 7, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    const instLines = doc.splitTextToSize(item.instructor, colW[3] - 6);
    doc.text(instLines, tableX + colW[0] + colW[1] + colW[2] + 4, currentY + 7);

    currentY += rowHeight;
  });

  // QR Code & Verification Box on bottom right
  const qrBoxY = Math.max(currentY + 6, 125);
  if (qrCodeDataUrl) {
    doc.addImage(qrCodeDataUrl, 'PNG', w - 46, qrBoxY, 20, 20);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('VERIFICAÇÃO DE AUTENTICIDADE', w - 50, qrBoxY + 5, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Código de Registro: ${student.certificateCode}`, w - 50, qrBoxY + 9, { align: 'right' });
  doc.text(`Hash de Segurança: ${student.authHash}`, w - 50, qrBoxY + 13, { align: 'right' });
  doc.text('Aponte a câmera para consultar este registro institucional.', w - 50, qrBoxY + 17, { align: 'right' });

  // Official disclaimer
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Emitido em ${student.issueDate} • Documento sujeito à conferência pela instituição emissora.`, 22, h - 14);
}

/**
 * Generates an array of PDFs and zips them into a downloadable file.
 * Returns progress updates for live benchmark / chronometer validation!
 */
export async function generateBatchZip(
  students: Student[],
  template: CourseTemplate,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder('certificados');

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const doc = await generateCertificatePdf(student, template);
    const pdfBlob = doc.output('blob');
    const filename = `Certificado_${student.certificateCode.replace(/\//g, '_')}_${student.name.replace(/\s+/g, '_')}.pdf`;
    folder?.file(filename, pdfBlob);

    if (onProgress) {
      onProgress(i + 1, students.length);
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}

/**
 * Generates a unified multi-page PDF containing all students
 */
export async function generateMergedBatchPdf(
  students: Student[],
  template: CourseTemplate,
  onProgress?: (current: number, total: number) => void
): Promise<jsPDF> {
  let masterDoc: jsPDF | undefined;

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    if (i === 0) {
      masterDoc = await generateCertificatePdf(student, template);
    } else if (masterDoc) {
      masterDoc.addPage('a4', 'landscape');
      drawFrontPage(masterDoc, student, template, 297, 210);
      masterDoc.addPage('a4', 'landscape');
      const verifyUrl = `${window.location.origin}/?verify=${student.certificateCode}&hash=${student.authHash}`;
      let qr = '';
      try {
        qr = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 140 });
      } catch (e) {
        console.error(e);
      }
      drawBackPage(masterDoc, student, template, 297, 210, qr);
    }

    if (onProgress) {
      onProgress(i + 1, students.length);
    }
  }

  return masterDoc!;
}
