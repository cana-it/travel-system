export const MoneyTransfer = (money,rate) => {
    const input = parseFloat(money);
    if (Number.isNaN(input)) {
        return '';
    }
    if (rate==="") {
        return "N/A";
    }
    const output = input*rate;
    const rounded = Math.round(output * 1000)/1000;
    return rounded.toString();
}
