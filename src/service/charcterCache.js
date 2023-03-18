import { has } from 'lodash';
import { getDataFromLocalStorage } from './localStorage';

export const requestIfNeeded = (storageKey, itemId, callbacks, sendRequest) => {
  const { onRequest, onUseCache } = callbacks;
  const cachedData = getDataFromLocalStorage(storageKey);
  const itemDataIsCached = has(cachedData, itemId);
  if (!itemDataIsCached || (sendRequest && sendRequest(cachedData))) {
    onRequest && onRequest();
    return;
  }

  onUseCache && onUseCache(cachedData);
};
