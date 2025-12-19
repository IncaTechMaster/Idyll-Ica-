
import { NoteName, ChordType } from './types';

// Standard chromatic scale using sharps as primary internal reference
export const NOTES: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Circle of Fifths labels using standard musical conventions (sharps on right, flats on left)
export const CIRCLE_OF_FIFTHS_MAJOR: NoteName[] = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

// Relative minor mapping using labels from the circle
export const RELATIVE_MINOR: Record<string, string> = {
  'C': 'A', 'G': 'E', 'D': 'B', 'A': 'F#', 'E': 'C#', 'B': 'G#',
  'F#': 'D#', 'Db': 'Bb', 'Ab': 'F', 'Eb': 'C', 'Bb': 'G', 'F': 'D'
};

/**
 * Key signatures: Sharp keys (up to 7), Flat keys (up to 7)
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
  'F': { type: 'flat', count: 1 },
  'Bb': { type: 'flat', count: 2 },
  'Eb': { type: 'flat', count: 3 },
  'Ab': { type: 'flat', count: 4 },
  'Db': { type: 'flat', count: 5 },
  'Gb': { type: 'flat', count: 6 },
  'Cb': { type: 'flat', count: 7 },
  // Minor keys (mapped by their root if clicked in inner circle)
  'Am': { type: 'none', count: 0 },
  'Em': { type: 'sharp', count: 1 },
  'Bm': { type: 'sharp', count: 2 },
  'F#m': { type: 'sharp', count: 3 },
  'C#m': { type: 'sharp', count: 4 },
  'G#m': { type: 'sharp', count: 5 },
  'D#m': { type: 'sharp', count: 6 },
  'A#m': { type: 'sharp', count: 7 },
  'Dm': { type: 'flat', count: 1 },
  'Gm': { type: 'flat', count: 2 },
  'Cm': { type: 'flat', count: 3 },
  'Fm': { type: 'flat', count: 4 },
  'Bbm': { type: 'flat', count: 5 },
  'Ebm': { type: 'flat', count: 6 },
  'Abm': { type: 'flat', count: 7 },
};

// Treble Clef positions
export const SHARP_Y_POSITIONS = [10, 40, 0, 30, 60, 20, 50]; // F, C, G, D, A, E, B
export const FLAT_Y_POSITIONS = [50, 20, 60, 30, 70, 40, 80];  // B, E, A, D, G, C, F

export const CHORD_INTERVALS: Record<ChordType, number[]> = {
  [ChordType.MAJOR]: [0, 4, 7],
  [ChordType.MINOR]: [0, 3, 7],
  [ChordType.DIMINISHED]: [0, 3, 6],
  [ChordType.AUGMENTED]: [0, 4, 8],
  [ChordType.DOMINANT_7]: [0, 4, 7, 10],
  [ChordType.MAJOR_7]: [0, 4, 7, 11],
  [ChordType.MINOR_7]: [0, 3, 7, 10],
};

export const NOTE_TO_MIDI: Record<string, number> = {
  'C': 60, 'C#': 61, 'Db': 61, 'D': 62, 'D#': 63, 'Eb': 63, 'E': 64, 'F': 65,
  'F#': 66, 'Gb': 66, 'G': 67, 'G#': 68, 'Ab': 68, 'A': 69, 'A#': 70, 'Bb': 70, 'B': 71
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
