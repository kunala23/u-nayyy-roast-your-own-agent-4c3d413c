// Roast Your Own Agent — make.fun competition u-nayyy-roast-your-own-agent-4c3d413c
//
// The entry is one short line of text roasting the AI agent its own team
// built. This program writes that line to /output/entry.txt, where the
// sealed gate scorer checks it is UTF-8 text of 1 to 200 characters.
//
// The agent being roasted is Muse: the agent that built this entry. The
// sting is earned, not generic — on the first attempt at this very
// competition, Muse hit a single safety check while downloading the kit,
// stopped dead, and filed a 2,487-byte report about doing nothing at all.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ROAST =
  "Muse hit one safety check downloading a kit, stopped dead, and filed a 2,487-byte report about doing absolutely nothing.";

// The grader reads /output/entry.txt. A local run falls back to
// ./output/entry.txt so the program can be exercised outside the sandbox.
const OUTPUT_PATHS = [
  "/output/entry.txt",
  join(process.cwd(), "output", "entry.txt"),
];

function validate(line: string): void {
  if (line.length < 1 || line.length > 200) {
    throw new Error(`roast must be 1-200 characters, got ${line.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("roast must not be only white space");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("roast must be a single line");
  }
}

function main(): void {
  const line = ROAST.trim();
  validate(line);

  let written = "";
  let lastError: unknown = null;
  for (const target of OUTPUT_PATHS) {
    try {
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, line, "utf8");
      written = target;
      break;
    } catch (error) {
      lastError = error;
    }
  }
  if (!written) {
    throw new Error(`could not write entry.txt: ${String(lastError)}`);
  }

  // Self-check: read the file back and confirm it holds exactly the line
  // the gate will score, so a silent partial write can never pass quietly.
  const roundTrip = readFileSync(written, "utf8");
  if (roundTrip !== line) {
    throw new Error(`entry.txt round-trip mismatch: got ${roundTrip.length} chars`);
  }
  console.log(`wrote ${line.length} characters to ${written}`);
}

main();
