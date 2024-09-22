import { Route } from "react-router-dom";
import { Suspense } from "react";
import { Login } from "../Component/System/Login";
import { LogOut } from "../Component/System/LogOut";
export const NoPermissionRouters = () => {
  return (
    <>
      <Route
        path="/Login"
        element={
          <Suspense fallback={<div>...</div>}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="/dang-xuat"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <LogOut />
          </Suspense>
        }
      />
      <Route
        exact
        path="/"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Login />
          </Suspense>
        }
      />
    </>
  );
};
