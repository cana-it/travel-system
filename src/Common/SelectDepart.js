import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { mainAction } from '../Redux/Actions';
const SelectDepartComp = ({
    onSelected = () => { },
    onPostId = { value: 0, label: 'Chọn' },
    PostId = -1
}) => {

    const [data, setData] = useState([])
    const [valueS,setValueS] = useState(onPostId)
    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }   
    
    const dispatch = useDispatch();
    const PostID = PostId;
    const CPN_spDepartment_ByPostId = async () => {

        if (PostID === -1) return
        
        const params = {
            Json: JSON.stringify({PostId: PostID}),
            func: "CPN_spDepartment_ByPostId",
        }
       
        const list = await mainAction.API_spCallServer(params, dispatch);
        const FirstData = {value:0,label:"All"}
        let dataSelect = [];
        dataSelect.push(FirstData);
        setValueS(FirstData);
        list.forEach((element,index) => {
            dataSelect.push({value:element.DeparmentID,label:element.DeparmentName});
        });
        setData(dataSelect)
    }

    useEffect(() => {
        CPN_spDepartment_ByPostId()
    }, [PostId]);

    return (
        <Select className="SelectMeno"
            value={valueS}
            onChange={onSelecteItem}
            options={data}
        />
    )
}


export const SelectDepart = React.memo(SelectDepartComp)