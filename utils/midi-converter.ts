import { Midi } from '@tonejs/midi';
import { getMIDIInstruction } from './midi-mapping';

export interface MIDINote {
  time: number;
  midi: number;
  duration: number;
  velocity: number;
}

export async function convertMIDIToInstructions(file: File): Promise<string> {
  // Read the MIDI file
  const arrayBuffer = await file.arrayBuffer();
  const midi = new Midi(arrayBuffer);
  
  // Extract all notes from all tracks
  const allNotes: MIDINote[] = [];
  midi.tracks.forEach(track => {
    track.notes.forEach(note => {
      allNotes.push({
        time: note.time,
        midi: note.midi,
        duration: note.duration,
        velocity: note.velocity
      });
    });
  });
  
  // Sort notes by time
  allNotes.sort((a, b) => a.time - b.time);
  
  // Convert notes to instructions
  let instructions = '';
  allNotes.forEach(note => {
    const instruction = getMIDIInstruction(note.midi);
    if (instruction.type === 'brainfuck') {
      instructions += instruction.value;
    }
  });
  
  return instructions;
}

export function formatMIDIData(midi: Midi): string {
  return JSON.stringify({
    tracks: midi.tracks.map(track => ({
      name: track.name,
      notes: track.notes.map(note => ({
        time: note.time,
        midi: note.midi,
        duration: note.duration,
        velocity: note.velocity
      }))
    })),
    duration: midi.duration
  }, null, 2);
}

