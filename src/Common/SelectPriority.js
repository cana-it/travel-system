import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
const SelectPriorityComp = ({
    onSelected = () => { },
    IsLoad = -1,
    IsData = '0'
}) => {

    useEffect(() => {
        
        if(data.length > 0)
        {
            setValueS(data.filter(p => p.value === IsData));
            return;
        }
    }, [IsData]);

    const [data, setData] = useState([])
    const [valueS,setValueS] = useState(IsData)
    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }   

    
    const dispatch = useDispatch();
   
    const CPN_spGetData = async () => {

        const list = [
            {value:"Do now",label:"Do now"},
            {value:"High",label:"High"},
            {value:"Low",label:"Low"},
            {value:"Medium",label:"Medium"},
            {value:"BUG",label:"BUG"},
            {value:"Report",label:"Report"}
        ]
        await setData(list)
    }

    useEffect(() => {
        CPN_spGetData()
    }, [IsLoad]);

    return (
        <Select className="SelectMeno"
            value={valueS}
            onChange={onSelecteItem}
            options={data}
        />
    )
}


export const SelectPriority = React.memo(SelectPriorityComp)