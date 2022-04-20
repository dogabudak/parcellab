module.exports = {
    preset: 'ts-jest',
    coverageThreshold: {
        global: {
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    collectCoverage: true,
    collectCoverageFrom: [
        '**/**/*.ts',
        '!**/node_modules/**',
        '!**/tests/**',
        '!**/coverage/**',
        '!**/cron/**',
        '!**/utils/**',
        '!dist/**',
        '!jest.config.js',
        '!server.ts',
        '!test/**',
        '!**/db/**',
    ],
    testMatch: ['<rootDir>/tests/integration/**/**.spec.ts'],
    setupFiles: ['<rootDir>/tests/env.ts'],
    coverageReporters: ['text', 'text-summary'],
}
