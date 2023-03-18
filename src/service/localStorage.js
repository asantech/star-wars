export const setDataToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getDataFromLocalStorage = key => {
  return JSON.parse(localStorage.getItem(key));
};
