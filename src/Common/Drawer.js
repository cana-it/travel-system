import React, { useState } from "react";

const Drawer = ({ isOpen, toggleDrawer, children, title = "Thêm mới" }) => {
  return (
    <div>
      <div className={`drawer ${isOpen ? "open" : ""}`}>
        <div class="d-flex align-items-center justify-content-between p-2 border">
          <h4 class="font-weight-bold text-success">{title}</h4>
          <button
            className="btn btn-primary "
            onClick={toggleDrawer}
          >
            X
          </button>
        </div>
        <div className="drawer-content">{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
