# Mobile App Development (Track B) (BIT479CO)
**Program**: Purbanchal University B.I.T. | **Semester**: 8 | **Credits**: 3

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

Mobile application development on Android — UI layouts, activity lifecycles, intents, SQLite databases, REST API consumption, location services, and Google Play Store deployment.

---

## 3. Detailed Syllabus Chapters & Teaching Units

### Unit 1: Introduction to Mobile Devices & Architectures [5 Hours]
- History of mobile devices and mobile computing evolution
- Modern mobile operating systems: Android, iOS architecture comparison
- Hardware architecture of smartphones: SoC, ARM processors, power constraints, sensors, and wireless radios

### Unit 2: Mobile Platforms & Wireless Communication Constraints [4 Hours]
- Wireless network standards: Wi-Fi, Bluetooth BLE, Cellular (3G/4G/5G)
- Mobile communication constraints: intermittent connectivity, latency, battery consumption, and bandwidth throttling
- Offline-first mobile application design principles and data synchronization strategies

### Unit 3: Introduction to Android Platform [5 Hours]
- Android OS architecture: Linux Kernel, Hardware Abstraction Layer (HAL), Android Runtime (ART/Dalvik), Native C/C++ libraries, and Application Framework
- Android development tooling: Android Studio, Gradle build system, Android SDK, and ADB
- Android Project Anatomy: AndroidManifest.xml, java/kotlin sources, res directory, and Gradle scripts

### Unit 4: Android Application Design Essentials [6 Hours]
- UI layout components: LinearLayout, RelativeLayout, ConstraintLayout, and FrameLayout
- Core UI widgets: TextView, EditText, Button, ImageView, CheckBox, RadioButton, and Spinner
- Lists and dynamic collections: RecyclerView, LayoutManagers, ViewHolders, and Custom Adapters
- Material Design components, themes, styles, and responsive layout guidelines

### Unit 5: Writing Basic Applications & Core Components [6 Hours]
- Android core components: Activity, Service, BroadcastReceiver, ContentProvider
- Activity lifecycle: onCreate(), onStart(), onResume(), onPause(), onStop(), onDestroy()
- Intents and Intent Filters: Explicit vs Implicit Intents, passing bundle data, starting activities for results
- Fragments: lifecycle, fragment manager, and tablet/phone adaptive layouts

### Unit 6: Data Handling in Android [6 Hours]
- Internal and external file storage
- SharedPreferences for key-value settings storage
- Local structured databases: SQLite database helpers and Android Room ORM library
- Content Providers: sharing data between applications and querying system contacts/media

### Unit 7: Developing Real-Time Applications & Networking [6 Hours]
- Background processing: Threads, Coroutines, WorkManager, and Services
- Consuming RESTful APIs using HTTP libraries (Retrofit, OkHttp, Volley) and JSON parsing
- Telephony and SMS APIs in Android
- Push notifications using Firebase Cloud Messaging (FCM)

### Unit 8: Debugging, Testing & Deployment [4 Hours]
- Android debugging with Logcat, breakpoints, and Android Profiler (CPU, Memory, Network)
- Unit testing with JUnit and UI testing with Espresso
- Generating signed APKs and Android App Bundles (AAB)
- Google Play Store publishing guidelines, permissions, and app privacy compliance

### Unit 9: Recent Concepts & Advanced Android APIs [3 Hours]
- Location-based services: Google Maps API, Fused Location Provider, geofencing
- On-device machine learning with Google ML Kit
- App monetization models: in-app purchases, Google AdMob banner/interstitial ads, and subscriptions

---

## 4. Laboratory & Practical Guidelines

1. Setting up Android Studio, configuring virtual devices (AVD), and running a 'Hello World' app
2. Designing complex responsive UI layouts using ConstraintLayout and Material Design
3. Implementing multi-screen navigation using Activities, Fragments, and Explicit/Implicit Intents with bundle parameters
4. Building a dynamic list feed using RecyclerView with custom adapters and item click listeners
5. Persisting user preferences and application settings using SharedPreferences
6. Implementing full CRUD operations on a local SQLite / Room database
7. Consuming a third-party REST API asynchronously using Retrofit, displaying data, and handling loading/error states
8. Integrating Google Maps API to display user location with custom map markers
9. Building and testing a complete end-to-end Android application and generating a release APK

---

## 5. Reference Textbooks & Materials

1. Phillips, Bill, Chris Stewart, and Kristin Marsicano, Android Programming: The Big Nerd Ranch Guide (4th ed.), Big Nerd Ranch Guides.
2. Talukder, Asoke K. and Roopa R. Yavagal, Mobile Computing: Technology, Applications, and Service Creation, McGraw-Hill Communications Engineering.
3. Collins, Charlie, Michael Galpin, and Matthias Kaeppler, Android in Practice, Manning Publications.
4. Smyth, Neil, Android Studio Development Essentials, Payload Media.
