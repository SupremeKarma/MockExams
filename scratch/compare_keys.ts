import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const serviceAccountPath = path.join(process.cwd(), 'mock-exams-site-firebase-adminsdk-fbsvc-3c5ead9c71.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

const jsonKey = serviceAccount.private_key;
let envKey = process.env.FIREBASE_PRIVATE_KEY || '';

// Apply the same cleaning we use in the app
if (envKey.startsWith('"') && envKey.endsWith('"')) {
    envKey = envKey.slice(1, -1);
}
// Note: dotenv might have already expanded \n if quoted.
// If it did, envKey has real newlines. If it didn't, it has literal \n.

console.log('JSON Key length:', jsonKey.length);
console.log('ENV Key length:', envKey.length);

if (jsonKey === envKey) {
    console.log('✅ Keys match exactly!');
} else {
    console.log('❌ Keys DO NOT match.');
    // Check if expansion makes them match
    const expandedEnvKey = envKey.replace(/\\n/g, '\n');
    console.log('After manual \\n -> \\n conversion, match:', jsonKey === expandedEnvKey);
    
    if (jsonKey !== expandedEnvKey) {
        // Find the first difference
        let i = 0;
        while (i < Math.min(jsonKey.length, expandedEnvKey.length) && jsonKey[i] === expandedEnvKey[i]) {
            i++;
        }
        console.log('First difference at index:', i);
        console.log('JSON char code:', jsonKey.charCodeAt(i));
        console.log('ENV char code:', expandedEnvKey.charCodeAt(i));
    }
}
