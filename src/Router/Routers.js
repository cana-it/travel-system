import { BrowserRouter, Routes } from "react-router-dom";
import { NoPermissionRouters } from "./NoPermissionRouters";
import { MainRouters } from "./MainRouters";
import { CmsRouters } from "./CmsRouters";
export const Routers = () => {
  const noLoginRouter = NoPermissionRouters();
  const mainRouter = MainRouters();
  const cmsRouter = CmsRouters();
  return (
    <BrowserRouter>
      <Routes>
        {mainRouter}
        {cmsRouter}
        {noLoginRouter}
      </Routes>
    </BrowserRouter>
  );
};
