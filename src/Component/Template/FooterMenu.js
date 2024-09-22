import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

export const FooterMenu = () => {
  /* run after render */
  useEffect(() => {}, []);

  return (
    <footer className="main-footer layout-hindden">
      <div className="float-right d-none d-sm-block">
        <b>Version</b> 1.0
      </div>
      <strong>
        Copyright &copy; 2016-2021 <a href="#">Travel management system</a>.
      </strong>{" "}
      All rights reserved.
    </footer>
  );
};
