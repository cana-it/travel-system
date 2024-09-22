import ReactApexChart from "react-apexcharts";

export const ApexchartsSpark = ({
  label = [],
  data = [],
  color = ["#38bdf8", "#3b82f6", "#22c55e", "#ebb434"],
}) => {
  let series = [
    {
      data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14],
    },
  ];
  let options = {
    chart: {
      id: "spark2",
      type: "line",
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 2,
        opacity: 0.2,
      },
    },

    stroke: {
      curve: "smooth",
    },

    markers: {
      size: 0,
    },
    colors: color,
  };

  //   const series = data;
  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={80}
      />
    </div>
  );
};

// export default ApexChartsColumnBasic;
