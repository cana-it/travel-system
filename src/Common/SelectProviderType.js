import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { mainAction } from '../Redux/Actions';
const SelectProviderTypeComp = ({
    onSelected = () => { },
    onProviderTypeId = 0,
    ProviderTypeId = 0
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
    const ProviderTypeID = ProviderTypeId;
    const Trl_spProviderType_List = async () => {

        const params = {
            Json: JSON.stringify(
                {
                    ProviderTypeId: ProviderTypeId,
                    ProviderTypeSearch: '',
                    Creater: Creater,
                    CreateName: CreateName
                }
                ),
            func: "Trl_spProviderType_List"
        }
       
        const list = await mainAction.API_spCallServer(params, dispatch);
        const FirstData = {value:0,label:"Chọn loại NCC"}
        let dataSelect = [];
        dataSelect.push(FirstData);
        setValueS(FirstData);
        list.forEach((element,index) => {
            dataSelect.push({value:element.ProviderTypeId,label:element.ProviderTypeName});
        });
        if (onProviderTypeId !== 0 && onProviderTypeId !== -1) {
            let ar = list.find(a => a.ProviderTypeId === onProviderTypeId);
           ar ? setValueS({ value: ar.ProviderTypeId, label: ar.ProviderTypeName }): setValueS({ value: 0, label: 'Chọn loại NCC' })
        } // Active
        
        setData(dataSelect)
    }
    useEffect(() => {
        if (onProviderTypeId !== 0 && onProviderTypeId !== -1) {
            let ar = data.find(a => a.value === onProviderTypeId)
            ar ? setValueS(ar) : setValueS({ value: 0, label: 'Chọn loại NCC' })
        }
    }, [onProviderTypeId]);

    useEffect(() => {
        Trl_spProviderType_List()
    }, [ProviderTypeID]);

    return (
        <Select className="SelectMeno"
            value={valueS}
            onChange={onSelecteItem}
            options={data}
        />
    )
}


export const SelectProviderType = React.memo(SelectProviderTypeComp)