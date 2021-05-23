const { Pool } = require('pg')
const projectRepository = require('./contracts')

jest.mock('pg', () => {
    const mockPool = {
        query: jest.fn(),
    }

    return { Pool: jest.fn(() => mockPool) };
})

describe("get project by id", () => {
    let pool;
    beforeEach(() => {
        pool = new Pool();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return project for id 123', async () => {
        let projectMock = {
            name: "boquita",
            description: 'dale bokeee'
        }

        pool.query.mockResolvedValueOnce({ rows: [projectMock], rowCount: 1 });

        const project = await projectRepository.getProjectByid("123");
        expect(pool.query).toBeCalledTimes(1);
        expect(pool.query).toBeCalledWith('SELECT * FROM projects WHERE id = $1', ["123"]);

        expect(project).toStrictEqual(projectMock)
    });
})