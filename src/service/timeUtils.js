export const isExpired = (startDate, endDate, duration) => {
  return (endDate - startDate) / 1000 > duration;
};
