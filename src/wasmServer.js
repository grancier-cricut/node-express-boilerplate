const express = require('express');
const { status: httpStatus } = require('http-status');
const { createWasmStaticMiddleware, wasmDirectory } = require('./wasmStatic');

const app = express();

app.use('/wasm', createWasmStaticMiddleware());

app.use((req, res) => {
  res.status(httpStatus.NOT_FOUND).send({ code: httpStatus.NOT_FOUND, message: 'Not found' });
});

let server;

const startServer = () => {
  const port = process.env.PORT || 3000;
  server = app.listen(port, () => {
    process.stdout.write(`Serving WASM files from ${wasmDirectory} at http://localhost:${port}/wasm\n`);
  });
  return server;
};

const shutdown = () => {
  if (server) {
    server.close(() => process.exit(0));
    return;
  }
  process.exit(0);
};

if (require.main === module) {
  startServer();
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

module.exports = app;
