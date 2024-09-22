import React, { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useDispatch } from "react-redux";
import { mainAction } from "../Redux/Actions";
import { IMAGES_DOMAIN } from "../Services";
import { Img } from "react-image";
const animatedComponents = makeAnimated();
const SelectOfficerNewComp = ({
  onSelected = () => {},
  onOfficer = {},
  DepartId = -1,
  IsFirst = { value: 0, label: "All user" },
  IsActive = "-0",
  IsClass = 0,
  isMulti = false,
}) => {
  const [data, setData] = useState([]);
  const [dataFull, setdataFull] = useState([]);
  const [valueS, setValueS] = useState();
  const onSelecteItem = (item) => {
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
      Json: JSON.stringify({ DepartId: DepartID }),
      func: "Task_spIssueTracking_GetOfficer",
    };

    const list = await mainAction.API_spCallServer(params, dispatch);
    setdataFull(list);
    const FirstData = IsFirst;
    let dataSelect = [];
    dataSelect.push(FirstData);
    setValueS(FirstData);
    list.forEach((element, index) => {
      dataSelect.push({ value: element.OfficerID, label: element.OfficerName });
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
    <div class="row">
      <div class="col-sm-12 col-md-6">
        <div class="form-group">
          <div class="input-group SelectDatetime">
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
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-6">
        <ul class="list-inline margin-top-10">
          {dataFull.slice(0, 5).map((item, k) => {
            return (
              <li key={k} class="list-inline-item">
                <Img
                  alt="Avatar"
                  height="30"
                  class="table-avatar"
                  src={IMAGES_DOMAIN + item.Avatar}
                />
              </li>
            );
          })}
          <li class="list-inline-item" style={{ position: "relative" }}>
            <div class="iconof">+{dataFull.length - 5}</div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export const SelectOfficerNew = SelectOfficerNewComp;
