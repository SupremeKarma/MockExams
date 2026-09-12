---
id: bit253co-u5-t5
type: topic_note
course: BIT253CO
syllabus_path: bit.s4.bit253co.u5.t5
syllabus_code: "5.e"
trust: ai_draft
---

# Terminals

:::idea
A terminal is whatever a person types into and reads from. It used to be a
physical machine on a desk connected by a serial cable; today it is a window on
a screen. The operating system keeps the same abstraction for both, which is why
a program written in 1975 still runs in a modern terminal window.
:::

## Kinds of terminal

| Kind | How it connects | Example |
|---|---|---|
| **Serial (RS-232)** | Cable to a serial port, character by character | Classic VT100, embedded console |
| **Memory-mapped** | Writes straight into video RAM on the same machine | PC console |
| **Network / pseudo** | A program pretends to be a terminal | SSH session, `xterm`, any terminal app |

Modern systems almost entirely use the third. A **pseudo-terminal** is a pair of
software devices: the program at one end thinks it is talking to a real
terminal, while a terminal emulator at the other end draws the characters in a
window. Nothing physical is involved, and every program above is unaware.

## Input software: the two modes

This is the examinable heart of the topic. Terminal input works in one of two
modes, and the difference is *who handles the Backspace key*.

### Canonical mode (cooked mode)

The driver collects characters into a **line buffer** and does not give the line
to the program until Enter is pressed. While collecting, the driver itself
handles the editing characters:

| Character | Effect |
|---|---|
| Backspace | Erase the previous character |
| `@` or Ctrl-U | Erase the whole line |
| Ctrl-D | End of file |
| Ctrl-C | Send an interrupt signal to the process |

So a program that reads a line never sees the mistakes and corrections — it gets
the finished line.

### Non-canonical mode (raw mode)

**Every character goes straight to the program, unprocessed.** Backspace is
delivered as a character like any other; the program decides what it means.

This is what a text editor or a game needs, because `vi` must react to `j` the
moment it is pressed, and must treat Backspace as a command rather than an edit.

:::warning
The usual exam trap: "in which mode does the driver handle Backspace?" The
answer is **canonical**. Raw mode hands every keystroke through untouched, which
is exactly why editors ask for it — they want to interpret those keys
themselves.
:::

## Echoing, and why it is the driver's job

When you type, the character appears on screen. That is not the keyboard doing
it — the **driver echoes** it back to the display.

This is more delicate than it sounds:

- A program may be printing output at the same moment; echoed input has to be
  interleaved sensibly.
- Echoing must be **switched off** for a password prompt.
- A backspace has to echo as three characters — backspace, space, backspace — to
  actually erase the character on screen rather than just move the cursor back.

:::example{title="Why erasing takes three characters"}
Sending one backspace moves the cursor left but leaves the letter visible.

    type "cat"   →  c a t
    backspace    →  c a t      cursor now under 't', still shows
    space        →  c a        't' overwritten with a blank
    backspace    →  c a        cursor back where it belongs
:::

## Output software and escape sequences

Output to a memory-mapped screen is easy: write into video RAM. Output to a
serial terminal needs a way to say things other than "print this character" —
move the cursor, clear the screen, scroll a region.

That is done with **escape sequences**: a character stream beginning with the
ESC character, interpreted as a command rather than text.

| Sequence | Meaning |
|---|---|
| `ESC [ n A` | Move up n lines |
| `ESC [ n ; m H` | Move the cursor to row n, column m |
| `ESC [ s J` | Clear the screen |
| `ESC [ n L` | Insert n blank lines |

The ANSI standard set is what the VT100 used, and terminal emulators still
implement it today — which is why colours and cursor movement work the same in
almost every terminal.

:::warning
Different terminals used different escape sequences, and a program cannot
contain a case for each. UNIX solves this with a **terminal database**
(`termcap`, later `terminfo`) plus a library (`curses` / `ncurses`): the program
says "move the cursor here" and the library looks up the right sequence for
whatever `TERM` says the terminal is. Naming that indirection is usually worth a
mark.
:::

## Why the abstraction has lasted

The terminal interface has survived since the 1970s because it is a genuinely
good abstraction: a bidirectional stream of characters with a little in-band
control. It is why `ls | grep foo` works whether the output goes to a screen, a
file or another program, and why remote login needs no change to any program.

:::exam-tip
Terminal questions are descriptive, not numerical. Structure an answer as:
terminal **types**, input software (**canonical vs non-canonical**, with the
Backspace example), **echoing** and its complications, then output software and
**escape sequences**.

The canonical/raw distinction is the single highest-value thing here — define
both, say which handles editing characters, and name one program that needs raw
mode. If there is room, mention `terminfo`/`curses` as the answer to terminal
diversity.
:::

:::practice-link
Practice variants for this topic arrive in Phase 4.
:::
