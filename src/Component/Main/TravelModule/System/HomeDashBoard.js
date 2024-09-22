import React, { useState, useEffect, useRef } from "react";
import { IMAGES_DOMAIN } from "../../../../Services";
import { Link, useNavigate } from "react-router-dom";
import { Img } from "react-image";
import { Alertsuccess } from "../../../../Utils";

export const HomeDashBoard = () => {
  const navigate = useNavigate();
  /* useEffect(() => {
    document.querySelector(".main-header").classList.add("display-none");
    document.querySelector(".main-sidebar").classList.add("display-none");
    document.querySelector(".main-footer").classList.add("display-none");
  }, []); */
  //#region Khai báo biến
  let linkAvatar = IMAGES_DOMAIN;
  let linkoke =
    localStorage.getItem("Avatar") === null
      ? linkAvatar + "/Content/img/LogoNetco.png"
      : linkAvatar + localStorage.getItem("Avatar");
  const Creater = +localStorage.getItem("CreateBy");
  const CreaterName = localStorage.getItem("CreateName");
  const Trl_To_DashBoard = (Keys) => {
    if (Keys === 1) {
      /* document.querySelector(".main-header").classList.remove("display-none");
      document.querySelector(".main-sidebar").classList.remove("display-none");
      document.querySelector(".main-footer").classList.remove("display-none"); */

      if ([1, 15, 18, 19].includes(Creater)) {
        window.location = "/ban-lanh-dao/dashboard?id=57&dpid=0";
        return;
      }
      window.location = "/news?id=56&dpid=0";
    }
    if (Keys === 7) {
      window.location = "/cms/quan-ly-noi-dung-website";
    } else if (Keys === 2) {
      Alertsuccess("Module dang phát triển");
    } else if (Keys === 3) {
      Alertsuccess("Module dang phát triển");
    } else if (Keys === 4) {
      Alertsuccess("Module dang phát triển");
    } else if (Keys === 5) {
      Alertsuccess("Module dang phát triển");
    } else if (Keys === 6) {
      Alertsuccess("Module dang phát triển");
    }
  };

  const Logout = () => {
    localStorage.removeItem("CreateBy");
    localStorage.removeItem("CreateName");
    localStorage.removeItem("Avatar");
    localStorage.removeItem("DepartmentId");
    localStorage.removeItem("BranchId");
    navigate("/login");
  };

  return (
    <>
      <div
        className="content-wrapper d-flex flex-column align-items-center justify-content-center"
        style={{
          backgroundImage: `url("/assets/img/uc.jpg")`,
          marginLeft: "0px",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          width: "100vw",
          height: "100vh",
        }}
      >
        <div className="col-md-12 ">
          <div className="d-flex flex-column align-items-center justify-content-center my-2">
            <div className="col-md-3 d-flex flex-column align-items-center justify-content-center ">
              <Img src="dist/img/logo.png" width="180" />
            </div>
            <div class=" text-center col-md-6" style={{ paddingTop: "20px" }}>
              <span class="blind">WELCOME TO EURO TRAVEL ERP</span>
            </div>
          </div>
          <div class="row">
            <div
              class="col-lg-4 col-md-4 col-sm-6 col-xs-12  d-flex  w-100 justify-content-center mb-4 "
              onClick={(e) => Trl_To_DashBoard(1)}
            >
              <div class="setwidth w-100 ">
                <div class="hovereffect">
                  <img
                    class="img-responsive"
                    src="/assets/img/dl1.png"
                    height="150px"
                    width="150px"
                    alt=""
                  />
                  <div class="overlay">
                    <p>
                      <a href="#"> TRAVEL MANAGMENT</a>
                    </p>
                  </div>
                  <div class="rainbow">TRAVEL MANAGMENT</div>
                </div>
              </div>
            </div>
            <div
              class="col-lg-4 col-md-4 col-sm-6 col-xs-12 d-flex  w-100 justify-content-center mb-4"
              onClick={(e) => Trl_To_DashBoard(7)}
            >
              <div class="setwidth w-100">
                <div class="hovereffect">
                  <img
                    class="img-responsive"
                    src="/assets/img/SYS.png"
                    height="150px"
                    width="150px"
                    alt=""
                  />
                  <div class="overlay">
                    <p>
                      <a href="#">CMS MANAGEMENT</a>
                    </p>
                  </div>
                  <div class="rainbow">CMS MANAGEMENT</div>
                </div>
              </div>
            </div>
            <div
              class="col-lg-4 col-md-4 col-sm-6 col-xs-12  d-flex  w-100 justify-content-center mb-4"
              onClick={(e) => Trl_To_DashBoard(2)}
            >
              <div class="setwidth w-100">
                <div class="hovereffect">
                  <img
                    class="img-responsive"
                    src="/assets/img/ACM.png"
                    height="150px"
                    width="150px"
                    alt=""
                  />
                  <div class="overlay">
                    <p>
                      <a href="#">ACCOUTING MANAGEMENT</a>
                    </p>
                  </div>
                  <div class="rainbow">ACCOUTING MANAGEMENT</div>
                </div>
              </div>
            </div>
            <div
              class="col-lg-4 col-md-4 col-sm-6 col-xs-12  d-flex  w-100 justify-content-center"
              onClick={(e) => Trl_To_DashBoard(3)}
            >
              <div class="setwidth w-100">
                <div class="hovereffect">
                  <img
                    class="img-responsive"
                    src="/assets/img/chat.png"
                    height="150px"
                    width="150px"
                    alt=""
                  />
                  <div class="overlay">
                    <p>
                      <a href="#">CHAT MANAGEMENT</a>
                    </p>
                  </div>
                  <div class="rainbow">CHAT MANAGEMENT</div>
                </div>
              </div>
            </div>
            <div
              class="col-lg-4 col-md-4 col-sm-6 col-xs-12 d-flex  w-100 justify-content-center"
              onClick={(e) => Trl_To_DashBoard(4)}
            >
              <div class="setwidth w-100">
                <div class="hovereffect">
                  <img
                    class="img-responsive"
                    src="/assets/img/HRM.png"
                    height="150px"
                    width="150px"
                    alt=""
                  />
                  <div class="overlay">
                    <p>
                      <a href="#"> HRM MANAGEMENT</a>
                    </p>
                  </div>
                  <div class="rainbow">HRM MANAGEMENT</div>
                </div>
              </div>
            </div>

            <div
              class="col-lg-4 col-md-4 col-sm-6 col-xs-12  d-flex  w-100 justify-content-center"
              onClick={(e) => Trl_To_DashBoard(6)}
            >
              <div class="setwidth w-100">
                <div class="hovereffect">
                  <img
                    class="img-responsive"
                    src="/assets/img/HR.png"
                    height="150px"
                    width="150px"
                    alt=""
                  />
                  <div class="overlay">
                    <p>
                      <a href="#">SYSTEM MANAGEMENT</a>
                    </p>
                  </div>
                  <div class="rainbow">SYSTEM MANAGEMENT</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
