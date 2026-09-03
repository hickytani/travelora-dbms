import { ReactNode } from 'react';

export function Page({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  return <div className="max-w-7xl mx-auto px-4 py-8"><div className="flex flex-wrap items-center justify-between gap-4 mb-8"><h1 className="text-3xl font-bold text-gray-900">{title}</h1>{actions}</div>{children}</div>;
}

export function Notice({ children, tone = 'error' }: { children: ReactNode; tone?: 'error' | 'info' | 'success' }) {
  const styles = { error: 'bg-red-50 border-red-200 text-red-700', info: 'bg-blue-50 border-blue-200 text-blue-700', success: 'bg-green-50 border-green-200 text-green-700' };
  return <div className={`border px-4 py-3 rounded-lg ${styles[tone]}`}>{children}</div>;
}

export function Loading() { return <div className="py-16 text-center text-gray-500">Loading...</div>; }
export function Empty({ children = 'No records found.' }: { children?: ReactNode }) { return <div className="py-12 text-center text-gray-500 bg-white border border-dashed border-gray-300 rounded-lg">{children}</div>; }
export function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="block"><span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>{children}</label>; }
export function ErrorMessage(error: any) { return error?.response?.data?.message || error?.message || 'Something went wrong'; }
export function money(value: any) { return `₹${Number(value || 0).toLocaleString('en-IN')}`; }
export function statusClass(status: string) { return status === 'CONFIRMED' || status === 'SUCCESS' || status === 'COMPLETED' ? 'badge-success' : status === 'CANCELLED' || status === 'FAILED' ? 'badge-danger' : 'badge-warning'; }
