'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-mono">
      <div className="max-w-md w-full space-y-8 text-center">
        
        {/* Error Code */}
        <div className="space-y-2">
          <p className="text-[10px] tracking-[0.6em] text-[#ccc] uppercase">Error 404</p>
          <h1 className="text-4xl text-[#111] font-medium tracking-tighter">Lost in space.</h1>
        </div>

        {/* Message */}
        <p className="text-xs text-[#666] leading-relaxed max-w-[280px] mx-auto">
          The page you are looking for does not exist or has been moved to another dimension.
        </p>

        {/* Action */}
        <div className="pt-4">
          <Link 
            href="/"
            className="inline-block border border-[#111] px-8 py-3 text-[10px] tracking-[0.4em] uppercase hover:bg-[#111] hover:text-white transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>

        {/* Decorative Element */}
        <div className="pt-12 flex justify-center gap-1.5">
          <div className="w-1 h-1 bg-[#ebebeb] rounded-full animate-pulse" />
          <div className="w-1 h-1 bg-[#ebebeb] rounded-full animate-pulse delay-75" />
          <div className="w-1 h-1 bg-[#ebebeb] rounded-full animate-pulse delay-150" />
        </div>

      </div>
    </div>
  );
}
