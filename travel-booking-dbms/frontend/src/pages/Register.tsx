import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { Field, Notice, ErrorMessage } from './shared';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '', passport_no: '' });
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const navigate = useNavigate();
  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setError(''); setLoading(true); try { await authApi.register(form); navigate('/login'); } catch (err) { setError(ErrorMessage(err)); } finally { setLoading(false); } };
  return <div className="max-w-md mx-auto px-4 py-10"><div className="bg-white p-8 rounded-lg shadow-sm border"><h1 className="text-3xl font-bold mb-2">Create your account</h1><p className="text-gray-600 mb-6">Start planning your next journey.</p>{error && <div className="mb-4"><Notice>{error}</Notice></div>}<form onSubmit={submit} className="space-y-4">{[['name','Full name'],['email','Email'],['password','Password'],['phone','Phone'],['address','Address'],['passport_no','Passport number']].map(([key,label]) => <Field key={key} label={label}><input className="form-input" type={key === 'password' ? 'password' : key === 'email' ? 'email' : 'text'} value={form[key as keyof typeof form]} onChange={(e) => update(key, e.target.value)} required={['name','email','password'].includes(key)} /></Field>)}<button className="btn-primary w-full" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button></form><p className="text-center text-gray-600 mt-6">Already registered? <Link className="text-blue-600 font-semibold" to="/login">Sign in</Link></p></div></div>;
}
