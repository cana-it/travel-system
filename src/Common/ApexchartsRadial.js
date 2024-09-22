import ReactApexChart from "react-apexcharts";

export const ApexchartsRadial = ({
  labels = ["Infant", "Child", "Người lớn"],
  data = [17, 27, 60],
}) => {
  let series = data;
  let options = {
    chart: {
      height: 380,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
          },
          total: {
            show: true,
            label: "Tổng",
            formatter: function (w) {
              return series.reduce((a, b) => a + b, 0);
            },
          },
        },
      },
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
    },

    labels: labels,
    colors: ["#22c55e", "#f59e0b", "#38bdf8"],
  };

  //   const series = data;
  return (
    <div id="chart" style={{ width: "100%" }}>
      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        height={400}
      />
    </div>
  );
};

// export default ApexChartsColumnBasic;
