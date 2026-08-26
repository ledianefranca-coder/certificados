export function maskCpf(cpf: string): string {
  const digits = cpf.replace(/\D/g, '');

  if (digits.length !== 11) return cpf;

  return `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**`;
}

