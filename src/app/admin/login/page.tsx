'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { loginAdmin } = await import('@/actions/auth');
    const res = await loginAdmin(email, password);
    if (res.success) {
      router.push('/admin');
    } else {
      setError('Access denied.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-mono p-6">
      <div className="w-full max-w-xs space-y-10">

        {/* Header */}
        <div className="space-y-1">
          <p className="text-[9px] tracking-[0.5em] text-[#999] uppercase">Console</p>
          <h1 className="text-2xl text-[#111] font-medium tracking-tight">Authenticate.</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[9px] tracking-[0.4em] uppercase text-[#666]">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#fafafa] border border-[#ebebeb] text-[#111] text-xs px-4 py-3 focus:outline-none focus:border-[#ccc] transition-colors placeholder-[#bbb]"
              placeholder="admin@gmail.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] tracking-[0.4em] uppercase text-[#666]">Password</label>
            <div className="relative">
              <input
                required
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#fafafa] border border-[#ebebeb] text-[#111] text-xs px-4 py-3 pr-16 focus:outline-none focus:border-[#ccc] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] tracking-widest text-[#999] hover:text-[#111] transition-colors uppercase cursor-pointer"
              >
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[9px] tracking-widest text-red-500 uppercase">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full bg-[#111] text-white text-[10px] tracking-[0.4em] uppercase py-4 hover:bg-black transition-colors disabled:opacity-30 font-medium mt-2 cursor-pointer"
          >
            {loading ? 'Verifying...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
}