import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button"
import { midiMap } from '../utils/midi-mapping';

interface AudioProcessorProps {
  instructions: string;
  onDecoded: (decodedInstructions: string) => void;
}

export default function AudioProcessor({ instructions, onDecoded }: AudioProcessorProps) {
  const audioContext = useRef<AudioContext | null>(null);
  const [isEncoding, setIsEncoding] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [midiInput, setMidiInput] = useState('');

  const convertMIDIToInstructions = (midiInput: string): string => {
    return midiInput.split(',')
      .map(note => {
        const instruction = midiMap[note.trim()] || { type: "reserved", value: "nop" };
        return instruction.value;
      })
      .join('');
  };

  const handleMIDIConvert = () => {
    const convertedInstructions = convertMIDIToInstructions(midiInput);
    onDecoded(convertedInstructions);
  };

  const encodeInstructions = async () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    setIsEncoding(true);

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    oscillator.start();

    for (const char of instructions) {
      const frequency = char.charCodeAt(0) * 10; // Simple encoding scheme
      oscillator.frequency.setValueAtTime(frequency, audioContext.current.currentTime);
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms per character
    }

    oscillator.stop();
    setIsEncoding(false);
  };

  const decodeAudio = async () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    setIsDecoding(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContext.current.createMediaStreamSource(stream);
      const analyser = audioContext.current.createAnalyser();
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let decodedInstructions = '';
      const decodeInterval = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const maxIndex = dataArray.indexOf(Math.max(...dataArray));
        const decodedChar = String.fromCharCode(Math.round(maxIndex / 10));
        decodedInstructions += decodedChar;
      }, 100);

      setTimeout(() => {
        clearInterval(decodeInterval);
        setIsDecoding(false);
        onDecoded(decodedInstructions);
        stream.getTracks().forEach(track => track.stop());
      }, instructions.length * 100 + 1000); // Add 1 second buffer
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsDecoding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={midiInput}
          onChange={(e) => setMidiInput(e.target.value)}
          placeholder="Enter MIDI notes (comma-separated)"
          className="flex-grow p-2 bg-neutral-900 border border-neutral-700 rounded text-white"
        />
        <Button
          onClick={handleMIDIConvert}
          className="bg-neutral-700 hover:bg-neutral-600 text-white"
        >
          Convert MIDI
        </Button>
      </div>
      <Button
        onClick={encodeInstructions}
        disabled={isEncoding || isDecoding}
        className="w-full bg-neutral-700 hover:bg-neutral-600 text-white"
      >
        {isEncoding ? 'Encoding...' : 'Encode to Audio'}
      </Button>
      <Button
        onClick={decodeAudio}
        disabled={isEncoding || isDecoding}
        className="w-full bg-neutral-700 hover:bg-neutral-600 text-white"
      >
        {isDecoding ? 'Decoding...' : 'Decode from Audio'}
      </Button>
    </div>
  );
}

