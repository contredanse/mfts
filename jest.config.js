module.exports = {
    verbose: false,
    testURL: 'http://localhost/',
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/(?!(lodash-es))'],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    //stringifyContentPathRegex: '/(lodash-es|lodash)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'mjs', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '^.+\\.scss$': 'identity-obj-proxy',
        '@src/(.*)$': '<rootDir>/src/js/$1',
        '@config/(.*)$': '<rootDir>/src/config/$1',
        '@assets/(.*)$': '<rootDir>/src/assets/$1',
        '@thirdparty/(.*)$': '<rootDir>/src/thirdparty/$1',
        '@data/(.*)$': '<rootDir>/src/data/$1',
    },
    globals: {
        window: {},
        'ts-jest': {
            tsConfig: './tsconfig.jest.json',
            compiler: 'typescript',
            babelConfig: '.babelrc',
        },
    },
    setupFiles: ['./jest.stubs.ts'],
    setupTestFrameworkScriptFile: './jest.tests.ts',
    collectCoverageFrom: ['src/**/*.+(ts|tsx|js|jsx)', '!src/__tests__/*'],
};
