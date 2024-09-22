export const CheckTypeFile = (files) => {
    if(files.includes(".pdf") || files.includes(".pptx"))
    {
        return "fa fa-file-pdf-o";
    }
    else if(files.includes(".xlsx") || files.includes(".xls"))
    {
        return "fa fa-file-excel-o";
    }
    else if(files.includes(".docx"))
    {
        return "fa fa-file-word-o";
    }
    else
    {
        return "fa fa-file-image-o";
    }
}