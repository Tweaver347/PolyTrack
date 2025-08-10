'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    window.location.href = '/';
  }

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="text-xl font-semibold mb-2">Sign in</h1>
      <p className="text-sm text-gray-500 mb-4">Use the test user you created in Supabase.</p>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded-md border px-3 py-2 bg-transparent" placeholder="email"
               value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full rounded-md border px-3 py-2 bg-transparent" placeholder="password" type="password"
               value={password} onChange={e => setPassword(e.target.value)} />
        {err && <div className="text-sm text-red-500">{err}</div>}
        <button disabled={loading} className="w-full rounded-md border px-3 py-2">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
