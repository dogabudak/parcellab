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
    setupFiles: ['<rootDir>/env.ts'],
    coverageReporters: ['text', 'text-summary'],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)x?$',
    testPathIgnorePatterns: [
        '/node_modules/',
        '/build/',
        '/coverage/',
        '/dist/',
    ],
}
