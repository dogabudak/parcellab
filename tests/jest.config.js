module.exports = {
    preset: 'ts-jest',
    coverageThreshold: {
        global: {
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    // these are the extensions Jest will look for, in left-to-right order
    moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    setupFiles: ['<rootDir>/test/env.ts'],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)x?$',
    testPathIgnorePatterns: [
        '/node_modules/',
        '/build/',
        '/coverage/',
        '/dist/',
    ],
}
