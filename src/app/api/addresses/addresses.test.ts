/* eslint-disable @typescript-eslint/no-explicit-any */
import * as dbModule from '../../../../database/drizzle';
import { GET, POST } from './route';

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

  static json(data: any, init?: ResponseInit) {
    return new Response(data, init);
  }
} as any;

jest.mock('../../../../database/drizzle', () => ({
  db: {
    select: jest.fn(),
    from: jest.fn(),
    insert: jest.fn(),
    values: jest.fn(),
    returning: jest.fn(),
  },
}));

describe('/api/addresses (root) GET & POST handlers', () => {
  beforeEach(() => jest.clearAllMocks());

  const createRequest = (body: any) => ({
    json: async () => body,
  });

  describe('GET', () => {
    it('returns all addresses', async () => {
      const mockAddresses = [{ id: 1, city: 'Kyiv' }, { id: 2, city: 'Lviv' }];
      (dbModule.db.select as jest.Mock).mockReturnValue({
        from: () => mockAddresses,
      });

      const res = await GET();
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(mockAddresses);
    });
  });

  describe('POST', () => {
    it('returns 400 if required fields are missing', async () => {
      const req = createRequest({ city: 'Kyiv' });
      const res = await POST(req as any);
      expect(res.status).toBe(400);
      expect(await res.text()).toMatch(/Missing/);
    });

    it('creates address if all fields are present', async () => {
      const body = {
        userId: 1,
        city: 'Kyiv',
        street: 'Shevchenka',
        country: 'Ukraine',
        postalCode: '01001',
      };
      const mockResult = [{ ...body, id: 123 }];
      (dbModule.db.insert as jest.Mock).mockReturnValue({
        values: () => ({ returning: () => mockResult }),
      });

      const req = createRequest(body);
      const res = await POST(req as any);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(mockResult[0]);
    });
  });
});
