import React from "react";
import { FooterMenu, HeaderMenu, LeftMenu } from "../Component/Template";

const LayoutMain = ({ children, ...rest }) => {
  return (
    <>
      <div class="wrapper">
        <HeaderMenu />
        {/* <aside class="control-sidebar control-sidebar-dark"></aside> */}
        <LeftMenu ModuleType="TRAVEL" />
        {children}
        <FooterMenu />
      </div>
    </>
  );
};
export default LayoutMain;
