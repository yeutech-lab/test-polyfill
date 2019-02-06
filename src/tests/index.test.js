import { polyfill } from '../index';

describe('polyfill', () => {
  it('should polyfill media', () => {
    expect(typeof window.matchMedia).not.toBe('function');
    polyfill({
      media: false,
      fetch: false,
      localStorage: false,
    });
    expect(typeof window.matchMedia).not.toBe('function');
    polyfill({
      media: true,
      fetch: false,
      localStorage: false,
    });
    expect(typeof window.matchMedia).toBe('function');
  });
  it('should polyfill fetch-mock', (done) => {
    expect(global.fetch).not.toBeDefined();
    expect(global.fetchMock).not.toBeDefined();
    expect(global.Headers).not.toBeDefined();
    expect(global.Request).not.toBeDefined();
    expect(global.Response).not.toBeDefined();
    polyfill({
      media: false,
      fetch: true,
      localStorage: false,
    });
    fetchMock.mock('http://localhost', 200); // eslint-disable-line no-undef
    expect(global.fetch).toBeDefined();
    expect(global.fetchMock).toBeDefined();
    expect(global.Headers).toBeDefined();
    expect(global.Request).toBeDefined();
    expect(global.Response).toBeDefined();
    done();
  });

  it('should polyfill fetch', (done) => {
    polyfill({
      isomorphicFetch: true,
    });
    expect(global.Headers).toBeDefined();
    expect(global.Request).toBeDefined();
    expect(global.Response).toBeDefined();
    fetch('http://test').catch((err) => {
      expect(err).toBeDefined();
      done();
    });
  });

  it('should not polyfill localStorage', () => {
    polyfill({
      localStorage: false,
    });
    expect(global.localStorage).toBeDefined();
  });
});
