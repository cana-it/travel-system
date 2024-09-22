export const FormatTest = (Contents) => {

    let Contentspr = ""
    if(Contents.includes('"')) Contentspr = Contents.replaceAll('"',""); // remove characters "
    
    Contentspr = Contentspr.replace(/!|\|~/g, ""); // remove character "\"

    if(Contentspr === "") Contentspr = Contents;

    return Contentspr;

}