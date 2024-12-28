"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

// Unicode characters for encoding
const WORD_JOINER = '\u2060';
const ZERO_WIDTH_SPACE = '\u200B';
const ZERO_WIDTH_NON_JOINER = '\u200C';
const ZERO_WIDTH_NON_BREAKING_SPACE = '\uFEFF';

// Convert a string to binary
const str2bin = (text: string): string => {
  return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
};

// Convert binary to string
const bin2str = (bin: string): string => {
  return bin.split(' ').map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
};

// Convert binary to hidden characters
const bin2hidden = (str: string): string => {
  return str
    .replace(/ /g, WORD_JOINER)
    .replace(/0/g, ZERO_WIDTH_SPACE)
    .replace(/1/g, ZERO_WIDTH_NON_JOINER);
};

// Convert hidden characters to binary
const hidden2bin = (str: string): string => {
  return str
    .replace(new RegExp(WORD_JOINER, 'g'), ' ')
    .replace(new RegExp(ZERO_WIDTH_SPACE, 'g'), '0')
    .replace(new RegExp(ZERO_WIDTH_NON_JOINER, 'g'), '1');
};

// Wrap a string with a distinct boundary
const wrap = (str: string): string => {
  return ZERO_WIDTH_NON_BREAKING_SPACE + str + ZERO_WIDTH_NON_BREAKING_SPACE;
};

// Unwrap a string if the distinct boundary exists
const unwrap = (str: string): string | false => {
  const parts = str.split(ZERO_WIDTH_NON_BREAKING_SPACE);
  return parts.length === 3 ? parts[1] : false;
};

export default function Steganographr() {
  const [publicMessage, setPublicMessage] = useState('');
  const [privateMessage, setPrivateMessage] = useState('');
  const [encodedMessage, setEncodedMessage] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');

  const handleEncode = () => {
    if (!publicMessage || !privateMessage) {
      toast({
        title: "Error",
        description: "Please enter both public and private messages",
        variant: "destructive",
      });
      return;
    }

    const publicChars = [...publicMessage];
    const half = Math.round(publicChars.length / 2);
    
    const encodedPrivate = wrap(bin2hidden(str2bin(privateMessage)));
    
    publicChars.splice(half, 0, encodedPrivate);
    const result = publicChars.join('');
    
    setEncodedMessage(result);
    toast({
      title: "Success",
      description: "Message encoded successfully",
    });
  };

  const handleDecode = () => {
    if (!encodedMessage) {
      toast({
        title: "Error",
        description: "Please enter a message to decode",
        variant: "destructive",
      });
      return;
    }

    const unwrapped = unwrap(encodedMessage);
    const hiddenBin = hidden2bin(unwrapped ? unwrapped : encodedMessage);
    const decoded = bin2str(hiddenBin);

    if (decoded.length < 2) {
      toast({
        title: "Error",
        description: "No hidden message found",
        variant: "destructive",
      });
    } else {
      setDecodedMessage(decoded);
      toast({
        title: "Success",
        description: "Message decoded successfully",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Steganographr</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="public-message">Public Message</Label>
          <Textarea
            id="public-message"
            value={publicMessage}
            onChange={(e) => setPublicMessage(e.target.value)}
            placeholder="Enter the public message"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="private-message">Private Message</Label>
          <Textarea
            id="private-message"
            value={privateMessage}
            onChange={(e) => setPrivateMessage(e.target.value)}
            placeholder="Enter the private message to hide"
          />
        </div>
        <Button onClick={handleEncode}>Encode</Button>
        {encodedMessage && (
          <div className="space-y-2">
            <Label htmlFor="encoded-message">Encoded Message</Label>
            <Textarea
              id="encoded-message"
              value={encodedMessage}
              onChange={(e) => setEncodedMessage(e.target.value)}
              placeholder="Encoded message will appear here"
            />
          </div>
        )}
        <Button onClick={handleDecode}>Decode</Button>
        {decodedMessage && (
          <div className="space-y-2">
            <Label htmlFor="decoded-message">Decoded Private Message</Label>
            <Textarea
              id="decoded-message"
              value={decodedMessage}
              readOnly
              placeholder="Decoded message will appear here"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

