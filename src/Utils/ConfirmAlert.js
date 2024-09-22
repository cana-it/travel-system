import Swal from "sweetalert2";
const AlertConfirm = (
  title,
  message,
  callback,
  textcomfirm = "Xác nhận!",
  textCancer = "Hủy bỏ",
  showCanCelButton = true,
  callback2 = () => {}
) => {
  Swal.fire({
    title: title,
    text: message,
    icon: "warning",
    showCancelButton: showCanCelButton,
    confirmButtonColor: "#28a745",
    cancelButtonColor: "#d33",
    confirmButtonText: textcomfirm,
    cancelButtonText: textCancer,
    customClass: {
      container: "z-maxx",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      callback();
    } else {
      callback2();
    }
  });
};

export const ConfirmAlert = AlertConfirm;
