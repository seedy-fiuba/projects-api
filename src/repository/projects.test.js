const projectRepository = require('./projects');
let projectModel = require('../model/projects');
let mockingoose = require('mockingoose');

describe('get project by id', () => {
	mockingoose(projectModel);

	beforeEach(() => {

	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should return project for id 123', async () => {
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

		mockingoose(projectModel).toReturn(projectDoc, 'findOne');

		const doc = await projectRepository.getProjectByid('123');

		expect(JSON.parse(JSON.stringify(doc))).toMatchObject(projectDoc);
	});

	test('should return project for id 456 with query spy', async () => {
		let projectDoc = {
			_id: 456,
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

		const finderMock = query => {
			if (query.getQuery()._id === '456') {
				return projectDoc;
			}
		};

		mockingoose(projectModel).toReturn(finderMock, 'findOne'); // findById is findOne

		const projectResult = await projectRepository.getProjectByid('456');

		expect(JSON.parse(JSON.stringify(projectResult))).toMatchObject(projectDoc);
	});
});

describe('POST project', () => {
	mockingoose(projectModel);

	beforeEach(() => {
		mockingoose(projectModel).reset(); // will reset all operations;
	});

	afterEach(() => {
		jest.clearAllMocks();

	});

	test('should create project id 123', async () => {
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

		let body = {
			title: 'pad gamer',
			description: 'teclado gamer rgb con muchas luces',
			category: 'gamer',
			mediaUrls: ['foto/fachera'],
			targetAmount: 123.22,
			location: {
				x: -34.610955,
				y: -58.436967
			},
			hashtags: ['gamer', 'rgb', 'mecanico']
		};

		mockingoose(projectModel).toReturn(projectDoc, 'save');

		const projectResult = await projectRepository.createProject(body);

		expect(JSON.parse(JSON.stringify(projectResult))).toMatchObject(projectDoc);
	});
});

