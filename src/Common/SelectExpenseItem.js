import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { mainAction } from '../Redux/Actions';
import { useLayoutEffect } from 'react';
const SelectExpenseItemComp = ({
    onSelected = () => { },
    ExpenseId = 0,
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
   
    const Trl_spExpenseItems_List = async () => {
        try {

            const pr = {
                TextSearch: '',
                UserId: Creater,
                Type: 0
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "Trl_spExpenseItems_List"
            }

            const res = await mainAction.API_spCallServer(params, dispatch);
            const FirstData = {value:0,label:"Vui lòng chọn"}
            let dataSelect = [];
            dataSelect.push(FirstData);
            setValueS(FirstData);
            res.forEach((element,index) => {
                dataSelect.push({value:element.ExpenseId, label:element.ExpenseName});
            });
            if (ExpenseId !== 0 && ExpenseId !== -1) {
                let ar = res.find(a => a.ExpenseId === ExpenseId);
               ar ? setValueS({ value: ar.ExpenseId, label: ar.ExpenseName }): setValueS({ value: 0, label: 'Vui lòng chọn' })
            } // Active
            
            setData(dataSelect)
            // setDataBookingStatus(res)
        } catch (error) {
            
        }
    }

 

    
    useLayoutEffect(() => {
        Trl_spExpenseItems_List()
    }, []);
 
    useEffect(() => {
        if (ExpenseId !== 0 && ExpenseId !== -1) {
            data.length === 0 && Trl_spExpenseItems_List()
            let ar = data.find(a => a.value === ExpenseId)
            ar ? setValueS(ar) : setValueS({ value: 0, label: 'Vui lòng chọn' })
        }
        else{
            setValueS({ value: 0, label: 'Vui lòng chọn' })
        }
    }, [ExpenseId]);



    return (
        <Select className={className}
            value={valueS}
            onChange={onSelecteItem}
            options={data}
        />
    )
}


export const SelectExpenseItem = React.memo(SelectExpenseItemComp)