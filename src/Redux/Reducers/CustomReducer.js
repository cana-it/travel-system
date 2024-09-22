import { CustomType } from '../Actions'

/* save data from api */
const initialState = {
    TypeSearch: 1,
    Service: 0,
    Month: "",
    MonthFrom: "",
    MonthTo: "",
    Status: 0,
    ListServices: [],
    IsLog: false,
    ListStatus: [],
    Calendars: [],
    CalendarService: [],
    Data: []
};

export default function (state = initialState, action = {}) {
    switch (action.type) {
        case CustomType.UPDATE_TYPE_SEARCH:
            return {
                ...state,
                TypeSearch: action.payload,
                IsLog: true
            }
        case CustomType.UPDATE_SERVICE_SEARCH:
            return {
                ...state,
                Service: action.payload,
                IsLog: true
            };
        case CustomType.UPDATE_MONTH_SEARCH:
            return {
                ...state,
                Month: action.payload,
                IsLog: true
            };
        case CustomType.UPDATE_MONTH_FROM_SEARCH:
            return {
                ...state,
                MonthFrom: action.payload,
                IsLog: true
            };
        case CustomType.UPDATE_MONTH_TO_SEARCH:
            return {
                ...state,
                MonthTo: action.payload,
                IsLog: true
            };
        case CustomType.UPDATE_LIST_SERVICES:
            return {
                ...state,
                ListServices: action.payload,
                IsLog: true
            }
        case CustomType.UPDATE_LIST_STATUS:
            return {
                ...state,
                ListStatus: action.payload,
                IsLog: true
            }
        case CustomType.UPDATE_IS_LOG:
            return {
                ...state,
                IsLog: action.payload
            }
        case CustomType.UPDATE_CALENDAR:
            return {
                ...state,
                Calendars: action.payload
            }
        case CustomType.UPDATE_CALENDAR_SERVICE:
            return {
                ...state,
                CalendarService: action.payload
            }
        case CustomType.UPDATE_DATA:
            return {
                ...state,
                Data: action.payload
            }
        default:
            return state;
    }
}
