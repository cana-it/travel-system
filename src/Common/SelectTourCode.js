import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { useLayoutEffect } from 'react';
const SelectTourCodeComp = ({
    onSelected = () => { },
    TourCodeId = 0,
    className = 'SelectMeno',
}) => {

    const [data, setData] = useState([])
    const [valueS,setValueS] = useState()
    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }   

    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");

    const Trl_spTourCode_List = async (bookingId) => {
        try {
            const pr = {

                Creater: +Creater,

            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spTourCode_List"
            }
            const res = await mainAction.API_spCallServer(params, dispatch);
            const FirstData = {value:0,label:"Vui lòng chọn"}
            let dataSelect = [];
            dataSelect.push(FirstData);
            setValueS(FirstData);
            res.forEach((element,index) => {
                dataSelect.push({value:element.TourCodeId, label:element.TourCodeName});
            });
            if (TourCodeId !== 0 && TourCodeId !== -1) {
                let ar = res.find(a => a.TourCodeId === TourCodeId);
               ar ? setValueS({ value: ar.TourCodeId, label: ar.TourCodeName }): setValueS({ value: 0, label: 'Vui lòng chọn' })
            } // Active
            
            setData(dataSelect)
            // setDataBookingStatus(res)
        } catch (error) {
            ;
        }
    }

    
    useLayoutEffect(() => {
        Trl_spTourCode_List()
    }, []);
 
    useEffect(() => {
        if (TourCodeId !== 0 && TourCodeId !== -1) {
            data.length === 0 && Trl_spTourCode_List()
            let ar = data.find(a => a.value === TourCodeId)
            ar ? setValueS(ar) : setValueS({ value: 0, label: 'Vui lòng chọn' })
        }
        else{
            setValueS({ value: 0, label: 'Vui lòng chọn' })
        }
    }, [TourCodeId]);



    return (
        <Select className={className}
            value={valueS}
            onChange={onSelecteItem}
            options={data}
        />
    )
}


export const SelectTourCode = React.memo(SelectTourCodeComp)