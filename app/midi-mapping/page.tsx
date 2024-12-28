import MIDIVisualMapping from '@/components/MIDIVisualMapping';

export default function MIDIMappingPage() {
  return (
    <div className="min-h-screen bg-black p-4">
      <h1 className="text-2xl font-bold text-white mb-4">MIDI Mapping Visualization</h1>
      <MIDIVisualMapping />
    </div>
  );
}

