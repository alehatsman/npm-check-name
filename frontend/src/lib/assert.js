export default function assert(expr, message) {
  if (!expr) {
    throw new Error(message || 'unknown error');
  }
}
