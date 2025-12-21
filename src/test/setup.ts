import '@testing-library/jest-dom'

// Polyfill for TextEncoder/TextDecoder for React Router
const { TextEncoder, TextDecoder } = require('util');

// Set global polyfills before tests run
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;