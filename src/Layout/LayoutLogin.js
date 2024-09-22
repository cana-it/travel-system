import React from "react";
import { useEffect } from "react";

const LayoutLogin = ({ children, ...rest }) => {
 /*  useEffect(() => {
    document.querySelectorAll(".layout-hindden").forEach((item) => {
      item.classList.add("d-none");
    });
    document.querySelectorAll(".sidebar-collapse").forEach((item) => {
      item.classList.remove("sidebar-mini");
    });
  }, []); */

  return <>{children}</>;
};
export default LayoutLogin;
