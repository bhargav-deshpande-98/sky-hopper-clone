// Web Audio API sound effects — Helicopter theme for Sky Hopper

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  return audioContext
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.3
) {
  try {
    const ctx = getAudioContext()

    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

    gainNode.gain.setValueAtTime(volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  } catch {
    // Audio not available, silently fail
  }
}

// Rapid choppy burst to simulate rotor direction change
function playChopBurst(baseFreq: number, volume: number) {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'square'
    // Rapid frequency modulation for chopper feel
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime)
    osc.frequency.setValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.015)
    osc.frequency.setValueAtTime(baseFreq * 0.8, ctx.currentTime + 0.03)
    osc.frequency.setValueAtTime(baseFreq * 1.3, ctx.currentTime + 0.045)

    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.07)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.07)
  } catch {
    // Audio not available
  }
}

// Tap to change direction — rapid rotor chop
export function playTapSound() {
  playChopBurst(220, 0.1)
  setTimeout(() => playTone(440, 0.03, 'square', 0.06), 20)
}

// Passed through a platform gap — varies by score for distinct sounds
// Cycles through 5 different tones so each platform feels different
export function playScoreSound(score: number = 0) {
  const variant = score % 5

  switch (variant) {
    case 0:
      // Ascending whir
      playTone(400, 0.06, 'triangle', 0.12)
      setTimeout(() => playTone(600, 0.05, 'triangle', 0.08), 25)
      break
    case 1:
      // Mechanical ping
      playTone(900, 0.05, 'sine', 0.1)
      setTimeout(() => playTone(700, 0.04, 'sine', 0.07), 30)
      break
    case 2:
      // Rotor whoosh
      playChopBurst(350, 0.08)
      setTimeout(() => playTone(550, 0.04, 'triangle', 0.09), 35)
      break
    case 3:
      // Double click
      playTone(650, 0.03, 'square', 0.08)
      setTimeout(() => playTone(800, 0.03, 'square', 0.06), 40)
      break
    case 4:
      // Turbine hum rising
      playTone(300, 0.08, 'sawtooth', 0.07)
      setTimeout(() => playTone(500, 0.05, 'triangle', 0.1), 30)
      break
  }
}

// Hit wall or platform — mechanical crash with metallic clatter
export function playDeathSound() {
  // Heavy metallic impact
  playTone(100, 0.3, 'sawtooth', 0.2)
  // Scraping metal
  setTimeout(() => playTone(180, 0.15, 'square', 0.15), 40)
  // Rotor winding down
  setTimeout(() => {
    playChopBurst(160, 0.12)
  }, 100)
  setTimeout(() => playTone(60, 0.25, 'sawtooth', 0.1), 180)
}

// Resume audio context on user interaction (required by browsers)
export function initAudio() {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
  } catch {
    // Audio not available
  }
}
