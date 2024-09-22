import React from "react";
import { FooterMenu, HeaderMenu, LeftMenu } from "../Component/Template";

const LayoutCMS = ({ children, ...rest }) => {
  return (
    <>
      <div class="wrapper">
        <HeaderMenu />
        {/* <aside class="control-sidebar control-sidebar-dark"></aside> */}
        <LeftMenu ModuleType="CMS" />
        {children}
        <FooterMenu />
      </div>
    </>
  );
};
export default LayoutCMS;
