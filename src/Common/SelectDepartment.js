import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { mainAction } from "../Redux/Actions";
const SelectDepartmentComp = ({
  onSelected = () => {},
  onDepartmentId = 0,
  BranchId = -1,
  className = "SelectMeno",
  title = "Chọn P.Ban",
}) => {
  const [data, setData] = useState([]);
  const [valueS, setValueS] = useState();
  const onSelecteItem = (item) => {
    onSelected(item);
    setValueS(item);
  };

  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const BranchID = BranchId;
  const Trl_spDepartment_List = async () => {
    const params = {
      Json: JSON.stringify({
        Creater: Creater,
        BranchId: BranchID,
        DepartmentId: 0,
        DepartmentSearch: "",
      }),
      func: "Trl_spDepartment_Select",
    };

    const list = await mainAction.API_spCallServer(params, dispatch);
    const FirstData = { value: 0, label: title };
    let dataSelect = [];
    dataSelect.push(FirstData);
    setValueS(FirstData);
    list.forEach((element, index) => {
      dataSelect.push({
        value: element.DepartmentId,
        label: element.DepartmentName,
      });
    });
    if (onDepartmentId !== 0 && onDepartmentId !== -1) {
      let ar = list.find((a) => a.DepartmentId === onDepartmentId);
      ar
        ? setValueS({ value: ar.DepartmentId, label: ar.DepartmentName })
        : setValueS({ value: 0, label: title });
    } // Active

    setData(dataSelect);
  };
  useEffect(() => {
    if (onDepartmentId !== 0 && onDepartmentId !== -1) {
      let ar = data.find((a) => a.value === onDepartmentId);
      ar ? setValueS(ar) : setValueS({ value: 0, label: title });
    }
  }, [onDepartmentId]);

  useEffect(() => {
    Trl_spDepartment_List();
  }, [BranchID]);

  return (
    <Select
      className={className}
      value={valueS}
      onChange={onSelecteItem}
      options={data}
    />
  );
};

export const SelectDepartment = React.memo(SelectDepartmentComp);
