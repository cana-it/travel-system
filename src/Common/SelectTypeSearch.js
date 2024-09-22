import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { useLayoutEffect } from 'react';
import { FNC_UPDATE_LIST_STATUS } from '../Redux/Actions/CustomAction';

const SelectTypeSearchComp = ({
    onSelected = () => { },
    items = 1,
    className = '',
}) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([])
    const [valueS, setValueS] = useState({ value: 0, label: 'Select Please' })
    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }

    const LoadData = async () => {
        const dataSelect = [
            { value: 1, label: "Theo tháng" },
           /*  { value: 2, label: "Theo khoảng thời gian" }, */
            { value: 3, label: "Theo thị trường" },
        ];
        setData(dataSelect);
        dispatch(FNC_UPDATE_LIST_STATUS(dataSelect));
        let ar = dataSelect.find(a => a.value === items);
        ar ? setValueS(ar) : setValueS({ value: 1, label: 'Theo tháng' })
    }

    useLayoutEffect(() => {
        LoadData()
    }, []);

    useEffect(() => {
        if (items != 1) {
            setValueS(data.filter(a => a.value === items))
            data.filter(a => a.value === items)
        }
        else {
            setValueS({ value: 1, label: 'Theo tháng' })
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

export const SelectTypeSearch = React.memo(SelectTypeSearchComp)