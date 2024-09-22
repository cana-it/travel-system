import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { useLayoutEffect } from 'react';
const SelectProviderComp = ({
    onSelected = () => { },
    onProviderId = 0,
    ProviderId = -1,
    className = 'SelectMeno',
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
    const ProviderID = ProviderId;
    const Trl_spProvider_List = async () => {

        const params = {
            Json: JSON.stringify(
                {
                    ProviderId: 0,
                    ProviderSearch: '',
                    ProviderTypeId:ProviderTypeId,
                    Creater: Creater,
                    CreateName: CreateName
                }
                ),
            func: "Trl_spProvider_List"
        }
       
        const list = await mainAction.API_spCallServer(params, dispatch);
        const FirstData = {value:0,label:"Chọn NCC"}
        let dataSelect = [];
        dataSelect.push(FirstData);
        setValueS(FirstData);
        list.forEach((element,index) => {
            dataSelect.push({value:element.ProviderId,label:element.ProviderName});
        });
        if (onProviderId !== 0 && onProviderId !== -1) {
            let ar = list.find(a => a.ProviderId === onProviderId);
           ar ? setValueS({ value: ar.ProviderId, label: ar.ProviderName }): setValueS({ value: 0, label: 'Chọn NCC' })
        } // Active
        
        setData(dataSelect)
    }
    useLayoutEffect(() => {
        Trl_spProvider_List()
    }, []);
 
    useEffect(() => {
        if (onProviderId !== 0 && onProviderId !== -1) {
            data.length === 0 && Trl_spProvider_List()
            let ar = data.find(a => a.value === onProviderId)
            ar ? setValueS(ar) : setValueS({ value: 0, label: 'Chọn NCC' })
        }
        else{
            setValueS({ value: 0, label: 'Chọn NCC' })
        }
    }, [onProviderId]);



    return (
        <Select className={className}
            value={valueS}
            onChange={onSelecteItem}
            options={data}
        />
    )
}


export const SelectProvider = React.memo(SelectProviderComp)