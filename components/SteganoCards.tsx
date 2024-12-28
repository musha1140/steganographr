"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Copy } from 'lucide-react'
import { encode, decode } from '@/utils/steganography'

export default function SteganoCards() {
  const [publicMessage, setPublicMessage] = useState('')
  const [privateMessage, setPrivateMessage] = useState('')
  const [encodedOutput, setEncodedOutput] = useState('')
  const [messageToDecode, setMessageToDecode] = useState('')
  const [decodedPublic, setDecodedPublic] = useState('')
  const [decodedPrivate, setDecodedPrivate] = useState('')

  const handleEncode = () => {
    if (!publicMessage || !privateMessage) {
      toast({
        title: "Error",
        description: "Please fill in both messages",
        variant: "destructive",
      })
      return
    }

    const encoded = encode(publicMessage, privateMessage)
    setEncodedOutput(encoded)
    toast({
      title: "Success!",
      description: "Message encoded successfully. Copy the output below.",
    })
  }

  const handleDecode = () => {
    if (!messageToDecode) {
      toast({
        title: "Error",
        description: "Please paste a message to decode",
        variant: "destructive",
      })
      return
    }

    try {
      const { visibleText, hiddenText } = decode(messageToDecode)
      setDecodedPublic(visibleText)
      setDecodedPrivate(hiddenText)
      toast({
        title: "Success!",
        description: "Message decoded successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid message format",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(encodedOutput)
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy message",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Encoding Card */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle>Encoding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="public-message">Public Message</Label>
            <Textarea
              id="public-message"
              placeholder="Enter the message that will be visible to everyone"
              value={publicMessage}
              onChange={(e) => setPublicMessage(e.target.value)}
              className="min-h-[100px] bg-neutral-800 border-neutral-700"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="private-message">Private Message</Label>
            <Textarea
              id="private-message"
              placeholder="Enter the secret message to hide"
              value={privateMessage}
              onChange={(e) => setPrivateMessage(e.target.value)}
              className="min-h-[100px] bg-neutral-800 border-neutral-700"
            />
          </div>
          <Button 
            className="w-full bg-white text-black hover:bg-gray-200"
            onClick={handleEncode}
          >
            Encode
          </Button>
          {encodedOutput && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Encoded Output</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <Textarea
                value={encodedOutput}
                readOnly
                className="min-h-[100px] bg-neutral-800 border-neutral-700"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Decoding Card */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle>Decoding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message-to-decode">Paste Message to Decode</Label>
            <Textarea
              id="message-to-decode"
              placeholder="Paste the encoded message here"
              value={messageToDecode}
              onChange={(e) => setMessageToDecode(e.target.value)}
              className="min-h-[100px] bg-neutral-800 border-neutral-700"
            />
          </div>
          <Button 
            className="w-full bg-white text-black hover:bg-gray-200"
            onClick={handleDecode}
          >
            Decode
          </Button>
          {(decodedPublic || decodedPrivate) && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Public Message</Label>
                <Textarea
                  value={decodedPublic}
                  readOnly
                  className="min-h-[100px] bg-neutral-800 border-neutral-700"
                />
              </div>
              <div className="space-y-2">
                <Label>Private Message</Label>
                <Textarea
                  value={decodedPrivate}
                  readOnly
                  className="min-h-[100px] bg-neutral-800 border-neutral-700"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

