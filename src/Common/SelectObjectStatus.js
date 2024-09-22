import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { mainAction } from '../Redux/Actions';
const SelectObjectStatusComp = ({
    onSelected = () => { },
    onObjectId = 0,
    ObjectId = -1,
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
    const ObjectID = ObjectId;
    const Trl_spObjectStatus_List = async () => {

        const params = {
            Json: JSON.stringify(
                {
                    Creater: Creater,                }
                ),
            func: "Trl_spObjectStatus_List"
        }
       
        const list = await mainAction.API_spCallServer(params, dispatch);
        const FirstData = {value:0,label:"Chọn đối tượng"}
        let dataSelect = [];
        dataSelect.push(FirstData);
        setValueS(FirstData);
        list.forEach((element,index) => {
            dataSelect.push({value:element.ObjectId,label:element.ObjectName});
        });
        if (onObjectId !== 0 && onObjectId !== -1) {
            let ar = list.find(a => a.ObjectId === onObjectId);
           ar ? setValueS({ value: ar.ObjectId, label: ar.ObjectName }): setValueS({ value: 0, label: 'Chọn đối tượng' })
        } // Active
        
        setData(dataSelect)
    }
    useEffect(() => {
        if (onObjectId !== 0 && onObjectId !== -1) {
            let ar = data.find(a => a.value === onObjectId)
            ar ? setValueS(ar) : setValueS({ value: 0, label: 'Chọn đối tượng' })
        }
    }, [onObjectId]);

    useEffect(() => {
        Trl_spObjectStatus_List()
    }, [ObjectID]);

    return (
        <Select className={className}
            value={valueS}
            onChange={onSelecteItem}
            options={data}
        />
    )
}


export const SelectObjectStatus = React.memo(SelectObjectStatusComp)