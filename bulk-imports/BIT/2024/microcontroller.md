Q: What is an "embedded system"?
A) A general-purpose computer that can run any application
B) A dedicated computing system, combining hardware and software, designed to perform one or a few specific functions within a larger device
C) A system with no software component at all
D) A synonym for a desktop operating system
ANSWER: B
EXPLAIN: An embedded system is a special-purpose computing system built into a larger device to perform a specific, often real-time, dedicated function — such as a washing machine controller or a car's engine management unit — unlike a general-purpose computer designed to run many different applications.
DIFFICULTY: easy
MARKS: 2

Q: What is the key difference between a microcontroller and a microprocessor?
A) They are identical with no functional difference
B) A microcontroller integrates a CPU, memory (RAM/ROM), and I/O peripherals on a single chip for embedded control tasks; a microprocessor is just the CPU core, requiring external memory and peripheral chips to function
C) A microprocessor always has more built-in memory than a microcontroller
D) Microcontrollers cannot execute any instructions
ANSWER: B
EXPLAIN: A microcontroller is a self-contained system-on-chip including the CPU, RAM, ROM, and I/O ports, ideal for dedicated embedded control applications; a microprocessor is only the processing unit and needs external memory and peripheral ICs to build a complete system, making it more suited to general-purpose computing.
DIFFICULTY: medium
MARKS: 8

Q: In 8051 microcontroller programming, what is the purpose of a "time delay loop"?
A) To permanently halt the microcontroller
B) To create a controlled pause in program execution by repeatedly executing a counting loop, often used for timing operations without a dedicated timer
C) To delete data from memory
D) To increase the clock frequency of the microcontroller
ANSWER: B
EXPLAIN: A time delay loop uses a software counting loop (e.g. decrementing a register repeatedly) to consume a predictable number of clock cycles, creating an intentional pause in program execution — useful when precise hardware timers aren't used or available for a given delay.
DIFFICULTY: medium
MARKS: 4

Q: What is a "MACRO" in 8051 assembly language programming?
A) A hardware component of the 8051 chip
B) A named block of reusable assembly code that the assembler expands inline wherever the macro is invoked, avoiding repetitive typing of the same instruction sequence
C) A type of external memory chip
D) A synonym for an interrupt service routine
ANSWER: B
EXPLAIN: A macro is a reusable, named sequence of assembly instructions defined once and then invoked (called) by name throughout the program; the assembler expands each macro call into the actual instructions at assembly time, improving code readability and reducing repetition.
DIFFICULTY: medium
MARKS: 4

Q: What is a "timer" in the context of the 8051 microcontroller, and what is it primarily used for?
A) A component used only to slow down the CPU clock permanently
B) A hardware counter/register that increments with each clock pulse, used to measure time intervals, generate delays, or count external events
C) A type of external memory chip
D) A component that has no relation to counting or timing operations
ANSWER: B
EXPLAIN: The 8051's built-in timers are hardware counters that increment automatically with each machine cycle (or external pulse in counter mode), allowing programs to measure precise time intervals, generate periodic delays, or count external events without relying on inefficient software loops.
DIFFICULTY: medium
MARKS: 8

Q: What is UART in the context of microcontroller communication?
A) A type of parallel port only
B) Universal Asynchronous Receiver/Transmitter — a hardware module that enables serial communication (sending/receiving data one bit at a time) between the microcontroller and other devices without a shared clock signal
C) A type of external RAM chip
D) A synonym for a microcontroller's power supply unit
ANSWER: B
EXPLAIN: UART (Universal Asynchronous Receiver/Transmitter) is a hardware peripheral that converts parallel data into serial form for transmission and vice versa for reception, communicating asynchronously (without a shared clock line) using a defined baud rate agreed upon by both communicating devices.
DIFFICULTY: medium
MARKS: 8

Q: What does "baud rate" refer to in serial communication?
A) The number of bits stored in the microcontroller's memory
B) The rate at which data symbols (often bits, in simple serial links) are transmitted per second over the serial line
C) The physical voltage level used by the microcontroller
D) The number of interrupts a microcontroller can handle
ANSWER: B
EXPLAIN: Baud rate specifies how many signal changes (symbols, commonly equivalent to bits in simple UART communication) are transmitted per second over a serial connection — both communicating devices must be configured to the same baud rate for correct data transfer.
DIFFICULTY: medium
MARKS: 4

Q: What does "interrupt" mean in embedded systems programming?
A) A permanent stop of the microcontroller with no recovery
B) A signal that temporarily pauses the normal flow of a program to execute a special routine (Interrupt Service Routine) in response to an event, then resumes the original program afterward
C) A type of external memory access only
D) A synonym for a compiler error
ANSWER: B
EXPLAIN: An interrupt is a mechanism that lets hardware or software events (like a timer overflow or incoming serial data) pause the CPU's normal program execution to run a dedicated Interrupt Service Routine (ISR), after which execution returns to exactly where it left off in the main program.
DIFFICULTY: medium
MARKS: 8

Q: What is the "Program Status Word" (PSW) register used for in the 8051 microcontroller?
A) It stores the entire program code
B) It holds status flags reflecting the result of the most recent arithmetic/logic operation — such as carry, auxiliary carry, overflow, and parity — along with register bank select bits
C) It is used exclusively to store external RAM addresses
D) It has no functional purpose in the 8051
ANSWER: B
EXPLAIN: The PSW register in the 8051 contains condition flags (Carry, Auxiliary Carry, Overflow, Parity) set automatically based on the outcome of arithmetic and logic operations, plus bits that select the active register bank — critical for conditional branching and status checking in assembly programs.
DIFFICULTY: hard
MARKS: 4
