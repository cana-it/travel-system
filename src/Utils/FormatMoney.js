export const FormatMoney = (money, type = 0) => {
  const formatter = new Intl.NumberFormat();
  if (type === 1) {
    return +money.replace(/\D/g, "");
  }
  return formatter.format(+money); /* $2,500.00 */
};
