import { put, delay, takeEvery } from 'redux-saga/effects';
import {mainTypes } from "../Actions";
import I18n from '../../Language'
import { EN, VN,LANE } from '../../Enum';
import { getData } from '../../Utils/Storage';
import { API_END_POINT,api,API_KEY } from "../../Services";

export function* LOADING(action) {
    try {
        delay(300);
        const IsLoading = action && action.params.IsLoading;
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: IsLoading });
    }
    catch (e) {
    }
}


export function* API_spCallServer(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        params.API_key = API_KEY;
        let FuncApi = "API_spCallServer";
        /// catch api die
        yield delay(300);

        // call api
        let respone = yield api.post(API_END_POINT + "/ApiMain/" + FuncApi, params)
        //yield delay(10000);
        // check call api success
        if (respone && respone.status === 200) {
            respone.data === "" ? action.resolve([]) : action.resolve(JSON.parse(respone.data))
        }
        else {
            // api call fail
            action.reject(respone)
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
           
        }
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
    }
    catch (e) {
        ///something wrong
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)
        
    }
}

export function* API_spCallServerNoLoading(action) {
    try {
        //show loading
        //yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });

        //params received
        const params = action && action.params
        params.API_key = API_KEY;
        let FuncApi = "API_spCallServer";
        /// catch api die
        yield delay(300);

        switch (params.func) {
            default:
                break;
        }
        //End check select data redis
        // call api
        let respone = yield api.post(API_END_POINT + "/ApiMain/" + FuncApi, params);
        // check call api success
        if (respone && respone.status == 200) {
            respone.data === "" ? action.resolve([]) : action.resolve(JSON.parse(respone.data))
        }
        else {
            // api call fail
            action.reject(respone)
            // yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });

        }
        //yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
    }
    catch (e) {
        ///something wrong
        // yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)

    }
}

export function* API_spCallPostFile(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });

        //params received
        const params = action && action.params
        params.API_key = API_KEY;
        let FuncApi = "API_spCallPostImage_New";
        /// catch api die
        yield delay(300);


        // call api
        let respone = yield api.post(API_END_POINT + "/ApiMain/" + FuncApi, params)

        // check call api success

        respone.data === "" ? action.resolve([]) : action.resolve(respone.data)

        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
    }
    catch (e) {
        ///something wrong
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)

    }
}

export function* API_spCallPostImageBase64(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });

        //params received
        const params = action && action.params
        params.API_key = API_KEY;
        let FuncApi = "API_spCallPostImageBase64";
        /// catch api die
        yield delay(300);


        // call api
        let respone = yield api.post(API_END_POINT + "/ApiMain/" + FuncApi, params)

        // check call api success

        respone.data === "" ? action.resolve([]) : action.resolve(respone.data)

        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
    }
    catch (e) {
        ///something wrong
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)

    }
}

export function* EncryptString(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        params.API_key = API_KEY;
        let FuncApi = "EncryptString";
        /// catch api die
        yield delay(300);
        

        // call api
        let respone = yield api.post(API_END_POINT + "/ApiMain/" + FuncApi, params)
        
        // check call api success
        if (respone && respone.status === 200) {
            respone.data === "" ? action.resolve('') : action.resolve(respone.data)
        }
        else {
            // api call fail
            action.reject(respone)
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
           
        }
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
    }
    catch (e) {
        ///something wrong
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)
        
    }
}

export function* changeLanguage(action) {
    try {
        const language = action.params.Key;
        const Type = action.params.Type;
        let newLanguage = language === VN ? EN : VN;
        delay(300);
        yield put({ type: mainTypes.CHANGE_LANGUAGE_SUCCESS, payload: newLanguage })
       
        I18n.locale = newLanguage
        action.resolve(newLanguage)
    }
    catch (e) {
        action.reject(e)
    }
}

export function* checkLanguage(action) {
    try {
        const language = yield getData(LANE)
        const newLanguage = language !== null && language !== '' && JSON.parse(language) === 'en' ? JSON.parse(language) : 'vn'
        yield put({ type: mainTypes.CHECK_LANGUAGE_SUCCESS, payload: newLanguage })
        I18n.locale = newLanguage
    }
    catch (e) {
    }
}

export function* API_spCallExportExcel(action) {
    try {
        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        
        //params received
        const params = action && action.params
        params.API_key = API_KEY;
        let FuncApi = params.func;
        /// catch api die
        yield delay(300);
        //Check select data redis
       
         //End check select data redis

        // call api
        let respone = yield api.post(API_END_POINT + "/ApiMain/" + FuncApi, params)
        //yield delay(10000);
        // check call api success
        if (respone && respone.status === 200) {
            respone.data === "" ? action.resolve([]) : action.resolve(JSON.parse(respone.data))
        }
        else {
            // api call fail
            action.reject(respone)
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
           
        }
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
    }
    catch (e) {
        ///something wrong
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)
        
    }
}

export default function* watchMainActionSagas() {
    ///Watcher watch Sagas
    yield takeEvery(mainTypes.LOADING, LOADING);
    yield takeEvery(mainTypes.CHANGE_LANGUAGE, changeLanguage)
    yield takeEvery(mainTypes.CHECK_LANGUAGE, checkLanguage)
    yield takeEvery(mainTypes.CallServer, API_spCallServer)
    yield takeEvery(mainTypes.EncryptString,EncryptString);
    yield takeEvery(mainTypes.API_spCallPostFile, API_spCallPostFile);
    yield takeEvery(mainTypes.API_spCallPostImageBase64, API_spCallPostImageBase64);
    yield takeEvery(mainTypes.CallExportExcel, API_spCallExportExcel);
    yield takeEvery(mainTypes.CallServerNoLoading, API_spCallServerNoLoading)
}