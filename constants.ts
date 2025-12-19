
import { NoteName, ChordType } from './types';

export const NOTES: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const CIRCLE_OF_FIFTHS_MAJOR = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];

// Relative minor mapping (Major -> Minor)
export const RELATIVE_MINOR: Record<string, string> = {
  'C': 'A', 'G': 'E', 'D': 'B', 'A': 'F#', 'E': 'C#', 'B': 'G#',
  'F#': 'D#', 'C#': 'A#', 'G#': 'F', 'D#': 'C', 'A#': 'G', 'F': 'D'
};

/**
 * Maps root notes to their key signature (sharps or flats).
 * We use enharmonic equivalents to keep key signatures standard (1-7 accidentals).
 */
export const KEY_SIGNATURES: Record<string, { type: 'sharp' | 'flat' | 'none', count: number }> = {
  'C': { type: 'none', count: 0 },
  'G': { type: 'sharp', count: 1 },
  'D': { type: 'sharp', count: 2 },
  'A': { type: 'sharp', count: 3 },
  'E': { type: 'sharp', count: 4 },
  'B': { type: 'sharp', count: 5 },
  'F#': { type: 'sharp', count: 6 },
  'C#': { type: 'sharp', count: 7 },
  'G#': { type: 'flat', count: 4 }, // Ab Major
  'D#': { type: 'flat', count: 3 }, // Eb Major
  'A#': { type: 'flat', count: 2 }, // Bb Major
  'F': { type: 'flat', count: 1 },
};

// Y-positions for Treble Clef key signature accidentals
export const SHARP_Y_POSITIONS = [20, 50, 10, 40, 70, 30, 60]; // F, C, G, D, A, E, B
export const FLAT_Y_POSITIONS = [60, 30, 70, 40, 10, 50, 20];  // B, E, A, D, G, C, F

export const CHORD_INTERVALS: Record<ChordType, number[]> = {
  [ChordType.MAJOR]: [0, 4, 7],
  [ChordType.MINOR]: [0, 3, 7],
  [ChordType.DIMINISHED]: [0, 3, 6],
  [ChordType.AUGMENTED]: [0, 4, 8],
  [ChordType.DOMINANT_7]: [0, 4, 7, 10],
  [ChordType.MAJOR_7]: [0, 4, 7, 11],
  [ChordType.MINOR_7]: [0, 3, 7, 10],
};

export const NOTE_TO_MIDI: Record<NoteName, number> = {
  'C': 60, 'C#': 61, 'D': 62, 'D#': 63, 'E': 64, 'F': 65,
  'F#': 66, 'G': 67, 'G#': 68, 'A': 69, 'A#': 70, 'B': 71
};

export const MIDI_TO_NOTE_NAME: Record<number, string> = {
  60: 'C', 61: 'C#', 62: 'D', 63: 'D#', 64: 'E', 65: 'F',
  66: 'F#', 67: 'G', 68: 'G#', 69: 'A', 70: 'A#', 71: 'B',
  72: 'C', 73: 'C#', 74: 'D', 75: 'D#', 76: 'E', 77: 'F',
  78: 'F#', 79: 'G', 80: 'G#', 81: 'A', 82: 'A#', 83: 'B'
};

export const CHORD_TYPE_SYMBOLS: Record<ChordType, string> = {
  [ChordType.MAJOR]: '',
  [ChordType.MINOR]: 'm',
  [ChordType.DIMINISHED]: 'dim',
  [ChordType.AUGMENTED]: 'aug',
  [ChordType.DOMINANT_7]: '7',
  [ChordType.MAJOR_7]: 'maj7',
  [ChordType.MINOR_7]: 'm7',
};
