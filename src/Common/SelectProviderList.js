import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { mainAction } from '../Redux/Actions';

const SelectProviderList_Comp = ({
    onSelected = () => { },
    items = {},
    className = 'SelectMeno SelectMenoo'
}) => {

    const [data, setData] = useState([])
    const [valueS, setValueS] = useState()

    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }

    const dispatch = useDispatch();

    const Trl_spProviderType_List = async () => {
        const params = {
            Json: JSON.stringify({LocationId:0}),
            func: "Trl_spProviderType_List"
        }
        const list = await mainAction.API_spCallServer(params, dispatch);
        const FirstData = {value:0 ,label: 'Vui lòng chọn' }
        let dataSelect = [];
        setValueS(FirstData);
        list.forEach((element,index) => {
            dataSelect.push({value:element.ProviderTypeId,label:element.ProviderName});
        });
        setData(dataSelect)
        onSelected(FirstData)
    }

    useEffect(() => {
        Trl_spProviderType_List();
    }, []);

    useEffect(() => {
        if (items != 0) {
            setValueS(data.filter(a => a.value === items))
        }else{
            setValueS({ value: 0, label: 'Vui lòng chọn'});
        }
    }, [items]);

    return (

        <Select className={className}
            value={valueS}
            onChange={onSelecteItem}
            options={data}
        />
    )

}

export const SelectProviderList = React.memo(SelectProviderList_Comp)