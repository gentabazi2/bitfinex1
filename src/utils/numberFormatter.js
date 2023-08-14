export const formatArrayNumbers = (array) => {
  let [price, count, amount, total] = array;
  amount = Math.abs(amount);
  total = Math.abs(total);
  amount =
    amount < 10
      ? amount >= 1
        ? amount.toFixed(3)
        : amount.toFixed(4)
      : Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(amount);

  total =
    total < 10
      ? total
        ? total >= 1
          ? total.toFixed(3)
          : total.toFixed(4)
        : 0
      : Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(total);

  if (price < 1) {
    price = price.toFixed(9).toString();
    const [integerPart, decimalPart] = price.split(".");
    const trimmedDecimalPart = decimalPart
      ? decimalPart.replace(/0+$/, "")
      : "";

    if (trimmedDecimalPart.length > 0) {
      price = `0.${trimmedDecimalPart}`;
    } else {
      price = integerPart;
    }
  } else {
    price = price.toLocaleString("en-US");
  }

  return [price, count, amount, total];
};
