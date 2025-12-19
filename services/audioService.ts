
class AudioService {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private midiToFreq(midi: number): number {
    return Math.pow(2, (midi - 69) / 12) * 440;
  }

  /**
   * Synthesizes a "Classic Piano" sound.
   * Piano sounds are percussive, rich in overtones that decay at different rates,
   * and have a distinct initial "thump" from the hammer.
   */
  playNote(midi: number, duration = 1.5, volume = 0.3) {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freq = this.midiToFreq(midi);

    // Main gain for the whole note
    const noteGain = this.ctx.createGain();
    
    // Dynamic Low-pass filter: Pianos lose high-frequency energy faster than low.
    // The filter starts open and closes quickly to "mellow" the sound.
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 6, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.2, now + duration * 0.8);
    filter.Q.setValueAtTime(0.5, now);

    // Create Harmonics (Additive Synthesis)
    // f: Fundamental (Sine)
    // 2f, 3f, 4f: Overtones for body and timber
    const harmonics = [
      { type: 'sine' as OscillatorType, freqMult: 1, gain: 1.0 },
      { type: 'sine' as OscillatorType, freqMult: 2, gain: 0.45 },
      { type: 'triangle' as OscillatorType, freqMult: 3, gain: 0.15 }, // Triangle adds slight metallic character
      { type: 'sine' as OscillatorType, freqMult: 4, gain: 0.08 },
      { type: 'sine' as OscillatorType, freqMult: 5, gain: 0.03 },
    ];

    harmonics.forEach(h => {
      const osc = this.ctx!.createOscillator();
      const hGain = this.ctx!.createGain();
      
      osc.type = h.type;
      osc.frequency.setValueAtTime(freq * h.freqMult, now);
      
      // Initial overtone levels
      hGain.gain.setValueAtTime(h.gain, now);
      
      osc.connect(hGain);
      hGain.connect(filter);
      
      osc.start(now);
      osc.stop(now + duration);
    });

    // --- Hammer Strike Simulation ---
    // A very short burst of noise to simulate the hammer hitting the string.
    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.04, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < output.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const noiseGain = this.ctx.createGain();
    const noiseFilter = this.ctx.createBiquadFilter();
    
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(1000, now); // Low thud noise
    
    noiseGain.gain.setValueAtTime(0.12, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(noteGain);
    noiseSource.start(now);

    // --- ADSR Envelope ---
    // Pianos have an immediate attack and a natural exponential decay.
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(volume, now + 0.005); // Rapid attack
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    filter.connect(noteGain);
    noteGain.connect(this.ctx.destination);
  }

  async playChord(midiNotes: number[], duration = 2.0) {
    midiNotes.forEach(midi => this.playNote(midi, duration, 0.18));
  }

  async playArpeggio(midiNotes: number[], noteDuration = 0.3) {
    this.init();
    midiNotes.forEach((midi, index) => {
      setTimeout(() => {
        this.playNote(midi, 1.8, 0.22);
      }, index * noteDuration * 1000);
    });
    
    // Play full chord at the end with a slightly longer duration
    setTimeout(() => {
      this.playChord(midiNotes, 2.8);
    }, midiNotes.length * noteDuration * 1000);
  }

  stopAll() {
    // Managed by exponential decay in playNote
  }
}

export const audioService = new AudioService();
