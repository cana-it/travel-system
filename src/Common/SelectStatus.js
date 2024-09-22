import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
const SelectStatusComp = ({
    onSelected = () => { },
    IsLoad = -1
}) => {

    const [data, setData] = useState([])
    const [valueS,setValueS] = useState({value:"-1",label:"Select Status"})
    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }   
    
    const dispatch = useDispatch();
   
    const CPN_spGetData = async () => {

        const list = [
            {value:"-1",label:"Select Status"},
            {value:"In progress",label:"In progress"},
            {value:"Test required",label:"Test required"},
            {value:"Bug Function",label:"Bug Function"},
            {value:"Done",label:"Done"},
            {value:"Report Daily",label:"Report Daily"},
            
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


export const SelectStatus = React.memo(SelectStatusComp)