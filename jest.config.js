/* eslint-disable no-undef */
const { resolve } = require('path');
const root = resolve(__dirname);

module.exports = {
    rootDir: root,
    displayName: 'root-tests',
    testPathIgnorePatterns: ['/node_modules/'],
    testMatch: ['<rootDir>/src/**/*.test.js'],
    testEnvironment: 'node',
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/index.js',
        '!src/utils/**/*.js',
        '!src/config/**/*.js',
    ],
};
