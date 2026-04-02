#!/usr/bin/env node
/**
 * Clear Leaderboard Script
 * 
 * Deletes all documents from the 'leaderboard' collection in Firestore.
 * Useful for testing and resetting leaderboard data.
 * 
 * Usage:
 *   node scripts/clearLeaderboard.js
 * 
 * Note: Requires GOOGLE_APPLICATION_CREDENTIALS environment variable
 * pointing to your Firebase service account JSON key.
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Try to initialize admin SDK with service account
let serviceAccount;
const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!credPath) {
  console.error('❌ Error: GOOGLE_APPLICATION_CREDENTIALS environment variable not set.');
  console.error('   Please set it to point to your Firebase service account JSON file.');
  console.error('');
  console.error('   Example:');
  console.error('   $env:GOOGLE_APPLICATION_CREDENTIALS = "path/to/serviceAccountKey.json"');
  console.error('   node scripts/clearLeaderboard.js');
  process.exit(1);
}

try {
  serviceAccount = JSON.parse(fs.readFileSync(credPath, 'utf8'));
} catch (error) {
  console.error('❌ Error reading service account file:', error.message);
  process.exit(1);
}

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error.message);
  process.exit(1);
}

const db = admin.firestore();

async function clearLeaderboard() {
  try {
    console.log('🔄 Fetching leaderboard documents...');
    
    const snapshot = await db.collection('leaderboard').get();
    const docCount = snapshot.size;
    
    if (docCount === 0) {
      console.log('✅ Leaderboard is already empty (0 documents).');
      process.exit(0);
    }
    
    console.log(`📊 Found ${docCount} document(s) to delete.`);
    console.log('');
    console.log('⚠️  WARNING: This will permanently delete all leaderboard scores!');
    console.log('');
    
    // Confirm deletion
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    
    rl.question('Are you sure? Type "yes" to confirm: ', async (answer) => {
      if (answer.toLowerCase() !== 'yes') {
        console.log('❌ Deletion cancelled.');
        rl.close();
        process.exit(0);
      }
      
      rl.close();
      
      // Delete documents in batches
      console.log('🗑️  Deleting documents...');
      let deleted = 0;
      
      // Firebase has a batch write limit of 500 operations
      const batch = db.batch();
      let batchCount = 0;
      
      for (const doc of snapshot.docs) {
        batch.delete(doc.ref);
        batchCount++;
        
        // Commit batch every 500 operations
        if (batchCount === 500) {
          await batch.commit();
          deleted += batchCount;
          console.log(`  → Deleted ${deleted}/${docCount} documents`);
          batchCount = 0;
        }
      }
      
      // Commit remaining documents
      if (batchCount > 0) {
        await batch.commit();
        deleted += batchCount;
      }
      
      console.log('');
      console.log(`✅ Successfully deleted ${deleted} leaderboard document(s)!`);
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Error clearing leaderboard:', error.message);
    process.exit(1);
  }
}

clearLeaderboard();
