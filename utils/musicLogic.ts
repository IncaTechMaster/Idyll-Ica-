
import { NoteName, ChordType, ChordDefinition } from '../types';
import { NOTES, CHORD_INTERVALS, NOTE_TO_MIDI, MIDI_TO_NOTE_NAME, CHORD_TYPE_SYMBOLS, KEY_SIGNATURES } from '../constants';

export const getChordNotes = (root: NoteName, type: ChordType): ChordDefinition => {
  const rootMidi = NOTE_TO_MIDI[root];
  const intervals = CHORD_INTERVALS[type];
  
  const midiNotes = intervals.map(interval => rootMidi + interval);
  
  // Decide naming based on key signature of root
  const keySig = KEY_SIGNATURES[root] || { type: 'none' };
  const useFlats = keySig.type === 'flat';

  const notes = midiNotes.map(midi => {
    const standardName = MIDI_TO_NOTE_NAME[midi] as NoteName;
    if (useFlats && standardName.includes('#')) {
      // Very simplified enharmonic swap
      const mapping: Record<string, string> = {
        'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb'
      };
      return (mapping[standardName] || standardName) as NoteName;
    }
    return standardName;
  });

  const americanNotation = `${root}${CHORD_TYPE_SYMBOLS[type]}`;

  return {
    root,
    type,
    notes,
    midiNotes,
    americanNotation
  };
};

export const getStaffYPosition = (midiNote: number): number => {
  const whiteKeyMapping: Record<number, number> = {
    60: 120, // C4
    61: 120, // C#4
    62: 110, // D4
    63: 110, // D#4
    64: 100, // E4
    65: 90,  // F4
    66: 90,  // F#4
    67: 80,  // G4
    68: 80,  // G#4
    69: 70,  // A4
    70: 70,  // A#4
    71: 60,  // B4
    72: 50,  // C5
    73: 50,  // C#5
    74: 40,  // D5
    75: 40,  // D#5
    76: 30,  // E5
    77: 20,  // F5
    78: 20,  // F#5
    79: 10,  // G5
    80: 10,  // G#5
    81: 0,   // A5
  };
  return whiteKeyMapping[midiNote] ?? 60;
};

export const isBlackKey = (note: string): boolean => note.includes('#') || note.includes('b');
