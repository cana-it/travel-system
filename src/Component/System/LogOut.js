import React, { useEffect, } from "react";
import { useNavigate } from "react-router-dom";
export const LogOut = () => {
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.removeItem("CreateBy");
        localStorage.removeItem("CreateName");
        localStorage.removeItem("Avatar");
        localStorage.removeItem("DepartmentId");
        localStorage.removeItem("BranchId");
        localStorage.setItem("Token","");
        localStorage.removeItem("Signature");
        //Alertsuccess(I18n.t("Leftmenu.Signoutsuccessful"));
        navigate("/login");
    }, []);
    return (
        <div></div>
    )
}