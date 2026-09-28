# Network Programming (BIT401CO)
**Program**: Purbanchal University B.I.T. | **Semester**: 7 | **Credits**: 3

---

## 1. Teaching Schedule & Examination Scheme (ESE)

| Component | Lecture (L) | Tutorial (T) | Practical (P) | Total Hours/Week | Internal Assessment | End Semester Exam (Final) | Total Marks |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Hours / Marks** | 3 Hrs | 1 Hrs | 2 Hrs | **6 Hrs** | Theory: 20, Lab: 50 | Theory: 80, Lab: 0 | **150** |

### Evaluation Breakdown:
- **Continuous Internal Assessment**: 70 Marks (20 Theory + 50 Practical/Lab)
- **End Semester Final Examination (ESE)**: 80 Marks (80 Theory + 0 Practical/Defense)
- **Total Marks for Course**: **150 Marks**

---

## 2. Course Description & Objectives

Client-server socket programming — TCP/UDP sockets, I/O multiplexing, broadcast/multicast, and raw sockets in C/Unix.

---

## 3. Detailed Syllabus Chapters & Teaching Units

### Unit 1: Introduction to Network Programming [5 Hours]
- Introduction to computer network: client/server model
- Protocol Suite (ISO/OSI, TCP/IP)
- Unix Standards (POSIX, OpenGroup, IETF)
- Network Utilities (telnet, route, ipconfig, ifconfig, ping, netstat, and ftp)
- Introduction to programming: wrapper functions, header files, libraries and ports numbers, IP address
- Iterative server, concurrent server, networked servers

### Unit 2: Elementary Operating System Calls [6 Hours]
- System call, program, thread, process, Kernel
- fork(), exec() and its family, waitpid(), wait()
- pipe(), Fifo(), signals (SIGCHLD, SIGINT, SIGIO)
- IPC Names, creating and opening IPC channels, IPC permissions

### Unit 3: TCP/UDP Transport Layer Protocols [4 Hours]
- TCP (Transmission Control Protocol): features, connection establishment and termination, states in communication (LISTEN, TIME_WAIT, ESTABLISHED, BLOCKED)
- UDP (User Datagram Protocol): features, uses, comparison with TCP
- TCP and UDP buffer sizes and limitations
- SCTP overview

### Unit 4: Elementary Socket Calls [5 Hours]
- Socket address structure: for IPV4, IPV6, UNIX domain socket and generic socket address structure, value-result argument
- Byte ordering and manipulating function: htonl(), htons(), ntohl(), ntohs(), inet_addr(), inet_aton(), inet_ntoa(), inet_pton()

### Unit 5: Elementary TCP-UDP Socket [6 Hours]
- Socket(), connect(), bind(), listen(), accept(), read(), write(), close()
- sendto(), recvfrom()

### Unit 6: I/O Multiplexing [4 Hours]
- Introduction, I/O models: blocking I/O, non-blocking I/O, I/O multiplexing, signal driven I/O (SIGIO) and asynchronous I/O model
- Select(), poll(), shutdown()

### Unit 7: Socket Options [2 Hours]
- Getsockopt() and setsockopt() functions
- IPV4, IPV6, TCP socket options (SO_REUSEADDR, TCP_NODELAY)

### Unit 8: Name and Address Conversion [2 Hours]
- Domain Name System, gethostbyname(), gethostbyaddr(), uname(), getservbyname() and getservbyport()
- gethostname() functions, socket timeouts

### Unit 9: Unix Domain Protocol [3 Hours]
- Introduction, Unix domain socket address structure
- socketpair function
- Unix domain stream client-server, UNIX domain datagram client/server

### Unit 10: Daemon Processes, Inetd Superservers [2 Hours]
- Introduction, Syslog facility (syslog function)
- daemon_init function
- inetd daemon configuration

### Unit 11: Broadcast and Multicast [3 Hours]
- Introduction, Broadcast and multicast addresses
- Comparison between broadcast, unicast and multicast socket options
- Unicast versus Broadcast, multicast versus broadcast on LAN

### Unit 12: IP Layers and Raw Socket [3 Hours]
- Introduction, raw socket creation
- Input and output packet processing (ping example implementation)

---

## 4. Laboratory & Practical Guidelines

1. Linux command line utilities and shell programming
2. IPC mechanisms: Pipe(), Fifo(), MessageQueue
3. TCP, UDP and Unix Domain socket client server programs
4. TCP echo server and client program
5. Fork() system call process management
6. Wait() and waitpid() system call handling
7. Uname(), gethostbyaddr(), gethostbyname(), gethostname() system calls
8. Shell programming for network diagnostics

---

## 5. Reference Textbooks & Materials

1. Stevens, W. R., Unix Network Programming, Vol 1: Networking APIs - Sockets and XTI, Prentice Hall.
2. Stevens, W. R., Unix Network Programming, Vol 2: Interprocess Communications, Prentice Hall.
3. Comer, Douglas E., Internetworking with TCP/IP: Principles, Protocols, and Architecture, Vol 3, Prentice Hall.
