
export type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export enum ChordType {
  MAJOR = 'Mayor',
  MINOR = 'Menor',
  DIMINISHED = 'Disminuido',
  AUGMENTED = 'Aumentado',
  DOMINANT_7 = '7ma Dominante',
  MAJOR_7 = '7ma Mayor',
  MINOR_7 = '7ma Menor'
}

export interface ChordDefinition {
  root: NoteName;
  type: ChordType;
  notes: NoteName[];
  midiNotes: number[];
  americanNotation: string;
}

export interface AIAdvice {
  theme: string;
  progression: string[];
  description: string;
}
