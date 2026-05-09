import * as fs from 'fs';
import * as path from 'path';

const envPath = path.join(process.cwd(), '.env.local');
const jsonPath = path.join(process.cwd(), 'mock-exams-site-firebase-adminsdk-fbsvc-3c5ead9c71.json');

const serviceAccount = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const privateKey = serviceAccount.private_key;

let envContent = fs.readFileSync(envPath, 'utf8');

// Replace the FIREBASE_PRIVATE_KEY line
// Escape the private key for the env file: wrap in quotes and keep the \n as is if we want dotenv to expand them
// OR escape them as \\n if we want to expand them in code.
// Given my current app code uses replace(/\\n/g, '\n'), I'll escape them.
const escapedKey = privateKey.replace(/\n/g, '\\n');

const newKeyLine = `FIREBASE_PRIVATE_KEY="${escapedKey}"`;

if (envContent.includes('FIREBASE_PRIVATE_KEY=')) {
    envContent = envContent.replace(/FIREBASE_PRIVATE_KEY=.*/, newKeyLine);
} else {
    envContent += `\n${newKeyLine}`;
}

fs.writeFileSync(envPath, envContent);
console.log('✅ Updated .env.local with correctly escaped private key.');
