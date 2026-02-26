const ProjectUser = require("../models/ProjectUser");

const ROLES = {
  ADMIN: "admin",
  PM: "pm",
  OPERATIVO: "operativo",
  CLIENTE: "cliente",
  USER: "user",
};

const ROLE_HIERARCHY = {
  admin: 4,
  pm: 3,
  operativo: 2,
  cliente: 1,
  user: 0,
};

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userRole = req.user.role;

    if (allowedRoles.includes(userRole)) {
      return next();
    }

    return res.status(403).json({ message: "Insufficient permissions" });
  };
}

function requireRoleOrHigher(minRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userLevel = ROLE_HIERARCHY[req.user.role] || 0;
    const requiredLevel = ROLE_HIERARCHY[minRole] || 0;

    if (userLevel >= requiredLevel) {
      return next();
    }

    return res.status(403).json({ message: "Insufficient permissions" });
  };
}

async function checkProjectAccess(requiredRole = null) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userId = req.user.userId;
    const userRole = req.user.role;
    const projectId =
      req.params.projectId || req.params.project_id || req.body.project_id;

    if (userRole === ROLES.ADMIN) {
      return next();
    }

    if (!projectId) {
      return next();
    }

    const projectUser = ProjectUser.findByProjectAndUser(projectId, userId);

    if (!projectUser && userRole !== ROLES.ADMIN) {
      return res.status(403).json({ message: "Access denied to this project" });
    }

    if (requiredRole) {
      const userLevel = ROLE_HIERARCHY[projectUser.role] || 0;
      const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;

      if (userLevel < requiredLevel) {
        return res
          .status(403)
          .json({ message: "Insufficient project permissions" });
      }
    }

    req.projectRole = projectUser ? projectUser.role : null;
    next();
  };
}

const permissions = {
  canCreate: (role, resource) => {
    const createPermissions = {
      admin: ["user", "project", "task", "dwg", "mapping", "auditLog"],
      pm: ["project", "task", "dwg", "mapping"],
      operativo: [],
      cliente: [],
    };
    return createPermissions[role]?.includes(resource) || false;
  },

  canRead: (role, resource) => {
    const readPermissions = {
      admin: ["user", "project", "task", "dwg", "mapping", "auditLog"],
      pm: ["project", "task", "dwg", "mapping", "auditLog"],
      operativo: ["project", "task", "dwg", "mapping"],
      cliente: ["project", "task", "dwg", "mapping"],
    };
    return readPermissions[role]?.includes(resource) || false;
  },

  canUpdate: (role, resource) => {
    const updatePermissions = {
      admin: ["user", "project", "task", "dwg", "mapping"],
      pm: ["project", "task", "dwg", "mapping"],
      operativo: ["task"],
      cliente: [],
    };
    return updatePermissions[role]?.includes(resource) || false;
  },

  canDelete: (role, resource) => {
    const deletePermissions = {
      admin: ["user", "project", "task", "dwg", "mapping"],
      pm: ["project", "task", "dwg", "mapping"],
      operativo: [],
      cliente: [],
    };
    return deletePermissions[role]?.includes(resource) || false;
  },
};

module.exports = {
  ROLES,
  ROLE_HIERARCHY,
  requireRole,
  requireRoleOrHigher,
  checkProjectAccess,
  permissions,
};
