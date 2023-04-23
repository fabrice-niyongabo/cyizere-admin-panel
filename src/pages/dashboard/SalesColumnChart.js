import { useEffect, useState } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";

// third-party
import ReactApexChart from "react-apexcharts";

// chart options
const columnChartOptions = {
  chart: {
    type: "bar",
    height: 430,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      columnWidth: "30%",
      borderRadius: 4,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 8,
    colors: ["transparent"],
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  },
  yaxis: {
    title: {
      text: " RWF",
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter(val) {
        return ` ${val} RWF`;
      },
    },
  },
  legend: {
    show: true,
    fontFamily: `'Public Sans', sans-serif`,
    offsetX: 10,
    offsetY: 10,
    labels: {
      useSeriesColors: false,
    },
    markers: {
      width: 16,
      height: 16,
      radius: "50%",
      offsexX: 2,
      offsexY: 2,
    },
    itemMargin: {
      horizontal: 15,
      vertical: 50,
    },
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        yaxis: {
          show: false,
        },
      },
    },
  ],
};

const SalesColumnChart = ({ transactions, orders }) => {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const warning = theme.palette.warning.main;
  const primaryMain = theme.palette.primary.main;
  const successDark = theme.palette.success.dark;

  const [series] = useState([
    {
      name: "Orders",
      data: orders
        .slice(0, 6)
        .map(
          (item) =>
            Number(item.cartTotalAmount) +
            Number(item.systemFees) +
            Number(item.deliveryFees) +
            Number(item.agentFees) +
            Number(item.packagingFees)
        ),
    },
    {
      name: "Transactions",
      data: transactions.slice(0, 6).map((item) => item.paidAmount),
    },
  ]);

  function getDayInLetter(date) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
  }

  const [options, setOptions] = useState({
    ...columnChartOptions,
    xaxis: {
      categories: orders
        .slice(0, 6)
        .map((item) => getDayInLetter(new Date(item.createdAt))),
    },
  });

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [warning, primaryMain],
      xaxis: {
        labels: {
          style: {
            colors: [
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
            ],
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary],
          },
        },
      },
      grid: {
        borderColor: line,
      },
      tooltip: {
        theme: "light",
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        labels: {
          colors: "grey.500",
        },
      },
    }));
  }, [primary, secondary, line, warning, primaryMain, successDark]);

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={430}
      />
    </div>
  );
};

export default SalesColumnChart;
