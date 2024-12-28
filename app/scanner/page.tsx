"use client"

import React, { useState } from 'react';
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

function scanForZeroWidth(text: string): boolean {
  const zeroWidthChars = /[\u200B-\u200D\uFEFF\u2060-\u2064]/;
  return zeroWidthChars.test(text);
}

function scanForMixedEncoding(text: string): boolean {
  const unicodeRanges = [
    /[\u0000-\u007F]/, // Basic Latin
    /[\u0080-\u00FF]/, // Latin-1 Supplement
    /[\u0100-\u017F]/, // Latin Extended-A
    /[\u0180-\u024F]/, // Latin Extended-B
    /[\u0250-\u02AF]/, // IPA Extensions
    /[\u02B0-\u02FF]/, // Spacing Modifier Letters
    /[\u0300-\u036F]/, // Combining Diacritical Marks
    /[\u0370-\u03FF]/, // Greek and Coptic
    /[\u0400-\u04FF]/, // Cyrillic
    /[\u0500-\u052F]/, // Cyrillic Supplement
  ];

  let detectedRanges = 0;
  for (const range of unicodeRanges) {
    if (range.test(text)) {
      detectedRanges++;
    }
    if (detectedRanges > 1) {
      return true;
    }
  }
  return false;
}

export default function ScannerPage() {
  const [inputText, setInputText] = useState('');
  const [scanResults, setScanResults] = useState<string[]>([]);

  const handleScan = () => {
    const results: string[] = [];

    if (scanForZeroWidth(inputText)) {
      results.push("Zero-width characters detected.");
    }

    if (scanForMixedEncoding(inputText)) {
      results.push("Mixed character encodings detected.");
    }

    if (results.length === 0) {
      results.push("No suspicious patterns detected.");
    }

    setScanResults(results);
    toast({
      title: "Scan Complete",
      description: "Check the results below.",
      className: "bg-neutral-800 border-neutral-700 text-white",
    });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-8">Document Scanner</h2>
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-white">Scan for Hidden Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your text here to scan for hidden content..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="h-40 bg-neutral-900 border-neutral-700 text-white"
            />
            <Button onClick={handleScan} className="w-full bg-neutral-700 hover:bg-neutral-600 text-white">
              Scan Document
            </Button>
            {scanResults.length > 0 && (
              <div className="mt-4 p-4 bg-neutral-900 rounded-md">
                <h3 className="text-lg font-semibold text-white mb-2">Scan Results:</h3>
                <ul className="list-disc list-inside text-white">
                  {scanResults.map((result, index) => (
                    <li key={index}>{result}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

