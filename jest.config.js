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
        '!**/coverage/**',
        '!dist/**',
        '!jest.config.js',
        '!**/tests/**',
        '!**/cron/**',
        '!server.ts',
        '!**/initialize.ts',
        '!app.ts',
        '!test/**',
        '!**/db/**',
    ],
    setupFiles: ['<rootDir>/tests/env.ts'],
    testMatch: ['<rootDir>/tests/unit/**/*.spec.ts'],
    coverageReporters: ['text', 'text-summary'],
}
