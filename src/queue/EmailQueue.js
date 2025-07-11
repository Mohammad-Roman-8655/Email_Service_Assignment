class EmailQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(emailTask) {
    this.queue.push(emailTask);
  }

  dequeue() {
    return this.queue.shift();
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}

module.exports = EmailQueue;
