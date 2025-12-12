# Oracolo del Giorno - Concept e Funzionamento

## 🔮 Concept
"Oracolo del Giorno" è un'applicazione web meditativa progettata per offrire una singola, profonda riflessione quotidiana. Lontana dal caos delle notifiche e dell'informazione costante, l'app invita l'utente a fermarsi, porre una domanda significativa e ricevere una guida simbolica.

L'atmosfera è minimale, silenziosa e mistica. Non è un semplice chatbot, ma un rituale digitale che unisce la saggezza antica (aforismi) con l'intelligenza moderna (AI generativa) per creare un'esperienza di introspezione.

## ⚙️ Funzionamento

### 1. L'Ingresso (La Domanda)
All'apertura, l'utente viene accolto da una schermata essenziale con una sola domanda: **"Cosa vuoi?"**.
Non ci sono distrazioni, menu o altri elementi. Solo lo spazio per formulare il proprio dubbio o desiderio.

### 2. Il Rituale (Elaborazione)
Una volta inviata la domanda, il sistema compie tre passi invisibili:
1.  **Risonanza**: Analizza il testo della domanda e cerca nel database locale (`aforismi.json`) un aforisma che risuoni per tema o emozione con le parole dell'utente.
2.  **Consultazione**: Invia la domanda e l'aforisma selezionato all'Intelligenza Artificiale (OpenAI), che assume la "persona" di un vecchio saggio.
3.  **Rivelazione**: L'AI genera un'interpretazione unica che collega la domanda all'aforisma e seleziona l'Archetipo più adatto tra quelli disponibili (`archetipi.json`).

### 3. Il Responso (L'Esito)
Il risultato viene mostrato in tre parti distinte, come carte che vengono girate:
*   **L'Aforisma**: La saggezza "oggettiva" e atemporale.
*   **L'Interpretazione**: La risposta diretta e mistica alla domanda specifica.
*   **L'Archetipo**: Un simbolo universale (es. "La Soglia", "Il Ponte") che rappresenta l'energia del momento per l'utente.

### 4. Il Silenzio (Limite Giornaliero)
Per preservare il valore dell'esperienza, l'Oracolo risponde **una sola volta al giorno**.
Dopo la prima consultazione, un "sigillo" (salvato nel browser dell'utente) impedisce nuove domande fino alla mezzanotte successiva, mostrando il messaggio: *"Il silenzio è d'oro"*.

## 🛠 Tecnologia
*   **Frontend**: Next.js (React) per un'interfaccia fluida e reattiva.
*   **Stile**: TailwindCSS per un design pulito, tipografico e armonioso.
*   **Intelligenza**: OpenAI API (GPT-4o/GPT-3.5) per la generazione dei testi mistici.
*   **Dati**: Database JSON locali per aforismi e archetipi, garantendo una base di conoscenza curata e controllata.
