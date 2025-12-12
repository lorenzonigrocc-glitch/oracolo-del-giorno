'use client';

import { useState, useEffect } from 'react';

type Aforisma = {
  tema: string;
  emozione: string;
  autore: string;
  testo: string;
};

type Archetipo = {
  nome: string;
  descrizione: string;
  tema: string;
  energia: string;
};

type OracleResponse = {
  aforisma: Aforisma;
  interpretazione: string;
  archetipo: Archetipo;
  saluto: string;
};

function FlipCard({ title, children, delay }: { title: string, children: React.ReactNode, delay: number }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`perspective-1000 w-full h-[500px] animate-fade-in opacity-0 ${!isFlipped ? 'cursor-pointer' : 'cursor-default'}`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => !isFlipped && setIsFlipped(true)}
    >
      <div className={`relative w-full h-full transition-transform duration-1000 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front (Face Down) */}
        <div className="absolute w-full h-full backface-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 shadow-2xl flex flex-col items-center justify-center p-6 group hover:border-white/30 transition-colors">
          <div className="w-20 h-20 mb-6 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:scale-110 transition-transform duration-700">
            <span className="text-3xl opacity-50 group-hover:opacity-100 transition-opacity">✦</span>
          </div>
          <h3 className="font-serif text-2xl text-gray-300 tracking-[0.2em] uppercase mb-2">{title}</h3>
          <p className="text-xs text-gray-500 font-light tracking-widest">TOCCA PER RIVELARE</p>
        </div>

        {/* Back (Face Up - Content) */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl p-8 flex flex-col items-center justify-center text-center">
           {children}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<OracleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasAskedToday, setHasAskedToday] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const lastAsked = localStorage.getItem('oracle_last_asked');
    const today = new Date().toISOString().split('T')[0];
    if (lastAsked === today) {
      setHasAskedToday(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || hasAskedToday) return;

    setLoading(true);
    try {
      const response = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) throw new Error('Errore nella richiesta');

      const data = await response.json();
      setResult(data);
      
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('oracle_last_asked', today);
      setHasAskedToday(true);
    } catch (error) {
      console.error(error);
      alert('Si è verificato un errore. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-6 text-center relative overflow-hidden'>
      {/* Background ambient light */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] animate-breathe"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-breathe" style={{ animationDelay: '3s' }}></div>
      </div>

      {!result && !hasAskedToday && (
        <div className='animate-fade-in max-w-md w-full space-y-10'>
          <h1 className='text-5xl md:text-6xl font-serif italic text-gray-100 mb-12 tracking-tight drop-shadow-lg'>
            Cosa cerchi?
          </h1>
          <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
            <input
              type='text'
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className='w-full bg-transparent border-b border-gray-600 py-3 text-2xl text-center text-gray-100 focus:outline-none focus:border-gray-300 transition-all placeholder:text-gray-600 font-light'
              placeholder='Scrivi la tua domanda...'
              required
              disabled={loading}
            />
            <button
              type='submit'
              disabled={loading || !question.trim()}
              className='mt-6 px-10 py-4 bg-white/10 hover:bg-white/20 text-gray-100 rounded-full backdrop-blur-sm border border-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-serif tracking-widest uppercase text-sm hover:scale-105 duration-500'
            >
              {loading ? 'Consultando lo spazio tra bit ed atomo...' : 'Chiedi all\'Oracolo'}
            </button>
          </form>
        </div>
      )}

      {hasAskedToday && !result && !loading && (
        <div className='animate-fade-in max-w-md text-center space-y-8'>
          <h2 className='text-4xl font-serif text-gray-200'>Il silenzio è d'oro.</h2>
          <p className='text-xl text-gray-400 font-light leading-relaxed'>
            Hai già posto la tua domanda oggi.<br/>Torna domani per una nuova rivelazione.
          </p>
        </div>
      )}

      {result && (
        <div className='w-full max-w-6xl mx-auto py-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-center'>
          
          {/* Card 1: Aforisma */}
          <FlipCard title="L'Aforisma" delay={0}>
            <blockquote className='text-2xl font-serif italic text-gray-100 leading-relaxed mb-6'>
              &quot;{result.aforisma.testo}&quot;
            </blockquote>
            <p className='text-sm text-gray-400 uppercase tracking-widest'>— {result.aforisma.autore}</p>
          </FlipCard>

          {/* Card 2: Interpretazione */}
          <FlipCard title="L'Oracolo" delay={200}>
            <p className='text-lg text-gray-300 leading-loose font-light'>
              {result.interpretazione}
            </p>
          </FlipCard>

          {/* Card 3: Archetipo */}
          <FlipCard title="L'Archetipo" delay={400}>
            <h4 className='text-3xl font-serif text-white mb-4'>{result.archetipo.nome}</h4>
            <p className='text-gray-400 italic text-base mb-6'>{result.archetipo.descrizione}</p>
            <div className='flex flex-col gap-2 text-xs text-gray-500 uppercase tracking-widest'>
              <span>Tema: {result.archetipo.tema}</span>
              <span>Energia: {result.archetipo.energia}</span>
            </div>
          </FlipCard>

          <footer className='col-span-1 md:col-span-3 pt-12 text-gray-500 italic font-serif text-lg animate-fade-in opacity-0' style={{ animationDelay: '1000ms' }}>
            {result.saluto}
          </footer>
        </div>
      )}
    </main>
  );
}
