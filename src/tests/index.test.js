import { polyfill } from '../index';

describe('polyfill', () => {
  it('should polyfill fetch-mock', (done) => {
    expect(global.fetch).not.toBeDefined();
    expect(global.fetchMock).not.toBeDefined();
    expect(global.Headers).not.toBeDefined();
    expect(global.Request).not.toBeDefined();
    expect(global.Response).not.toBeDefined();
    polyfill();
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
    expect(global.fetchMock).not.toBeDefined();
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
