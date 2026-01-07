import { useState, useEffect } from 'react';

export function DiagnosticPage() {
  const [diagnostics, setDiagnostics] = useState({
    fonts: 'checking...',
    images: 'checking...',
    localStorage: 'checking...',
    supabase: 'checking...',
    api: 'checking...',
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    // Check fonts
    const fontCheck = document.fonts.check('1em Plaak');
    setDiagnostics(prev => ({ ...prev, fonts: fontCheck ? '✅ Loaded' : '❌ Failed' }));

    // Check images
    const img = new Image();
    img.src = '/images/FastTrack_F_White_logo.png';
    img.onload = () => setDiagnostics(prev => ({ ...prev, images: '✅ Loaded' }));
    img.onerror = () => setDiagnostics(prev => ({ ...prev, images: '❌ Failed' }));

    // Check localStorage
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      setDiagnostics(prev => ({ ...prev, localStorage: '✅ Working' }));
    } catch {
      setDiagnostics(prev => ({ ...prev, localStorage: '❌ Blocked' }));
    }

    // Check Supabase
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    setDiagnostics(prev => ({ 
      ...prev, 
      supabase: supabaseUrl ? `✅ ${supabaseUrl}` : '❌ Missing VITE_SUPABASE_URL' 
    }));

    // Check API
    try {
      const response = await fetch('/api/submissions/list?companyId=test');
      const data = await response.json();
      setDiagnostics(prev => ({ 
        ...prev, 
        api: response.ok ? '✅ Working' : `❌ Failed: ${response.status}` 
      }));
    } catch (error) {
      setDiagnostics(prev => ({ 
        ...prev, 
        api: `❌ Error: ${error instanceof Error ? error.message : 'Unknown'}` 
      }));
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-plaak text-4xl mb-8">🔍 Diagnostic Page</h1>
        
        <div className="space-y-4">
          <DiagnosticCard title="Fonts (Plaak, Riforma, Monument)" status={diagnostics.fonts} />
          <DiagnosticCard title="Images (Logo, Cover)" status={diagnostics.images} />
          <DiagnosticCard title="LocalStorage" status={diagnostics.localStorage} />
          <DiagnosticCard title="Supabase Connection" status={diagnostics.supabase} />
          <DiagnosticCard title="API Endpoints" status={diagnostics.api} />
        </div>

        <div className="mt-8 p-6 bg-gray-100 border-l-4 border-black">
          <h2 className="font-plaak text-2xl mb-4">Environment Variables</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</div>
            <div>VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</div>
            <div>Mode: {import.meta.env.MODE}</div>
            <div>Dev: {import.meta.env.DEV ? 'Yes' : 'No'}</div>
            <div>Prod: {import.meta.env.PROD ? 'Yes' : 'No'}</div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="font-plaak text-2xl mb-4">Font Test</h2>
          <div className="space-y-2">
            <p className="font-plaak text-xl">Plaak Font - Should be BOLD</p>
            <p className="font-riforma text-lg">Riforma Font - Should be Regular</p>
            <p className="font-monument text-sm uppercase">Monument Font - Monospace</p>
          </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={runDiagnostics}
            className="bg-black text-white px-6 py-3 font-plaak hover:bg-gray-800"
          >
            🔄 Rerun Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
}

function DiagnosticCard({ title, status }: { title: string; status: string }) {
  const isSuccess = status.includes('✅');
  const isFailed = status.includes('❌');

  return (
    <div className={`p-4 border-l-4 ${isSuccess ? 'border-green-500 bg-green-50' : isFailed ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'}`}>
      <div className="flex justify-between items-center">
        <span className="font-riforma font-bold">{title}</span>
        <span className="font-mono text-sm">{status}</span>
      </div>
    </div>
  );
}

