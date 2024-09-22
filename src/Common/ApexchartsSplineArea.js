import ReactApexChart from "react-apexcharts";
import moment from "moment";

export const ApexchartsSplineArea = ({
  label = [],
  data = [],
  color = ["#38bdf8", "#3b82f6", "#22c55e"],
  serie = [
    {
      name: "Tổng doanh thu",
      data: [
        { x: new Date("01/01/2022").getTime(), y: 41 },
        { x: new Date("02/01/2022").getTime(), y: 56 },
        { x: new Date("03/01/2022").getTime(), y: 21 },
        { x: new Date("04/01/2022").getTime(), y: 80 },
        { x: new Date("05/01/2022").getTime(), y: 65 },
        { x: new Date("06/01/2022").getTime(), y: 91 },
        { x: new Date("07/01/2022").getTime(), y: 54 },
        { x: new Date("08/01/2022").getTime(), y: 41 },
        { x: new Date("09/01/2022").getTime(), y: 22 },
        { x: new Date("10/01/2022").getTime(), y: 33 },
        { x: new Date("11/01/2022").getTime(), y: 47 },
        { x: new Date("12/01/2022").getTime(), y: 65 },
      ],
    },
    {
      name: "Tổng chi phí",
      data: [
        { x: new Date("01/01/2022").getTime(), y: 40 },
        { x: new Date("02/01/2022").getTime(), y: 43 },
        { x: new Date("03/01/2022").getTime(), y: 56 },
        { x: new Date("04/01/2022").getTime(), y: 67 },
        { x: new Date("05/01/2022").getTime(), y: 34 },
        { x: new Date("06/01/2022").getTime(), y: 42 },
        { x: new Date("07/01/2022").getTime(), y: 54 },
        { x: new Date("08/01/2022").getTime(), y: 69 },
        { x: new Date("09/01/2022").getTime(), y: 43 },
        { x: new Date("10/01/2022").getTime(), y: 26 },
        { x: new Date("11/01/2022").getTime(), y: 56 },
        { x: new Date("12/01/2022").getTime(), y: 86 },
      ],
    },
  ],
}) => {
  let series = serie;

  let options = {
    chart: {
      height: 350,
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    zoom: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    xaxis: {
      type: "datetime",
      tickAmount: 12,
      min: series[0]?.data[0].x,
      max: series[0]?.data[series[0]?.data.length - 1].x,
      labels: {
        rotate: 360,
        rotateAlways: true,
        formatter: function (val, timestamp) {
          return moment(new Date(timestamp)).format("MM");
        },
      },
    },

    tooltip: {
      x: {
        format: "MM",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
        inverseColors: true,
        opacityFrom: 0.3,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
        colorStops: [],
      },
    },
    colors: ["#22c55e", "#f59e0b"],

    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
    },
  };

  //   const series = data;
  return (
    <div id="chart" style={{ width: "100%" }}>
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={350}
      />
    </div>
  );
};

// export default ApexChartsColumnBasic;
