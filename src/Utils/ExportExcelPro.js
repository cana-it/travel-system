import * as XLSX from 'xlsx';
/* import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate"; */

export const ExportExcelPro = (tableid, fileName, totalTable = 1) => {

    // Extract Data (create a workbook object from the table)
    var workbook = XLSX.utils.table_to_book(document.getElementById(tableid + 1));

    // Process Data (add a new table to sheet)
    var worksheet = workbook.Sheets["Sheet1"];
    //XLSX.utils.sheet_add_aoa(worksheet, [["Created " + new Date().toISOString()]], { origin: -1 })

    XLSX.utils.sheet_add_dom(workbook.Sheets["Sheet1"], document.getElementById(tableid + 2), { origin: -1 });
    create_gap_rows(worksheet, 2);

    //Add css
    
    /* worksheet.A2.style({
        color: "red",
        bold: true,
        horizontalAlignment: "center",
        verticalAlignment: "center",
    })
    worksheet.L5.style({
        color: "white",
        fill: "FFFD04",
        horizontalAlignment: "center",
        verticalAlignment: "center",
    }) */
    /* worksheet.Sheet1.usedRange().style({
        fontFamily: "Arial",
        verticalAlignment: "center",
        bold: true,
    }); */
    /*  
 
     worksheet.column("A").width(150);
     worksheet.column("B").width(350);
     worksheet.column("C").width(150);
     worksheet.column("E").width(150);
     worksheet.column("G").width(150); */

    // Package and Release Data (`writeFile` tries to write and save an XLSB file)
    XLSX.writeFile(workbook, fileName + ".xlsx");
}


const create_gap_rows = (ws, nrows) => {
    var ref = XLSX.utils.decode_range(ws["!ref"]);       // get original range
    ref.e.r += nrows;                                    // add to ending row
    ws["!ref"] = XLSX.utils.encode_range(ref);           // reassign row
}
