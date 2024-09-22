import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { mainAction } from "../../Redux/Actions";
import Select from "react-select";
import Chart from "react-apexcharts";
import {
  Alerterror,
  Alertwarning,
  FirstOrLastDayinMonth,
  FormatDate,
  FormatNumber,
  FormatDateJson,
  FormatMoney,
  Alertsuccess,
} from "../../Utils";
import { Link } from "react-router-dom";
import { ApexchartsPie, OnlineStaff } from "../../Common";
import $ from "jquery";
import { IMAGES_DOMAIN } from "../../Services";
import parse from "react-html-parser";
import Modal from "react-bootstrap/Modal";
import { ApexchartsSpark } from "../../Common/ApexSpark";
import { ApexchartsSplineArea } from "../../Common/ApexchartsSplineArea";
import { ApexchartsRadial } from "../../Common/ApexchartsRadial";
import { ChartPolar } from "../../Common/CMS/ChartPolar";
import { ChartPie } from "../../Common/CMS/ChartPie";
import { Ratio } from "react-bootstrap";

export const Dashboard = () => {
  const dispatch = useDispatch();
  const CreateBy = localStorage.getItem("CreateBy");

  useEffect(() => {
    $(".main-header").removeClass("display-none");
    $(".main-sidebar").removeClass("display-none");
    $(".main-footer").removeClass("display-none");
  }, []);

  //#region Form

  const [_data, setData] = useState({});

  const _now = new Date();
  const _month = _now.getMonth() + 1;
  const _year = _now.getFullYear();

  useEffect(() => {
    Trl_spTravelDashboard();
  }, []);

  const [customerBox, setCustomerBox] = useState({});
  const [revenueBox, setRevenueBox] = useState({});
  const [tourBox, setTourBox] = useState({});
  const [ageBox, setAgeBox] = useState({});
  const [bookingArea, setBookingArea] = useState({});
  const [deadline, setDeadline] = useState({});
  const [topSales, setTopSales] = useState([]);
  const [topTour, setTopTour] = useState([]);
  const [totalInvoice, setTotalInvoice] = useState([]);

  const Trl_spTravelDashboard = async () => {
    try {
      const params = {
        Json: JSON.stringify({
          FromDate: new Date(),
          ToDate: new Date(),
          TypeReport: 1,
        }),
        func: "Trl_spTravelDashboard",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      const customer = result.Customer.find(
        (item) => item.Month === _month && item.Year === _year
      );
      setCustomerBox(customer);

      const revenue = result.Revenue.find(
        (item) => item.Month === _month && item.Year === _year
      );
      setRevenueBox(revenue);

      const tour = result.Tour.find(
        (item) => item.Month === _month && item.Year === _year
      );
      setTourBox(tour);

      let series = [];
      let labels = [];
      result.Age.forEach((item) => {
        labels.push(item.Age);
        series.push(item.Total);
      });
      setAgeBox({ labels, series });

      let seriesBooking = [];
      let labelsBooking = [];
      result.BookingArea.forEach((item) => {
        labelsBooking.push(item.Area);
        seriesBooking.push(item.Total);
      });
      setBookingArea({ labels: labelsBooking, series: seriesBooking });

      let seriesDeadline = [];
      let labelsDeadline = [];

      result.Deadline.forEach((item) => {
        labelsDeadline.push(item.Deadline);
        seriesDeadline.push(item.Total);
      });
      setDeadline({ labels: labelsDeadline, series: seriesDeadline });

      let topSales = result.TopSales.filter(
        (item) => item.Month === _month && item.Year === _year
      );
      setTopSales(topSales);

      let topTour = result.TopTour.filter(
        (item) => item.Month === _month && item.Year === _year
      );
      setTopTour(topTour);
      setData(result);
      handlePaymentSlipvsRevenue(result);
    } catch (error) {
      Alerterror("Lỗi, liên hệ IT");
    }
  };

  const handlePaymentSlipvsRevenue = (data) => {
    let revenue = data.Revenue.filter((item) => item.Year === _year).map(
      (item) => {
        return {
          x: new Date(
            `${item.Month.toString().padStart(2, "0")}/01/${_year}`
          ).getTime(),
          y: item.Total,
        };
      }
    );
    let paymentSlip = data.PaymentSlip.filter(
      (item) => item.Year === _year
    ).map((item) => {
      return {
        x: new Date(
          `${item.Month.toString().padStart(2, "0")}/01/${_year}`
        ).getTime(),
        y: item.Total,
      };
    });

    // Check if paymentSlip has data for all 12 months
    for (let i = 1; i <= 12; i++) {
      const monthExists = paymentSlip.some((item) => {
        const date = new Date(`${i.toString().padStart(2, "0")}/01/${_year}`);
        return item.x === date.getTime();
      });

      if (!monthExists) {
        paymentSlip.push({
          x: new Date(`${i.toString().padStart(2, "0")}/01/${_year}`).getTime(),
          y: 0,
        });
      }
    }

    for (let i = 1; i <= 12; i++) {
      const monthExists = revenue.some((item) => {
        const date = new Date(`${i.toString().padStart(2, "0")}/01/${_year}`);
        return item.x === date.getTime();
      });

      if (!monthExists) {
        revenue.push({
          x: new Date(`${i.toString().padStart(2, "0")}/01/${_year}`).getTime(),
          y: 0,
        });
      }
    }

    let series = [
      {
        name: "Tổng doanh thu",
        data: revenue,
      },
      {
        name: "Tổng chi phí",
        data: paymentSlip,
      },
    ];
    setTotalInvoice(series);
  };

  //#endregion
  const CardTop = ({ title, value, ratio, type = 0 }) => {
    let color = ratio > 0 ? "#22c55e" : "#ef4444";
    let transform = ratio > 0 ? "" : "translate(0 24) scale(1 -1)";
    let newValue = type === 1 ? FormatNumber(value) : value;
    return (
      <div className="card2 ">
        <div class="col-7">
          <p class="bold">{title}</p>
          <h3 class="bold">{newValue}</h3>
          <div class="MuiStack-root css-1601ofu">
            <div class="">
              <span className=" mr-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  className="bg-success-light rounded-circle px-1"
                >
                  <g
                    transform={transform}
                    fill="none"
                    stroke={color}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                  >
                    <path d="m3 17l6-6l4 4l8-8" />
                    <path d="M17 7h4v4" />
                  </g>
                </svg>

                {/* <i class="fas fa-level-up-alt text-success"></i> */}
              </span>
              <span className="bold">{ratio}%</span>
              <span class="text-muted fs-12"> so với tháng trước</span>
            </div>
          </div>
        </div>
        <div className="col-5">
          <ApexchartsSpark color={[color]} />
        </div>
      </div>
    );
  };

  const RenderBodySales = () => {
    return topSales.slice(0, 5).map((item, index) => {
      return (
        <tr class="  css-1d0u2ln">
          <td class="  css-5q0m5i">
            <div class="  css-1on66cs">
              <img
                alt="Jayvion Simon"
                src={IMAGES_DOMAIN + item.Avatar}
                class="MuiAvatar-img css-1hy9t21"
              />
            </div>
            {item.Name}
          </td>
          {/* <td class="  css-uj5sxh">{item.Area}</td> */}
          <td class="  css-195en1d">{FormatNumber(item?.Total || 0)}</td>
          <td class="  css-195en1d">
            <span class="MuiBox-root css-1yukwl8">Top {index + 1}</span>
          </td>
        </tr>
      );
    });
  };

  const RenderBodyTour = () => {
    return topTour.slice(0, 5).map((item, index) => {
      return (
        <tr class="  css-1d0u2ln">
          <td class="  css-5q0m5i">
            <div class="  css-1on66cs">
              <img
                alt="Jayvion Simon"
                src="https://api-prod-minimal-v510.vercel.app/assets/images/cover/cover_1.jpg"
                class="MuiAvatar-img css-1hy9t21"
              />
            </div>
            {item.BookingCode}
          </td>
          {/* <td class="  css-uj5sxh">{item.Area}</td> */}
          <td class="  css-195en1d">{FormatNumber(item?.Total || 0)}</td>
          <td class="  css-195en1d">
            <span class="MuiBox-root css-1yukwl8">Top {index + 1}</span>
          </td>
        </tr>
      );
    });
  };
  //#endregion
  return (
    <>
      <div className="content-wrapper">
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-4 py-2 ">
                <CardTop
                  title="Khách hàng"
                  value={customerBox?.Total || 0}
                  ratio={customerBox?.Ratio?.toFixed(1) || 0}
                />
              </div>
              <div className="col-md-4 py-2">
                <CardTop
                  title="Doanh số"
                  value={revenueBox?.Total || 0}
                  ratio={revenueBox?.Ratio?.toFixed(1) || 0}
                  type={1}
                />
              </div>
              <div className="col-md-4 py-2">
                <CardTop
                  title="Tour"
                  value={tourBox?.Total || 0}
                  ratio={tourBox?.Ratio?.toFixed(1) || 0}
                />
              </div>

              <div className="col-md-12 py-2">
                <div className="card2 ">
                  <div className="w-100">
                    <div class=" p-2 mb-2">
                      <span className="fs-20 bold">Doanh thu công ty </span>
                    </div>
                    <ApexchartsSplineArea serie={totalInvoice} />
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4 py-2">
                <div className="card2 center-item">
                  <div className="w-100">
                    <div class=" p-2 mb-2">
                      <span className="fs-20 bold">Độ tuổi</span>
                    </div>
                    <ApexchartsRadial
                      data={ageBox.series}
                      labels={ageBox.labels}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4 py-2">
                <div className="card2 center-item">
                  <div className="w-100">
                    <div class=" p-2 mb-2">
                      <span className="fs-20 bold">Deadline đăng ký</span>
                    </div>
                    <ChartPie
                      data={deadline.series}
                      label={deadline.labels}
                      color={["#22c55e", "#fbbf24", "#ef4444"]}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4 py-2">
                <div className="card2 center-item">
                  <div className="w-100">
                    <div class=" p-2 mb-2">
                      <span className="fs-20 bold">Thị trường</span>
                    </div>
                    <ChartPie
                      data={bookingArea.series}
                      label={bookingArea.labels}
                      color={[
                        "#22c55e",
                        "#f59e0b",
                        "#38bdf8",
                        "#f472b6",
                        "#ef4444",
                        "#fbbf24",
                      ]}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-6 py-2">
                <div className="card2">
                  <div className="w-100">
                    <div class=" p-2 mb-2">
                      <span className="fs-20 bold">Top Sales theo tháng</span>
                    </div>
                    <div className="w-100">
                      <table class="  css-98kjg7 w-100">
                        <thead class="M  css-1wbz3t9">
                          <tr class="  css-1d0u2ln">
                            <th
                              class="  css-atm0a"
                              scope="col"
                              style={{ width: 300 }}
                            >
                              Seller
                            </th>
                            {/* <th class="  css-atm0a" scope="col">
                              Thị trường
                            </th> */}

                            <th class="  css-8esqav" scope="col">
                              Tổng giá trị
                            </th>
                            <th class="  css-8esqav" scope="col">
                              Top
                            </th>
                          </tr>
                        </thead>
                        <tbody class="  css-1xnox0e">
                          <RenderBodySales />
                          {/* <tr class="  css-1d0u2ln">
                            <td class="  css-5q0m5i">
                              <div class="  css-1on66cs">
                                <img
                                  alt="Jayvion Simon"
                                  src="https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_9.jpg"
                                  class="MuiAvatar-img css-1hy9t21"
                                />
                              </div>
                              Đinh Hoài Ân
                            </td>
                            <td class="  css-uj5sxh">Âu - Úc</td>
                            <td class="  css-195en1d">4,217,885,000</td>
                            <td class="  css-195en1d">
                              <span class="MuiBox-root css-1yukwl8">Top 1</span>
                            </td>
                          </tr>
                          <tr class="  css-1d0u2ln">
                            <td class="  css-5q0m5i">
                              <div class="  css-1on66cs">
                                <img
                                  alt="Lucian Obrien"
                                  src="https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_10.jpg"
                                  class="MuiAvatar-img css-1hy9t21"
                                />
                              </div>
                              Huỳnh Nguyễn Ngọc Nhiên
                            </td>
                            <td class="  css-uj5sxh">Âu - Úc</td>
                            <td class="  css-195en1d">2,456,521,018</td>
                            <td class="  css-195en1d">
                              <span class="MuiBox-root css-1xt3m6d">Top 2</span>
                            </td>
                          </tr>
                          <tr class="  css-1d0u2ln">
                            <td class="  css-5q0m5i">
                              <div class="  css-1on66cs">
                                <img
                                  alt="Deja Brady"
                                  src="https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_11.jpg"
                                  class="MuiAvatar-img css-1hy9t21"
                                />
                              </div>
                              Nguyễn Lê Quỳnh Thư
                            </td>
                            <td class="  css-uj5sxh">Mỹ</td>
                            <td class="  css-195en1d">1,764,230,000</td>
                            <td class="  css-195en1d">
                              <span class="MuiBox-root css-1r7dlkq">Top 3</span>
                            </td>
                          </tr>
                          <tr class="  css-1d0u2ln">
                            <td class="  css-5q0m5i">
                              <div class="  css-1on66cs">
                                <img
                                  alt="Harrison Stein"
                                  src="https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_12.jpg"
                                  class="MuiAvatar-img css-1hy9t21"
                                />
                              </div>
                              Trần Thị Huyền Nhi
                            </td>
                            <td class="  css-uj5sxh">Mỹ</td>
                            <td class="  css-195en1d">1,531,000,000</td>
                            <td class="  css-195en1d">
                              <span class="MuiBox-root css-viwmjy">Top 4</span>
                            </td>
                          </tr>
                          <tr class="  css-1d0u2ln">
                            <td class="  css-5q0m5i">
                              <div class="  css-1on66cs">
                                <img
                                  alt="Reece Chung"
                                  src="https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_13.jpg"
                                  class="MuiAvatar-img css-1hy9t21"
                                />
                              </div>
                              Phạm Thị Thùy Dương
                            </td>
                            <td class="  css-uj5sxh">Âu - Úc</td>
                            <td class="  css-195en1d">1,006,900,000</td>
                            <td class="  css-195en1d">
                              <span class="MuiBox-root css-u9zbc1">Top 5</span>
                            </td>
                          </tr> */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-6 py-2">
                <div className="card2">
                  <div className="w-100">
                    <div class=" p-2 mb-2">
                      <span className="fs-20 bold">Best Tour</span>
                    </div>
                    <div className="w-100">
                      <table class="  css-98kjg7 w-100">
                        <thead class="M  css-1wbz3t9">
                          <tr class="  css-1d0u2ln">
                            <th
                              class="  css-atm0a"
                              scope="col"
                              style={{ width: 300 }}
                            >
                              Tour
                            </th>

                            <th class="  css-8esqav" scope="col">
                              Tổng giá trị
                            </th>
                            <th class="  css-8esqav" scope="col">
                              Top
                            </th>
                          </tr>
                        </thead>
                        <tbody class="  css-1xnox0e">
                          <RenderBodyTour />
                          {/* <tr class="  css-1d0u2ln">
                            <td class="  css-5q0m5i">
                              <div class="  css-1on66cs">
                                <img
                                  alt="Jayvion Simon"
                                  src="https://api-prod-minimal-v510.vercel.app/assets/images/cover/cover_1.jpg"
                                  class="MuiAvatar-img css-1hy9t21"
                                />
                              </div>
                              SYDMEL7N-27042023-VN2045
                            </td>
                            <td class="  css-uj5sxh">ÚC SYDNEY-MELBOURNE</td>
                            <td class="  css-195en1d">3,322,124,000</td>
                            <td class="  css-195en1d">
                              <span class="MuiBox-root css-1yukwl8">Top 1</span>
                            </td>
                          </tr>
                          <tr class="  css-1d0u2ln">
                            <td class="  css-5q0m5i">
                              <div class="  css-1on66cs">
                                <img
                                  alt="Lucian Obrien"
                                  src="https://api-prod-minimal-v510.vercel.app/assets/images/cover/cover_2.jpg"
                                  class="MuiAvatar-img css-1hy9t21"
                                />
                              </div>
                              PBHLĐ9N-27042023-VN2200
                            </td>
                            <td class="  css-uj5sxh">
                              PHÁP - BỈ - HÀ LAN - ĐỨC
                            </td>
                            <td class="  css-195en1d">2,852,520,000</td>
                            <td class="  css-195en1d">
                              <span class="MuiBox-root css-1xt3m6d">Top 2</span>
                            </td>
                          </tr>
                          <tr class="  css-1d0u2ln">
                            <td class="  css-5q0m5i">
                              <div class="  css-1on66cs">
                                <img
                                  alt="Deja Brady"
                                  src="https://api-prod-minimal-v510.vercel.app/assets/images/cover/cover_3.jpg"
                                  class="MuiAvatar-img css-1hy9t21"
                                />
                              </div>
                              PTSY11N-25032023-QR1955
                            </td>
                            <td class="  css-uj5sxh">PHÁP - THỤY SĨ - Ý</td>
                            <td class="  css-195en1d">2,422,890,000</td>
                            <td class="  css-195en1d">
                              <span class="MuiBox-root css-1r7dlkq">Top 3</span>
                            </td>
                          </tr>
                          <tr class="  css-1d0u2ln">
                            <td class="  css-5q0m5i">
                              <div class="  css-1on66cs">
                                <img
                                  alt="Harrison Stein"
                                  src="https://api-prod-minimal-v510.vercel.app/assets/images/cover/cover_4.jpg"
                                  class="MuiAvatar-img css-1hy9t21"
                                />
                              </div>
                              TĐA13N-30052023-QR1955
                            </td>
                            <td class="  css-uj5sxh">TÂY NAM ÂU</td>
                            <td class="  css-195en1d">2,233,000,000</td>
                            <td class="  css-195en1d">
                              <span class="MuiBox-root css-viwmjy">Top 4</span>
                            </td>
                          </tr>
                          <tr class="  css-1d0u2ln">
                            <td class="  css-5q0m5i">
                              <div class="  css-1on66cs">
                                <img
                                  alt="Reece Chung"
                                  src="https://api-prod-minimal-v510.vercel.app/assets/images/cover/cover_5.jpg"
                                  class="MuiAvatar-img css-1hy9t21"
                                />
                              </div>
                              SIN3N-020623-VN1605
                            </td>
                            <td class="  css-uj5sxh">SINGAPORE</td>
                            <td class="  css-195en1d">1,276,500,000</td>
                            <td class="  css-195en1d">
                              <span class="MuiBox-root css-u9zbc1">Top 5</span>
                            </td>
                          </tr> */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
