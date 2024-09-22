import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { useLayoutEffect } from 'react';
const SelectStatusVisaComp = ({
    onSelected = () => { },
    statusVisaId = 0,
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

    const Trl_spStatusVisa_List = async (bookingId) => {
        try {
            const pr = {

                BookingId: +bookingId,
                CreateName: +Creater,

            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spStatusVisa_List"
            }
            const res = await mainAction.API_spCallServer(params, dispatch);
            const FirstData = {value:0,label:"Vui lòng chọn"}
            let dataSelect = [];
            dataSelect.push(FirstData);
            setValueS(FirstData);
            res.forEach((element,index) => {
                dataSelect.push({value:element.StatusVisaId, label:element.StatusVisaName});
            });
            if (statusVisaId !== 0 && statusVisaId !== -1) {
                let ar = res.find(a => a.StatusVisaId === statusVisaId);
               ar ? setValueS({ value: ar.StatusVisaId, label: ar.StatusVisaName }): setValueS({ value: 0, label: 'Vui lòng chọn' })
            } // Active
            
            setData(dataSelect)
            // setDataBookingStatus(res)
        } catch (error) {
            ;
        }
    }

    
    useLayoutEffect(() => {
        Trl_spStatusVisa_List()
    }, []);
 
    useEffect(() => {
        if (statusVisaId !== 0 && statusVisaId !== -1) {
            data.length === 0 && Trl_spStatusVisa_List()
            let ar = data.find(a => a.value === statusVisaId)
            ar ? setValueS(ar) : setValueS({ value: 0, label: 'Vui lòng chọn' })
        }
        else{
            setValueS({ value: 0, label: 'Vui lòng chọn' })
        }
    }, [statusVisaId]);



    return (
        <Select className={className}
            value={valueS}
            onChange={onSelecteItem}
            options={data}
        />
    )
}


export const SelectStatusVisa = React.memo(SelectStatusVisaComp)