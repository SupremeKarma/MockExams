import type { SemesterNotesData } from "./bitNotesData";

/**
 * Purbanchal University — Faculty of Science & Technology
 * Bachelor in Information Technology (BIT)
 * Year IV, Semester I (Semester 7) Official Study Notes Database
 *
 * FULL UNIT-WISE & TOPIC-WISE SYLLABUS ALIGNMENT:
 * Every course is organized strictly by official syllabus Units and sub-topics,
 * featuring theoretical foundations, key examination points, practical implementation/code,
 * worked case examples, and authentic university past paper examination questions.
 */
export const semester7NotesData: SemesterNotesData = {
  "Network Programming": {
    subjectName: "Network Programming",
    code: "BIT401CO",
    creditHours: 3,
    topics: [
      {
        id: "np-u1-intro-client-server",
        name: "Client/Server Architecture, Protocol Suites & Network Utilities",
        unit: 1,
        unitTitle: "Unit 1: Introduction to Network Programming",
        unitCode: "1.1",
        importance: "Very High",
        keyPoints: [
          "Client-server model: The server is a passive entity that opens a port and waits for requests; the client is an active entity that initiates communication.",
          "OSI vs TCP/IP: TCP/IP combines OSI Session and Presentation layers into the Application layer, prioritizing pragmatic internetworking over rigid modularity.",
          "Unix Standards: POSIX.1g establishes API standardization for networking; Open Group Single UNIX Specification guarantees cross-platform socket portability.",
          "Essential Network Utilities: netstat (active connections & routing tables), ifconfig/ip (interface configuration), ping (ICMP echo round-trip time), traceroute (TTL expiration probing).",
          "Wrapper functions: Robust network programming wraps system calls with error-checking wrappers (e.g., Socket(), Bind()) to terminate or log cleanly on failure."
        ],
        theory: "Network programming under Unix/Linux systems relies on the BSD Socket API as the standard abstraction for inter-process communication (IPC) across IP networks. In client/server paradigms, servers are classified into iterative (handling one client transaction to completion before accepting another) and concurrent (spawning child processes or worker threads per client). Application protocols operate atop the TCP/IP stack where the 16-bit port number (0-65535) identifies specific host processes (Well-known: 0-1023, Registered: 1024-49151, Dynamic/Private: 49152-65535). POSIX socket wrappers ensure uniform error diagnostics by interrogating errno upon system call failure (-1).",
        code: `// Robust Socket Wrapper Function Pattern in C
int Socket(int family, int type, int protocol) {
    int n;
    if ((n = socket(family, type, protocol)) < 0) {
        perror("socket error");
        exit(EXIT_FAILURE);
    }
    return n;
}`,
        example: "Common Unix utilities: 'netstat -tuln' displays listening TCP/UDP sockets without DNS reverse lookups. 'traceroute host' sends UDP/ICMP packets with increasing TTL (1, 2, 3...) to discover each router hop via ICMP Time Exceeded messages.",
        commonExamQuestions: [
          "[8 Marks] Differentiate between iterative and concurrent servers with architectural diagrams and suitable application examples.",
          "[7 Marks] Explain the role of wrapper functions in network programming. Describe how netstat, ping, and traceroute operate under Unix."
        ]
      },
      {
        id: "np-u2-os-syscalls-ipc",
        name: "Elementary Operating System Calls & IPC Mechanisms",
        unit: 2,
        unitTitle: "Unit 2: Elementary Operating System Calls",
        unitCode: "2.1",
        importance: "Very High",
        keyPoints: [
          "fork() creates an exact duplicate child process with separate memory address space; returns 0 in the child and child PID in parent.",
          "exec() family (execl, execp, execv) replaces the current process image with a new executable file.",
          "wait() and waitpid() allow a parent process to collect child exit status and prevent zombie processes; waitpid with WNOHANG enables non-blocking checks.",
          "Inter-Process Communication (IPC): pipe() provides unidirectional byte streams between related processes; mkfifo() creates named pipes persistent in the filesystem.",
          "Signals (SIGCHLD, SIGINT, SIGIO): Asynchronous notifications from the kernel; SIGCHLD must be handled to reap terminated child servers."
        ],
        theory: "Operating systems execute concurrent server tasks by decoupling network listener loops from individual client sessions. When fork() is called, the kernel clones file descriptor tables, incrementing reference counts on open sockets. To avoid descriptor leaks, the parent process immediately closes the connected socket descriptor (connfd), while the child closes the listening socket descriptor (listenfd). When a child finishes, it becomes a 'zombie' until the parent calls wait() or waitpid(). Installing a signal handler for SIGCHLD prevents zombie accumulation in high-concurrency production daemons.",
        code: `#include <signal.h>
#include <sys/wait.h>

void sig_chld(int signo) {
    pid_t pid;
    int stat;
    // Non-blocking wait loop to reap all terminated children
    while ((pid = waitpid(-1, &stat, WNOHANG)) > 0) {
        // Child reaped cleanly
    }
}
// In main():
signal(SIGCHLD, sig_chld);`,
        example: "Creating an IPC pipe: int fd[2]; pipe(fd); where fd[0] is the read end and fd[1] is the write end. Fifos (named pipes) created via mkfifo('/tmp/myfifo', 0666) allow unrelated processes to communicate.",
        commonExamQuestions: [
          "[10 Marks] Explain fork(), exec(), and waitpid() system calls. How does an asynchronous SIGCHLD signal handler prevent zombie processes?",
          "[5 Marks] Differentiate between anonymous pipes (pipe) and named pipes (FIFO) in Unix IPC."
        ]
      },
      {
        id: "np-u3-transport-protocols",
        name: "TCP/UDP Transport Protocols & TCP State Transitions",
        unit: 3,
        unitTitle: "Unit 3: TCP/UDP Transport Layer Protocols",
        unitCode: "3.1",
        importance: "Very High",
        keyPoints: [
          "TCP (Transmission Control Protocol) is connection-oriented, reliable, byte-stream oriented, and features flow/congestion control.",
          "UDP (User Datagram Protocol) is connectionless, unreliable, message-oriented, with zero handshake latency.",
          "TCP 3-Way Handshake: SYN (seq=x) -> SYN-ACK (seq=y, ack=x+1) -> ACK (ack=y+1).",
          "TCP 4-Way Teardown: FIN -> ACK -> FIN -> ACK; initiating endpoint enters TIME_WAIT state.",
          "TIME_WAIT duration is 2 * MSL (Maximum Segment Lifetime, typically 1 to 4 minutes) to allow lagging duplicate segments to expire and ensure the final ACK arrives."
        ],
        theory: "The Transport Layer mediates communication between host applications. TCP provides full-duplex byte streams, sequencing, and acknowledgment mechanisms. The TCP state machine governs connection lifecycles: LISTEN -> SYN_RCVD -> ESTABLISHED -> FIN_WAIT_1 -> FIN_WAIT_2 -> TIME_WAIT -> CLOSED. The TIME_WAIT state prevents delayed duplicate packets from a previous connection from corrupting a new connection re-using the same 4-tuple (source IP, source port, dest IP, dest port). UDP avoids protocol overhead, making it ideal for DNS queries, real-time media streaming (RTP), and telemetry.",
        code: `/*
TCP State Machine Summary:
Client                 Server
  |                      | (LISTEN)
  |------- SYN --------->| (SYN_RCVD)
  |<---- SYN + ACK ------|
  |------- ACK --------->| (ESTABLISHED)
  |                      |
  |------- FIN --------->| (CLOSE_WAIT)
  |<------ ACK ----------|
  |<------ FIN ----------| (LAST_ACK)
  |------- ACK --------->| (CLOSED)
(TIME_WAIT: 2MSL)
*/`,
        example: "A web browser downloading a webpage creates a TCP connection. If the client closes the connection, the client enters TIME_WAIT. Attempting to immediately restart a local server on the same port fails with EADDRINUSE unless SO_REUSEADDR is specified.",
        commonExamQuestions: [
          "[10 Marks] Draw and thoroughly explain the TCP Connection Establishment (3-way handshake) and Connection Termination (4-way handshake) with packet headers.",
          "[5 Marks] What is the necessity of the TIME_WAIT state in TCP? Why is its duration set to 2MSL?"
        ]
      },
      {
        id: "np-u4-socket-calls",
        name: "Socket Address Structures, Endianness & Address Conversion",
        unit: 4,
        unitTitle: "Unit 4: Elementary Socket Calls",
        unitCode: "4.1",
        importance: "High",
        keyPoints: [
          "struct sockaddr_in represents IPv4 socket addresses: sin_family (AF_INET), sin_port (in_port_t), sin_addr (struct in_addr).",
          "struct sockaddr is the generic socket address structure used as a cast target in socket system calls.",
          "Byte ordering: Network Byte Order is Big-Endian; Host Byte Order may be Little-Endian (x86) or Big-Endian.",
          "Endian conversion functions: htons() (host to network short), htonl() (host to network long), ntohs(), ntohl().",
          "Address conversion: inet_pton() (presentation to numeric) and inet_ntop() (numeric to presentation) support both IPv4 and IPv6."
        ],
        theory: "Because networks interconnect heterogeneous processor architectures, internet protocols standardize on Big-Endian (most significant byte transmitted first). Socket addresses must convert 16-bit port numbers and 32-bit IP addresses into network byte order before invoking bind() or connect(). In C, socket system calls take pointer arguments of type 'struct sockaddr *' along with a socklen_t length parameter. For functions where the kernel returns an address (accept(), getsockname(), recvfrom()), the length argument is a value-result pointer that passes the buffer capacity on entry and receives the actual byte count on return.",
        code: `#include <netinet/in.h>
#include <arpa/inet.h>

struct sockaddr_in servaddr;
memset(&servaddr, 0, sizeof(servaddr));
servaddr.sin_family = AF_INET;
servaddr.sin_port = htons(8080); // Host to Network Short
inet_pton(AF_INET, "192.168.1.100", &servaddr.sin_addr); // Presentation to Network Numeric`,
        example: "Converting an IPv4 string to binary network format using inet_pton(AF_INET, '127.0.0.1', &addr.sin_addr). To convert back for printing: char str[INET_ADDRSTRLEN]; inet_ntop(AF_INET, &addr.sin_addr, str, sizeof(str));",
        commonExamQuestions: [
          "[7 Marks] Explain IPv4 socket address structure (sockaddr_in) and generic socket address structure (sockaddr). What is a value-result argument?",
          "[5 Marks] Differentiate between Little-Endian and Big-Endian byte orders. Why are htons() and ntohs() necessary?"
        ]
      },
      {
        id: "np-u5-tcp-udp-sockets",
        name: "Elementary TCP & UDP Sockets: System Call Lifecycles",
        unit: 5,
        unitTitle: "Unit 5: Elementary TCP-UDP Socket",
        unitCode: "5.1",
        importance: "Very High",
        keyPoints: [
          "TCP Server Call Sequence: socket() -> bind() -> listen() -> accept() -> read()/write() -> close().",
          "TCP Client Call Sequence: socket() -> connect() -> write()/read() -> close().",
          "listen(sockfd, backlog): Backlog specifies the maximum length of completed and incomplete connection queues.",
          "accept() blocks until a completed 3-way handshake arrives, returning a new connected socket descriptor.",
          "UDP Sockets use sendto() and recvfrom() without listen() or accept(); each packet specifies the destination sockaddr."
        ],
        theory: "TCP and UDP sockets present distinct paradigms. Stream sockets (SOCK_STREAM) provide reliable byte-stream channels requiring explicit connection setup. The listening socket descriptor (listenfd) serves solely as a connection receptionist, while accept() yields a connected descriptor (connfd) for per-client data exchange. In contrast, Datagram sockets (SOCK_DGRAM) are connectionless. A single UDP socket can exchange datagrams with multiple distinct endpoints using recvfrom() and sendto(), which encapsulate destination addressing directly in the payload header.",
        code: `// Concurrent TCP Echo Server in C
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>

int main() {
    int listenfd = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in servaddr;
    servaddr.sin_family = AF_INET;
    servaddr.sin_addr.s_addr = htonl(INADDR_ANY);
    servaddr.sin_port = htons(9000);

    bind(listenfd, (struct sockaddr *)&servaddr, sizeof(servaddr));
    listen(listenfd, 10);

    while (1) {
        struct sockaddr_in cliaddr;
        socklen_t clilen = sizeof(cliaddr);
        int connfd = accept(listenfd, (struct sockaddr *)&cliaddr, &clilen);
        if (fork() == 0) { // Child process
            close(listenfd);
            char buf[1024];
            int n = read(connfd, buf, sizeof(buf));
            write(connfd, buf, n); // Echo
            close(connfd);
            exit(0);
        }
        close(connfd); // Parent closes connected socket
    }
    return 0;
}`,
        example: "UDP Echo Client call pattern: socket(AF_INET, SOCK_DGRAM, 0) followed by sendto(sockfd, buf, len, 0, (struct sockaddr *)&servaddr, sizeof(servaddr)) and recvfrom(sockfd, buf, len, 0, NULL, NULL).",
        commonExamQuestions: [
          "[10 Marks] Write a complete C program to implement a concurrent TCP daytime/echo server using socket(), bind(), listen(), accept(), and fork().",
          "[6 Marks] Compare TCP socket functions with UDP socket functions (sendto/recvfrom vs write/read)."
        ]
      },
      {
        id: "np-u6-io-multiplexing",
        name: "I/O Multiplexing: select(), poll() & Non-Blocking Sockets",
        unit: 6,
        unitTitle: "Unit 6: I/O Multiplexing",
        unitCode: "6.1",
        importance: "Very High",
        keyPoints: [
          "I/O Multiplexing enables a single process to monitor multiple file and socket descriptors simultaneously without multi-threading overhead.",
          "select() monitors three descriptor sets (read, write, exception) with an optional timeout.",
          "FD manipulation macros: FD_ZERO, FD_SET, FD_CLR, FD_ISSET.",
          "select() limitations: Constrained by FD_SETSIZE (default 1024) and requires O(N) linear scanning of the descriptor set upon return.",
          "poll() replaces bitmasks with an array of struct pollfd (fd, events, revents), removing the FD_SETSIZE limitation."
        ],
        theory: "Traditional blocking I/O causes a single-threaded server to stall indefinitely if an accepted client is idle. Non-blocking I/O with busy-waiting exhausts CPU cycles. I/O multiplexing delegates descriptor monitoring to the kernel. select() blocks until at least one monitored descriptor becomes ready for reading, writing, or encounters an exceptional condition. This pattern forms the core foundation of high-concurrency event-driven network daemons, telnet clients, and proxy forwarders.",
        code: `fd_set read_fds;
struct timeval tv = {5, 0}; // 5-second timeout
FD_ZERO(&read_fds);
FD_SET(listenfd, &read_fds);
FD_SET(STDIN_FILENO, &read_fds);
int max_fd = (listenfd > STDIN_FILENO ? listenfd : STDIN_FILENO) + 1;

int nready = select(max_fd, &read_fds, NULL, NULL, &tv);
if (nready > 0) {
    if (FD_ISSET(listenfd, &read_fds)) {
        // Accept new incoming network connection
    }
    if (FD_ISSET(STDIN_FILENO, &read_fds)) {
        // Read console input from terminal
    }
}`,
        example: "The 5 Unix I/O Models: 1. Blocking I/O, 2. Non-blocking I/O, 3. I/O Multiplexing (select/poll), 4. Signal-driven I/O (SIGIO), and 5. Asynchronous I/O (POSIX aio_read).",
        commonExamQuestions: [
          "[10 Marks] Explain the select() system call, its parameters, fd_set manipulation macros, and limitations compared to poll().",
          "[6 Marks] Differentiate between close() and shutdown() system calls. Discuss SHUT_RD, SHUT_WR, and SHUT_RDWR."
        ]
      },
      {
        id: "np-u7-socket-options",
        name: "Socket Options: getsockopt(), setsockopt() & SO_REUSEADDR",
        unit: 7,
        unitTitle: "Unit 7: Socket Options",
        unitCode: "7.1",
        importance: "High",
        keyPoints: [
          "Socket options are inspected and configured using getsockopt() and setsockopt() at SOL_SOCKET, IPPROTO_IP, or IPPROTO_TCP levels.",
          "SO_REUSEADDR permits a server to bind to an IP/port currently in the TIME_WAIT state.",
          "SO_KEEPALIVE periodically probes idle TCP connections to detect severed client links.",
          "SO_RCVBUF and SO_SNDBUF set transport socket buffer capacities to optimize throughput over high-bandwidth-delay product paths.",
          "TCP_NODELAY disables Nagle's algorithm to eliminate latency for interactive or packet-sensitive real-time traffic."
        ],
        theory: "Socket options modify transport layer behaviors. When a TCP server terminates abruptly while active client connections exist, the local socket enters the TIME_WAIT state for 2MSL. If the server restarts immediately, bind() fails with EADDRINUSE. Enabling SO_REUSEADDR signals the kernel to permit socket rebinding. Similarly, Nagle's algorithm coalesces small packets to optimize network bandwidth, but introduces unwanted delay in interactive protocols; setting TCP_NODELAY forces immediate segment transmission.",
        code: `// Enable SO_REUSEADDR on listening socket
int on = 1;
setsockopt(listenfd, SOL_SOCKET, SO_REUSEADDR, &on, sizeof(on));

// Disable Nagle's algorithm for low-latency transmission
int nodelay = 1;
setsockopt(connfd, IPPROTO_TCP, TCP_NODELAY, &nodelay, sizeof(nodelay));`,
        example: "Retrieving TCP send buffer size: int val; socklen_t len = sizeof(val); getsockopt(sockfd, SOL_SOCKET, SO_SNDBUF, &val, &len);",
        commonExamQuestions: [
          "[8 Marks] Explain the purpose of getsockopt() and setsockopt(). Discuss SO_REUSEADDR, SO_KEEPALIVE, and TCP_NODELAY with code snippets.",
          "[4 Marks] What is Nagle's algorithm? In which scenarios should it be disabled using TCP_NODELAY?"
        ]
      },
      {
        id: "np-u8-name-address",
        name: "Name and Address Conversion: DNS Resolution & getaddrinfo()",
        unit: 8,
        unitTitle: "Unit 8: Name and Address Conversion",
        unitCode: "8.1",
        importance: "High",
        keyPoints: [
          "Domain Name System (DNS) maps human-readable hostnames to binary IP addresses.",
          "Legacy functions gethostbyname() and gethostbyaddr() are obsolete and non-reentrant.",
          "getaddrinfo() provides modern protocol-independent, thread-safe name-to-address resolution supporting both IPv4 and IPv6.",
          "freeaddrinfo() frees the linked list of struct addrinfo dynamically allocated by getaddrinfo().",
          "gai_strerror() converts getaddrinfo error return codes into descriptive error strings."
        ],
        theory: "Hardcoding IP addresses in client-server programs compromises architectural flexibility and breaks IPv4/IPv6 portability. getaddrinfo() accepts a hostname, a service name (e.g., 'http' or '80'), and an optional hints structure specifying criteria such as socket type (SOCK_STREAM). It queries DNS and /etc/hosts, returning a linked list of addrinfo structures containing valid sockaddr pointers ready for direct invocation with socket() and connect(). This protocol-independent design enables seamless migration to IPv6.",
        code: `struct addrinfo hints, *res, *p;
memset(&hints, 0, sizeof(hints));
hints.ai_family = AF_UNSPEC; // IPv4 or IPv6
hints.ai_socktype = SOCK_STREAM;

int status = getaddrinfo("www.purbanchaluniversity.edu.np", "80", &hints, &res);
if (status != 0) {
    fprintf(stderr, "getaddrinfo: %s\\n", gai_strerror(status));
    exit(1);
}
// Iterate linked list and connect
for (p = res; p != NULL; p = p->ai_next) {
    int sfd = socket(p->ai_family, p->ai_socktype, p->ai_protocol);
    if (connect(sfd, p->ai_addr, p->ai_addrlen) == 0) break; // Connected!
    close(sfd);
}
freeaddrinfo(res);`,
        example: "Resolving 'localhost' and service 'http' returns 127.0.0.1 (IPv4) and ::1 (IPv6) sockaddr records.",
        commonExamQuestions: [
          "[8 Marks] Explain getaddrinfo(), freeaddrinfo(), and gai_strerror(). Why are they preferred over gethostbyname()?",
          "[5 Marks] Write a C program to resolve a given domain name to its corresponding IP address using getaddrinfo()."
        ]
      },
      {
        id: "np-u9-unix-domain",
        name: "Unix Domain Protocols: Local Socket IPC & Descriptor Passing",
        unit: 9,
        unitTitle: "Unit 9: Unix Domain Protocol",
        unitCode: "9.1",
        importance: "Medium",
        keyPoints: [
          "Unix Domain Sockets (AF_LOCAL or AF_UNIX) provide high-performance inter-process communication on the same physical host.",
          "Uses struct sockaddr_un containing sun_family (AF_LOCAL) and sun_path (filesystem pathname).",
          "Bypasses the entire TCP/IP network protocol stack, avoiding checksum calculation and IP routing overhead.",
          "socketpair() creates an unnamed pair of connected bidirectional Unix domain sockets with a single system call.",
          "Unix domain sockets uniquely support passing open file descriptors between unrelated processes via sendmsg() and recvmsg()."
        ],
        theory: "When client and server processes reside on the same Unix machine, communicating over loopback (127.0.0.1) incurs unnecessary network stack processing. Unix domain sockets use standard socket semantics but route data directly through kernel buffers using a designated filesystem path as the rendezvous point. Binding creates a socket file on disk (mode 's'). Additionally, sendmsg() with ancillary data (SCM_RIGHTS) allows a privileged master process to open a file or network socket and securely hand the open descriptor to an unprivileged worker child.",
        code: `#include <sys/socket.h>
#include <sys/un.h>

// socketpair creates two connected bi-directional sockets
int sv[2];
if (socketpair(AF_LOCAL, SOCK_STREAM, 0, sv) < 0) {
    perror("socketpair");
}
// sv[0] and sv[1] can now read/write to each other across processes`,
        example: "Binding a Unix domain server: struct sockaddr_un addr; addr.sun_family = AF_LOCAL; strncpy(addr.sun_path, '/tmp/app.sock', sizeof(addr.sun_path)-1); unlink('/tmp/app.sock'); bind(fd, (struct sockaddr *)&addr, sizeof(addr));",
        commonExamQuestions: [
          "[7 Marks] What are Unix Domain Sockets? Explain the structure sockaddr_un and how socketpair() creates bidirectional IPC channels.",
          "[5 Marks] Explain the mechanism of passing file descriptors across processes using Unix domain sockets."
        ]
      },
      {
        id: "np-u10-daemon-inetd",
        name: "Daemon Processes, Syslog Facility & inetd Superservers",
        unit: 10,
        unitTitle: "Unit 10: Daemon Processes, Inetd Superservers",
        unitCode: "10.1",
        importance: "High",
        keyPoints: [
          "A daemon is a background process with no controlling terminal, typically running continuously to provide system services.",
          "Daemonizing steps: fork() and exit parent, setsid() to create a new session, change working directory to root '/', umask(0), and redirect stdin/stdout/stderr to /dev/null.",
          "Syslog facility: Daemons report errors using openlog(), syslog(LOG_ERR, ...), and closelog(), routing messages to /var/log/syslog via syslogd.",
          "inetd superserver: A single master daemon that listens on multiple ports listed in /etc/inetd.conf and forks the appropriate service daemon on demand.",
          "Advantages of inetd: Conserves system memory and process table slots by launching servers only when connection requests arrive."
        ],
        theory: "Server software running in enterprise environments must dissociate from user sessions so that terminal logout does not trigger SIGHUP and terminate the service. The daemon_init sequence detaches the process, guarantees it is not a session leader, and establishes independent process groups. Because daemons lack a console, POSIX provides the syslog interface. The inetd (and modern systemd) superserver architecture prevents hundreds of rarely-used services from idling in memory, instead maintaining listening sockets on their behalf and executing the actual server binary via exec() upon connection arrival.",
        code: `void daemon_init(void) {
    pid_t pid;
    if ((pid = fork()) < 0) exit(1);
    else if (pid != 0) exit(0); // Terminate parent

    setsid(); // Become session leader
    chdir("/"); // Prevent unmounting directory
    umask(0);

    close(STDIN_FILENO);
    close(STDOUT_FILENO);
    close(STDERR_FILENO);
    open("/dev/null", O_RDWR); // fd 0
    dup(0); // fd 1
    dup(0); // fd 2
}`,
        example: "Sending a log message from a network daemon: openlog('my_daemon', LOG_PID, LOG_DAEMON); syslog(LOG_NOTICE, 'Server started on port %d', 8080); closelog();",
        commonExamQuestions: [
          "[8 Marks] Explain the step-by-step procedure to daemonize a network process under Unix/Linux with an annotated code implementation.",
          "[5 Marks] Discuss the working mechanism and advantages of the inetd superserver with reference to /etc/inetd.conf."
        ]
      },
      {
        id: "np-u11-broadcast-multicast",
        name: "Broadcast & Multicast Socket Programming",
        unit: 11,
        unitTitle: "Unit 11: Broadcast and Multicast",
        unitCode: "11.1",
        importance: "Medium",
        keyPoints: [
          "Unicast transmits packets to a single destination host; Broadcast transmits to all hosts on a local subnet; Multicast transmits to an interested group.",
          "Broadcast addresses: Limited broadcast (255.255.255.255) and subnet-directed broadcast (e.g., 192.168.1.255).",
          "SO_BROADCAST socket option must be explicitly enabled using setsockopt() to permit broadcast transmission.",
          "IPv4 Multicast uses Class D addresses (224.0.0.0 to 239.255.255.255); managed dynamically by IGMP (Internet Group Management Protocol).",
          "Joining a multicast group uses setsockopt() with IP_ADD_MEMBERSHIP and struct ip_mreq."
        ],
        theory: "Broadcast sends datagrams to every host on a subnet, forcing non-interested hosts to process interrupts and examine packets up to the transport layer before discarding them. Multicasting remedies this by assigning a Class D multicast IP mapped to Ethernet multicast MAC addresses (01:00:5e:xx:xx:xx). Network interface cards (NICs) filter out irrelevant multicast packets in hardware. Applications join a multicast group by passing struct ip_mreq to setsockopt(), allowing routers and local switches to prune transmission trees.",
        code: `// Enable Broadcasting
int on = 1;
setsockopt(sockfd, SOL_SOCKET, SO_BROADCAST, &on, sizeof(on));

// Join Multicast Group
struct ip_mreq mreq;
inet_pton(AF_INET, "239.255.0.1", &mreq.imr_multiaddr.s_addr);
mreq.imr_interface.s_addr = htonl(INADDR_ANY);
setsockopt(sockfd, IPPROTO_IP, IP_ADD_MEMBERSHIP, &mreq, sizeof(mreq));`,
        example: "NTP (Network Time Protocol) and service discovery protocols (SSDP/mDNS) use multicasting to advertise server presence without flooding the entire subnet.",
        commonExamQuestions: [
          "[8 Marks] Compare Unicast, Broadcast, and Multicast communication. Explain how a process joins a multicast group in C.",
          "[5 Marks] Why is the SO_BROADCAST socket option required? What are the security and bandwidth implications of broadcast storms?"
        ]
      },
      {
        id: "np-u12-raw-sockets-ping",
        name: "IP Layers, Raw Sockets & ICMP Ping Implementation",
        unit: 12,
        unitTitle: "Unit 12: IP Layers and Raw Socket",
        unitCode: "12.1",
        importance: "High",
        keyPoints: [
          "Raw sockets (SOCK_RAW) bypass transport layer processing, granting direct access to underlying IP and ICMP packets.",
          "Requires root/superuser privileges (CAP_NET_RAW under Linux) to open.",
          "IP_HDRINCL option allows applications to construct and inject custom IP headers rather than relying on kernel generation.",
          "ICMP packet format: Type (8 for Echo Request, 0 for Echo Reply), Code (0), Checksum (16-bit one's complement sum), Identifier, Sequence Number.",
          "Ping utility sends ICMP Echo Requests with timestamps in the payload to calculate round-trip time (RTT)."
        ],
        theory: "Standard stream and datagram sockets abstract away protocol headers. When diagnostic tools like ping or traceroute must generate ICMP packets or when network security tools craft malformed test frames, raw sockets provide unrestricted packet creation capabilities. The socket call socket(AF_INET, SOCK_RAW, IPPROTO_ICMP) instructs the kernel to deliver raw IP packets bearing protocol number 1 directly to the user space process, which parses the IP and ICMP headers manually.",
        code: `struct icmp_hdr {
    uint8_t  type; // 8 for Echo Request
    uint8_t  code; // 0
    uint16_t checksum;
    uint16_t id;
    uint16_t seq;
};

// 16-bit Internet Checksum Algorithm
uint16_t checksum(void *b, int len) {
    uint16_t *buf = b;
    uint32_t sum = 0;
    for (sum = 0; len > 1; len -= 2) sum += *buf++;
    if (len == 1) sum += *(uint8_t *)buf;
    sum = (sum >> 16) + (sum & 0xFFFF);
    sum += (sum >> 16);
    return ~sum;
}`,
        example: "Creating an ICMP Echo Request packet, calculating its checksum, and transmitting it via sendto() directly over a raw socket descriptor.",
        commonExamQuestions: [
          "[10 Marks] What is a raw socket? How does it differ from SOCK_STREAM and SOCK_DGRAM? Explain how ping is implemented using raw sockets.",
          "[5 Marks] Write the standard one's complement checksum algorithm used in ICMP, IP, and TCP packet headers."
        ]
      }
    ],
    theoryTopics: [
      "Explain Unix domain socket address structure (sockaddr_un) and how socketpair() enables bi-directional IPC.",
      "Describe daemon processes and write the steps involved in daemonizing a process using daemon_init().",
      "Compare Unicast, Broadcast, and Multicast communication with IP address classes and socket option requirements.",
      "Explain Elementary UDP socket functions (sendto, recvfrom) and discuss connected UDP sockets."
    ]
  },

  "Digital Governance": {
    subjectName: "Digital Governance",
    code: "BIT402CO",
    creditHours: 3,
    topics: [
      {
        id: "dg-u1-intro-models",
        name: "e-Government Foundations, G2X Delivery Models & Evolution",
        unit: 1,
        unitTitle: "Unit 1: Introduction to e-Government and e-Governance",
        unitCode: "1.1",
        importance: "Very High",
        keyPoints: [
          "e-Government: Utilization of ICT by government agencies to automate administrative operations and deliver public services.",
          "e-Governance: Broader institutional transformation promoting transparency, citizen participation, policymaking, and accountability.",
          "Primary Delivery Models: G2C (Government-to-Citizen), G2B (Government-to-Business), G2G (Government-to-Government), G2E (Government-to-Employee).",
          "Objectives: Eradicating bureaucratic delays, eliminating corruption opportunities, minimizing operational costs, and expanding public access.",
          "Stages of Evolution: Computerization (Internal automation), Networking (Intranet linking), Online Presence (Static web), Interactivity (Two-way transactions)."
        ],
        theory: "Digital governance fundamentally transforms public administration from siloed, bureaucratic paper workflows into integrated, citizen-centric ecosystems. In G2C models, citizens access vital services (birth registration, passport issuance, tax filing) through unified digital portals, dismantling physical queues and reducing petty bribery. G2B models streamline business incorporation, customs clearance, and public e-procurement to enhance economic competitiveness. G2G architectures connect national ministries with local municipalities for coherent policymaking.",
        code: `/*
e-Government Interaction Models Matrix:
Model | Target Beneficiary | Representative Systems
G2C   | General Citizens   | Nagarik App, Online Passport, Driving License
G2B   | Commercial Sector  | e-Procurement (e-GP), Corporate Tax, Customs (ASYCUDA)
G2G   | Public Agencies    | National Enterprise Architecture (NEA), Inter-Ministry Memos
G2E   | Civil Servants     | Personnel Information System (PIS), Pension Fund Automation
*/`,
        example: "In Nepal, the Ministry of Foreign Affairs deployed an online e-Passport booking and tracking platform representing a high-impact G2C implementation.",
        commonExamQuestions: [
          "[8 Marks] Define e-Governance. How does it differ from e-Government? Explain the G2C, G2B, G2G, and G2E delivery models with real-world examples.",
          "[6 Marks] Discuss the primary objectives, benefits, and challenges of digital transformation in public administration."
        ]
      },
      {
        id: "dg-u2-ppp-models",
        name: "Public-Private Partnerships (PPP) in e-Government",
        unit: 2,
        unitTitle: "Unit 2: Public-Private Partnership for e-Government",
        unitCode: "2.1",
        importance: "High",
        keyPoints: [
          "Public-Private Partnership (PPP) leverages private sector technological innovation, agility, and investment to build public digital infrastructure.",
          "PPP Contract Models: Build-Operate-Transfer (BOT), Build-Own-Operate-Transfer (BOOT), Build-Own-Operate (BOO), Design-Build-Finance-Operate (DBFO).",
          "Revenue Models: Transaction fee-based, annuity payments, software licensing, and government viability gap funding.",
          "Risk Allocation: Technological and execution risk assigned to the private partner; political, legal, and sovereign risks borne by the government.",
          "Governance Frameworks: Service Level Agreements (SLAs) with clear Key Performance Indicators (KPIs) regarding uptime, latency, and security."
        ],
        theory: "Governments often lack capital and technical expertise to build complex citizen-facing portals in-house. PPP arrangements mobilize private capital and technological competencies while maintaining public oversight. Under a BOOT concession, the private vendor finances, engineers, and operates the system for a contractual period (e.g., 10-15 years), recovering costs via micro-transaction fees, before transferring the entire asset and intellectual property back to the government.",
        code: `/*
PPP Risk Allocation Architecture:
Risk Domain         | Primary Bearer | Mitigation Mechanism
Technology Obsolesc.| Private Vendor | Periodic hardware/software refresh cycles
Service Downtime    | Private Vendor | Penalty clauses linked to contractual SLA uptime (99.9%)
Regulatory Shifts   | Government     | Sovereign guarantees, stabilization clauses
Data Sovereignty    | Joint          | Mandatory hosting in National GIDC under local laws
*/`,
        example: "India's Passport Seva Project (PSP) represents a landmark PPP between the Ministry of External Affairs and Tata Consultancy Services (TCS), managing hundreds of citizen service centers.",
        commonExamQuestions: [
          "[8 Marks] Explain the concept of Public-Private Partnership (PPP) in e-Government. Compare BOT, BOOT, and BOO implementation models.",
          "[6 Marks] What are the critical risk factors in digital governance PPP contracts? How should Service Level Agreements (SLAs) be structured?"
        ]
      },
      {
        id: "dg-u3-ict-infrastructure-gidc",
        name: "Government ICT Infrastructure & Data Centers (GIDC)",
        unit: 3,
        unitTitle: "Unit 3: ICT Infrastructure for e-Government",
        unitCode: "3.1",
        importance: "Very High",
        keyPoints: [
          "Government Integrated Data Center (GIDC): Centralized secure hosting infrastructure hosting mission-critical government web portals, databases, and apps.",
          "Nepal GIDC operates out of Singha Durbar, Kathmandu, with a Disaster Recovery Center (DRC) in Hetauda.",
          "National Enterprise Architecture (NEA): Standardization framework for cross-agency systems, data schemas, and service bus communication.",
          "Nepal e-Governance Interoperability Framework (NeGIF): Guidelines for metadata standards, XML/JSON schemas, and secure API gateways.",
          "Government Cloud (G-Cloud): Private cloud computing delivering Infrastructure-as-a-Service (IaaS) and Platform-as-a-Service (PaaS) to government entities."
        ],
        theory: "Without shared infrastructure, individual ministries build disjointed, redundant computing silos that fail to interoperate. A national GIDC consolidates compute, storage, networking, and perimeter cyber defense into a hardened Tier-III facility. Complimenting hardware, the National Enterprise Architecture (NEA) defines interoperability layers (Technical, Semantic, Organizational, and Legal) to enable data sharing across agency boundaries without requiring citizens to submit duplicate documentation.",
        code: `/*
Nepal e-Government Infrastructure Stack:
+-------------------------------------------------------------+
| Front-End: Nagarik App / National Single Window Web Portals |
+-------------------------------------------------------------+
| Interoperability: NeGIF Enterprise Service Bus (ESB) & APIs |
+-------------------------------------------------------------+
| Core Registries: National ID, Civil Registration, Tax, Land  |
+-------------------------------------------------------------+
| Infrastructure: GIDC (Singha Durbar) + Disaster Recovery (Hetauda) |
+-------------------------------------------------------------+
*/`,
        example: "In Nepal, GIDC hosts the electronic Government Procurement (e-GP) platform, ensuring secure online tendering for all public infrastructure bids across the country.",
        commonExamQuestions: [
          "[8 Marks] Describe the role, architecture, and security requirements of the Government Integrated Data Center (GIDC) in Nepal.",
          "[6 Marks] What is the Nepal e-Governance Interoperability Framework (NeGIF)? Explain its architectural layers."
        ]
      },
      {
        id: "dg-u4-ereadiness-egdi",
        name: "e-Government Readiness & UN EGDI Index Framework",
        unit: 4,
        unitTitle: "Unit 4: e-Government Readiness",
        unitCode: "4.1",
        importance: "Very High",
        keyPoints: [
          "e-Readiness assesses a nation's capacity to absorb, deploy, and benefit from ICT in public governance.",
          "UN e-Government Development Index (EGDI): Benchmark composite index assessing national digital governance capabilities.",
          "EGDI Formula: EGDI = 1/3(OSI) + 1/3(TII) + 1/3(HCI).",
          "Online Service Index (OSI): Evaluates national portals, transactional accessibility, and open government data.",
          "Telecommunication Infrastructure Index (TII): Measures mobile subscriptions, fixed broadband, and internet penetration.",
          "Human Capital Index (HCI): Measures adult literacy, secondary and tertiary school enrollment rates."
        ],
        theory: "Digital systems cannot deliver public value if citizens lack internet access or the literacy required to use them. The United Nations Department of Economic and Social Affairs (UNDESA) evaluates global e-Government readiness using the composite EGDI. Overcoming the 'Digital Divide' requires simultaneous public investment in telecommunication backbones (optical fiber in rural districts), education (digital literacy training), and legal frameworks that legally validate digital transactions.",
        code: `/*
UN EGDI Mathematical Formulation:
EGDI = (1/3) * OSI + (1/3) * TII + (1/3) * HCI

Where:
- OSI (Online Service Index): Scored 0.0 to 1.0 via survey of national portals
- TII (Telecomm Infra Index): Normalizes internet users, mobile/broadband penetration
- HCI (Human Capital Index): Normalizes literacy rates and mean years of schooling
*/`,
        example: "Countries with high EGDI (e.g., Denmark, Estonia, South Korea) combine widespread 5G/FTTH internet with universal digital identity architectures.",
        commonExamQuestions: [
          "[8 Marks] Explain the United Nations e-Government Development Index (EGDI). Detail its three component indices and their calculation.",
          "[6 Marks] What is the Digital Divide? Discuss the socio-economic and technological factors that inhibit e-Readiness in developing nations like Nepal."
        ]
      },
      {
        id: "dg-u5-security-pki-eta",
        name: "Security, PKI & Electronic Transactions Act 2063",
        unit: 5,
        unitTitle: "Unit 5: Security for e-Government",
        unitCode: "5.1",
        importance: "Very High",
        keyPoints: [
          "Public Key Infrastructure (PKI): Cryptographic framework providing confidentiality, integrity, authenticity, and non-repudiation.",
          "Electronic Transactions Act (ETA) 2063 (2006): Nepal's foundational cyber law legalizing electronic records, digital signatures, and cybercrime penalties.",
          "Controller of Certifying Authorities (CCA): Statutory office established under ETA 2063 to license and supervise commercial Certifying Authorities (CAs).",
          "Digital Signature: Hash of the document encrypted with the signer's private key; verified using the signer's public key certificate.",
          "Cyber Security Directives: Mandatory requirements for regular security audits, vulnerability assessment and penetration testing (VAPT), and incident response."
        ],
        theory: "Public services handling confidential identity, land, and financial records require rigorous legal recognition and cryptographic protection. ETA 2063 guarantees that an electronic document bearing a certified digital signature carries identical legal weight to a physical document signed in ink. PKI uses asymmetric cryptography and X.509 digital certificates to authenticate users, protect data in transit via TLS, and preserve audit trails that hold civil servants and citizens accountable.",
        code: `/*
PKI Digital Signature Process:
1. Sender hashes Document M -> H(M)
2. Sender encrypts H(M) with Private Key -> Signature S
3. Receiver computes H'(M) from received Document M
4. Receiver decrypts Signature S with Sender's Public Key -> H(M)
5. If H'(M) == H(M): Integrity and Authenticity confirmed!
*/`,
        example: "The Department of Revenue and e-GP portals in Nepal mandate digital signature tokens (USB crypto-keys) for submitting bids and approving enterprise tax invoices.",
        commonExamQuestions: [
          "[10 Marks] Explain the legal and institutional framework established by Nepal's Electronic Transactions Act (ETA) 2063. Discuss the role of the Controller of Certifying Authorities (CCA).",
          "[6 Marks] Describe Public Key Infrastructure (PKI). How do digital signatures guarantee non-repudiation and document integrity?"
        ]
      },
      {
        id: "dg-u6-implementation-bpr",
        name: "Implementing e-Government & Business Process Reengineering",
        unit: 6,
        unitTitle: "Unit 6: Implementing e-Government",
        unitCode: "6.1",
        importance: "High",
        keyPoints: [
          "Business Process Reengineering (BPR): Fundamental rethinking and radical redesign of core business processes to achieve dramatic improvements in performance.",
          "Paving the cow paths: Warning against merely digitizing flawed, bureaucratic manual workflows without redesigning them first.",
          "Change Management: Addressing institutional inertia, civil service resistance, and training needs during digital transition.",
          "Software Development Life Cycle (SDLC) for Public Systems: Feasibility, stakeholder requirements, security-first design, pilot rollout, and continuous evaluation.",
          "Monitoring and Evaluation (M&E): Measuring user adoption, processing times, operational cost reductions, and user satisfaction."
        ],
        theory: "Technological implementation is rarely the primary cause of e-Government failure; organizational resistance, bureaucratic silos, and misaligned incentives represent the true bottlenecks. Business Process Reengineering (BPR) critically evaluates every approval step: asking whether signatures can be automated, whether inter-departmental verification can happen in parallel via APIs, and eliminating redundant manual checkpoints. Comprehensive change management and user-centric design ensure staff adoption and citizen trust.",
        code: `/*
Business Process Reengineering (BPR) Transformation:
Legacy Manual Workflow:
Citizen -> Desk 1 (Form) -> Desk 2 (Verify) -> Desk 3 (Payment) -> Desk 4 (Officer Sign) -> 7-14 Days

Reengineered Digital Workflow:
Citizen (Mobile App) -> Auto-Verification (National ID API) -> Digital Payment Gateway -> Auto-Issued PDF -> Instant (5 Minutes)
*/`,
        example: "Eliminating physical paper clearance in vehicle tax renewal by linking vehicle chassis numbers directly to insurance and bank databases via APIs.",
        commonExamQuestions: [
          "[8 Marks] What is Business Process Reengineering (BPR)? Why is BPR mandatory before automating government workflows?",
          "[6 Marks] Discuss change management strategies required to overcome civil service resistance during e-Government implementation."
        ]
      },
      {
        id: "dg-u7-digital-democracy",
        name: "From Representative to Digital Democracy & e-Participation",
        unit: 7,
        unitTitle: "Unit 7: From Representative to Digital Democracy",
        unitCode: "7.1",
        importance: "High",
        keyPoints: [
          "Digital Democracy: Use of ICT to enhance democratic processes, citizen deliberation, public consultations, and transparent elections.",
          "UN e-Participation Framework: 1. e-Information (Enabling citizen access to public data), 2. e-Consultation (Gathering citizen feedback), 3. e-Decision-making (Direct civic co-design).",
          "Open Government Data (OGD): Proactively publishing machine-readable government datasets under open licenses to foster transparency and civic innovation.",
          "e-Voting: Electronic voting systems requiring voter verifiability, ballot secrecy, and distributed auditability (Voter Verified Paper Audit Trail - VVPAT).",
          "Challenges of digital democracy: Online echo chambers, algorithmic manipulation, and disenfranchisement of digitally illiterate citizens."
        ],
        theory: "Digital democracy shifts citizens from passive recipients of public services to active participants in governance. Through open data initiatives, ministries publish budgets, tender awards, and environmental statistics, empowering civil society watchdogs to scrutinize spending. In public consultations (e-Consultation), legislative drafts are published online for public comments before parliamentary ratification. Secure e-voting remains a challenging frontier, demanding cryptographic verifiable secret-ballot architectures to protect electoral integrity.",
        code: `/*
Three-Tier UN e-Participation Framework:
Tier 1: e-Information  -> One-way transparency (Gov publishes budgets, laws, data)
Tier 2: e-Consultation -> Two-way feedback (Citizens comment on draft policies)
Tier 3: e-Decision-Making -> Direct citizen empowerment (Participatory budgeting, referendums)
*/`,
        example: "Open Government Data portal of Nepal (nationaldata.gov.np) and civil society budget tracking portals.",
        commonExamQuestions: [
          "[8 Marks] Explain the three tiers of the UN e-Participation framework. How does Open Government Data (OGD) improve transparency?",
          "[6 Marks] Discuss the technological prerequisites, security vulnerabilities, and trust challenges associated with e-Voting systems."
        ]
      },
      {
        id: "dg-u8-citizen-centric-nagarik",
        name: "Citizen-Centric Remote Governance & Nagarik App Architecture",
        unit: 8,
        unitTitle: "Unit 8: Citizen-Centric Remote Online Digital Governance",
        unitCode: "8.1",
        importance: "Very High",
        keyPoints: [
          "Citizen-Centric Governance: Designing public administration interfaces around citizen convenience rather than administrative org charts.",
          "Single Window System: Unified portals consolidating multiple department services into a single interface.",
          "Nagarik App (Nepal): Flagship mobile super-app consolidating Citizenship, PAN, Social Security Fund (SSF), Driving License, and Educational Records.",
          "Mobile-Governance (m-Gov): Delivering services via smartphones, SMS, and USSD, dramatically increasing accessibility in remote geographies.",
          "Integrated Citizen Relationship Management (CRM): Centralized grievance recording and resolution tracking (e.g., Hello Sarkar)."
        ],
        theory: "Historically, citizens were forced to visit separate departmental offices, wait in physical queues, and fill identical forms repeatedly. Citizen-centric remote governance unites these disparate databases behind an identity-linked API gateway. In Nepal, the Nagarik App uses the citizen's mobile number (verified against SIM card registration data) linked to Citizenship/National ID records to authenticate users, pulling real-time verified credentials directly from departmental backend databases.",
        code: `/*
Nagarik App API Integration Architecture:
[User Smartphone]
      |
      v (OAuth 2.0 / JWT)
[Nagarik App API Gateway]
      |
      +---> [National ID Authority] (Identity verification)
      +---> [Inland Revenue Dept] (PAN records)
      +---> [Dept of Transport Mgmt] (Driving License status)
      +---> [Social Security Fund / EPF] (Contribution statements)
      +---> [Hello Sarkar] (Grievance submission and tracking)
*/`,
        example: "Nepal's 'Hello Sarkar' portal and Nagarik App allow citizens to log public grievances regarding road damage or municipal delays, routing tickets automatically to local officers.",
        commonExamQuestions: [
          "[8 Marks] Explain the architecture and citizen services offered by Nepal's Nagarik App. What are its strengths and data privacy concerns?",
          "[6 Marks] Describe the concept of Single Window Systems in citizen-centric governance. How does m-Gov improve rural inclusion?"
        ]
      },
      {
        id: "dg-u9-ai-in-governance",
        name: "Artificial Intelligence in Public Administration & Smart Governance",
        unit: 9,
        unitTitle: "Unit 9: Applying Artificial Intelligence to Improve Performance and Results",
        unitCode: "9.1",
        importance: "High",
        keyPoints: [
          "Automated Document Processing: Natural Language Processing (NLP) to index, summarize, and route municipal applications.",
          "Chatbots and Virtual Assistants: 24/7 multilingual conversational interfaces handling public service inquiries.",
          "Predictive Resource Allocation: Machine learning algorithms predicting public hospital bed demands, traffic bottlenecks, and municipal water needs.",
          "Fraud and Anomaly Detection: Automated auditing algorithms detecting suspicious tax deductions and procurement bid-rigging.",
          "Ethical & Governance Risks: Algorithmic bias, lack of explainability (black-box models), surveillance overreach, and data privacy violations."
        ],
        theory: "Governments generate massive quantities of administrative, judicial, and transactional data that exceed human manual processing capabilities. Machine learning models optimize service delivery by automating routine administrative decisions, identifying tax non-compliance through anomaly detection, and predicting disaster vulnerability. However, deploying AI in public policy requires rigorous auditing for algorithmic bias, explainable AI (XAI) frameworks to preserve due process, and strict adherence to personal data privacy standards.",
        code: `/*
AI Applications in Smart Digital Governance:
Domain           | AI Technique        | Governance Outcome
Tax Auditing     | Anomaly Detection   | Uncovers undeclared corporate revenue and VAT evasion
Public Health    | Predictive Analytics| Forecasts seasonal dengue/cholera outbreaks by district
Urban Traffic    | Computer Vision     | Dynamic signal timing and automated traffic violation ticketing
Judicial Systems | NLP / Semantics     | Summarizes legal precedents and prioritizes backlogged cases
*/`,
        example: "Automated optical character recognition (OCR) and facial recognition used to verify applicant identity against National ID biometric databases during digital onboarding.",
        commonExamQuestions: [
          "[8 Marks] How can Artificial Intelligence improve public administration performance? Discuss three concrete use cases and their potential pitfalls.",
          "[6 Marks] What ethical, accountability, and transparency challenges arise when algorithmic decision-making is applied to citizen welfare benefits?"
        ]
      },
      {
        id: "dg-u10-case-studies",
        name: "Case Studies: Nepal (Nagarik App, GIDC), India (Aadhaar, UPI) & Global (Estonia X-Road)",
        unit: 10,
        unitTitle: "Unit 10: Case Studies and Applications of e-Government System",
        unitCode: "10.1",
        importance: "Very High",
        keyPoints: [
          "Estonia X-Road: Distributed, encrypted interoperability data exchange layer enabling once-only principle (citizens never provide same data twice).",
          "India Aadhaar & India Stack: 12-digit biometric digital identity supporting instant e-KYC, combined with Unified Payments Interface (UPI) for real-time mobile micro-payments.",
          "Nepal e-Government Initiatives: Nagarik App, GIDC Singha Durbar, electronic Government Procurement (e-GP), ASYCUDA World at customs, and online voter registration.",
          "Once-Only Principle: Legislative mandate that public agencies must share data across systems rather than demanding duplicate physical documentation from citizens.",
          "Key Takeaways: Successful digital governance requires strong political leadership, interoperability by design, robust legal frameworks, and digital identity as the core foundation."
        ],
        theory: "Comparative analysis of international e-government milestones reveals common architectural patterns for successful digital transformation. Estonia achieved world-leading digital governance (99% of public services online) through 'X-Road', a secure, decentralized data highway connecting public and private databases via signed, timestamped RESTful exchanges. India transformed financial inclusion by pairing biometric identification (Aadhaar) with an open interoperable payment rail (UPI). For Nepal, scaling the Nagarik App and e-GP system depends on resolving inter-agency data sharing barriers, upgrading rural network resilience, and enacting comprehensive data protection legislation.",
        code: `/*
Estonia X-Road Interoperability Topology:
[Citizen / Portal] -> [Security Server A] ===(Encrypted Mutual TLS)===> [Security Server B] -> [Registry DB]
                                  ^                                           ^
                                  |------- Central Service Registry ----------|
                                  |------- Time-Stamping & OCSP Provider -----|
Key Characteristic: No central database; data remains with the originating agency!
*/`,
        example: "Estonia's i-Voting allows registered voters to cast verified ballots from any internet-connected computer worldwide during parliamentary elections.",
        commonExamQuestions: [
          "[10 Marks] Analyze Estonia's 'X-Road' architecture and the 'Once-Only Principle'. How can Nepal adapt these principles to improve public service integration?",
          "[8 Marks] Evaluate India's 'India Stack' (Aadhaar, DigiLocker, UPI). Discuss the lessons developing economies can draw regarding scale and financial inclusion."
        ]
      }
    ],
    theoryTopics: [
      "Detail the provisions and judicial mechanisms of Nepal's Electronic Transactions Act 2063.",
      "Explain the UN e-Government Development Index (EGDI) and its mathematical calculation.",
      "Compare centralized vs decentralized government interoperability architectures (GIDC vs X-Road).",
      "Discuss strategies for overcoming institutional resistance and ensuring privacy protection in public sector AI deployment."
    ]
  },

  "Machine Learning (Track A)": {
    subjectName: "Machine Learning (Track A)",
    code: "BIT421CO",
    creditHours: 3,
    topics: [
      {
        id: "ml-u1-intro-foundations",
        name: "Introduction to Machine Learning, Learning Paradigms & PAC Learning",
        unit: 1,
        unitTitle: "Unit 1: Introduction to Machine Learning",
        unitCode: "1.1",
        importance: "Very High",
        keyPoints: [
          "Definition (Tom Mitchell): An algorithm learns from experience E with respect to task T and performance metric P, if its performance on T improves with E.",
          "Core Learning Paradigms: Supervised Learning (labeled data), Unsupervised Learning (unlabeled data), Reinforcement Learning (reward/penalty signals).",
          "Batch Learning vs Online Learning: Batch models train on entire static datasets; Online models update model parameters incrementally as data streams arrive.",
          "Parametric vs Non-Parametric: Parametric models summarize data with a fixed set of parameters (Linear Regression); Non-parametric models grow parameters with dataset size (k-NN).",
          "Probably Approximately Correct (PAC) Learning: Theoretical framework assessing the sample complexity required to learn an accurate hypothesis with high probability."
        ],
        theory: "Machine Learning develops computational algorithms that discover statistical structures in historical data to make automated predictions on unseen data. In Supervised Learning, given training pairs {(x_i, y_i)}, the objective is to approximate the underlying mapping function f: X -> Y. When target values are continuous, the task is Regression; when discrete, it is Classification. Inductive bias represents the set of assumptions an algorithm uses to predict outputs for inputs it has never encountered.",
        code: `# Basic classification pipeline using Scikit-Learn
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"Dataset split: Train={X_train.shape[0]}, Test={X_test.shape[0]}")`,
        example: "Spam classification: Task T = classify emails as spam or ham; Experience E = watching user label incoming emails; Performance P = fraction of emails correctly categorized.",
        commonExamQuestions: [
          "[8 Marks] State Tom Mitchell's formal definition of machine learning with a concrete example. Compare supervised, unsupervised, and reinforcement learning.",
          "[6 Marks] Explain parametric vs non-parametric algorithms and explain the concept of Inductive Bias."
        ]
      },
      {
        id: "ml-u2-supervised-learning",
        name: "Supervised Learning: Linear/Logistic Regression, Decision Trees & SVM",
        unit: 2,
        unitTitle: "Unit 2: Supervised Learning",
        unitCode: "2.1",
        importance: "Very High",
        keyPoints: [
          "Linear Regression models continuous targets: y = w^T * x + b; optimized by minimizing Mean Squared Error (MSE) via Gradient Descent or Normal Equation.",
          "Logistic Regression maps linear combinations to probabilities using the Sigmoid function: sigma(z) = 1 / (1 + e^(-z)); optimized using Binary Cross-Entropy loss.",
          "Decision Trees (ID3, C4.5, CART) recursively partition feature space based on Information Gain (Entropy) or Gini Impurity.",
          "Support Vector Machines (SVM) maximize the geometric margin between decision boundary and support vectors; employs the Kernel Trick (RBF, Polynomial) for non-linear data.",
          "Naive Bayes classifier applies Bayes' Theorem with the strong assumption of class-conditional feature independence."
        ],
        theory: "Supervised learning algorithms formulate learning as cost function optimization. In Linear Regression, the cost function J(w) is convex, guaranteeing convergence to the global minimum via Gradient Descent: w := w - alpha * grad(J). In Logistic Regression, the non-linear sigmoid activation compresses unbounded real numbers into [0, 1], representing class membership probabilities. Support Vector Machines find the optimal separating hyperplane that maximizes the margin 2 / ||w||, solving a quadratic programming optimization problem. For non-linearly separable data, Mercer kernels project features implicitly into infinite-dimensional Hilbert spaces without calculating higher-dimensional coordinates directly.",
        code: `import numpy as np

# Gradient Descent for Simple Linear Regression
def gradient_descent(X, y, alpha=0.01, epochs=1000):
    m = len(y)
    w = 0.0
    b = 0.0
    for _ in range(epochs):
        y_pred = w * X + b
        dw = (-2/m) * np.sum(X * (y - y_pred))
        db = (-2/m) * np.sum(y - y_pred)
        w -= alpha * dw
        b -= alpha * db
    return w, b`,
        example: "Calculating Entropy: H(S) = - sum(p_i * log2(p_i)). If a node has 9 positive and 5 negative examples: H(S) = -(9/14)log2(9/14) - (5/14)log2(5/14) = 0.940 bits.",
        commonExamQuestions: [
          "[10 Marks] Derive the Gradient Descent update equations for Linear Regression with Mean Squared Error loss.",
          "[10 Marks] Explain the working of Support Vector Machines (SVM). How does the Kernel Trick enable linear algorithms to separate non-linear datasets?"
        ]
      },
      {
        id: "ml-u3-unsupervised-learning",
        name: "Unsupervised Learning: K-Means, Hierarchical Clustering & PCA",
        unit: 3,
        unitTitle: "Unit 3: Unsupervised Learning",
        unitCode: "3.1",
        importance: "High",
        keyPoints: [
          "Unsupervised Learning discovers inherent patterns, clusters, and latent representations in unlabeled datasets {x_i}.",
          "K-Means Clustering: Iterative centroid-based algorithm alternating between assignment of points to nearest centroid and recalculation of centroid positions.",
          "Elbow Method & Silhouette Coefficient used to determine the optimal number of clusters K.",
          "Hierarchical Clustering: Agglomerative (bottom-up merging) and Divisive (top-down splitting); visualized using Dendrograms.",
          "Principal Component Analysis (PCA): Linear dimensionality reduction technique that projects data along orthogonal axes of maximum variance (eigenvectors of covariance matrix)."
        ],
        theory: "Clustering algorithms group data points such that intra-cluster distance is minimized while inter-cluster distance is maximized. K-Means minimizes inertia (Within-Cluster Sum of Squares - WCSS), but is sensitive to initial random centroid placement (remedied by K-Means++). Principal Component Analysis addresses the 'Curse of Dimensionality' by computing the singular value decomposition (SVD) or eigendecomposition of the data covariance matrix Sigma = (1/m) X^T X. The top k eigenvectors corresponding to the largest eigenvalues capture the maximum variance while compressing feature dimensions.",
        code: `from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
import numpy as np

# PCA Dimensionality Reduction
X = np.random.randn(100, 10) # 100 samples, 10 features
pca = PCA(n_components=2)
X_reduced = pca.fit_transform(X)
print("Explained variance ratio:", pca.explained_variance_ratio_)

# K-Means Clustering on reduced space
kmeans = KMeans(n_clusters=3, init='k-means++', random_state=42)
labels = kmeans.fit_predict(X_reduced)`,
        example: "Compressing an image dataset from 100 features to 2 principal components to enable 2D visualization while retaining 92% of the original variance.",
        commonExamQuestions: [
          "[8 Marks] Explain the step-by-step algorithm for K-Means clustering. How is the Elbow Method used to identify optimal K?",
          "[8 Marks] Derive the mathematical concept behind Principal Component Analysis (PCA) and explain how eigenvectors capture maximum variance."
        ]
      },
      {
        id: "ml-u4-diagnosis-tuning",
        name: "Model Diagnosis, Bias-Variance Tradeoff & Hyperparameter Tuning",
        unit: 4,
        unitTitle: "Unit 4: Model Diagnosis and Tuning",
        unitCode: "4.1",
        importance: "Very High",
        keyPoints: [
          "Generalization Error = Bias^2 + Variance + Irreducible Error.",
          "High Bias (Underfitting): Model is overly simplistic and fails to capture underlying data patterns; poor train and test accuracy.",
          "High Variance (Overfitting): Model memorizes training noise and generalizes poorly; high train accuracy but poor test accuracy.",
          "Regularization techniques: L1 (Lasso) promotes feature sparsity by adding lambda * sum(|w|); L2 (Ridge) shrinks weights toward zero by adding lambda * sum(w^2).",
          "Evaluation Metrics: Precision, Recall, F1-Score, ROC curve (Receiver Operating Characteristic), and Area Under the Curve (AUC).",
          "K-Fold Cross-Validation splits data into K subsets to ensure robust performance estimation without data leakage."
        ],
        theory: "A fundamental objective of machine learning is preventing models from overfitting training noise. High bias is diagnosed when learning curves plateau with high training and cross-validation errors (remedied by adding features, using non-linear models, or reducing regularization). High variance occurs when a large gap exists between training error and validation error (remedied by gathering more training samples, removing redundant features, or increasing regularization strength). In classification, when classes are imbalanced (e.g., fraud detection), raw accuracy is misleading; models must be evaluated using Precision = TP / (TP + FP) and Recall = TP / (TP + FN).",
        code: `from sklearn.metrics import classification_report, roc_auc_score
from sklearn.model_selection import GridSearchCV
from sklearn.linear_model import Ridge

# Hyperparameter Tuning using Grid Search
param_grid = {'alpha': [0.01, 0.1, 1.0, 10.0, 100.0]}
grid = GridSearchCV(Ridge(), param_grid, cv=5, scoring='neg_mean_squared_error')
# grid.fit(X_train, y_train)`,
        example: "Confusion Matrix calculation: TP=80, FP=20, FN=10, TN=890. Precision = 80/100 = 80%. Recall = 80/90 = 88.8%. F1 = 2 * (0.80 * 0.888) / (0.80 + 0.888) = 0.842.",
        commonExamQuestions: [
          "[8 Marks] Explain the Bias-Variance tradeoff with appropriate learning curves. How do L1 (Lasso) and L2 (Ridge) regularization mitigate variance?",
          "[7 Marks] Differentiate between Precision and Recall. In which practical scenarios is Recall prioritized over Precision?"
        ]
      },
      {
        id: "ml-u5-text-mining",
        name: "Text Mining, TF-IDF Vectorization & Word Embeddings",
        unit: 5,
        unitTitle: "Unit 5: Text Mining",
        unitCode: "5.1",
        importance: "High",
        keyPoints: [
          "Text Preprocessing Pipeline: Tokenization, lowercasing, stop-word removal, stemming (Porter), and lemmatization (WordNet).",
          "Bag of Words (BoW): Represents text as sparse count vectors of vocabulary words, ignoring word order and grammar.",
          "TF-IDF (Term Frequency - Inverse Document Frequency): Penalizes common corpus words and amplifies terms distinctive to specific documents.",
          "Formula: TF-IDF(t, d, D) = TF(t, d) * log(N / DF(t)).",
          "Word Embeddings (Word2Vec, GloVe): Dense distributed vector representations where semantically related words are positioned close together in vector space."
        ],
        theory: "Unstructured natural language text must be converted into numerical matrices before machine learning algorithms can process it. Simple word count approaches are skewed by ubiquitous stop words ('the', 'is', 'at'). TF-IDF resolves this by multiplying term frequency by inverse document frequency, yielding higher weights for rare, informative keywords. Modern text mining employs Word2Vec (Continuous Bag of Words and Skip-Gram models) to learn dense continuous vectors using shallow neural networks, capturing complex semantic relationships such as vector('King') - vector('Man') + vector('Woman') approx vector('Queen').",
        code: `from sklearn.feature_extraction.text import TfidfVectorizer

corpus = [
    "Machine learning algorithms build mathematical models",
    "Deep learning is a subset of machine learning",
    "Natural language processing uses text mining techniques"
]

vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = vectorizer.fit_transform(corpus)
print("Vocabulary:", vectorizer.get_feature_names_out())
print("TF-IDF shape:", tfidf_matrix.shape)`,
        example: "In a corpus of 10,000 documents, if the word 'network' appears in 100 documents: IDF = log(10000 / 100) = log(100) = 2. If it appears 5 times in a document of 100 words: TF = 5/100 = 0.05. TF-IDF = 0.05 * 2 = 0.10.",
        commonExamQuestions: [
          "[8 Marks] Explain the complete NLP text preprocessing pipeline. Detail the mathematical formula and purpose of TF-IDF vectorization.",
          "[6 Marks] Compare Bag of Words (BoW) representations with distributed Word Embeddings (Word2Vec)."
        ]
      },
      {
        id: "ml-u6-deep-learning",
        name: "Deep Learning Foundations: Perceptrons, MLP & Backpropagation",
        unit: 6,
        unitTitle: "Unit 6: Deep Learning",
        unitCode: "6.1",
        importance: "Very High",
        keyPoints: [
          "Perceptron: Linear binary classifier computing output = step(w^T * x + b); incapable of solving non-linearly separable problems like XOR.",
          "Multilayer Perceptron (MLP): Feedforward neural network with input, hidden, and output layers utilizing non-linear activation functions.",
          "Activation Functions: Sigmoid (squashes to [0,1], prone to vanishing gradient), Tanh (squashes to [-1,1]), ReLU (f(x) = max(0, x), avoids gradient vanishing).",
          "Backpropagation: Efficient application of the multivariable calculus Chain Rule to compute partial derivatives of loss with respect to all layer weights.",
          "Deep learning architectures overview: Convolutional Neural Networks (CNNs for spatial/vision data) and Recurrent Neural Networks (RNNs for sequential data)."
        ],
        theory: "Deep learning overcomes manual feature engineering by learning hierarchical feature abstractions directly from raw inputs. A single-layer perceptron is constrained to linear decision boundaries. By introducing hidden layers equipped with non-linear activation functions (e.g., ReLU), MLPs become universal function approximators. Forward propagation computes predictions and evaluates loss. Backpropagation propagates the error backward through the network layers, using the chain rule to update weight matrices via stochastic gradient descent: W^[l] := W^[l] - alpha * (dL / dW^[l]).",
        code: `import numpy as np

# Forward propagation for a 2-layer neural network
def forward_pass(X, W1, b1, W2, b2):
    Z1 = np.dot(X, W1) + b1
    A1 = np.maximum(0, Z1) # ReLU activation
    Z2 = np.dot(A1, W2) + b2
    # Softmax activation for multiclass output
    exp_Z2 = np.exp(Z2 - np.max(Z2, axis=1, keepdims=True))
    A2 = exp_Z2 / np.sum(exp_Z2, axis=1, keepdims=True)
    return A1, A2`,
        example: "Why single-layer perceptrons fail on XOR: XOR outputs 1 only when inputs differ ((0,1) or (1,0)), which cannot be separated by any single straight line in 2D Cartesian space.",
        commonExamQuestions: [
          "[10 Marks] Explain why a single-layer perceptron cannot solve the XOR problem. Show how a Multi-Layer Perceptron (MLP) resolves this limitation.",
          "[8 Marks] Derive the Backpropagation weight update rule using the calculus chain rule for an artificial neural network with one hidden layer."
        ]
      }
    ],
    theoryTopics: [
      "Compare parametric and non-parametric algorithms with respect to bias, variance, and sample complexity.",
      "Derive the dual formulation of Support Vector Machines and explain Mercer's theorem for kernel substitution.",
      "Explain the mathematical mechanics of Principal Component Analysis (PCA) using covariance matrix eigendecomposition.",
      "Discuss strategies for mitigating vanishing and exploding gradients in deep neural networks."
    ]
  },

  "Business Intelligence and Data Science (Track A)": {
    subjectName: "Business Intelligence and Data Science (Track A)",
    code: "BIT422CO",
    creditHours: 3,
    topics: [
      {
        id: "bi-u1-overview-dss",
        name: "Overview of Business Intelligence, Decision Support & Value Chain",
        unit: 1,
        unitTitle: "Unit 1: Overview of Business Intelligence & Decision Support",
        unitCode: "1.1",
        importance: "High",
        keyPoints: [
          "Business Intelligence (BI): Comprehensive umbrella term encompassing architectures, applications, data warehouses, and query tools to support strategic business decisions.",
          "Decision Support Systems (DSS): Interactive computer-based systems that assist decision-makers in utilizing data and models to solve semi-structured problems.",
          "Operational vs Analytical Systems: OLTP (high volume, granular, normalized, transactional) vs OLAP (historical, consolidated, denormalized, analytical).",
          "BI Value Chain: Data Acquisition -> Data Storage & Processing -> Analytics & Mining -> Business Insight & Strategic Action.",
          "Four levels of analytics: Descriptive (What happened?), Diagnostic (Why did it happen?), Predictive (What will happen?), Prescriptive (How can we make it happen?)."
        ],
        theory: "Modern enterprises generate massive transaction logs across ERP, CRM, and web platforms. OLTP databases are optimized for fast transaction processing and consistency (ACID), making them unsuitable for complex analytical queries that scan millions of historical rows. BI systems extract data from operational sources, transform it into unified dimensions and facts, and load it into analytical repositories. Executives utilize interactive dashboards to track Key Performance Indicators (KPIs) and drive data-backed commercial decisions.",
        code: `/*
OLTP vs OLAP Architecture Comparison:
Attribute    | OLTP (Operational)       | OLAP (Analytical / BI)
Primary Use  | Daily day-to-day business| Decision support, strategic analytics
Data Schema  | Highly normalized (3NF)  | Denormalized (Star / Snowflake)
Queries      | Fast simple reads/writes | Complex aggregate analytical scans
Time Horizon | Real-time / Current      | Multi-year historical snapshots
*/`,
        example: "A retail bank uses OLTP to execute ATM fund transfers in milliseconds, while using an OLAP data warehouse to analyze 5-year loan default trends across demographic regions.",
        commonExamQuestions: [
          "[8 Marks] Differentiate between OLTP and OLAP systems across schema design, query patterns, and business objectives.",
          "[6 Marks] Explain the four levels of analytics (Descriptive, Diagnostic, Predictive, Prescriptive) with relevant business scenarios."
        ]
      },
      {
        id: "bi-u2-data-warehouse-etl",
        name: "Data Warehousing Architecture, Dimensional Modeling & ETL",
        unit: 2,
        unitTitle: "Unit 2: Data Warehousing and ETL Processes",
        unitCode: "2.1",
        importance: "Very High",
        keyPoints: [
          "Data Warehouse Definition (Bill Inmon): A subject-oriented, integrated, time-variant, and non-volatile collection of data in support of management decisions.",
          "Architectural Methodologies: Inmon's Corporate Information Factory (top-down, normalized EDW) vs Kimball's Dimensional Data Warehouse (bottom-up, conformed data marts).",
          "Dimensional Modeling: Fact tables (metrics, foreign keys) surrounded by Dimension tables (descriptive attributes).",
          "Star Schema (denormalized dimensions, single join) vs Snowflake Schema (normalized dimensions, multiple joins).",
          "ETL Process: Extraction (capturing raw operational data), Transformation (cleansing, deduplication, schema conforming), Loading (inserting into warehouse tables).",
          "OLAP Cube Operations: Slice (single dimension slice), Dice (sub-cube selection), Roll-up (aggregating up hierarchy), Drill-down (navigating to lower granularities)."
        ],
        theory: "Dimensional modeling optimizes data representation for rapid analytical aggregation. In a Star Schema, a centralized Fact table (containing numeric additive measures like sales_revenue and quantity_sold) links via primary-foreign key relationships to denormalized Dimension tables (Date, Product, Store, Customer). In a Snowflake Schema, dimension tables are normalized to reduce redundancy, requiring more joins during querying. OLAP engines organize this data into multi-dimensional hypercubes enabling real-time drill-down from annual revenues to individual store sales.",
        code: `-- Star Schema Dimensional Model for Retail BI
CREATE TABLE Dim_Date (
    Date_Key INT PRIMARY KEY,
    Full_Date DATE,
    Month_Name VARCHAR(15),
    Quarter INT,
    Year INT
);

CREATE TABLE Dim_Product (
    Product_Key INT PRIMARY KEY,
    Product_Name VARCHAR(100),
    Category VARCHAR(50),
    Brand VARCHAR(50)
);

CREATE TABLE Fact_Sales (
    Sales_ID INT PRIMARY KEY,
    Date_Key INT REFERENCES Dim_Date(Date_Key),
    Product_Key INT REFERENCES Dim_Product(Product_Key),
    Units_Sold INT,
    Total_Revenue DECIMAL(12,2)
);`,
        example: "Executing a Roll-up operation aggregates daily sales figures into monthly and quarterly totals; a Drill-down disaggregates nationwide sales into individual district branch figures.",
        commonExamQuestions: [
          "[10 Marks] Define a Data Warehouse. Compare Star Schema and Snowflake Schema with neat architectural diagrams and SQL schemas.",
          "[8 Marks] Explain the stages of the ETL (Extract, Transform, Load) pipeline. Discuss the four fundamental OLAP operations (Roll-up, Drill-down, Slice, Dice)."
        ]
      },
      {
        id: "bi-u3-reporting-dashboards",
        name: "Business Reporting, Visual Analytics & Performance Management",
        unit: 3,
        unitTitle: "Unit 3: Business Reporting & Visual Analytics",
        unitCode: "3.1",
        importance: "High",
        keyPoints: [
          "Executive Dashboards: Visual single-screen displays of critical metrics and KPIs enabling rapid status evaluation.",
          "Balanced Scorecard (BSC): Strategic performance management framework assessing organization performance across four perspectives: Financial, Customer, Internal Processes, and Learning & Growth.",
          "Key Performance Indicators (KPIs): Quantifiable metrics reflecting strategic organizational goals (e.g., Customer Churn Rate, Net Promoter Score).",
          "Visual Analytics Principles: Choosing appropriate charts (scatter plots for correlation, bar charts for comparison, line charts for trends, choropleth maps for geographic distribution).",
          "Visual Encoding & Gestalt Principles: Leveraging pre-attentive attributes (color, size, shape, position) to facilitate rapid cognitive comprehension."
        ],
        theory: "Effective business reporting bridges the gap between raw data repositories and executive decision-making. Information dashboards consolidate multi-source metrics into high-level visual summaries. The Balanced Scorecard framework guards against short-sighted financial focus by tracking operational efficiency, customer satisfaction, and staff technological readiness alongside traditional accounting profit metrics.",
        code: `/*
Balanced Scorecard (BSC) Four Perspectives:
1. Financial Perspective: "To succeed financially, how should we appear to shareholders?"
   - KPIs: Return on Equity (ROE), Net Profit Margin, Revenue Growth Rate
2. Customer Perspective: "To achieve our vision, how should we appear to customers?"
   - KPIs: Customer Retention Rate, Churn Rate, Net Promoter Score (NPS)
3. Internal Business Processes: "To satisfy shareholders and customers, what processes must we excel at?"
   - KPIs: Order Fulfillment Cycle Time, Defect Rate, Inventory Turnover
4. Learning & Growth: "To achieve our vision, how will we sustain our ability to change and improve?"
   - KPIs: Employee Training Hours, IT Automation Rate, Patent Filings
*/`,
        example: "A telecom dashboard alerting executives via red indicator when 4G cell tower downtime exceeds 0.05% across a province.",
        commonExamQuestions: [
          "[8 Marks] Explain the four perspectives of the Balanced Scorecard (BSC) framework and provide two realistic KPIs for each perspective.",
          "[6 Marks] Discuss best practices in visual analytics and dashboard design. Why are pie charts often discouraged for multi-category comparisons?"
        ]
      },
      {
        id: "bi-u4-data-mining-apriori",
        name: "Data Mining Concepts, Association Rules & Apriori Algorithm",
        unit: 4,
        unitTitle: "Unit 4: Data Mining Concepts & Applications",
        unitCode: "4.1",
        importance: "Very High",
        keyPoints: [
          "Data Mining: Knowledge Discovery in Databases (KDD) process discovering valid, novel, potentially useful, and understandable patterns in massive data.",
          "Association Rule Mining (Market Basket Analysis): Identifies relationships between items bought together: {Antecedent} -> {Consequent}.",
          "Support: Fraction of total transactions containing both itemsets: Support(A -> B) = P(A union B).",
          "Confidence: Conditional probability that item B is purchased given that item A is purchased: Confidence(A -> B) = Support(A union B) / Support(A).",
          "Lift: Ratio of observed support to expected support if A and B were independent: Lift(A -> B) = Confidence(A -> B) / Support(B); Lift > 1 indicates positive association.",
          "Apriori Algorithm: Employs the Apriori property (all non-empty subsets of a frequent itemset must also be frequent) to prune candidate itemsets."
        ],
        theory: "Market basket analysis discovers customer purchasing patterns to optimize shelf arrangements, cross-selling campaigns, and catalogue bundling. The naive approach of evaluating every possible item combination exhibits exponential complexity O(2^d). The Apriori algorithm prunes the search space by iteratively generating candidate k-itemsets solely from frequent (k-1)-itemsets. If any itemset {X, Y} is infrequent, any larger superset containing it (e.g., {X, Y, Z}) is immediately pruned without database scanning.",
        code: `/*
Apriori Step-by-Step Calculation:
Database D of 5 transactions:
T1: {Bread, Milk}
T2: {Bread, Diaper, Beer, Eggs}
T3: {Milk, Diaper, Beer, Cola}
T4: {Bread, Milk, Diaper, Beer}
T5: {Bread, Milk, Diaper, Cola}

Minimum Support = 60% (3/5), Minimum Confidence = 80%

1. Candidate 1-itemsets (C1):
   {Bread}: 4/5, {Milk}: 4/5, {Diaper}: 4/5, {Beer}: 3/5, {Cola}: 2/5, {Eggs}: 1/5
   Prune Cola and Eggs -> Frequent L1 = {Bread, Milk, Diaper, Beer}

2. Candidate 2-itemsets (C2):
   {Bread, Diaper}: 3/5, {Bread, Beer}: 2/5 (pruned), {Milk, Diaper}: 3/5, {Diaper, Beer}: 3/5
   Evaluate Association Rule: {Diaper} -> {Beer}
   Support = 3/5 = 60%
   Confidence = Support({Diaper, Beer}) / Support({Diaper}) = (3/5) / (4/5) = 75% (< 80%, pruned!)
*/`,
        example: "The classic retail discovery where diaper purchases on Friday evenings strongly correlated with beer purchases, prompting stores to place them adjacent to each other.",
        commonExamQuestions: [
          "[10 Marks] State the Apriori property. Given a transaction database, generate frequent itemsets and strong association rules with detailed calculation steps.",
          "[6 Marks] Define Support, Confidence, and Lift in association rule mining. Explain why Lift > 1 is critical for validating genuine commercial associations."
        ]
      },
      {
        id: "bi-u5-text-web-analytics",
        name: "Text Analytics, Web Usage Mining & Sentiment Analysis",
        unit: 5,
        unitTitle: "Unit 5: Text and Web Analytics",
        unitCode: "5.1",
        importance: "High",
        keyPoints: [
          "Web Analytics taxonomy: Web Content Mining (text/media on pages), Web Structure Mining (hyperlink topologies, PageRank), Web Usage Mining (server logs, clickstreams).",
          "Clickstream Analysis: Tracking user navigation paths, bounce rates, session durations, and cart abandonment funnels.",
          "Text Analytics: Structuring unstructured corporate documents (emails, support tickets, reviews) via NLP pipelines.",
          "Sentiment Analysis (Opinion Mining): Classifying customer text reviews as positive, neutral, or negative using lexicon-based or supervised ML classifiers.",
          "Search Engine Optimization (SEO) analytics: Monitoring organic search rankings, keyword CTR, and crawl error telemetry."
        ],
        theory: "Over 80% of enterprise information resides in unstructured text documents, customer emails, and web server logs. Web usage mining parses common log format (CLF) server entries to discover conversion bottlenecks and path drop-offs in e-commerce purchase flows. Concurrently, sentiment analysis interrogates social media mentions and customer support tickets, calculating polarity and subjectivity scores to detect product dissatisfaction before it causes measurable customer churn.",
        code: `import re
from collections import Counter

# Log parsing snippet for Web Usage Mining
log_line = '192.168.1.50 - - [28/Sep/2026:10:15:30 +0545] "GET /checkout HTTP/1.1" 200 4520'
log_pattern = r'(\\S+) \\S+ \\S+ \\[(.*?)\\] "(\\S+) (\\S+) \\S+" (\\d{3}) (\\d+)'
match = re.match(log_pattern, log_line)
if match:
    ip, timestamp, method, endpoint, status, bytes_sent = match.groups()
    print(f"IP: {ip} visited {endpoint} at {timestamp} with status {status}")`,
        example: "An airline analyzing customer tweets using sentiment analysis: detecting sudden spikes in negative sentiment containing the word 'delay' to rapidly deploy customer care agents.",
        commonExamQuestions: [
          "[8 Marks] Differentiate between Web Content Mining, Web Structure Mining, and Web Usage Mining with practical examples.",
          "[6 Marks] Explain the methodology and practical applications of Sentiment Analysis (Opinion Mining) for corporate brand monitoring."
        ]
      },
      {
        id: "bi-u6-big-data-hadoop",
        name: "Big Data Ecosystem: The 5 Vs, Hadoop HDFS & Apache Spark",
        unit: 6,
        unitTitle: "Unit 6: Big Data Analytics & Stream Processing",
        unitCode: "6.1",
        importance: "Very High",
        keyPoints: [
          "The 5 Vs of Big Data: Volume (scale of data), Velocity (speed of streaming data), Variety (structured, semi-structured, unstructured), Veracity (trustworthiness/noise), Value (business utility).",
          "Hadoop Distributed File System (HDFS): Master/Worker architecture (NameNode manages metadata, DataNodes store redundant data blocks).",
          "MapReduce Framework: Distributed programming model splitting computation into Map (filtering/sorting) and Reduce (aggregating) phases.",
          "Apache Spark: In-memory distributed computing engine replacing disk-bound MapReduce using Resilient Distributed Datasets (RDDs) and DataFrames.",
          "Stream Processing: Real-time event streaming architectures using Apache Kafka and Spark Streaming to process continuous sensor and financial transaction streams."
        ],
        theory: "Traditional relational databases cannot scale to terabytes and petabytes of unstructured clickstream or IoT sensor telemetry. Hadoop revolutionized distributed storage by breaking large files into blocks (typically 128MB) replicated across commodity servers via HDFS. However, Hadoop MapReduce writes intermediate results to local disk after every job stage, creating I/O bottlenecks. Apache Spark solves this by caching data in cluster RAM through Resilient Distributed Datasets (RDDs), accelerating iterative machine learning and graph algorithms by up to 100x.",
        code: `/*
MapReduce Word Count Paradigm:
Input Text: "apple banana apple"
1. Map Phase:
   ("apple", 1), ("banana", 1), ("apple", 1)
2. Shuffle & Sort:
   "apple"  -> [1, 1]
   "banana" -> [1]
3. Reduce Phase:
   "apple"  -> sum([1, 1]) = 2
   "banana" -> sum([1])    = 1
*/`,
        example: "A ride-sharing application streaming real-time driver GPS locations into Apache Kafka to match passengers and calculate dynamic surge pricing within milliseconds.",
        commonExamQuestions: [
          "[8 Marks] Describe the 5 Vs of Big Data. Explain the master-slave architecture of Hadoop HDFS (NameNode vs DataNode).",
          "[8 Marks] Explain the MapReduce programming model using a complete Word Count example. Why is Apache Spark significantly faster than MapReduce?"
        ]
      },
      {
        id: "bi-u7-emerging-trends-ethics",
        name: "Emerging Trends in Analytics, Data Governance & Privacy Ethics",
        unit: 7,
        unitTitle: "Unit 7: Business Analytics Emerging Trends and Ethics",
        unitCode: "7.1",
        importance: "High",
        keyPoints: [
          "Automated Machine Learning (AutoML): Automating data preprocessing, feature engineering, model selection, and hyperparameter tuning.",
          "Data Governance Frameworks: Managing data availability, usability, integrity, and security across the enterprise lifecycle.",
          "Regulatory Compliance: GDPR (General Data Protection Regulation) mandating right to explanation, right to be forgotten, and explicit consent.",
          "Data Privacy & Masking: Pseudonymization, tokenization, and Differential Privacy to prevent individual identification in aggregated analytical queries.",
          "Algorithmic Ethics & Bias: Preventing unfair demographic discrimination in automated credit scoring, insurance underwriting, and hiring algorithms."
        ],
        theory: "As business intelligence transitions from manual reporting to autonomous predictive algorithms, ethical governance becomes paramount. Data governance establishes clear data ownership, lineage, and metadata catalogs. Regulations such as the European Union's GDPR enforce severe penalties for non-compliance, mandating that individuals understand how their personal data is processed. Organizations must adopt Privacy-by-Design and audit machine learning training datasets to prevent historical human biases from being amplified by automated models.",
        code: `/*
Data Governance Core Pillars:
1. Data Quality: Accuracy, completeness, consistency, timeliness
2. Data Lineage: Auditable trail tracing data from operational source to executive KPI
3. Data Security: Role-Based Access Control (RBAC), column-level encryption
4. Privacy Compliance: Anonymization, consent management, automated purge policies
*/`,
        example: "Using k-anonymity and differential privacy when releasing public healthcare research datasets to ensure individual patient identities cannot be reverse-engineered.",
        commonExamQuestions: [
          "[8 Marks] What is Data Governance? Discuss its core principles and importance in modern data-driven enterprises.",
          "[6 Marks] Discuss the ethical implications of data analytics regarding algorithmic bias and personal data privacy (GDPR compliance)."
        ]
      }
    ],
    theoryTopics: [
      "Compare Inmon and Kimball data warehousing design philosophies.",
      "Derive the Apriori candidate generation algorithm and prove the Apriori pruning property.",
      "Explain the internal architecture of Apache Spark Resilient Distributed Datasets (RDDs) and DAG scheduler.",
      "Discuss modern techniques for preserving privacy in distributed analytics (Differential Privacy, Federated Learning)."
    ]
  },

  "Deep Learning (Track A)": {
    subjectName: "Deep Learning (Track A)",
    code: "BIT423CO",
    creditHours: 3,
    topics: [
      {
        id: "dl-u1-ann-basics",
        name: "Artificial Neural Networks: Biological vs Artificial, McCulloch-Pitts & Perceptron",
        unit: 1,
        unitTitle: "Unit 1: Basics of Artificial Neural Networks",
        unitCode: "1.1",
        importance: "Very High",
        keyPoints: [
          "Biological Inspiration: Dendrites (input channels), Soma/Cell Body (summation), Axon (transmission channel), Synapse (adaptive weight).",
          "McCulloch-Pitts Neuron (1943): Binary threshold unit taking binary inputs with excitatory and inhibitory connections; first mathematical model of computation in a neuron.",
          "Rosenblatt's Perceptron (1958): Introduced learnable real-valued continuous weights and automated convergence theorem.",
          "Perceptron Learning Rule: w_i := w_i + alpha * (y - y_hat) * x_i; guaranteed to converge if data is linearly separable.",
          "Minsky and Papert (1969): Proved single-layer perceptrons cannot compute the non-linear XOR function, triggering the first AI Winter."
        ],
        theory: "Artificial Neural Networks (ANNs) model information processing through interconnected directed graphs of simple computing nodes. The McCulloch-Pitts model demonstrated that networks of threshold units can perform fundamental logical operations (AND, OR, NOT). Rosenblatt augmented this by introducing adjustable synaptic weights updated through supervised feedback. However, single-layer networks are fundamentally limited to linear hyperplanes; non-linear separations require multi-layered networks equipped with non-linear activation functions.",
        code: `# McCulloch-Pitts Neuron for Logical AND gate
import numpy as np

def mp_neuron_and(x1, x2):
    w1, w2, threshold = 1, 1, 2
    net = x1 * w1 + x2 * w2
    return 1 if net >= threshold else 0

print("AND(0,0):", mp_neuron_and(0, 0)) # 0
print("AND(1,1):", mp_neuron_and(1, 1)) # 1`,
        example: "Demonstrating linear separability: AND, OR, and NAND truth tables can be separated by a single straight line in a 2D coordinate plane; XOR cannot.",
        commonExamQuestions: [
          "[8 Marks] Compare biological neurons with artificial neurons. Explain the McCulloch-Pitts neuron model with a logical AND implementation.",
          "[6 Marks] State and explain the Perceptron Learning Rule. Prove why a single-layer perceptron fails to separate XOR inputs."
        ]
      },
      {
        id: "dl-u2-feedforward-backprop",
        name: "Feedforward Neural Networks & Backpropagation Derivation",
        unit: 2,
        unitTitle: "Unit 2: Feedforward Neural Networks and Backpropagation",
        unitCode: "2.1",
        importance: "Very High",
        keyPoints: [
          "Multilayer Perceptron (MLP) architecture: Input layer, one or more hidden layers, and output layer with feedforward connections.",
          "Universal Approximation Theorem: A feedforward network with a single hidden layer containing finite neurons and non-linear activations can approximate any continuous function.",
          "Activation Functions: Sigmoid sigma(z) = 1/(1+e^-z), Tanh tanh(z), ReLU max(0, z), Leaky ReLU max(0.01z, z), Softmax for multiclass probability.",
          "Cost Functions: Mean Squared Error (MSE) for regression; Cross-Entropy Loss for binary and multi-class classification.",
          "Backpropagation: Backward propagation of error using the Chain Rule of calculus to compute loss gradients with respect to every weight."
        ],
        theory: "Feedforward networks process inputs sequentially across layers without recurrent loops: a^[l] = g^[l](W^[l] a^[l-1] + b^[l]). During backpropagation, the partial derivative of the scalar loss L with respect to layer weights dL/dW^[l] is computed backward from the output layer. For a hidden layer, delta^[l] = (W^[l+1]^T delta^[l+1]) elementwise-multiplied by g'^[l](z^[l]). The vanishing gradient problem arises when deep networks use Sigmoid or Tanh, whose derivatives saturate at values <= 0.25, exponentially diminishing gradients as they propagate backward through many layers.",
        code: `/*
Backpropagation Chain Rule Derivation:
For output layer L:
dLoss / dW^[L] = (dLoss / da^[L]) * (da^[L] / dz^[L]) * (dz^[L] / dW^[L])
Let delta^[L] = (a^[L] - y)  (for Cross-Entropy + Softmax)
Then:
dLoss / dW^[L] = delta^[L] * (a^[L-1])^T
dLoss / db^[L] = delta^[L]

For preceding hidden layer l:
delta^[l] = (W^[l+1]^T * delta^[l+1]) * g'^[l](z^[l])
dLoss / dW^[l] = delta^[l] * (a^[l-1])^T
*/`,
        example: "Derivative of Sigmoid: sigma'(z) = sigma(z) * (1 - sigma(z)). Maximum derivative occurs at z=0, yielding sigma'(0) = 0.5 * 0.5 = 0.25.",
        commonExamQuestions: [
          "[10 Marks] Derive the Backpropagation weight update equations step-by-step for a 3-layer neural network using the Chain Rule.",
          "[8 Marks] Explain the Vanishing Gradient problem in deep networks. Why does the Rectified Linear Unit (ReLU) activation function alleviate this issue?"
        ]
      },
      {
        id: "dl-u3-optimization-regularization",
        name: "Deep Network Optimization, Weight Initialization & Regularization",
        unit: 3,
        unitTitle: "Unit 3: Deep Neural Networks and Optimization",
        unitCode: "3.1",
        importance: "Very High",
        keyPoints: [
          "Gradient Descent Variants: Batch GD (computes over full dataset, slow), Stochastic GD (single sample, noisy), Mini-batch GD (typical batch size 32-256).",
          "Advanced Optimizers: Momentum (accelerates in consistent directions), RMSprop (scales by moving average of squared gradients), Adam (combines Momentum + RMSprop).",
          "Weight Initialization: Zero initialization causes symmetry failure; Xavier/Glorot initialization for Tanh; He/Kaiming initialization for ReLU.",
          "Batch Normalization: Normalizes hidden layer inputs across mini-batch (zero mean, unit variance) to stabilize internal covariate shift.",
          "Regularization in Deep Learning: Dropout (randomly deactivates neurons during training with probability p), L2 Weight Decay, Early Stopping."
        ],
        theory: "Training deep networks requires navigating complex non-convex loss surfaces filled with saddle points and ravines. Standard SGD oscillates across narrow ravines; Momentum incorporates exponentially decaying moving averages of past gradients to accelerate along relevant dimensions. Adam (Adaptive Moment Estimation) computes adaptive learning rates per parameter, tracking both the first moment (mean) and second raw moment (uncentered variance). Batch Normalization reduces internal covariate shift, allowing higher learning rates and reducing dependence on delicate weight initialization.",
        code: `/*
Adam Optimizer Algorithm:
m_t = beta1 * m_{t-1} + (1 - beta1) * g_t       (First moment: Momentum)
v_t = beta2 * v_{t-1} + (1 - beta2) * (g_t)^2   (Second moment: RMSprop)

Bias corrections:
m_hat = m_t / (1 - beta1^t)
v_hat = v_t / (1 - beta2^t)

Weight update:
theta_t = theta_{t-1} - (alpha / (sqrt(v_hat) + epsilon)) * m_hat
(Standard defaults: beta1=0.9, beta2=0.999, epsilon=1e-8)
*/`,
        example: "Applying Dropout with rate p=0.5: during forward training, half the hidden activations are zeroed out and remaining outputs scaled by 1/(1-p) = 2.0 (Inverted Dropout).",
        commonExamQuestions: [
          "[10 Marks] Explain the Adam optimization algorithm. How does it combine the advantages of Momentum and RMSprop?",
          "[8 Marks] Discuss Dropout and Batch Normalization. Explain how each prevents overfitting and stabilizes deep network training."
        ]
      },
      {
        id: "dl-u4-cnn-architectures",
        name: "Convolutional Neural Networks (CNNs) & Landmark Architectures",
        unit: 4,
        unitTitle: "Unit 4: Convolutional Neural Networks (CNNs)",
        unitCode: "4.1",
        importance: "Very High",
        keyPoints: [
          "CNN Core Concepts: Local receptive fields, shared weights, and spatial subsampling.",
          "Convolution Operation: Sliding learnable kernels/filters across 2D/3D spatial input to generate Feature Maps.",
          "Hyperparameters: Kernel Size (e.g., 3x3), Stride (step size), Padding ('valid' vs 'same').",
          "Output Dimension Formula: Output_Size = floor((Input_Size - Kernel_Size + 2*Padding) / Stride) + 1.",
          "Pooling Layers: Max Pooling and Average Pooling reduce spatial dimensions, providing translation invariance.",
          "Landmark Architectures: LeNet-5 (digits), AlexNet (ImageNet 2012, ReLU, Dropout), VGG-16 (small 3x3 filters), ResNet (Residual skip connections resolving degradation)."
        ],
        theory: "Standard fully connected networks fail on high-resolution image data because parameter counts explode and spatial pixel locality is destroyed. CNNs exploit parameter sharing (the same filter detects edges across the entire image) and spatial hierarchy (early layers detect low-level edges; deeper layers detect complex textures and object parts). In very deep networks (>20 layers), training error degrades due to optimization difficulty; ResNet solves this by introducing residual skip connections: H(x) = F(x) + x, enabling gradients to flow unimpeded directly through identity mappings.",
        code: `import torch
import torch.nn as nn

class SimpleCNN(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, padding=1)
        self.relu = nn.ReLU()
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        self.fc = nn.Linear(32 * 16 * 16, num_classes)

    def forward(self, x):
        x = self.pool(self.relu(self.conv1(x)))
        x = x.view(x.size(0), -1)
        return self.fc(x)`,
        example: "Given an input image of 32x32, kernel size 5x5, padding 0, stride 1: Output size = (32 - 5 + 0)/1 + 1 = 28x28.",
        commonExamQuestions: [
          "[10 Marks] Explain the building blocks of a Convolutional Neural Network (Convolution, Activation, Pooling, Fully Connected layers). Calculate output dimensions given input parameters.",
          "[8 Marks] Explain the architectural innovation of ResNet (Residual Networks). How do skip connections overcome the degradation problem in deep networks?"
        ]
      },
      {
        id: "dl-u5-rnn-lstm",
        name: "Recurrent Neural Networks (RNNs), Vanishing Gradients & LSTMs",
        unit: 5,
        unitTitle: "Unit 5: Recurrent Neural Networks (RNNs)",
        unitCode: "5.1",
        importance: "Very High",
        keyPoints: [
          "Recurrent Neural Networks (RNNs) process sequential temporal data by maintaining an internal hidden state: h_t = tanh(W_hh * h_{t-1} + W_xh * x_t + b_h).",
          "Backpropagation Through Time (BPTT): Unrolls the network across time steps to compute temporal gradients.",
          "Vanishing and Exploding Gradients in RNNs: Repeated multiplication by weight matrices W_hh causes gradients to decay or explode exponentially over long sequences.",
          "Long Short-Term Memory (LSTM): Resolves long-term dependencies using an explicit Memory Cell (C_t) regulated by three multiplicative gates.",
          "LSTM Gates: Forget Gate (f_t: what to discard), Input Gate (i_t: what new info to store), Output Gate (o_t: what to output based on cell state).",
          "Gated Recurrent Unit (GRU): Compact alternative merging cell state and hidden state, utilizing Reset and Update gates."
        ],
        theory: "Feedforward networks assume all inputs and outputs are independent. Sequential tasks (machine translation, speech recognition, stock forecasting) depend inherently on historical context. Standard vanilla RNNs struggle with sequences longer than 10-20 steps because unrolling across time compounds matrix multiplication, causing gradients to vanish to zero. LSTMs (Hochreiter & Schmidhuber, 1997) counter this by creating an uninterrupted 'cell state highway' where information flows linearly with constant error carousels, modified only by additive gate interactions.",
        code: `/*
LSTM Cell Equations at time step t:
1. Forget Gate:
   f_t = sigma(W_f * [h_{t-1}, x_t] + b_f)
2. Input Gate & Candidate State:
   i_t = sigma(W_i * [h_{t-1}, x_t] + b_i)
   C_tilde_t = tanh(W_c * [h_{t-1}, x_t] + b_c)
3. Cell State Update:
   C_t = f_t * C_{t-1} + i_t * C_tilde_t
4. Output Gate & Hidden State:
   o_t = sigma(W_o * [h_{t-1}, x_t] + b_o)
   h_t = o_t * tanh(C_t)
*/`,
        example: "In natural language processing, when predicting the verb in 'The cats that lived in the barn ... WERE hungry', the forget and input gates preserve the plural context 'cats' across long intervening clauses.",
        commonExamQuestions: [
          "[10 Marks] Explain the architecture and mathematical equations of an LSTM cell. Detail the purpose of the Forget Gate, Input Gate, and Output Gate.",
          "[8 Marks] Explain Backpropagation Through Time (BPTT) and analyze why vanilla RNNs fail on long-term sequential dependencies."
        ]
      },
      {
        id: "dl-u6-generative-models",
        name: "Generative Models: Autoencoders, VAEs & Generative Adversarial Networks",
        unit: 6,
        unitTitle: "Unit 6: Generative Models",
        unitCode: "6.1",
        importance: "High",
        keyPoints: [
          "Discriminative Models (p(y|x)) classify inputs; Generative Models (p(x) or p(x,y)) learn underlying data distributions to generate novel synthetic samples.",
          "Autoencoders (AE): Unsupervised networks consisting of an Encoder (compresses input into low-dimensional bottleneck z) and Decoder (reconstructs input from z).",
          "Variational Autoencoders (VAE): Probabilistic generative models enforcing that the latent space follows a standard normal Gaussian distribution N(0, I) via Kullback-Leibler (KL) divergence loss.",
          "Reparameterization Trick: Enables backpropagation through stochastic nodes: z = mu + sigma * epsilon, where epsilon ~ N(0, I).",
          "Generative Adversarial Networks (GANs): Minimax game between a Generator G (creates realistic fakes) and Discriminator D (distinguishes real from fake)."
        ],
        theory: "Generative modeling seeks to sample new data points from high-dimensional probability distributions. Standard autoencoders compress data but their latent spaces have arbitrary holes, preventing smooth random sampling. VAEs enforce a continuous, probabilistic latent prior by optimizing the Evidence Lower Bound (ELBO), balancing reconstruction loss with KL divergence. GANs (Goodfellow, 2014) abandon explicit density estimation, framing training as a zero-sum game: min_G max_D V(D, G) = E_{x}[log D(x)] + E_{z}[log(1 - D(G(z)))]. At Nash equilibrium, the Generator synthesizes outputs indistinguishable from real data (D(x) = 0.5).",
        code: `/*
GAN Minimax Game Formulation:
min_G max_D V(D, G) = E_{x ~ p_data(x)} [log D(x)] + E_{z ~ p_z(z)} [log(1 - D(G(z)))]

Training Loop:
1. Update Discriminator D:
   Maximize log D(x_real) + log(1 - D(G(z_noise)))
2. Update Generator G:
   Minimize log(1 - D(G(z_noise)))  [or Maximize log D(G(z_noise))]
*/`,
        example: "Deepfake image generation and super-resolution upscaling synthesized by Deep Convolutional GANs (DCGANs).",
        commonExamQuestions: [
          "[10 Marks] Explain the minimax game architecture of Generative Adversarial Networks (GANs). Write the objective function and explain the roles of Generator and Discriminator.",
          "[8 Marks] Describe Variational Autoencoders (VAEs). Explain the Reparameterization Trick and why it is necessary for gradient backpropagation."
        ]
      },
      {
        id: "dl-u7-applications-transformers",
        name: "Applications in Computer Vision, NLP & Transformer Self-Attention",
        unit: 7,
        unitTitle: "Unit 7: Applications in Vision, Speech and NLP",
        unitCode: "7.1",
        importance: "Very High",
        keyPoints: [
          "Computer Vision Applications: Object Detection (YOLO - You Only Look Once, Faster R-CNN) and Semantic Segmentation (U-Net).",
          "YOLO frames object detection as a single regression problem, predicting bounding boxes and class probabilities simultaneously in real time.",
          "Natural Language Processing: Sequence-to-sequence models, Machine Translation, and Speech-to-Text (Whisper).",
          "Transformer Architecture (Vaswani et al., 2017): Eliminates recurrence entirely in favor of parallel Self-Attention mechanisms.",
          "Scaled Dot-Product Attention: Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V.",
          "Foundation Models: Pre-trained Large Language Models (LLMs) like GPT and BERT fine-tuned for downstream NLP tasks."
        ],
        theory: "Transformers revolutionized natural language processing by overcoming the sequential processing bottleneck of RNNs. Because self-attention calculates pairwise token interactions across the entire sentence in parallel matrix multiplications, training scales efficiently on GPUs. Queries (Q), Keys (K), and Values (V) are projected into multiple attention heads, enabling the model to jointly attend to information from different representation subspaces. Vision Transformers (ViT) extend this paradigm to computer vision by treating 16x16 image patches as word tokens.",
        code: `/*
Scaled Dot-Product Self-Attention Formula:
Attention(Q, K, V) = Softmax( (Q * K^T) / sqrt(d_k) ) * V

Where:
- Q (Query): What the current word is looking for
- K (Key): What each word in the sequence offers
- V (Value): The actual information content
- sqrt(d_k): Scaling factor to prevent dot products from growing excessively large
*/`,
        example: "In the sentence 'The bank of the river overflowed', self-attention links 'bank' with 'river' rather than financial institutions, correctly resolving word sense disambiguation.",
        commonExamQuestions: [
          "[10 Marks] Explain the Scaled Dot-Product Attention mechanism in the Transformer architecture. Detail Queries, Keys, Values, and the role of the scaling factor sqrt(d_k).",
          "[8 Marks] Explain the working of real-time object detection using YOLO (You Only Look Once). How does it differ from two-stage detectors like Faster R-CNN?"
        ]
      }
    ],
    theoryTopics: [
      "Derive the complete Backpropagation algorithm for an arbitrary deep feedforward neural network.",
      "Compare Batch Normalization and Layer Normalization in deep learning architectures.",
      "Explain the mathematical differences between Autoencoders, VAEs, and GANs.",
      "Detail the Multi-Head Attention mechanism and positional encodings in Transformer architectures."
    ]
  },

  "Digital Commerce (Track B)": {
    subjectName: "Digital Commerce (Track B)",
    code: "BIT428CO",
    creditHours: 3,
    topics: [
      {
        id: "dc-u1-ecommerce-foundations",
        name: "E-Commerce Business Models, Digital Payments & Security Protocols",
        unit: 1,
        unitTitle: "Unit 1: E-Commerce Foundations",
        unitCode: "1.1",
        importance: "Very High",
        keyPoints: [
          "E-Commerce Classification: B2C (Amazon, Daraz), B2B (Alibaba), C2C (eBay, Hamrobazaar), C2B (freelance marketplaces), G2C.",
          "Revenue Models: Advertising, Subscription, Transaction Fee, Sales, and Affiliate referral models.",
          "Digital Payment Systems: Credit/Debit cards, Digital Wallets (eSewa, Khalti), QR-code payments (Fonepay), and Automated Clearing House (NCHL).",
          "Security Architecture: TLS/SSL encryption, PCI-DSS compliance (Payment Card Industry Data Security Standard), and 3D-Secure 2-Factor Authentication (OTP).",
          "Payment Gateway Integration: Secure API redirection/tokenization between merchant website, payment gateway, and acquiring bank."
        ],
        theory: "Digital commerce encompasses electronic transactions across telecommunication networks. Securing financial transactions requires end-to-end cryptographic integrity. Payment gateways prevent merchants from storing sensitive credit card numbers (Primary Account Numbers) by implementing tokenization, where sensitive cardholder data is swapped for an irreversible cryptogram. E-commerce sites must adhere to strict PCI-DSS standards, enforcing HTTPS/TLS encryption and multi-factor authentication for checkout sessions.",
        code: `/*
Online Payment Gateway Redirection Workflow:
1. Customer initiates checkout on Merchant Site
2. Merchant creates signed payment request with payload:
   { amount: 1500, order_id: "ORD-9912", hash: "SHA256(amount+merchant_key)" }
3. Customer redirected to Payment Gateway (e.g. eSewa / Fonepay)
4. Customer authenticates with PIN/OTP on Gateway domain
5. Gateway redirects back to Merchant Callback URL with signed Transaction Token
6. Merchant server calls Gateway Server-to-Server Verification API
7. Order status updated to PAID
*/`,
        example: "Integrating Khalti/eSewa in Nepal: The merchant server initiates a transaction request via REST API, receives a payment token, and launches the client-side checkout modal.",
        commonExamQuestions: [
          "[8 Marks] Explain the major business models of e-Commerce (B2C, B2B, C2C, P2P) with real-world examples. What are the primary revenue generation models?",
          "[8 Marks] Explain the step-by-step payment processing workflow when a customer pays using an online digital wallet. What is PCI-DSS compliance?"
        ]
      },
      {
        id: "dc-u2-eretailing-omnichannel",
        name: "Electronic Retailing (E-Tailing), Supply Chain & Drop-Shipping",
        unit: 2,
        unitTitle: "Unit 2: Electronic Retailing",
        unitCode: "2.1",
        importance: "High",
        keyPoints: [
          "E-Tailing Models: Pure-play online retailers (no physical stores) vs Click-and-Mortar retailers (hybrid physical and online presence).",
          "Omni-channel Retailing: Seamless integration of physical brick-and-mortar storefronts, mobile apps, web stores, and social media channels.",
          "Drop-shipping Model: The retailer transfers customer orders directly to a third-party manufacturer/wholesaler who ships goods directly to the customer, eliminating inventory holding costs.",
          "E-Supply Chain Management (e-SCM): Automated inventory synchronization, warehouse management systems (WMS), and last-mile route optimization.",
          "Customer Retention: Post-purchase tracking, automated returns/refund management, and customer lifetime value (CLV) optimization."
        ],
        theory: "Electronic retailing shifts merchandising from physical shelf-space constraints to the 'Long Tail' of infinite online catalog varieties. In an omni-channel ecosystem, inventory must sync across physical Point-of-Sale (POS) registers and web platforms in real time. Drop-shipping removes upfront inventory capital requirements but introduces severe risks in quality control and shipment delays, requiring robust supplier API integration and SLA enforcement.",
        code: `/*
Drop-Shipping Operational Flow:
[Customer] --(Places order & pays $100)--> [E-Commerce Retailer]
                                                 |
                                     (Sends order & pays $60 wholesale)
                                                 v
                                        [Drop-Ship Supplier]
                                                 |
                                     (Ships product directly)
                                                 v
                                             [Customer]
Retailer Profit = $100 - $60 = $40 (Without holding inventory!)
*/`,
        example: "Click-and-Collect (BOPIS - Buy Online, Pick Up In Store) allows customers to order online and collect their goods at a local retail counter.",
        commonExamQuestions: [
          "[7 Marks] What is Electronic Retailing (E-Tailing)? Compare Pure-play e-retailers with Click-and-Mortar retailers.",
          "[6 Marks] Explain the Drop-shipping business model with its operational workflow, benefits, and inherent business risks."
        ]
      },
      {
        id: "dc-u3-commerce-trends-blockchain",
        name: "Digital Commerce Trends: Social Commerce & Blockchain Supply Chains",
        unit: 3,
        unitTitle: "Unit 3: Introduction to Digital Commerce Trends",
        unitCode: "3.1",
        importance: "Medium",
        keyPoints: [
          "Social Commerce: Selling products directly within social media platforms (Instagram Shop, TikTok Shop) without redirecting to an external site.",
          "Conversational Commerce: Shopping facilitated through messaging apps (WhatsApp Business, Messenger) and conversational AI bots.",
          "Headless Commerce: Decoupling the frontend presentation layer (React/Next.js) from the backend commerce engine (Shopify/Magento) via GraphQL/REST APIs.",
          "Blockchain in E-Commerce: Decentralized tamper-proof provenance tracking, smart contracts for automated escrow, and counterfeit prevention.",
          "Subscription Commerce: Recurring automated billing models for consumables and digital content (e.g., SaaS, subscription boxes)."
        ],
        theory: "Digital commerce is evolving toward headless, API-first architectures. By decoupling the user interface from backend inventory and checkout logic, brands can deploy rapid UI updates across mobile apps, smart displays, and IoT appliances without modifying core database backends. In international trade, blockchain smart contracts act as programmatic escrow: locking funds upon order placement and automatically releasing payments to suppliers upon verified shipping sensor or customs receipt.",
        code: `/*
Headless Commerce Architecture:
+-------------------------------------------------------------+
| Presentation Layer: Next.js Web App / Flutter Mobile / IoT  |
+-------------------------------------------------------------+
| API Gateway: GraphQL / RESTful Product & Checkout Endpoints |
+-------------------------------------------------------------+
| Headless Commerce Engines:                                   |
| - Product Catalog (Shopify Storefront API / CommerceLayer)   |
| - Payment Gateway (Stripe / eSewa)                           |
| - CMS Content (Strapi / Contentful)                          |
+-------------------------------------------------------------+
*/`,
        example: "Buying organic coffee beans via an Instagram post where tapping the product tag executes in-app checkout via stored credentials.",
        commonExamQuestions: [
          "[7 Marks] Explain the concept and advantages of 'Headless Commerce' compared to traditional monolithic e-commerce platforms.",
          "[6 Marks] How can Blockchain technology enhance supply chain traceability and customer trust in digital commerce?"
        ]
      },
      {
        id: "dc-u4-mobile-commerce",
        name: "Fundamentals of Mobile Commerce (M-Commerce) & Mobile UX",
        unit: 4,
        unitTitle: "Unit 4: Fundamentals of Mobile Commerce",
        unitCode: "4.1",
        importance: "High",
        keyPoints: [
          "M-Commerce: Electronic commerce transactions conducted using wireless handheld mobile devices such as smartphones and tablets.",
          "M-Commerce Technologies: Mobile wallets, Near Field Communication (NFC contactless payments), QR-code scanning, and Location-Based Services (LBS).",
          "Progressive Web Apps (PWAs): Web applications utilizing service workers and web app manifests to deliver native-app-like offline capabilities and push notifications.",
          "Mobile UX/UI Best Practices: Thumb-friendly navigation zones, one-click checkout (Apple Pay/Google Pay), autofill inputs, and minimal text entry.",
          "Security Challenges in M-Commerce: Device theft, insecure public Wi-Fi networks, mobile malware, and SMS OTP interception."
        ],
        theory: "Mobile commerce accounts for over 70% of global e-commerce web traffic. However, mobile conversion rates historically lag desktop rates due to high checkout friction. M-commerce addresses this through simplified mobile UI patterns, biometric authentication (fingerprint and Face ID), and Progressive Web Apps (PWAs) that load instantly even under poor network conditions. Location-based services leverage GPS telemetry to serve localized promotions and calculate exact doorstep delivery timelines.",
        code: `// PWA Service Worker caching strategy for offline product catalogs
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((fetchRes) => {
                return caches.open('v1-products').then((cache) => {
                    cache.put(event.request, fetchRes.clone());
                    return fetchRes;
                });
            });
        }).catch(() => caches.match('/offline.html'))
    );
});`,
        example: "Using Fonepay QR code scanning at a grocery store checkout counter to execute an instant peer-to-merchant (P2M) mobile bank transfer.",
        commonExamQuestions: [
          "[8 Marks] What is M-Commerce? Explain how Progressive Web Apps (PWAs) and Near Field Communication (NFC) transform mobile shopping.",
          "[6 Marks] Discuss essential Mobile UI/UX design considerations that optimize mobile e-commerce checkout conversion rates."
        ]
      },
      {
        id: "dc-u5-digital-marketing-seo",
        name: "Digital Marketing, Search Engine Optimization (SEO) & SEM",
        unit: 5,
        unitTitle: "Unit 5: Digital Marketing",
        unitCode: "5.1",
        importance: "Very High",
        keyPoints: [
          "Search Engine Optimization (SEO): Techniques to improve organic search visibility on search engines like Google.",
          "On-Page SEO: Semantic HTML headers (h1, h2), meta descriptions, keyword density, internal linking, image alt tags, structured data (Schema.org).",
          "Off-Page SEO: Inbound high-authority backlinks, domain authority (DA), and digital brand citations.",
          "Technical SEO: Page load speed (Core Web Vitals - LCP, INP, CLS), mobile responsiveness, XML sitemaps, and robots.txt.",
          "Search Engine Marketing (SEM) & Pay-Per-Click (PPC): Paid advertising (Google Ads) bidding on commercial keywords using Quality Score and Cost-Per-Click (CPC).",
          "Conversion Rate Optimization (CRO): A/B testing landing pages to maximize the percentage of visitors who complete purchases."
        ],
        theory: "Digital marketing drives qualified traffic into e-commerce conversion funnels. Search engines rank pages based on relevance and authority. On-page optimization ensures crawlers understand product specifications using Schema.org Product structured data. Technical SEO satisfies Google Core Web Vitals to deliver fast, stable rendering. When organic ranking requires time, SEM provides immediate traffic through real-time keyword auctions where Ad Rank = Bid Amount * Quality Score.",
        code: `<!-- Schema.org JSON-LD Structured Data for E-Commerce Product -->
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Sony WH-1000XM5 Wireless Headphones",
  "image": "https://example.com/photos/sony.jpg",
  "description": "Noise canceling wireless over-ear headphones",
  "brand": { "@type": "Brand", "name": "Sony" },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "NPR",
    "price": "48000",
    "availability": "https://schema.org/InStock"
  }
}
</script>`,
        example: "Running an A/B test comparing a green 'Buy Now' button against an orange 'Buy Now' button to measure statistically significant differences in conversion rate.",
        commonExamQuestions: [
          "[8 Marks] Explain the differences between SEO (organic) and SEM (paid). Detail essential On-Page and Technical SEO factors for e-commerce sites.",
          "[6 Marks] What are Google Core Web Vitals (LCP, INP, CLS)? Why are they critical for e-commerce search rankings and user retention?"
        ]
      },
      {
        id: "dc-u6-cms-wordpress",
        name: "Web Content Management Systems (CMS): WordPress & WooCommerce",
        unit: 6,
        unitTitle: "Unit 6: Web Content Management Systems",
        unitCode: "6.1",
        importance: "High",
        keyPoints: [
          "Web CMS: Software application allowing non-technical users to create, edit, manage, and publish digital web content without writing raw HTML/CSS.",
          "Core CMS Architecture: Content Management Application (CMA - graphical user interface) and Content Delivery Application (CDA - compiles backend code into rendered web pages).",
          "Monolithic CMS (WordPress, Joomla, Drupal) vs Headless CMS (Strapi, Sanity).",
          "E-Commerce Extensions: WooCommerce turns standard WordPress into a fully functional shopping cart with catalog, tax, and shipping management.",
          "Security Hardening: SQL injection prevention, cross-site scripting (XSS) filters, secure authentication plugins, and automated database backups."
        ],
        theory: "WordPress powers over 40% of all websites globally. Its plugin and theme architecture enables rapid deployment of enterprise web stores. WooCommerce hooks into the WordPress database schema, adding custom post types for products and orders. To maintain security, CMS installations must strictly sanitize user inputs, apply principle-of-least-privilege database user credentials, enforce SSL encryption, and maintain automated plugin vulnerability patch cycles.",
        code: `/*
WordPress / WooCommerce Database Core Entity Relationships:
wp_posts          -> Stores product data (post_type = 'product')
wp_postmeta       -> Stores product metadata (_price, _sku, _stock)
wp_woocommerce_order_items     -> Line items belonging to orders
wp_woocommerce_order_itemmeta -> Line item details (quantity, tax, subtotal)
*/`,
        example: "Configuring a custom shipping zone in WooCommerce that applies flat-rate delivery charges inside Kathmandu Valley and weight-based courier rates for external districts.",
        commonExamQuestions: [
          "[8 Marks] Explain the architecture and components of a Web Content Management System (CMS). Compare Monolithic and Headless CMS.",
          "[6 Marks] How does WooCommerce transform WordPress into an e-commerce platform? Discuss security hardening techniques for CMS platforms."
        ]
      },
      {
        id: "dc-u7-ai-in-commerce",
        name: "Artificial Intelligence in Commerce: Recommenders & Dynamic Pricing",
        unit: 7,
        unitTitle: "Unit 7: Application of Artificial Intelligence in Commerce",
        unitCode: "7.1",
        importance: "Very High",
        keyPoints: [
          "Recommendation Engines: Collaborative Filtering (user-user, item-item) vs Content-Based Filtering (matching product metadata).",
          "Cold-Start Problem: Challenge of generating recommendations for brand-new users or newly listed products with zero interaction history.",
          "Dynamic Pricing Algorithms: Machine learning models adjusting prices in real time based on demand elasticity, competitor rates, inventory levels, and customer browsing history.",
          "Visual Search: Convolutional neural networks allowing shoppers to upload photos to find identical or aesthetically similar clothing/furniture items.",
          "Conversational AI Chatbots: Large language model assistants providing personalized product discovery, sizing recommendations, and order status updates."
        ],
        theory: "AI recommendation systems generate up to 35% of revenue on leading platforms like Amazon. Collaborative filtering constructs a sparse User-Item interaction matrix R. In user-based filtering, similarity between users u and v is computed via Cosine Similarity or Pearson Correlation. The cold-start problem is mitigated through hybrid systems that combine collaborative filtering with content-based metadata and popular trending fallbacks. Dynamic pricing algorithms optimize revenue by predicting price elasticity of demand in real time.",
        code: `import numpy as np

# Cosine Similarity for Collaborative Filtering
def cosine_similarity(u, v):
    dot_product = np.dot(u, v)
    norm_u = np.linalg.norm(u)
    norm_v = np.linalg.norm(v)
    if norm_u == 0 or norm_v == 0:
        return 0.0
    return dot_product / (norm_u * norm_v)

# User ratings vectors across 4 products
user_A = np.array([5, 3, 0, 1])
user_B = np.array([4, 3, 0, 2])
print("Similarity between User A and User B:", cosine_similarity(user_A, user_B))`,
        example: "Dynamic pricing on airline and ride-sharing apps: automatically increasing seat prices as flight departure approaches and remaining ticket inventory drops below 10%.",
        commonExamQuestions: [
          "[10 Marks] Explain Collaborative Filtering vs Content-Based Filtering in recommendation systems. How is the Cold-Start problem solved?",
          "[6 Marks] Discuss how Dynamic Pricing algorithms operate in digital commerce. What are the economic and ethical considerations?"
        ]
      }
    ],
    theoryTopics: [
      "Compare monolithic e-commerce platforms (Magento, WooCommerce) with microservices-based headless architectures.",
      "Explain the mathematical formulation of Cosine Similarity and Matrix Factorization (SVD) in recommender systems.",
      "Discuss security protocols in digital payments, focusing on tokenization and 3D-Secure 2.0 standards.",
      "Detail the technical and on-page optimization steps required to achieve top Google Core Web Vitals scores."
    ]
  },

  "Multimedia and Application (Track B)": {
    subjectName: "Multimedia and Application (Track B)",
    code: "BIT429CO",
    creditHours: 3,
    topics: [
      {
        id: "mm-u1-multimedia-systems",
        name: "Multimedia Systems Architecture, Elements & Requirements",
        unit: 1,
        unitTitle: "Unit 1: Multimedia Systems",
        unitCode: "1.1",
        importance: "High",
        keyPoints: [
          "Multimedia Definition: Integration of multiple media elements (text, audio, images, graphics, video, animation) captured, processed, stored, and transmitted digitally.",
          "Media Classification: Continuous/Time-dependent (audio, video, animation) vs Discrete/Time-independent (text, static graphics, images).",
          "Key Properties: Digital representation, computer-controlled processing, integrated presentation, and interactive user control.",
          "Hardware Requirements: High-throughput CPUs/GPUs, hardware video decoders, large storage capacities, and high-speed network interfaces.",
          "Software Architectures: Multimedia OS with real-time scheduling, media frameworks (DirectShow, GStreamer), and standard codec libraries."
        ],
        theory: "Multimedia systems differ fundamentally from traditional computing environments due to temporal constraints. Continuous media (audio and video) must be captured, processed, and presented at strictly regular time intervals (e.g., 30 frames per second, 44.1 kHz audio). Failure to maintain temporal deadlines introduces jitter and distortion, ruining user experience. A comprehensive multimedia system orchestrates high-throughput storage, real-time operating system schedulers, compression codecs, and network streaming protocols.",
        code: `/*
Multimedia Media Classification:
Media Type   | Temporal Nature | Examples              | Critical Constraint
Text         | Discrete        | PDF, HTML, TXT        | Flawless data integrity
Images       | Discrete        | JPEG, PNG, SVG        | High spatial resolution
Audio        | Continuous      | MP3, AAC, PCM WAV     | Low jitter, sample sync
Video        | Continuous      | H.264, AV1, MP4       | Strict frame-rate (30/60fps)
Animation    | Continuous      | 2D/3D rigged models   | Synchronized keyframe timing
*/`,
        example: "A tele-education lecture stream displaying synchronized PowerPoint slides (discrete), instructor webcam video (continuous), and live microphone speech (continuous).",
        commonExamQuestions: [
          "[7 Marks] Define Multimedia. Differentiate between continuous (time-dependent) and discrete (time-independent) media elements with examples.",
          "[6 Marks] Discuss the essential hardware and software requirements for building a real-time multimedia computing workstation."
        ]
      },
      {
        id: "mm-u2-sound-audio",
        name: "Sound & Digital Audio: Sampling, Nyquist Theorem & MIDI",
        unit: 2,
        unitTitle: "Unit 2: Sound and Audio",
        unitCode: "2.1",
        importance: "Very High",
        keyPoints: [
          "Sound Waves: Analog continuous longitudinal pressure waves characterized by Frequency (pitch in Hz) and Amplitude (loudness in dB).",
          "Nyquist-Shannon Sampling Theorem: An analog signal can be perfectly reconstructed from digital samples if the sampling rate f_s is strictly greater than twice the highest frequency f_max: f_s > 2 * f_max.",
          "CD Quality Audio Standard: 44.1 kHz sampling rate (covers human audible range 20 Hz - 20 kHz), 16-bit linear quantization, 2 channels (stereo).",
          "Bitrate Formula: Bitrate (bps) = Sampling Rate (Hz) * Bit Depth (bits) * Number of Channels.",
          "Quantization Error & Signal-to-Noise Ratio (SNR): SNR approx 6.02 * n + 1.76 dB (where n is the number of quantization bits).",
          "Musical Instrument Digital Interface (MIDI): Symbolic control protocol transmitting musical events (Note On, Note Off, Pitch, Velocity) rather than sampled waveforms."
        ],
        theory: "Digitizing sound involves two steps: Sampling (discretizing continuous time) and Quantization (discretizing continuous amplitude into discrete binary levels). Undersampling results in aliasing, where high-frequency sounds fold into false low-frequency distortion (prevented using analog anti-aliasing low-pass filters). MIDI represents music as compact performance instructions (typically 1-3 bytes per event), requiring minuscule storage compared to raw digital audio waveforms.",
        code: `/*
Digital Audio Bitrate Calculation:
For CD-Audio:
Sampling Rate = 44,100 Hz
Bit Depth = 16 bits per sample
Channels = 2 (Stereo)

Bitrate = 44,100 * 16 * 2 = 1,411,200 bits/sec (1.411 Mbps)
Data size for 1 minute:
Size = (1,411,200 bps * 60 sec) / (8 * 1024 * 1024) approx 10.09 MB
*/`,
        example: "Telephone audio uses 8 kHz sampling rate and 8-bit companding (u-law or A-law), sufficient for capturing human speech up to 3.4 kHz with a bitrate of 64 kbps.",
        commonExamQuestions: [
          "[8 Marks] State and explain the Nyquist-Shannon Sampling Theorem. Calculate the bitrate and file size of a 3-minute stereo CD audio recording.",
          "[6 Marks] Compare digitized digital audio (e.g., PCM WAV) with Musical Instrument Digital Interface (MIDI) across file size, editability, and hardware dependence."
        ]
      },
      {
        id: "mm-u3-images-graphics",
        name: "Images & Computer Graphics: Color Models & Vector vs Raster",
        unit: 3,
        unitTitle: "Unit 3: Images and Graphics",
        unitCode: "3.1",
        importance: "High",
        keyPoints: [
          "Raster Graphics (Bitmaps): Pixel grid representations; resolution-dependent (zooming causes pixelation); formats: JPEG, PNG, GIF.",
          "Vector Graphics: Geometric primitives (points, lines, Bézier curves, polygons) defined mathematically; infinitely scalable without quality loss; formats: SVG, EPS.",
          "Color Perception: Human eye contains rod cells (luminance) and cone cells sensitive to Red, Green, and Blue wavelengths.",
          "Color Models: Additive RGB (monitors/displays), Subtractive CMYK (printing/dyes), and Human-perceptual HSL/HSV (Hue, Saturation, Value/Lightness).",
          "YUV / YCbCr Color Spaces: Separates Luminance (Y - brightness) from Chrominance (U/Cb, V/Cr - color); exploits human eye's higher sensitivity to brightness to achieve chroma subsampling (4:2:2, 4:2:0)."
        ],
        theory: "Digital images are two-dimensional matrices of color values f(x, y). In 24-bit True Color raster graphics, each pixel allocates 8 bits each to Red, Green, and Blue (16.7 million colors). Because the human visual system is far more sensitive to spatial luminance variations than color nuances, broadcast and digital video systems convert RGB into YCbCr and discard color details through chroma subsampling (e.g., 4:2:0 halves both horizontal and vertical color resolution without noticeable visual degradation).",
        code: `/*
RGB to YCbCr Conversion Matrix (ITU-R BT.601):
Y  =  0.299 * R + 0.587 * G + 0.114 * B
Cb = -0.169 * R - 0.331 * G + 0.500 * B + 128
Cr =  0.500 * R - 0.419 * G - 0.081 * B + 128
*/`,
        example: "A company logo designed in SVG vector format scales smoothly from a small 16x16 browser favicon to a massive 20-foot outdoor billboard without pixelation.",
        commonExamQuestions: [
          "[8 Marks] Differentiate between Raster Graphics and Vector Graphics with respect to resolution, file size, scaling, and application domains.",
          "[7 Marks] Explain the RGB, CMYK, and YUV/YCbCr color models. What is Chroma Subsampling (4:4:4, 4:2:2, 4:2:0) and why is it used?"
        ]
      },
      {
        id: "mm-u4-video-animation",
        name: "Digital Video & Animation Principles: Scanning & Standards",
        unit: 4,
        unitTitle: "Unit 4: Video and Animation",
        unitCode: "4.1",
        importance: "High",
        keyPoints: [
          "Persistence of Vision: Human optical phenomenon where an afterimage persists on the retina for approx 1/16th of a second, enabling the illusion of continuous motion.",
          "Scanning Techniques: Interlaced Scanning (odd and even lines drawn in alternate fields: 1080i) vs Progressive Scanning (full frame drawn sequentially: 1080p).",
          "Analog Television Standards: NTSC (525 lines, 29.97 fps, North America/Japan), PAL (625 lines, 25 fps, Europe/Asia/Nepal), SECAM (625 lines, 25 fps, France/Russia).",
          "Aspect Ratios: Standard 4:3 vs Widescreen 16:9.",
          "Principles of Animation (Disney's 12 Principles): Squash and Stretch, Anticipation, Staging, Follow Through, Ease-In and Ease-Out, Keyframing, and Morphing."
        ],
        theory: "Digital video consists of a rapid succession of static photographic images (frames) displayed at 24 to 60 frames per second. Interlaced scanning was developed historically to conserve broadcast bandwidth while mitigating visible flicker: displaying two half-resolution 'fields' sequentially per frame period. Modern computer screens use progressive scanning to eliminate motion combing artifacts. Computer animation relies on Keyframing: animators create critical extreme poses at key frames, while computer algorithms perform in-betweening (tweening) via mathematical interpolation.",
        code: `/*
Traditional TV Standards Comparison:
Standard | Total Lines | Active Lines | Refresh Rate | Frame Rate
NTSC     | 525 lines   | 480 lines    | 60 Hz field  | 29.97 fps
PAL      | 625 lines   | 576 lines    | 50 Hz field  | 25.00 fps
SECAM    | 625 lines   | 576 lines    | 50 Hz field  | 25.00 fps
*/`,
        example: "Applying 'Ease-in and Ease-out' via cubic Bézier interpolation curves so that a bouncing ball accelerates naturally under gravity rather than moving at robotic linear speeds.",
        commonExamQuestions: [
          "[7 Marks] Explain Interlaced vs Progressive scanning. Compare NTSC and PAL television broadcasting standards.",
          "[6 Marks] Discuss the fundamental principles of computer animation, focusing on Keyframing, Tweening, Morphing, and Squash and Stretch."
        ]
      },
      {
        id: "mm-u5-compression-jpeg-mpeg",
        name: "Data Compression: Lossless (Huffman, LZW) & Lossy (JPEG, MPEG)",
        unit: 5,
        unitTitle: "Unit 5: Data Compression",
        unitCode: "5.1",
        importance: "Very High",
        keyPoints: [
          "Need for Compression: Uncompressed 1080p RGB video at 60 fps requires approx 3 Gbps bandwidth, far exceeding standard storage and network channel limits.",
          "Lossless Compression: Perfect mathematical bit-for-bit reconstruction; formats: ZIP, PNG, FLAC; algorithms: Run-Length Encoding (RLE), Huffman, Lempel-Ziv-Welch (LZW).",
          "Lossy Compression: Irreversible psycho-perceptual omission of imperceptible data; formats: JPEG, MP3, H.264/MPEG-4.",
          "JPEG Image Compression Pipeline: Color space conversion (RGB -> YCbCr) -> Chroma subsampling (4:2:0) -> 8x8 Block Partitioning -> Discrete Cosine Transform (DCT) -> Quantization -> Zig-zag scanning -> Huffman Entropy Coding.",
          "MPEG Video Compression Frame Types: I-Frames (Intra-coded, standalone reference), P-Frames (Predicted from past frames), B-Frames (Bi-directional predicted from past and future frames)."
        ],
        theory: "Compression removes spatial, temporal, and statistical redundancies. Lossless Huffman coding assigns variable-length prefix codes based on character frequencies (frequent characters get shortest bit strings). In JPEG, the Discrete Cosine Transform (DCT) converts 8x8 spatial pixel blocks into 64 spatial frequency coefficients: one DC component (average block brightness) and 63 AC components. The Quantization step divides high-frequency coefficients by perceptual thresholds, zeroing out subtle textures human eyes cannot perceive. In MPEG, motion estimation algorithms track moving blocks across time, encoding only motion vectors and small prediction error residuals.",
        code: `/*
JPEG Compression Pipeline:
[RGB Image]
    |
    v (Color Space Conversion)
[YCbCr (4:2:0 Subsampling)]
    |
    v (Partition into 8x8 blocks)
[8x8 Spatial Blocks]
    |
    v (Discrete Cosine Transform)
[8x8 Frequency Coefficients (1 DC + 63 AC)]
    |
    v (Quantization Matrix: LOSSY STEP - High frequencies zeroed out!)
[Quantized Coefficients]
    |
    v (Zig-Zag Reordering: clusters trailing zeros together)
[1D Vector: DC, AC1, AC2 ... 0, 0, 0]
    |
    v (Run-Length & Huffman Coding)
[Compressed JPEG Bitstream]
*/`,
        example: "Huffman Coding: If character 'E' appears with probability 0.4, it is encoded with a single bit '0', while rare character 'Z' (prob 0.001) receives an 8-bit code '11111110'.",
        commonExamQuestions: [
          "[10 Marks] Explain the step-by-step pipeline of JPEG image compression. Which stage is responsible for lossy degradation?",
          "[10 Marks] Differentiate between I-Frames, P-Frames, and B-Frames in MPEG video compression. Explain how temporal redundancy is eliminated through Motion Estimation."
        ]
      },
      {
        id: "mm-u6-optical-storage",
        name: "Optical Storage Media: CD-ROM, DVD & Blu-Ray Architectures",
        unit: 6,
        unitTitle: "Unit 6: Optical Storage Media",
        unitCode: "6.1",
        importance: "Medium",
        keyPoints: [
          "Optical Recording Principle: Laser beams reading reflection variations between microscopic pits (recessed indentations) and lands (flat surfaces) along a continuous spiral track.",
          "CD-ROM: 780 nm infrared laser; track pitch 1.6 um; standard capacity 650-700 MB; uses Eight-to-Fourteen Modulation (EFM).",
          "DVD-ROM: 650 nm red laser; track pitch 0.74 um; dual-layer and double-sided configurations; capacity 4.7 GB to 17 GB.",
          "Blu-Ray Disc: 405 nm blue-violet laser; track pitch 0.32 um; capacity 25 GB (single-layer) to 50 GB (dual-layer).",
          "Error Correction: Reed-Solomon Cross-Interleaved Code (CIRC) and Cross-Interleaved Reed-Solomon Code (CIRC) recover data damaged by scratches and surface dust."
        ],
        theory: "Optical storage density is governed by optical diffraction limits: minimum focal spot size is proportional to wavelength / numerical aperture (lambda / NA). By shifting from infrared (780 nm) in CDs to red (650 nm) in DVDs and finally blue-violet (405 nm) in Blu-Ray, the laser spot diameter shrinks dramatically, allowing pit lengths and track pitches to contract. Transitions between pits and lands represent binary 1s (using Non-Return to Zero Inverted - NRZI encoding), while uniform pit or land lengths represent strings of binary 0s.",
        code: `/*
Optical Discs Physical Specifications:
Format   | Laser Wavelength | Numerical Aperture | Track Pitch | Standard Capacity
CD-ROM   | 780 nm (Infrared)| 0.45               | 1.6 um      | 700 MB
DVD      | 650 nm (Red)     | 0.60               | 0.74 um     | 4.7 GB (Single Layer)
Blu-Ray  | 405 nm (Blue)    | 0.85               | 0.32 um     | 25.0 GB (Single Layer)
*/`,
        example: "A Blu-Ray disc achieves nearly 35 times the capacity of a standard CD on an identical 120 mm polycarbonate disc substrate through shorter laser wavelength and higher lens numerical aperture.",
        commonExamQuestions: [
          "[8 Marks] Compare CD, DVD, and Blu-Ray optical storage technologies across laser wavelength, track pitch, numerical aperture, and capacity.",
          "[5 Marks] Explain how binary data (1s and 0s) is physically encoded and read using pits and lands on an optical disc."
        ]
      },
      {
        id: "mm-u7-multimedia-os-scheduling",
        name: "Multimedia Operating Systems: Real-Time Scheduling & Resource Management",
        unit: 7,
        unitTitle: "Unit 7: Multimedia Operating Systems",
        unitCode: "7.1",
        importance: "High",
        keyPoints: [
          "Multimedia Operating System Requirements: Real-time guarantees, high disk I/O throughput, predictable interrupt latencies, and synchronization.",
          "Hard Real-Time vs Soft Real-Time: In hard systems, missing a deadline constitutes fatal system failure; in multimedia (soft real-time), missing a deadline causes temporary playback stutter.",
          "Rate Monotonic (RM) Scheduling: Static priority algorithm assigning highest priority to tasks with the shortest periodic request periods.",
          "Earliest Deadline First (EDF) Scheduling: Dynamic priority algorithm assigning highest priority to the task whose deadline is closest.",
          "Multimedia File Systems: Continuous contiguous allocation and disk arm scheduling (SCAN, C-SCAN, Elevator) optimized for constant-rate media streaming."
        ],
        theory: "General-purpose operating system schedulers (like standard Linux CFS or Windows time-sharing) optimize for overall throughput and fairness, which can starve real-time audio threads. Multimedia operating systems utilize deterministic real-time scheduling. Under Rate Monotonic (RM), Liu & Layland proved that a system of n periodic tasks is guaranteed schedulable if total CPU utilization U <= n * (2^(1/n) - 1), asymptotically approaching ln(2) approx 69.3%. Earliest Deadline First (EDF) is an optimal dynamic scheduler capable of achieving 100% CPU utilization without missing deadlines.",
        code: `/*
Rate Monotonic (RM) vs Earliest Deadline First (EDF):
Metric          | Rate Monotonic (RM)         | Earliest Deadline First (EDF)
Priority Type   | Static (fixed at compile)   | Dynamic (shifts at runtime)
Assignment Rule | Priority proportional to 1/T| Priority proportional to 1/Deadline
Max Schedulable | ~69.3% CPU utilization      | 100% CPU utilization
Overhead        | Low runtime complexity      | High (frequent queue reordering)
*/`,
        example: "Two periodic multimedia tasks: Video Task 1 (period T1=40ms, computation C1=10ms) and Audio Task 2 (period T2=20ms, computation C2=5ms). Under RM, Audio gets higher priority because its period is shorter.",
        commonExamQuestions: [
          "[8 Marks] Differentiate between Rate Monotonic (RM) and Earliest Deadline First (EDF) scheduling algorithms. State Liu and Layland's schedulability condition for RM.",
          "[6 Marks] Why do general-purpose operating systems fail to handle continuous multimedia streams without real-time extensions?"
        ]
      },
      {
        id: "mm-u8-multimedia-communications",
        name: "Multimedia Communication Systems: QoS, RTP, RTCP & RTSP",
        unit: 8,
        unitTitle: "Unit 8: Multimedia Communication Systems",
        unitCode: "8.1",
        importance: "Very High",
        keyPoints: [
          "Quality of Service (QoS) Parameters: Bandwidth, Delay (latency), Jitter (delay variance), and Packet Loss.",
          "Jitter Buffers: Client-side playout buffers that temporarily store incoming packets to smooth out variable arrival times before playback.",
          "Real-Time Transport Protocol (RTP): Runs over UDP; provides payload identification, sequence numbering, and timestamping for synchronization.",
          "RTP Control Protocol (RTCP): Periodically exchanges transmission statistics (packet loss, jitter, RTT) between sender and receiver for adaptive rate control.",
          "Real-Time Streaming Protocol (RTSP): Application-level network control protocol acting as an 'internet VCR remote' (PLAY, PAUSE, TEARDOWN, RECORD)."
        ],
        theory: "TCP's reliable retransmission mechanism is ill-suited for real-time video calls: retransmitting a lost packet across a 150ms round-trip causes video playback to freeze. Real-time media runs over UDP using RTP (RFC 3550). RTP headers do not guarantee delivery, but provide 16-bit sequence numbers (enabling clients to detect packet loss and reorder packets) and 32-bit timestamps (enabling synchronized playout). Concurrently, RTSP manages the streaming session state over TCP, commanding the media server to stream, pause, or seek without transporting the actual media packets.",
        code: `/*
RTSP Client-Server Handshake Example:
Client -> Server:
DESCRIBE rtsp://media.example.com/live.mp4 RTSP/1.0
CSeq: 1

Server -> Client:
RTSP/1.0 200 OK
CSeq: 1
Content-Type: application/sdp (Session Description Protocol)

Client -> Server:
SETUP rtsp://media.example.com/live.mp4/trackID=1 RTSP/1.0
CSeq: 2
Transport: RTP/AVP;unicast;client_port=8000-8001

Client -> Server:
PLAY rtsp://media.example.com/live.mp4 RTSP/1.0
CSeq: 3
*/`,
        example: "Video conferencing platforms dynamically lowering webcam resolution from 1080p to 480p when RTCP reports packet loss exceeding 5%.",
        commonExamQuestions: [
          "[10 Marks] Explain the roles and interactions of RTP, RTCP, and RTSP in multimedia streaming. What fields in the RTP header enable synchronization and jitter mitigation?",
          "[6 Marks] Define Jitter and describe how a Playout Buffer compensates for packet arrival variance."
        ]
      },
      {
        id: "mm-u9-hypertext-mheg",
        name: "Hypertext, Hypermedia & MHEG Standards",
        unit: 9,
        unitTitle: "Unit 9: Documentation, Hypertext and MHEG",
        unitCode: "9.1",
        importance: "Medium",
        keyPoints: [
          "Hypertext: Non-linear electronic text containing clickable cross-references (hyperlinks) to other documents.",
          "Hypermedia: Extension of hypertext integrating audio, video, graphics, and animations into the linked non-linear document structure.",
          "Dexter Hypertext Reference Model: Foundational model defining three layers: Storage Layer (nodes and links), Within-Component Layer (content structures), and Runtime Layer (presentation and user interaction).",
          "MHEG (Multimedia and Hypermedia Information Coding Expert Group): ISO/IEC international standard defining declarative interactive multimedia objects for digital broadcasting (DVB/IPTV).",
          "HTML5 Multimedia Extensions: Standardized declarative tags (<video>, <audio>, <canvas>) replacing proprietary plugins (Flash, Silverlight)."
        ],
        theory: "Linear media forces users into sequential consumption (like reading a traditional novel from page 1 to 100). Hypertext and hypermedia decouple this, allowing dynamic, non-linear navigation across heterogeneous nodes. MHEG-5 was standardized to define object-oriented multimedia presentations in digital TV set-top boxes with low computational resources, specifying exact screen coordinates, audio playback cues, and interactive remote control buttons using declarative bytecode.",
        code: `<!-- Modern HTML5 Hypermedia Integration -->
<video controls width="640" poster="/images/poster.jpg">
  <source src="/media/lecture.mp4" type="video/mp4">
  <source src="/media/lecture.webm" type="video/webm">
  <track kind="subtitles" src="/subs/en.vtt" srclang="en" label="English" default>
  Your browser does not support HTML5 video.
</video>`,
        example: "Interactive Red Button digital television broadcasts during major sporting events allowing viewers to choose alternative camera angles and display real-time player statistics.",
        commonExamQuestions: [
          "[7 Marks] Differentiate between Hypertext and Hypermedia. Describe the three layers of the Dexter Hypertext Reference Model.",
          "[5 Marks] What is MHEG? Explain its historical role and technical features in interactive digital television broadcasting."
        ]
      },
      {
        id: "mm-u10-synchronization",
        name: "Multimedia Synchronization: Spatial, Temporal & Petri Net Models",
        unit: 10,
        unitTitle: "Unit 10: Synchronization",
        unitCode: "10.1",
        importance: "High",
        keyPoints: [
          "Spatial Synchronization: Positioning distinct media elements correctly on the 2D/3D display screen (e.g., subtitles centered at the bottom of the video frame).",
          "Temporal Synchronization: Maintaining correct timing relationships between different media streams.",
          "Intra-Media Synchronization: Maintaining regular time spacing between consecutive samples of a single media stream (e.g., 30 frames per second video).",
          "Inter-Media Synchronization: Maintaining temporal alignment between two or more related media streams (e.g., 'lip-sync' between audio and video tracks).",
          "Skew & Lip-Sync Threshold: Human ears perceive audio leading video by more than 80ms or lagging by more than 160ms as disorienting.",
          "Synchronization Models: Timeline-based, Hierarchical, Reference Points, and Timed Petri Nets (OCPN - Object Composition Petri Nets)."
        ],
        theory: "Because audio and video travel through separate network packets and hardware decoding pipelines, they experience differential processing delays. Without explicit synchronization mechanisms, audio drifts out of sync with speaker lip movements. Timed Petri Nets (such as Object Composition Petri Nets - OCPN) model concurrent multimedia playback mathematically, where transitions fire only after designated media duration timers elapse, guaranteeing synchronized progression.",
        code: `/*
Lip-Synchronization Tolerance Limits:
- In-Sync Region: Audio leads video by <= 20ms to lags by <= 40ms (Imperceptible)
- Acceptable Window: Audio leads by <= 80ms to lags by <= 160ms (Acceptable to most users)
- Annoying / Disorienting: Audio leads by > 80ms or lags by > 160ms (Unacceptable!)
*/`,
        example: "Timed Petri Net (OCPN) where Transition 1 fires after both Image Display (10s timer) and Audio Narration (10s playback) finish, before launching Video Clip 2.",
        commonExamQuestions: [
          "[8 Marks] Explain the difference between Intra-Media and Inter-Media synchronization. What is Lip-Sync and what are its human perceptual tolerance limits?",
          "[7 Marks] Describe how Timed Petri Nets (Object Composition Petri Nets - OCPN) model temporal multimedia presentation workflows."
        ]
      },
      {
        id: "mm-u11-abstraction-toolkits",
        name: "Abstraction of Programming, Authoring Metaphors & Toolkits",
        unit: 11,
        unitTitle: "Unit 11: Abstraction of Programming & Toolkits",
        unitCode: "11.1",
        importance: "Medium",
        keyPoints: [
          "Multimedia Authoring Metaphors: Conceptual paradigms used by authoring systems to organize interactive media.",
          "Card/Page-based Metaphor: Elements organized as pages in a book or cards in a stack (e.g., HyperCard, ToolBook).",
          "Icon/Flowchart-based Metaphor: Flow logic and interactive events organized as linked visual nodes on a flowchart (e.g., Authorware).",
          "Time/Timeline-based Metaphor: Elements organized across parallel tracks along a global horizontal timeline ruler (e.g., Adobe Director, Flash/Animate).",
          "Multimedia Software Toolkits & APIs: DirectX, OpenGL, WebRTC, GStreamer, and FFmpeg libraries providing low-level hardware abstraction."
        ],
        theory: "Multimedia authoring tools abstract away low-level buffer management and audio-video timing code, empowering instructional designers and artists to build interactive learning applications. In timeline-based metaphors, media elements are placed on parallel 'tracks' with keyframes indicating state changes over time. Modern web multimedia utilizes declarative web APIs and WebAssembly (Wasm) pipelines wrapped in frameworks like Three.js and Babylon.js for 3D graphics.",
        code: `/*
Multimedia Authoring Metaphor Taxonomy:
Metaphor Type   | Visual Organizing Model       | Classic Exemplar
Card / Page     | Stack of book pages           | Apple HyperCard, Asymetrix ToolBook
Icon / Flow     | Flowchart decision tree       | Macromedia Authorware
Timeline / Time | Multitrack horizontal ruler   | Adobe Director, Adobe Animate
Object / Scene  | Hierarchical scene graph nodes| Blender, Unity 3D, Unreal Engine
*/`,
        example: "Using Unity 3D or Adobe Animate where a playhead scrubs along a timeline, triggering sound effects at frame 45 and opening a quiz dialog box at frame 120.",
        commonExamQuestions: [
          "[7 Marks] Explain the major multimedia authoring metaphors (Card-based, Icon-based, Time-based) with their relative advantages and use cases.",
          "[5 Marks] Discuss the role of multimedia programming toolkits and APIs (DirectX, OpenGL, WebRTC) in cross-platform multimedia development."
        ]
      },
      {
        id: "mm-u12-multimedia-applications",
        name: "Multimedia Applications: Video-on-Demand, Virtual & Augmented Reality",
        unit: 12,
        unitTitle: "Unit 12: Multimedia Applications",
        unitCode: "12.1",
        importance: "High",
        keyPoints: [
          "Video-on-Demand (VoD): Systems enabling users to stream video content on demand with VCR control capabilities (Netflix, YouTube).",
          "VoD Architectures: True VoD (dedicated stream per user) vs Near VoD (staggered broadcasts across multiple channels).",
          "Virtual Reality (VR): Immersive, computer-generated 3D environment experienced through Head-Mounted Displays (HMDs) with 6 Degrees of Freedom (6-DoF).",
          "Augmented Reality (AR): Overlays interactive digital computer graphics and contextual data onto the real-world physical environment (Apple Vision Pro, Google Lens).",
          "Telemedicine & Distance Learning: Real-time high-fidelity multimedia streaming enabling remote surgical consultations, tele-radiology, and interactive virtual classrooms."
        ],
        theory: "Advances in broadband and mobile edge computing have driven multimedia applications into mission-critical domains. Video-on-Demand systems rely on Content Delivery Networks (CDNs) and Adaptive Bitrate Streaming (HLS, MPEG-DASH), slicing videos into 2-6 second chunks encoded at multiple resolutions; client video players monitor buffer health and automatically switch between 480p, 1080p, and 4K streams to prevent rebuffering. In AR/VR, spatial computing frameworks merge low-latency motion-to-photon latency (<20ms) with spatial audio to prevent motion sickness.",
        code: `/*
Adaptive Bitrate Streaming (HLS / MPEG-DASH) Master Manifest:
#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
360p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720
720p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
1080p.m3u8
*/`,
        example: "A surgeon using an Augmented Reality headset to view a 3D hologram of a patient's CT scan superimposed directly over the patient's anatomy during surgery.",
        commonExamQuestions: [
          "[8 Marks] Compare True Video-on-Demand (VoD) and Near Video-on-Demand (N-VoD). Explain how Adaptive Bitrate Streaming (HLS/DASH) prevents video buffering.",
          "[6 Marks] Differentiate between Virtual Reality (VR) and Augmented Reality (AR) with respect to hardware requirements and practical application domains."
        ]
      }
    ],
    theoryTopics: [
      "Derive the Nyquist-Shannon sampling theorem and calculate SNR for linear PCM audio quantization.",
      "Explain the complete JPEG image compression algorithm, detailing the Discrete Cosine Transform (DCT) and Quantization steps.",
      "Analyze the Rate Monotonic (RM) and Earliest Deadline First (EDF) real-time scheduling algorithms for multimedia operating systems.",
      "Explain the protocol architecture and packet headers of RTP, RTCP, and RTSP in continuous media streaming."
    ]
  },

  "GIS (Track C)": {
    subjectName: "GIS (Track C)",
    code: "BIT435CO",
    creditHours: 3,
    topics: [
      {
        id: "gis-u1-concepts-components",
        name: "Geographic Information Systems (GIS): Concepts & Components",
        unit: 1,
        unitTitle: "Unit 1: Basic Concepts & Components of GIS",
        unitCode: "1.1",
        importance: "High",
        keyPoints: [
          "GIS Definition: Computer-based system for capturing, storing, querying, analyzing, and displaying geospatial data referenced to the Earth.",
          "Five Essential Components: Hardware, Software (QGIS, ArcGIS), Data (Spatial and Attribute), People (GIS analysts), and Methods/Procedures.",
          "GIS vs CAD/Cartography: Cartography focuses on static visual display; CAD focuses on drafting local coordinates; GIS maintains true geographic coordinates and topological relationships.",
          "Historical Evolution: Canada Geographic Information System (CGIS, Roger Tomlinson - Father of GIS, 1960s) to modern cloud web GIS.",
          "Core Functional Capabilities: Spatial data capture, database management, geographic analysis (proximity, overlay), and cartographic map composition."
        ],
        theory: "A Geographic Information System (GIS) models the real world through geo-referenced coordinate frameworks. Unlike ordinary relational databases that only handle alphanumeric text and numbers, a GIS recognizes spatial geometry (latitude, longitude, elevation) and calculates topological relationships (containment, adjacency, intersection). GIS transforms raw cartographic data into spatial decision support for municipal land administration, environmental conservation, and utility routing.",
        code: `/*
The Five Core Components of GIS:
1. Hardware: High-performance workstations, GPS receivers, digitizers, cloud servers
2. Software: GIS desktop software (QGIS, ArcGIS Pro), spatial databases (PostGIS)
3. Data: Geospatial vector layers, satellite raster rasters, census tables
4. People: Spatial analysts, database administrators, cartographers, decision makers
5. Methods: Documented workflows, spatial analysis algorithms, projection standards
*/`,
        example: "Using GIS to determine optimal locations for building a new regional hospital: querying areas within 2 km of major highways, outside floodplains, on slopes under 5 degrees.",
        commonExamQuestions: [
          "[7 Marks] Define GIS. Explain the five essential components of a Geographic Information System with an architectural diagram.",
          "[6 Marks] Differentiate between GIS, Computer-Aided Design (CAD), and Computer Cartography."
        ]
      },
      {
        id: "gis-u2-data-models",
        name: "Spatial Data Models: Vector vs Raster & Spatial Databases (PostGIS)",
        unit: 2,
        unitTitle: "Unit 2: GIS Data & Database",
        unitCode: "2.1",
        importance: "Very High",
        keyPoints: [
          "Spatial Data (where features are located on Earth) vs Attribute Data (descriptive characteristics stored in tabular form).",
          "Vector Data Model: Represents features using discrete geometric primitives: Points (trees, wells), Lines (roads, rivers), Polygons (land parcels, lakes).",
          "Raster Data Model: Represents continuous surfaces using a regular grid of square cells/pixels, each containing a single attribute value (elevation, temperature, satellite imagery).",
          "Resolution in Raster: Spatial resolution determined by cell size (e.g., 30m Landsat cell vs 10m Sentinel-2 cell).",
          "Spatial Database Management Systems (Spatial DBMS): Extensions like PostGIS (for PostgreSQL) adding native geometry data types (GEOMETRY, GEOGRAPHY) and spatial SQL indexes (R-Tree / GiST)."
        ],
        theory: "Choosing between vector and raster representation depends on the nature of the geographic phenomenon. Discrete features with crisp boundaries (such as cadastral land parcels or sewer pipes) are naturally represented as vectors, preserving precise perimeter and topological relationships without pixelation. Continuous geographic fields that vary continuously across space (such as elevation, rainfall, and land surface temperature) are represented as rasters. Spatial databases utilize R-Tree and GiST indexing to accelerate bounding-box queries over millions of spatial polygons.",
        code: `-- Spatial SQL Query in PostGIS
-- Find all health posts within a 5 km buffer of a flood-inundated zone
SELECT h.name, h.ward_number
FROM health_posts h, flood_zones f
WHERE f.risk_level = 'High'
  AND ST_DWithin(h.geom, f.geom, 5000); -- 5000 meters buffer query`,
        example: "Digital Elevation Model (DEM) is a raster dataset where each cell value represents ground elevation in meters above mean sea level.",
        commonExamQuestions: [
          "[10 Marks] Compare Vector and Raster data models across structure, storage requirements, spatial precision, and analysis capabilities.",
          "[6 Marks] What is a Spatial DBMS? Explain the role of PostGIS and spatial indexing (GiST / R-Tree) in spatial queries."
        ]
      },
      {
        id: "gis-u3-data-input",
        name: "GIS Data Input: Digitization, Scanning & GPS Data Collection",
        unit: 3,
        unitTitle: "Unit 3: GIS Data Input",
        unitCode: "3.1",
        importance: "High",
        keyPoints: [
          "Data Input Methods: Manual digitizing, heads-up (on-screen) digitizing, scanner rasterization, direct GPS field collection, and remote sensing ingestion.",
          "Heads-Up (On-Screen) Digitizing: Tracing vector features directly over georeferenced aerial/satellite base maps on a computer monitor.",
          "Scanning: Converting hardcopy paper maps into high-resolution digital raster images via flatbed or drum scanners.",
          "Global Positioning System (GPS / GNSS): Satellite-based constellation measuring pseudoranges to compute exact 3D coordinates (X, Y, Z).",
          "Differential GPS (DGPS): Corrects satellite ephemeris and atmospheric timing delays using a stationary base station, reducing positional error from meters to centimeters."
        ],
        theory: "Data acquisition represents up to 70-80% of the cost and duration of GIS projects. Historical paper maps must be scanned and georeferenced using Ground Control Points (GCPs) with known geographic coordinates. Once georeferenced, technicians trace points, lines, and polygons using heads-up digitizing. In the field, handheld GNSS receivers capture location data. Differential GPS (DGPS) compares satellite signal travel times against a known fixed benchmark, broadcasting real-time correction factors to mobile rovers to achieve sub-meter cadastral survey accuracy.",
        code: `/*
GIS Data Conversion Pipeline:
[Paper Maps] -> [High-Res Scanner] -> [Raw Raster Image]
                                             |
                               (Georeferencing via GCPs)
                                             v
                               [Projected Georeferenced Raster]
                                             |
                            (Heads-up Vector Digitizing & Snapping)
                                             v
                           [Vector Layers: Points, Lines, Polygons]
*/`,
        example: "Survey Department of Nepal digitizing 1:25,000 scale topographic maps into layered vector datasets (transportation, hydrology, contours).",
        commonExamQuestions: [
          "[8 Marks] Explain the process of Heads-Up (on-screen) digitizing. How is a scanned paper map georeferenced using Ground Control Points (GCPs)?",
          "[6 Marks] Describe the working principle of Differential GPS (DGPS). How does it achieve centimeter-level accuracy for cadastral surveying?"
        ]
      },
      {
        id: "gis-u4-projections-utm",
        name: "Map Projections, Coordinate Systems & Modified UTM for Nepal",
        unit: 4,
        unitTitle: "Unit 4: GIS Mapping and Map Projections",
        unitCode: "4.1",
        importance: "Very High",
        keyPoints: [
          "Earth Shape Models: Sphere, Geoid (equipotential surface of Earth's gravity field), and Reference Ellipsoid (mathematical oblate spheroid: WGS84, Everest 1830).",
          "Geodetic Datum: Defines the size and shape of the reference ellipsoid and the origin point (e.g., WGS84, Everest 1830).",
          "Map Projection: Mathematical transformation of the curved 3D surface of the Earth onto a flat 2D map plane.",
          "Projection Distortions: Projections inevitably distort Shape (Conformal), Area (Equivalent), Distance (Equidistant), or Direction (Azimuthal).",
          "Universal Transverse Mercator (UTM): Cylindrical conformal projection dividing Earth into 60 longitudinal zones of 6 degrees each.",
          "Modified UTM (MUTM) for Nepal: Divides Nepal into two narrower 3-degree longitudinal zones (Central Meridians: 84°E and 87°E) with scale factor 0.9999 to limit scale distortion across the Himalayas."
        ],
        theory: "Projecting the curved Earth onto a flat sheet inevitably introduces distortion. Conformal projections (like Mercator) preserve local angles and shapes at the expense of distorting areas near the poles; equal-area projections preserve area ratios but distort shapes. The standard UTM projection uses 6-degree zones with a central meridian scale factor of 0.9996. Because Nepal extends east-west over 800 km across extreme elevation gradients, standard 6-degree UTM zones produced unacceptable scale distortion along national borders. The Survey Department of Nepal established Modified UTM (MUTM) based on the Everest 1830 ellipsoid, utilizing 3-degree zones centered at 84°E and 87°E with a central scale factor of 0.9999 and False Easting of 500,000m.",
        code: `/*
Nepal Modified UTM (MUTM) Specifications:
Parameter            | Zone 1 (West & Central) | Zone 2 (East)
Reference Ellipsoid  | Everest 1830            | Everest 1830
Central Meridian (CM)| 84° East Longitude      | 87° East Longitude
Scale Factor at CM   | 0.9999                  | 0.9999
False Easting        | 500,000 meters          | 500,000 meters
False Northing       | 0 meters (Equator)      | 0 meters (Equator)
Zone Width           | 3 degrees (82°30' - 85°30')| 3 degrees (85°30' - 88°30')
*/`,
        example: "A road surveyed in Pokhara uses MUTM Zone 84°E, while a cadastral plot in Biratnagar uses MUTM Zone 87°E to minimize cartographic measurement errors.",
        commonExamQuestions: [
          "[10 Marks] What is a Map Projection? Explain the Universal Transverse Mercator (UTM) projection and detail the Modified UTM (MUTM) parameters designed for Nepal.",
          "[6 Marks] Differentiate between Geoid, Ellipsoid, and Datum. Why is Everest 1830 preferred for Nepal's national cadastral maps over WGS84?"
        ]
      },
      {
        id: "gis-u5-data-editing-topology",
        name: "Data Editing & Topology Building in GIS",
        unit: 5,
        unitTitle: "Unit 5: Data Editing in GIS",
        unitCode: "5.1",
        importance: "High",
        keyPoints: [
          "Digitizing Errors: Undershoot (line fails to connect to target node), Overshoot (line extends past intersection), Dangles, Slivers (unwanted gaps/overlaps between adjacent polygons).",
          "Snapping: Automated technique that binds a cursor or vertex to existing vertices or lines within a specified snapping tolerance distance.",
          "Topology Definition: Mathematical study of geometric properties and spatial relationships that remain invariant under continuous transformation (deformation).",
          "Three Core Topological Relationships: Adjacency (which polygons share boundaries), Connectivity (which arcs connect at nodes), and Containment (which features lie inside another polygon).",
          "Benefits of Topology: Ensures data integrity, prevents overlapping cadastral parcels, eliminates redundant shared boundary storage, and enables network routing."
        ],
        theory: "Raw digitizing produces geometric inaccuracies. If an operator digitizing a road junction misses the intersecting line by two pixels, network routing algorithms fail because the roads are disconnected in the database. Topology enforces explicit mathematical rules on vector geometry. In an arc-node topological data structure, a line shared between two forest plots is stored only once in the geometry table, with topology tables explicitly defining that Polygon A lies to its left and Polygon B lies to its right, preventing sliver polygons.",
        code: `/*
Arc-Node Topological Tables Representation:
Arc Table:
Arc_ID | From_Node | To_Node | Left_Poly | Right_Poly
1      | 101       | 102     | Poly_A    | Poly_B
2      | 102       | 103     | Poly_A    | External

Polygon Topology:
Poly_A is bounded by Arcs: [1, 2, 3]
Poly_B is bounded by Arcs: [1, 4, 5]
(Note: Arc 1 is stored ONCE, completely eliminating slivers!)
*/`,
        example: "Running a topology validation rule 'Must Not Overlap' and 'Must Not Have Gaps' across a municipality's land parcel layer to identify and correct cadastral boundary disputes.",
        commonExamQuestions: [
          "[8 Marks] What is Topology in GIS? Explain the three fundamental topological concepts (Connectivity, Directionality/Adjacency, Containment).",
          "[6 Marks] Identify common digitizing errors (undershoots, overshoots, slivers, dangles) and explain how snapping tolerances resolve them."
        ]
      },
      {
        id: "gis-u6-spatial-analysis",
        name: "Spatial Analysis: Buffering, Map Overlay & Surface Modeling",
        unit: 6,
        unitTitle: "Unit 6: Spatial Analysis",
        unitCode: "6.1",
        importance: "Very High",
        keyPoints: [
          "Buffering: Creating a zone of specified distance around a point, line, or polygon feature (e.g., 500m noise buffer around an airport).",
          "Vector Overlay Operations: Point-in-Polygon, Line-in-Polygon, Polygon-on-Polygon.",
          "Overlay Boolean Operators: Intersect (AND: common areas retained), Union (OR: all areas combined), Identity, Erase (NOT: cut-out).",
          "Map Algebra (Raster Analysis): Mathematical operations on raster cell grids: Local (cell-by-cell), Focal (neighborhood window), Zonal (zones), Global operations.",
          "Surface Analysis: Derived from Digital Elevation Models (DEM): Slope (steepness in degrees/percentage), Aspect (downslope compass direction), Hillshade, and Viewshed."
        ],
        theory: "Spatial analysis extracts novel geographic insights by combining disparate spatial layers. In vector overlay, intersecting a soil classification polygon layer with a rainfall polygon layer creates a new composite attribute table enabling agricultural suitability modeling. In raster analysis, Map Algebra performs mathematical expressions across cell grids. Surface modeling operates on DEMs to compute slope steepness and aspect, vital for landslide susceptibility mapping and identifying sun-facing slopes for solar farm development.",
        code: `/*
Vector Overlay Operations Matrix:
Operation | Input A (Land Cover) | Input B (Flood Zone) | Output Result
Intersect | Agriculture (Forest) | High Flood           | Flooded Farmland only (A AND B)
Union     | All Land Covers      | All Flood Zones      | All combined geometries (A OR B)
Erase     | Urban Areas          | River Waterways      | Urban land with rivers removed
*/`,
        example: "Landslide Risk Modeling: Landslide_Risk = (Slope > 30°) * (Rainfall > 200mm) * (Soil_Type == 'Unconsolidated'). Computed in seconds via Map Algebra raster calculator.",
        commonExamQuestions: [
          "[10 Marks] Explain vector overlay operations (Intersect, Union, Identity, Erase) with neat illustrative diagrams.",
          "[8 Marks] What is Map Algebra in raster analysis? Explain how Slope, Aspect, and Viewshed are calculated from a Digital Elevation Model (DEM)."
        ]
      },
      {
        id: "gis-u7-sdi-standards",
        name: "Spatial Data Infrastructure (SDI), OGC Standards & Metadata",
        unit: 7,
        unitTitle: "Unit 7: Data Sharing and Spatial Data Infrastructure",
        unitCode: "7.1",
        importance: "High",
        keyPoints: [
          "Spatial Data Infrastructure (SDI): Coordinated framework of technologies, policies, institutional arrangements, and data clearinghouses enabling cross-agency geospatial sharing.",
          "SDI Core Components: People/Institutions, Policies & Legal agreements, Access Networks/Clearinghouses, Spatial Data, and Standards.",
          "Geospatial Metadata: 'Data about data'; documents provenance, coordinate system, spatial extent, accuracy, lineage, and usage restrictions (ISO 19115 standard).",
          "Open Geospatial Consortium (OGC) Web Services: WMS (Web Map Service - serves map image tiles), WFS (Web Feature Service - serves raw vector geometry and attributes), WCS (Web Coverage Service - serves raw raster data).",
          "OpenStreetMap (OSM): Global collaborative open-data mapping project providing crowd-sourced geospatial vector data under Open Database License (ODbL)."
        ],
        theory: "Historically, individual government ministries duplicate surveying efforts, producing conflicting maps of the same territory. A National Spatial Data Infrastructure (NSDI) establishes a centralized geoportal where agencies publish metadata catalogs and share live data services over OGC protocols. WMS delivers rendered map image tiles (PNG/JPEG) for fast web display, while WFS allows client GIS software to download, edit, and analyze actual vector vertices and attribute fields across the internet.",
        code: `<!-- Standard OGC Web Feature Service (WFS) Request -->
GET /geoserver/wfs?
  service=WFS&
  version=2.0.0&
  request=GetFeature&
  typeNames=nepal:district_boundaries&
  outputFormat=application/json
  HTTP/1.1
Host: geoportal.gov.np`,
        example: "Humanitarian OpenStreetMap Team (HOT) mobilizing volunteers worldwide to trace roads and damaged buildings over satellite imagery following the 2015 Nepal Earthquake.",
        commonExamQuestions: [
          "[8 Marks] Explain the concept and core components of Spatial Data Infrastructure (SDI). What is the role of metadata (ISO 19115)?",
          "[7 Marks] Differentiate between OGC Web Map Service (WMS) and Web Feature Service (WFS) with their respective use cases."
        ]
      },
      {
        id: "gis-u8-gis-in-nepal",
        name: "GIS Applications in Nepal: Cadastral Survey, NSDI & Disaster Management",
        unit: 8,
        unitTitle: "Unit 8: GIS in Nepal",
        unitCode: "8.1",
        importance: "High",
        keyPoints: [
          "Historical Evolution in Nepal: National Remote Sensing Center (1981), Survey Department topographic base mapping (1:25,000 & 1:50,000 scale), and ICIMOD regional applications.",
          "National Spatial Data Infrastructure (NSDI) Nepal: Lead agency Survey Department coordinating the national clearinghouse and standardized base data.",
          "Cadastral Mapping: Modernization from traditional brass-plate and plane table mapping to digital parcel databases in land revenue offices (Malpot).",
          "Disaster Risk Reduction (DRR) in Nepal: Flood inundation modeling in the Terai, landslide hazard zonation in the Middle Hills, and Glacial Lake Outburst Flood (GLOF) monitoring in the Himalayas.",
          "Municipal GIS: Urban planning, house numbering, property tax mapping, and municipal infrastructure asset management."
        ],
        theory: "Nepal presents unique geospatial challenges due to extreme topography, spanning from 60 meters elevation in the southern Terai plains to 8,848 meters at Mt. Everest. The Survey Department serves as the national mapping authority, managing the geodetic network, aerial photogrammetry, and cadastral parcel databases. GIS plays a vital life-safety role in Nepal: mapping fault lines, identifying vulnerable settlements exposed to GLOF hazards in high mountain valleys, and coordinating search-and-rescue logistics during seasonal monsoon flooding.",
        code: `/*
Key GIS Institutions and Systems in Nepal:
Organization                | Primary Geospatial Role
Survey Department (NAPI)    | Geodetic control, topographic base maps, NSDI clearinghouse
Dept of Land Mgmt (DOLMA)   | Digital Cadastral Information System, Land records
ICIMOD                      | Regional cryosphere, mountain ecology, GLOF monitoring
NDRRMA / BIPAD Portal       | National disaster information management system
Municipalities              | Urban GIS, property taxation, utility planning
*/`,
        example: "The BIPAD disaster portal (bipadportal.gov.np) developed under the Ministry of Home Affairs, integrating real-time weather alerts with demographic census layers for disaster response.",
        commonExamQuestions: [
          "[8 Marks] Discuss the history and current status of GIS and National Spatial Data Infrastructure (NSDI) in Nepal. Detail the role of the Survey Department.",
          "[6 Marks] Explain how GIS is applied in Nepal for disaster management, focusing on landslide hazard zonation and flood emergency logistics."
        ]
      }
    ],
    theoryTopics: [
      "Detail the parameters, central meridians, and mathematical scale factors of the Modified UTM (MUTM) projection of Nepal.",
      "Explain the topological data structure (Arc-Node, Polygon-Arc) and how topology rules prevent data errors.",
      "Compare vector overlay algorithms (Intersect, Union) with raster Map Algebra surface modeling.",
      "Discuss the architecture and technical protocols (WMS, WFS, WCS) of a National Spatial Data Infrastructure."
    ]
  },

  "Remote Sensing (Track C)": {
    subjectName: "Remote Sensing (Track C)",
    code: "BIT436CO",
    creditHours: 3,
    topics: [
      {
        id: "rs-u1-concept-scope",
        name: "Remote Sensing Concepts, Physical Principles & Stages",
        unit: 1,
        unitTitle: "Unit 1: Concept and Scope of Remote Sensing",
        unitCode: "1.1",
        importance: "High",
        keyPoints: [
          "Remote Sensing Definition: Science and art of acquiring information about Earth features from a distance without physical contact, measuring reflected or emitted electromagnetic radiation.",
          "Active Remote Sensing: Sensor provides its own source of illumination (e.g., Radar, LiDAR).",
          "Passive Remote Sensing: Sensor measures naturally reflected solar radiation or emitted thermal energy (e.g., optical cameras, thermal infrared sensors).",
          "Seven Stages of Remote Sensing: Energy Source (Sun) -> Propagation through Atmosphere -> Interaction with Earth Feature -> Retransmission through Atmosphere -> Sensor Recording -> Transmission/Reception/Processing -> Visual and Digital Interpretation.",
          "Advantages: Synoptic overview (large spatial coverage), repetitive multitemporal monitoring, access to inaccessible terrain (Himalayas), multi-wavelength detection beyond visible spectrum."
        ],
        theory: "Remote sensing extends human vision across the electromagnetic spectrum. Active sensors emit pulses of microwaves or laser light and record the round-trip backscatter travel time, allowing day-or-night operation and penetration through cloud cover. Passive optical systems rely on solar illumination, measuring surface spectral reflectance in visible, near-infrared, and shortwave infrared wavelengths. This provides critical data for national forest inventories, agricultural crop yield forecasting, and glacier retreat monitoring.",
        code: `/*
Active vs Passive Remote Sensing:
Feature          | Passive Remote Sensing         | Active Remote Sensing
Energy Source    | Natural (Sun / Thermal Earth)  | Artificial (Transmitter on sensor)
Operating Window | Daytime for optical; day/night | Day and night, all-weather
Weather Impact   | Obscured by cloud cover and fog| Microwaves penetrate rain and clouds
Representative   | Landsat OLI, Sentinel-2 MSI    | Sentinel-1 SAR, airborne LiDAR
*/`,
        example: "Using airborne LiDAR (active sensor) to penetrate forest canopies to map hidden archaeological ruins and generate bare-earth digital terrain models (DTMs).",
        commonExamQuestions: [
          "[8 Marks] Define Remote Sensing. Differentiate between Active and Passive remote sensing with suitable examples.",
          "[6 Marks] Describe the seven sequential stages of the remote sensing process from energy source to information extraction."
        ]
      },
      {
        id: "rs-u2-emr-signatures",
        name: "Electromagnetic Radiation (EMR), Atmospheric Windows & Spectral Signatures",
        unit: 2,
        unitTitle: "Unit 2: Concept of Electromagnetic Radiation (EMR)",
        unitCode: "2.1",
        importance: "Very High",
        keyPoints: [
          "Electromagnetic Radiation: Waves of oscillating electric and magnetic fields traveling through space at the speed of light: c = lambda * nu.",
          "Blackbody Radiation Laws: Planck's Law (radiation distribution), Stefan-Boltzmann Law (E = sigma * T^4), Wien's Displacement Law (lambda_max = 2898 / T um).",
          "Sun's peak emission occurs in the visible spectrum (~0.5 um, 6000 K); Earth's thermal emission peaks in the thermal infrared (~9.7 um, 300 K).",
          "Atmospheric Windows: Wavelength bands where the atmosphere is transparent (minimal absorption by water vapor, ozone, carbon dioxide).",
          "Atmospheric Scattering: Rayleigh (particles smaller than wavelength - causes blue sky), Mie (smoke/dust of equal size), Non-selective (water droplets larger than wavelength - causes white clouds).",
          "Spectral Signatures: Distinctive reflectance curves across wavelengths: Healthy Green Vegetation (low in blue/red due to chlorophyll absorption, high peak in Green, massive plateau in Near-Infrared ~0.7-1.1 um due to spongy mesophyll cellular structure)."
        ],
        theory: "Every material on Earth exhibits a unique spectral reflectance curve governed by its molecular composition. Chlorophyll absorbs blue and red wavelengths for photosynthesis, reflecting green light. In the Near-Infrared (NIR) band, the internal cellular structure of healthy leaves reflects up to 50% of incoming radiation to prevent thermal overheating. As vegetation undergoes drought stress or disease, the spongy mesophyll collapses, causing an immediate drop in NIR reflectance long before visible discoloration appears. Water absorbs nearly all infrared radiation, appearing black in NIR imagery.",
        code: `/*
Spectral Reflectance Curves Overview:
Wavelength Band | Vegetation (Healthy) | Clear Water         | Bare Soil
Blue (0.45 um)  | Low (~5%)            | Moderate (~10%)     | Low (~10%)
Green (0.55 um) | Moderate Peak (~15%) | Peak (~15%)         | Moderate (~15%)
Red (0.65 um)   | Low Absorption (~5%) | Low (~3%)           | Increasing (~25%)
NIR (0.85 um)   | Massive Peak (~50%)  | Complete Absorb (0%)| High (~35%)
SWIR (1.6 um)   | Water absorp dips    | Zero (0%)           | High Peak (~45%)
*/`,
        example: "Normalized Difference Vegetation Index (NDVI) leverages the stark contrast between Red and NIR reflectance: NDVI = (NIR - Red) / (NIR + Red). Values near +1.0 indicate dense healthy forest.",
        commonExamQuestions: [
          "[10 Marks] Explain the physical properties of Electromagnetic Radiation (EMR). State Wien's Displacement Law and Stefan-Boltzmann Law.",
          "[10 Marks] Draw and thoroughly explain the Spectral Reflectance Curves for healthy green vegetation, bare dry soil, and clear deep water across visible, NIR, and SWIR bands."
        ]
      },
      {
        id: "rs-u3-resolutions-sensors",
        name: "Sensor Characteristics & The Four Remote Sensing Resolutions",
        unit: 3,
        unitTitle: "Unit 3: Types and Characteristics of Sensor",
        unitCode: "3.1",
        importance: "Very High",
        keyPoints: [
          "The Four Essential Resolutions: Spatial, Spectral, Radiometric, and Temporal resolution.",
          "Spatial Resolution: Smallest spatial distance on the ground resolved by a single sensor pixel (Instantaneous Field of View - IFOV); e.g., 30m Landsat vs 0.3m WorldView.",
          "Spectral Resolution: Number and width of specific electromagnetic wavelength bands the sensor records (Multispectral has 4-15 broad bands; Hyperspectral has hundreds of narrow contiguous bands).",
          "Radiometric Resolution: Sensitivity to subtle variations in radiant energy; measured in bit depth (8-bit = 256 gray levels; 12-bit = 4096 levels; 16-bit = 65,536 levels).",
          "Temporal Resolution: Revisit time required for a satellite to re-image the identical geographic location on Earth (e.g., Landsat: 16 days, Sentinel-2: 5 days, MODIS: 1-2 days).",
          "Scanning Mechanisms: Across-track (Whiskbroom with oscillating mirror) vs Along-track (Pushbroom with linear CCD array)."
        ],
        theory: "Remote sensor design involves technical trade-offs between the four resolutions. A satellite cannot simultaneously have sub-meter spatial resolution, hundreds of hyperspectral bands, 16-bit radiometric depth, and daily global revisit coverage due to signal-to-noise ratio (SNR) constraints and telemetry downlink limits. Pushbroom sensors (along-track) use linear CCD arrays, observing each ground cell longer (higher dwell time) than oscillating whiskbroom mirrors, producing superior signal-to-noise ratios.",
        code: `/*
Sensor Scanning Architectures:
1. Whiskbroom (Across-Track):
   - Single detector element swept back and forth across swath by a rotating mirror
   - Shorter dwell time per pixel -> Lower signal-to-noise ratio
   - Example: Landsat 4/5 Thematic Mapper (TM)

2. Pushbroom (Along-Track):
   - Linear array of thousands of stationary CCD detectors aligned perpendicular to flight direction
   - Longer dwell time per pixel -> Higher radiometric sensitivity, no moving mirror parts
   - Example: Sentinel-2 MSI, SPOT
*/`,
        example: "MODIS has coarse spatial resolution (250m-1km) but high temporal resolution (daily revisit), ideal for monitoring global wildfire spread; WorldView-3 has sub-meter spatial resolution (0.31m) with multi-week revisits, ideal for urban infrastructure mapping.",
        commonExamQuestions: [
          "[10 Marks] Define and contrast the Four Resolutions of remote sensing (Spatial, Spectral, Radiometric, Temporal) with illustrative examples.",
          "[8 Marks] Explain the difference between Whiskbroom (across-track) and Pushbroom (along-track) scanning systems with neat sketches."
        ]
      },
      {
        id: "rs-u4-platforms-orbits",
        name: "Remote Sensing Platforms & Satellite Orbits",
        unit: 4,
        unitTitle: "Unit 4: Remote Sensor Platforms and Satellite Orbits",
        unitCode: "4.1",
        importance: "High",
        keyPoints: [
          "Sensor Platforms: Ground-based (cherry pickers, towers), Airborne (aircraft, drones/UAVs), and Spaceborne (polar and geostationary satellites).",
          "Geostationary Orbits (GEO): Positioned at ~35,786 km altitude directly above the Equator; orbital period matches Earth's rotation (24 hours); remains stationary over one spot (weather satellites: GOES, INSAT, Himawari).",
          "Sun-Synchronous Polar Orbits (SSO): Low Earth Orbit (LEO, 600-800 km altitude); inclined steeply near poles (~98 degrees); crosses the equator at the identical local solar time on every pass.",
          "Swath Width: Ground track width imaged by the sensor during a single orbital pass.",
          "Nadir: The point on the Earth's surface directly vertically beneath the satellite platform."
        ],
        theory: "Orbital mechanics determine the coverage and lighting conditions of satellite imagery. Geostationary satellites orbit at 35,786 km, providing continuous high-temporal monitoring of an entire hemisphere, essential for tracking cyclones and cloud movements. Earth resource satellites (Landsat, Sentinel) operate in Sun-Synchronous Polar Orbits at 600-800 km altitude. Because they cross the equator at the exact same local solar time (e.g., 10:30 AM local time), solar illumination angles remain nearly constant across sequential seasons, minimizing shadow variations during change detection analysis.",
        code: `/*
Satellite Orbit Characteristics:
Parameter          | Geostationary Orbit (GEO)     | Sun-Synchronous Polar (SSO)
Altitude           | ~35,786 km                    | ~600 - 800 km
Inclination        | 0° (Equatorial plane)         | ~98° (Retrograde polar)
Orbital Period     | 24 hours                      | 90 - 100 minutes
Revisit Frequency  | Continuous (every 10-15 mins) | Days to weeks (e.g. 5-16 days)
Primary Use Case   | Weather forecasting, comms    | Earth resource mapping, land cover
*/`,
        example: "Drones (UAVs) provide ultra-high spatial resolution (1-5 cm/pixel) over small project sites for bridge inspections and landslide volume calculations.",
        commonExamQuestions: [
          "[8 Marks] Compare Geostationary orbits and Sun-Synchronous Polar orbits with respect to altitude, inclination, revisit time, and applications.",
          "[6 Marks] Describe the characteristics, advantages, and limitations of Drone/UAV platforms compared to satellite remote sensing."
        ]
      },
      {
        id: "rs-u5-earth-satellites",
        name: "Space Imaging Satellites: Landsat Series, Sentinel & High-Res Constellations",
        unit: 5,
        unitTitle: "Unit 5: Space Imaging Satellites",
        unitCode: "5.1",
        importance: "High",
        keyPoints: [
          "Landsat Program (USGS/NASA): Continuous Earth observation archive since 1972; Landsat 8/9 carry OLI (Operational Land Imager, 30m multispectral, 15m panchromatic) and TIRS (Thermal Infrared, 100m).",
          "Copernicus Sentinel Program (ESA): Sentinel-1 (C-Band Synthetic Aperture Radar - all-weather SAR), Sentinel-2 (Multispectral Instrument - 13 spectral bands at 10m, 20m, 60m).",
          "Commercial High-Resolution Satellites: IKONOS (1999, first 1m commercial satellite), QuickBird, WorldView series (0.3m panchromatic, 1.2m multispectral), PlanetScope (flock of 200+ CubeSats providing daily 3m global imaging).",
          "Panchromatic Sharpening (Pan-sharpening): Merging high-resolution panchromatic band with lower-resolution multispectral bands to generate a sharp color composite.",
          "Open Data Revolution: Free public access to Landsat and Sentinel archives accelerating global environmental research and AI applications."
        ],
        theory: "The Landsat and Sentinel programs form the backbone of modern Earth observation. Sentinel-2 features three red-edge bands specifically tuned for measuring plant chlorophyll concentrations and leaf area index (LAI). When detailed site engineering demands sub-meter resolution, commercial satellite constellations utilize agile control-moment gyroscopes to point off-nadir, capturing stereoscopic image pairs used to compute highly accurate Digital Surface Models (DSMs).",
        code: `/*
Sentinel-2 vs Landsat 8/9 Comparison:
Sensor Specification | Sentinel-2 (MSI)              | Landsat 8/9 (OLI/TIRS)
Spatial Resolution   | 10m (VNIR), 20m (Red-Edge/SWIR)| 30m (VNIR/SWIR), 15m (Pan)
Number of Bands      | 13 spectral bands             | 11 spectral bands
Revisit Time         | 5 days (constellation of 2)   | 16 days (8 days with L8+L9)
Data Policy          | Free and Open (Copernicus)    | Free and Open (USGS)
*/`,
        example: "Using Sentinel-2 Band 8 (NIR, 10m) and Band 4 (Red, 10m) to map urban forest canopy loss in Kathmandu Valley at 10-meter spatial precision.",
        commonExamQuestions: [
          "[8 Marks] Describe the sensor payload, spectral bands, and capabilities of Landsat 8/9 (OLI/TIRS) and Sentinel-2 (MSI).",
          "[6 Marks] What is Pan-sharpening? Explain how combining panchromatic and multispectral bands produces high-resolution imagery."
        ]
      },
      {
        id: "rs-u6-image-processing-gis",
        name: "Digital Image Processing & Integration with GIS",
        unit: 6,
        unitTitle: "Unit 6: Integration of GIS and Remote Sensing",
        unitCode: "6.1",
        importance: "Very High",
        keyPoints: [
          "Pre-Processing: Radiometric correction (sensor calibration, atmospheric haze removal) and Geometric correction (orthorectification using DEM).",
          "Image Enhancement: Contrast stretching (linear, histogram equalization) and Spatial filtering (low-pass smoothing, high-pass edge detection).",
          "Supervised Classification: Analyst selects representative training sites for each land cover class; algorithms: Maximum Likelihood, Random Forest, Support Vector Machines.",
          "Unsupervised Classification: Algorithm clusters spectral data into statistical groups without prior training data; algorithms: K-Means, ISODATA.",
          "Accuracy Assessment: Error matrix (Confusion Matrix) calculating Overall Accuracy and Cohen's Kappa coefficient (kappa > 0.8 indicates strong agreement).",
          "GIS Integration: Exporting classified raster grids into polygon vector layers for overlay with cadastral parcels and administrative boundaries."
        ],
        theory: "Raw satellite data contains distortions caused by Earth rotation, topographic relief displacement, and atmospheric aerosols. Orthorectification corrects relief displacement on pixel-by-pixel bases using a DEM, converting perspective satellite scenes into planimetrically true map projections. Digital image classification assigns land cover identities to pixels. In Supervised Classification using Maximum Likelihood, pixels are assigned to the class for which they have the highest posterior probability based on multivariate Gaussian training statistics.",
        code: `/*
Classification Error Matrix (Confusion Matrix):
Reference (Ground Truth) Data
Class        | Forest | Water | Urban | Row Total | User's Accuracy
Forest       | 90     | 2     | 8     | 100       | 90/100 = 90%
Water        | 1      | 95    | 4     | 100       | 95/100 = 95%
Urban        | 5      | 3     | 92    | 100       | 92/100 = 92%
Column Total | 96     | 100   | 104   | Total=300 |
Producer Acc | 90/96  | 95/100| 92/104| Overall Accuracy = (90+95+92)/300 = 92.3%
*/`,
        example: "Applying a 3x3 Sobel high-pass filter over satellite imagery to extract linear fault lines, road networks, and geological structural lineaments.",
        commonExamQuestions: [
          "[10 Marks] Explain the steps of Supervised Image Classification. How is classification accuracy evaluated using a Confusion Matrix and Kappa coefficient?",
          "[8 Marks] Differentiate between Supervised and Unsupervised classification (ISODATA vs Maximum Likelihood)."
        ]
      },
      {
        id: "rs-u7-applications-rs",
        name: "Remote Sensing Applications: Agriculture, Forestry, Water & GLOF",
        unit: 7,
        unitTitle: "Unit 7: Applications of Remote Sensing",
        unitCode: "7.1",
        importance: "Very High",
        keyPoints: [
          "Agricultural Monitoring: Crop type identification, acreage estimation, crop vigor tracking (NDVI), and soil moisture estimation.",
          "Forestry Applications: Deforestation tracking, forest fire scar mapping, timber biomass estimation, and canopy height modeling.",
          "Hydrology & Flood Mapping: Delineating surface water bodies using Normalized Difference Water Index (NDWI), monitoring flood inundation extents via SAR imagery.",
          "Cryosphere & GLOF Monitoring in Nepal: Tracking Himalayan glacier retreat, mapping expanding supraglacial lakes (e.g., Tsho Rolpa, Imja Lake) to mitigate catastrophic outburst floods.",
          "Urban Planning: Monitoring urban sprawl, tracking impervious surface expansion, and analyzing urban heat island (UHI) effects using thermal infrared bands."
        ],
        theory: "Remote sensing provides irreplaceable monitoring capabilities across the fragile Himalayan ecosystem of Nepal. Optical satellite imagery cannot penetrate monsoon clouds; Synthetic Aperture Radar (SAR, Sentinel-1) penetrates rain and clouds to delineate flood boundaries across the southern Terai plains in real time. In high mountain regions, multitemporal satellite archives track expanding moraine-dammed glacial lakes, detecting terminal moraine dam instability and calculating downstream flood wave arrival times to protect downstream villages.",
        code: `/*
Key Remote Sensing Spectral Indices:
1. Normalized Difference Vegetation Index (NDVI):
   NDVI = (NIR - Red) / (NIR + Red)
   (Values > 0.4 indicate dense green vegetation)

2. Normalized Difference Water Index (NDWI - McFeeters):
   NDWI = (Green - NIR) / (Green + NIR)
   (Values > 0 indicate open water bodies; suppresses vegetation)

3. Normalized Burn Ratio (NBR - Fire Scars):
   NBR = (NIR - SWIR) / (NIR + SWIR)
*/`,
        example: "Monitoring Imja Glacial Lake in the Everest region: satellite image analysis revealed the lake surface expanded from 0.03 km² in the 1960s to over 1.3 km², leading to engineered lake lowering interventions.",
        commonExamQuestions: [
          "[10 Marks] Explain how remote sensing is applied in Nepal for monitoring Glacial Lake Outburst Floods (GLOFs) and mapping flood inundation using Synthetic Aperture Radar (SAR).",
          "[8 Marks] Formulate the mathematical equations and explain the physical logic behind NDVI (Vegetation Index) and NDWI (Water Index)."
        ]
      }
    ],
    theoryTopics: [
      "Derive Planck's radiation law, Wien's displacement law, and Stefan-Boltzmann law for blackbody radiation.",
      "Explain the mathematical principles of the Maximum Likelihood and Random Forest algorithms for satellite image classification.",
      "Analyze the synthetic aperture radar (SAR) backscatter mechanism and interferometry (InSAR) for ground deformation mapping.",
      "Discuss multi-sensor data fusion techniques (optical-SAR, multispectral-hyperspectral) for environmental monitoring."
    ]
  },

  "Data Center and Disaster Recovery Centers (Track C)": {
    subjectName: "Data Center and Disaster Recovery Centers (Track C)",
    code: "BIT437CO",
    creditHours: 3,
    topics: [
      {
        id: "dc-u1-intro-datacenter",
        name: "Data Center Architecture, Core Components & Building Layout",
        unit: 1,
        unitTitle: "Unit 1: Introduction to Data Centre",
        unitCode: "1.1",
        importance: "High",
        keyPoints: [
          "Data Center Definition: Centralized physical facility housing mission-critical computing, storage, networking infrastructure, and dedicated environmental support systems.",
          "Core Infrastructure Domains: White Space (usable area housing IT racks, servers, switches) vs Grey Space (utility area housing transformers, UPS batteries, chillers, generators).",
          "Power Infrastructure Stack: High-voltage utility feed -> Automatic Transfer Switch (ATS) -> Backup Diesel Generators -> Uninterruptible Power Supply (UPS) -> Power Distribution Units (PDUs) -> Rack Power Strips.",
          "Environmental Control: Precision Air Conditioning (CRAC/CRAH) maintaining temperature (18°C-27°C) and relative humidity (40%-60%) per ASHRAE standards.",
          "Structural Considerations: Slab-to-slab height, raised access flooring, floor loading capacity (supporting heavy battery banks and server racks), seismic dampening."
        ],
        theory: "Modern digital economies depend entirely on enterprise data centers. A data center is an engineered ecosystem designed to sustain server operation without interruption despite external municipal utility failures. Power delivery incorporates multiple isolation stages: utility power feeds double-conversion online UPS systems that instantly condition power and bridge the 10-30 second gap required for emergency diesel generators to spin up and stabilize via the Automatic Transfer Switch (ATS).",
        code: `/*
Data Center Power Distribution Architecture:
[Primary Grid Power] ----+
                         |
                         v
[Diesel Generator] ---> [ATS] ---> [UPS Battery Bank] ---> [PDU] ---> [Rack PDUs] ---> [Servers]
                         ^
(Emergency Backup) ------+ (Switches within 10-20ms)
*/`,
        example: "Nepal's Government Integrated Data Center (GIDC) in Singha Durbar incorporates dedicated backup diesel generators and N+1 modular UPS systems to maintain continuous uptime.",
        commonExamQuestions: [
          "[8 Marks] What is a Data Center? Explain the difference between 'White Space' and 'Grey Space' with an architectural layout diagram.",
          "[6 Marks] Trace the electrical power path in a data center from municipal high-voltage intake down to individual server power supplies."
        ]
      },
      {
        id: "dc-u2-roles-tiers",
        name: "Data Center Tiers (Tier I-IV), Availability & MTBF/MTTR Metrics",
        unit: 2,
        unitTitle: "Unit 2: The Role and Objectives of a Data Centre",
        unitCode: "2.1",
        importance: "Very High",
        keyPoints: [
          "Uptime Institute Tier Classification: Benchmarks data center infrastructure reliability, redundancy, and availability across four tiers.",
          "Tier I (Basic): Single non-redundant distribution path, single power feed; 99.671% availability (up to 28.8 hours annual downtime).",
          "Tier II (Redundant Components): Single path with redundant components (N+1 UPS/chillers); 99.741% availability (22 hours annual downtime).",
          "Tier III (Concurrently Maintainable): Multiple distribution paths (only one active), dual-powered IT equipment, redundant components; 99.982% availability (1.6 hours annual downtime; components maintainable without shutting down servers).",
          "Tier IV (Fault Tolerant): Multiple active independent distribution paths (2N or 2(N+1)), fully compartmentalized, fault-tolerant; 99.995% availability (less than 26.3 minutes annual downtime).",
          "Reliability Metrics: Mean Time Between Failures (MTBF) and Mean Time To Repair (MTTR); Availability = MTBF / (MTBF + MTTR)."
        ],
        theory: "The Uptime Institute Tier standard defines the architectural topology required to support specific business availability goals. The defining characteristic of Tier III is 'Concurrent Maintainability'—any single power transformer, UPS unit, or cooling pipe can be isolated and serviced for planned maintenance without interrupting power to customer server racks. Tier IV elevates this to 'Fault Tolerance', ensuring the facility autonomously absorbs unplanned physical hardware breakdowns or fires on one power line without dropping IT loads.",
        code: `/*
Uptime Institute Tier Specifications Matrix:
Tier Level | Redundancy Topology   | Concurrently Maintainable? | Fault Tolerant? | Availability | Annual Downtime
Tier I     | N (Base capacity)     | No                         | No              | 99.671%      | 28.8 hours
Tier II    | N + 1                 | No                         | No              | 99.741%      | 22.0 hours
Tier III   | N + 1 (Active/Passive)| YES                        | No              | 99.982%      | 1.6 hours
Tier IV    | 2(N + 1) Dual Active  | YES                        | YES             | 99.995%      | 26.3 minutes
*/`,
        example: "A Tier III data center executing annual generator load-bank testing and UPS battery replacements during normal business hours with zero server restarts.",
        commonExamQuestions: [
          "[10 Marks] Explain the Uptime Institute Tier Classification (Tier I through Tier IV). Compare their redundancy topologies, concurrent maintainability, and availability percentages.",
          "[6 Marks] Define MTBF and MTTR. Calculate system availability given an MTBF of 5000 hours and an MTTR of 2 hours."
        ]
      },
      {
        id: "dc-u3-hvac-cooling-pue",
        name: "Data Center Thermal Management, Hot/Cold Aisles & PUE Metric",
        unit: 3,
        unitTitle: "Unit 3: Design Overview and Infrastructure",
        unitCode: "3.1",
        importance: "Very High",
        keyPoints: [
          "Heat Dissipation: 100% of electrical power consumed by servers is converted into waste thermal energy; inadequate cooling causes thermal throttling and hardware crashes.",
          "Hot Aisle / Cold Aisle Containment: Racks arranged face-to-face (intake from cold aisle) and back-to-back (exhaust into hot aisle) to prevent hot and cold air mixing.",
          "Precision Cooling: Computer Room Air Conditioners (CRAC) and Computer Room Air Handlers (CRAH).",
          "Power Usage Effectiveness (PUE): Global benchmark metric measuring data center energy efficiency.",
          "PUE Formula: PUE = Total Facility Energy / IT Equipment Energy; Ideal PUE is 1.0 (all power goes to servers); typical older facilities run at 1.8-2.0, modern hyperscale sites achieve 1.1-1.2.",
          "Fire Suppression: Clean agent gaseous fire suppression (FM-200, Novec 1230, Inergen) that extinguishes fire by chemical heat absorption without damaging electronic servers or leaving residue."
        ],
        theory: "Historically, servers mixed hot exhaust air directly into the room, forcing cooling units to blast freezing air blindly. Hot/Cold aisle containment physically separates airflow regimes. In Cold Aisle Containment (CAC), a transparent roof and sliding doors enclose the cold aisle, allowing chilled air delivered from raised floor perforated tiles to enter server front bezels uniformly. Power Usage Effectiveness (PUE) tracks facility overhead: a PUE of 2.0 implies that for every 100 kW powering servers, an additional 100 kW is consumed by cooling, lighting, and power conversion losses.",
        code: `/*
Power Usage Effectiveness (PUE) Mathematical Calculation:
PUE = (Total Facility Power) / (IT Equipment Power)

Example:
A data center consumes 2.5 Megawatts (MW) of total utility power.
Measurement at rack PDUs shows IT servers consume 1.5 MW.
Cooling, lighting, and UPS losses consume 1.0 MW.

PUE = 2.5 MW / 1.5 MW = 1.67
Data Center Infrastructure Efficiency (DCiE) = 1 / PUE = 1 / 1.67 = 59.8%
*/`,
        example: "Modern data centers using free-cooling economizers: drawing cold outside ambient air during winter months to chill cooling loops without running mechanical compressors.",
        commonExamQuestions: [
          "[10 Marks] Explain the concept of Hot Aisle and Cold Aisle containment with neat diagrams. How does containment eliminate hot spots and improve cooling efficiency?",
          "[8 Marks] Define Power Usage Effectiveness (PUE) and Data Center Infrastructure Efficiency (DCiE). Explain why clean agent gaseous fire suppression (FM-200 / Novec 1230) is preferred over water sprinklers."
        ]
      },
      {
        id: "dc-u4-dcim-cabling",
        name: "Data Center Infrastructure Management (DCIM) & Cabling Standards",
        unit: 4,
        unitTitle: "Unit 4: Managing the Data Centre",
        unitCode: "4.1",
        importance: "High",
        keyPoints: [
          "Data Center Infrastructure Management (DCIM): Integrated software suite monitoring real-time power consumption, temperatures, airflow, and asset locations across facility and IT layers.",
          "Structured Cabling: ANSI/TIA-942 standard defining structured telecom cabling hierarchy for data centers.",
          "Main Distribution Area (MDA), Horizontal Distribution Area (HDA), and Equipment Distribution Area (EDA).",
          "Top of Rack (ToR) vs End of Row (EoR) network switching architectures.",
          "Physical Security: Multi-factor biometric access control, mantraps (anti-tailgating airlocks), CCTV coverage with 90-day retention, and visitor escort policies."
        ],
        theory: "Managing hundreds of server racks manually via spreadsheets leads to unmapped cables, stranded power capacity, and unmonitored hot spots. DCIM software integrates IoT sensors deployed across rack PDUs, smart breakers, and cooling units into a single operational pane. In network topologies, Top-of-Rack (ToR) installs a low-latency switch at the top of each rack, aggregating all server cables inside the rack and running just two redundant fiber uplinks to the core aggregation switch, eliminating thick, tangled copper cable bundles under the floor.",
        code: `/*
Top-of-Rack (ToR) vs End-of-Row (EoR) Architecture:
ToR Architecture:
[Server Rack 1] -> Short patch cables -> [ToR Switch] ======(2 Fiber Uplinks)======+
[Server Rack 2] -> Short patch cables -> [ToR Switch] ======(2 Fiber Uplinks)======+--> [Core Switch]

EoR Architecture:
[Server Rack 1] ======(Dozens of long copper cables across cable trays)======+
[Server Rack 2] ======(Dozens of long copper cables across cable trays)======+--> [Central EoR Switch]
(ToR drastically simplifies cable management and reduces cable weight!)
*/`,
        example: "A mantrap airlock at data center entry doors: door two will not unlock until door one has fully closed and the visitor's biometric fingerprint is verified.",
        commonExamQuestions: [
          "[8 Marks] What is Data Center Infrastructure Management (DCIM)? What operational parameters does DCIM software monitor and optimize?",
          "[6 Marks] Compare Top-of-Rack (ToR) and End-of-Row (EoR) switching architectures with reference to cable management and scalability."
        ]
      },
      {
        id: "dc-u5-colocation-hyperscale",
        name: "Data Center Industry: Colocation, Enterprise & Hyperscale Facilities",
        unit: 5,
        unitTitle: "Unit 5: The Data Centre Industry and Market",
        unitCode: "5.1",
        importance: "Medium",
        keyPoints: [
          "Data Center Market Segments: Enterprise data centers (privately owned by single corporation), Colocation facilities (multi-tenant leased space), Hyperscale data centers (massive cloud scale: AWS, Google, Microsoft).",
          "Colocation Models: Wholesale colocation (leasing entire suites/halls with dedicated power) vs Retail colocation (leasing individual racks or fractional 'U' space).",
          "Meet-Me Room (MMR): Dedicated secure room inside a colocation facility where telecommunication carriers cross-connect their networks to tenant racks.",
          "Green Data Centers: Transitioning to renewable energy (solar, wind, geothermal), liquid immersion cooling, and waste heat reuse in district heating systems.",
          "Edge Data Centers: Smaller localized computing facilities placed close to population centers to deliver low-latency caching for 5G, gaming, and autonomous driving."
        ],
        theory: "The global data center market is transitioning rapidly from fragmented on-premises enterprise server rooms toward large-scale colocation facilities and hyperscale cloud regions. Colocation enables mid-sized businesses to house servers in certified Tier-III environments without expending millions of dollars constructing backup generators and cooling systems. Carriers peer inside the facility's Meet-Me Room (MMR), granting tenants access to redundant low-latency internet transit feeds.",
        code: `/*
Data Center Facility Types Spectrum:
Type         | Typical Scale  | Ownership Model   | Primary Tenants
Enterprise   | 10 - 50 Racks  | Single Corporate  | Banks, Government Ministries
Colocation   | 500 - 3000 Rks | Leased Multi-user | Telecoms, SaaS companies, FinTech
Hyperscale   | 10,000+ Racks  | Cloud Provider    | Amazon AWS, Microsoft Azure, Google Cloud
Edge Center  | 1 - 5 Racks    | Distributed Micro | 5G Telco base stations, CDN points
*/`,
        example: "A commercial bank in Nepal maintaining an on-premise primary data center in its corporate headquarters while leasing rack space in a commercial colocation facility for disaster recovery.",
        commonExamQuestions: [
          "[7 Marks] Differentiate between Enterprise, Colocation, and Hyperscale data centers. What is a Meet-Me Room (MMR)?",
          "[5 Marks] What are Edge Data Centers? Why are they becoming critical for 5G networks and latency-sensitive IoT applications?"
        ]
      },
      {
        id: "dc-u6-cloud-sddc",
        name: "Cloud Data Centers: SDDC, NFV & Hyperconverged Infrastructure",
        unit: 6,
        unitTitle: "Unit 6: Cloud Data Center",
        unitCode: "6.1",
        importance: "High",
        keyPoints: [
          "Software-Defined Data Center (SDDC): Architectural model where compute, storage, and networking are virtualized and provisioned automatically via software policy APIs.",
          "Compute Virtualization (Hypervisors: VMware ESXi, KVM), Storage Virtualization (Ceph, vSAN), Network Virtualization (SDN - OpenFlow, VMware NSX).",
          "Network Functions Virtualization (NFV): Replacing proprietary physical network appliances (firewalls, routers, load balancers) with virtualized software containers.",
          "Hyperconverged Infrastructure (HCI): Tightly integrates compute, software-defined storage, and virtualization into standard x86 commodity server building blocks (Nutanix, vSAN).",
          "Hybrid Cloud Connectivity: Dedicated private low-latency connections linking on-premise data centers to cloud infrastructure (AWS Direct Connect, Azure ExpressRoute)."
        ],
        theory: "Traditional data centers suffer from slow manual provisioning: deploying a new application required racking physical servers, cabling proprietary hardware switches, and carving LUNs out of complex Storage Area Networks (SANs). In a Software-Defined Data Center (SDDC), the entire underlying physical hardware is abstracted into unified resource pools. Infrastructure-as-Code (Terraform, Ansible) automates the instant deployment of virtual machines, virtual overlay networks, and distributed software-defined storage across commodity x86 servers.",
        code: `/*
Software-Defined Data Center (SDDC) Architecture:
+-------------------------------------------------------------+
| Management & Automation Layer (APIs, Terraform, vCenter)   |
+-------------------------------------------------------------+
| Virtualization Abstraction Layer:                           |
| - Virtual Compute (VMware / KVM Hypervisors)               |
| - Virtual Storage (Software-Defined vSAN / Ceph)            |
| - Virtual Networking (Software-Defined SDN / VXLAN Overlays)|
+-------------------------------------------------------------+
| Physical Hardware Layer: Commodity x86 Servers, Leaf-Spine  |
+-------------------------------------------------------------+
*/`,
        example: "Deploying a virtual firewall and load-balancer cluster in 30 seconds via Terraform API calls in an SDDC rather than waiting weeks to procure and cable physical appliances.",
        commonExamQuestions: [
          "[8 Marks] Explain the concept and core components of a Software-Defined Data Center (SDDC). How does it differ from traditional legacy data centers?",
          "[6 Marks] What is Hyperconverged Infrastructure (HCI)? Explain how software-defined storage (vSAN) replaces traditional Fibre Channel SAN storage."
        ]
      },
      {
        id: "dc-u7-disaster-recovery-rto-rpo",
        name: "Disaster Recovery Center Formulation, DR Topologies & RTO/RPO",
        unit: 7,
        unitTitle: "Unit 7: Disaster Recovery Center Formulation and DR Plans",
        unitCode: "7.1",
        importance: "Very High",
        keyPoints: [
          "Disaster Recovery (DR): Policies, tools, and procedures to enable the recovery or continuation of vital technology infrastructure following a natural or human-induced disaster.",
          "Business Continuity Planning (BCP): Broader organizational strategy ensuring complete business operational survival through a crisis.",
          "Recovery Time Objective (RTO): Maximum acceptable duration of time an application can be offline after a disaster before unacceptable commercial damage occurs.",
          "Recovery Point Objective (RPO): Maximum acceptable amount of data loss measured in time (how far back in time data must be restored).",
          "DR Site Topologies: Hot Site (fully configured mirrored live replica, instantaneous failover, RTO approx 0), Warm Site (pre-installed hardware, periodic data sync, RTO minutes/hours), Cold Site (empty shell with power/cooling, hardware must be procured, RTO days/weeks).",
          "Data Replication Strategies: Synchronous Replication (zero data loss RPO=0, distance-limited by network latency) vs Asynchronous Replication (non-blocking, supports long distances)."
        ],
        theory: "Disasters (earthquakes, power grid collapses, cyber ransomware attacks) threaten organization survival. A comprehensive Disaster Recovery Plan hinges on two quantitative Service Level Agreements: RTO and RPO. If a bank specifies RPO = 0, every completed financial transaction must be synchronously committed to the secondary DR center before being acknowledged to the customer. Because synchronous replication requires the host to wait for acknowledgment over the fiber link (adding approx 1ms delay per 100 km), disaster recovery centers situated hundreds of kilometers away use asynchronous replication, accepting a minimal RPO (e.g., 5 seconds) to maintain production transaction throughput.",
        code: `/*
RTO vs RPO Graphical Relationship:
[Last Data Backup] -------- Data Loss --------> [DISASTER OCCURS] -------- Downtime --------> [Services Restored]
|<------------------- RPO ------------------->|                |<------------------- RTO ------------------->|
(Maximum acceptable data loss in time)                         (Maximum acceptable duration to restore service)

DR Site Comparison:
Site Type | Infrastructure Ready? | Data Synchronized? | RTO Metric       | Cost Level
Hot Site  | Fully equipped live   | Real-time synced   | Minutes / Instant| Very High
Warm Site | Hardware installed    | Periodic backups   | Hours            | Moderate
Cold Site | Power & space only    | Zero local data    | Days to Weeks    | Low
*/`,
        example: "Nepal GIDC located in Singha Durbar, Kathmandu replicates data asynchronously across the Mahabharat mountain range to its secondary Disaster Recovery Center in Hetauda.",
        commonExamQuestions: [
          "[10 Marks] Define Recovery Time Objective (RTO) and Recovery Point Objective (RPO) with timeline diagrams. Compare Hot Site, Warm Site, and Cold Site DR strategies.",
          "[8 Marks] Differentiate between Synchronous and Asynchronous data replication across primary and disaster recovery sites. What factors dictate the geographic distance between them?"
        ]
      }
    ],
    theoryTopics: [
      "Explain the Uptime Institute Tier Classification (Tiers I-IV) and evaluate their engineering requirements.",
      "Detail the calculation of Power Usage Effectiveness (PUE) and analyze how Hot/Cold Aisle Containment improves cooling performance.",
      "Formulate a complete Disaster Recovery Plan (DRP) including Business Impact Analysis (BIA), RTO, RPO, and failover/failback procedures.",
      "Compare Top-of-Rack (ToR) and End-of-Row (EoR) cabling architectures per ANSI/TIA-942 standards."
    ]
  },

  "Internship": {
    subjectName: "Internship",
    code: "BIT403CO",
    creditHours: 3,
    topics: [
      {
        id: "intern-u1-proposal-defense",
        name: "Internship Organization Placement, Problem Formulation & Proposal Defense",
        unit: 1,
        unitTitle: "Unit 1: Proposal Defense & Organization Placement",
        unitCode: "1.1",
        importance: "High",
        keyPoints: [
          "Internship Objectives: Bridging theoretical university education with enterprise software development and operational industry workflows.",
          "Organization Eligibility: Registered IT companies, telecommunication operators, banks, software houses, or government ICT departments with qualified mentors.",
          "Memorandum of Understanding (MOU): Tripartite formal agreement between the University/College, the Host Enterprise, and the Student.",
          "Problem Formulation: Identifying a concrete real-world engineering challenge within the organization and scoping measurable deliverables.",
          "Proposal Defense (10% Evaluation): Formal academic presentation detailing organizational background, problem statement, proposed methodology, project timeline (Gantt chart), and expected outcomes."
        ],
        theory: "The 7th-semester internship transitions students from classroom paradigms to professional engineering environments. Students must identify a host institution engaged in software engineering, networking, data science, or cybersecurity. The initial proposal defense ensures the proposed project is technically substantial and academically rigorous, preventing students from performing trivial administrative chores. A structured Gantt chart outlines milestones across sprint cycles.",
        code: `/*
Internship Proposal Defense Evaluation Rubric (10% Weightage):
Evaluation Criteria                                  | Weightage
Relevance and technical scope of industry project   | 3%
Clarity of problem formulation & literature review   | 3%
Feasibility of methodology, tools, and Gantt chart   | 2%
Presentation delivery, slides, and viva response    | 2%
Total Proposal Defense Score                        | 10%
*/`,
        example: "Internship placement at a software house contributing to an enterprise billing system, establishing an MOU and defining weekly deliverables.",
        commonExamQuestions: [
          "[5 Marks] What are the formal prerequisites and organizational criteria for internship placement under Purbanchal University BIT curriculum?",
          "[5 Marks] Outline the essential sections required in an official Internship Project Proposal document."
        ]
      },
      {
        id: "intern-u2-midterm-system-design",
        name: "Mid-Term Progress Review, Requirement Analysis & Architectural Design",
        unit: 2,
        unitTitle: "Unit 2: Mid-Term Progress Review & System Design",
        unitCode: "2.1",
        importance: "Very High",
        keyPoints: [
          "Mid-Term Evaluation (30% Weightage): Comprehensive academic review assessing project progress, mentor feedback, and technical design artifacts.",
          "Requirement Engineering: Documenting Functional Requirements (user actions) and Non-Functional Requirements (security, performance, scalability).",
          "Unified Modeling Language (UML) Modeling: Constructing Use Case diagrams, Sequence diagrams, Activity workflows, and Class diagrams.",
          "Database Architectural Design: Entity-Relationship (ER) modeling, normalization to 3rd Normal Form (3NF), indexing schemes, and foreign key integrity.",
          "Enterprise Tech Stack Selection: Justifying frontend frameworks, backend microservices, databases, and version control branching models."
        ],
        theory: "During the mid-term phase (weeks 6-8), students must demonstrate substantial system analysis and design progress. Mere coding without architectural documentation is heavily penalized. Students produce formal UML diagrams modeling system behavior and actor interactions. The host organization mentor submits a confidential progress evaluation report certifying the student's punctuality, code contributions, and team collaboration.",
        code: `/*
Mid-Term Evaluation Assessment Structure (30% Weightage):
Assessment Component                                | Marks
Host Organization Mentor Confidential Assessment    | 10%
Requirement Analysis & System Design Documentation  | 10%
Mid-Term Viva Voce & Prototype Demonstration        | 10%
Total Mid-Term Score                                | 30%
*/`,
        example: "Designing an authentication microservice: producing a UML Sequence Diagram showing client token request, OAuth 2.0 validation, database user lookup, and JWT response.",
        commonExamQuestions: [
          "[8 Marks] Explain the role of UML Class and Sequence diagrams in documenting the technical architecture of your internship project.",
          "[7 Marks] How are Non-Functional Requirements (NFRs) verified during mid-term technical design reviews?"
        ]
      },
      {
        id: "intern-u3-implementation-testing",
        name: "System Implementation, Unit Testing & DevOps Deployment",
        unit: 3,
        unitTitle: "Unit 3: System Implementation & Quality Testing",
        unitCode: "3.1",
        importance: "High",
        keyPoints: [
          "Enterprise Implementation: Writing clean, modular, documented code adhering to industry style guides and Git workflow conventions (feature branching, PR code reviews).",
          "Software Testing Levels: Unit Testing (Jest, PyTest), Integration Testing (verifying API endpoints), and User Acceptance Testing (UAT).",
          "Test Automation: Writing test cases verifying boundary values, edge cases, error handling, and authorization rules.",
          "Continuous Integration / Continuous Deployment (CI/CD): Automated build pipelines running linter checks and test suites on every pull request.",
          "Security Auditing: Checking against OWASP Top 10 vulnerabilities (SQL injection, XSS, insecure direct object references)."
        ],
        theory: "The implementation phase demonstrates the intern's capability to deliver deployment-grade code within enterprise development environments. Students participate in agile sprint standups, manage tasks via Jira/GitHub Issues, and submit code through Pull Requests subjected to peer review. Testing must be documented with explicit test suites showing inputs, expected outputs, and actual outcomes to prove system reliability.",
        code: `// Jest Unit Test Example from an Internship Project API
describe("POST /api/v1/orders", () => {
    it("should reject orders with non-positive quantities", async () => {
        const response = await request(app)
            .post("/api/v1/orders")
            .set("Authorization", "Bearer token123")
            .send({ item_id: "ITM-101", quantity: -2 });
        expect(response.status).toBe(400);
        expect(response.body.error).toContain("Quantity must be greater than zero");
    });
});`,
        example: "Configuring a GitHub Actions workflow that automatically executes automated tests and builds Docker container images on merging into the main branch.",
        commonExamQuestions: [
          "[8 Marks] Describe the software testing strategy applied in your internship project. Differentiate between Unit Testing, Integration Testing, and System Testing.",
          "[6 Marks] Explain the importance of version control (Git) and automated CI/CD pipelines in professional enterprise software development."
        ]
      },
      {
        id: "intern-u4-report-viva",
        name: "Final Internship Report Writing (APA Style) & University Viva Voce",
        unit: 4,
        unitTitle: "Unit 4: Final Internship Report & University Viva",
        unitCode: "4.1",
        importance: "Very High",
        keyPoints: [
          "Final Evaluation (60% Weightage): External university examination comprising report review and oral defense.",
          "Standard Report Structure (APA Style): Chapter 1: Introduction, Chapter 2: Organization Profile, Chapter 3: Systems Analysis & Design, Chapter 4: Implementation & Testing, Chapter 5: Conclusion & Reflections.",
          "Mandatory Document Inclusions: Certificate of Internship Completion from Company, Recommendation Letter from College Supervisor, Log Book of Daily Activities.",
          "Plagiarism Policy: Report must adhere to university academic integrity standards (similarity index below 15%).",
          "Viva Voce Examination: Technical defense defending design decisions, codebase architecture, practical contributions, and theoretical knowledge before external examiners."
        ],
        theory: "The final internship defense represents the capstone evaluation of the student's undergraduate industry training. The written documentation must strictly comply with university formatting guidelines (standard margins, font sizes, IEEE/APA reference citations). The viva voce examination interrogates both practical project contributions and theoretical mastery of the underlying computing curriculum.",
        code: `/*
Final Internship Evaluation Breakdown (60% Weightage):
Evaluation Item                                     | Marks
Final Internship Documentation & Log Book Quality   | 20%
Host Organization Final Performance Evaluation      | 15%
Live System Demonstration                           | 10%
External Examiner Viva Voce & Technical Defense     | 15%
Total Final Defense Score                           | 60%
Overall Semester 7 Internship Total: 10% + 30% + 60% = 100%
*/`,
        example: "Compiling daily logbook records signed by the industry supervisor into the formal final report appendix alongside the corporate completion certificate.",
        commonExamQuestions: [
          "[10 Marks] Detail the formal chapter structure of the Purbanchal University BIT Final Internship Report. What are the key elements of Chapter 3 and Chapter 4?",
          "[5 Marks] What factors are evaluated during the final oral viva voce examination by external university examiners?"
        ]
      }
    ],
    theoryTopics: [
      "Detail the role of the tripartite Memorandum of Understanding (MOU) in university industry internships.",
      "Explain the complete requirement engineering and UML modeling workflow applied in enterprise software design.",
      "Discuss quality assurance, automated unit testing, and continuous integration methodologies in enterprise development.",
      "Outline the standard guidelines for academic technical writing and APA citation in final internship reports."
    ]
  },

  "Disaster Governance (Track C)": {
    subjectName: "Disaster Governance (Track C)",
    code: "BIT487CO",
    creditHours: 3,
    topics: [
      {
        id: "dis-u1-digital-governance-dm",
        name: "Digital Governance in Disaster Management: ICT & Early Warning Systems",
        unit: 1,
        unitTitle: "Unit 1: Digital Governance in DM",
        unitCode: "1.1",
        importance: "Very High",
        keyPoints: [
          "Disaster Management Lifecycle: Preparedness, Early Warning, Emergency Response, Relief/Recovery, Mitigation/Prevention.",
          "Role of ICT: Hazard monitoring, spatial decision support, multi-agency communication, automated emergency broadcasts.",
          "Early Warning Systems (EWS): Sensor detection, hazard analysis, communication dissemination, and emergency preparedness response.",
          "Common Alerting Protocol (CAP): Standardized digital message format for exchanging emergency alerts across all media (SMS, sirens, broadcast TV, radio).",
          "Sensor Networks: Automated hydrometric river gauge stations, seismometer arrays, and weather radar feeding real-time telemetry into national command centers."
        ],
        theory: "Disasters overwhelm fragmented municipal communication lines. Digital governance establishes centralized emergency operations centers (EOCs) backed by real-time automated telemetry. When upstream river telemetry sensors detect water levels breaching warning thresholds, Early Warning Systems (EWS) parse the data and automatically trigger mass location-based SMS alerts to downstream residents, providing crucial evacuation time before flood waters arrive.",
        code: `/*
Common Alerting Protocol (CAP) XML Alert Snippet:
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>NEPAL-DHM-FLOOD-2026-09</identifier>
  <sender>dhm.gov.np</sender>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <info>
    <category>Met</category>
    <event>Flash Flood Warning</event>
    <urgency>Immediate</urgency>
    <severity>Severe</severity>
    <certainty>Observed</certainty>
    <area>
      <areaDesc>Koshi River Basin, Saptari District</areaDesc>
    </area>
  </info>
</alert>
*/`,
        example: "Nepal Department of Hydrology and Meteorology (DHM) sending automated flood warning SMS to thousands of mobile phones along the Narayani and Koshi river basins.",
        commonExamQuestions: [
          "[8 Marks] Explain the role of Information and Communication Technology (ICT) across the four phases of the disaster management cycle.",
          "[6 Marks] Describe the essential components of an Early Warning System (EWS). How does the Common Alerting Protocol (CAP) standardize emergency notifications?"
        ]
      },
      {
        id: "dis-u2-sendai-framework",
        name: "Disaster Risk Reduction (DRR), Sendai Framework & Risk Formula",
        unit: 2,
        unitTitle: "Unit 2: Disasters & Sendai Framework",
        unitCode: "2.1",
        importance: "Very High",
        keyPoints: [
          "Disaster Risk Equation: Risk = (Hazard * Vulnerability) / Capacity.",
          "Hazard: Potential damaging physical event, natural phenomenon, or human activity (e.g., earthquake, landslide, flood).",
          "Vulnerability: Conditions determined by physical, social, economic, and environmental factors that increase susceptibility to hazard impacts.",
          "Capacity: Strengths, resources, and coping mechanisms available within a community to manage and reduce disaster risks.",
          "Sendai Framework for Disaster Risk Reduction (2015-2030) Four Priorities: 1. Understanding disaster risk, 2. Strengthening disaster risk governance, 3. Investing in DRR for resilience, 4. Enhancing disaster preparedness for effective response and to 'Build Back Better'."
        ],
        theory: "A natural hazard (e.g., a 7.8 magnitude earthquake) does not automatically become a disaster unless it encounters vulnerable human settlements lacking structural resilience. Disaster risk governance shifts focus from post-event reactive relief to proactive risk reduction. The United Nations Sendai Framework sets global targets to substantially reduce disaster mortality, affected population numbers, and economic losses by strengthening institutional governance, strictly enforcing building codes, and investing in resilient infrastructure.",
        code: `/*
Disaster Risk Reduction Equation & Strategies:
Risk = (Hazard x Vulnerability) / Coping Capacity

To reduce Risk:
1. Hazards are largely natural and uncontrollable (cannot stop an earthquake)
2. Must MINIMIZE Vulnerability: Enforce building codes, avoid floodplains, poverty alleviation
3. Must MAXIMIZE Capacity: Early warning systems, trained community responders, stockpiled relief
*/`,
        example: "The 2015 Gorkha Earthquake (7.8 Mw) in Nepal: unreinforced masonry structures collapsed, whereas engineered reinforced concrete structures adhering to the National Building Code sustained repairable damage.",
        commonExamQuestions: [
          "[8 Marks] Explain the Disaster Risk Equation: Risk = (Hazard * Vulnerability) / Capacity with concrete examples from Nepal.",
          "[8 Marks] Outline the Four Priorities for Action established by the United Nations Sendai Framework for Disaster Risk Reduction (2015-2030)."
        ]
      },
      {
        id: "dis-u3-governance-ndrrma",
        name: "Disaster Risk Governance in Nepal: NDRRMA, Policy Frameworks & SDGs",
        unit: 3,
        unitTitle: "Unit 3: Governance Effectiveness & SDGs",
        unitCode: "3.1",
        importance: "High",
        keyPoints: [
          "Disaster Risk Reduction and Management (DRRM) Act 2074 (2017): Landmark legislation shifting Nepal from reactive relief to institutional risk governance.",
          "National Disaster Risk Reduction and Management Authority (NDRRMA): Executive federal body coordinating inter-agency disaster prevention, response, and reconstruction.",
          "Three-Tier Federal Governance: Federal Council -> Provincial Disaster Management Committees (PDMC) -> Local Disaster Management Committees (LDMC).",
          "National Strategic Plan of Action (2018-2030): Aligned with Sendai Framework and Sustainable Development Goals (SDG 11: Sustainable Cities, SDG 13: Climate Action).",
          "BIPAD Portal: Integrated spatial digital information platform operationalizing data-driven disaster governance in Nepal."
        ],
        theory: "Historically, Nepal's Natural Calamity (Relief) Act 1982 treated disasters as isolated emergency events handled reactively by the police and army. The DRRM Act 2074 transformed this by creating a permanent federal authority (NDRRMA) empowered to mandate hazard-informed land-use planning, disaster budgeting, and risk mitigation across all 753 local municipalities. The centralized BIPAD portal aggregates geocoded incident telemetry, vulnerability indices, and relief logistics to enable evidence-based executive decision-making.",
        code: `/*
Nepal 3-Tier Disaster Governance Institutional Hierarchy:
[National Council for DRRM (Chaired by Prime Minister)]
      |
[Executive Committee (Chaired by Home Minister)]
      |
[NDRRMA (National Disaster Authority)] <---> [BIPAD Geoportal]
      |
+-----+---------------------------+
|                                 |
v                                 v
[Provincial Disaster Committees]   [Local Disaster Committees (753 Municipalities)]
(Provincial Internal Affairs)     (Ward-level early action & local relief)
*/`,
        example: "Local Disaster and Climate Resilience Plans (LDCRPs) prepared by rural municipalities to allocate local municipal budgets for retrofitting schools and building check-dams.",
        commonExamQuestions: [
          "[8 Marks] Describe the institutional framework established under Nepal's Disaster Risk Reduction and Management Act 2074. What is the role of the NDRRMA?",
          "[6 Marks] How do disaster risk governance initiatives in Nepal align with Sustainable Development Goals (SDG 11 and SDG 13)?"
        ]
      },
      {
        id: "dis-u4-mitigation-preparedness",
        name: "Disaster Mitigation, Preparedness & Build Back Better (BBB)",
        unit: 4,
        unitTitle: "Unit 4: Mitigation, Preparedness & Recovery",
        unitCode: "4.1",
        importance: "Very High",
        keyPoints: [
          "Structural Mitigation: Physical engineering construction (flood embankments, check dams, retrofitting buildings to withstand seismic forces, slope stabilization retaining walls).",
          "Non-Structural Mitigation: Policies, laws, and awareness (building codes NBC 105:2020, land-use zoning prohibiting construction on floodplains, community drills).",
          "Disaster Preparedness: Emergency Operations Centers (EOCs), Incident Command System (ICS), prepositioned emergency relief stockpiles, search and rescue training.",
          "Build Back Better (BBB): Rebuilding physical infrastructure and social systems stronger, safer, and more resilient than before to prevent vulnerability recreation.",
          "Post-Disaster Needs Assessment (PDNA): Structured multi-sectoral methodology assessing physical damage and economic loss across infrastructure, social, and productive sectors."
        ],
        theory: "Pre-disaster mitigation costs a fraction of post-disaster reconstruction. The Incident Command System (ICS) provides a standardized on-scene emergency management structure with clear chains of command for operations, logistics, planning, and finance. Following major events, the Post-Disaster Needs Assessment (PDNA) calculates the total damages and recovery funding needs. Applying the 'Build Back Better' (BBB) principle ensures that schools, hospitals, and bridges destroyed during disasters are rebuilt using upgraded seismic engineering standards rather than reconstructing past structural vulnerabilities.",
        code: `/*
Incident Command System (ICS) Functional Hierarchy:
                    [Incident Commander (IC)]
                                |
          +---------------------+---------------------+
          |                     |                     |
     [Safety Officer]  [Information Officer]  [Liaison Officer]
                                |
    +-----------------+---------+---------+-----------------+
    |                 |                   |                 |
[Operations]      [Planning]          [Logistics]       [Finance/Admin]
(Field rescue)   (Data & mapping)    (Supplies/comms)  (Procurement/claims)
*/`,
        example: "Post-earthquake reconstruction in Nepal by the National Reconstruction Authority (NRA): retrofitting 700,000+ homes with reinforced seismic bands and plinth beams under owner-driven housing grants.",
        commonExamQuestions: [
          "[8 Marks] Differentiate between structural and non-structural disaster mitigation with examples from earthquake and flood risk management.",
          "[8 Marks] Explain the Incident Command System (ICS) structure. Detail the 'Build Back Better' (BBB) principle and its application in post-disaster recovery."
        ]
      }
    ],
    theoryTopics: [
      "Explain the Disaster Risk Equation and analyze physical vs socio-economic vulnerability factors.",
      "Detail the four priorities of the Sendai Framework for Disaster Risk Reduction (2015-2030).",
      "Analyze the provisions and institutional roles established by Nepal's Disaster Risk Reduction and Management Act 2074.",
      "Explain the Incident Command System (ICS) and Post-Disaster Needs Assessment (PDNA) methodology."
    ]
  },

  "Artificial Intelligence": {
    subjectName: "Artificial Intelligence",
    code: "BIT701",
    creditHours: 3,
    topics: [
      {
        id: "ai-u1-intro-agents",
        name: "Introduction to Artificial Intelligence, Turing Test & Intelligent Agents",
        unit: 1,
        unitTitle: "Unit 1: Introduction to AI & Intelligent Agents",
        unitCode: "1.1",
        importance: "Very High",
        keyPoints: [
          "AI Definitions: Thinking Humanly (cognitive modeling), Thinking Rationally (laws of thought/logic), Acting Humanly (Turing Test), Acting Rationally (rational agents).",
          "Turing Test (Alan Turing, 1950): Operational test where a human interrogator cannot reliably distinguish between conversational responses from a human and a computer.",
          "Rational Agent: An entity that perceives its environment through sensors and acts upon it through actuators to maximize its expected performance measure.",
          "PEAS Framework: Performance Measure, Environment, Actuators, Sensors (formal specification of task environments).",
          "Environment Properties: Fully observable vs Partially observable, Deterministic vs Stochastic, Episodic vs Sequential, Static vs Dynamic, Discrete vs Continuous, Single-agent vs Multi-agent.",
          "Agent Architectures: Simple reflex agents (condition-action rules), Model-based reflex agents (internal state), Goal-based agents, Utility-based agents, Learning agents."
        ],
        theory: "Modern artificial intelligence centers on the rational agent paradigm. An agent is anything that can view its environment through sensors and act upon that environment through actuators. Rationality is not omniscience; a rational agent takes actions that maximize its expected performance measure given its percept sequence history and built-in knowledge. The PEAS framework formalizes this problem domain. Simple reflex agents act purely on the current percept, failing when the environment is partially observable. Model-based agents maintain an internal state tracking unseen aspects of the world.",
        code: `/*
PEAS Specification for an Automated Taxi Driver:
Component           | Specification
Performance Measure | Safety, passenger arrival time, fuel efficiency, ride comfort, legal compliance
Environment         | Urban city roads, pedestrian traffic, variable weather, traffic signals
Actuators           | Steering wheel, accelerator, hydraulic brakes, horn, turn signals
Sensors             | Video cameras, LiDAR, radar, ultrasonic sonar, GPS, speedometer, odometer
*/`,
        example: "A vacuum cleaner agent operating in a two-room environment: if current square is dirty, clean it; otherwise move to the other square.",
        commonExamQuestions: [
          "[8 Marks] Define AI. Explain the Turing Test and discuss its validity and limitations as a benchmark for true machine intelligence.",
          "[8 Marks] Explain the PEAS framework with a complete specification for an Automated Hospital Surgery Robot or Self-Driving Vehicle."
        ]
      },
      {
        id: "ai-u2-uninformed-search",
        name: "Problem Solving & Uninformed Search Strategies: BFS, DFS, UCS & IDDFS",
        unit: 2,
        unitTitle: "Unit 2: Problem Solving & Search Algorithms",
        unitCode: "2.1",
        importance: "Very High",
        keyPoints: [
          "Problem Formulation: Initial state, Actions/Transition model, Goal test, Path cost function; generates a State Space Graph.",
          "Evaluation Criteria for Search Algorithms: Completeness (always finds solution if one exists), Time Complexity, Space Complexity, Optimality (finds lowest-cost path).",
          "Breadth-First Search (BFS): Expands shallowest unexpanded node using FIFO queue; Complete and Optimal for unit step costs; Space complexity O(b^d) is massive.",
          "Depth-First Search (DFS): Expands deepest unexpanded node using LIFO stack; Incomplete in infinite spaces; Space complexity O(b*m) is modest, but not optimal.",
          "Uniform-Cost Search (UCS): Expands node with lowest cumulative path cost g(n) using Priority Queue (Dijkstra's algorithm); Complete and Optimal.",
          "Iterative Deepening DFS (IDDFS): Combines space efficiency of DFS (O(b*d)) with completeness and optimality of BFS by progressively increasing depth limits."
        ],
        theory: "When an agent cannot immediately deduce an action, it formulates a search problem in state space. Uninformed (blind) search strategies explore states without domain-specific knowledge regarding how close a state is to the goal. While BFS guarantees finding the shortest path, its exponential memory requirements (O(b^d)) exhaust physical RAM even for modest depths. Iterative Deepening Search (IDDFS) resolves this by executing depth-limited searches with incrementally increasing depth limits (0, 1, 2, ...), achieving the optimal path with linear memory overhead O(b*d).",
        code: `/*
Search Algorithm Performance Summary:
Algorithm | Complete?        | Time Complexity | Space Complexity | Optimal?
BFS       | Yes (if b finite)| O(b^d)          | O(b^d) (HUGE!)   | Yes (if step cost equal)
DFS       | No (in inf space)| O(b^m)          | O(b*m) (Modest)  | No
UCS       | Yes (if cost > 0)| O(b^(1 + C*/eps)| O(b^(1 + C*/eps) | Yes (Lowest cost path)
IDDFS     | Yes (if b finite)| O(b^d)          | O(b*d) (Linear!) | Yes (if step cost equal)
(b = branching factor, d = depth of shallowest goal, m = maximum tree depth)
*/`,
        example: "Finding the shortest driving route between two European cities on a map using Uniform-Cost Search, expanding road nodes ordered by accumulated kilometer distance g(n).",
        commonExamQuestions: [
          "[10 Marks] Compare BFS, DFS, UCS, and IDDFS across Completeness, Time Complexity, Space Complexity, and Optimality.",
          "[8 Marks] Why is Iterative Deepening DFS (IDDFS) considered the preferred uninformed search strategy for large state spaces? Prove that the overhead of re-expanding states is minimal."
        ]
      },
      {
        id: "ai-u3-informed-astar",
        name: "Informed (Heuristic) Search: Greedy Best-First, A* Search & Heuristics",
        unit: 3,
        unitTitle: "Unit 3: Informed Search & A* Algorithm",
        unitCode: "3.1",
        importance: "Very High",
        keyPoints: [
          "Heuristic Function h(n): Domain-specific estimation of the cheapest path cost from node n to a goal state; h(Goal) = 0.",
          "Greedy Best-First Search: Evaluates nodes using f(n) = h(n); expands node estimated closest to goal; fast but neither complete nor optimal.",
          "A* Search: Evaluates nodes using f(n) = g(n) + h(n), where g(n) is the exact cost from start to n, and h(n) is the estimated cost from n to goal.",
          "Admissibility Condition: A heuristic is admissible if it never overestimates the true cost to reach the goal: 0 <= h(n) <= h*(n).",
          "Consistency (Monotonicity) Condition: For every node n and successor n' generated by action a: h(n) <= c(n, a, n') + h(n') (satisfies triangle inequality).",
          "Theorem: Tree-search A* is optimal if h(n) is admissible; Graph-search A* is optimal if h(n) is consistent."
        ],
        theory: "Informed search utilizes heuristic guidance to focus exploration toward promising corridors of the state space. Greedy Best-First can be misled by local minima because it ignores the historical cost g(n) already incurred. A* balances accumulated expenditure g(n) with estimated future cost h(n). If the heuristic function h(n) never overestimates the true cost (admissible), A* is mathematically guaranteed to return the optimal minimal-cost path. Furthermore, A* is optimally efficient: no other optimal algorithm expanding identical heuristic information expands fewer nodes.",
        code: `import heapq

def a_star_search(graph, start, goal, h):
    pq = [(h[start], start, [start], 0)]
    visited = {}

    while pq:
        f, node, path, g = heapq.heappop(pq)
        if node == goal:
            return path, g
        if node in visited and visited[node] <= g:
            continue
        visited[node] = g

        for neighbor, cost in graph.get(node, []):
            new_g = g + cost
            new_f = new_g + h[neighbor]
            heapq.heappush(pq, (new_f, neighbor, path + [neighbor], new_g))
    return None, float('inf')`,
        example: "Solving the 8-Puzzle: Admissible heuristics include h1 = number of misplaced tiles, and h2 = sum of Manhattan distances of tiles to their target slots (h2 dominates h1).",
        commonExamQuestions: [
          "[10 Marks] State and prove the optimality of A* search. Differentiate between Admissible and Consistent heuristics.",
          "[8 Marks] Trace A* search on the classic Romania path-finding problem from Arad to Bucharest with step-by-step queue states and f(n) calculations."
        ]
      },
      {
        id: "ai-u4-adversarial-minimax",
        name: "Adversarial Search & Games: Minimax Algorithm & Alpha-Beta Pruning",
        unit: 4,
        unitTitle: "Unit 4: Adversarial Search & Games",
        unitCode: "4.1",
        importance: "Very High",
        keyPoints: [
          "Adversarial Search: Decision making in multi-agent competitive environments where opponents actively counteract the agent's goals (two-player zero-sum games).",
          "Game Formulation: Initial state s_0, Players(s), Actions(s), Result(s, a), Terminal-Test(s), Utility function(s, p) (e.g., +1 for win, -1 for loss, 0 for draw).",
          "Minimax Algorithm: Computes optimal moves by assuming MAX maximizes utility while MIN minimizes it.",
          "Alpha-Beta Pruning: Optimization technique that prunes away game tree branches that cannot possibly influence the final Minimax decision.",
          "Alpha (alpha): Highest value found so far along the path for MAX (lower bound).",
          "Beta (beta): Lowest value found so far along the path for MIN (upper bound); Pruning condition: prune whenever alpha >= beta."
        ],
        theory: "Games like Chess and Go possess astronomical state spaces (Chess has ~10^40 reachable states; Go has ~10^170). Minimax generates the complete game tree down to terminal leaves, computing utility values backward. Because exploring the entire tree is impossible under real-time chess clock constraints, Alpha-Beta pruning eliminates irrelevant branches without altering the final minimax decision. With optimal move ordering, Alpha-Beta pruning doubles the searchable tree depth, reducing effective branching factor from b to sqrt(b).",
        code: `def alphabeta(node, depth, alpha, beta, is_max_turn):
    if depth == 0 or is_terminal(node):
        return evaluate(node)

    if is_max_turn:
        v = float('-inf')
        for child in get_children(node):
            v = max(v, alphabeta(child, depth - 1, alpha, beta, False))
            alpha = max(alpha, v)
            if beta <= alpha:
                break # Beta cutoff (Prune!)
        return v
    else:
        v = float('inf')
        for child in get_children(node):
            v = min(v, alphabeta(child, depth - 1, alpha, beta, True))
            beta = min(beta, v)
            if beta <= alpha:
                break # Alpha cutoff (Prune!)
        return v`,
        example: "In a 2-ply game tree, if MAX has already found a move yielding 5, and exploring the first child of MIN's alternative branch reveals a utility of 3, MIN will never pick anything higher than 3; thus MAX will never select this branch, and the remaining children of MIN can be safely pruned.",
        commonExamQuestions: [
          "[10 Marks] Explain the Minimax algorithm and demonstrate Alpha-Beta pruning on a given 3-ply game tree with leaf nodes, showing where cutoffs occur.",
          "[6 Marks] What is the best-case time complexity of Alpha-Beta pruning? Explain how move ordering influences pruning efficiency."
        ]
      },
      {
        id: "ai-u5-logic-resolution",
        name: "Knowledge Representation & First-Order Logic (FOPL) Resolution",
        unit: 5,
        unitTitle: "Unit 5: Knowledge Representation & First-Order Logic",
        unitCode: "5.1",
        importance: "Very High",
        keyPoints: [
          "Knowledge-Based Agents: Maintain a Knowledge Base (KB) of sentences in a formal language and use an inference engine to derive new sentences: KB |= alpha.",
          "Propositional Logic: Boolean variables combined with logical connectives (AND, OR, NOT, Implies, Biconditional); lacks expressiveness to quantify objects and relations.",
          "First-Order Predicate Logic (FOPL): Represents the world using Objects (constants), Relations (predicates), Functions, and Quantifiers (Universal forall, Existential exists).",
          "Conversion to Conjunctive Normal Form (CNF): 1. Eliminate implications, 2. Move negations inward, 3. Standardize variables, 4. Skolemization, 5. Drop universal quantifiers, 6. Distribute OR over AND.",
          "Resolution Refutation: Proof by contradiction: to prove KB |= alpha, add not(alpha) to KB, convert to CNF, and repeatedly resolve complementary pairs until deriving the empty clause (Contradiction)."
        ],
        theory: "Unlike machine learning models that struggle with symbolic reasoning, logic engines deduce guaranteed mathematical conclusions. Propositional logic is NP-complete (SAT problem) and cannot express assertions like 'All humans are mortal' without writing a separate proposition for every human on Earth. FOPL resolves this using quantifiers and predicates: forall x (Human(x) => Mortal(x)). Robinson's Resolution Principle provides a sound and complete refutation algorithm for FOPL. By converting formulas to clausal form and applying Unification (finding substitutions that make disparate predicates identical), the theorem prover derives contradictions.",
        code: `/*
Conversion to Clause Form (CNF) & Resolution Example:
Knowledge Base:
1. Every child loves Santa: forall x (Child(x) => Loves(x, Santa))
   Clause 1: ~Child(x) v Loves(x, Santa)
2. John is a child: Child(John)
   Clause 2: Child(John)

Goal: Prove that John loves Santa: Loves(John, Santa)
Negate Goal: ~Loves(John, Santa)  (Clause 3)

Resolution Steps:
Resolve Clause 1 and Clause 2 with substitution {x/John}:
Yields Clause 4: Loves(John, Santa)

Resolve Clause 4 and Clause 3:
Complementary Literals [Loves(John, Santa)] and [~Loves(John, Santa)] cancel out!
Yields: NULL (Empty Clause / Contradiction!)
Therefore, the goal is PROVEN.
*/`,
        example: "Skolemization: Eliminating existential quantifiers within universal scope: forall x exists y Loves(x, y) becomes forall x Loves(x, f(x)), where f is a Skolem function.",
        commonExamQuestions: [
          "[10 Marks] Convert a given set of First-Order Logic (FOPL) statements into Conjunctive Normal Form (CNF) and prove the target statement using Resolution Refutation.",
          "[6 Marks] Explain Unification and the Most General Unifier (MGU) algorithm with suitable predicate examples."
        ]
      },
      {
        id: "ai-u6-expert-systems-uncertainty",
        name: "Expert Systems, Uncertainty & Bayesian Networks",
        unit: 6,
        unitTitle: "Unit 6: Expert Systems & Machine Learning Foundations",
        unitCode: "6.1",
        importance: "High",
        keyPoints: [
          "Expert System Architecture: Knowledge Base (domain rules IF-THEN), Working Memory (active facts), Inference Engine, Explanation Facility, and User Interface.",
          "Inference Strategies: Forward Chaining (data-driven: starts from known facts and fires rules forward) vs Backward Chaining (goal-driven: starts from hypothesis and queries sub-goals).",
          "Handling Uncertainty: Real-world knowledge is imperfect, noisy, and non-deterministic; handled via Probability Theory and Fuzzy Logic.",
          "Bayes' Rule: P(H|E) = (P(E|H) * P(H)) / P(E); updates prior probability P(H) based on observed evidence E.",
          "Bayesian Belief Networks (BBN): Directed Acyclic Graphs (DAGs) representing conditional dependencies among random variables with Conditional Probability Tables (CPTs)."
        ],
        theory: "Classic expert systems (such as MYCIN for bacterial diagnosis) encode human specialist expertise into discrete rule bases. In forward chaining, incoming sensor telemetry fires antecedent conditions, driving conclusions forward. However, rigid rule systems fail when faced with uncertain or incomplete observations. Bayesian Networks provide a mathematically rigorous framework for probabilistic reasoning: nodes represent random variables, while directed edges represent direct causal dependencies, with the joint probability distribution factorized efficiently via conditional independence.",
        code: `/*
Bayes' Theorem Medical Diagnosis Example:
Disease D (Meningitis) has prior P(D) = 0.0001 (1 in 10,000)
Symptom S (Stiff Neck) occurs in 50% of meningitis patients: P(S|D) = 0.50
General population stiff neck probability: P(S) = 0.05 (5%)

Posterior Probability that a patient with a stiff neck has meningitis:
P(D|S) = (P(S|D) * P(D)) / P(S)
P(D|S) = (0.50 * 0.0001) / 0.05 = 0.00005 / 0.05 = 0.001 (0.1%)
(Even with a stiff neck, meningitis probability is only 1 in 1,000!)
*/`,
        example: "The classic Alarm Bayesian Network (Pearl): Burglary and Earthquake can both trigger an Alarm, which in turn causes John and Mary to phone.",
        commonExamQuestions: [
          "[8 Marks] Explain the architecture and components of an Expert System. Compare Forward Chaining and Backward Chaining inference mechanisms.",
          "[8 Marks] Explain Bayesian Belief Networks (BBN). How are Conditional Probability Tables (CPTs) used to calculate joint probabilities under conditional independence?"
        ]
      }
    ],
    theoryTopics: [
      "Prove the mathematical optimality of A* graph search under the consistency condition.",
      "Explain the step-by-step conversion of FOPL sentences into Conjunctive Normal Form (CNF) and Skolemization.",
      "Analyze the Minimax algorithm and Alpha-Beta pruning with proof of best-case complexity O(b^(d/2)).",
      "Explain probabilistic reasoning using Bayesian Belief Networks (BBN) and Bayes' theorem."
    ]
  }
};
