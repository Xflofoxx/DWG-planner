const UserModel = require('../../src/models/User');
const mockDb = require('../../tests/__mocks__/database');

describe('User Model', () => {
  beforeEach(() => {
    mockDb.reset();
  });

  describe('User.create', () => {
    it('should create a new user with email and password', () => {
      const email = 'test@example.com';
      const password = 'hashedpassword';
      const role = 'user';

      const user = UserModel.create(email, password, role);

      expect(user).toHaveProperty('id');
      expect(user.email).toBe(email);
      expect(user.role).toBe(role);
    });

    it('should create user with default role when not specified', () => {
      const user = UserModel.create('user2@example.com', 'password', undefined);

      expect(user.role).toBe('user');
    });
  });

  describe('User.findByEmail', () => {
    it('should find user by email', () => {
      const email = 'findme@example.com';
      UserModel.create(email, 'password');

      const user = UserModel.findByEmail(email);

      expect(user).toBeDefined();
      expect(user.email).toBe(email);
    });

    it('should return undefined for non-existent email', () => {
      const user = UserModel.findByEmail('nonexistent@example.com');

      expect(user).toBeUndefined();
    });
  });

  describe('User.findById', () => {
    it('should find user by id', () => {
      const created = UserModel.create('idtest@example.com', 'password');
      
      const user = UserModel.findById(created.id);

      expect(user).toBeDefined();
      expect(user.id).toBe(created.id);
    });
  });

  describe('User.findAll', () => {
    it('should return all users', () => {
      UserModel.create('user1@test.com', 'pass1');
      UserModel.create('user2@test.com', 'pass2');

      const users = UserModel.findAll();

      expect(users.length).toBe(2);
    });
  });

  describe('User.update', () => {
    it('should update user email and role', () => {
      const user = UserModel.create('update@example.com', 'password');
      
      const result = UserModel.update(user.id, { email: 'newemail@example.com', role: 'admin' });

      expect(result.changes).toBe(1);
    });
  });

  describe('User.delete', () => {
    it('should delete a user', () => {
      const user = UserModel.create('delete@example.com', 'password');
      
      const result = UserModel.delete(user.id);

      expect(result.changes).toBe(1);
    });
  });
});