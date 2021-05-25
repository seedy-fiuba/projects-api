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
			name: 'boquita',
			description: 'dale bokeee'
		};

		mockingoose(projectModel).toReturn(projectDoc, 'findOne');

		const projectResult = await projectRepository.getProjectByid('123');

		expect(projectResult).toMatchObject(projectDoc);
	});

	test('should return project for id 456 with query spy', async () => {
		let projectDoc = {
			_id: 456,
			name: 'boquita',
			description: 'dale bokeee'
		};

		const finderMock = query => {
			expect(query.getQuery()).toMatchSnapshot('findById query');

			if (query.getQuery()._id === '456') {
				return projectDoc;
			}
		};

		mockingoose(projectModel).toReturn(finderMock, 'findOne'); // findById is findOne

		const projectResult = await projectRepository.getProjectByid('456');

		expect(projectResult).toMatchObject(projectDoc);
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
			name: 'boquita',
			description: 'dale bokeee'
		};

		mockingoose(projectModel).toReturn(projectDoc, 'save');

		const projectResult = await projectRepository.createProject('boquita', 'dale bokeee');

		expect(projectResult).toMatchObject(projectDoc);
	});
});