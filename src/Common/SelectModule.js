import React, { useEffect, useState } from "react";
import Select from "react-select";
const SelectModuleComp = ({ onSelected = () => {}, val = "TRAVEL" }) => {
  useEffect(() => {
    if (data.length > 0) {
      setValueS(data.filter((p) => p.value === val));
      return;
    }
  }, [val]);

  const [data, setData] = useState([
    { value: "TRAVEL", label: "TRAVEL" },
    { value: "CMS", label: "CMS" },
    { value: "ACCOUNTING", label: "ACCOUNTING" },
    { value: "CHAT", label: "CHAT" },
    { value: "HRM", label: "HRM" },
    { value: "MAIL", label: "MAIL" },
    { value: "SYSTEM", label: "SYSTEM" },
  ]);

  const [valueS, setValueS] = useState(val);
  const onSelecteItem = (item) => {
    onSelected(item);
    setValueS(item);
  };

  return (
    <Select
      className="SelectMeno"
      value={valueS}
      onChange={onSelecteItem}
      options={data}
    />
  );
};

export const SelectModule = React.memo(SelectModuleComp);
