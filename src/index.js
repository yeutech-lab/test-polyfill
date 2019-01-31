/* eslint-disable global-require */
const defaultOptions = {
  isomorphicFetch: false,
  localStorage: true,
};

/**
 * @public
 * @name polyfill
 * @description Use this polyfill to initialize your test configuration
 *
 * You must use jest configuration options [`setupFilesAfterEnv`](https://jestjs.io/docs/en/configuration#setupfilesafterenv-array).
 *
 * Fore more information, read :
 * - http://www.wheresrhys.co.uk/fetch-mock/
 * - https://github.com/matthew-andrews/isomorphic-fetch
 *
 * @param {object} [default={ isomorphicFetch: true, localStorage: true }] options - An options object
 * @param {boolean} [default=false] options.isomorphicFetch - Replace fetch-mock with fetch-isomorphic + tough-cookie to trigger real fetch requests
 * @param {boolean} [default=true] options.localStorage - Enable localStorage
 * @example
 * // Use this in your setupFilesAfterEnv test entrypoint
 * require('@yeutech-lab/test-polyfill').polyfill()
 * @example
 * // if you need fetch for node within test, just activate it
 * require('@yeutech-lab/test-polyfill').polyfill({ isomorphicFetch: true })
 */
export function polyfill(options) {
  const opts = { ...defaultOptions, ...options };
  if (opts.isomorphicFetch) {
    const Tough = require('tough-cookie');
    const Store = new Tough.MemoryCookieStore();
    const cookieJar = new Tough.CookieJar(Store);
    const fetch = require('fetch-cookie')(require('isomorphic-fetch'), cookieJar);
    global.fetch = fetch;
    global.cookieJar = cookieJar;
    global.fetchMock = undefined;
  } else {
    const { Response, Headers, Request } = require('whatwg-fetch');
    global.fetchMock = require('fetch-mock');
    global.Response = Response;
    global.Headers = Headers;
    global.Request = Request;
  }
  if (opts.localStorage && !global.localStorage) {
    global.localStorage = require('localStorage');
  }
}
