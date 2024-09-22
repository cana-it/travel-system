import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Routers } from "./Router/Routers";
export const App = () => {
  //#region Online state
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Update network status
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };
    // Listen to the online status
    window.addEventListener("online", handleStatusChange);

    // Listen to the offline status
    window.addEventListener("offline", handleStatusChange);

    // Specify how to clean up after this effect for performance improvment
    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
    };
  }, [isOnline]);
  //#endregion
  return (
    <>
      {!isOnline && (
        <div className="offline w-full text-xl bg-red-500 text-white text-center fixed top-0 z-50 m-auto">
          Không có kết nối internet !
        </div>
      )}
      <Routers />
    </>
  );
};
