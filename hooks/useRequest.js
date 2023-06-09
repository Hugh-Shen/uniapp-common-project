import { defineComponent, provide, unref, ref, computed, inject, reactive, watch, onUnmounted, watchEffect } from 'vue'

const GLOBAL_OPTIONS = {};
const GLOBAL_OPTIONS_PROVIDE_KEY = Symbol('GLOBAL_OPTIONS_PROVIDE_KEY');
const setGlobalOptions = config => {
  Object.keys(config).forEach(key => {
    GLOBAL_OPTIONS[key] = config[key];
  });
};
const getGlobalOptions = () => {
  return GLOBAL_OPTIONS;
};

const RequestConfig = defineComponent({
  name: 'RequestConfig',
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      config
    } = props;
    provide(GLOBAL_OPTIONS_PROVIDE_KEY, config);
    return () => {
      var _slots$default;
      return (_slots$default = slots.default) === null || _slots$default === void 0 ? void 0 : _slots$default.call(slots);
    };
  }
});

const objectToString = Object.prototype.toString;
const toTypeString = val => objectToString.call(val);
const isString = val => toTypeString(val) === '[object String]';
const isPlainObject = val => toTypeString(val) === '[object Object]';
const isArray = val => Array.isArray(val);
const isObject = val => val !== null && typeof val === 'object';
const isPromise = fn => isObject(fn) && isFunction(fn.then) && isFunction(fn.catch);
const isFunction = fn => fn instanceof Function;
const isNil = val => val === null || val === undefined;
const isServer = typeof window === 'undefined';
const isDocumentVisibility = () => {
  var _window, _window$document;
  return !isServer && ((_window = window) === null || _window === void 0 ? void 0 : (_window$document = _window.document) === null || _window$document === void 0 ? void 0 : _window$document.visibilityState) === 'visible';
};
const isOnline = () => {
  var _ref, _window2, _window2$navigator;
  return (_ref = !isServer && ((_window2 = window) === null || _window2 === void 0 ? void 0 : (_window2$navigator = _window2.navigator) === null || _window2$navigator === void 0 ? void 0 : _window2$navigator.onLine)) !== null && _ref !== void 0 ? _ref : true;
};
const unRefObject = val => {
  const obj = {};
  Object.keys(val).forEach(key => {
    obj[key] = unref(val[key]);
  });
  return obj;
};
const resolvedPromise = Promise.resolve(null);
const requestProxy = async function () {
  const res = await fetch(...arguments);
  if (res.ok) {
    return res.json();
  }
  throw new Error(res.statusText);
};
const get = function (source, path) {
  let defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  // a[3].b -> a.3.b
  const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let result = source;
  for (const p of paths) {
    result = Object(result)[p];
    if (result === undefined) {
      return defaultValue;
    }
  }
  return result;
};
function omit(object, keys) {
  const result = Object.assign({}, object);
  for (const key of keys) {
    delete result[key];
  }
  return result;
}
const warning = function (message) {
  let throwError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  const msg = `Warning: [vue-request] ${message}`;
  if (throwError) {
    return new Error(msg);
  } else {
    console.error(msg);
  }
};

const limitTrigger = (fn, timeInterval) => {
  let running = false;
  return function () {
    if (running) return;
    running = true;
    fn(...arguments);
    setTimeout(() => {
      running = false;
    }, timeInterval);
  };
};

var _window;
const FOCUS_LISTENER = new Set();
const VISIBLE_LISTENER = new Set();
const RECONNECT_LISTENER = new Set();
const subscriber = (listenerType, event) => {
  let listeners;
  switch (listenerType) {
    case 'FOCUS_LISTENER':
      listeners = FOCUS_LISTENER;
      break;
    case 'RECONNECT_LISTENER':
      listeners = RECONNECT_LISTENER;
      break;
    case 'VISIBLE_LISTENER':
      listeners = VISIBLE_LISTENER;
      break;
  }
  if (listeners.has(event)) return;
  listeners.add(event);
  return () => {
    listeners.delete(event);
  };
};
const observer = listeners => {
  listeners.forEach(event => {
    event();
  });
};
/* istanbul ignore else */
if (!isServer && (_window = window) !== null && _window !== void 0 && _window.addEventListener) {
  window.addEventListener('visibilitychange', () => {
    /* istanbul ignore else */
    if (isDocumentVisibility()) {
      observer(VISIBLE_LISTENER);
    }
  }, false);
  window.addEventListener('focus', () => observer(FOCUS_LISTENER), false);
  window.addEventListener('online', () => observer(RECONNECT_LISTENER), false);
}

/**
 * source by `lodash`
 * https://github.com/lodash/lodash.git
 */
function debounce(func, wait, options) {
  let lastArgs, lastThis, maxWait, result, timerId, lastCallTime;
  let lastInvokeTime = 0;
  let leading = false;
  let maxing = false;
  let trailing = true;
  // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
  const useRAF = !wait && wait !== 0 && typeof window.requestAnimationFrame === 'function';
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  wait = +wait || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;
    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  function startTimer(pendingFunc, wait) {
    if (useRAF) {
      window.cancelAnimationFrame(timerId);
      return window.requestAnimationFrame(pendingFunc);
    }
    return setTimeout(pendingFunc, wait);
  }
  function cancelTimer(id) {
    if (useRAF) {
      return window.cancelAnimationFrame(id);
    }
    clearTimeout(id);
  }
  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = startTimer(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }
  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;
    return maxing ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }
  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = startTimer(timerExpired, remainingWait(time));
  }
  function trailingEdge(time) {
    timerId = undefined;
    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }
  function cancel() {
    if (timerId !== undefined) {
      cancelTimer(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }
  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }
  function pending() {
    return timerId !== undefined;
  }
  function debounced() {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    lastArgs = args;
    lastThis = this;
    lastCallTime = time;
    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;
  return debounced;
}

function baseMerge(origin, target) {
  for (const key in target) {
    if (target[key] === undefined) {
      continue;
    }
    if (!isObject(target[key]) ||
    // `target[key]` is not an object
    !isObject(origin[key]) ||
    // `target[key]` is not an object
    !(key in origin) // `key` is not in the origin object
    ) {
      origin[key] = target[key];
      continue;
    }
    if (isPlainObject(target[key]) || isArray(target[key])) {
      baseMerge(origin[key], target[key]);
    }
  }
}
function merge(origin) {
  const result = Object.assign({}, origin);
  for (var _len = arguments.length, others = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    others[_key - 1] = arguments[_key];
  }
  if (!others.length) return result;
  for (const item of others) {
    baseMerge(result, item);
  }
  return result;
}

/**
 * source by `lodash`
 * https://github.com/lodash/lodash.git
 */
function throttle(func, wait, options) {
  let leading = true;
  let trailing = true;
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait
  });
}

const setStateBind = (oldState, publicCb) => {
  return newState => {
    Object.keys(newState).forEach(key => {
      oldState[key].value = newState[key];
    });
    publicCb.forEach(fun => fun(oldState));
  };
};
const createQuery = (query, config, initialState) => {
  var _initialState$loading, _initialState$data, _initialState$params;
  const {
    initialAutoRunFlag,
    initialData,
    loadingDelay,
    pollingInterval,
    debounceInterval,
    debounceOptions,
    throttleInterval,
    throttleOptions,
    pollingWhenHidden,
    pollingWhenOffline,
    errorRetryCount,
    errorRetryInterval,
    stopPollingWhenHiddenOrOffline,
    refreshOnWindowFocus,
    refocusTimespan,
    updateCache,
    formatResult,
    onSuccess,
    onError,
    onBefore,
    onAfter
  } = config;
  const retriedCount = ref(0);
  const loading = ref((_initialState$loading = initialState === null || initialState === void 0 ? void 0 : initialState.loading) !== null && _initialState$loading !== void 0 ? _initialState$loading : false);
  const data = ref((_initialState$data = initialState === null || initialState === void 0 ? void 0 : initialState.data) !== null && _initialState$data !== void 0 ? _initialState$data : initialData);
  const error = ref(initialState === null || initialState === void 0 ? void 0 : initialState.error);
  const params = ref((_initialState$params = initialState === null || initialState === void 0 ? void 0 : initialState.params) !== null && _initialState$params !== void 0 ? _initialState$params : []);
  const setState = setStateBind({
    loading,
    data,
    error,
    params
  }, [state => updateCache(state)]);
  // reset retried count
  const resetRetriedCount = () => {
    retriedCount.value = 0;
  };
  const count = ref(0);
  const pollingTimer = ref();
  const retryTimer = ref();
  const delayLoadingTimer = ref();
  const clearAllTimer = () => {
    // clear pollingTimer
    if (pollingTimer.value) {
      pollingTimer.value();
    }
    // clear delayLoadingTimer
    if (delayLoadingTimer.value) {
      delayLoadingTimer.value();
    }
    // clear retryTimer
    if (retryTimer.value) {
      retryTimer.value();
    }
  };
  const delayLoading = () => {
    let timerId;
    if (loadingDelay) {
      timerId = setTimeout(setState, loadingDelay, {
        loading: true
      });
    }
    return () => timerId && clearTimeout(timerId);
  };
  const polling = pollingFunc => {
    // if errorRetry is enabled, then skip this method
    if (error.value && errorRetryCount !== 0) return;
    let timerId;
    if (!isNil(pollingInterval) && pollingInterval >= 0) {
      if ((pollingWhenHidden || isDocumentVisibility()) && (pollingWhenOffline || isOnline())) {
        timerId = setTimeout(pollingFunc, pollingInterval);
      } else {
        // stop polling
        stopPollingWhenHiddenOrOffline.value = true;
        return;
      }
    }
    return () => timerId && clearTimeout(timerId);
  };
  const actualErrorRetryInterval = computed(() => {
    if (errorRetryInterval) return errorRetryInterval;
    const baseTime = 1000;
    const minCoefficient = 1;
    const maxCoefficient = 9;
    // When retrying for the first time, in order to avoid the coefficient being 0
    // so replace 0 with 2, the coefficient range will become 1 - 2
    const coefficient = Math.floor(Math.random() * 2 ** Math.min(retriedCount.value, maxCoefficient) + minCoefficient);
    return baseTime * coefficient;
  });
  const errorRetryHooks = retryFunc => {
    let timerId;
    const isInfiniteRetry = errorRetryCount === -1;
    const hasRetryCount = retriedCount.value < errorRetryCount;
    // if errorRetryCount is -1, it will retry the request until it success
    if (error.value && (isInfiniteRetry || hasRetryCount)) {
      if (!isInfiniteRetry) retriedCount.value += 1;
      timerId = setTimeout(retryFunc, actualErrorRetryInterval.value);
    }
    return () => timerId && clearTimeout(timerId);
  };
  const _run = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    setState({
      loading: !loadingDelay,
      params: args
    });
    delayLoadingTimer.value = delayLoading();
    count.value += 1;
    const currentCount = count.value;
    // onBefore hooks
    onBefore === null || onBefore === void 0 ? void 0 : onBefore(args);
    return query(...args).then(res => {
      if (currentCount === count.value) {
        const formattedResult = formatResult ? formatResult(res) : res;
        setState({
          data: formattedResult,
          loading: false,
          error: undefined
        });
        if (onSuccess) {
          onSuccess(formattedResult, args);
        }
        resetRetriedCount();
        return formattedResult;
      }
      return resolvedPromise;
    }).catch(error => {
      if (currentCount === count.value) {
        setState({
          data: undefined,
          loading: false,
          error: error
        });
        if (onError) {
          onError(error, args);
        }
        console.error(error);
      }
      return resolvedPromise;
    }).finally(() => {
      if (currentCount === count.value) {
        // clear delayLoadingTimer
        delayLoadingTimer.value();
        // retry
        retryTimer.value = errorRetryHooks(() => _run(...args));
        // run for polling
        pollingTimer.value = polling(() => _run(...args));
        // onAfter hooks
        onAfter === null || onAfter === void 0 ? void 0 : onAfter(args);
      }
    });
  };
  const debouncedRun = !isNil(debounceInterval) && debounce(_run, debounceInterval, debounceOptions);
  const throttledRun = !isNil(throttleInterval) && throttle(_run, throttleInterval, throttleOptions);
  const run = function () {
    clearAllTimer();
    resetRetriedCount();
    // initial auto run should not debounce
    if (!initialAutoRunFlag.value && debouncedRun) {
      debouncedRun(...arguments);
      return resolvedPromise;
    }
    if (throttledRun) {
      throttledRun(...arguments);
      return resolvedPromise;
    }
    return _run(...arguments);
  };
  const cancel = () => {
    count.value += 1;
    setState({
      loading: false
    });
    if (debouncedRun) {
      debouncedRun.cancel();
    }
    if (throttledRun) {
      throttledRun.cancel();
    }
    clearAllTimer();
  };
  const refresh = () => {
    return run(...params.value);
  };
  const mutate = x => {
    const mutateData = isFunction(x) ? x(data.value) : x;
    setState({
      data: mutateData
    });
  };
  // collect subscribers, in order to unsubscribe when the component unmounted
  const unsubscribeList = [];
  const addUnsubscribeList = event => {
    event && unsubscribeList.push(event);
  };
  const rePolling = () => {
    if (stopPollingWhenHiddenOrOffline.value && (pollingWhenHidden || isDocumentVisibility()) && (pollingWhenOffline || isOnline())) {
      refresh();
      stopPollingWhenHiddenOrOffline.value = false;
    }
  };
  // subscribe polling
  if (!pollingWhenHidden) {
    addUnsubscribeList(subscriber('VISIBLE_LISTENER', rePolling));
  }
  // subscribe online when pollingWhenOffline is false
  if (!pollingWhenOffline) {
    addUnsubscribeList(subscriber('RECONNECT_LISTENER', rePolling));
  }
  const limitRefresh = limitTrigger(refresh, refocusTimespan);
  // subscribe window focus or visible
  if (refreshOnWindowFocus) {
    addUnsubscribeList(subscriber('VISIBLE_LISTENER', limitRefresh));
    addUnsubscribeList(subscriber('FOCUS_LISTENER', limitRefresh));
  }
  const unmount = () => {
    unsubscribeList.forEach(unsubscribe => unsubscribe());
  };
  return {
    loading,
    data,
    error,
    params,
    run,
    cancel,
    refresh,
    mutate,
    unmount
  };
};

const CACHE_MAP = new Map();
const getCache = cacheKey => {
  if (isNil(cacheKey)) return;
  const data = CACHE_MAP.get(cacheKey);
  if (!data) return;
  return {
    data: data.data,
    cacheTime: data.cacheTime
  };
};
const setCache = (cacheKey, data, cacheTime) => {
  const oldCache = CACHE_MAP.get(cacheKey);
  if (oldCache !== null && oldCache !== void 0 && oldCache.timer) {
    clearTimeout(oldCache.timer);
  }
  const timer = setTimeout(() => CACHE_MAP.delete(cacheKey), cacheTime);
  CACHE_MAP.set(cacheKey, {
    data,
    timer,
    cacheTime: new Date().getTime()
  });
};

const QUERY_DEFAULT_KEY = '__QUERY_DEFAULT_KEY__';
function useAsyncQuery(query, options) {
  const injectedGlobalOptions = inject(GLOBAL_OPTIONS_PROVIDE_KEY, {});
  const {
    cacheKey,
    defaultParams = [],
    manual = false,
    ready = ref(true),
    refreshDeps = [],
    loadingDelay = 0,
    pollingWhenHidden = false,
    pollingWhenOffline = false,
    refreshOnWindowFocus = false,
    refocusTimespan = 5000,
    cacheTime = 600000,
    staleTime = 0,
    errorRetryCount = 0,
    errorRetryInterval = 0,
    queryKey,
    ...rest
  } = {
    ...getGlobalOptions(),
    ...injectedGlobalOptions,
    ...options
  };
  const stopPollingWhenHiddenOrOffline = ref(false);
  // skip debounce when initail run
  const initialAutoRunFlag = ref(false);
  const updateCache = state => {
    var _getCache, _queryKey;
    if (!cacheKey) return;
    const cacheData = (_getCache = getCache(cacheKey)) === null || _getCache === void 0 ? void 0 : _getCache.data;
    const cacheQueries = cacheData === null || cacheData === void 0 ? void 0 : cacheData.queries;
    const queryData = unRefObject(state);
    const currentQueryKey = (_queryKey = queryKey === null || queryKey === void 0 ? void 0 : queryKey(...state.params.value)) !== null && _queryKey !== void 0 ? _queryKey : QUERY_DEFAULT_KEY;
    setCache(cacheKey, {
      queries: {
        ...cacheQueries,
        [currentQueryKey]: {
          ...(cacheQueries === null || cacheQueries === void 0 ? void 0 : cacheQueries[currentQueryKey]),
          ...queryData
        }
      },
      latestQueriesKey: currentQueryKey
    }, cacheTime);
  };
  const config = {
    initialAutoRunFlag,
    loadingDelay,
    pollingWhenHidden,
    pollingWhenOffline,
    stopPollingWhenHiddenOrOffline,
    cacheKey,
    errorRetryCount,
    errorRetryInterval,
    refreshOnWindowFocus,
    refocusTimespan,
    updateCache,
    ...omit(rest, ['pagination', 'listKey'])
  };
  const loading = ref(false);
  const data = ref();
  const error = ref();
  const params = ref();
  const queries = reactive({
    [QUERY_DEFAULT_KEY]: reactive(createQuery(query, config))
  });
  const latestQueriesKey = ref(QUERY_DEFAULT_KEY);
  const latestQuery = computed(() => {
    var _queries$latestQuerie;
    return (_queries$latestQuerie = queries[latestQueriesKey.value]) !== null && _queries$latestQuerie !== void 0 ? _queries$latestQuerie : {};
  });
  // sync state
  watch(latestQuery, queryData => {
    loading.value = queryData.loading;
    data.value = queryData.data;
    error.value = queryData.error;
    params.value = queryData.params;
  }, {
    immediate: true,
    deep: true
  });
  // init queries from cache
  if (cacheKey) {
    var _cache$data;
    const cache = getCache(cacheKey);
    if (cache !== null && cache !== void 0 && (_cache$data = cache.data) !== null && _cache$data !== void 0 && _cache$data.queries) {
      Object.keys(cache.data.queries).forEach(key => {
        const cacheQuery = cache.data.queries[key];
        queries[key] = reactive(createQuery(query, config, {
          loading: cacheQuery.loading,
          params: cacheQuery.params,
          data: cacheQuery.data,
          error: cacheQuery.error
        }));
      });
      /* istanbul ignore else */
      if (cache.data.latestQueriesKey) {
        latestQueriesKey.value = cache.data.latestQueriesKey;
      }
    }
  }
  const tempReadyParams = ref();
  const hasTriggerReady = ref(false);
  const run = function () {
    var _queryKey2;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (!ready.value && !hasTriggerReady.value) {
      tempReadyParams.value = args;
      return resolvedPromise;
    }
    const newKey = (_queryKey2 = queryKey === null || queryKey === void 0 ? void 0 : queryKey(...args)) !== null && _queryKey2 !== void 0 ? _queryKey2 : QUERY_DEFAULT_KEY;
    if (!queries[newKey]) {
      queries[newKey] = reactive(createQuery(query, config));
    }
    latestQueriesKey.value = newKey;
    return latestQuery.value.run(...args);
  };
  const reset = () => {
    unmountQueries();
    latestQueriesKey.value = QUERY_DEFAULT_KEY;
    queries[QUERY_DEFAULT_KEY] = reactive(createQuery(query, config));
  };
  // unmount queries
  const unmountQueries = () => {
    Object.keys(queries).forEach(key => {
      queries[key].cancel();
      queries[key].unmount();
      delete queries[key];
    });
  };
  const cancel = () => latestQuery.value.cancel();
  const refresh = () => latestQuery.value.refresh();
  const mutate = arg => latestQuery.value.mutate(arg);
  // initial run
  if (!manual) {
    var _cache$data$queries;
    initialAutoRunFlag.value = true;
    // TODO: need refactor
    const cache = getCache(cacheKey);
    const cacheQueries = (_cache$data$queries = cache === null || cache === void 0 ? void 0 : cache.data.queries) !== null && _cache$data$queries !== void 0 ? _cache$data$queries : {};
    const isFresh = cache && (staleTime === -1 || cache.cacheTime + staleTime > new Date().getTime());
    const hasCacheQueries = Object.keys(cacheQueries).length > 0;
    if (!isFresh) {
      if (hasCacheQueries) {
        Object.keys(queries).forEach(key => {
          var _queries$key;
          (_queries$key = queries[key]) === null || _queries$key === void 0 ? void 0 : _queries$key.refresh();
        });
      } else {
        run(...defaultParams);
      }
    }
    initialAutoRunFlag.value = false;
  }
  // watch ready
  const stopReady = ref();
  stopReady.value = watch(ready, val => {
    hasTriggerReady.value = true;
    if (val && tempReadyParams.value) {
      run(...tempReadyParams.value);
      // destroy current watch
      stopReady.value();
    }
  }, {
    flush: 'sync'
  });
  // watch refreshDeps
  if (refreshDeps.length) {
    watch(refreshDeps, () => {
      !manual && latestQuery.value.refresh();
    });
  }
  onUnmounted(() => {
    unmountQueries();
  });
  return {
    loading,
    data,
    error,
    params,
    cancel,
    refresh,
    mutate,
    run,
    reset,
    queries
  };
}

const generateService = service => {
  return function () {
    if (isFunction(service)) {
      return generateService(service(...arguments))();
    } else if (isPromise(service)) {
      return service;
    } else if (isPlainObject(service)) {
      const {
        url,
        ...rest
      } = service;
      return requestProxy(url, rest);
    } else if (isString(service)) {
      return requestProxy(service);
    } else {
      throw warning('Unknown service type', true);
    }
  };
};

function useLoadMore(service, options) {
  var _injectedGlobalOption;
  if (!isFunction(service)) {
    warning('useLoadMore only support function service');
  }
  const promiseQuery = generateService(service);
  const injectedGlobalOptions = inject(GLOBAL_OPTIONS_PROVIDE_KEY, {});
  const {
    queryKey,
    isNoMore,
    listKey = 'list',
    ...restOptions
  } = Object.assign({
    listKey: (_injectedGlobalOption = injectedGlobalOptions.listKey) !== null && _injectedGlobalOption !== void 0 ? _injectedGlobalOption : getGlobalOptions().listKey
  }, options !== null && options !== void 0 ? options : {});
  if (queryKey) {
    warning('useLoadMore does not support concurrent request');
  }
  const refreshing = ref(false);
  const loadingMore = ref(false);
  const reloading = ref(false);
  const initailIncreaseQueryKey = 0;
  const increaseQueryKey = ref(initailIncreaseQueryKey);
  const {
    data,
    params,
    queries,
    run,
    reset,
    cancel: _cancel,
    ...rest
  } = useAsyncQuery(promiseQuery, {
    ...restOptions,
    onSuccess: function () {
      var _restOptions$onSucces;
      loadingMore.value = false;
      increaseQueryKey.value++;
      for (var _len = arguments.length, p = new Array(_len), _key = 0; _key < _len; _key++) {
        p[_key] = arguments[_key];
      }
      restOptions === null || restOptions === void 0 ? void 0 : (_restOptions$onSucces = restOptions.onSuccess) === null || _restOptions$onSucces === void 0 ? void 0 : _restOptions$onSucces.call(restOptions, ...p);
    },
    onError: function () {
      var _restOptions$onError;
      loadingMore.value = false;
      for (var _len2 = arguments.length, p = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        p[_key2] = arguments[_key2];
      }
      restOptions === null || restOptions === void 0 ? void 0 : (_restOptions$onError = restOptions.onError) === null || _restOptions$onError === void 0 ? void 0 : _restOptions$onError.call(restOptions, ...p);
    },
    queryKey: () => String(increaseQueryKey.value)
  });
  const latestData = ref(data.value);
  watchEffect(() => {
    if (data.value !== undefined) {
      latestData.value = data.value;
    }
  });
  const noMore = computed(() => {
    return isNoMore && isFunction(isNoMore) ? isNoMore(latestData.value) : false;
  });
  const dataList = computed(() => {
    let list = [];
    Object.values(queries).forEach(h => {
      const dataList = get(h.data, listKey);
      if (dataList && Array.isArray(dataList)) {
        list = list.concat(dataList);
      }
    });
    return list;
  });
  const loadMore = () => {
    if (noMore.value) {
      return;
    }
    loadingMore.value = true;
    const [, ...restParams] = params.value;
    const mergerParams = [{
      dataList: dataList.value,
      data: latestData.value
    }, ...restParams];
    run(...mergerParams);
  };
  const unmountQueries = () => {
    Object.keys(queries).forEach(key => {
      if (key !== initailIncreaseQueryKey.toString()) {
        queries[key].cancel();
        queries[key].unmount();
        delete queries[key];
      }
    });
  };
  const refresh = async () => {
    refreshing.value = true;
    const latestKey = increaseQueryKey.value - 1;
    const key = latestKey < initailIncreaseQueryKey ? initailIncreaseQueryKey : latestKey;
    latestData.value = queries[key].data;
    increaseQueryKey.value = initailIncreaseQueryKey;
    const [, ...restParams] = params.value;
    const mergerParams = [undefined, ...restParams];
    await run(...mergerParams);
    unmountQueries();
    refreshing.value = false;
  };
  const reload = async () => {
    reloading.value = true;
    reset();
    increaseQueryKey.value = initailIncreaseQueryKey;
    latestData.value = undefined;
    const [, ...restParams] = params.value;
    const mergerParams = [undefined, ...restParams];
    await run(...mergerParams);
    reloading.value = false;
  };
  const cancel = () => {
    _cancel();
    loadingMore.value = false;
    refreshing.value = false;
  };
  return {
    data: latestData,
    dataList: dataList,
    params,
    noMore,
    loadingMore,
    refreshing,
    reloading,
    run,
    reload,
    loadMore,
    reset,
    refresh,
    cancel,
    ...omit(rest, ['refresh', 'mutate'])
  };
}

function usePagination(service, options) {
  var _getGlobalOptions$pag, _injectedGlobalOption;
  const promiseQuery = generateService(service);
  const defaultOptions = {
    pagination: {
      currentKey: 'current',
      pageSizeKey: 'pageSize',
      totalKey: 'total',
      totalPageKey: 'totalPage'
    }
  };
  const injectedGlobalOptions = inject(GLOBAL_OPTIONS_PROVIDE_KEY, {});
  const {
    pagination: {
      currentKey,
      pageSizeKey,
      totalKey,
      totalPageKey
    },
    queryKey,
    ...restOptions
  } = merge(defaultOptions, {
    pagination: (_getGlobalOptions$pag = getGlobalOptions().pagination) !== null && _getGlobalOptions$pag !== void 0 ? _getGlobalOptions$pag : {}
  }, {
    pagination: (_injectedGlobalOption = injectedGlobalOptions.pagination) !== null && _injectedGlobalOption !== void 0 ? _injectedGlobalOption : {}
  }, options !== null && options !== void 0 ? options : {});
  if (queryKey) {
    warning('usePagination does not support concurrent request');
  }
  const finallyOptions = merge({
    defaultParams: [{
      [currentKey]: 1,
      [pageSizeKey]: 10
    }]
  }, restOptions);
  const {
    data,
    params,
    queries,
    run,
    reset,
    ...rest
  } = useAsyncQuery(promiseQuery, finallyOptions);
  const paging = paginationParams => {
    const [oldPaginationParams, ...restParams] = params.value;
    const newPaginationParams = {
      ...oldPaginationParams,
      ...paginationParams
    };
    const mergerParams = [newPaginationParams, ...restParams];
    run(...mergerParams);
  };
  // changeCurrent	change current page	(current: number) => void
  const changeCurrent = current => {
    paging({
      [currentKey]: current
    });
  };
  // changePageSize	change pageSize	(pageSize: number) => void
  const changePageSize = pageSize => {
    paging({
      [pageSizeKey]: pageSize
    });
  };
  // changePagination	change current and pageSize	(current: number, pageSize: number) => void
  const changePagination = (current, pageSize) => {
    paging({
      [currentKey]: current,
      [pageSizeKey]: pageSize
    });
  };
  const reloading = ref(false);
  const reload = async () => {
    const {
      defaultParams,
      manual
    } = finallyOptions;
    reset();
    if (!manual) {
      reloading.value = true;
      await run(...defaultParams);
      reloading.value = false;
    }
  };
  const total = computed(() => get(data.value, totalKey, 0));
  const current = computed({
    get: () => {
      var _params$value$0$curre, _params$value$;
      return (_params$value$0$curre = (_params$value$ = params.value[0]) === null || _params$value$ === void 0 ? void 0 : _params$value$[currentKey]) !== null && _params$value$0$curre !== void 0 ? _params$value$0$curre : finallyOptions.defaultParams[0][currentKey];
    },
    set: val => {
      changeCurrent(val);
    }
  });
  const pageSize = computed({
    get: () => {
      var _params$value$0$pageS, _params$value$2;
      return (_params$value$0$pageS = (_params$value$2 = params.value[0]) === null || _params$value$2 === void 0 ? void 0 : _params$value$2[pageSizeKey]) !== null && _params$value$0$pageS !== void 0 ? _params$value$0$pageS : finallyOptions.defaultParams[0][pageSizeKey];
    },
    set: val => {
      changePageSize(val);
    }
  });
  const totalPage = computed(() => get(data.value, totalPageKey, Math.ceil(total.value / pageSize.value)));
  return {
    data,
    params,
    current,
    pageSize,
    total,
    totalPage,
    reloading,
    run,
    changeCurrent,
    changePageSize,
    changePagination,
    reload,
    ...rest
  };
}

function useRequest(service, options) {
  const promiseQuery = generateService(service);
  const {
    reset,
    run,
    ...rest
  } = useAsyncQuery(promiseQuery, options !== null && options !== void 0 ? options : {});
  const reloading = ref(false);
  const reload = async () => {
    const {
      defaultParams = [],
      manual
    } = options;
    reset();
    if (!manual) {
      reloading.value = true;
      await run(...defaultParams);
      reloading.value = false;
    }
  };
  return {
    reload,
    run,
    reloading,
    ...rest
  };
}

export { RequestConfig, setGlobalOptions, useLoadMore, usePagination, useRequest };
