// voice.js
// Fake voice input. Tap-and-hold the mic, waveform animates, pre-written text
// appears in the input field after 2s. No microphone permission, no Web Speech.
// Demo-reliable: it never fails on stage.

const HOLD_DURATION_MS = 2000;
const MIN_HOLD_MS = 400; // don't trigger on accidental taps

/**
 * Attach tap-and-hold behavior to a mic button.
 * @param {HTMLElement} btn - the mic button element
 * @param {() => string} getTranscript - returns the string to "transcribe"
 * @param {(text: string) => void} onComplete - called with transcript when hold completes
 */
export function attachMic(btn, getTranscript, onComplete) {
  let holdTimer = null;
  let holdStart = 0;
  let isHolding = false;

  const start = (e) => {
    e.preventDefault();
    if (isHolding) return;
    isHolding = true;
    holdStart = Date.now();
    btn.classList.add('recording');

    holdTimer = setTimeout(() => {
      // Held long enough — trigger transcription
      const text = getTranscript();
      btn.classList.remove('recording');
      isHolding = false;
      holdTimer = null;
      onComplete(text);
    }, HOLD_DURATION_MS);
  };

  const cancel = (e) => {
    if (!isHolding) return;
    const heldFor = Date.now() - holdStart;
    isHolding = false;
    btn.classList.remove('recording');

    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }

    // If they tapped instead of held, treat it as a tap-to-transcribe shortcut
    // (useful for demo-ability on executive laptops where holding is awkward)
    if (heldFor < MIN_HOLD_MS) {
      // Tap — trigger immediately with the transcript
      setTimeout(() => {
        btn.classList.add('recording');
        setTimeout(() => {
          const text = getTranscript();
          btn.classList.remove('recording');
          onComplete(text);
        }, HOLD_DURATION_MS);
      }, 50);
    }
  };

  // Pointer events handle mouse + touch uniformly
  btn.addEventListener('pointerdown', start);
  btn.addEventListener('pointerup', cancel);
  btn.addEventListener('pointerleave', cancel);
  btn.addEventListener('pointercancel', cancel);
}
