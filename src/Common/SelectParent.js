import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { mainAction } from "../Redux/Actions";
const SelectParentComp = ({
  onSelected = () => {},
  onMenuId = 0,
  MenuId = -1,
  ModuleType = "",
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
  const MenuID = MenuId;
  const Trl_spMenuModule_LoadParent = async () => {
    const params = {
      Json: JSON.stringify({
        AccountId: Creater,
        ModuleType: ModuleType,
      }),
      func: "Trl_spMenuModule_LoadParent",
    };

    const list = await mainAction.API_spCallServer(params, dispatch);
    const FirstData = { value: 0, label: "Chọn menu" };
    let dataSelect = [];
    dataSelect.push(FirstData);
    setValueS(FirstData);
    list.forEach((element, index) => {
      dataSelect.push({ value: element.MenuId, label: element.MenuName });
    });
    if (onMenuId !== 0 && onMenuId !== -1) {
      let ar = list.find((a) => a.MenuId === onMenuId);
      ar
        ? setValueS({ value: ar.MenuId, label: ar.MenuName })
        : setValueS({ value: 0, label: "Chọn menu" });
    } // Active

    setData(dataSelect);
  };
  useEffect(() => {
    if (onMenuId !== 0 && onMenuId !== -1) {
      let ar = data.find((a) => a.value === onMenuId);
      ar ? setValueS(ar) : setValueS({ value: 0, label: "Chọn menu" });
    }
  }, [onMenuId]);

  useEffect(() => {
    Trl_spMenuModule_LoadParent();
  }, [MenuID, ModuleType]);

  return (
    <Select
      className="SelectMeno"
      value={valueS}
      onChange={onSelecteItem}
      options={data}
    />
  );
};

export const SelectParent = React.memo(SelectParentComp);
