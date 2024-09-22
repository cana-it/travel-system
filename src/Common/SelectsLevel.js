import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import I18n from "../Language";

const SelectsLevelComp = ({
  onSelected = () => {},
  IsLoad = -1,
  items = 0,
  isMulti = false,
}) => {
  const [data, setData] = useState([]);
  const [valueS, setValueS] = useState({ value: "-1", label: "Select Please" });
  const onSelecteItem = (item) => {
    onSelected(item);
    setValueS(item);
  };

  const WH_WH_spSelect_sLevel = () => {
    setData([
      { value: -1, label: "Select Please" },
      { value: 1, label: "Cấp 1" },
      { value: 2, label: "Cấp 2" },
      { value: 3, label: "Cấp 3" },
      { value: 4, label: "Cấp 4" },
      { value: 5, label: "Cấp 5" },
    ]);
  };

  useEffect(() => {
    WH_WH_spSelect_sLevel();
  }, [IsLoad]);

  useEffect(() => {
    if (items != 0 && items != -1) {
      let ar = data.find((a) => a.value == items);
      ar ? setValueS(ar) : setValueS({ value: 0, label: "Select Please" });
    } else {
      if (isMulti === false) {
        setValueS({ value: -1, label: "Select Please" });
      } else {
        setValueS([]);
      }
    }
  }, [items]);

  return (
    <Select
      className="SelectMeno"
      value={valueS}
      onChange={onSelecteItem}
      options={data}
      isMulti={isMulti}
    />
  );
};

export const SelectsLevel = React.memo(SelectsLevelComp);
