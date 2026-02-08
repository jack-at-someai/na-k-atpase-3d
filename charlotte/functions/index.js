/**
 * Charlotte Cloud Functions
 *
 * Minimal substrate - to be built based on actual requirements.
 */

const { onCall } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp();
const db = getFirestore();

/**
 * Health check - verify functions are deployed and working.
 */
exports.healthCheck = onCall(async (request) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    authenticated: !!request.auth,
  };
});
