import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { mainAction } from "../Redux/Actions";
const SelectCategoryComp = ({
  onSelected = () => {},
  onCategoryId = 0,
  CategoryId = -1,
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
  const CreateName = localStorage.getItem("CreateName");
  const CategoryID = CategoryId;
  const _onCategoryID = onCategoryId;
  const Trl_spCategory_List = async () => {
    const params = {
      Json: JSON.stringify({
        Creater: Creater,
        CategoryId: _onCategoryID !== 0 ? -1 : CategoryID,
      }),
      func: "Trl_spCategory_List",
    };

    const list = await mainAction.API_spCallServer(params, dispatch);
    const FirstData = { value: 0, label: "Chọn danh mục" };
    let dataSelect = [],
      IsActive = 0;
    dataSelect.push(FirstData);
    //setValueS(FirstData);
    list.forEach((element, index) => {
      dataSelect.push({ value: element.CategoryId, label: element.CategoryName });
      if (element.CategoryId === _onCategoryID) {
        IsActive = 1;
      }
    });

    setData(dataSelect);
    if (IsActive === 1) {
      let ListActive = list.filter((a) => a.CategoryId === _onCategoryID)[0];
      setValueS({
        value: ListActive.CategoryId,
        label: ListActive.CategoryName,
      });
    }
  };

  useEffect(() => {
    Trl_spCategory_List();
  }, [CategoryID]);

  useEffect(() => {
    if (_onCategoryID !== 0 && _onCategoryID !== -1) {
      let ar = data.find((a) => a.value === _onCategoryID);
      ar ? setValueS(ar) : setValueS({ value: 0, label: "Chọn danh mục" });
    } else {
      setValueS({ value: 0, label: "Chọn danh mục" });
    }
  }, [_onCategoryID]);

  return (
    <Select
      className={className}
      value={valueS}
      onChange={onSelecteItem}
      options={data}
    />
  );
};

export const SelectCategory = React.memo(SelectCategoryComp);
