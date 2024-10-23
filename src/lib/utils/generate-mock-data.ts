export const generateMockData = () => {
  const data = [];

  for (let row = 0; row < 7; row++) {
    const rowData = [];
    for (let week = 0; week < 53; week++) {
      if (week < 26) {
        rowData.push(0); // Indicate no data for first 6 months
      } else {
        rowData.push(Math.floor(Math.random() * 5)); // 0-4 for variety
      }
    }
    data.push(rowData);
  }

  return data;
};
