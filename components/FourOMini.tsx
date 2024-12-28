"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const ZWC = ['\u200C', '\u200D', '\u200E', '\u200F'];

const encode = (visible: string, hidden: string): string => {
  const binary = hidden.split('').map(char => 
    char.charCodeAt(0).toString(2).padStart(8, '0')
  ).join('');
  
  let encoded = '';
  let binaryIndex = 0;
  
  for (let char of visible) {
    encoded += char;
    if (binaryIndex < binary.length) {
      encoded += ZWC[parseInt(binary.substr(binaryIndex, 2), 2)];
      binaryIndex += 2;
    }
  }
  
  while (binaryIndex < binary.length) {
    encoded += ZWC[parseInt(binary.substr(binaryIndex, 2), 2)];
    binaryIndex += 2;
  }
  
  return encoded;
};

const decode = (encoded: string): { visible: string, hidden: string } => {
  let visible = '';
  let binary = '';
  
  for (let char of encoded) {
    if (!ZWC.includes(char)) {
      visible += char;
    } else {
      binary += ZWC.indexOf(char).toString(2).padStart(2, '0');
    }
  }
  
  const hidden = binary.match(/.{8}/g)?.map(byte => 
    String.fromCharCode(parseInt(byte, 2))
  ).join('') || '';
  
  return { visible, hidden };
};

export default function FourOMini() {
  const [visible, setVisible] = useState('');
  const [hidden, setHidden] = useState('');
  const [encoded, setEncoded] = useState('');
  const [decoded, setDecoded] = useState({ visible: '', hidden: '' });

  const handleEncode = () => {
    setEncoded(encode(visible, hidden));
  };

  const handleDecode = () => {
    setDecoded(decode(encoded));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>4o-mini</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="visible">Visible Text</Label>
          <Input
            id="visible"
            value={visible}
            onChange={(e) => setVisible(e.target.value)}
            placeholder="Enter visible text"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hidden">Hidden Text</Label>
          <Input
            id="hidden"
            value={hidden}
            onChange={(e) => setHidden(e.target.value)}
            placeholder="Enter hidden text"
          />
        </div>
        <Button onClick={handleEncode} className="w-full">Encode</Button>
        <div className="space-y-2">
          <Label htmlFor="encoded">Encoded Text</Label>
          <Input
            id="encoded"
            value={encoded}
            onChange={(e) => setEncoded(e.target.value)}
            placeholder="Encoded text appears here"
          />
        </div>
        <Button onClick={handleDecode} className="w-full">Decode</Button>
        {decoded.hidden && (
          <div className="space-y-2">
            <Label htmlFor="decoded">Decoded Hidden Text</Label>
            <Input
              id="decoded"
              value={decoded.hidden}
              readOnly
              placeholder="Decoded hidden text appears here"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

