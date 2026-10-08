import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (id: number, email: string, role: 'customer' | 'admin'): string => {
  return jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: (process.env.JWT_EXPIRE || '7d') as jwt.SignOptions['expiresIn'] }
  );
};

export const generateMockTransactionId = (): string => {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const randomNum = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0');
  return `TXN-${dateStr}-${randomNum}`;
};
