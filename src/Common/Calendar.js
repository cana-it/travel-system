import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Img } from 'react-image'
import { mainAction } from '../Redux/Actions'
import { DataTable } from './DataTable'
const CalendarTemp = ({
    isVisible = false,
    _currentDate = "",
}) => {
    const [listDay, setListDay] = useState([]);
    useEffect(() => {
        if (_currentDate !== "") {
            
            let _cDate = new Date(_currentDate);
            let _cYear = _cDate.getFullYear();
            let _cMonth = _cDate.getMonth();
            let _totalDateOfMonth = (new Date(_cYear, _cMonth + 1, 0).getDate());
            let _col = 1;
            let arrTr = [];
            let arrTd = [];
            for (let i = 1; i <= _totalDateOfMonth; i++) {
                if (_col === 1)
                    arrTd = [];
                
                let tmpDate = new Date(_cYear, _cMonth, i);
                let _indexDate = tmpDate.getDay();
                if (i === 1) {
                    for (let j = 0; j < _indexDate; j++) {
                        arrTd.push({
                            Day: ""
                        })
                        _col = j + 1;
                    }
                    arrTd.push({
                        Day: i
                    })
                    _col++;

                }
                else {
                    arrTd.push({
                        Day: i
                    })
                }

                if (_col === 7 || i === _totalDateOfMonth) {
                    arrTr.push(arrTd);
                    if (i === _totalDateOfMonth && _col < 7) {
                        
                        for (let h = _col; h < 7; h++) {
                            arrTd.push({
                                Day: ""
                            })
                            _col++;
                        }
                    }
                    _col = 0;
                }
                _col++;
            }
            setListDay(arrTr);
        }
    }, [_currentDate]);


    if (isVisible) {
        return (
            <>
                <table width="100%" class="table table-bordered">
                    <thead>
                        <tr class="text-center font-weight-bold">
                            <td>CN</td>
                            <td>T2</td>
                            <td>T3</td>
                            <td>T4</td>
                            <td>T5</td>
                            <td>T6</td>
                            <td>T7</td>
                        </tr>
                    </thead>
                    <tbody>
                        {listDay.length > 0 && listDay.map((rows, index) => {
                            return (<tr key={"rows" + index}>{
                                rows.map((e, k) => {
                                    return (<td key={"column" + k} style={{ padding: "5px 10px", backgroundColor: "#fff" }}><div className="text-right block">{e.Day}</div></td>)
                                })
                            }</tr>)
                        })}
                    </tbody>
                </table>
            </>

        )
    }
    return (<div></div>)
}

export const Calendar = React.memo(CalendarTemp)