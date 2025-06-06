/* eslint-disable @typescript-eslint/no-explicit-any */
import * as dbModule from '../../../../../database/drizzle';
import { GET, PATCH, DELETE } from './route';

global.Response = class {
  constructor(body: any, init: any) {
    this.status = init?.status ?? 200;
    this._body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  status: number;

  _body: string;

  async json() {
    return JSON.parse(this._body);
  }

  async text() {
    return this._body;
  }
} as any;

jest.mock('../../../../../database/drizzle', () => ({
  db: {
    select: jest.fn(),
    from: jest.fn(),
    where: jest.fn(),
    update: jest.fn(),
    set: jest.fn(),
    returning: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('/api/addresses/[id] API handlers', () => {
  beforeEach(() => jest.clearAllMocks());

  const createRequest = (body: any) => ({
    json: async () => body,
  });

  describe('GET', () => {
    it('returns 404 if address not found', async () => {
      (dbModule.db.select as jest.Mock).mockReturnValue({
        from: () => ({ where: () => Promise.resolve([]) }),
      });

      const params = Promise.resolve({ id: '999' });
      const res = await GET({} as any, { params });
      expect(res.status).toBe(404);
      expect(await res.text()).toBe('Not found');
    });
  });

  describe('PATCH', () => {
    it('returns 404 if address not found', async () => {
      (dbModule.db.update as jest.Mock).mockReturnValue({
        set: () => ({ where: () => ({ returning: () => Promise.resolve([]) }) }),
      });

      const req = createRequest({ city: 'Kyiv' });
      const params = Promise.resolve({ id: '1' });
      const res = await PATCH(req as any, { params });
      expect(res.status).toBe(404);
      expect(await res.text()).toBe('Not found');
    });
  });

  describe('DELETE', () => {
    it('returns 404 if address not found', async () => {
      (dbModule.db.delete as jest.Mock).mockReturnValue({
        where: () => ({ returning: () => Promise.resolve([]) }),
      });

      const params = Promise.resolve({ id: '1' });
      const res = await DELETE({} as any, { params });
      expect(res.status).toBe(404);
      expect(await res.text()).toBe('Not found');
    });
  });
});
