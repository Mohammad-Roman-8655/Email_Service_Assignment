class CircuitBreaker {
  constructor(threshold = 3, timeout = 60000) {
    this.failures = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.lastFailureTime = 0;
  }

  canAttempt() {
    if (this.failures >= this.threshold) {
      return Date.now() - this.lastFailureTime > this.timeout;
    }
    return true;
  }

  recordFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
  }

  recordSuccess() {
    this.failures = 0;
  }
}

module.exports = CircuitBreaker;
