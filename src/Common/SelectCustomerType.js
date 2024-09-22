import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { mainAction } from '../Redux/Actions';
const SelectCustomerTypeComp = ({
    onSelected = () => { },
    onCustomerTypeId = 0,
    CustomerTypeId = -1
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
    const CustomerTypeID = CustomerTypeId;
    const Trl_spCustomerType_List = async () => {

        const params = {
            Json: JSON.stringify({Creater: Creater,CreateName:""}),
            func: "Trl_spCustomerType_List"
        }
       
        const list = await mainAction.API_spCallServer(params, dispatch);
        const FirstData = {value:0,label:"Chọn loại khách"}
        let dataSelect = [];
        dataSelect.push(FirstData);
        setValueS(FirstData);
        list.forEach((element,index) => {
            dataSelect.push({value:element.CustomerTypeId,label:element.CustomerTypeName});
        });
        if (onCustomerTypeId !== 0 && onCustomerTypeId !== -1) {
            let ar = list.find(a => a.CustomerTypeId === onCustomerTypeId);
           ar ? setValueS({ value: ar.CustomerTypeId, label: ar.CustomerTypeName }): setValueS({ value: 0, label: 'Chọn loại khách' })
        } // Active
        
        setData(dataSelect)
    }
    useEffect(() => {
        if (onCustomerTypeId !== 0 && onCustomerTypeId !== -1) {
            let ar = data.find(a => a.value === onCustomerTypeId)
            ar ? setValueS(ar) : setValueS({ value: 0, label: 'Chọn loại khách' })
        }
    }, [onCustomerTypeId]);

    useEffect(() => {
        Trl_spCustomerType_List()
    }, [CustomerTypeID]);

    return (
        <Select className="SelectMeno"
            value={valueS}
            onChange={onSelecteItem}
            options={data}
        />
    )
}


export const SelectCustomerType = React.memo(SelectCustomerTypeComp)