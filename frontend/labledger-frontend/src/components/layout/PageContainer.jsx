import React from 'react';
import Navbar from './Navbar';

export default function PageContainer({ children, showNav = true }) {
  return (
    <div className="min-h-screen bg-gh-bg text-gh-text flex flex-col">
      {showNav && <Navbar />}
      <main className="flex-1 px-4 py-8 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
