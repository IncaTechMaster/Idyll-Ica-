
import React, { useState, useEffect, useCallback } from 'react';
import { NoteName, ChordType, ChordDefinition, AIAdvice } from './types';
import { getChordNotes } from './utils/musicLogic';
import { audioService } from './services/audioService';
import { getMusicalAdvice } from './services/geminiService';
import { NOTE_TO_MIDI, CHORD_INTERVALS } from './constants';
import Piano from './components/Piano';
import Staff from './components/Staff';
import CircleOfFifths from './components/CircleOfFifths';

const App: React.FC = () => {
  const [root, setRoot] = useState<NoteName>('C');
  const [type, setType] = useState<ChordType>(ChordType.MAJOR);
  const [chord, setChord] = useState<ChordDefinition>(getChordNotes('C', ChordType.MAJOR));
  const [advice, setAdvice] = useState<AIAdvice | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [playingNotes, setPlayingNotes] = useState<number[]>([]);

  useEffect(() => {
    const newChord = getChordNotes(root, type);
    setChord(newChord);
    fetchAdvice(root, type);
  }, [root, type]);

  const fetchAdvice = useCallback(async (r: NoteName, t: ChordType) => {
    setLoadingAdvice(true);
    const data = await getMusicalAdvice(r, t);
    setAdvice(data);
    setLoadingAdvice(false);
  }, []);

  const handlePlayChord = () => {
    audioService.playChord(chord.midiNotes);
    visualFeedback(chord.midiNotes);
  };

  const handlePlayArpeggio = () => {
    audioService.playArpeggio(chord.midiNotes);
    visualFeedback(chord.midiNotes, 2000);
  };

  const visualFeedback = (midis: number[], duration = 500) => {
    setPlayingNotes(midis);
    setTimeout(() => setPlayingNotes([]), duration);
  };

  const handlePianoKeyClick = (noteName: NoteName, isChordMember: boolean) => {
    const midi = NOTE_TO_MIDI[noteName];
    if (isChordMember) {
      audioService.playArpeggio(chord.midiNotes, 0.15);
      visualFeedback(chord.midiNotes, 1000);
    } else {
      audioService.playNote(midi);
      setRoot(noteName);
      visualFeedback([midi], 200);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
             <i className="fas fa-music text-indigo-400 text-2xl"></i>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Harmonia
            </h1>
            <p className="text-slate-400 font-medium tracking-tight">Círculo de Quintas & Teoría Musical</p>
          </div>
        </div>
        <div className="hidden md:block text-right">
           <p className="text-xs text-slate-500 italic">Visualiza bemoles y sostenidos correctamente en el pentagrama.</p>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col items-center justify-center gap-4 min-h-[420px] shadow-xl">
              <h2 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2 opacity-60">Notación & Pentagrama</h2>
              <Staff midiNotes={chord.midiNotes} noteNames={chord.notes} rootNote={root} chordType={type} />
              
              <div className="mt-4 text-center flex flex-col gap-3 w-full px-4">
                <div className="flex items-center justify-center gap-4">
                   <span className="text-5xl font-mono font-black text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                    {chord.americanNotation}
                  </span>
                  <div className="flex flex-col items-start bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-700 shadow-lg">
                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Intervalos</span>
                    <span className="text-xs text-indigo-400 font-mono font-bold">{CHORD_INTERVALS[type].join(' - ')}</span>
                  </div>
                </div>
                
                {/* Specific Note Breakdown (e.g. G - Bb - D) */}
                <div className="bg-slate-900/40 py-3 rounded-xl border border-slate-700/50 shadow-inner group transition-all hover:bg-slate-900/60">
                   <span className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] block mb-2 opacity-70 group-hover:opacity-100 transition-opacity">Composición Americana</span>
                   <div className="flex justify-center items-center gap-3">
                     {chord.notes.map((n, i) => (
                       <React.Fragment key={i}>
                         <span className="text-2xl font-mono font-black text-sky-300 drop-shadow-sm">
                           {n}
                         </span>
                         {i < chord.notes.length - 1 && <span className="text-slate-600 font-bold opacity-30">|</span>}
                       </React.Fragment>
                     ))}
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col items-center justify-center min-h-[340px] shadow-xl">
              <CircleOfFifths 
                selectedRoot={root} 
                selectedType={type}
                onSelectRoot={setRoot}
                onSelectType={setType}
              />
            </div>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-2xl">
             <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
               <div>
                 <h2 className="text-slate-400 text-xs font-black uppercase tracking-widest opacity-60">Teclado de Aprendizaje</h2>
                 <p className="text-[10px] text-slate-500 mt-1">Notas identificadas a la derecha de cada cabeza de nota en el pentagrama</p>
               </div>
               <div className="flex flex-wrap justify-center gap-2 bg-slate-900/50 p-2 rounded-xl border border-slate-700/50">
                 {Object.values(ChordType).map(t => (
                   <button
                     key={t}
                     onClick={() => setType(t)}
                     className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border uppercase tracking-tighter ${
                       type === t 
                       ? 'bg-sky-500 border-sky-300 text-white shadow-lg' 
                       : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600'
                     }`}
                   >
                     {t}
                   </button>
                 ))}
               </div>
             </div>

             <Piano chord={chord} activeMidi={playingNotes} onKeyClick={handlePianoKeyClick} />

             <div className="mt-8 flex justify-center gap-4">
                <button 
                  onClick={handlePlayArpeggio}
                  className="px-8 py-3 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 text-sky-300 shadow-xl group"
                >
                  <i className="fas fa-list-ol group-hover:rotate-12 transition-transform"></i> Arpegio
                </button>
                <button 
                  onClick={handlePlayChord}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-indigo-500/20 group"
                >
                  <i className="fas fa-play group-hover:scale-110 transition-transform"></i> Escuchar Acorde
                </button>
             </div>
          </div>
        </div>

        <aside className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-indigo-900/60 via-slate-900 to-slate-900 p-6 rounded-2xl border border-indigo-500/30 flex flex-col gap-4 sticky top-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/40 transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                <i className={`fas fa-brain text-white text-xl ${loadingAdvice ? 'animate-pulse' : ''}`}></i>
              </div>
              <div>
                <h2 className="font-black text-lg tracking-tight">Maestro AI</h2>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Análisis Armónico</span>
              </div>
            </div>
            
            {loadingAdvice ? (
              <div className="flex flex-col gap-4 py-12 items-center text-slate-500">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse"></div>
                  <i className="fas fa-compact-disc fa-spin text-4xl text-indigo-400"></i>
                </div>
                <p className="text-sm font-bold tracking-tight text-indigo-300 animate-pulse uppercase">Sintonizando frecuencias...</p>
              </div>
            ) : advice ? (
              <div className="space-y-6 animate-fade-in">
                <div className="group">
                  <h3 className="text-sky-300 text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-60 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-sky-300"></span> Función Musical
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 shadow-inner group-hover:border-indigo-500/30 transition-colors">
                    {advice.description}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-5 rounded-2xl border border-indigo-400/20 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                     <i className="fas fa-palette text-4xl"></i>
                  </div>
                  <h3 className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Tema Propuesto</h3>
                  <p className="text-2xl font-serif font-bold text-white italic drop-shadow-md">"{advice.theme}"</p>
                </div>

                <div>
                  <h3 className="text-sky-300 text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-60 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-sky-300"></span> Progresión de Práctica
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {advice.progression.map((chordName, i) => (
                      <button 
                        key={i} 
                        className="flex items-center justify-center p-3 rounded-xl bg-slate-900/60 border border-slate-700 hover:border-sky-500/50 hover:bg-slate-800 transition-all group active:scale-95 shadow-sm"
                      >
                        <span className="text-sky-400 font-mono font-black text-base group-hover:scale-110 transition-transform">
                          {chordName}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={() => fetchAdvice(root, type)}
                  className="w-full mt-2 text-[10px] text-indigo-400 hover:text-indigo-100 transition-all py-4 border border-indigo-500/30 rounded-2xl hover:bg-indigo-600 font-black uppercase tracking-[0.3em] shadow-lg hover:shadow-indigo-500/20"
                >
                  <i className="fas fa-random mr-2"></i> Nueva Sesión
                </button>
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-slate-500 text-sm italic font-medium">Explora el círculo para despertar al maestro...</p>
              </div>
            )}
          </div>
        </aside>
      </main>

      <footer className="mt-auto pt-8 pb-4 text-center text-slate-500 text-[10px] border-t border-slate-800/50">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-4">
          <span className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
            <i className="fas fa-music text-sky-500"></i> Círculo de Quintas
          </span>
          <span className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
            <i className="fas fa-feather text-indigo-500"></i> Armonía Correcta
          </span>
          <span className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
            <i className="fas fa-check text-purple-500"></i> Notación Dual (Staff + Texto)
          </span>
        </div>
        <p className="font-bold opacity-30">Harmonia • Music Learning Engine v2.7 • Gemini 3 Flash</p>
      </footer>
    </div>
  );
};

export default App;
