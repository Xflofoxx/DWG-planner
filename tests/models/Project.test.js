const ProjectModel = require('../../src/models/Project');

describe('Project Model', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('Project.create', () => {
    it('should create a new project with name', () => {
      const name = 'Test Project';
      const description = 'Test Description';

      const project = ProjectModel.create(name, description);

      expect(project).toHaveProperty('id');
      expect(project.name).toBe(name);
      expect(project.description).toBe(description);
    });

    it('should create project with empty description', () => {
      const project = ProjectModel.create('Project No Desc');

      expect(project).toHaveProperty('id');
      expect(project.description).toBe('');
    });
  });

  describe('Project.findById', () => {
    it('should find project by id', () => {
      const created = ProjectModel.create('FindById Project');
      
      const project = ProjectModel.findById(created.id);

      expect(project).toBeDefined();
      expect(project.id).toBe(created.id);
    });
  });

  describe('Project.findAll', () => {
    it('should return all projects', () => {
      ProjectModel.create('Project 1');
      ProjectModel.create('Project 2');

      const projects = ProjectModel.findAll();

      expect(projects.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Project.update', () => {
    it('should update project name and description', () => {
      const project = ProjectModel.create('Original Name');
      
      const result = ProjectModel.update(project.id, { 
        name: 'Updated Name', 
        description: 'Updated Description' 
      });

      expect(result.changes).toBe(1);
    });
  });

  describe('Project.delete', () => {
    it('should delete a project', () => {
      const project = ProjectModel.create('Delete Me');
      
      const result = ProjectModel.delete(project.id);

      expect(result.changes).toBe(1);
    });
  });
});