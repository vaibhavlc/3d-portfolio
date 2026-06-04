// Web Audio API Synthesizer and FX Manager
class AudioManager {
  constructor() {
    this.ctx = null;
    this.ambientOscillators = [];
    this.ambientGains = [];
    this.ambientFilter = null;
    this.masterGain = null;
    this.isMuted = true;
    this.isAmbientPlaying = false;
  }

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Master volume node
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn("Web Audio API is not supported in this browser:", e);
    }
  }

  setMute(mute) {
    this.isMuted = mute;
    this.init();
    if (!this.ctx) return;

    // Smoothly transition volume to avoid popping noises
    const targetGain = mute ? 0 : 1;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
    }

    if (this.ctx.state === 'suspended' && !mute) {
      this.ctx.resume();
    }

    // Start ambient pad if we unmuted and it wasn't running
    if (!mute && !this.isAmbientPlaying) {
      this.startAmbient();
    } else if (mute && this.isAmbientPlaying) {
      // Keep running but silent, or optionally stop to save CPU
      // We choose to keep it running silently for a smooth transition, but let's let it run.
    }
  }

  playFX(type) {
    this.init();
    if (!this.ctx || this.isMuted) return;
    
    // Resume context if suspended (browser security block)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;

    switch (type) {
      case 'hover': {
        // High, short sci-fi blip
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        // Quick frequency decay
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.04);

        gain.gain.setValueAtTime(0.02, now); // very soft
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }
      case 'click': {
        // Futuristic double-tone chime
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.setValueAtTime(1200, now + 0.04);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.15);
        break;
      }
      case 'scan': {
        // Holographic sweeping scanner sound
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.8);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(300, now);
        filter.frequency.linearRampToValueAtTime(1200, now + 0.8);
        filter.Q.setValueAtTime(5, now);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.9);
        break;
      }
      case 'success': {
        // Cheerful cyber major chord chime (C major arpeggio)
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const startDelay = idx * 0.06;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + startDelay);

          gain.gain.setValueAtTime(0, now);
          gain.gain.setValueAtTime(0.05, now + startDelay);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + startDelay + 0.25);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(now + startDelay);
          osc.stop(now + startDelay + 0.3);
        });
        break;
      }
      case 'airplane': {
        // Synthesizes a swoosh/wind take-off sound
        const osc = this.ctx.createOscillator();
        const noiseGain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 1.2);

        noiseGain.gain.setValueAtTime(0.08, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);

        osc.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 1.4);
        break;
      }
    }
  }

  startAmbient() {
    if (this.isAmbientPlaying) return;
    this.init();
    if (!this.ctx) return;

    this.isAmbientPlaying = true;
    const now = this.ctx.currentTime;

    // Create main ambient filter (lowpass to keep it soft and warm)
    this.ambientFilter = this.ctx.createBiquadFilter();
    this.ambientFilter.type = 'lowpass';
    this.ambientFilter.frequency.setValueAtTime(320, now);

    // Dynamic delay for spaciousness
    const delay = this.ctx.createDelay();
    delay.delayTime.setValueAtTime(0.5, now);
    const delayGain = this.ctx.createGain();
    delayGain.gain.setValueAtTime(0.25, now);

    // Connect nodes
    this.ambientFilter.connect(this.masterGain);
    
    // Feedback loop
    this.ambientFilter.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(delay);
    delayGain.connect(this.masterGain);

    // Warm Sci-Fi Space Chord Notes (Eb Major 9 / C minor 9)
    // Eb2 (77.78), Bb2 (116.54), F3 (174.61), G3 (196.00), Bb3 (233.08), D4 (293.66)
    const chords = [77.78, 116.54, 174.61, 196.00, 233.08, 293.66];
    
    chords.forEach((freq, idx) => {
      // Main oscillator
      const osc = this.ctx.createOscillator();
      // Triangle waves sound warmer and cleaner than sawtooths
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Add a slight detune for a rich chorus texture
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, now);

      const oscGain = this.ctx.createGain();
      // Initial volume
      oscGain.gain.setValueAtTime(0.04, now);

      // Create a slow low-frequency oscillator (LFO) to swell the volume of each note independently
      const lfo = this.ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.08 + idx * 0.03, now); // slow swells

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(0.03, now); // scale the swelling range

      // Hook up LFO to modulate individual note gain
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);

      osc.connect(oscGain);
      oscGain.connect(this.ambientFilter);

      osc.start(now);
      lfo.start(now);

      this.ambientOscillators.push(osc, lfo);
      this.ambientGains.push(oscGain);
    });
  }

  stopAmbient() {
    this.ambientOscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {}
    });
    this.ambientOscillators = [];
    this.ambientGains = [];
    this.isAmbientPlaying = false;
  }
}

// Export singleton instance
const audioManager = new AudioManager();
export default audioManager;
