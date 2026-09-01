Q: What is "signal modulation" in data communication?
A) The process of permanently deleting a signal
B) The process of varying a property (amplitude, frequency, or phase) of a carrier signal to encode information for transmission over a medium
C) A method for physically repairing damaged cables
D) A synonym for data encryption
ANSWER: B
EXPLAIN: Modulation encodes information onto a carrier wave by systematically varying one of its properties — amplitude (AM), frequency (FM), or phase (PM) — so the modified signal can be transmitted efficiently over a communication channel and later demodulated to recover the original data.
DIFFICULTY: easy
MARKS: 2

Q: What is the key difference between Amplitude Modulation (AM) and Frequency Modulation (FM)?
A) AM varies the carrier signal's amplitude to encode data; FM varies the carrier signal's frequency to encode data, while amplitude stays constant
B) They are identical techniques with different names
C) FM cannot be used for audio transmission
D) AM always has better noise immunity than FM
ANSWER: A
EXPLAIN: In AM, the information is encoded by varying the amplitude (strength) of the carrier wave while its frequency stays fixed; in FM, the information is encoded by varying the carrier's frequency while its amplitude stays constant — FM generally offers better noise immunity since noise mostly affects amplitude.
DIFFICULTY: medium
MARKS: 10

Q: Why does error occur during data transmission over a network?
A) Errors never occur in digital transmission
B) Physical factors like electrical noise, signal attenuation, interference, and hardware faults can corrupt bits during transmission, flipping 0s to 1s or vice versa
C) Errors only occur due to software bugs, never hardware issues
D) Errors are intentionally introduced by the sender
ANSWER: B
EXPLAIN: Data transmission errors typically arise from physical-layer issues — electrical/electromagnetic noise, signal attenuation over distance, interference from other signals, or faulty hardware — any of which can flip transmitted bits, which is why error-detection mechanisms like CRC are used.
DIFFICULTY: medium
MARKS: 2

Q: What is the purpose of a Cyclic Redundancy Check (CRC) in data communication?
A) To compress the data being transmitted
B) To detect errors introduced during transmission by appending a checksum (computed via polynomial division) to the data, which the receiver can verify against
C) To encrypt the data for confidentiality
D) To permanently correct any transmission error automatically
ANSWER: B
EXPLAIN: CRC generates a checksum by treating the data as a binary polynomial and dividing it by a fixed generator polynomial, appending the remainder to the transmitted data. The receiver performs the same division; a non-zero remainder indicates the data was corrupted during transmission.
DIFFICULTY: medium
MARKS: 10

Q: What is the function of a routing protocol in a computer network?
A) To determine the best path for forwarding data packets from a source to a destination across a network
B) To encrypt data traveling through the network
C) To permanently store all network data
D) To assign IP addresses to devices exclusively
ANSWER: A
EXPLAIN: A routing protocol's job is to determine and maintain the optimal path(s) that data packets should take to travel from source to destination across a network, using algorithms that account for factors like hop count, bandwidth, or link cost.
DIFFICULTY: easy
MARKS: 2

Q: What is the key difference between adaptive and non-adaptive routing?
A) Adaptive routing dynamically adjusts routing decisions based on current network conditions (e.g. traffic, topology changes); non-adaptive (static) routing uses fixed, pre-determined routes regardless of current conditions
B) They are identical approaches
C) Non-adaptive routing always outperforms adaptive routing
D) Adaptive routing requires no routing table at all
ANSWER: A
EXPLAIN: Adaptive (dynamic) routing protocols continuously monitor network conditions and adjust their routing decisions in response to changes like congestion or link failures; non-adaptive (static) routing uses fixed routes configured in advance that do not automatically change with network conditions.
DIFFICULTY: medium
MARKS: 4

Q: What is the key difference between distance-vector and link-state routing protocols?
A) Distance-vector protocols share only their own routing table (distance estimates) with directly connected neighbors; link-state protocols share complete topology information with all routers in the network, each building its own full map
B) They are functionally identical
C) Link-state protocols never use any algorithm to compute paths
D) Distance-vector protocols always converge faster than link-state protocols
ANSWER: A
EXPLAIN: Distance-vector protocols (like RIP) have each router share its own distance estimates to destinations with immediate neighbors only ("routing by rumor"), while link-state protocols (like OSPF) have each router flood complete link-state information across the network, letting every router independently compute the shortest paths using a full topology map.
DIFFICULTY: hard
MARKS: 6

Q: What is NAT (Network Address Translation), and how does it work?
A) A protocol for encrypting network traffic
B) A technique that translates private, internal IP addresses to a public IP address (and back) as traffic passes through a router, allowing multiple internal devices to share one public IP for internet access
C) A method for permanently blocking internet access
D) A synonym for DNS resolution
ANSWER: B
EXPLAIN: NAT allows a router to map multiple devices' private internal IP addresses to a single public IP address (often using different port numbers to distinguish sessions) when communicating with the internet, conserving public IPv4 addresses and adding a layer of network address privacy.
DIFFICULTY: medium
MARKS: 5

Q: What is the key difference between circuit switching and packet switching?
A) Circuit switching establishes a dedicated communication path for the entire session before data transfer begins; packet switching breaks data into independent packets that may take different paths and get reassembled at the destination
B) They are identical switching techniques
C) Packet switching requires a dedicated physical circuit for the whole call
D) Circuit switching is used exclusively for internet data today
ANSWER: A
EXPLAIN: Circuit switching (used in traditional telephone networks) reserves a dedicated end-to-end path for the full duration of a communication session; packet switching (used in the internet) splits data into packets that are routed independently and can take different paths, being reassembled at the destination — more efficient for bursty data traffic.
DIFFICULTY: medium
MARKS: 6

Q: What is the primary function of DNS (Domain Name System)?
A) To encrypt web traffic
B) To translate human-readable domain names (like "example.com") into the numeric IP addresses that computers use to identify each other on a network
C) To assign MAC addresses to network cards
D) To physically route electrical signals through cables
ANSWER: B
EXPLAIN: DNS acts as the internet's "phone book," resolving human-friendly domain names into the numeric IP addresses required for computers to locate and communicate with each other, through a hierarchical system of DNS servers.
DIFFICULTY: easy
MARKS: 8

Q: What is the key difference between symmetric and asymmetric key encryption?
A) Symmetric encryption uses the same single key for both encryption and decryption; asymmetric encryption uses a mathematically related key pair — a public key for encryption and a private key for decryption
B) They are the exact same technique
C) Asymmetric encryption never requires any key at all
D) Symmetric encryption is always less secure regardless of key length
ANSWER: A
EXPLAIN: Symmetric encryption (e.g. AES) uses one shared secret key for both encrypting and decrypting data, requiring secure key distribution between parties; asymmetric encryption (e.g. RSA) uses a public/private key pair, where data encrypted with the public key can only be decrypted with the corresponding private key, simplifying secure key exchange.
DIFFICULTY: medium
MARKS: 7
