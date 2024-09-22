import { DecodeString } from "./DecodeString";

export const GetLogin = (Key = "logsys") => {
  if (Key !== "logsys") {
    /* localStorage.setItem("CreateBy", result[0].StaffId);
        localStorage.setItem("CreateName", result[0].StaffName);
        localStorage.setItem("Avatar", result[0].Avatar);
        localStorage.setItem("DepartmentId", result[0].DepartmentId);
        localStorage.setItem("BranchId", result[0].BranchId);
        localStorage.removeItem("DateLogin");
        localStorage.setItem("DateLogin", new Date());
        localStorage.setItem("PositionId", result[0].PositionId);
        localStorage.setItem("NickName", result[0].NickName);
        localStorage.setItem("Signature", result[0].Signature);
        localStorage.setItem("Token", _token); */
    return localStorage.getItem(Key);
  } else {
    let objectCookies = localStorage.getItem("logsys");
    if (
      objectCookies !== "" &&
      objectCookies !== "{}" &&
      objectCookies !== null &&
      objectCookies !== undefined
    ) {
      return DecodeString(objectCookies);
    } else return null;
  }
};
