import axios from 'axios';

const get = (url, callbacks) => {
  const { onSuccess, onError } = callbacks;
  axios({
    method: 'get',
    url,
  })
    .then(function (response) {
      onSuccess && onSuccess(response);
    })
    .catch(function (error) {
      onError && onError(error);
    });
};

export const http = {
  get,
};
