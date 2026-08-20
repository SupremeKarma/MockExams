export interface BitProject {
  id: string;
  title: string;
  semester: number;
  category: "Web & Fullstack" | "AI & Machine Learning" | "Mobile Apps" | "IoT & Embedded" | "Cybersecurity & Blockchain" | "Cloud & DevOps";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  techStack: string[];
  features: string[];
  architectureOverview: string;
  vivaQuestions: string[];
}

export const bitProjectsData: BitProject[] = [
  {
    id: "proj-1",
    title: "AI-Powered University Past Paper Analyzer",
    semester: 6,
    category: "AI & Machine Learning",
    difficulty: "Advanced",
    description: "An OCR-driven automated pipeline that clusters repeated university questions from past exams and ranks exam topics by study priority.",
    techStack: ["Next.js", "Python", "FastAPI", "Claude Vision API", "Pillow", "PostgreSQL"],
    features: [
      "PDF/Image paper upload & auto-cropping",
      "Semantic question deduplication with vector embeddings",
      "Frequency ranking algorithm across exam years",
      "Exportable study priority PDF reports"
    ],
    architectureOverview: "Client uploads scans to Next.js API -> FastAPI background workers run Claude Vision OCR -> Cosine similarity clustering -> Frequency scoring in Postgres.",
    vivaQuestions: [
      "How do you handle low-contrast photographed paper scans during OCR?",
      "Why did you choose cosine similarity over Levenshtein distance for clustering questions?",
      "How do you ensure data privacy for student submissions?"
    ]
  },
  {
    id: "proj-2",
    title: "Smart Campus Gate & Student Attendance (IoT + RFID)",
    semester: 3,
    category: "IoT & Embedded",
    difficulty: "Intermediate",
    description: "Hardware attendance logger using ESP32/8051 and RC522 RFID reader with real-time cloud sync to student portal.",
    techStack: ["ESP32 / 8051", "C++", "Firebase Realtime DB", "Node.js", "React"],
    features: [
      "Sub-second RFID card scan & LCD visual confirmation",
      "Cloud attendance synchronization via Wi-Fi",
      "Parent SMS alert on absentee trigger",
      "Examiner attendance report export (CSV/Excel)"
    ],
    architectureOverview: "Microcontroller captures RFID UID -> Authenticates locally -> Posts JSON payload to Firebase REST endpoint -> React dashboard renders real-time counts.",
    vivaQuestions: [
      "Explain the communication protocol used between ESP32 and RC522 (SPI vs I2C).",
      "How does the system handle network disconnects at the campus gate?",
      "What is the power consumption profile of the node?"
    ]
  },
  {
    id: "proj-3",
    title: "Decentralized University Degree Certificate Verifier",
    semester: 7,
    category: "Cybersecurity & Blockchain",
    difficulty: "Advanced",
    description: "Tamper-proof academic credential verification platform using Ethereum/Polygon smart contracts and IPFS storage.",
    techStack: ["Solidity", "Hardhat", "Ethers.js", "Next.js", "IPFS / Pinata", "Tailwind CSS"],
    features: [
      "University registrar batch certificate minting",
      "Instant QR-code public verification without login",
      "Cryptographic sha256 hash validation against IPFS metadata",
      "Role-based multi-signature authorization for degree issuance"
    ],
    architectureOverview: "Registrar signs transcript hash -> Smart contract records hash with timestamp -> Certificate PDF printed with QR code pointing to verification DApp.",
    vivaQuestions: [
      "How do smart contracts eliminate fraudulent degree certificates?",
      "What is the gas fee optimization strategy used for batch minting?",
      "Why is IPFS preferable over centralized S3 buckets for credential metadata?"
    ]
  },
  {
    id: "proj-4",
    title: "Real-time Collaborative Markdown Code & Notes Editor",
    semester: 5,
    category: "Web & Fullstack",
    difficulty: "Intermediate",
    description: "Google Docs-style multi-user collaborative study room with live cursor presence, Markdown KaTeX rendering, and syntax highlighting.",
    techStack: ["Next.js", "TypeScript", "WebSockets / Socket.io", "KaTeX", "Tailwind CSS", "Redis"],
    features: [
      "Conflict-free replicated data type (CRDT) document syncing",
      "Live peer cursors and colored user badges",
      "LaTeX math equation preview in real time",
      "Markdown export with code execution sandbox"
    ],
    architectureOverview: "Frontend React client sends delta operations over WebSockets to Node.js backend -> Redis Pub/Sub synchronizes room state across cluster nodes.",
    vivaQuestions: [
      "How do Operational Transformation (OT) and CRDT solve concurrent edit conflicts?",
      "How do you prevent XSS attacks when rendering user-submitted Markdown?",
      "Explain WebSocket heartbeat mechanisms to clean up dead peer connections."
    ]
  },
  {
    id: "proj-5",
    title: "Hospital Bed & Blood Bank Emergency Dispatch",
    semester: 4,
    category: "Mobile Apps",
    difficulty: "Intermediate",
    description: "Emergency location-aware mobile application connecting blood donors with nearby ICUs and blood banks in Nepal.",
    techStack: ["Flutter", "Dart", "Firebase Cloud Firestore", "Google Maps SDK", "Cloud Functions"],
    features: [
      "Radius-based emergency blood donor push notifications",
      "Live ICU/ventilator bed availability tracker across hospitals",
      "One-tap emergency call & GPS navigation routing",
      "Donor verification badge system"
    ],
    architectureOverview: "Flutter mobile client queries GeoFirestore with haversine distance filtering -> Push notifications sent through FCM to donors within 5km radius.",
    vivaQuestions: [
      "Explain how Haversine formula calculates spherical distance between coordinates.",
      "How does Flutter manage state across complex widget trees?",
      "What security rules protect donor contact numbers from unauthorized scraping?"
    ]
  },
  {
    id: "proj-6",
    title: "Secure E-Voting System with Zero-Knowledge Proofs",
    semester: 8,
    category: "Cybersecurity & Blockchain",
    difficulty: "Advanced",
    description: "Verifiable student council e-voting system ensuring ballot privacy and verifiable election tallying.",
    techStack: ["React", "Python", "zk-SNARKs (Circom)", "Node.js", "PostgreSQL", "Tailwind CSS"],
    features: [
      "Voter biometric / national ID authentication",
      "Zero-knowledge proof verifying eligible vote without revealing choice",
      "Public verifiable ledger with end-to-end auditability",
      "Anti-coercion receipt generation"
    ],
    architectureOverview: "Client computes ZK proof locally in browser -> Backend verifies proof validity without seeing plain voter candidate selection -> Tallies into immutable audit table.",
    vivaQuestions: [
      "What is Zero Knowledge Proof and why is it essential in secret-ballot elections?",
      "How do you protect against Sybil attacks and duplicate ballot casting?",
      "What is the time complexity of verifying a zk-SNARK proof on server?"
    ]
  },
  {
    id: "proj-7",
    title: "Automated Algorithmic Exam Proctoring & Tab Switch Detector",
    semester: 6,
    category: "AI & Machine Learning",
    difficulty: "Advanced",
    description: "Computer vision and browser-event proctoring suite for online exam invigilation.",
    techStack: ["Next.js", "TensorFlow.js", "MediaPipe FaceMesh", "WebRTC", "FastAPI"],
    features: [
      "Real-time head pose estimation & gaze tracking in browser",
      "Multiple person / phone detection via COCO-SSD",
      "Audio decibel anomaly detection for voice whispering",
      "Fullscreen lock & tab-switch infraction timeline recording"
    ],
    architectureOverview: "TensorFlow.js runs on client GPU via WebGL -> Periodically snapshots infraction metadata -> Streams aggregated proctoring score to examiner dashboard.",
    vivaQuestions: [
      "How does running inference on client-side WebGL reduce examiner server costs?",
      "How do you handle false positives caused by accidental student eye blinks?",
      "Explain the ethical and privacy considerations of continuous webcam processing."
    ]
  },
  {
    id: "proj-8",
    title: "Autonomous Agriculture Drone & Crop Disease Classifier",
    semester: 7,
    category: "AI & Machine Learning",
    difficulty: "Advanced",
    description: "Leaf disease diagnosis system using deep Convolutional Neural Networks (ResNet-50) for Nepali cash crops (Tea, Potato, Tomato).",
    techStack: ["PyTorch", "FastAPI", "React Native", "ResNet-50", "Docker", "ONNX Runtime"],
    features: [
      "Offline inference on mobile devices via ONNX quantized models",
      "Nepali language pesticide and remedy recommendations",
      "Geo-tagged disease outbreak heatmaps for local cooperatives",
      "Confidence score & visual heatmap highlighting diseased leaf regions"
    ],
    architectureOverview: "User captures leaf photo -> Mobile app runs quantized ONNX model -> Syncs outbreak coordinates with central FastAPI spatial database.",
    vivaQuestions: [
      "What is model quantization and how does it enable mobile edge deployment?",
      "Explain Grad-CAM and how it visualizes CNN attention on diseased crop spots.",
      "How do you handle class imbalance in agricultural image datasets?"
    ]
  }
];
