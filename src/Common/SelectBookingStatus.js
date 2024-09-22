import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { mainAction } from '../Redux/Actions';
const SelectBookingStatusComp = ({
    onSelected = () => { },
    onBookingStatusId = 0,
    BookingStatusId = -1
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
    const BookingStatusID = BookingStatusId;
    const Trl_spBookingStatus_List = async () => {

        const params = {
            Json: JSON.stringify(
                {
                    Creater: Creater,   
                    CreateName:CreateName 
                }),
            func: "Trl_spBookingStatus_List"
        }
       
        const list = await mainAction.API_spCallServer(params, dispatch);
        const FirstData = {value:0,label:"Chọn menu"}
        let dataSelect = [];
        dataSelect.push(FirstData);
        setValueS(FirstData);
        list.forEach((element,index) => {
            dataSelect.push({value:element.BookingStatusId,label:element.StatusName});
        });
        if (onBookingStatusId !== 0 && onBookingStatusId !== -1) {
            let ar = list.find(a => a.BookingStatusId === onBookingStatusId);
           ar ? setValueS({ value: ar.BookingStatusId, label: ar.StatusName }): setValueS({ value: 0, label: 'Chọn menu' })
        } // Active
        
        setData(dataSelect)
    }
    useEffect(() => {
        if (onBookingStatusId !== 0 && onBookingStatusId !== -1) {
            let ar = data.find(a => a.value === onBookingStatusId)
            ar ? setValueS(ar) : setValueS({ value: 0, label: 'Chọn menu' })
        }
    }, [onBookingStatusId]);

    useEffect(() => {
        Trl_spBookingStatus_List()
    }, [BookingStatusID]);

    return (
        <Select className="SelectMeno"
            value={valueS}
            onChange={onSelecteItem}
            options={data}
        />
    )
}


export const SelectBookingStatus = React.memo(SelectBookingStatusComp)