const mockReq = { body: {}, headers: {} };
const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};

jest.mock("../../src/models/User", () => ({
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(() => "hashed-password"),
  compare: jest.fn(() => true),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mock-token"),
}));

const User = require("../../src/models/User");
let AuthController;

describe("Auth Controller - Registration Disabled", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    AuthController = require("../../src/controllers/AuthController");
  });

  describe("Registration", () => {
    it("should deny registration when disabled", async () => {
      const req = {
        body: { email: "test@example.com", password: "password123" },
      };

      await AuthController.register(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User registration is disabled",
      });
    });
  });

  describe("Login", () => {
    it("should reject login for non-existent users", async () => {
      User.findByEmail.mockResolvedValue(null);

      const req = {
        body: { email: "nonexistent@example.com", password: "password" },
      };

      await AuthController.login(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Invalid credentials",
      });
    });
  });
});
