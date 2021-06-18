const supertest = require('supertest');
const server = require('../src/server');
let request = supertest(server.app);
let projectMockRepository = require('../src/repository/projects');
let authenticationMock = require('../src/client/authentication')

jest.mock('../src/client/authentication', () => {
	return {authenticateToken: jest.fn()}
})

jest.mock('../src/repository/projects', () => {
	return {
		getProject: jest.fn(),
		getProjectByid: jest.fn(),
		createProject: jest.fn(),
		updateProject: jest.fn(),
		searchProjects: jest.fn(),
		getAvgProjectsByUser: jest.fn()
	};
});

describe('POST /api/project', () => {
	beforeEach(() => {
		projectMockRepository.createProject.mockReset();
		authenticationMock.authenticateToken.mockReset()
		projectMockRepository.getAvgProjectsByUser.mockReset()
	});

	afterAll(() => {

	});

	test('should create a new project', async () => {
		let tomorrow = new Date()
		tomorrow.setDate(tomorrow.getDate() + 1)

		let body = {
			title: 'pad gamer',
			description: 'teclado gamer rgb con muchas luces',
			category: 'gamer',
			mediaUrls: ['foto/fachera'],
			location: {
				x: -34.610955,
				y: -58.436967
			},
			stages: [
				{
					track: "armado",
					targetAmount: 12.22
				},
				{
					track: "distribucion",
					targetAmount: 125.22
				}
			],
			finishDate: tomorrow.toISOString(),
			ownerId: 234,
			hashtags: ['gamer', 'rgb', 'mecanico']
		};

		let doc = {
			_id: 123,
			title: 'pad gamer',
			description: 'teclado gamer rgb con muchas luces',
			category: 'gamer',
			mediaUrls: ['foto/fachera'],
			fundedAmount: 0.0,
			location: {
				coordinates: [
					-34.610955,
					-58.436967
				],
				type: 'Point'
			},
			hashtags: ['gamer', 'rgb', 'mecanico'],
			stages: [
				{
					track: "armado",
					targetAmount: 12.22
				},
				{
					track: "distribucion",
					targetAmount: 125.22
				}
			],
			finishDate: tomorrow.toISOString(),
			ownerId: 234,
			reviewerId: 0,
			status: 'created',
		};

		projectMockRepository.createProject.mockReturnValueOnce(doc);
		projectMockRepository.getAvgProjectsByUser.mockReturnValueOnce([{projectAvgByUser: 5.12}]);

		const res = await request.post('/api/project').set('X-Override-Token','true').send(body);

		expect(projectMockRepository.createProject.mock.calls.length).toBe(1);
		expect(projectMockRepository.getAvgProjectsByUser.mock.calls.length).toBe(1);

		// payload for project creation
		body.status = 'created'
		body.reviewerId = 0
		body.finishDate = tomorrow
		expect(projectMockRepository.createProject.mock.calls[0][0]).toStrictEqual(body);
		expect(res.status).toBe(200);
		expect(res.body).toStrictEqual(doc);
	});

	test('create a new project use ownerId from token', async () => {
		let tomorrow = new Date()
		tomorrow.setDate(tomorrow.getDate() + 1)

		let body = {
			title: 'pad gamer',
			description: 'teclado gamer rgb con muchas luces',
			category: 'gamer',
			mediaUrls: ['foto/fachera'],
			location: {
				x: -34.610955,
				y: -58.436967
			},
			stages: [
				{
					track: "armado",
					targetAmount: 12.22
				},
				{
					track: "distribucion",
					targetAmount: 125.22
				}
			],
			finishDate: tomorrow.toISOString(),
			hashtags: ['gamer', 'rgb', 'mecanico']
		};

		let doc = {
			_id: 123,
			title: 'pad gamer',
			description: 'teclado gamer rgb con muchas luces',
			category: 'gamer',
			mediaUrls: ['foto/fachera'],
			fundedAmount: 0.0,
			location: {
				coordinates: [
					-34.610955,
					-58.436967
				],
				type: 'Point'
			},
			hashtags: ['gamer', 'rgb', 'mecanico'],
			stages: [
				{
					track: "armado",
					targetAmount: 12.22
				},
				{
					track: "distribucion",
					targetAmount: 125.22
				}
			],
			finishDate: tomorrow.toISOString(),
			ownerId: 555,
			reviewerId: 0,
			status: 'created',
		};

		projectMockRepository.createProject.mockReturnValueOnce(doc);
		projectMockRepository.getAvgProjectsByUser.mockReturnValueOnce([{projectAvgByUser: 2.5}]);
		authenticationMock.authenticateToken.mockReturnValueOnce({
			message: 'authorized',
			identity: {
				id: 555
			}
		})

		const res = await request.post('/api/project').set('X-auth-Token','asdfasdfasdfs').send(body);

		expect(projectMockRepository.createProject.mock.calls.length).toBe(1);
		expect(authenticationMock.authenticateToken.mock.calls.length).toBe(1);
		expect(projectMockRepository.getAvgProjectsByUser.mock.calls.length).toBe(1);

		// payload for project creation
		body.status = 'created'
		body.reviewerId = 0
		body.ownerId = 555
		body.finishDate = tomorrow
		expect(projectMockRepository.createProject.mock.calls[0][0]).toStrictEqual(body);
		expect(res.status).toBe(200);
		expect(res.body).toStrictEqual(doc);
	});

	test('create a new project with reviewerId', async () => {
		let tomorrow = new Date()
		tomorrow.setDate(tomorrow.getDate() + 1)

		let body = {
			title: 'pad gamer',
			description: 'teclado gamer rgb con muchas luces',
			category: 'gamer',
			mediaUrls: ['foto/fachera'],
			location: {
				x: -34.610955,
				y: -58.436967
			},
			stages: [
				{
					track: "armado",
					targetAmount: 12.22
				},
				{
					track: "distribucion",
					targetAmount: 125.22
				}
			],
			reviewerId: 223,
			finishDate: tomorrow.toISOString(),
			hashtags: ['gamer', 'rgb', 'mecanico']
		};

		let doc = {
			_id: 123,
			title: 'pad gamer',
			description: 'teclado gamer rgb con muchas luces',
			category: 'gamer',
			mediaUrls: ['foto/fachera'],
			fundedAmount: 0.0,
			location: {
				coordinates: [
					-34.610955,
					-58.436967
				],
				type: 'Point'
			},
			hashtags: ['gamer', 'rgb', 'mecanico'],
			stages: [
				{
					track: "armado",
					targetAmount: 12.22
				},
				{
					track: "distribucion",
					targetAmount: 125.22
				}
			],
			finishDate: tomorrow.toISOString(),
			ownerId: 555,
			reviewerId: 223,
			status: 'created',
		};

		projectMockRepository.createProject.mockReturnValueOnce(doc);
		projectMockRepository.getAvgProjectsByUser.mockReturnValueOnce([{projectAvgByUser: 345.12}])
		authenticationMock.authenticateToken.mockReturnValueOnce({
			message: 'authorized',
			identity: {
				id: 555
			}
		})

		const res = await request.post('/api/project').set('X-auth-Token','asdfasdfasdfs').send(body);

		expect(projectMockRepository.createProject.mock.calls.length).toBe(1);
		expect(projectMockRepository.getAvgProjectsByUser.mock.calls.length).toBe(1);
		expect(authenticationMock.authenticateToken.mock.calls.length).toBe(1);

		// payload for project creation
		body.status = 'in-progress'
		body.ownerId = 555
		body.finishDate = tomorrow
		expect(projectMockRepository.createProject.mock.calls[0][0]).toStrictEqual(body);
		expect(res.status).toBe(200);
		expect(res.body).toStrictEqual(doc);
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

	test('get project id 123 not found', async () => {

		projectMockRepository.getProjectByid.mockReturnValueOnce(null);

		const res = await request.get('/api/project/123').set('X-Override-Token','true');

		expect(projectMockRepository.getProjectByid.mock.calls.length).toBe(1);
		expect(projectMockRepository.getProjectByid.mock.calls[0][0]).toBe('123');

		expect(res.status).toBe(404);
		expect(res.body.message).toContain('inexistent project');
	});
});

describe('PUT /api/project/{projectId}', () => {
	beforeEach(() => {
		projectMockRepository.getProjectByid.mockReset()
		projectMockRepository.updateProject.mockReset()
		authenticationMock.authenticateToken.mockReset()
	})

	test('update project id 456', async () => {
		let body = {
			title: 'pad gamer',
			description: 'teclado gamer rgb con muchas luces',
			category: 'gamer',
			mediaUrls: ['foto/fachera'],
			location: {
				x: -34.610955,
				y: -58.436967
			},
			hashtags: ['gamer', 'rgb', 'mecanico']
		};

		let oldProject = {
			_id: 123,
			title: 'pad gamer re loco',
			description: 'teclado gamer rgb con pocas luces',
			category: 'rgb',
			mediaUrls: ['foto/fachera'],
			targetAmount: 123.22,
			fundedAmount: 0.0,
			location: {
				coordinates: [
					-34.610955,
					-58.436967
				],
				type: 'Point'
			},
			hashtags: ['gamer', 'rgb', 'mecanico']
		};

		let projectUpdated = {
			_id: 123,
			title: 'pad gamer',
			description: 'teclado gamer rgb con muchas luces',
			category: 'gamer',
			mediaUrls: ['foto/fachera'],
			targetAmount: 123.22,
			fundedAmount: 0.0,
			location: {
				coordinates: [
					-34.610955,
					-58.436967
				],
				type: 'Point'
			},
			hashtags: ['gamer', 'rgb', 'mecanico']
		};

		projectMockRepository.getProjectByid.mockReturnValueOnce(oldProject);
		projectMockRepository.updateProject.mockReturnValueOnce(projectUpdated);

		const res = await request.put('/api/project/456').set('X-Override-Token','true').send(body);

		expect(projectMockRepository.getProjectByid.mock.calls.length).toBe(1);
		expect(projectMockRepository.getProjectByid.mock.calls[0][0]).toBe('456');
		expect(projectMockRepository.updateProject.mock.calls.length).toBe(1);
		expect(projectMockRepository.updateProject.mock.calls[0][0]).toBe('456');
		expect(projectMockRepository.updateProject.mock.calls[0][1]).toMatchObject(body);
		expect(res.status).toBe(200);
		expect(res.body).toStrictEqual(projectUpdated);
	});

	test('update project with reviewerId change status to in-progress', async () => {
		let body = {
			reviewerId: 2342
		};

		let oldProject = {
			_id: 123,
			title: 'pad gamer re loco',
			description: 'teclado gamer rgb con pocas luces',
			category: 'rgb',
			mediaUrls: ['foto/fachera'],
			targetAmount: 123.22,
			fundedAmount: 0.0,
			status: 'created',
			reviewerId: 0,
			location: {
				coordinates: [
					-34.610955,
					-58.436967
				],
				type: 'Point'
			},
			hashtags: ['gamer', 'rgb', 'mecanico']
		};

		let projectUpdated = {
			_id: 123,
			title: 'pad gamer re loco',
			description: 'teclado gamer rgb con pocas luces',
			category: 'rgb',
			mediaUrls: ['foto/fachera'],
			targetAmount: 123.22,
			fundedAmount: 0.0,
			location: {
				coordinates: [
					-34.610955,
					-58.436967
				],
				type: 'Point'
			},
			reviewerId: 2342,
			hashtags: ['gamer', 'rgb', 'mecanico']
		};

		projectMockRepository.getProjectByid.mockReturnValueOnce(oldProject);
		projectMockRepository.updateProject.mockReturnValueOnce(projectUpdated);

		const res = await request.put('/api/project/456').set('X-Override-Token','true').send(body);

		expect(projectMockRepository.getProjectByid.mock.calls.length).toBe(1);
		expect(projectMockRepository.getProjectByid.mock.calls[0][0]).toBe('456');
		expect(projectMockRepository.updateProject.mock.calls.length).toBe(1);
		expect(projectMockRepository.updateProject.mock.calls[0][0]).toBe('456');

		body.status = 'in-progress'
		expect(projectMockRepository.updateProject.mock.calls[0][1]).toStrictEqual(body);
		expect(res.status).toBe(200);
		expect(res.body).toStrictEqual(projectUpdated);
	});

	test('update project id 456 fails due to db unavailable', async () => {

		let body = {
			title: 'pad gamer',
			description: 'teclado gamer rgb con muchas luces',
			category: 'gamer',
			mediaUrls: ['foto/fachera'],
			location: {
				x: -34.610955,
				y: -58.436967
			},
			hashtags: ['gamer', 'rgb', 'mecanico']
		};

		projectMockRepository.getProjectByid.mockImplementationOnce(() => {
			return {}
		});
		projectMockRepository.updateProject.mockImplementationOnce(() => {
			throw new Error('database unavailable');
		});

		const res = await request.put('/api/project/456').set('X-Override-Token','true').send(body);

		expect(res.status).toBe(500);
		expect(res.text).toContain('database unavailable');

	});

	test('fail update with empty body', async () => {

		let body = {};

		const res = await request.put('/api/project/456').set('X-Override-Token','true').send(body);

		expect(res.status).toBe(400);
		expect(res.text).toContain('at least one field is required to update');

	});
});

describe('GET /api/project/search', () => {
	beforeEach(() => {
		projectMockRepository.searchProjects.mockReset();
	});

	test('search by location', async () => {

		let projectDoc = {
			_id: 123,
			title: 'pad gamer',
			description: 'teclado gamer rgb con muchas luces',
			category: 'gamer',
			mediaUrls: ['foto/fachera'],
			targetAmount: 123.22,
			fundedAmount: 0.0,
			location: {
				coordinates: [
					-34.610955,
					-58.436967
				],
				type: 'Point'
			},
			hashtags: ['gamer', 'rgb', 'mecanico']
		};

		projectMockRepository.searchProjects.mockReturnValueOnce([projectDoc]);

		const res = await request.get('/api/project/search').set('X-Override-Token','true').query({
			locationX: 10,
			locationY: 23
		});

		expect(projectMockRepository.searchProjects.mock.calls.length).toBe(1);
		expect(projectMockRepository.searchProjects.mock.calls[0][0]).toMatchObject({
			locationX: 10,
			locationY: 23
		});

		expect(res.status).toBe(200);
		expect(res.body['size']).toBe(1);
		expect(res.body['results'][0]).toStrictEqual(projectDoc);
	});

	test('search by hashtags', async () => {

		let projectDoc = {
			_id: 123,
			title: 'pad gamer',
			description: 'teclado gamer rgb con muchas luces',
			category: 'gamer',
			mediaUrls: ['foto/fachera'],
			targetAmount: 123.22,
			fundedAmount: 0.0,
			location: {
				coordinates: [
					-34.610955,
					-58.436967
				],
				type: 'Point'
			},
			hashtags: ['gamer', 'rgb', 'mecanico']
		};

		projectMockRepository.searchProjects.mockReturnValueOnce([projectDoc]);

		const res = await request.get('/api/project/search').set('X-Override-Token','true').query({
			hashtags: 'rgb,mecanico'
		});

		expect(projectMockRepository.searchProjects.mock.calls.length).toBe(1);
		expect(projectMockRepository.searchProjects.mock.calls[0][0]).toMatchObject({
			hashtags: ['rgb', 'mecanico']
		});

		expect(res.status).toBe(200);
		expect(res.body['size']).toBe(1);
		expect(res.body['results'][0]).toStrictEqual(projectDoc);
	});

	test('search by category', async () => {

		let projectDoc = {
			_id: 123,
			title: 'pad gamer',
			description: 'teclado gamer rgb con muchas luces',
			category: 'gamer',
			mediaUrls: ['foto/fachera'],
			targetAmount: 123.22,
			fundedAmount: 0.0,
			location: {
				coordinates: [
					-34.610955,
					-58.436967
				],
				type: 'Point'
			},
			hashtags: ['gamer', 'rgb', 'mecanico']
		};

		projectMockRepository.searchProjects.mockReturnValueOnce([projectDoc]);

		const res = await request.get('/api/project/search').set('X-Override-Token','true').query({
			category: 'gamer'
		});

		expect(projectMockRepository.searchProjects.mock.calls.length).toBe(1);
		expect(projectMockRepository.searchProjects.mock.calls[0][0]).toMatchObject({
			category: ['gamer']
		});

		expect(res.status).toBe(200);
		expect(res.body['size']).toBe(1);
		expect(res.body['results'][0]).toStrictEqual(projectDoc);
	});

	test('search by status', async () => {
		let tomorrow = new Date()
		tomorrow.setDate(tomorrow.getDate() + 1)

		let projectDoc = {
			_id: 123,
			title: 'pad gamer',
			description: 'teclado gamer rgb con muchas luces',
			category: 'gamer',
			mediaUrls: ['foto/fachera'],
			fundedAmount: 0.0,
			status: 'in-progress',
			stages: [
				{
					track: "armado",
					targetAmount: 12.22
				},
				{
					track: "distribucion",
					targetAmount: 125.22
				}
			],
			finishDate: tomorrow.toISOString(),
			ownerId: 234,
			reviewerId: 567,
			location: {
				coordinates: [
					-34.610955,
					-58.436967
				],
				type: 'Point'
			},
			hashtags: ['gamer', 'rgb', 'mecanico']
		};

		projectMockRepository.searchProjects.mockReturnValueOnce([projectDoc]);

		const res = await request.get('/api/project/search').set('X-Override-Token','true').query({
			status: 'pending'
		});

		expect(projectMockRepository.searchProjects.mock.calls.length).toBe(1);
		expect(projectMockRepository.searchProjects.mock.calls[0][0]).toMatchObject({
			status: 'pending'
		});

		expect(res.status).toBe(200);
		expect(res.body['size']).toBe(1);
		expect(res.body['results'][0]).toStrictEqual(projectDoc);
	});

	test('search by multiple criteria', async () => {

		let projectDoc = {
			_id: 123,
			title: 'pad gamer',
			description: 'teclado gamer rgb con muchas luces',
			category: 'gamer',
			mediaUrls: ['foto/fachera'],
			targetAmount: 123.22,
			fundedAmount: 0.0,
			status: 'pending',
			location: {
				coordinates: [
					-34.610955,
					-58.436967
				],
				type: 'Point'
			},
			hashtags: ['gamer', 'rgb', 'mecanico']
		};

		var projectDoc2 = JSON.parse(JSON.stringify(projectDoc));
		projectDoc2._id = 345;
		projectDoc2.title = 'boquita';

		projectMockRepository.searchProjects.mockReturnValueOnce([projectDoc, projectDoc2]);

		const res = await request.get('/api/project/search').set('X-Override-Token','true').query({
			status: 'pending',
			hashtags: 'gamer,rgb'
		});

		expect(projectMockRepository.searchProjects.mock.calls.length).toBe(1);
		expect(projectMockRepository.searchProjects.mock.calls[0][0]).toMatchObject({
			status: 'pending',
			hashtags: ['gamer', 'rgb']
		});

		expect(res.status).toBe(200);
		expect(res.body['size']).toBe(2);
		expect(res.body['results']).toStrictEqual([projectDoc, projectDoc2]);
	});

	test('search by category not found', async () => {
		projectMockRepository.searchProjects.mockReturnValueOnce([]);

		const res = await request.get('/api/project/search').set('X-Override-Token','true').query({
			category: 'gamer'
		});

		expect(projectMockRepository.searchProjects.mock.calls.length).toBe(1);
		expect(projectMockRepository.searchProjects.mock.calls[0][0]).toMatchObject({
			category: ['gamer']
		});

		expect(res.status).toBe(200);
		expect(res.body).toStrictEqual({size: 0, results: []});
	});

	test('search by location missing locationY field', async () => {
		const res = await request.get('/api/project/search').set('X-Override-Token','true').query({
			locationX: 234
		});

		expect(projectMockRepository.searchProjects.mock.calls.length).toBe(0);

		expect(res.status).toBe(400);
		expect(res.body.message).toBe('locationX and locationY are needed for location search');
	});

	test('search with no queryParam', async () => {
		const res = await request.get('/api/project/search').set('X-Override-Token','true');

		expect(projectMockRepository.searchProjects.mock.calls.length).toBe(0);

		expect(res.status).toBe(400);
		expect(res.body.message).toBe('A search criteria is required');
	});

	test('search with location as string', async () => {
		const res = await request.get('/api/project/search').set('X-Override-Token','true').query({
			locationX: 'asdf',
		});

		expect(projectMockRepository.searchProjects.mock.calls.length).toBe(0);

		expect(res.status).toBe(400);
		expect(res.body.message).toBe('"locationX" must be a number');
	});
});