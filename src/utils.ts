export const months = [...Array(12)].map((_, month) => {
  const date = new Date();
  date.setMonth(month);
  return date.toLocaleString('default', { month: 'long' });

});

export const shuffle = <T,>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
