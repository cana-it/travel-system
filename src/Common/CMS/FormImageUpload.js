import { mainAction } from "../../Redux/Actions";
import { ConvertFileName } from "../../Utils";

const FormImageUpload = async (FileUpload, Folder = "Images", dispatch) => {
  const formData = new FormData();
  formData.append("Key", Folder);
  let listimage = "";
  if (FileUpload !== "" && FileUpload.length > 0 && Array.isArray(FileUpload)) {
    for (let i = 0; i < FileUpload.length; i++) {
      let f = FileUpload[i];
      let renamedFile = new File([f], ConvertFileName(f.name), {
        type: f.type,
      });

      formData.append("myFile" + i, renamedFile);
    }
    const data = await mainAction.API_spCallPostFile(formData, dispatch);
    let _img = data.Message.replaceAll('"', "");
    listimage = _img.replace("[", "").replace("]", "");
  }
  return [listimage]
    .filter((p) => p !== "" && p !== undefined && p !== "undefined")
    .join(",");
};

export default FormImageUpload;
