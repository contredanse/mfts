module.exports = {
    verbose: true,
    testURL: 'http://localhost/',
    transform: {
        '^.+\\.(ts|tsx|jsx)$': 'ts-jest',
        '^.+\\.(js)?$': 'ts-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/(?!(lodash-es|lodash)/)'],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    //    stringifyContentPathRegex: '/(lodash-s|ldash)/*\\.js$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
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
