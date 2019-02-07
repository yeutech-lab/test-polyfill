/* eslint-disable global-require */
const defaultOptions = {
  isomorphicFetch: false,
  fetch: true,
  localStorage: true,
  media: true,
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
 * @param {object} [options={ isomorphicFetch: true, localStorage: true }] - An options object
 * @param {boolean} [options.isomorphicFetch=false] - Replace fetch-mock with fetch-isomorphic + tough-cookie to trigger real fetch requests
 * @paran {boolean} [options.fetch=true] - Use fetch-mock
 * @param {boolean} [options.localStorage=true] - Enable localStorage
 * @param {boolean} [options.media=true] - Enable matchMedia and requestAnimationFrame
 * @example
 * // Use this in your setupFilesAfterEnv test entrypoint
 * require('@yeutech-lab/test-polyfill').polyfill()
 * @example
 * // if you need fetch for node within test, just activate it
 * require('@yeutech-lab/test-polyfill').polyfill({ isomorphicFetch: true })
 */
export function polyfill(options) {
  const opts = { ...defaultOptions, ...options };
  let root = null;
  try {
    root = window || global;
  } catch (e) {
    root = global;
  }
  if (opts.isomorphicFetch) {
    const Tough = require('tough-cookie');
    const Store = new Tough.MemoryCookieStore();

    const rejectPublicSuffixes = false; // See https://github.com/salesforce/tough-cookie#cookiejarstoreoptions
    const cookieJar = new Tough.CookieJar(Store, rejectPublicSuffixes);
    const fetch = require('fetch-cookie')(require('isomorphic-fetch'), cookieJar);
    root.fetch = fetch;
    root.cookieJar = cookieJar;
    require('whatwg-fetch');
  }

  if (opts.fetch && !opts.isomorphicFetch) {
    require('whatwg-fetch');
    root.fetchMock = require('fetch-mock');
  }

  if (opts.localStorage && !root.localStorage) {
    root.localStorage = require('localStorage');
  }

  if (opts.media) {
    root.matchMedia = root.matchMedia
    || function () {
      return {
        matches: false,
        addListener() {},
        removeListener() {},
      };
    };

    root.requestAnimationFrame = root.requestAnimationFrame
    || function (callback) {
      setTimeout(callback, 0);
    };
  }
}
