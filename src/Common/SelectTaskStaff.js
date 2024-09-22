import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { mainAction } from "../Redux/Actions";
const SelectTaskStaffComp = ({
  onSelected = () => {},
  onStaffId = 0,
  BranchId = -1,
  DepartmentId = -1,
  StaffId = 0,
  StaffSearch = "",
  className = "SelectMeno",
}) => {
  const [data, setData] = useState([]);

  const [valueS, setValueS] = useState(onStaffId);
  const onSelecteItem = (item) => {
    onSelected(item);
    setValueS(item);
  };

  useEffect(() => {
    setValueS(onStaffId)
  },[])

  const dispatch = useDispatch();
  const Creater = localStorage.getItem("CreateBy");
  const CreateName = localStorage.getItem("CreateName");
  const Dpid = localStorage.getItem("DepartmentId");
  const BranchID = BranchId;
  const DepartmentID = DepartmentId;
  const StaffID = StaffId;
  const _onStaffID = onStaffId;
  const Trl_spStaff_List = async () => {
    const params = {
      Json: JSON.stringify({
        Creater: Creater,
        BranchId: 0,
        DepartmentId: 0,
        StaffId: 0,
      }),
      func: "Trl_spStaff_Select",
    };

    const list = await mainAction.API_spCallServer(params, dispatch);
    const FirstData = { value: 0, label: "Chọn nhân viên" };
    let dataSelect = [],
      IsActive = 0;
    dataSelect.push(FirstData);
    /*  setValueS(FirstData); */
    list.forEach((element, index) => {
      dataSelect.push({
        value: element.StaffId,
        label: element.StaffName,
        ...element,
      });
      if (element.StaffId === _onStaffID) {
        IsActive = 1;
      }
    });
    setData(dataSelect);

    if (IsActive === 1) {
      let ListActive = list.filter((a) => a.StaffId === onStaffId)[0];
      setValueS({
        value: ListActive.StaffId,
        label: ListActive.StaffName,
        ...ListActive,
      });
    }
  };

  useEffect(() => {
    Trl_spStaff_List();
  }, [BranchID, onStaffId, DepartmentID]);

  useEffect(() => {
    if (_onStaffID !== 0 || _onStaffID !== -1) {
      let ar = data.find((a) => a.value === _onStaffID);
      ar ? setValueS(ar) : setValueS({ value: 0, label: "Chọn nhân viên" });
    }
  }, [_onStaffID]);

  return (
    <Select
      className={className}
      value={valueS}
      onChange={onSelecteItem}
      options={data}
    />
  );
};

export const SelectTaskStaff = React.memo(SelectTaskStaffComp);
