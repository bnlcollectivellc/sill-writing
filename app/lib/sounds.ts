let ambientAudio: HTMLAudioElement | null = null;

export function startAmbientSound(): void {
  if (typeof window === "undefined") return;

  if (!ambientAudio) {
    ambientAudio = new Audio("/ambient.wav");
    ambientAudio.loop = true;
    ambientAudio.volume = 0.3;
  }

  ambientAudio.play().catch(() => {
    // Browser may block autoplay - that's okay
    console.log("Ambient audio autoplay blocked by browser");
  });
}

export function stopAmbientSound(): void {
  if (ambientAudio) {
    ambientAudio.pause();
    ambientAudio.currentTime = 0;
  }
}

export function isAmbientPlaying(): boolean {
  return ambientAudio ? !ambientAudio.paused : false;
}

export function playChime(): void {
  // Generate a simple chime using Web Audio API
  if (typeof window === "undefined") return;

  const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Meditation bell-like tone
  oscillator.frequency.value = 528; // Hz - a calming frequency
  oscillator.type = "sine";

  // Gentle fade in and out
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 2);
}
