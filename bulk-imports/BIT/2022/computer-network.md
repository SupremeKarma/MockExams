Q: A company is granted a site address 201.70.64.0 with a subnet mask that needs six subnets. Which subnetting concept determines how many host bits must be borrowed?
A) CIDR notation
B) Subnet mask / CIDR-based subnetting
C) NAT translation
D) ARP resolution
ANSWER: B
EXPLAIN: To create 6 subnets from a site address you borrow enough bits from the host portion (using CIDR/subnet mask design) so that 2^n >= 6, then recompute subnet address, host range, and broadcast address for each subnet.
DIFFICULTY: medium
MARKS: 8

Q: Which error detection method uses polynomial (generator) division, such as with a divisor like x^4+x+1?
A) Parity check
B) Checksum
C) Cyclic Redundancy Check (CRC)
D) Hamming code
ANSWER: C
EXPLAIN: CRC appends a remainder computed by dividing the data (treated as a polynomial) by a generator polynomial; the receiver redoes the division to detect transmission errors.
DIFFICULTY: medium
MARKS: 8

Q: Which congestion control algorithm allows bursty input but sends data out at a fixed, constant rate?
A) Token bucket algorithm
B) Leaky bucket algorithm
C) Sliding window algorithm
D) Go-Back-N algorithm
ANSWER: B
EXPLAIN: The leaky bucket algorithm smooths bursty traffic by queuing incoming packets and releasing them onto the network at a constant rate, like water leaking from a hole in a bucket.
DIFFICULTY: medium
MARKS: 6

Q: Which congestion control algorithm allows some burstiness in output by accumulating "tokens" over time, unlike the leaky bucket?
A) Sliding window algorithm
B) Leaky bucket algorithm
C) Token bucket algorithm
D) Stop-and-wait algorithm
ANSWER: C
EXPLAIN: The token bucket algorithm generates tokens at a fixed rate; a packet can only be sent if a token is available, but unused tokens accumulate up to a limit, allowing controlled bursts.
DIFFICULTY: medium
MARKS: 6

Q: Which transmission mode requires start and stop bits to frame each character, with no shared clock between sender and receiver?
A) Synchronous transmission
B) Asynchronous transmission
C) Isochronous transmission
D) Simplex transmission
ANSWER: B
EXPLAIN: Asynchronous transmission sends characters independently, each wrapped with start/stop bits so the receiver can resynchronize per character, avoiding the need for a shared clock signal.
DIFFICULTY: easy
MARKS: 5

Q: Which framing protocol used by PPP marks the start and end of a frame using the flag byte 01111110, and uses byte stuffing for escaping?
A) Ethernet framing
B) HDLC (High-level Data Link Control)
C) Token Ring
D) X.25
ANSWER: B
EXPLAIN: PPP's framing is derived from HDLC, which uses the 0x7E flag byte to delimit frames and byte stuffing to escape any occurrence of the flag pattern within the payload.
DIFFICULTY: medium
MARKS: 8

Q: Which retransmission strategy retransmits only the specific frames that were lost or corrupted, rather than the whole window?
A) Go-Back-N ARQ
B) Selective Repeat ARQ
C) Stop-and-Wait ARQ
D) Idle RQ
ANSWER: B
EXPLAIN: Selective Repeat ARQ buffers out-of-order correctly received frames and only requests retransmission of the specific missing/corrupted frame, unlike Go-Back-N which resends the whole window.
DIFFICULTY: medium
MARKS: 8

Q: What is the primary role of SNMP (Simple Network Management Protocol) in a network?
A) Routing packets between autonomous systems
B) Monitoring and managing network devices and their status
C) Encrypting application-layer data
D) Assigning IP addresses dynamically
ANSWER: B
EXPLAIN: SNMP is an application-layer protocol used by network management systems to monitor, configure, and collect status/performance information from managed devices like routers and switches.
DIFFICULTY: easy
MARKS: 6

Q: Which protocol creates a secure, encrypted tunnel over a public network to connect remote sites or users as if on a private network?
A) VPN (Virtual Private Network)
B) FTP
C) DHCP
D) ICMP
ANSWER: A
EXPLAIN: A VPN establishes an encrypted tunnel across a public network (like the internet), giving remote users or sites secure, private connectivity as though they were on the same local network.
DIFFICULTY: easy
MARKS: 6

Q: In TCP's connection setup, what is the purpose of the "3-way handshake" (SYN, SYN-ACK, ACK)?
A) To compress data before transmission
B) To reliably establish a synchronized connection between client and server before data transfer
C) To encrypt the session key
D) To choose the fastest network route
ANSWER: B
EXPLAIN: The three-way handshake lets both sides exchange and acknowledge initial sequence numbers, confirming both are ready to communicate reliably before any application data is sent.
DIFFICULTY: medium
MARKS: 4

Q: Which cryptographic approach uses the SAME key for both encryption and decryption?
A) Asymmetric cryptography
B) Symmetric cryptography
C) Hashing
D) Digital signatures
ANSWER: B
EXPLAIN: Symmetric cryptography (e.g. AES, DES) uses one shared secret key for both encrypting and decrypting data, requiring the key to be securely distributed between parties in advance.
DIFFICULTY: easy
MARKS: 4
