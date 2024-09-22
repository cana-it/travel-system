import { FormatMoney } from "./FormatMoney";

// export const FormatMoneyFloat = (money, type = 0) => {
//   const formatter = new Intl.NumberFormat();
//   const inputNumber = money.replace(/[^\d.-.]+/g, "");
//   if (type === 1) {
//     if (inputNumber !== "") {
//       return FormatMoney(inputNumber);
//     }
//   }
//   return money;
//   //   const formatter = new Intl.NumberFormat();
//   //   if (type === 1) {
//   //     return +money.replace(/\D/g, "");
//   //   }
//   //   return formatter.format(+money); /* $2,500.00 */
// };

export const FormatMoneyFloat = (value) => {
  // Xoá các ký tự không phải là số hoặc dấu chấm
  value = value.replace(/[^\d.]/g, "");

  // Tách phần nguyên và phần thập phân
  const [integer, decimal] = value.split(".");

  // Format phần nguyên
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // Trả về kết quả
  if (decimal === undefined) {
    return formattedInteger;
  } else {
    return formattedInteger + "." + decimal;
  }
};
