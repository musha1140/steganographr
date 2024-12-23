"use client"

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { parseMIDIFile, convertMIDIToSteganography, type ParsedMIDI } from '../utils/midi-parser';
import { toast } from "@/components/ui/use-toast"

interface MIDIParserProps {
  onParsed?: (encoded: string) => void;
}

export default function MIDIParser({ onParsed }: MIDIParserProps) {
  const [parsedData, setParsedData] = useState<ParsedMIDI | null>(null);
  const [encodedText, setEncodedText] = useState<string>('');

  const onDrop = async (acceptedFiles: File[]) => {
    try {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const parsed = await parseMIDIFile(file);
        setParsedData(parsed);
        
        const encoded = convertMIDIToSteganography(parsed);
        setEncodedText(encoded);
        
        if (onParsed) {
          onParsed(encoded);
        }

        toast({
          title: "Success",
          description: "MIDI file parsed successfully",
          className: "bg-neutral-800 border-neutral-700 text-white",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to parse MIDI file",
        className: "bg-red-900 border-red-800 text-white",
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/midi': ['.mid', '.midi']
    },
    multiple: false
  });

  return (
    <Card className="bg-neutral-800 border-neutral-700">
      <CardHeader>
        <CardTitle className="text-white">MIDI to Steganography</CardTitle>
        <CardDescription className="text-neutral-400">
          Convert MIDI files into steganographic instructions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-neutral-600 bg-neutral-700' : 'border-neutral-700'}
          `}
        >
          <input {...getInputProps()} />
          <p className="text-sm text-white">
            {isDragActive ? 'Drop the MIDI file here' : 'Drag and drop a MIDI file here, or click to select'}
          </p>
        </div>

        {parsedData && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white mb-2 block">Parsed MIDI Data</label>
              <Textarea
                value={JSON.stringify(parsedData, null, 2)}
                readOnly
                className="bg-neutral-900 border-neutral-700 text-white font-mono h-32"
              />
            </div>

            <div>
              <label className="text-sm text-white mb-2 block">Encoded Instructions</label>
              <Textarea
                value={encodedText}
                readOnly
                className="bg-neutral-900 border-neutral-700 text-white font-mono"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

