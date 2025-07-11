const ProviderA = require("./providers/ProviderA");
const ProviderB = require("./providers/ProviderB");
const RateLimiter = require("../utils/RateLimiter");
const CircuitBreaker = require("../utils/CircuitBreaker");
const Logger = require("../utils/Logger");

class EmailService {
  constructor() {
    this.providerA = new ProviderA();
    this.providerB = new ProviderB();
    this.logger = new Logger();
    this.sentEmails = new Map(); // idempotency
    this.rateLimiter = new RateLimiter(10, 60000); // 10/min
    this.circuitBreakerA = new CircuitBreaker();
    this.circuitBreakerB = new CircuitBreaker();
  }

  async sendEmail(id, email, subject, body) {
    if (this.sentEmails.has(id)) {
      this.logger.log(`Email with ID ${id} already sent (idempotent)`);
      return true;
    }

    if (!this.rateLimiter.allow()) {
      throw new Error("Rate limit exceeded");
    }

    const providers = [
      { name: "ProviderA", send: () => this.providerA.send(email, subject, body), breaker: this.circuitBreakerA },
      { name: "ProviderB", send: () => this.providerB.send(email, subject, body), breaker: this.circuitBreakerB }
    ];

    for (const provider of providers) {
      if (!provider.breaker.canAttempt()) continue;

      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          this.logger.log(`Trying ${provider.name}, attempt ${attempt + 1}`);
          await provider.send();
          this.sentEmails.set(id, true);
          provider.breaker.recordSuccess();
          this.logger.log(`${provider.name} sent email successfully`);
          return true;
        } catch (err) {
          this.logger.log(`${provider.name} failed: ${err.message}`);
          provider.breaker.recordFailure();
          await this.delay((2 ** attempt) * 1000); // exponential backoff
        }
      }
    }

    throw new Error("All providers failed");
  }

  delay(ms) {
    return new Promise(res => setTimeout(res, ms));
  }
}

module.exports = EmailService;
