import {getData} from '../Utils';
import { LANE,VN } from "../Enum";
export const currentLang =  () => {
    const cur = getData(LANE);
    return cur;
}