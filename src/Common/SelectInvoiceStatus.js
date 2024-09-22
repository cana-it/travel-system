import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { mainAction } from "../Redux/Actions";
const SelectInvoiceStatusComp = ({
  onSelected = () => {},
  onStatusId = 0,
  StatusId = -1,
  StepActive = 0,
  className = "SelectMeno",
  TotalStep = 2,
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
  const StatusID = StatusId;
  const Trl_spInvoiceStatus_List = async () => {
    let Keys = "A";
    if (StepActive === 1 && TotalStep === 2) {
      Keys = "A";
    }
    if (StepActive === 1 && TotalStep === 5) {
      Keys = "E";
    }
    if (StepActive === 2) {
      Keys = "B";
    }
    if (StepActive === 3) {
      Keys = "D";
    }
    if (StepActive === 4) {
      Keys = "B";
    }
    if (StepActive === 5) {
      Keys = "C";
    }

    const params = {
      Json: JSON.stringify({
        Creater: Creater,
        CreateName: CreateName,
        Keys: Keys,
      }),
      func: "Trl_spInvoiceStatus_List",
    };

    const list = await mainAction.API_spCallServer(params, dispatch);
    const FirstData = { value: 0, label: "Chọn Trạng thái" };
    let dataSelect = [];
    dataSelect.push(FirstData);
    // const FirstData = { value: list[0]?.StatusId, label: list[0]?.StatusName };
    setValueS(FirstData);
    if (StepActive === 1) {
      list.forEach((element, index) => {
        if (element.StatusId === 1) {
          dataSelect.push({
            value: element.StatusId,
            label: element.StatusName,
          });
        }
      });
    } else {
      list.forEach((element, index) => {
        dataSelect.push({
          value: element.StatusId,
          label: element.StatusName,
        });
      });
    }

    // if (onStatusId !== 0 && onStatusId !== -1) {
    //   let ar = list.find((a) => a.StatusId === onStatusId);
    //   setValueS({ value: ar.StatusId, label: ar.StatusName });
    // } // Active

    setData(dataSelect);
  };
  useEffect(() => {
    if (onStatusId !== 0 && onStatusId !== -1) {
      let ar = data.find((a) => a.value === onStatusId);
      setValueS(ar);
    }
  }, [onStatusId]);

  useEffect(() => {
    Trl_spInvoiceStatus_List();
  }, [StepActive, StatusId]);

  return (
    <Select
      className={className}
      value={valueS}
      onChange={onSelecteItem}
      options={data}
    />
  );
};

export const SelectInvoiceStatus = React.memo(SelectInvoiceStatusComp);
