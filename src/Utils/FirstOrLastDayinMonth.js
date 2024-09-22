export const FirstOrLastDayinMonth = (date, key) => {
    if (key === 1) {  // trả về ngày đầu tháng
        let FirstDay = new Date(date.getFullYear(), date.getMonth(), 1);  
        return FirstDay;
    }
    else // trả về ngày cuối tháng
    {
        let LastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return LastDay;

    }
};