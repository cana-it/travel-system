import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
const SelectStatusV2Comp = ({
    onSelected = () => { },
    IsLoad = -1,
    statusValue
}) => {

    const [data, setData] = useState([])
    const [valueS,setValueS] = useState(statusValue)
    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }   

    useEffect(() => {
        setValueS(statusValue)
    },[])
    
    const dispatch = useDispatch();
   
    const CPN_spGetData = async () => {

        const list = [
            {value:"-1",label:"Chọn trạng thái"},
            {value:1,label:"Trong tiến trình"},
            {value:2,label:"Hoàn thành"},
            {value:4,label:"Quá hạn"},
            {value:5,label:"Báo cáo"},
            
        ]
        await setData(list)
    }

    useEffect(() => {
        CPN_spGetData()
    }, [IsLoad]);

    return (
        <Select className="SelectMeno "
            value={valueS}
            onChange={onSelecteItem}
            options={data}
        />
    )
}


export const SelectStatusV2 = React.memo(SelectStatusV2Comp)