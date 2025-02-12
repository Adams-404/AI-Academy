// Polyfill for Draft.js
if (typeof global === 'undefined') {
  window.global = window;
}

if (typeof process === 'undefined') {
  window.process = { env: { NODE_ENV: 'production' } };
}

// Required for Draft.js
global.requestAnimationFrame = window.requestAnimationFrame || function(callback) {
  setTimeout(callback, 0);
}; 