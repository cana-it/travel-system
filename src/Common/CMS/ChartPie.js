import ReactApexChart from "react-apexcharts";

export const ChartPie = ({
  label = ["Úc", "Ý", "Mỹ", "Đức"],
  data = [15, 35, 28, 22],
  color = ["#38bdf8", "#3b82f6", "#22c55e"],
}) => {
  let series = data;
  let options = {
    chart: {
      height: 380,
      type: "donut",
    },
    plotOptions: {
      donut: {
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
              // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
              return 11950;
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

    labels: label,
    colors: color,
  };

  //   const series = data;
  return (
    <div id="chart" style={{ width: "100%" }}>
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        height={400}
      />
    </div>
  );
};

// export default ApexChartsColumnBasic;
