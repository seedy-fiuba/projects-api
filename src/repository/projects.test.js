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
		let tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		let projectDoc = {
			title: 'pad gamer',
			description: 'teclado gamer rgb con muchas luces',
			category: 'gamer',
			mediaUrls: ['foto/fachera'],
			fundedAmount: 0.0,
			status: 'in-progress',
			stages: [
				{
					track: 'armado',
					targetAmount: 12.22
				},
				{
					track: 'distribucion',
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

		mockingoose(projectModel).toReturn(projectDoc, 'findOne');

		const doc = await projectRepository.getProjectByid('123');

		expect(JSON.parse(JSON.stringify(doc))).toMatchObject(projectDoc);
	});

	test('should return project for id 456 with query spy', async () => {
		let tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		let projectDoc = {
			title: 'pad gamer',
			description: 'teclado gamer rgb con muchas luces',
			category: 'gamer',
			mediaUrls: ['foto/fachera'],
			fundedAmount: 0.0,
			status: 'in-progress',
			stages: [
				{
					track: 'armado',
					targetAmount: 12.22
				},
				{
					track: 'distribucion',
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
		let tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		let projectDoc = {
			title: 'pad gamer',
			description: 'teclado gamer rgb con muchas luces',
			category: 'gamer',
			mediaUrls: ['foto/fachera'],
			fundedAmount: 0.0,
			status: 'in-progress',
			stages: [
				{
					track: 'armado',
					targetAmount: 12.22
				},
				{
					track: 'distribucion',
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

		let body = {
			title: 'pad gamer',
			description: 'teclado gamer rgb con muchas luces',
			category: 'gamer',
			mediaUrls: ['foto/fachera'],
			status: 'created',
			stages: [
				{
					track: 'armado',
					targetAmount: 12.22
				},
				{
					track: 'distribucion',
					targetAmount: 125.22
				}
			],
			finishDate: tomorrow.toISOString(),
			ownerId: 234,
			reviewerId: 3423,
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

describe('search projects', () => {
	mockingoose(projectModel);

	beforeEach(() => {
		mockingoose(projectModel).reset(); // will reset all operations;
	});

	afterEach(() => {
		jest.clearAllMocks();

	});

	test('search by location', async () => {
		let tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		let projectDoc = {
			title: 'pad gamer',
			description: 'teclado gamer rgb con muchas luces',
			category: 'gamer',
			mediaUrls: ['foto/fachera'],
			stages: [
				{
					track: 'armado',
					targetAmount: 12.22
				},
				{
					track: 'distribucion',
					targetAmount: 125.22
				}
			],
			finishDate: tomorrow.toISOString(),
			ownerId: 234,
			reviewerId: 456,
			status: 'in-progress',
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

		let queryValues = {
			locationX: -34.610955,
			locationY: -58.436967,
		};

		const finderMock = param => {
			const query = param.getQuery();

			if (!query['location']) {
				fail('missing location in query');
			}

			if(!query['location']['$near']) {
				fail('missing operator "$near" in query');
			}

			if(!query['location']['$near']['$maxDistance']) {
				fail('missing operator "$maxDistance" in "$near" query');
			}

			if(!query['location']['$near']['$geometry']) {
				fail('missing operator "$maxDistance" in "$near" query');
			}

			if(!query['location']['$near']['$geometry']['type']) {
				fail('missing field type in "$geometry" query');
			}

			if(query['location']['$near']['$geometry']['type'] !== 'Point') {
				fail('Invalid value in field "type" in $geometry query');
			}

			if(!query['location']['$near']['$geometry']['coordinates']) {
				fail('missing field coordinates in "$geometry" query');
			}

			if(query['location']['$near']['$geometry']['coordinates'].length !== 2) {
				fail('Invalid length of coordinates');
			}

			if(query['location']['$near']['$geometry']['coordinates'][0] !== -34.610955) {
				fail('Invalid x coordinate');
			}

			if(query['location']['$near']['$geometry']['coordinates'][1] !== -58.436967) {
				fail('Invalid y coordinate');
			}

			return projectDoc;
		};

		mockingoose(projectModel).toReturn(finderMock, 'find');

		const projectResult = await projectRepository.searchProjects(queryValues);

		expect(JSON.parse(JSON.stringify(projectResult))).toStrictEqual(projectDoc);
	});

	test('search by category', async () => {
		let tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		let projectDoc = {
			title: 'pad gamer',
			description: 'teclado gamer rgb con muchas luces',
			category: 'gamer',
			mediaUrls: ['foto/fachera'],
			stages: [
				{
					track: 'armado',
					targetAmount: 12.22
				},
				{
					track: 'distribucion',
					targetAmount: 125.22
				}
			],
			finishDate: tomorrow.toISOString(),
			ownerId: 234,
			reviewerId: 456,
			status: 'in-progress',
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

		let queryValues = {
			category: 'boquita',
		};

		const finderMock = param => {
			const query = param.getQuery();

			if (!query['category']) {
				fail('missing category in query');
			}

			if (!query['category']['$in']) {
				fail('missing "$in" in operator in query');
			}

			if (query['category']['$in'] !== 'boquita') {
				fail('unexpected value in category query ' + query['category']['$in']);
			}

			return projectDoc;
		};

		mockingoose(projectModel).toReturn(finderMock, 'find');

		const projectResult = await projectRepository.searchProjects(queryValues);

		expect(JSON.parse(JSON.stringify(projectResult))).toStrictEqual(projectDoc);
	});

	test('search by hashtags', async () => {
		let tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		let projectDoc = {
			title: 'pad gamer',
			description: 'teclado gamer rgb con muchas luces',
			category: 'gamer',
			mediaUrls: ['foto/fachera'],
			stages: [
				{
					track: 'armado',
					targetAmount: 12.22
				},
				{
					track: 'distribucion',
					targetAmount: 125.22
				}
			],
			finishDate: tomorrow.toISOString(),
			ownerId: 234,
			reviewerId: 456,
			status: 'in-progress',
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

		let hashtags = ['boquita', 'el', 'mas', 'grande'];
		let queryValues = {
			hashtags: hashtags,
		};

		const finderMock = param => {
			const query = param.getQuery();

			if (!query['hashtags']) {
				fail('missing category in query');
			}

			if (!query['hashtags']['$in']) {
				fail('missing "$in" in operator in query');
			}

			if (query['hashtags']['$in'].length !== hashtags.length) {
				fail('unexpected length of hashtags ' + query['hashtags']['$in']);
			}

			query['hashtags']['$in'].forEach(e => {
				if(!hashtags.includes(e)) {
					fail('unexpected element in hashtag list ' + e);
				}
			});

			return projectDoc;
		};

		mockingoose(projectModel).toReturn(finderMock, 'find');

		const projectResult = await projectRepository.searchProjects(queryValues);

		expect(JSON.parse(JSON.stringify(projectResult))).toStrictEqual(projectDoc);
	});

	test('search by status', async () => {
		let tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		let projectDoc = {
			title: 'pad gamer',
			description: 'teclado gamer rgb con muchas luces',
			category: 'gamer',
			mediaUrls: ['foto/fachera'],
			stages: [
				{
					track: 'armado',
					targetAmount: 12.22
				},
				{
					track: 'distribucion',
					targetAmount: 125.22
				}
			],
			finishDate: tomorrow.toISOString(),
			ownerId: 234,
			reviewerId: 456,
			status: 'in-progress',
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

		let queryValues = {
			status: 'pending',
		};

		const finderMock = param => {
			const query = param.getQuery();

			if (!query['status']) {
				fail('missing status in query');
			}

			if (!query['status']['$in']) {
				fail('missing "$in" in operator in query');
			}

			if (query['status']['$in'] !== 'pending') {
				fail('unexpected value in status query ' + query['status']['$in']);
			}

			return projectDoc;
		};

		mockingoose(projectModel).toReturn(finderMock, 'find');

		const projectResult = await projectRepository.searchProjects(queryValues);

		expect(JSON.parse(JSON.stringify(projectResult))).toStrictEqual(projectDoc);
	});
});