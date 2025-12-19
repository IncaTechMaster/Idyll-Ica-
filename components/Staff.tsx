
import React from 'react';
import { getStaffYPosition } from '../utils/musicLogic';
import { KEY_SIGNATURES, SHARP_Y_POSITIONS, FLAT_Y_POSITIONS } from '../constants';
import { NoteName } from '../types';

interface StaffProps {
  midiNotes: number[];
  noteNames: NoteName[];
  rootNote: string;
  chordType: string;
}

const Staff: React.FC<StaffProps> = ({ midiNotes, noteNames, rootNote, chordType }) => {
  const lines = [20, 40, 60, 80, 100];
  
  // Minor keys use the same key signature as their relative major
  const keyLookup = chordType === 'Menor' ? `${rootNote}m` : rootNote;
  const keySig = KEY_SIGNATURES[keyLookup] || KEY_SIGNATURES[rootNote] || { type: 'none', count: 0 };
  
  return (
    <div className="bg-white/95 p-6 rounded-2xl shadow-2xl border border-slate-200">
      <svg viewBox="0 0 240 140" className="w-full h-auto max-w-[340px] mx-auto overflow-visible">
        {/* Clef */}
        <text x="5" y="88" fontSize="65" className="fill-slate-900 pointer-events-none opacity-90">𝄞</text>
        
        {/* Staff Lines */}
        {lines.map((y, i) => (
          <line key={i} x1="0" y1={y} x2="240" y2={y} className="staff-line stroke-slate-300" strokeWidth="1.5" />
        ))}

        {/* Key Signature Accidentals */}
        {keySig.type !== 'none' && Array.from({ length: keySig.count }).map((_, i) => {
          const y = keySig.type === 'sharp' ? SHARP_Y_POSITIONS[i] : FLAT_Y_POSITIONS[i];
          const x = 38 + i * 11;
          return (
            <text 
              key={`${keySig.type}-${i}`} 
              x={x} 
              y={y + 8} 
              fontSize="24" 
              className="fill-slate-800 font-serif font-bold pointer-events-none"
              textAnchor="middle"
            >
              {keySig.type === 'sharp' ? '♯' : '♭'}
            </text>
          );
        })}

        {/* Notes */}
        {midiNotes.map((midi, i) => {
          const y = getStaffYPosition(midi);
          const isLedger = midi <= 60; // Ledger line for Middle C and below
          const xOffset = 60 + (keySig.count * 11) + 25;
          const noteName = noteNames[i] || '';
          
          return (
            <g key={i}>
              {isLedger && (
                <line 
                  x1={xOffset + i*2 - 10} 
                  y1={120} 
                  x2={xOffset + i*2 + 25} 
                  y2={120} 
                  className="staff-line stroke-slate-400" 
                  strokeWidth="1.5"
                />
              )}
              
              {/* Note Head */}
              <ellipse
                cx={xOffset + 7 + i * 2}
                cy={y}
                rx="8"
                ry="6"
                transform={`rotate(-25 ${xOffset + 7 + i * 2} ${y})`}
                className="note-head fill-sky-500 shadow-sm transition-all duration-300"
              />

              {/* Note Name Label to the RIGHT of the note head, aligned with line/space */}
              <text 
                x={xOffset + 22 + i * 2} 
                y={y + 4} 
                fontSize="12" 
                fontWeight="900" 
                className="fill-indigo-700 font-mono drop-shadow-sm select-none" 
                textAnchor="start"
              >
                {noteName}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default Staff;
