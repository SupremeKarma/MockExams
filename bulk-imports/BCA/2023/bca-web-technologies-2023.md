Q: Which HTML5 semantic element is designed to encapsulate self-contained content that could be distributed independently, such as a blog post or news story?
A) <section>
B) <article>
C) <aside>
D) <main>
ANSWER: B
EXPLAIN: The HTML5 <article> tag represents an independent, self-contained composition in a document, page, or site that is intended to be independently distributable or reusable (e.g., a forum post, magazine article, or blog entry).
DIFFICULTY: easy
MARKS: 1

Q: In CSS Flexbox layout, which property is used along the main axis to distribute space between and around flex items?
A) align-items
B) justify-content
C) align-content
D) flex-direction
ANSWER: B
EXPLAIN: `justify-content` defines how the browser distributes space between and around content items along the main-axis of their flex container. In contrast, `align-items` operates on the cross-axis.
DIFFICULTY: easy
MARKS: 1

Q: What is the output of the following JavaScript expression: typeof NaN?
A) "undefined"
B) "NaN"
C) "number"
D) "object"
ANSWER: C
EXPLAIN: In ECMAScript specifications, NaN stands for "Not-a-Number", but its primitive numeric data type representation in the JavaScript runtime is still "number".
DIFFICULTY: medium
MARKS: 1

Q: In modern JavaScript (ES6+), what is the primary operational difference between the keywords 'let' and 'var'?
A) 'let' has function scope while 'var' has block scope
B) 'let' has block scope and is not hoisted to the top of its lexical block, preventing temporal dead zone access
C) 'let' can be redeclared in the same scope while 'var' cannot
D) 'var' creates immutable constants while 'let' creates variables
ANSWER: B
EXPLAIN: Variables declared with `let` and `const` have block-level scoping (enclosed within curly braces `{}`), whereas `var` has function-level scoping. Furthermore, variables declared with `let` are subject to the Temporal Dead Zone (TDZ) and cannot be read before initialization.
DIFFICULTY: medium
MARKS: 2

Q: Which HTTP request method is considered idempotent according to the HTTP/1.1 RFC 7231 specification?
A) POST
B) PUT
C) PATCH
D) CONNECT
ANSWER: B
EXPLAIN: An HTTP method is idempotent if the intended effect on the server of multiple identical requests is the same as for a single request. PUT, GET, DELETE, and HEAD are idempotent, whereas POST is not idempotent.
DIFFICULTY: medium
MARKS: 2

Q: In PHP, which superglobal array contains information about headers, paths, script locations, and server host configurations?
A) $_ENV
B) $_SERVER
C) $_GLOBALS
D) $_REQUEST
ANSWER: B
EXPLAIN: `$_SERVER` is an array containing information such as headers, paths, and script locations created by the web server (e.g. `$_SERVER['HTTP_HOST']`, `$_SERVER['REQUEST_METHOD']`, `$_SERVER['REMOTE_ADDR']`).
DIFFICULTY: easy
MARKS: 1

Q: Which of the following is the most secure and recommended approach to prevent SQL Injection attacks in PHP database interactions?
A) Using addslashes() function on all user inputs
B) Using htmlspecialchars() before database insertion
C) Using PDO or MySQLi Prepared Statements with parameterized queries
D) Relying on magic_quotes_gpc directive
ANSWER: C
EXPLAIN: Prepared statements ensure that the database engine treats user input strictly as literal parameter data rather than executable SQL syntax, completely neutralizing SQL injection vulnerabilities regardless of input characters.
DIFFICULTY: medium
MARKS: 2

Q: In asynchronous JavaScript, what does Promise.all() do when one of the passed promises rejects?
A) It waits for all other promises to resolve and ignores the rejection
B) It rejects immediately with the error of the first promise that rejected (fail-fast behavior)
C) It retries the rejected promise automatically three times
D) It returns an array containing null for the rejected promise
ANSWER: B
EXPLAIN: `Promise.all()` exhibits fail-fast behavior: if any promise in the input iterable rejects, the returned promise rejects immediately with the reason of the first promise that rejected, discarding remaining pending resolutions.
DIFFICULTY: hard
MARKS: 2

Q: What is the main security purpose of the Same-Origin Policy (SOP) enforced by modern web browsers?
A) To block third-party trackers from loading CSS stylesheets
B) To prevent malicious scripts on one origin from accessing sensitive document object models or data on another origin without explicit permission
C) To force all websites to use HTTPS encrypted protocols
D) To restrict local storage caching to under 5 megabytes
ANSWER: B
EXPLAIN: The Same-Origin Policy is a fundamental browser security mechanism that restricts how a document or script loaded by one origin can interact with a resource from another origin (defined by scheme, host, and port).
DIFFICULTY: medium
MARKS: 2

Q: In client-side web storage, what is the crucial lifetime distinction between 'localStorage' and 'sessionStorage'?
A) 'localStorage' data is cleared when the browser tab is closed, whereas 'sessionStorage' persists indefinitely
B) 'sessionStorage' data is cleared when the page session ends (e.g. tab closed), while 'localStorage' has no expiration time
C) 'localStorage' is limited to 4 KB while 'sessionStorage' supports up to 10 MB
D) 'sessionStorage' data is sent to the server with every HTTP header request, while 'localStorage' stays local
ANSWER: B
EXPLAIN: `localStorage` persists data with no expiration date until explicitly removed via JavaScript or user cache clearing. `sessionStorage` maintains a separate storage area for each given origin that is available for the duration of the page session (as long as the browser/tab is open).
DIFFICULTY: easy
MARKS: 1

Q: Which CSS property is used in CSS Grid layout to define the sizes of columns in a track listing?
A) grid-template-columns
B) grid-column-gap
C) grid-auto-flow
D) grid-template-areas
ANSWER: A
EXPLAIN: `grid-template-columns` defines the line names and track sizing functions of the grid columns (e.g., `grid-template-columns: repeat(3, 1fr)`).
DIFFICULTY: easy
MARKS: 1

Q: When a Cross-Origin Resource Sharing (CORS) request is considered "non-simple" (such as sending a custom Authorization header), what HTTP method does the browser automatically dispatch as a preflight check?
A) HEAD
B) TRACE
C) OPTIONS
D) GET
ANSWER: C
EXPLAIN: Modern browsers automatically send an HTTP `OPTIONS` request as a preflight check to verify that the server understands the CORS protocol and permits the requested headers and method before sending the actual payload.
DIFFICULTY: medium
MARKS: 2

Q: In JavaScript, what is the purpose of the Event Delegation pattern?
A) To execute events in web worker background threads
B) To attach a single event listener to a parent element rather than attaching individual listeners to multiple child elements
C) To stop event propagation completely at the target element
D) To guarantee that asynchronous fetch requests resolve in FIFO order
ANSWER: B
EXPLAIN: Event delegation leverages the event bubbling phase: instead of attaching dozens of event listeners to individual child elements, a single listener is added to a common ancestor, inspecting `event.target` to handle interactions dynamically.
DIFFICULTY: hard
MARKS: 2

Q: Which status code should a RESTful web service return when a resource has been successfully created as the result of a POST request?
A) 200 OK
B) 201 Created
C) 204 No Content
D) 202 Accepted
ANSWER: B
EXPLAIN: HTTP `201 Created` indicates that the request has succeeded and has led to the creation of a new resource on the server, typically accompanied by a `Location` header pointing to the new URI.
DIFFICULTY: easy
MARKS: 1

Q: In relational web databases, what is Database Normalization primarily aimed at minimizing?
A) Query execution speed
B) Storage disk block sector size
C) Data redundancy and insertion/update/deletion anomalies
D) The number of database tables
ANSWER: C
EXPLAIN: Normalization is the systematic approach of decomposing tables to eliminate data redundancy (duplicate information) and undesirable characteristics like insertion, update, and deletion anomalies (typically progressing through 1NF, 2NF, 3NF, and BCNF).
DIFFICULTY: medium
MARKS: 1

Q: In asynchronous web communication, what protocol provides full-duplex, persistent two-way communication channels over a single TCP connection?
A) HTTP/1.1
B) Server-Sent Events (SSE)
C) WebSocket
D) Long Polling
ANSWER: C
EXPLAIN: WebSockets provide a standardized, full-duplex bidirectional communication channel over a persistent TCP connection after an initial HTTP handshake upgrade, enabling real-time live data exchange with minimal framing overhead.
DIFFICULTY: easy
MARKS: 1

Q: What is the primary operational role of an SSL/TLS certificate in securing web transactions?
A) To compress HTML payloads before transmission
B) To authenticate the server identity to the client and establish an encrypted session key for symmetric data transmission
C) To protect the backend server from distributed denial-of-service (DDoS) traffic
D) To enforce relational database foreign key constraints
ANSWER: B
EXPLAIN: An SSL/TLS certificate provides cryptographic authentication of the website's domain identity using public key infrastructure (PKI) and facilitates a secure asymmetric handshake to negotiate symmetric encryption keys for all subsequent data packets.
DIFFICULTY: medium
MARKS: 2

Q: In React or modern Virtual DOM frameworks, what is the role of the 'key' prop when rendering a dynamic list of elements?
A) It secures the component from unauthorized Cross-Site Scripting (XSS)
B) It provides a unique identifier that helps the reconciliation algorithm determine which items have changed, been added, or been removed
C) It serves as a CSS selector for stylesheet binding
D) It binds an event listener directly to the browser DOM
ANSWER: B
EXPLAIN: Keys help React identify which items in a list have changed, been added, or been removed. Proper unique keys prevent unnecessary DOM re-renders and preserve component state across re-orderings during the reconciliation diffing algorithm.
DIFFICULTY: medium
MARKS: 2

Q: Which HTTP header directive prevents a web page from being rendered inside an <iframe>, mitigating Clickjacking attacks?
A) X-Content-Type-Options: nosniff
B) X-Frame-Options: DENY
C) Access-Control-Allow-Origin: *
D) Strict-Transport-Security: max-age=31536000
ANSWER: B
EXPLAIN: `X-Frame-Options: DENY` (or `SAMEORIGIN`, and modern CSP `frame-ancestors 'none'`) instructs the browser not to allow the page to be displayed in a frame or iframe, shielding users from clickjacking overlay exploits.
DIFFICULTY: medium
MARKS: 1

Q: What data interchange format is text-based, lightweight, language-independent, and structured around key-value pairs and ordered lists?
A) YAML
B) XML
C) JSON
D) Protocol Buffers
ANSWER: C
EXPLAIN: JSON (JavaScript Object Notation) is a lightweight, human-readable data-interchange format derived from JavaScript object syntax that has become the ubiquitous standard for REST APIs and web services.
DIFFICULTY: easy
MARKS: 1
