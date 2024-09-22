import React, { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useDispatch, useSelector } from "react-redux";
import { mainAction } from "../Redux/Actions";
const animatedComponents = makeAnimated();
const SelectOfficerTaskComp = ({
  onSelected = () => {},
  onOfficer = {},
  DepartId = -1,
  IsFirst = { value: 0, label: "All user" },
  IsActive = "-0",
  IsClass = 0,
  isMulti = false,
}) => {
  const [data, setData] = useState([]);
  const [valueS, setValueS] = useState();
  const onSelecteItem = (item) => {
    ;
    //isMulti ? onSelected(item) : onSelected(item[0]);
    onSelected(item);
    setValueS(item);
  };

  const dispatch = useDispatch();
  let DepartID = DepartId;

  const CPN_spOfficer_ByDepartId = async () => {
    // check load data all or follow DepartId
    if (DepartId === -1) return;

    const params = {
      Json: JSON.stringify({
        BranchId: 0,
        DepartmentId: 0,
        StaffId: 0,
      }),
      func: "Trl_spStaff_Select",
    };

    const list = await mainAction.API_spCallServer(params, dispatch);
    
    const FirstData = IsFirst;
    let dataSelect = [];
    dataSelect.push(FirstData);
    setValueS(FirstData);
    list.forEach((element, index) => {
      // dataSelect.push({ value: element.OfficerID, label: element.OfficerName });
      dataSelect.push({
        value: element.StaffId,
        label: element.StaffName,
        ...element,
      });
    });
    setData(dataSelect);
  };

  useEffect(() => {
    CPN_spOfficer_ByDepartId();
  }, [DepartId]);

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
      className={IsClass === 0 ? "SelectMeno z-index-1k" : "SelectMeno"}
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

export const SelectOfficerTask = SelectOfficerTaskComp;
