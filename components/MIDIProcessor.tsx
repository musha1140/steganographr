import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { midiMap } from '../utils/midi-mapping';

interface MIDIProcessorProps {
  onInstructionsCompiled: (instructions: string) => void;
}

export default function MIDIProcessor({ onInstructionsCompiled }: MIDIProcessorProps) {
  const [midiInput, setMidiInput] = useState<string>('');
  const [compiledInstructions, setCompiledInstructions] = useState<string>('');

  useEffect(() => {
    const instructions = midiInput.split(',')
      .map(note => {
        const instruction = midiMap[note.trim()] || { type: "reserved", value: "nop" };
        return instruction.value;
      })
      .join('');
    setCompiledInstructions(instructions);
    onInstructionsCompiled(instructions);
  }, [midiInput, onInstructionsCompiled]);

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter MIDI note numbers, separated by commas (e.g., 60,62,64)"
        value={midiInput}
        onChange={(e) => setMidiInput(e.target.value)}
        className="bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500"
      />
      <div className="text-white">
        <h3 className="font-bold">Compiled Instructions:</h3>
        <pre className="bg-neutral-900 p-2 rounded overflow-x-auto">
          {compiledInstructions}
        </pre>
      </div>
    </div>
  );
}

