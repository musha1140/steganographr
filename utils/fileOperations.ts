import axios from 'axios';
import { encode } from './steganography';

const VIRUS_TOTAL_API_KEY = '807768f1fa876c5e30f95f295fda8c17ce0821eee7d83494a0e8e35284dca68b';

export async function generateTempUrl(file: File): Promise<string> {
  // This is a mock function. In a real scenario, you'd upload the file to a server and get a URL back.
  return URL.createObjectURL(file);
}

export async function scanFile(url: string): Promise<boolean> {
  try {
    const response = await axios.post('https://www.virustotal.com/vtapi/v2/url/scan', null, {
      params: {
        apikey: VIRUS_TOTAL_API_KEY,
        url: url
      }
    });

    // Wait for the scan to complete
    await new Promise(resolve => setTimeout(resolve, 5000));

    const report = await axios.get('https://www.virustotal.com/vtapi/v2/url/report', {
      params: {
        apikey: VIRUS_TOTAL_API_KEY,
        resource: url
      }
    });

    return report.data.positives === 0;
  } catch (error) {
    console.error('Error scanning file:', error);
    return false;
  }
}

export function obfuscateAsAudio(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        const fileContent = event.target.result as ArrayBuffer;
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(fileContent);
        
        // Convert file content to MIDI-like data
        const midiData = new Uint8Array(fileContent);
        const audioData = audioBuffer.getChannelData(0);
        
        for (let i = 0; i < midiData.length; i++) {
          audioData[i] = (midiData[i] / 255) * 2 - 1;
        }
        
        const wavBuffer = audioBufferToWav(audioBuffer);
        resolve(wavBuffer);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
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

