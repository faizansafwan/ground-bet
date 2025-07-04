import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';


dotenv.config();

let sslConfig = null;


// Check if running in Render (Render sets RENDER environment variable)
if (process.env.RENDER === 'true') {
  try {
    sslConfig = {
      ca: fs.readFileSync('/etc/secrets/ca.pem')
    };
    console.log('✅ SSL cert loaded from /etc/secrets/ca.pem (Render)');
  } catch (err) {
    console.error('❌ Failed to load SSL cert in Render:', err.message);
  }
} else {
  // Optional: support local testing with a local cert if you have one
  const localCaPath = path.resolve('certs', 'ca.pem');
  if (fs.existsSync(localCaPath)) {
    sslConfig = {
      ca: fs.readFileSync(localCaPath)
    };
    console.log('✅ SSL cert loaded from local certs/ca.pem');
  } else {
    console.warn('⚠️ No SSL cert found, connecting without SSL (local only)');
  }
}


export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: sslConfig // Can be null
});
