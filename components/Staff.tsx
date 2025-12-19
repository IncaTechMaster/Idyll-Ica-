
import React from 'react';
import { getStaffYPosition } from '../utils/musicLogic';
import { KEY_SIGNATURES, SHARP_Y_POSITIONS, FLAT_Y_POSITIONS } from '../constants';

interface StaffProps {
  midiNotes: number[];
  rootNote: string;
}

const Staff: React.FC<StaffProps> = ({ midiNotes, rootNote }) => {
  const lines = [20, 40, 60, 80, 100];
  const keySig = KEY_SIGNATURES[rootNote] || { type: 'none', count: 0 };
  
  return (
    <div className="bg-white/90 p-6 rounded-xl shadow-inner border border-slate-200">
      <svg viewBox="0 0 240 140" className="w-full h-auto max-w-[340px] mx-auto overflow-visible">
        {/* Clef placeholder */}
        <text x="5" y="85" fontSize="60" className="fill-slate-800 pointer-events-none">𝄞</text>
        
        {/* Lines */}
        {lines.map((y, i) => (
          <line key={i} x1="0" y1={y} x2="240" y2={y} className="staff-line" />
        ))}

        {/* Key Signature Accidentals */}
        {keySig.type !== 'none' && Array.from({ length: keySig.count }).map((_, i) => {
          const y = keySig.type === 'sharp' ? SHARP_Y_POSITIONS[i] : FLAT_Y_POSITIONS[i];
          const x = 35 + i * 10;
          return (
            <text 
              key={`${keySig.type}-${i}`} 
              x={x} 
              y={y + 5} 
              fontSize="20" 
              className="fill-slate-700 font-bold pointer-events-none"
              textAnchor="middle"
            >
              {keySig.type === 'sharp' ? '♯' : '♭'}
            </text>
          );
        })}

        {/* Notes (Shifted right to avoid key signature) */}
        {midiNotes.map((midi, i) => {
          const y = getStaffYPosition(midi);
          const isLedger = midi === 60; // Middle C ledger line
          const xBase = 50 + (keySig.count * 10) + 20;
          
          return (
            <g key={i}>
              {isLedger && (
                <line x1={xBase + i*2} y1={120} x2={xBase + i*2 + 30} y2={120} className="staff-line" />
              )}
              <ellipse
                cx={xBase + 15 + i * 2} // Stack notes horizontally slightly
                cy={y}
                rx="7"
                ry="5"
                transform={`rotate(-20 ${xBase + 15 + i * 2} ${y})`}
                className="note-head"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default Staff;
