const request = require('supertest');

// Mock the pg Pool so tests never need a real database
jest.mock('pg', () => {
    const mClient = {
        query: jest.fn(),
        release: jest.fn(),
    };
    const mPool = {
        connect: jest.fn(() => Promise.resolve(mClient)),
    };
    return { Pool: jest.fn(() => mPool) };
});

const { app, pool } = require('./index');

describe('GET /', () => {
    let client;

    beforeEach(() => {
        // Grab the mock client that pool.connect() will return
        client = pool.connect();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returns 200 with rows from the database', async () => {
        // Arrange: pool.connect() resolves to a client whose query returns rows
        const mockRows = [{ id: 1, name: 'thing one' }, { id: 2, name: 'thing two' }];
        pool.connect.mockResolvedValue({
            query: jest.fn().mockResolvedValue({ rows: mockRows }),
            release: jest.fn(),
        });

        const res = await request(app).get('/');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockRows);
    });

    it('returns an empty array when the table has no rows', async () => {
        pool.connect.mockResolvedValue({
            query: jest.fn().mockResolvedValue({ rows: [] }),
            release: jest.fn(),
        });

        const res = await request(app).get('/');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('returns 500 when the database throws an error', async () => {
        pool.connect.mockResolvedValue({
            query: jest.fn().mockRejectedValue(new Error('DB connection failed')),
            release: jest.fn(),
        });

        const res = await request(app).get('/');

        expect(res.statusCode).toBe(500);
    });
});
