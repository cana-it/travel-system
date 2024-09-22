import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { mainAction } from '../Redux/Actions';
const SelectContractTypeComp = ({
    onSelected = () => { },
    onContractTypeId = 0,
    ContractTypeId = -1
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
    const _ContractTypeId = ContractTypeId;
    const _onContractTypeId = onContractTypeId;
    const Trl_spStaff_ContractType_List = async () => {

        const params = {
            Json: JSON.stringify({ 
                Creater: Creater,
                 ContractTypeId: _onContractTypeId !==0 ? -1 : _ContractTypeId 
                }),
            func: "Trl_spStaff_ContractType_List"
        }

        const list = await mainAction.API_spCallServer(params, dispatch);
        const FirstData = { value: 0, label: "Chọn Loại hợp đồng" }
        let dataSelect = [],
            IsActive = 0;;
        dataSelect.push(FirstData);
        list.forEach((element, index) => {
            dataSelect.push({ value: element.ContractTypeId, label: element.ContractTypeName });
            if (element.ContractTypeId === _onContractTypeId) {
                IsActive = 1;
            }

        });

        setData(dataSelect)
        
        if (IsActive === 1) {
            
            let ListActive = list.filter(a => a.ContractTypeId === _onContractTypeId)[0];
            setValueS({
                value: ListActive.ContractTypeId, label: ListActive.ContractTypeName
            });

        }
    }

    useEffect(() => {
        Trl_spStaff_ContractType_List()
    }, [ContractTypeId]);

    useEffect(() => {
        
        if (_onContractTypeId !== 0 && _onContractTypeId !== -1) {
            let ar = data.find(a => a.value === _onContractTypeId);
            ar ? setValueS(ar) : setValueS({ value: 0, label: 'Chọn C.Nhánh' })
        }
    }, [_onContractTypeId]);

    return (
        <Select className="SelectMeno"
            value={valueS}
            onChange={onSelecteItem}
            options={data}
        />
    )
}


export const SelectContractType = React.memo(SelectContractTypeComp)