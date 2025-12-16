// app/page.js
"use client";

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [dataUrl, setDataUrl] = useState('');
  const [normalSvg, setNormalSvg] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Konvertiert Data URL in normales SVG
  const convertToNormalSvg = (input) => {
    try {
      // Prüfen, ob die Eingabe das richtige Format hat
      if (!input.startsWith('data:image/svg+xml,')) {
        throw new Error('Ungültiges SVG Data URL Format');
      }

      // Extrahieren des URL-encodierten SVG-Teils
      const encodedSvg = input.substring('data:image/svg+xml,'.length);

      // Dekodieren des URL-encodierten Strings
      const decodedSvg = decodeURIComponent(encodedSvg);

      setNormalSvg(decodedSvg);
      setError('');
    } catch (err) {
      setError('Fehler bei der Konvertierung: ' + err.message);
      setNormalSvg('');
    }
  };

  // Timeout-Ref für debounce
  const timeoutRef = useRef(null);

  // Handlefunktion für Texteingabe mit Debounce
  const handleInputChange = (e) => {
    setDataUrl(e.target.value);
    setCopied(false); // Zurücksetzen des Kopierstatus bei neuer Eingabe

    // Vorherigen Timeout löschen, wenn vorhanden
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Neue Konvertierung mit Verzögerung starten
    timeoutRef.current = setTimeout(() => {
      convertToNormalSvg(e.target.value);
    }, 150);
  };

  // SVG kopieren
  const handleCopy = () => {
    if (normalSvg) {
      navigator.clipboard.writeText(normalSvg)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          })
          .catch(err => {
            setError('Fehler beim Kopieren: ' + err.message);
          });
    }
  };

  // SVG herunterladen
  const handleDownload = () => {
    if (normalSvg) {
      const blob = new Blob([normalSvg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted-svg.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Beispiel automatisch in das Eingabefeld einfügen und konvertieren
  useEffect(() => {
    const exampleDataUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23aaaab6' viewBox='0 0 384 512'%3E%3Cpath d='M215.7 499.2C267 435 384 279.4 384 192 384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2 12.3 15.3 35.1 15.3 47.4 0M192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128'/%3E%3C/svg%3E";
    setDataUrl(exampleDataUrl);

    // Initial konvertieren nach dem Laden
    setTimeout(() => {
      convertToNormalSvg(exampleDataUrl);
    }, 300);
  }, []);

  return (
      <div className="min-h-screen bg-base-100">
        <main className="container mx-auto p-4">
          <h1 className="text-3xl font-bold text-center my-6">SVG Data URL Konverter</h1>

          <div className="card bg-base-300 shadow-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Data URL eingeben</h2>
            <textarea
                className="textarea textarea-bordered border-accent bg-base-100 w-full h-32 mb-4 font-mono text-sm"
                value={dataUrl}
                onChange={handleInputChange}
                placeholder="Gib deine SVG Data URL hier ein..."
            />
            <p className="text-sm text-base-content/70 text-center">
              Die Konvertierung erfolgt automatisch nach Eingabe
            </p>
          </div>

          {error && (
              <div className="alert alert-error mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
              </div>
          )}

          {normalSvg && (
              <>
                <div className="card bg-base-200 shadow-xl p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">SVG Vorschau</h2>
                  <div className="flex justify-center bg-white p-8 rounded-lg border border-base-300">
                    <div className="w-32 h-32 svg-preview-wrapper" dangerouslySetInnerHTML={{ __html: normalSvg }} />
                  </div>
                </div>

                <div className="card bg-base-200 shadow-xl p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Konvertiertes SVG</h2>
                  <div className="relative">
                <pre className="bg-base-300 p-4 rounded-lg overflow-auto max-h-64 font-mono text-sm whitespace-pre-wrap">
                  {normalSvg}
                </pre>
                    <button
                        className={`btn btn-sm btn-circle absolute top-2 right-2 ${copied ? 'btn-success' : 'btn-ghost'}`}
                        onClick={handleCopy}
                        title="In die Zwischenablage kopieren"
                    >
                      {copied ? '✓' :
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                      }
                    </button>
                  </div>
                  <div className={"flex justify-center"}>
                    <button
                        className="btn btn-primary max-w-42 mt-4"
                        onClick={handleDownload}
                    >
                      SVG herunterladen
                    </button>
                  </div>
                </div>
              </>
          )}
        </main>

        <footer className="footer p-4 text-center text-base-content">
          <div className="w-full">
            <p>Erstellt mit Next.js App Router, Tailwind CSS und DaisyUI</p>
          </div>
        </footer>
      </div>
  );
}