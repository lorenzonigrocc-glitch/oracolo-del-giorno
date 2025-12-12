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
    <main className='flex min-h-screen flex-col items-center justify-center p-6 text-center'>
      {!result && !hasAskedToday && (
        <div className='animate-fade-in max-w-md w-full space-y-8'>
          <h1 className='text-4xl md:text-5xl font-serif italic text-gray-800 mb-12'>
            Cosa vuoi?
          </h1>
          <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <input
              type='text'
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className='w-full bg-transparent border-b-2 border-gray-300 py-2 text-xl text-center focus:outline-none focus:border-gray-600 transition-colors placeholder:text-gray-300'
              placeholder='Scrivi la tua domanda...'
              required
              disabled={loading}
            />
            <button
              type='submit'
              disabled={loading || !question.trim()}
              className='mt-4 px-8 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-serif tracking-wider'
            >
              {loading ? 'Consultando lo spazio tra bit ed atomo...' : 'Chiedi all\'Oracolo'}
            </button>
          </form>
        </div>
      )}

      {hasAskedToday && !result && !loading && (
        <div className='animate-fade-in max-w-md text-center space-y-6'>
          <h2 className='text-3xl font-serif text-gray-800'>Il silenzio è d'oro.</h2>
          <p className='text-lg text-gray-600'>
            Hai già posto la tua domanda oggi. Torna domani per una nuova rivelazione.
          </p>
        </div>
      )}

      {result && (
        <div className='animate-fade-in max-w-2xl w-full space-y-12 py-12'>
          
          {/* Aforisma */}
          <section className='space-y-4'>
            <h3 className='text-sm uppercase tracking-widest text-gray-400'>L'Aforisma</h3>
            <blockquote className='text-2xl md:text-3xl font-serif italic text-gray-800 leading-relaxed'>
              &quot;{result.aforisma.testo}&quot;
            </blockquote>
            <p className='text-right text-gray-600'> {result.aforisma.autore}</p>
          </section>

          <div className='w-16 h-px bg-gray-300 mx-auto'></div>

          {/* Interpretazione */}
          <section className='space-y-4'>
            <h3 className='text-sm uppercase tracking-widest text-gray-400'>L'Oracolo Risponde</h3>
            <p className='text-lg md:text-xl text-gray-700 leading-loose'>
              {result.interpretazione}
            </p>
          </section>

          <div className='w-16 h-px bg-gray-300 mx-auto'></div>

          {/* Archetipo */}
          <section className='space-y-4 bg-white/50 p-8 rounded-lg border border-gray-100 shadow-sm'>
            <h3 className='text-sm uppercase tracking-widest text-gray-400'>Il Tuo Archetipo</h3>
            <h4 className='text-2xl font-serif text-gray-900'>{result.archetipo.nome}</h4>
            <p className='text-gray-600 italic'>{result.archetipo.descrizione}</p>
            <div className='flex justify-center gap-4 mt-4 text-sm text-gray-500'>
              <span>Tema: {result.archetipo.tema}</span>
              <span>•</span>
              <span>Energia: {result.archetipo.energia}</span>
            </div>
          </section>

          <footer className='pt-8 text-gray-500 italic'>
            {result.saluto}
          </footer>
        </div>
      )}
    </main>
  );
}
