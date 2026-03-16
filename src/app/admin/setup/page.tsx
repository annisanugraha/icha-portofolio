'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export default function SetupAdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('Checking users...');

    try {
      // 1. Check if user already exists
      const { count } = await supabase
        .from('User')
        .select('*', { count: 'exact', head: true });

      if (count && count > 0) {
        setStatus('Admin already exists. Please use login.');
        setLoading(false);
        return;
      }

      // 2. Hash password
      setStatus('Hashing password...');
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. Create user
      setStatus('Creating admin...');
      const { error } = await supabase
        .from('User')
        .insert({
          email: email,
          password: hashedPassword
        });

      if (error) throw error;

      setStatus('Success! Redirecting to login...');
      setTimeout(() => router.push('/admin/login'), 2000);
    } catch (error: any) {
      console.error('Setup error:', error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-mono p-6">
      <div className="w-full max-w-xs space-y-10">
        <div className="space-y-1">
          <p className="text-[9px] tracking-[0.5em] text-[#999] uppercase">Setup</p>
          <h1 className="text-2xl text-[#111] font-medium tracking-tight">Create Admin.</h1>
        </div>

        <form onSubmit={handleSetup} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[9px] tracking-[0.4em] uppercase text-[#666]">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#fafafa] border border-[#ebebeb] text-[#111] text-xs px-4 py-3 focus:outline-none focus:border-[#ccc]"
              placeholder="admin@gmail.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] tracking-[0.4em] uppercase text-[#666]">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#fafafa] border border-[#ebebeb] text-[#111] text-xs px-4 py-3 focus:outline-none focus:border-[#ccc]"
            />
          </div>

          {status && (
            <p className="text-[9px] tracking-widest text-[#999] uppercase">{status}</p>
          )}

          <button
            disabled={loading}
            className="w-full bg-[#111] text-white text-[10px] tracking-[0.4em] uppercase py-4 hover:bg-black transition-colors disabled:opacity-30 font-medium mt-2"
          >
            {loading ? 'Processing...' : 'Create Admin Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
