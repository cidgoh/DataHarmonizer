const DB_NAME = 'DataHarmonizer';
const DB_VERSION = 1;
const STORE_NAME = 'mappingCache';

const openDB = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const requestToPromise = (request) =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const transactionToPromise = (transaction) =>
  new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });

const makeCacheKey = (context, inputVal) =>
  JSON.stringify([context, inputVal]);

export const getCachedMappings = async (context, inputVals) => {
  const db = await openDB();

  try {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const results = await Promise.all(
      inputVals.map(async (inputVal) => {
        const result = await requestToPromise(
          store.get(makeCacheKey(context, inputVal))
        );

        return [inputVal, result];
      })
    );

    const cachedResults = {};
    const uncachedInputVals = [];
    results.forEach(([inputVal, result]) => {
      if (result === undefined) {
        uncachedInputVals.push(inputVal);
      } else {
        cachedResults[inputVal] = result;
      }
    });

    return { cachedResults, uncachedInputVals };
  } finally {
    db.close();
  }
};

export const cacheMappings = async (context, mappingResult) => {
  const db = await openDB();

  try {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    Object.entries(mappingResult).forEach(([inputVal, result]) => {
      store.put(result, makeCacheKey(context, inputVal));
    });

    await transactionToPromise(transaction);
  } finally {
    db.close();
  }
};
