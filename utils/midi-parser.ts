import { Midi } from '@tonejs/midi';
import { getMIDIInstruction, type MIDIInstruction } from './midi-mapping';

export interface ParsedMIDINote {
  time: number;
  instruction: MIDIInstruction;
  duration: number;
  velocity: number;
}

export interface ParsedMIDITrack {
  name: string;
  notes: ParsedMIDINote[];
}

export interface ParsedMIDI {
  tracks: ParsedMIDITrack[];
  duration: number;
  encoded?: string;
}

export async function parseMIDIFile(file: File): Promise<ParsedMIDI> {
  const arrayBuffer = await file.arrayBuffer();
  const midi = new Midi(arrayBuffer);
  
  const tracks = midi.tracks.map(track => ({
    name: track.name,
    notes: track.notes.map(note => ({
      time: note.time,
      instruction: getMIDIInstruction(note.midi),
      duration: note.duration,
      velocity: note.velocity
    }))
  }));

  // Sort all notes by time across all tracks
  const allNotes = tracks
    .flatMap(track => track.notes)
    .sort((a, b) => a.time - b.time);

  // Convert instructions to steganography encoding
  const encodedInstructions = allNotes
    .filter(note => note.instruction.type === 'brainfuck')
    .map(note => note.instruction.value)
    .join('');

  return {
    tracks,
    duration: midi.duration,
    encoded: encodedInstructions
  };
}

export function convertMIDIToSteganography(parsed: ParsedMIDI): string {
  if (!parsed.encoded) return '';
  
  // Group instructions into meaningful chunks
  const chunks: string[] = [];
  let currentChunk = '';
  
  for (const char of parsed.encoded) {
    currentChunk += char;
    
    // Break into chunks based on common Brainfuck patterns
    if (
      currentChunk.endsWith('[-]') || 
      currentChunk.endsWith('[->+<]') ||
      currentChunk.endsWith('>.') ||
      currentChunk.length >= 8
    ) {
      chunks.push(currentChunk);
      currentChunk = '';
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks.join(' ');
}

