/**
 * Voice command detection for hands-free control.
 */

export interface VoiceCommand {
  type: "summarize" | "repeat" | "next" | "stop" | "mute" | "unmute" | "none";
  original: string;
}

const COMMAND_PATTERNS: { type: VoiceCommand["type"]; patterns: RegExp[] }[] = [
  {
    type: "summarize",
    patterns: [/\bsummar(ize|y)\b/i, /\bसारांश\b/i, /\bসারাংশ\b/i, /\bசுருக்கம்\b/i],
  },
  {
    type: "repeat",
    patterns: [/\brepeat\b/i, /\bagain\b/i, /\bdoबारा\b/i, /\bफिर से\b/i, /\bআবার\b/i],
  },
  {
    type: "next",
    patterns: [/\bnext\s*(step)?\b/i, /\bआगे\b/i, /\bअगला\b/i, /\bপরবর্তী\b/i],
  },
  {
    type: "stop",
    patterns: [/\bstop\b/i, /\bruk(o|iye)?\b/i, /\bबंद\b/i, /\bথামো\b/i],
  },
  {
    type: "mute",
    patterns: [/\bmute\b/i, /\bchup\b/i, /\bশান্ত\b/i],
  },
  {
    type: "unmute",
    patterns: [/\bunmute\b/i, /\bbolo\b/i],
  },
];

export function detectVoiceCommand(transcript: string): VoiceCommand {
  const trimmed = transcript.trim();
  for (const cmd of COMMAND_PATTERNS) {
    if (cmd.patterns.some((p) => p.test(trimmed))) {
      return { type: cmd.type, original: trimmed };
    }
  }
  return { type: "none", original: trimmed };
}
