import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { mainAction } from '../Redux/Actions';
const SelectTypeApproveComp = ({
    onSelected = () => { },
    onTypeApproveId = 0,
    TypeApproveId = -1
}) => {
    const [data, setData] = useState([])
    const [valueS, setValueS] = useState()
    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }

    const dispatch = useDispatch();
    const Creater = localStorage.getItem("CreateBy");
    const CreateName = localStorage.getItem("CreateName");
    const TypeApproveID = TypeApproveId;
    const _onTypeApproveID = onTypeApproveId;
    const Trl_spApproveType_List = async () => {

        const params = {
            Json: JSON.stringify({ Keysearch:"",
            TypeApproveId: 0 }),
            func: "Trl_spApproveType_List"
        }

        const list = await mainAction.API_spCallServer(params, dispatch);
        const FirstData = { value: 0, label: "Chọn loại phê duyệt" }
        let dataSelect = [],
            IsActive = 0;;
        dataSelect.push(FirstData);
        //setValueS(FirstData);
        list.forEach((element, index) => {
            dataSelect.push({ value: element.TypeApproveId, label: element.TypeApproveName });
            if (element.TypeApproveId === _onTypeApproveID) {
                IsActive = 1;
            }

        });

        setData(dataSelect)
        
        if (IsActive === 1) {
            
            let ListActive = list.filter(a => a.TypeApproveId === _onTypeApproveID)[0];
            setValueS({
                value: ListActive.TypeApproveId, label: ListActive.TypeApproveName
            });

        }
    }

    useEffect(() => {
        Trl_spApproveType_List()
    }, [TypeApproveID]);

    useEffect(() => {
        
        if (_onTypeApproveID !== 0 && _onTypeApproveID !== -1) {
            let ar = data.find(a => a.value === _onTypeApproveID);
            ar ? setValueS(ar) : setValueS({ value: 0, label: 'Chọn loại phê duyệt' })
        }
    }, [_onTypeApproveID]);

    return (
        <Select className="SelectMeno"
            value={valueS}
            onChange={onSelecteItem}
            options={data}
        />
    )
}


export const SelectTypeApprove = React.memo(SelectTypeApproveComp)