import { isObject } from 'lodash';
import { URLS } from '../config/urls';

const convertQueryObjectToQueryString = queryObj => {
  if (!isObject(queryObj)) return '';
  return Object.keys(queryObj)
    .map(key => {
      return `${key}=${encodeURIComponent(queryObj[key])}`;
    })
    .join('&');
};

export const urlGenerator = urlConfig => {
  const { urlPath, queryParams } = urlConfig;
  return (
    'https://' +
    URLS.BASE_URL +
    urlPath +
    '?' +
    convertQueryObjectToQueryString(queryParams)
  );
};
