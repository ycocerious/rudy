export const generateMockData = () => {
  const data = [];
  for (let i = 0; i < 7; i++) {
    const week = [];
    for (let j = 0; j < 52; j++) {
      if (j < 26) {
        week.push(-1); // Indicate no data for first 6 months
      } else {
        week.push(Math.floor(Math.random() * 6)); // 0-5 for variety
      }
    }
    data.push(week);
  }
  return data;
};
