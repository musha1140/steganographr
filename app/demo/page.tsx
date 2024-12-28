"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Play, RefreshCcw, FileText, File, Volume2, VolumeX } from 'lucide-react'
import { Terminal95 } from '@/components/Terminal95'
import Layout from "@/components/Layout";
import { encode, decode } from '@/utils/steganography'

const DEMO_VISIBLE_TEXT = "Hello, World!"
const DEMO_HIDDEN_TEXT = "This is a secret message"
const DEMO_FILE_NAME = "secret.txt"

export default function DemoPage() {
  const [step, setStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isFileMode, setIsFileMode] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [demoState, setDemoState] = useState({
    visibleText: '',
    hiddenText: '',
    encodedText: '',
    decodedVisibleText: '',
    decodedHiddenText: '',
    file: null as File | null,
    decodedFile: null as File | null,
  });

  const steps = [
    {
      title: "Start Demo",
      description: "Welcome to the Steganography demo! We'll show you how to hide messages in both text and files.",
      narration: "Greetings, human. I'm here to demonstrate steganography. Try to keep up.",
      action: () => {
        setDemoState(prev => ({
          ...prev,
          visibleText: DEMO_VISIBLE_TEXT
        }));
      },
      content: (
        <Terminal95 text={`> Initializing steganography demo...\n> Humans, prepare for enlightenment.`} />
      )
    },
    {
      title: "Choose Mode",
      description: "First, let's choose between text mode and file mode.",
      narration: "Choose text or file mode. It's not rocket science, but I wouldn't be surprised if you struggle.",
      action: () => {},
      content: (
        <div className="space-y-4">
          <p className="text-white">Select a mode, if you can manage it:</p>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => setIsFileMode(false)} variant={isFileMode ? "outline" : "default"}>
              Text Mode
            </Button>
            <Button onClick={() => setIsFileMode(true)} variant={isFileMode ? "default" : "outline"}>
              File Mode
            </Button>
          </div>
          <Terminal95 text={`> Mode selected: ${isFileMode ? 'File Mode' : 'Text Mode'}\n> I hope you're satisfied with your choice.`} />
        </div>
      )
    },
    {
      title: "Visible Content",
      description: isFileMode ? "This is the visible file name that everyone can see." : "This is the visible text that everyone can see. It appears normal and unsuspicious.",
      narration: isFileMode 
        ? "Behold, a file name. Try not to be overwhelmed by its complexity." 
        : "Here's some visible text. I assume you can read.",
      content: isFileMode ? (
        <div className="space-y-4">
          <div className="bg-neutral-900 border-neutral-700 text-white font-mono p-4 rounded">
            <File className="inline-block mr-2" />
            {DEMO_FILE_NAME}
          </div>
          <Terminal95 text={`> Visible file name: ${DEMO_FILE_NAME}\n> It's just a name. Don't get too excited.`} />
        </div>
      ) : (
        <div className="space-y-4">
          <Terminal95 text={`> Visible text: "${DEMO_VISIBLE_TEXT}"\n> Fascinating, isn't it? No, not really.`} />
          <p className="text-white">This text is visible to everyone. Try to contain your amazement.</p>
        </div>
      )
    },
    {
      title: "Hidden Content",
      description: isFileMode ? "Now, let's prepare a file with hidden content." : "Now, let's add some hidden text that we want to conceal within the visible message.",
      narration: isFileMode
        ? "We're hiding content in a file. Try to keep up, it's not that complicated."
        : "Now for the hidden text. This is the part that actually matters, unlike your visible message.",
      action: () => {
        if (isFileMode) {
          const file = new File([DEMO_HIDDEN_TEXT], DEMO_FILE_NAME, { type: 'text/plain' });
          setDemoState(prev => ({ ...prev, file }));
        } else {
          setDemoState(prev => ({ ...prev, hiddenText: DEMO_HIDDEN_TEXT }));
        }
      },
      content: isFileMode ? (
        <div className="space-y-4">
          <div className="bg-neutral-900 border-neutral-700 text-white font-mono p-4 rounded">
            <FileText className="inline-block mr-2" />
            {DEMO_FILE_NAME} (contains hidden content)
          </div>
          <Terminal95 text={`> File created: ${DEMO_FILE_NAME}\n> Content: "${DEMO_HIDDEN_TEXT}"\n> I hope it's worth hiding.`} />
        </div>
      ) : (
        <div className="space-y-4">
          <Terminal95 text={`> Hidden message: "${DEMO_HIDDEN_TEXT}"\n> How very secretive of you.`} />
          <p className="text-white">This is the secret message. Try not to tell everyone about it, that would defeat the purpose.</p>
        </div>
      )
    },
    {
      title: "Encoding Progress",
      description: "Watch as we encode your message or file. Try not to fall asleep.",
      narration: "Encoding in progress. Your patience is as unnecessary as it is unappreciated.",
      action: () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            nextStep();
          }
        }, 500);
      },
      content: (
        <div className="space-y-4">
          <Terminal95 text={`> Encoding ${isFileMode ? 'file' : 'message'}...\n> Your anticipation is palpable. How quaint.`} />
          <Progress value={progress} className="w-full" />
          <p className="text-white">Encoding progress: {progress}%. Contain your excitement.</p>
        </div>
      )
    },
    {
      title: "Encoding",
      description: isFileMode ? "We'll now encode the hidden file within the visible file name." : "We'll now encode the hidden text within the visible text using steganography.",
      narration: isFileMode
        ? "Encoding the file. It's not magic, just simple data manipulation. Don't applaud."
        : "Encoding the message. The fact that this impresses you says a lot about your species.",
      action: () => {
        if (isFileMode && demoState.file) {
          // Replace hideFileInText with encode
          const encoded = encode(DEMO_FILE_NAME, DEMO_HIDDEN_TEXT);
          setDemoState(prev => ({ ...prev, encodedText: encoded }));
        } else {
          const encoded = encode(DEMO_VISIBLE_TEXT, DEMO_HIDDEN_TEXT);
          setDemoState(prev => ({ ...prev, encodedText: encoded }));
        }
      },
      content: ({ encodedText }: typeof demoState) => (
        <div className="space-y-4">
          <Terminal95 text={`> Encoding process initiated.\n> Try to contain your excitement.`} />
          <Terminal95 text={`> Combining ${isFileMode ? 'file name and content' : 'visible and hidden text'}...\n> It's not rocket science.`} />
          {encodedText && (
            <div className="space-y-2">
              <p className="text-sm text-white">Encoded Result (try not to be overwhelmed):</p>
              <Textarea
                value={encodedText}
                readOnly
                className="min-h-[100px] bg-neutral-800 border-neutral-700 text-white font-mono"
              />
            </div>
          )}
          <p className="text-white">This encoded text contains the hidden message. I hope you appreciate the banality of it all.</p>
        </div>
      )
    },
    {
      title: "Decoding",
      description: "Finally, we'll decode the message to reveal both the visible content and hidden content.",
      narration: "Now we decode the message. Try to contain your excitement, it's just reversing what we did earlier.",
      action: () => {
        const { visibleText, hiddenMessage } = decode(demoState.encodedText);
        setDemoState(prev => ({
          ...prev,
          decodedVisibleText: visibleText,
          decodedHiddenText: hiddenMessage
        }));
      },
      content: (
        <div className="space-y-4">
          <Terminal95 text={`> Decoding process initiated.\n> Prepare to be underwhelmed.`} />
          <div>
            <p className="text-sm text-white mb-2">Decoded Visible Content (as if you couldn't guess):</p>
            <Terminal95 text={`> ${demoState.decodedVisibleText}`} />
          </div>
          <div>
            <p className="text-sm text-white mb-2">Decoded Hidden Text (was it worth the effort?):</p>
            <Terminal95 text={`> ${demoState.decodedHiddenText}`} />
          </div>
          <p className="text-white">Congratulations. You've successfully hidden and retrieved a message. I hope it was worth all this trouble.</p>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (step < steps.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      if (steps[nextStep].action) {
        steps[nextStep].action();
      }
      toast({
        title: steps[nextStep].title,
        description: steps[nextStep].description,
        className: "bg-neutral-800 border-neutral-700 text-white",
      });
      synthesizeSpeech(steps[nextStep].narration, false);
    }
  };

  const resetDemo = () => {
    setStep(0);
    setIsFileMode(false);
    setProgress(0);
    setDemoState({
      visibleText: '',
      hiddenText: '',
      encodedText: '',
      decodedVisibleText: '',
      decodedHiddenText: '',
      file: null,
      decodedFile: null,
    });
    toast({
      title: "Demo Reset",
      description: "The demo has been reset. Try not to break it this time.",
      className: "bg-neutral-800 border-neutral-700 text-white",
    });
    synthesizeSpeech("Demo reset. Back to square one. Try to keep up this time.", false);
  };

  const startAutoPlay = () => {
    setIsAutoPlaying(true);
  };

  const synthesizeSpeech = async (text: string, needsAdjustment: boolean) => {
    try {
      setIsNarrating(true);
      const response = await fetch('/api/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, needsAdjustment }),
      });

      if (!response.ok) {
        throw new Error(`Failed to synthesize speech: ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      toast({
        title: "Error",
        description: `Failed to synthesize speech: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsNarrating(false);
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isAutoPlaying && step < steps.length - 1) {
      timeoutId = setTimeout(nextStep, 8000); // Increased delay to allow for narration
    } else if (step === steps.length - 1) {
      setIsAutoPlaying(false);
    }
    return () => clearTimeout(timeoutId);
  }, [step, isAutoPlaying]);

  useEffect(() => {
    // Synthesize speech for the first step when the component mounts
    synthesizeSpeech(steps[0].narration, false);
  }, []);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Steganography Demo</h2>
            <div className="flex space-x-4">
              <Button
                onClick={startAutoPlay}
                disabled={isAutoPlaying || step === steps.length - 1}
                className="bg-neutral-700 hover:bg-neutral-600 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Auto Play
              </Button>
              <Button
                onClick={resetDemo}
                className="bg-neutral-700 hover:bg-neutral-600 text-white"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          <Card className="bg-neutral-800 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-white">{steps[step].title}</CardTitle>
              <p className="text-sm text-neutral-400">{steps[step].description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {typeof steps[step].content === 'function' 
                ? steps[step].content(demoState)
                : steps[step].content}

              <div className="flex justify-between pt-4">
                <div className="space-x-1">
                  {Array.from({ length: steps.length }).map((_, i) => (
                    <span
                      key={i}
                      className={`inline-block w-2 h-2 rounded-full ${
                        i === step ? 'bg-white' : 'bg-neutral-600'
                      }`}
                    />
                  ))}
                </div>

                {step < steps.length - 1 && (
                  <Button
                    onClick={nextStep}
                    className="bg-neutral-700 hover:bg-neutral-600 text-white"
                    disabled={isAutoPlaying}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => audioRef.current?.play()}
              disabled={!audioUrl || isNarrating}
              className="bg-neutral-700 hover:bg-neutral-600 text-white"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Play Narration
            </Button>
            <Button
              onClick={() => audioRef.current?.pause()}
              disabled={!audioUrl || !isNarrating}
              className="bg-neutral-700 hover:bg-neutral-600 text-white"
            >
              <VolumeX className="w-4 h-4 mr-2" />
              Pause Narration
            </Button>
          </div>
        </div>
      </div>
      <audio ref={audioRef} className="hidden" />
    </Layout>
  );
}

