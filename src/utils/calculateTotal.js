export const sortAndCalculateTotal = (isBid, allItems) => {
  const sortedItems = [...allItems].sort((a, b) =>
    isBid ? b[0] - a[0] : a[0] - b[0]
  );
  return calculateUpdatedTotal(sortedItems);
};

export const calculateUpdatedTotal = (allItems) => {
  const slicedItems = allItems.slice(0, 25);

  let total = 0;
  const updated = slicedItems.map((item) => {
    total += Math.abs(item[2]);
    let modifiedTotal = [...item];
    modifiedTotal[3] = total;
    return modifiedTotal;
  });

  return updated.concat(allItems.slice(25));
};
