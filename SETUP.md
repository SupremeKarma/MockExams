# MockExams Setup Guide

## Prerequisites
- Node.js 22+
- npm or yarn
- Firebase account
- Stripe account (optional for development)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SupremeKarma/MockExams.git
   cd MockExams
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Firebase credentials from [Firebase Console](https://console.firebase.google.com)
   - (Optional) Add Stripe keys from [Stripe Dashboard](https://dashboard.stripe.com)

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Copy your web app config to `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

## Firestore Database Structure

Initialize these collections in your Firestore database:

```
users/
├── [userId]
│   ├── displayName: string
│   ├── email: string
│   ├── role: 'student' | 'examiner' | 'org_admin' | 'admin'
│   └── org_id?: string

exams/
├── [examId]
│   ├── title: string
│   ├── description: string
│   ├── duration_minutes: number
│   ├── defaultMarksPerQuestion: number
│   └── negativeMarkingEnabled: boolean

questions/
├── [questionId]
│   ├── exam_id: string
│   ├── question_text: string
│   ├── option_a-d: string
│   ├── correct_option: string
│   ├── marks: number
│   ├── explanation: string
│   └── order_in_exam: number

exam_attempts/
├── [attemptId]
│   ├── exam_id: string
│   ├── user_id: string
│   ├── score: number
│   ├── percentage: number
│   ├── answers_json: object
│   └── attempted_at: string

leaderboard/
├── [entryId]
│   ├── exam_id: string
│   ├── user_id: string
│   ├── score: number
│   ├── percentage: number
│   ├── attempts: number
│   └── last_attempt: string

enrollments/
├── [enrollmentId]
│   ├── exam_id: string
│   ├── user_id: string
│   └── enrolled_at: string
```

## Running Tests

```bash
npm run lint          # Run ESLint
npm run build         # Build for production
npm run start         # Start production server
```

## Important Security Notes

⚠️ **Never commit `.env.local` to version control!**

The following security measures have been implemented:
- ✅ Exam enrollment verification before accepting submissions
- ✅ Firestore transactions for race condition prevention
- ✅ Stripe webhook signature validation
- ✅ No hardcoded credentials in code
- ✅ Proper error handling without information leakage
- ✅ Type-safe API endpoints

## Troubleshooting

### Firebase Auth Error
**Error**: `Firebase: Error (auth/invalid-api-key)`

**Solution**: Ensure `.env.local` contains valid Firebase credentials. The app will show a warning if Firebase is not initialized, but will still load the public pages.

### Stripe Webhook Error
**Error**: `stripe-signature verification failed`

**Solution**: 
1. Ensure `STRIPE_WEBHOOK_SECRET` is set in `.env.local`
2. Verify webhook endpoint is configured in Stripe Dashboard
3. Use `stripe-cli` to test webhooks locally:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe-webhook
   ```

## Contributing

When making changes:
1. Run tests and linting: `npm run lint`
2. Follow the existing code patterns
3. Test your changes locally before committing
4. Create detailed commit messages

## License

See LICENSE file for details.
