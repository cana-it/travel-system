import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { useLayoutEffect } from 'react';

const SelectServiceSaleStatusComp = ({
    onSelected = () => { },
    items = 0,
    onLoad=0,
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
            { value: 0, label: 'Tất cả trạng thái' },
            { value: 1, label: "Ngày dự kiến" },
            { value: 2, label: "Chưa confirm" },
            { value: 3, label: "Đã cọc booking" },
            { value: 4, label: "Ngày đã cancel" }
        ]
        if (items !== 0) {
            let ar = dataSelect.find(a => a.value === items);
            ar ? setValueS(ar) : setValueS({ value: 0, label: 'Select Please' })
        } // Active
        setData(dataSelect);
    }

    useLayoutEffect(() => {
        LoadData()
    }, []);

    useEffect(() => {
        if (items != 0) {
            setValueS(data.filter(a => a.value === items))
            data.filter(a => a.value === items)
        }
        else {
            setValueS({ value: 0, label: 'Select Please' })
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

export const SelectServiceSaleStatus = React.memo(SelectServiceSaleStatusComp)