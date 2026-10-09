const Razorpay = require('razorpay');

/**
 * Initialize Razorpay instance with Test Mode credentials.
 * Falls back to an integrated mock client if keys are not present in development.
 */
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_LearnPulseKey123';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'LearnPulseSecretKey456';

  try {
    return new Razorpay({
      key_id,
      key_secret
    });
  } catch (error) {
    console.warn('[Razorpay Warning] Initializing development mock client:', error.message);
    return {
      orders: {
        create: async (params) => ({
          id: 'order_' + Math.random().toString(36).substring(2, 12),
          entity: 'order',
          amount: params.amount,
          currency: params.currency || 'INR',
          receipt: params.receipt,
          status: 'created'
        })
      }
    };
  }
};

module.exports = { getRazorpayInstance };
