export const getGridPosition = (index: number) => {
  const positions = {
    0: "col-start-1 row-start-1", // top-left
    1: "col-start-2 row-start-1", // top-right
    2: "col-start-1 row-start-2", // bottom-left
    3: "col-start-2 row-start-2", // bottom-right
  };
  return positions[index as keyof typeof positions] || "";
};
