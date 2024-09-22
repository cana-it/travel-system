import { Route } from "react-router-dom";
import { Suspense } from "react";
import LayoutCMS from "../Layout/LayoutCMS";
import Loading from "../Common/Loading";
import { ProductManagement } from "../Component/CMS/Product/ProductManagement";
import MenuManagement from "../Component/CMS/Setting/MenuManagement";
import { SettingManagemnt } from "../Component/CMS/Content/SettingManagemnt";
import { HomeBanner } from "../Component/CMS/Directory/HomeBanner";
import { Blogs } from "../Component/CMS/Content/Blogs";
import { TourManagement } from "../Component/CMS/Categories/TourManagement";
import TourGroupManagemnt from "../Component/CMS/Categories/TourGroupManagemnt";
import { Galery } from "../Component/CMS/Content/Galery";
import { ContactWebsite } from "../Component/CMS/Contact/ContactWebsite";
import { StaffProfile } from "../Component/CMS/Staff/StaffProfile";
import { CustomerFeedback } from "../Component/CMS/Contact/CustomerFeedback";
import { TourCategory } from "../Component/CMS/Categories/TourCategory";
import { Sites } from "../Component/CMS/Content/Sites";
import { BookingTour } from "../Component/CMS/Contact/BookingTour";
import { CountryManagement } from "../Component/CMS/Categories/CountryManagement";
/* const TourManagement = lazy(() => import("../Component/CMS/Categories/TourManagement")); */

export const CmsRouters = () => {
  return (
    <>
      <Route
        path="/cms/quan-ly-menu"
        element={
          <LayoutCMS>
            <Suspense fallback={<Loading />}>
              <MenuManagement />
            </Suspense>
          </LayoutCMS>
        }
      />
      <Route
        path="/cms/quan-ly-san-pham"
        element={
          <LayoutCMS>
            <Suspense fallback={<Loading />}>
              <ProductManagement />
            </Suspense>
          </LayoutCMS>
        }
      />
      <Route
        path="/cms/quan-ly-banner"
        element={
          <LayoutCMS>
            <Suspense fallback={<Loading />}>
              <HomeBanner />
            </Suspense>
          </LayoutCMS>
        }
      />
      <Route
        path="/cms/quan-ly-noi-dung-website"
        element={
          <LayoutCMS>
            <Suspense fallback={<Loading />}>
              <SettingManagemnt />
            </Suspense>
          </LayoutCMS>
        }
      />
      <Route
        path="/cms/blogs"
        element={
          <LayoutCMS>
            <Suspense fallback={<Loading />}>
              <Blogs />
            </Suspense>
          </LayoutCMS>
        }
      />
      <Route
        path="/cms/galery"
        element={
          <LayoutCMS>
            <Suspense fallback={<Loading />}>
              <Galery />
            </Suspense>
          </LayoutCMS>
        }
      />
      <Route
        exact
        path="/cms/quan-ly-tour"
        element={
          <LayoutCMS>
            <Suspense fallback={<Loading />}>
              <TourManagement />
            </Suspense>
          </LayoutCMS>
        }
      />
      <Route
        exact
        path="/cms/quan-ly-nhom-tour"
        element={
          <LayoutCMS>
            <Suspense fallback={<Loading />}>
              <TourGroupManagemnt />
            </Suspense>
          </LayoutCMS>
        }
      />
      <Route
        exact
        path="/cms/quan-ly-lien-he"
        element={
          <LayoutCMS>
            <Suspense fallback={<Loading />}>
              <ContactWebsite />
            </Suspense>
          </LayoutCMS>
        }
      />
      <Route
        exact
        path="/cms/quan-ly-feedback-khach-hang"
        element={
          <LayoutCMS>
            <Suspense fallback={<Loading />}>
              <CustomerFeedback />
            </Suspense>
          </LayoutCMS>
        }
      />
      <Route
        exact
        path="/cms/quan-ly-danh-muc-tour"
        element={
          <LayoutCMS>
            <Suspense fallback={<Loading />}>
              <TourCategory />
            </Suspense>
          </LayoutCMS>
        }
      />
      <Route
        exact
        path="/cms/quan-ly-dia-diem-noi-bat"
        element={
          <LayoutCMS>
            <Suspense fallback={<Loading />}>
              <Sites />
            </Suspense>
          </LayoutCMS>
        }
      />
      <Route
        exact
        path="/cms/booking-tour"
        element={
          <LayoutCMS>
            <Suspense fallback={<Loading />}>
              <BookingTour />
            </Suspense>
          </LayoutCMS>
        }
      />
      <Route
        exact
        path="/cms/country-management"
        element={
          <LayoutCMS>
            <Suspense fallback={<Loading />}>
              <CountryManagement />
            </Suspense>
          </LayoutCMS>
        }
      />
    </>
  );
};
