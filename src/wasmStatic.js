const express = require('express');
const path = require('path');

const wasmDirectory = path.join(__dirname, '../wasm');

const setStaticHeaders = (res, filePath) => {
  if (path.extname(filePath) === '.wasm') {
    res.type('application/wasm');
  }
};

const createWasmStaticMiddleware = () =>
  express.static(wasmDirectory, {
    index: false,
    setHeaders: setStaticHeaders
  });

module.exports = {
  createWasmStaticMiddleware,
  wasmDirectory
};
