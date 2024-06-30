module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.css$': '<rootDir>/client/__mocks__/empty-module.js',
    '\\.less$': '<rootDir>/client/__mocks__/empty-module.js' 
  },
};
