"use client"

import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { midiMap } from '../utils/midi-mapping';

interface AudioPipelineProps {
  onFileProcessed: (file: File) => void;
}

export default function AudioPipeline({ onFileProcessed }: AudioPipelineProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const processFile = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);

    try {
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const fileReader = new FileReader();

      fileReader.onloadend = async () => {
        const fileContent = fileReader.result as string;
        const encodedAudioBuffer = await encodeDataToAudio(fileContent);
        const wavBuffer = audioBufferToWav(encodedAudioBuffer);
        const processedFile = new File([wavBuffer], "encoded_" + selectedFile.name, { type: "audio/wav" });
        onFileProcessed(processedFile);

        toast({
          title: "Success",
          description: "File processed and encoded into audio",
          className: "bg-neutral-800 border-neutral-700 text-white",
        });
      };

      fileReader.readAsText(selectedFile);
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process and encode file",
        className: "bg-red-900 border-red-800 text-white",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const encodeDataToAudio = async (data: string): Promise<AudioBuffer> => {
    // Step 1: Base64 Encode
    const base64Data = btoa(data);

    // Step 2: XOR (optional, using a simple key for demonstration)
    const xorKey = 'secretkey';
    const xoredData = xorString(base64Data, xorKey);

    // Step 3 & 4: Mapping to Instructions and Instruction Compilation
    const instructions = xoredData.split('').map(char => {
      const asciiValue = char.charCodeAt(0);
      return midiMap[asciiValue.toString()]?.value || '';
    }).join('');

    // Step 5: Web Audio Generation
    const ctx = audioContext.current!;
    const duration = 0.1; // Duration of each tone in seconds
    const audioBuffer = ctx.createBuffer(1, ctx.sampleRate * duration * instructions.length, ctx.sampleRate);
    const channelData = audioBuffer.getChannelData(0);

    instructions.split('').forEach((char, index) => {
      const frequency = getFrequencyForInstruction(char);
      for (let i = 0; i < ctx.sampleRate * duration; i++) {
        channelData[index * ctx.sampleRate * duration + i] = Math.sin(2 * Math.PI * frequency * i / ctx.sampleRate);
      }
    });

    return audioBuffer;
  };

  const decodeAudio = async (audioBuffer: AudioBuffer): Promise<string> => {
    const ctx = audioContext.current!;
    const channelData = audioBuffer.getChannelData(0);
    const fftSize = 2048;
    const analyzer = ctx.createAnalyser();
    analyzer.fftSize = fftSize;

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(analyzer);

    const frequencyData = new Float32Array(analyzer.frequencyBinCount);
    const instructions: string[] = [];

    // Analyze the frequency data to extract instructions
    for (let i = 0; i < channelData.length; i += ctx.sampleRate * 0.1) {
      analyzer.getFloatFrequencyData(frequencyData);
      const dominantFrequency = getDominantFrequency(frequencyData, ctx.sampleRate);
      const instruction = getInstructionForFrequency(dominantFrequency);
      instructions.push(instruction);
    }

    // Reverse mapping, XOR, and Base64 decoding
    const xoredData = instructions.map(instruction => {
      const entry = Object.entries(midiMap).find(([_, value]) => value.value === instruction);
      return entry ? String.fromCharCode(parseInt(entry[0])) : '';
    }).join('');

    const xorKey = 'secretkey';
    const base64Data = xorString(xoredData, xorKey);
    return atob(base64Data);
  };

  // Helper functions
  const xorString = (str: string, key: string): string => {
    return str.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    ).join('');
  };

  const getFrequencyForInstruction = (instruction: string): number => {
    // Map instructions to frequencies (this is a simple mapping, you might want to use a more sophisticated approach)
    const baseFrequency = 440; // A4 note
    return baseFrequency * Math.pow(2, midiMap[instruction]?.value?.length || 0);
  };

  const getDominantFrequency = (frequencyData: Float32Array, sampleRate: number): number => {
    const maxIndex = frequencyData.indexOf(Math.max(...frequencyData));
    return maxIndex * sampleRate / (2 * frequencyData.length);
  };

  const getInstructionForFrequency = (frequency: number): string => {
    // Reverse mapping of frequency to instruction (you'll need to implement this based on your encoding scheme)
    const baseFrequency = 440;
    const index = Math.round(Math.log2(frequency / baseFrequency));
    return Object.values(midiMap).find(value => value.value.length === index)?.value || '';
  };

  // Helper function to convert AudioBuffer to WAV format
  function audioBufferToWav(buffer: AudioBuffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const out = new ArrayBuffer(length);
    const view = new DataView(out);
    const channels = [];
    let sample;
    let offset = 0;
    let pos = 0;

    // write WAVE header
    setUint32(0x46464952);
    setUint32(length - 8);
    setUint32(0x45564157);
    setUint32(0x20746d66);
    setUint32(16);
    setUint16(1);
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);
    setUint32(0x61746164);
    setUint32(length - pos - 4);

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
      for (let i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return out;

    function setUint16(data: number) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data: number) {
      view.setUint32(pos, data, true);
      pos += 4;
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        onChange={handleFileSelect}
        accept="text/*"
        className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neutral-700 file:text-white hover:file:bg-neutral-600"
      />
      {selectedFile && (
        <Button
          onClick={processFile}
          disabled={isProcessing}
          className="w-full bg-neutral-700 hover:bg-neutral-600 text-white"
        >
          {isProcessing ? 'Processing...' : 'Process and Encode File'}
        </Button>
      )}
    </div>
  );
}

