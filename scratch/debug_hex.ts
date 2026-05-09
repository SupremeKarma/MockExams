import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const pk = process.env.FIREBASE_PRIVATE_KEY;
if (pk) {
    console.log('Hex of first 50 chars:');
    const hex = Buffer.from(pk.substring(0, 50)).toString('hex');
    console.log(hex);
}
