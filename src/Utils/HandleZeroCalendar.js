export const HandleZeroCalendar = (date) => {

    try {
        if (date === undefined || date === "" || date === null || date === " ") return false;

        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            h = d.getHours(),
            m = d.getMinutes()

        if (d === undefined || month === undefined || day === undefined || h === undefined || m === undefined) return false
        if ((month?.toString()?.length || 1) < 2)
            month = '0' + month;
        if ((day?.toString()?.length || 1) < 2)
            day = '0' + day;
        if ((h?.toString()?.length || 1) < 2)
            h = '0' + h;
        if ((m?.toString()?.length || 1) < 2)
            m = '0' + m;

      
        
        if
            (
            (month?.substring(0, 1)?.toString() || "0") === "0"
            || (day?.substring(0, 1)?.toString() || "0") === "0"
            || (h?.substring(0, 1)?.toString()  || "0") === "0"
            || (m?.substring(0, 1)?.toString()  || "0") === "0"
        ) {
            return true
        }
        return false;
    } catch (error) {
        return false;
    }
}