const supertest = require('supertest');
const server = require('../src/server');
let request = supertest(server.app);
let projectController = require('../src/controller/projects.controller');

let projectMockRepository = {
	getProject: jest.fn(),
	getProjectByid: jest.fn(),
	createProject: jest.fn(),
	updateProject: jest.fn()
};
projectController.setProjectDB(projectMockRepository); // Mock repository interaction

describe('POST /api/project', () => {
	beforeEach(() => {
		projectMockRepository.createProject.mockReset();
		// projectMockRepository.mockResolvedValue(0)
	});

	afterAll(() => {

	});

	test('should create a new project', async () => {
		let body = {name: 'proyecto1', description: 'proyecto  re copado'};

		const res = await request.post('/api/project').send(body);


		expect(projectMockRepository.createProject.mock.calls.length).toBe(1);
		expect(projectMockRepository.createProject.mock.calls[0][0]).toBe(body.name);
		expect(projectMockRepository.createProject.mock.calls[0][1]).toBe(body.description);
		expect(res.status).toBe(200);
		expect(res.body.message).toBe('project added successfully');
	});
});

describe('GET /api/project', () => {
	beforeEach(() => {
		projectMockRepository.getProject.mockReset();
		projectMockRepository.getProjectByid.mockReset();
		// projectMockRepository.mockResolvedValue(0)
	});

	afterAll(() => {

	});

	test('get project id 123', async () => {

		projectMockRepository.getProjectByid.mockReturnValueOnce({
			name: 'producto1',
			description: 'que te importa'
		});

		const res = await request.get('/api/project/123');


		expect(projectMockRepository.getProjectByid.mock.calls.length).toBe(1);
		expect(projectMockRepository.getProjectByid.mock.calls[0][0]).toBe('123');
		expect(res.status).toBe(200);
		expect(res.body).toStrictEqual({
			name: 'producto1',
			description: 'que te importa'
		});
	});

	test('update project id 456', async () => {

		let projectUpdated = {
			name: 'producto1',
			description: 'que te importa'
		};

		projectMockRepository.updateProject.mockReturnValueOnce(projectUpdated);

		const res = await request.put('/api/project/456').send(projectUpdated);


		expect(projectMockRepository.updateProject.mock.calls.length).toBe(1);
		expect(projectMockRepository.updateProject.mock.calls[0][0]).toBe('456');
		expect(projectMockRepository.updateProject.mock.calls[0][1]).toBe(projectUpdated.name);
		expect(projectMockRepository.updateProject.mock.calls[0][2]).toBe(projectUpdated.description);
		expect(res.status).toBe(200);
		expect(res.body).toStrictEqual(projectUpdated);
	});

	test('update project id 456 fails due to db unavailable', async () => {

		let projectUpdated = {
			name: 'producto1',
			description: 'que te importa'
		};

		projectMockRepository.updateProject.mockImplementationOnce(() => {
			throw new Error('database unavailable');
		});

		const res = await request.put('/api/project/456').send(projectUpdated);

		expect(res.status).toBe(500);
		expect(res.text).toContain('database unavailable');

	});
});