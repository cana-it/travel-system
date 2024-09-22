import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Img } from "react-image";

const LoadingAlertTemp = ({ isVisible = false }) => {

  const IsLoading = useSelector((state) => state.MainAction.IsLoading);
  const [ShowTimer, setShowTimer] = useState("0");
  
  if (IsLoading) {
    return (
      <div class="notification-container">
        <div>
          <div class="notification notification-warning">
            <div class="notification-message" role="alert">
              <div class="message">
                <Img
                  src="../../assets/img/loading.gif"
                  width="30"
                  height="30"
                />
                Đang xử lý...({ShowTimer})
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <div></div>;
};

export const LoadingAlert = React.memo(LoadingAlertTemp);
