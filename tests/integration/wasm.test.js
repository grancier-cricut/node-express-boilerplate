const fs = require('fs');
const path = require('path');
const request = require('supertest');
const { status: httpStatus } = require('http-status');
const app = require('../../src/app');
const wasmApp = require('../../src/wasmServer');
const { wasmDirectory } = require('../../src/wasmStatic');

const wasmFileName = 'test-module.wasm';
const wasmFilePath = path.join(wasmDirectory, wasmFileName);
const wasmBytes = Buffer.from([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]);

const parseBinary = (res, callback) => {
  const chunks = [];
  res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
  res.on('end', () => callback(null, Buffer.concat(chunks)));
};

describe('WASM static route', () => {
  beforeAll(() => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.mkdirSync(wasmDirectory, { recursive: true });
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.writeFileSync(wasmFilePath, wasmBytes);
  });

  afterAll(() => {
    fs.rmSync(wasmFilePath, { force: true });
  });

  test('should serve wasm files from the main app route', async () => {
    const res = await request(app).get(`/wasm/${wasmFileName}`).buffer(true).parse(parseBinary).expect(httpStatus.OK);

    expect(res.headers['content-type']).toContain('application/wasm');
    expect(Buffer.compare(res.body, wasmBytes)).toBe(0);
  });

  test('should serve wasm files from the wasm-only app route', async () => {
    const res = await request(wasmApp).get(`/wasm/${wasmFileName}`).buffer(true).parse(parseBinary).expect(httpStatus.OK);

    expect(res.headers['content-type']).toContain('application/wasm');
    expect(Buffer.compare(res.body, wasmBytes)).toBe(0);
  });

  test('should not expose other app routes from the wasm-only app', async () => {
    await request(wasmApp).get('/v1/auth/login').expect(httpStatus.NOT_FOUND);
  });
});
