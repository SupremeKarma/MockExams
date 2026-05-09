import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const pk = process.env.FIREBASE_PRIVATE_KEY;
console.log('PK exists:', !!pk);
if (pk) {
    console.log('PK length:', pk.length);
    console.log('PK starts with:', pk.substring(0, 30));
    console.log('PK ends with:', pk.substring(pk.length - 30));
    console.log('Contains \\\\n (literal):', pk.includes('\\n'));
}
