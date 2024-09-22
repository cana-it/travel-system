import React, { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useDispatch, useSelector } from "react-redux";
import { mainAction } from "../Redux/Actions";
const animatedComponents = makeAnimated();
const SelectDepartmentMultiComp = ({
  onSelected = () => {},
  onDepartmentId = 0,
  BranchId = -1,
  IsActive = "-0",
  IsClass = 0,
  isMulti = false,
  className = "SelectMeno",
}) => {
  const [data, setData] = useState([]);
  const [valueS, setValueS] = useState();
  const onSelecteItem = (item) => {
    onSelected(item);
    setValueS(item);
  };

  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const BranchID = BranchId;
  const Trl_spDepartment_List = async () => {
    const params = {
      Json: JSON.stringify({
        Creater: Creater,
        BranchId: BranchID,
        DepartmentId: 0,
        DepartmentSearch: "",
      }),
      func: "Trl_spDepartment_List",
    };

    const list = await mainAction.API_spCallServer(params, dispatch);
    const FirstData = { value: 0, label: "Chọn P.Ban" };
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
        : setValueS({ value: 0, label: "Chọn P.Ban" });
    } // Active

    setData(dataSelect);
  };
  useEffect(() => {
    if (onDepartmentId !== 0 && onDepartmentId !== -1) {
      let ar = data.find((a) => a.value === onDepartmentId);
      ar ? setValueS(ar) : setValueS({ value: 0, label: "Chọn P.Ban" });
    }
  }, [onDepartmentId]);

  useEffect(() => {
    Trl_spDepartment_List();
  }, [BranchID]);

  useEffect(() => {
    if (data.length > 0 && IsActive !== "-0") {
      if (isMulti && IsActive.toString().includes(";")) {
        let dataActive = [];
        IsActive.spit(";").forEach((item, index) => {
          dataActive.push(data.filter((p) => p.value === item)[0]);
        });
        setValueS(dataActive);
      } else {
        setValueS(data.filter((p) => p.value === IsActive)[0]);
      }
      return;
    }
  }, [IsActive]);

  return (
    <Select
      className={
        IsClass === 0 ? `${className} z-index-1k multi` : `${className} multi`
      }
      closeMenuOnSelect={false}
      components={animatedComponents}
      defaultValue={valueS}
      value={valueS}
      onChange={onSelecteItem}
      options={data}
      isMulti={isMulti}
    />
  );
};

export const SelectDepartmentMulti = SelectDepartmentMultiComp;
