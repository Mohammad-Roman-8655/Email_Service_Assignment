class ProviderB {
  send(email, subject, body) {
    return new Promise((resolve, reject) => {
      Math.random() > 0.5 ? resolve(true) : reject(new Error("ProviderB Failed"));
    });
  }
}

module.exports = ProviderB;
