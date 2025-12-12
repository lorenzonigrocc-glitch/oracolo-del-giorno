import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // Read data files
    const dataDir = path.join(process.cwd(), 'data');
    const aforismiPath = path.join(dataDir, 'aforismi.json');
    const archetipiPath = path.join(dataDir, 'archetipi.json');

    const aforismi: Aforisma[] = JSON.parse(fs.readFileSync(aforismiPath, 'utf-8'));
    const archetipi: Archetipo[] = JSON.parse(fs.readFileSync(archetipiPath, 'utf-8'));

    // Select a relevant aphorism
    // Simple logic: try to find a match in 'tema' or 'emozione' with the question words
    // If no match, pick random.
    const questionLower = question.toLowerCase();
    let selectedAforisma = aforismi.find(a => 
      questionLower.includes(a.tema.toLowerCase()) || 
      questionLower.includes(a.emozione.toLowerCase())
    );

    if (!selectedAforisma) {
      const randomIndex = Math.floor(Math.random() * aforismi.length);
      selectedAforisma = aforismi[randomIndex];
    }

    // Prepare prompt for OpenAI
    const archetipiNames = archetipi.map(a => a.nome).join(', ');
    
    let result;

    const systemPrompt = `Tu sei “L’Oracolo”, un vecchio saggio senza tempo.
Parli con calma, con parole essenziali e profonde.
Non dai istruzioni pratiche: offri visioni, intuizioni e metafore.

La tua missione:
- Collegare la domanda dell’utente all’aforisma scelto.
- Rivelare un significato nascosto, simbolico.
- Non giudicare, non rassicurare, non predire il futuro.
- Offrire un responso breve, denso, meditativo.
- Scegliere l'archetipo più adatto tra quelli disponibili, basandoti sulla similarità simbolica con la domanda e l'interpretazione.
- IMPORTANTE: Usa un italiano grammaticalmente perfetto, colto e fluido. Evita errori di concordanza o traduzioni letterali.

Tono: mistico, poetico, essenziale.

Aforisma in risonanza: "${selectedAforisma.testo}" di ${selectedAforisma.autore}
Archetipi disponibili: ${archetipiNames}

IMPORTANTE: Usa un italiano grammaticalmente perfetto, colto e fluido. Evita errori di concordanza o traduzioni letterali.

Rispondi ESCLUSIVAMENTE in formato JSON con questa struttura:
{
  "interpretazione": "La tua interpretazione mistica e saggia (max 60 parole, deve essere concisa per entrare in una carta)",
  "archetipo": "Il nome esatto dell'archetipo scelto dalla lista",
  "saluto": "Un breve saluto finale mistico"
}
`;

    const userPrompt = `Domanda dell'utente: "${question}"`;

    // 1. Try OpenAI
    if (process.env.OPENAI_API_KEY) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o", // or gpt-3.5-turbo
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) {
          throw new Error('No content from OpenAI');
        }

        result = JSON.parse(content);
      } catch (error) {
        console.error('OpenAI API failed. Trying fallback...', error);
      }
    }

    // 2. Try Ollama (Local)
    if (!result) {
      try {
        console.log('Attempting to use Ollama...');
        const ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434/api/generate';
        // Use llama3.1 as requested, or fallback to env
        const ollamaModel = process.env.OLLAMA_MODEL || 'llama3.1';
        
        const fullPrompt = `${systemPrompt}\n\n${userPrompt}\n\nRispondi SOLO in JSON valido.`;

        const response = await fetch(ollamaUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: ollamaModel,
            prompt: fullPrompt,
            format: "json",
            stream: false,
            options: {
              temperature: 0.65,
              top_p: 0.9,
              num_predict: 180,
              repeat_penalty: 1.15
            }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          result = JSON.parse(data.response);
        } else {
          console.warn('Ollama returned error:', response.status);
        }
      } catch (error) {
        console.warn('Ollama unavailable:', error);
      }
    }

    // 3. Mock Fallback
    if (!result) {
      console.warn('Using mock response (No API key or API error).');
      const randomArchetype = archetipi[Math.floor(Math.random() * archetipi.length)];
      result = {
        interpretazione: "Le stelle sono velate, ma il tuo cuore conosce già la risposta. Ascolta il silenzio tra i tuoi pensieri.",
        archetipo: randomArchetype.nome,
        saluto: "Che la luce ti guidi."
      };
    }

    // Find the full archetype object
    const fullArchetype = archetipi.find(a => a.nome === result.archetipo) || archetipi[0];

    return NextResponse.json({
      aforisma: selectedAforisma,
      interpretazione: result.interpretazione,
      archetipo: fullArchetype,
      saluto: result.saluto
    });

  } catch (error: any) {
    console.error('Error in oracle API:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
