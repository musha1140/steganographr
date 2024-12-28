"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { encode, decode } from '@/utils/steganography'

export default function SteganographyInterface() {
  const [visibleText, setVisibleText] = useState('')
  const [hiddenText, setHiddenText] = useState('')
  const [encodedText, setEncodedText] = useState('')
  const [textToDecode, setTextToDecode] = useState('')
  const [decodedVisible, setDecodedVisible] = useState('')
  const [decodedHidden, setDecodedHidden] = useState('')

  const handleEncode = () => {
    if (!visibleText || !hiddenText) {
      toast({
        title: "Error",
        description: "Please enter both visible and hidden text",
        variant: "destructive",
      });
      return;
    }

    const encoded = encode(visibleText, hiddenText);
    setEncodedText(encoded);
    toast({
      title: "Success",
      description: "Message encoded successfully",
    });
  };

  const handleDecode = () => {
    if (!textToDecode) {
      toast({
        title: "Error",
        description: "Please enter text to decode",
        variant: "destructive",
      });
      return;
    }

    try {
      const { visibleText, hiddenMessage } = decode(textToDecode);
      setDecodedVisible(visibleText);
      setDecodedHidden(hiddenMessage);
      toast({
        title: "Success",
        description: "Message decoded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decode message",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-white">Steganography</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="visible-text" className="text-white">Visible Text</Label>
          <Textarea
            id="visible-text"
            placeholder="Enter the text that will be visible to everyone"
            value={visibleText}
            onChange={(e) => setVisibleText(e.target.value)}
            className="min-h-[100px] bg-neutral-800 border-neutral-700 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hidden-text" className="text-white">Hidden Text</Label>
          <Textarea
            id="hidden-text"
            placeholder="Enter the secret message to hide"
            value={hiddenText}
            onChange={(e) => setHiddenText(e.target.value)}
            className="min-h-[100px] bg-neutral-800 border-neutral-700 text-white"
          />
        </div>
        <Button 
          className="w-full bg-white text-black hover:bg-gray-200"
          onClick={handleEncode}
        >
          Encode
        </Button>
        {encodedText && (
          <div className="space-y-2">
            <Label className="text-white">Encoded Text (copy this)</Label>
            <Textarea
              value={encodedText}
              readOnly
              className="min-h-[100px] bg-neutral-800 border-neutral-700 text-white"
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="decode-text" className="text-white">Text to Decode</Label>
          <Textarea
            id="decode-text"
            placeholder="Enter the text to decode"
            value={textToDecode}
            onChange={(e) => setTextToDecode(e.target.value)}
            className="min-h-[100px] bg-neutral-800 border-neutral-700 text-white"
          />
        </div>
        <Button 
          className="w-full bg-white text-black hover:bg-gray-200"
          onClick={handleDecode}
        >
          Decode
        </Button>
        {decodedVisible && (
          <div className="space-y-2">
            <Label className="text-white">Decoded Visible Text</Label>
            <Textarea
              value={decodedVisible}
              readOnly
              className="min-h-[100px] bg-neutral-800 border-neutral-700 text-white"
            />
          </div>
        )}
        {decodedHidden && (
          <div className="space-y-2">
            <Label className="text-white">Decoded Hidden Text</Label>
            <Textarea
              value={decodedHidden}
              readOnly
              className="min-h-[100px] bg-neutral-800 border-neutral-700 text-white"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

