import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const DELIMITER = '\u200B';
const HEX_DELIMITER = '\u200C'; // Zero-Width Non-Joiner for Hex
const EMOJI_DELIMITER = '🌟'; // Emoji Delimiter for fun

// A more secure key derivation function
function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512');
}

// A more robust encoding function for secure text
function secureEncode(text, password) {
  const salt = crypto.randomBytes(16);
  const key = deriveKey(password, salt);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return salt.toString('hex') + iv.toString('hex') + encrypted;
}

// A more robust decoding function for secure text
function secureDecode(encodedText, password) {
  const salt = Buffer.from(encodedText.slice(0, 32), 'hex');
  const iv = Buffer.from(encodedText.slice(32, 64), 'hex');
  const encrypted = encodedText.slice(64);

  const key = deriveKey(password, salt);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

export function encode(visibleText, hiddenContent, fileBlob = null, format = 'base64', password = '') {
  const payload = {
    hiddenContent: password ? secureEncode(hiddenContent, password) : hiddenContent,
    fileBlob: fileBlob ? (format === 'base64' ? btoa(fileBlob) : toHex(fileBlob)) : null,
    format,
  };
  const encodedPayload = btoa(JSON.stringify(payload));
  const delimiter = format === 'base64' ? DELIMITER : HEX_DELIMITER;
  return `${visibleText}${delimiter}${encodedPayload}`;
}

export function decode(encodedText, format = 'base64', password = '') {
  const delimiter = format === 'base64' ? DELIMITER : HEX_DELIMITER;
  const parts = encodedText.split(delimiter);
  if (parts.length !== 2) {
    throw new Error('Invalid encoded text format');
  }

  const payload = JSON.parse(atob(parts[1]));
  const decodedHiddenContent = password ? secureDecode(payload.hiddenContent, password) : payload.hiddenContent;
  const decodedFileBlob = payload.fileBlob
    ? (payload.format === 'base64' ? atob(payload.fileBlob) : fromHex(payload.fileBlob))
    : null;

  return {
    visibleText: parts[0],
    hiddenContent: decodedHiddenContent || '',
    fileBlob: decodedFileBlob,
  };
}

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function fromHex(hex) {
  return new Uint8Array(hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
}

// Function to map encrypted data to audio frequencies
function mapToAudio(data) {
  const frequencies = [];
  for (let i = 0; i < data.length; i += 2) {
    const byte = parseInt(data.substr(i, 2), 16);
    const frequency = 200 + (byte / 255) * 1800;
    frequencies.push(frequency);
  }
  return frequencies;
}

// Function to add noise to the audio data
function addNoise(frequencies, noiseLevel) {
  return frequencies.map(freq => {
    const noise = (Math.random() - 0.5) * 2 * noiseLevel;
    return freq + noise;
  });
}

// Example usage with emoji delimiter
export function encodeWithEmoji(visibleText, hiddenContent, fileBlob = null, password = '') {
  const payload = {
    hiddenContent: password ? secureEncode(hiddenContent, password) : hiddenContent,
    fileBlob: fileBlob ? btoa(fileBlob) : null,
  };
  const encodedPayload = btoa(JSON.stringify(payload));
  return `${visibleText}${EMOJI_DELIMITER}${encodedPayload}`;
}

export function decodeWithEmoji(encodedText, password = '') {
  const parts = encodedText.split(EMOJI_DELIMITER);
  if (parts.length !== 2) {
    throw new Error('Invalid encoded text format');
  }

  const payload = JSON.parse(atob(parts[1]));
  const decodedHiddenContent = password ? secureDecode(payload.hiddenContent, password) : payload.hiddenContent;

  return {
    visibleText: parts[0],
    hiddenContent: decodedHiddenContent || '',
    fileBlob: payload.fileBlob ? atob(payload.fileBlob) : null,
  };
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { action, text, password } = req.body;

      if (action === 'encode') {
        const encoded = encode(text, '', null, 'base64', password);
        const frequencies = mapToAudio(encoded);
        const noisyFrequencies = addNoise(frequencies, 10);

        res.status(200).json({ frequencies: noisyFrequencies });
      } else if (action === 'decode') {
        const decoded = decode(text, 'base64', password);
        res.status(200).json({ decodedText: decoded.hiddenContent });
      } else {
        res.status(400).json({ error: 'Invalid action' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

