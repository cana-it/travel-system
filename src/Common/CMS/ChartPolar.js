import ReactApexChart from "react-apexcharts";

export const ChartPolar = ({
  label = [],
  data = [],
  color = ["#38bdf8", "#3b82f6", "#22c55e"],
}) => {
  let series = [11, 16, 7, 3, 14];
  let options = {
    chart: {
      height: 380,
      type: "polarArea",
    },
    plotOptions: {
      polarArea: {
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

    labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
    colors: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
  };

  //   const series = data;
  return (
    <div id="chart" style={{ width: "100%" }}>
      <ReactApexChart
        options={options}
        series={series}
        type="polarArea"
        height={400}
      />
    </div>
  );
};

// export default ApexChartsColumnBasic;
