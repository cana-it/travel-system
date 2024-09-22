import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { useLayoutEffect } from 'react';
const SelectInvoiceStyleComp = ({
    onSelected = () => { },
    invoiceStyleId = 0,
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

    const Trl_spInvoiceStyle_List = async (bookingId) => {
        try {
            const pr = {

                BookingId: +bookingId,
                CreateName: +Creater,

            }
            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spInvoiceStyle_List"
            }
            const res = await mainAction.API_spCallServer(params, dispatch);
            const FirstData = {value:0,label:"Vui lòng chọn"}
            let dataSelect = [];
            dataSelect.push(FirstData);
            setValueS(FirstData);
            res.forEach((element,index) => {
                dataSelect.push({value:element.StyleId, label:element.StyleName});
            });
            if (invoiceStyleId !== 0 && invoiceStyleId !== -1) {
                let ar = res.find(a => a.StyleId === invoiceStyleId);
               ar ? setValueS({ value: ar.StyleId, label: ar.StyleName }): setValueS({ value: 0, label: 'Vui lòng chọn' })
            } // Active
            
            setData(dataSelect)
            // setDataBookingStatus(res)
        } catch (error) {
            ;
        }
    }

    
    useLayoutEffect(() => {
        Trl_spInvoiceStyle_List()
    }, []);
 
    useEffect(() => {
        if (invoiceStyleId !== 0 && invoiceStyleId !== -1) {
            data.length === 0 && Trl_spInvoiceStyle_List()
            let ar = data.find(a => a.value === invoiceStyleId)
            ar ? setValueS(ar) : setValueS({ value: 0, label: 'Vui lòng chọn' })
        }
        else{
            setValueS({ value: 0, label: 'Vui lòng chọn' })
        }
    }, [invoiceStyleId]);



    return (
        <Select className={className}
            value={valueS}
            onChange={onSelecteItem}
            options={data}
        />
    )
}


export const SelectInvoiceStyle = React.memo(SelectInvoiceStyleComp)