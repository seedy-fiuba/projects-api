const supertest = require('supertest')
const server = require('../src/server')
let request = supertest(server.app)
let projectController = require('../src/controllers/projects.controller')

let projectMockRepository = {
    getProject: jest.fn(),
    getProjectByid: jest.fn(),
    createProject: jest.fn(),
    updateProject: jest.fn()
}
projectController.setProjectDB(projectMockRepository) // Mock repository interaction

describe('POST /api/project', () => {
    beforeEach(() => {
        projectMockRepository.createProject.mockReset()
        // projectMockRepository.mockResolvedValue(0)
    })

    afterAll(() => {

    })

    test("should create a new project", async () => {
        let body = {name: "proyecto1", description: "proyecto  re copado"}

        const res = await request.post("/api/project").send(body)


        expect(projectMockRepository.createProject.mock.calls.length).toBe(1)
        expect(projectMockRepository.createProject.mock.calls[0][0]).toBe(body.name)
        expect(projectMockRepository.createProject.mock.calls[0][1]).toBe(body.description)
        expect(res.status).toBe(200)
    })
})