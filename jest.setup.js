// Extend Jest with custom matchers from Testing Library
import '@testing-library/jest-dom';


// Mock next/router to prevent unwanted errors in component tests
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// Silence console errors during tests
const originalError = console.error;
console.error = (...args) => {
  if (args[0]?.includes('ReactDOM.render is no longer supported')) return;
  originalError(...args);
};
