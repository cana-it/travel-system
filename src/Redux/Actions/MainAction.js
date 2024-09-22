import { mainTypes } from ".";

export function closeError(params, cb) {
  return {
    type: mainTypes.ERROR,
    params,
    cb,
  };
}

export function changeLanguage(params, dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: mainTypes.CHANGE_LANGUAGE,
      params,
      resolve,
      reject,
    });
  });
}

export function LOADING(params, dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: mainTypes.LOADING,
      params,
      resolve,
      reject,
    });
  });
}

export function checkLanguage() {
  return {
    type: mainTypes.CHECK_LANGUAGE,
  };
}

export function API_spCallServer(params, dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: mainTypes.CallServer,
      params,
      resolve,
      reject,
    });
  });
}
export function API_spCallServerNoLoading(params, dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: mainTypes.CallServer,
      params,
      resolve,
      reject,
    });
  });
}
export function API_spCallExportExcel(params, dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: mainTypes.CallExportExcel,
      params,
      resolve,
      reject,
    });
  });
}
export function EncryptString(params, dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: mainTypes.EncryptString,
      params,
      resolve,
      reject,
    });
  });
}
export function API_spCallPostFile(params, dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: mainTypes.API_spCallPostFile,
      params,
      resolve,
      reject,
    });
  });
}

export function API_spCallPostImageBase64(params, dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: mainTypes.API_spCallPostImageBase64,
      params,
      resolve,
      reject,
    });
  });
}
