const JSDOMEnvironmentModule = require('jest-environment-jsdom');
const JSDOMEnvironment = JSDOMEnvironmentModule.default || JSDOMEnvironmentModule;

/**
 * Custom Jest environment that extends jsdom with the fetch API globals
 * needed by MSW v2, without overriding AbortSignal (which breaks framer-motion).
 */
class CustomJSDOMEnvironment extends JSDOMEnvironment {
  constructor(...args) {
    super(...args);

    // MSW v2 requires these globals that jsdom doesn't provide.
    // We pull them from the Node.js global scope.
    const globals = [
      'fetch',
      'Headers',
      'Request',
      'Response',
      'TextEncoder',
      'TextDecoder',
      'ReadableStream',
      'WritableStream',
      'TransformStream',
      'Blob',
      'File',
      'FormData',
      'structuredClone',
      'BroadcastChannel',
    ];

    for (const name of globals) {
      if (typeof globalThis[name] !== 'undefined' && typeof this.global[name] === 'undefined') {
        this.global[name] = globalThis[name];
      }
    }
  }
}

module.exports = CustomJSDOMEnvironment;
