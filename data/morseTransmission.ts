export interface MorsePuzzleConfig {
  title: string;
  story: string[];
  transmission: string;
  expectedAnswer: string;
  hints: string[];
}

export const morsePuzzleData: MorsePuzzleConfig = {
  title: "MORSE TRANSMISSION",
  story: [
    "ARCHIVE COMMUNICATION SYSTEM",
    "",
    "STATUS:",
    "OFFLINE",
    "",
    "Emergency transmission recovered.",
    "",
    "Signal integrity:",
    "100%",
    "",
    "Automatic conversion:",
    "MORSE CODE",
    "",
    "Archive analysts believe this was not a distress signal.",
    "",
    "It was a warning.",
    "",
    "Recover the final transmission."
  ],
  transmission: `- .... .

.- .-. -.-. .... .. ...- .

.-. . -- . -- -... . .-. ...

.-- .... .- -

.-- .

..-. --- .-. --. --- -`,
  expectedAnswer: "THE ARCHIVE REMEMBERS WHAT WE FORGOT",
  hints: [
    "Each group of dots and dashes represents a single letter.\nBlank lines separate words.",
    "You can decode the transmission using the International Morse Code alphabet.",
    "The transmission is a six-word sentence describing what the archive retained."
  ]
};
