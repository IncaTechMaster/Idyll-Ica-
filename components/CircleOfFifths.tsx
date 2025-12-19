
import React from 'react';
import { CIRCLE_OF_FIFTHS_MAJOR, RELATIVE_MINOR } from '../constants';
import { NoteName, ChordType } from '../types';

interface CircleOfFifthsProps {
  selectedRoot: NoteName;
  selectedType: ChordType;
  onSelectRoot: (note: NoteName) => void;
  onSelectType: (type: ChordType) => void;
}

const CircleOfFifths: React.FC<CircleOfFifthsProps> = ({ selectedRoot, selectedType, onSelectRoot, onSelectType }) => {
  const size = 320;
  const center = size / 2;
  const outerRadius = center - 40;
  const innerRadius = center - 85;

  const chordTypes = [
    { type: ChordType.MAJOR, label: 'Maj' },
    { type: ChordType.MINOR, label: 'min' },
    { type: ChordType.DIMINISHED, label: 'dim' },
    { type: ChordType.AUGMENTED, label: 'aug' }
  ];

  return (
    <div className="relative flex flex-col items-center select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-15">
          {/* Outer ring bg */}
          <circle cx={center} cy={center} r={outerRadius + 25} className="fill-slate-800/80 stroke-slate-700" strokeWidth="1" />
          {/* Inner ring bg */}
          <circle cx={center} cy={center} r={innerRadius + 20} className="fill-slate-900 stroke-slate-700" strokeWidth="1" />
          
          {CIRCLE_OF_FIFTHS_MAJOR.map((note, i) => {
            const angle = (i * 360) / 12 - 90;
            const xOuter = center + outerRadius * Math.cos((angle * Math.PI) / 180);
            const yOuter = center + outerRadius * Math.sin((angle * Math.PI) / 180);
            
            const minorNote = RELATIVE_MINOR[note];
            const xInner = center + innerRadius * Math.cos((angle * Math.PI) / 180);
            const yInner = center + innerRadius * Math.sin((angle * Math.PI) / 180);

            const isMajorSelected = selectedRoot === note;
            const isMinorSelected = selectedRoot === minorNote;

            return (
              <g key={note}>
                {/* Major Ring */}
                <g className="cursor-pointer group" onClick={() => onSelectRoot(note as NoteName)}>
                  <circle 
                    cx={xOuter} cy={yOuter} r="18" 
                    className={`transition-all duration-300 ${isMajorSelected ? 'fill-sky-500 shadow-lg' : 'fill-slate-700 group-hover:fill-slate-600'}`} 
                  />
                  <text 
                    x={xOuter} y={yOuter} dy="0.35em" textAnchor="middle" 
                    className={`font-bold text-[10px] pointer-events-none ${isMajorSelected ? 'fill-white' : 'fill-slate-300'}`}
                  >
                    {note}
                  </text>
                </g>

                {/* Minor Ring */}
                <g className="cursor-pointer group" onClick={() => onSelectRoot(minorNote as NoteName)}>
                  <circle 
                    cx={xInner} cy={yInner} r="14" 
                    className={`transition-all duration-300 ${isMinorSelected ? 'fill-indigo-500 shadow-md' : 'fill-slate-800 group-hover:fill-slate-700'}`} 
                  />
                  <text 
                    x={xInner} y={yInner} dy="0.35em" textAnchor="middle" 
                    className={`font-bold text-[8px] pointer-events-none ${isMinorSelected ? 'fill-white' : 'fill-slate-400'}`}
                  >
                    {minorNote}m
                  </text>
                </g>
              </g>
            );
          })}

          {/* Center Selector (Dial) */}
          <circle cx={center} cy={center} r="45" className="fill-slate-950 stroke-indigo-500/30" strokeWidth="2" />
        </svg>

        {/* Overlay for Chord Qualities in center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-wrap w-24 justify-center gap-1 z-10">
          {chordTypes.map((ct) => (
            <button
              key={ct.type}
              onClick={() => onSelectType(ct.type)}
              className={`w-10 h-10 rounded-full text-[10px] font-bold border transition-all ${
                selectedType === ct.type 
                ? 'bg-indigo-500 border-white text-white scale-110 shadow-lg' 
                : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'
              }`}
            >
              {ct.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 text-[10px] text-slate-500 uppercase tracking-tighter">Gira tu mente: Mayor exterior / Menor interior</p>
    </div>
  );
};

export default CircleOfFifths;
