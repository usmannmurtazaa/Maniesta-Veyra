// This stub replaces the Node-only 'canvas' module during bundling.
// Konva uses 'canvas' only in Node.js environment; we don't need it in browser.
const canvasStub = {};

export default canvasStub;