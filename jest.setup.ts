/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';

global.Response = class {
  constructor(body: any, init: any) {
    this.status = init.status;
    this._body = body;
  }

  status: number;

  _body: any;

  async json() {
    return JSON.parse(this._body);
  }
} as any;
