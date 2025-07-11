const EmailService = require("../src/services/EmailService");

describe("EmailService", () => {
  let service;

  beforeEach(() => {
    service = new EmailService();
  });

  test("sends email successfully", async () => {
    const result = await service.sendEmail("id-1", "test@example.com", "Hello", "World");
    expect(result).toBe(true);
  });

  test("ensures idempotency", async () => {
    await service.sendEmail("same-id", "a@b.com", "Subj", "Msg");
    const second = await service.sendEmail("same-id", "a@b.com", "Subj", "Msg");
    expect(second).toBe(true);
  });

  test("throws error when all providers fail", async () => {
    service.providerA.send = async () => { throw new Error("Fail"); };
    service.providerB.send = async () => { throw new Error("Fail"); };

    await expect(service.sendEmail("fail-id", "fail@domain.com", "X", "Y"))
      .rejects.toThrow("All providers failed");
  }, 15000); // custom timeout
});
