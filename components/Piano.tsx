
import React from 'react';
import { NoteName, ChordDefinition } from '../types';
import { NOTES, CHORD_INTERVALS } from '../constants';
import { isBlackKey } from '../utils/musicLogic';

interface PianoProps {
  chord: ChordDefinition;
  activeMidi?: number[]; // Currently sounding notes
  onKeyClick: (note: NoteName, isChordMember: boolean) => void;
}

const Piano: React.FC<PianoProps> = ({ chord, activeMidi = [], onKeyClick }) => {
  const pianoNotes = [...NOTES, ...NOTES]; 
  const midiOffset = 60;
  const highlightedMidi = chord.midiNotes;

  const getIntervalLabel = (midi: number) => {
    const index = highlightedMidi.indexOf(midi);
    if (index === -1) return null;
    const intervals = CHORD_INTERVALS[chord.type];
    return intervals[index] !== undefined ? `+${intervals[index]}` : null;
  };

  return (
    <div className="flex relative h-56 w-full max-w-4xl mx-auto select-none bg-slate-900 p-2 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
      {pianoNotes.map((note, index) => {
        const midi = midiOffset + index;
        const isHighlighted = highlightedMidi.includes(midi);
        const isActive = activeMidi.includes(midi);
        const black = isBlackKey(note);

        if (black) return null;

        const intervalLabel = getIntervalLabel(midi);

        return (
          <div
            key={`white-${index}`}
            onClick={() => onKeyClick(note as NoteName, isHighlighted)}
            className={`
              relative flex-1 border-x border-slate-200 rounded-b-lg cursor-pointer transition-all duration-75 flex flex-col items-center justify-end pb-8
              ${isActive ? 'bg-sky-300 scale-y-[0.98]' : isHighlighted ? 'bg-sky-50' : 'bg-white hover:bg-slate-100'}
            `}
            style={{ minWidth: '28px' }}
          >
            {/* Black keys overlay */}
            {isBlackKey(pianoNotes[index + 1] || '') && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onKeyClick(pianoNotes[index + 1] as NoteName, highlightedMidi.includes(midi + 1));
                }}
                className={`
                  absolute top-0 right-0 w-[60%] h-[65%] z-20 rounded-b-md cursor-pointer border border-slate-950 transition-all duration-75 flex flex-col items-center justify-end pb-4
                  ${activeMidi.includes(midi + 1) ? 'bg-sky-600' : highlightedMidi.includes(midi + 1) ? 'bg-indigo-900 border-indigo-400' : 'bg-slate-900 hover:bg-slate-800'}
                `}
                style={{ transform: 'translateX(50%)' }}
              >
                {highlightedMidi.includes(midi + 1) && (
                  <span className="text-[8px] font-black text-sky-400/80 mb-1">{getIntervalLabel(midi + 1)}</span>
                )}
              </div>
            )}
            
            {isHighlighted && (
              <span className={`text-[9px] font-black mb-1 ${isActive ? 'text-white' : 'text-sky-600'}`}>
                {intervalLabel}
              </span>
            )}

            <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-tighter ${isActive ? 'text-white' : 'text-slate-400'}`}>
              {note}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Piano;
