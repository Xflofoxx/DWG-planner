const MappingModel = require('../../src/models/Mapping');
const mockDb = require('../../tests/__mocks__/database');

describe('Mapping Model', () => {
  beforeEach(() => {
    mockDb.reset();
  });

  describe('Mapping.create', () => {
    it('should create a new mapping', () => {
      const dwgFileId = 'dwg-123';
      const layer = 'Layer1';
      const handle = 'ABC123';
      const tag = 'TAG1';
      const taskField = 'title';
      const planningField = 'planned_date';

      const mapping = MappingModel.create(dwgFileId, layer, handle, tag, taskField, planningField);

      expect(mapping).toHaveProperty('id');
      expect(mapping.dwg_file_id).toBe(dwgFileId);
      expect(mapping.layer).toBe(layer);
      expect(mapping.handle).toBe(handle);
      expect(mapping.task_field).toBe(taskField);
      expect(mapping.planning_field).toBe(planningField);
    });
  });

  describe('Mapping.findById', () => {
    it('should find mapping by id', () => {
      const created = MappingModel.create('dwg-1', 'Layer1', 'H1', 'T1', 'f1', 'p1');
      
      const mapping = MappingModel.findById(created.id);

      expect(mapping).toBeDefined();
      expect(mapping.id).toBe(created.id);
    });
  });

  describe('Mapping.findByDwgFile', () => {
    it('should return mappings for a DWG file', () => {
      const dwgFileId = 'dwg-test';
      MappingModel.create(dwgFileId, 'L1', 'H1', 'f1', 'T1', 'p1');
      MappingModel.create(dwgFileId, 'L2', 'H2', 'T2', 'f2', 'p2');

      const mappings = MappingModel.findByDwgFile(dwgFileId);

      expect(mappings.length).toBe(2);
    });
  });

  describe('Mapping.findAll', () => {
    it('should return all mappings', () => {
      MappingModel.create('d1', 'L1', 'H1', 'T1', 'f1', 'p1');
      MappingModel.create('d2', 'L2', 'H2', 'T2', 'f2', 'p2');

      const mappings = MappingModel.findAll();

      expect(mappings.length).toBe(2);
    });
  });

  describe('Mapping.update', () => {
    it('should update mapping fields', () => {
      const mapping = MappingModel.create('dwg-1', 'OldLayer', 'OldHandle', 'OldTag', 'oldField', 'oldPlan');
      
      const result = MappingModel.update(mapping.id, { 
        layer: 'NewLayer',
        task_field: 'newField'
      });

      expect(result.changes).toBe(1);
    });
  });

  describe('Mapping.delete', () => {
    it('should delete a mapping', () => {
      const mapping = MappingModel.create('dwg-1', 'L1', 'H1', 'T1', 'f1', 'p1');
      
      const result = MappingModel.delete(mapping.id);

      expect(result.changes).toBe(1);
    });
  });
});