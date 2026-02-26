const DWGFileModel = require('../../src/models/DWGFile');
const mockDb = require('../../tests/__mocks__/database');

describe('DWGFile Model', () => {
  beforeEach(() => {
    mockDb.reset();
  });

  describe('DWGFile.create', () => {
    it('should create a new DWG file', () => {
      const projectId = 'proj-123';
      const name = 'test.dwg';
      const version = '1.0';
      const size = 1024;
      const mimeType = 'application/acad';

      const dwg = DWGFileModel.create(projectId, name, version, size, mimeType);

      expect(dwg).toHaveProperty('id');
      expect(dwg.name).toBe(name);
      expect(dwg.project_id).toBe(projectId);
      expect(dwg.version).toBe(version);
    });

    it('should create DWG with default values', () => {
      const dwg = DWGFileModel.create('proj-1', 'default.dwg');

      expect(dwg).toHaveProperty('id');
      expect(dwg.version).toBe('1.0');
      expect(dwg.size).toBe(0);
    });
  });

  describe('DWGFile.findById', () => {
    it('should find DWG file by id', () => {
      const created = DWGFileModel.create('proj-1', 'findme.dwg');
      
      const dwg = DWGFileModel.findById(created.id);

      expect(dwg).toBeDefined();
      expect(dwg.id).toBe(created.id);
    });
  });

  describe('DWGFile.findByProject', () => {
    it('should return DWG files for a project', () => {
      const projectId = 'proj-test';
      DWGFileModel.create(projectId, 'file1.dwg');
      DWGFileModel.create(projectId, 'file2.dwg');

      const files = DWGFileModel.findByProject(projectId);

      expect(files.length).toBe(2);
    });
  });

  describe('DWGFile.findAll', () => {
    it('should return all DWG files', () => {
      DWGFileModel.create('p1', 'all1.dwg');
      DWGFileModel.create('p2', 'all2.dwg');

      const files = DWGFileModel.findAll();

      expect(files.length).toBe(2);
    });
  });

  describe('DWGFile.update', () => {
    it('should update DWG file name and version', () => {
      const dwg = DWGFileModel.create('proj-1', 'old.dwg');
      
      const result = DWGFileModel.update(dwg.id, { name: 'new.dwg', version: '2.0' });

      expect(result.changes).toBe(1);
    });
  });

  describe('DWGFile.delete', () => {
    it('should delete a DWG file', () => {
      const dwg = DWGFileModel.create('proj-1', 'delete.dwg');
      
      const result = DWGFileModel.delete(dwg.id);

      expect(result.changes).toBe(1);
    });
  });
});