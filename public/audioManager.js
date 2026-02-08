// Audio Manager - Handles all game sounds
class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.radioPlaying = false;
        this.radioAudio = null;
        this.currentSongIndex = 0;
        
        // Tunisian classic songs playlist (YouTube/external URLs)
        this.tunisianSongs = [
            '/assets/audio/song1.mp3', // You'll need to add these
            '/assets/audio/song2.mp3',
            '/assets/audio/song3.mp3'
        ];
        
        this.sounds = {
            cardDeal: null,
            cardFlip: null,
            chip: null,
            win: null,
            lose: null,
            chichaSound: null
        };
        
        this.initRadio();
    }
    
    initRadio() {
        this.radioAudio = new Audio();
        this.radioAudio.loop = false;
        this.radioAudio.volume = 0.3;
        
        this.radioAudio.addEventListener('ended', () => {
            this.nextSong();
        });
    }
    
    toggleRadio() {
        if (this.radioPlaying) {
            this.stopRadio();
        } else {
            this.playRadio();
        }
    }
    
    playRadio() {
        if (!this.tunisianSongs.length) {
            console.warn('No songs in playlist');
            return;
        }
        
        this.radioAudio.src = this.tunisianSongs[this.currentSongIndex];
        this.radioAudio.play().catch(e => console.error('Radio play error:', e));
        this.radioPlaying = true;
    }
    
    stopRadio() {
        this.radioAudio.pause();
        this.radioPlaying = false;
    }
    
    nextSong() {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.tunisianSongs.length;
        this.playRadio();
    }
    
    // Chicha sound (bubbling hookah)
    playChichaSound() {
        this.createBubblingSound();
    }
    
    createBubblingSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Bubbling sound parameters
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(120, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(80, this.audioContext.currentTime + 0.5);
        
        filter.type = 'lowpass';
        filter.frequency.value = 300;
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }
    
    // Existing game sounds
    playCardDeal() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.frequency.value = 150;
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.15);
    }
    
    playCardFlip() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.frequency.value = 200;
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }
    
    playChipSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.frequency.value = 1200;
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.08);
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.08);
    }
    
    playWinSound() {
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, i) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            oscillator.frequency.value = freq;
            const startTime = this.audioContext.currentTime + (i * 0.1);
            gainNode.gain.setValueAtTime(0.3, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.5);
        });
    }
    
    playLoseSound() {
        const notes = [392, 349.23, 293.66];
        notes.forEach((freq, i) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            oscillator.frequency.value = freq;
            const startTime = this.audioContext.currentTime + (i * 0.15);
            gainNode.gain.setValueAtTime(0.25, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.4);
        });
    }
}

// Export for use
window.audioManager = new AudioManager();
