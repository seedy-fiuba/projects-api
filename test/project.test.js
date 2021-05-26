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
		let body = {
			title: "pad gamer",
			description: "teclado gamer rgb con muchas luces",
			category: "gamer",
			mediaUrls: ["foto/fachera"],
			targetAmount: 123.22,
			location: {
				x: -34.610955,
				y: -58.436967
			},
			hashtags: ["gamer", "rgb", "mecanico"]
		};

		let doc = {
			_id: 123,
			title: "pad gamer",
			description: "teclado gamer rgb con muchas luces",
			category: "gamer",
			mediaUrls: ["foto/fachera"],
			targetAmount: 123.22,
			fundedAmount: 0.0,
			location: {
				coordinates: [
					-34.610955,
					-58.436967
				],
				type: "Point"
			},
			hashtags: ["gamer", "rgb", "mecanico"]
		};
		projectMockRepository.createProject.mockReturnValueOnce(doc)

		const res = await request.post('/api/project').set('X-Override-Token','true').send(body);

		expect(projectMockRepository.createProject.mock.calls.length).toBe(1);
		expect(projectMockRepository.createProject.mock.calls[0][0]).toMatchObject(body);
		expect(res.status).toBe(200);
		expect(res.body).toMatchObject(doc);
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

		const res = await request.get('/api/project/123').set('X-Override-Token','true');


		expect(projectMockRepository.getProjectByid.mock.calls.length).toBe(1);
		expect(projectMockRepository.getProjectByid.mock.calls[0][0]).toBe('123');
		expect(res.status).toBe(200);
		expect(res.body).toStrictEqual({
			name: 'producto1',
			description: 'que te importa'
		});
	});

	test('update project id 456', async () => {
		let body = {
			title: "pad gamer",
			description: "teclado gamer rgb con muchas luces",
			category: "gamer",
			mediaUrls: ["foto/fachera"],
			location: {
				x: -34.610955,
				y: -58.436967
			},
			hashtags: ["gamer", "rgb", "mecanico"]
		};

		let projectUpdated = {
			_id: 123,
			title: "pad gamer",
			description: "teclado gamer rgb con muchas luces",
			category: "gamer",
			mediaUrls: ["foto/fachera"],
			targetAmount: 123.22,
			fundedAmount: 0.0,
			location: {
				coordinates: [
					-34.610955,
					-58.436967
				],
				type: "Point"
			},
			hashtags: ["gamer", "rgb", "mecanico"]
		};

		projectMockRepository.updateProject.mockReturnValueOnce(projectUpdated);

		const res = await request.put('/api/project/456').set('X-Override-Token','true').send(body);

		expect(projectMockRepository.updateProject.mock.calls.length).toBe(1);
		expect(projectMockRepository.updateProject.mock.calls[0][0]).toBe('456');
		expect(projectMockRepository.updateProject.mock.calls[0][1]).toMatchObject(body);
		expect(res.status).toBe(200);
		expect(res.body).toStrictEqual(projectUpdated);
	});

	test('update project id 456 fails due to db unavailable', async () => {

		let body = {
			title: "pad gamer",
			description: "teclado gamer rgb con muchas luces",
			category: "gamer",
			mediaUrls: ["foto/fachera"],
			location: {
				x: -34.610955,
				y: -58.436967
			},
			hashtags: ["gamer", "rgb", "mecanico"]
		};

		projectMockRepository.updateProject.mockImplementationOnce(() => {
			throw new Error('database unavailable');
		});

		const res = await request.put('/api/project/456').set('X-Override-Token','true').send(body);

		expect(res.status).toBe(500);
		expect(res.text).toContain('database unavailable');

	});
});