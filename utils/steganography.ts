const ZERO_WIDTH_SPACE = '\u200B';
const ZERO_WIDTH_NON_JOINER = '\u200C';

export function encode(visibleText: string, hiddenMessage: string): string {
  const binaryHidden = stringToBinary(hiddenMessage);
  let encodedText = '';
  let binaryIndex = 0;

  for (let char of visibleText) {
    encodedText += char;
    if (binaryIndex < binaryHidden.length) {
      encodedText += binaryHidden[binaryIndex] === '0' ? ZERO_WIDTH_SPACE : ZERO_WIDTH_NON_JOINER;
      binaryIndex++;
    }
  }

  // Append any remaining binary data
  while (binaryIndex < binaryHidden.length) {
    encodedText += binaryHidden[binaryIndex] === '0' ? ZERO_WIDTH_SPACE : ZERO_WIDTH_NON_JOINER;
    binaryIndex++;
  }

  return encodedText;
}

export function decode(encodedText: string): { visibleText: string, hiddenMessage: string } {
  let visibleText = '';
  let binaryHidden = '';

  for (let i = 0; i < encodedText.length; i++) {
    if (encodedText[i] === ZERO_WIDTH_SPACE) {
      binaryHidden += '0';
    } else if (encodedText[i] === ZERO_WIDTH_NON_JOINER) {
      binaryHidden += '1';
    } else {
      visibleText += encodedText[i];
    }
  }

  const hiddenMessage = binaryToString(binaryHidden);

  return { visibleText, hiddenMessage };
}

function stringToBinary(str: string): string {
  return str.split('').map(char => 
    char.charCodeAt(0).toString(2).padStart(8, '0')
  ).join('');
}

function binaryToString(binary: string): string {
  const bytes = binary.match(/.{1,8}/g) || [];
  return bytes.map(byte => 
    String.fromCharCode(parseInt(byte, 2))
  ).join('');
}

