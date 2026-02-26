const {
  ROLES,
  ROLE_HIERARCHY,
  requireRole,
  requireRoleOrHigher,
  checkProjectAccess,
  permissions,
} = require("../../src/middleware/rbac");

describe("RBAC Middleware", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = { user: null, params: {}, body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe("requireRole", () => {
    it("should return 401 if no user", () => {
      requireRole("admin")(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 403 if role not allowed", () => {
      mockReq.user = { userId: "user-1", role: "user" };

      requireRole("admin", "pm")(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next if role is allowed", () => {
      mockReq.user = { userId: "user-1", role: "admin" };

      requireRole("admin")(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("requireRoleOrHigher", () => {
    it("should return 401 if no user", () => {
      requireRoleOrHigher("pm")(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it("should return 403 if role level is too low", () => {
      mockReq.user = { userId: "user-1", role: "user" };

      requireRoleOrHigher("pm")(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });

    it("should call next if role level is high enough", () => {
      mockReq.user = { userId: "user-1", role: "pm" };

      requireRoleOrHigher("pm")(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should allow admin to access pm resources", () => {
      mockReq.user = { userId: "user-1", role: "admin" };

      requireRoleOrHigher("pm")(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("ROLE_HIERARCHY", () => {
    it("should have correct role levels", () => {
      expect(ROLE_HIERARCHY.admin).toBe(4);
      expect(ROLE_HIERARCHY.pm).toBe(3);
      expect(ROLE_HIERARCHY.operativo).toBe(2);
      expect(ROLE_HIERARCHY.cliente).toBe(1);
      expect(ROLE_HIERARCHY.user).toBe(0);
    });
  });

  describe("ROLES", () => {
    it("should have all required roles", () => {
      expect(ROLES.ADMIN).toBe("admin");
      expect(ROLES.PM).toBe("pm");
      expect(ROLES.OPERATIVO).toBe("operativo");
      expect(ROLES.CLIENTE).toBe("cliente");
    });
  });

  describe("permissions", () => {
    describe("canCreate", () => {
      it("admin can create all resources", () => {
        expect(permissions.canCreate("admin", "project")).toBe(true);
        expect(permissions.canCreate("admin", "task")).toBe(true);
        expect(permissions.canCreate("admin", "dwg")).toBe(true);
      });

      it("pm can create project-related resources", () => {
        expect(permissions.canCreate("pm", "project")).toBe(true);
        expect(permissions.canCreate("pm", "task")).toBe(true);
        expect(permissions.canCreate("pm", "user")).toBe(false);
      });

      it("operativo cannot create any resources", () => {
        expect(permissions.canCreate("operativo", "project")).toBe(false);
        expect(permissions.canCreate("operativo", "task")).toBe(false);
      });

      it("cliente cannot create any resources", () => {
        expect(permissions.canCreate("cliente", "project")).toBe(false);
      });
    });

    describe("canRead", () => {
      it("all roles can read their allowed resources", () => {
        expect(permissions.canRead("user", "project")).toBe(false);
        expect(permissions.canRead("cliente", "project")).toBe(true);
        expect(permissions.canRead("pm", "project")).toBe(true);
        expect(permissions.canRead("admin", "project")).toBe(true);
      });
    });

    describe("canUpdate", () => {
      it("admin can update all resources", () => {
        expect(permissions.canUpdate("admin", "project")).toBe(true);
        expect(permissions.canUpdate("admin", "task")).toBe(true);
      });

      it("pm can update project resources", () => {
        expect(permissions.canUpdate("pm", "project")).toBe(true);
        expect(permissions.canUpdate("pm", "task")).toBe(true);
      });

      it("operativo can only update tasks", () => {
        expect(permissions.canUpdate("operativo", "task")).toBe(true);
        expect(permissions.canUpdate("operativo", "project")).toBe(false);
      });

      it("cliente cannot update anything", () => {
        expect(permissions.canUpdate("cliente", "task")).toBe(false);
        expect(permissions.canUpdate("cliente", "project")).toBe(false);
      });
    });

    describe("canDelete", () => {
      it("admin can delete all resources", () => {
        expect(permissions.canDelete("admin", "project")).toBe(true);
        expect(permissions.canDelete("admin", "task")).toBe(true);
      });

      it("pm can delete project resources", () => {
        expect(permissions.canDelete("pm", "project")).toBe(true);
        expect(permissions.canDelete("pm", "task")).toBe(true);
      });

      it("operativo cannot delete anything", () => {
        expect(permissions.canDelete("operativo", "task")).toBe(false);
      });

      it("cliente cannot delete anything", () => {
        expect(permissions.canDelete("cliente", "task")).toBe(false);
      });
    });
  });
});
