class ProviderA {
  send(email, subject, body) {
    return new Promise((resolve, reject) => {
      Math.random() > 0.3 ? resolve(true) : reject(new Error("ProviderA Failed"));
    });
  }
}

module.exports = ProviderA;
