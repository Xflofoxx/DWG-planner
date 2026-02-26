let mockUsers = [];
let mockProjects = [];
let mockDwgFiles = [];
let mockTasks = [];
let mockMappings = [];
let mockAuditLogs = [];

const database = {
  prepare: jest.fn((sql) => {
    const isInsert = sql.trim().toUpperCase().startsWith('INSERT');
    const isSelect = sql.trim().toUpperCase().startsWith('SELECT');
    const isUpdate = sql.trim().toUpperCase().startsWith('UPDATE');
    const isDelete = sql.trim().toUpperCase().startsWith('DELETE');
    
    const tableMatch = sql.match(/FROM\s+(\w+)/i) || sql.match(/INTO\s+(\w+)/i) || sql.match(/UPDATE\s+(\w+)/i);
    const table = tableMatch ? tableMatch[1] : null;
    
    return {
      run: function(...args) {
        if (table === 'users') {
          if (isInsert) {
            mockUsers.push({ id: args[0], email: args[1], password: args[2], role: args[3] || 'user' });
            return { changes: 1 };
          }
          if (isUpdate) {
            const user = mockUsers.find(u => u.id === args[args.length - 1]);
            if (user) {
              if (args[0]) user.email = args[0];
              if (args[1]) user.role = args[1];
            }
            return { changes: user ? 1 : 0 };
          }
          if (isDelete) {
            const idx = mockUsers.findIndex(u => u.id === args[0]);
            if (idx !== -1) { mockUsers.splice(idx, 1); return { changes: 1 }; }
            return { changes: 0 };
          }
        }
        if (table === 'projects') {
          if (isInsert) {
            mockProjects.push({ id: args[0], name: args[1], description: args[2] || '' });
            return { changes: 1 };
          }
          if (isUpdate) {
            const proj = mockProjects.find(p => p.id === args[args.length - 1]);
            if (proj) {
              if (args[0]) proj.name = args[0];
              if (args[1]) proj.description = args[1];
            }
            return { changes: proj ? 1 : 0 };
          }
          if (isDelete) {
            const idx = mockProjects.findIndex(p => p.id === args[0]);
            if (idx !== -1) { mockProjects.splice(idx, 1); return { changes: 1 }; }
            return { changes: 0 };
          }
        }
        if (table === 'dwg_files') {
          if (isInsert) {
            mockDwgFiles.push({ id: args[0], project_id: args[1], name: args[2], version: args[3] || '1.0', size: args[4] || 0, mime_type: args[5] || 'application/acad' });
            return { changes: 1 };
          }
          if (isUpdate) {
            const dwg = mockDwgFiles.find(d => d.id === args[args.length - 1]);
            if (dwg) {
              if (args[0]) dwg.name = args[0];
              if (args[1]) dwg.version = args[1];
            }
            return { changes: dwg ? 1 : 0 };
          }
          if (isDelete) {
            const idx = mockDwgFiles.findIndex(d => d.id === args[0]);
            if (idx !== -1) { mockDwgFiles.splice(idx, 1); return { changes: 1 }; }
            return { changes: 0 };
          }
        }
        if (table === 'tasks') {
          if (isInsert) {
            mockTasks.push({ id: args[0], project_id: args[1], title: args[2], description: args[3] || '', status: args[4] || 'pending', priority: args[5] || 'medium', assigned_to: args[6] });
            return { changes: 1 };
          }
          if (isUpdate) {
            const task = mockTasks.find(t => t.id === args[args.length - 1]);
            if (task) {
              if (args[0]) task.title = args[0];
              if (args[1]) task.description = args[1];
              if (args[2]) task.status = args[2];
              if (args[3]) task.priority = args[3];
              if (args[4] !== undefined) task.assigned_to = args[4];
            }
            return { changes: task ? 1 : 0 };
          }
          if (isDelete) {
            const idx = mockTasks.findIndex(t => t.id === args[0]);
            if (idx !== -1) { mockTasks.splice(idx, 1); return { changes: 1 }; }
            return { changes: 0 };
          }
        }
        if (table === 'mappings') {
          if (isInsert) {
            mockMappings.push({ id: args[0], dwg_file_id: args[1], layer: args[2], handle: args[3], tag: args[4], task_field: args[5], planning_field: args[6] });
            return { changes: 1 };
          }
          if (isUpdate) {
            const mapping = mockMappings.find(m => m.id === args[args.length - 1]);
            if (mapping) {
              if (args[0]) mapping.layer = args[0];
              if (args[1]) mapping.handle = args[1];
              if (args[2]) mapping.tag = args[2];
              if (args[3]) mapping.task_field = args[3];
              if (args[4]) mapping.planning_field = args[4];
            }
            return { changes: mapping ? 1 : 0 };
          }
          if (isDelete) {
            const idx = mockMappings.findIndex(m => m.id === args[0]);
            if (idx !== -1) { mockMappings.splice(idx, 1); return { changes: 1 }; }
            return { changes: 0 };
          }
        }
        if (table === 'audit_logs') {
          if (isInsert) {
            mockAuditLogs.push({ id: args[0], user_id: args[1], action: args[2], resource_type: args[3], resource_id: args[4], details: args[5] });
            return { changes: 1 };
          }
        }
        return { changes: 0 };
      },
      get: (...args) => {
        if (table === 'users') {
          if (sql.includes('WHERE email =')) return mockUsers.find(u => u.email === args[0]);
          if (sql.includes('WHERE id =')) return mockUsers.find(u => u.id === args[0]);
          return mockUsers[0];
        }
        if (table === 'projects') return mockProjects.find(p => p.id === args[0]);
        if (table === 'dwg_files') {
          if (sql.includes('WHERE id =')) return mockDwgFiles.find(d => d.id === args[0]);
          return mockDwgFiles[0];
        }
        if (table === 'tasks') {
          if (sql.includes('WHERE id =')) return mockTasks.find(t => t.id === args[0]);
          return mockTasks[0];
        }
        if (table === 'mappings') return mockMappings.find(m => m.id === args[0]);
        if (table === 'audit_logs') return mockAuditLogs.find(a => a.id === args[0]);
        return undefined;
      },
      all: (...args) => {
        if (table === 'users') return [...mockUsers];
        if (table === 'projects') return [...mockProjects];
        if (table === 'dwg_files') {
          if (sql.includes('WHERE project_id =')) return mockDwgFiles.filter(d => d.project_id === args[0]);
          return [...mockDwgFiles];
        }
        if (table === 'tasks') {
          if (sql.includes('WHERE t.assigned_to')) return mockTasks.filter(t => t.assigned_to === args[0]);
          if (sql.includes('WHERE project_id =') || sql.includes('t.project_id')) return mockTasks.filter(t => t.project_id === args[0]);
          return [...mockTasks];
        }
        if (table === 'mappings') {
          if (sql.includes('WHERE dwg_file_id =')) return mockMappings.filter(m => m.dwg_file_id === args[0]);
          return [...mockMappings];
        }
        if (table === 'audit_logs') {
          if (sql.includes('WHERE user_id =')) return mockAuditLogs.filter(a => a.user_id === args[0]);
          if (sql.includes('WHERE resource_type =') && sql.includes('resource_id =')) return mockAuditLogs.filter(a => a.resource_type === args[0] && a.resource_id === args[1]);
          return [...mockAuditLogs];
        }
        return [];
      }
    };
  }),
  exec: jest.fn(),
  reset: () => {
    mockUsers = [];
    mockProjects = [];
    mockDwgFiles = [];
    mockTasks = [];
    mockMappings = [];
    mockAuditLogs = [];
  }
};

module.exports = database;