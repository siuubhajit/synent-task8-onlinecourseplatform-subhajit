/**
 * Dynamic Razorpay Checkout SDK loader and interactive Test Simulator.
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('[Razorpay] Failed to load external checkout.js, fallback simulator enabled.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};
