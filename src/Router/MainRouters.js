import { Route } from "react-router-dom";
import { Suspense } from "react";
import Loading from "../Common/Loading";
import LayoutMain from "../Layout/LayoutMain";
import LayoutLogin from "../Layout/LayoutLogin";
//OPERATION
import {
  CostTourV2,
  Guide,
  HotelData,
  LandData,
  LandTour_List,
  LocationManager,
  ManageBooking,
  OperatingReport,
  Plane,
  RestaurantData,
  RetailVisa,
  SettlementTour,
  SightseeingData,
  TourCost,
  TourGuideSchedule,
  TourGuiderData,
  TourHandover,
  TourPlan,
  TourRequest,
  VehicleData,
  Visa,
} from "../Component/Main/TravelModule/Operation";
import { CostSettlement } from "../Component/Main/TravelModule/Operation/CostSettlement";

//CUSTOMER
import {
  Customer,
  CustomerFeedback,
  CustomerNew,
  CustomerReport,
  CustomerStatistics,
  CustomerType,
} from "../Component/Main/TravelModule/Customer";
import { CustomerInformation } from "../Component/Main/TravelModule/Customer/CustomerInformation";

//COMMON
import { ChatBox, OnlineStaff } from "../Common";

//DASHBOARD SYSTEM
import { Dashboard } from "../Component/System";
import {
  Approve,
  Branch,
  ChangePassWord,
  Department,
  DepartmentMap,
  Function,
  HomeDashBoard,
  LeaveManage,
  LogModuleReport,
  MenuModule,
  MenuModulePermission,
  News,
  Notification,
  Staff,
  StaffConfirmInvoice,
  StaffInfor,
  StaffSignature,
  Staff_Contract,
  Staff_LoginLogInMap,
  StaffinforDetail,
} from "../Component/Main/TravelModule/System";
import {
  ContractCustomer,
  InitKPI,
  KPIManagerment,
  TimeKeepingData,
} from "../Component/Main/TravelModule/HRAdministration";
import { Leave, UploadDoccument } from "../Component/Main/TravelModule/Human";

//JOB
import {
  BugManage,
  CategoryManage,
  Home,
  Project,
  ProjectManage,
  Report,
  Task,
  Taskdaily,
} from "../Component/Main";

//ACCOUNTING
import {
  ExpenseItems,
  GeneralPaymentInternal,
  GeneralPaymentSlips,
  InvoiceConfirmReceipts,
  InvoicePaymentInternal,
  InvoicePaymentSlips,
  InvoiceRefund,
  InvoiceReport,
  Invoice_List,
} from "../Component/Main/TravelModule/Accounting";

//PROVIDER
import {
  Provider,
  ProviderType,
} from "../Component/Main/TravelModule/Provider";

//SERVICE
import {
  ProductTourSale,
  Service,
  ServiceLandTour,
} from "../Component/Main/TravelModule/Service";

//BOOKING
import {
  Booking_ByStaff_Report,
  CreateBooking,
  CreateServiceOther,
} from "../Component/Main/TravelModule/Booking";

export const MainRouters = () => {
  return (
    <>
      {/* OPERATION */}
      <Route
        path="/quan-ly-khu-vuc"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <LocationManager />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/tao-phieu-dieu-tour"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <TourRequest />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/phieu-chiet-tinh-chi-phi"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <CostTourV2 />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/ke-hoach-tour"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <TourPlan />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/lich-hdv-di-tour"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <TourGuideSchedule />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/dieu-hanh/booking"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <ManageBooking />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/phieu-ban-giao-tour"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <TourHandover />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/bao-cao-tour"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <OperatingReport />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/tao-phieu-quyet-toan-tour"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <SettlementTour />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/booking/visa"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <Visa />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/booking/plane"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <Plane />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/booking/guide"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <Guide />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/booking/landtour"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <LandTour_List />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/retail-visa"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <RetailVisa />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/LandData"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <LandData />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/khach-san"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <HotelData />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/nha-hang"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <RestaurantData />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/huong-dan-vien"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <TourGuiderData />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/xe-du-lich"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <VehicleData />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/chiet-tinh-chi-phi"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <TourCost />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/diem-tham-quan"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <SightseeingData />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/quyet-toan-chi-phi"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <CostSettlement />
            </Suspense>
          </LayoutMain>
        }
      />
      {/* CUSTOMER */}
      <Route
        path="/bao-cao-khach-hang"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <CustomerReport />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/khach-hang/loai-khach-hang"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <CustomerType />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/khach-hang/quan-ly-khach-hang"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <Customer />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/khach-hang/chi-tiet-khach-hang"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <CustomerInformation />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/khach-hang/thong-ke-khach-hang"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <CustomerStatistics />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/khach-hang/thong-tin-khach-hang"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <CustomerNew />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/khach-hang/thong-tin-feedback-khách-hang"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <CustomerFeedback />
            </Suspense>
          </LayoutMain>
        }
      />
      {/* COMMON */}
      <Route
        path="/ban-lanh-dao/staff/online_staff"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <OnlineStaff />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/chatbox"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <ChatBox />
            </Suspense>
          </LayoutMain>
        }
      />
      {/* DASHBOARD & SYSTEM */}
      <Route
        path="/news"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <News />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/lich-su-truy-cap"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <LogModuleReport />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/he-thong/menu"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <MenuModule />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/he-thong/phan-quyen"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <MenuModulePermission />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/quy-trinh-phe-duyet"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <Approve />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/hcsn/quan-ly-hop-dong-tour-doi-tac"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <ContractCustomer />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/hcsn/cham-cong"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <TimeKeepingData />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/trang-chu"
        element={
          <LayoutLogin>
            <Suspense fallback={<Loading />}>
              <HomeDashBoard />
            </Suspense>
          </LayoutLogin>
        }
      />
      <Route
        path="/ban-lanh-dao/dashboard"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <Dashboard />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/he-thong/chuc-nang"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <Function />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/lich-su-dang-nhap-tren-map"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <Staff_LoginLogInMap />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/tao-thong-bao"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <Notification />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/thong-tin-nhan-vien"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <StaffinforDetail />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/doi-mat-khau"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <ChangePassWord />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/chu-ky-dien-tu"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <StaffSignature />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/he-thong/chi-nhanh"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <Branch />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/quan-ly-phong-ban"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <Department />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/quan-ly-nhan-vien"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <Staff />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/upload-doccument"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <UploadDoccument />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/dang-ky-nghi-phep"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <Leave />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/quan-ly-nghi-phep"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <LeaveManage />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/so-do-to-chuc-bo-phan"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <DepartmentMap />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/thong-tin-nhan-su"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <StaffInfor />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/quan-ly-hop-dong"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <Staff_Contract />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/nhan-vien/kpi"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <KPIManagerment />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/nhan-vien/danh-kpi"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <InitKPI />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/quan-ly-phan-quyen"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <StaffConfirmInvoice />
            </Suspense>
          </LayoutMain>
        }
      />
      //#endregion DASHBOARD & SYSTEM //#region JOB
      <Route
        path="/home"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <Home />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/management-project-plan"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <Project />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/management-project"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <ProjectManage />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/management-task"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <Taskdaily />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/quan-ly-giao-viec"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <Task />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/management-category"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <CategoryManage />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/management-bug"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <BugManage />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/management-report"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <Report />
            </Suspense>
          </LayoutMain>
        }
      />
      //#endregion JOB
      {/* ACCOUNTING */}
      <Route
        path="/ke-toan/thanh-toan"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <Invoice_List />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/ke-toan/khoan-muc"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <ExpenseItems />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/tao-phieu-de-xuat"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <GeneralPaymentSlips />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/tao-phieu-de-xuat-noi-bo"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <GeneralPaymentInternal />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/xac-nhan-phieu-thu"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <InvoiceConfirmReceipts />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/phieu-hoan"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <InvoiceRefund />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/theo-doi-tien-do-phieu-de-xuat-noi-bo"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <InvoicePaymentInternal />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/theo-doi-tien-do-phieu-de-xuat-tour"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <InvoicePaymentSlips />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/ke-toan/bao-cao"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <InvoiceReport />
            </Suspense>
          </LayoutMain>
        }
      />
      {/* PROVIDER */}
      <Route
        path="/nha-cung-cap/loai-nha-cung-cap"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <ProviderType />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/nha-cung-cap/nha-cung-cap"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <Provider />
            </Suspense>
          </LayoutMain>
        }
      />
      {/* SERVICE */}
      <Route
        path="/dich-vu/tour-san-pham"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <Service />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/dich-vu/tour-mo-ban"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <ProductTourSale />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/dich-vu/land-tour"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <ServiceLandTour />
            </Suspense>
          </LayoutMain>
        }
      />
      {/* BOOKING */}
      <Route
        path="/booking/doanh-so-ban-tour"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <Booking_ByStaff_Report />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/booking/tour-booking"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <CreateBooking />
            </Suspense>
          </LayoutMain>
        }
      />
      <Route
        path="/booking/service-other"
        element={
          <LayoutMain>
            <Suspense fallback={<Loading />}>
              <CreateServiceOther />
            </Suspense>
          </LayoutMain>
        }
      />
      {/* 
      <Route path="/task"render={() => (
          <LayoutMain>
            <Suspense fallback={<Loading />}>Task</Suspense>
          </LayoutMain>
        )}
      />
       */}
    </>
  );
};
