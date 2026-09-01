Q: What is a defining characteristic of an embedded system?
A) A general-purpose computer designed to run many different applications
B) A dedicated computer system built to perform a specific, often real-time, function within a larger device
C) A system that never interacts with hardware directly
D) A desktop-only application
ANSWER: B
EXPLAIN: An embedded system is a combination of hardware and software designed to perform a specific dedicated function, often under real-time constraints, as part of a larger device (e.g. a washing machine controller).
DIFFICULTY: easy
MARKS: 12

Q: In an embedded system's memory architecture, what is the key difference between RAM and ROM?
A) RAM is non-volatile; ROM is volatile
B) RAM is volatile (loses data on power-off) and used for temporary storage/execution; ROM is non-volatile and typically holds firmware/boot code
C) Both RAM and ROM store the exact same type of data
D) ROM is always larger than RAM
ANSWER: B
EXPLAIN: RAM is volatile memory used for runtime data and variables, losing its contents when powered off, while ROM is non-volatile and typically stores firmware or boot code that must persist without power.
DIFFICULTY: medium
MARKS: 8

Q: What is the "Round Robin" architecture in embedded system scheduling?
A) A scheduling approach where each task in a loop is given a fixed time slice before moving to the next, cycling continuously through all tasks
B) A single task that runs forever with no interruption
C) A method that only works with interrupt-driven systems
D) A memory allocation strategy
ANSWER: A
EXPLAIN: Round Robin is a simple scheduling architecture where the main loop cycles through each task in turn, giving each a slice of processor time before moving to the next, repeating continuously.
DIFFICULTY: medium
MARKS: 12

Q: What is the primary function of DMA (Direct Memory Access) in an embedded system?
A) To let peripherals transfer data to/from memory directly without continuous CPU intervention, freeing the CPU for other tasks
B) To permanently store the operating system
C) To increase the clock speed of the CPU
D) To manage user interface rendering
ANSWER: A
EXPLAIN: DMA allows peripheral devices to read/write memory directly without the CPU manually copying every byte, significantly reducing CPU overhead during large data transfers (e.g. from a disk or ADC).
DIFFICULTY: medium
MARKS: 8

Q: What is the purpose of a watchdog timer in embedded systems?
A) To display the current time to the user
B) To automatically reset the system if the software fails to periodically "kick" (reset) it, guarding against software hangs/crashes
C) To measure ambient temperature
D) To manage network latency
ANSWER: B
EXPLAIN: A watchdog timer is a hardware timer that resets the system if the running software fails to periodically reset ("kick") it in time, acting as a safety net against software lockups or infinite loops.
DIFFICULTY: medium
MARKS: 4

Q: In interrupt processing on a microprocessor, what is the primary purpose of an interrupt?
A) To slow down instruction execution deliberately
B) To let a hardware or software event pause normal program execution so the CPU can respond to it promptly via an interrupt service routine (ISR)
C) To permanently halt the CPU
D) To reformat the storage device
ANSWER: B
EXPLAIN: An interrupt lets an external event (hardware or software) signal the CPU to temporarily suspend normal execution and run a dedicated interrupt service routine (ISR) to handle that event, then resume where it left off.
DIFFICULTY: medium
MARKS: 8

Q: What tool is typically used to trace and identify runtime errors (e.g. incorrect variable values, logic flow) in embedded software during development?
A) A linker
B) A debugger
C) A watchdog timer
D) A DMA controller
ANSWER: B
EXPLAIN: A debugger lets developers step through code execution, inspect variable states, and set breakpoints, making it the primary tool for tracing and diagnosing runtime errors during embedded software development.
DIFFICULTY: easy
MARKS: 4
