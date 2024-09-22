import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { mainAction } from "../Redux/Actions";
import I18n from "../Language";
import { GetDataFromLogin, Alerterror, Alertwarning } from "../Utils";

const SelectMenuModuleLoadPermissionComp = React.forwardRef(
  (
    {
      onSelected = () => {},
      onMenuId = 0,
      MenuId = 0,
      ParentId = 0,
      items = 0,
      activer = [],
      isDisabled = false,
      isMulti = false,
    },
    ref
  ) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [valueS, setValueS] = useState();

    const onSelecteItem = (item) => {
      onSelected(item);
      setValueS(item);
    };

    const WH_spMenuModule_LoadPermission_List = async () => {
      ;
      try {
        const params = {
          Json: JSON.stringify({
            AccountId: GetDataFromLogin("AccountId"),
          }),
          func: "WH_spMenuModule_LoadPermission_List",
        };
        const list = await mainAction.API_spCallServer(params, dispatch);
        if (list.length > 0) {
          const FirstData = { value: -1, label: "Select Please" };
          let dataSelect = [];
          if (isMulti === false) {
            dataSelect.push(FirstData);
            setValueS(FirstData);
          }
          list.forEach((element, index) => {
            dataSelect.push({
              value: element.MenuId,
              label: element.MenuName,
              value: element.ParentId,
            });
          });
          // Active
          if (items != 0 && items != -1) {
            let ar = dataSelect.find((a) => a.value === items);
            setValueS(ar);
          }
          // Active
          if (activer.length > 0) {
            let datatam = [],
              valuetam = "";
            activer.forEach((element, index) => {
              if (element.value !== -1) {
                valuetam = dataSelect.find((a) => a.value == element.value);
                datatam.push(valuetam);
              }
            });
            setValueS(datatam);
          }

          setData(dataSelect);
        }
      } catch (error) {
        Alerterror(I18n.t("validate.Dataerror,pleasecontactIT!"));
      }
    };

    useEffect(() => {
      WH_spMenuModule_LoadPermission_List();
    }, [MenuId, ParentId]);
    useEffect(() => {
      if (isMulti === true) {
        return;
      }

      let ar = data.find((a) => a.value == items);
      ar ? setValueS(ar) : setValueS({ value: 0, label: "Select Please" });
    }, [onMenuId]);

    useEffect(() => {
      if (isMulti === false) {
        return;
      }
      if (activer.length > 0) {
        let datatam = [],
          valuetam = "";
        activer.forEach((element, index) => {
          if (element.value !== -1) {
            valuetam = data.find((a) => a.value == element.value);
            datatam.push(valuetam);
          }
        });
        setValueS(datatam);
        return;
      }
    }, [activer]);

    return (
      <Select
        className="SelectMeno"
        value={valueS}
        onChange={onSelecteItem}
        options={data}
        isDisabled={isDisabled}
        isMulti={isMulti}
        // ref={ref}
        // ignoreAccents={true}
      />
    );
  }
);
export const SelectSelectMenuModuleLoadPermission = React.memo(
  SelectMenuModuleLoadPermissionComp
);
