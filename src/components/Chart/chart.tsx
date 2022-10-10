import { Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  Filler,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  TimeScale,
} from "chart.js";
import { Chart as ChartRJS } from "react-chartjs-2";
import { BTCPrices } from "../../utils/btcPrices";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns";
import { triggerAsyncId } from "async_hooks";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  zoomPlugin,
  Filler,
  TimeScale
);

export const options = {
  layout: { padding: { left: 10, right: 50 } },
  scales: {
    y: {
      beginAtZero: true,

      max:
        Math.ceil(Math.max(...BTCPrices.map((el) => el.Open + 1000)) / 1000) *
        1000,
    },
    x: {
      type: "time",
      time: { unit: "day" },
      grid: {
        //display: false
        drawOnChartArea: false,
        drawTicks: true,
        drawBorder: false,
        offset: false,
      },
      min: BTCPrices[0].Date,
      max: BTCPrices[BTCPrices.length - 1].Date,
      ticks: {
        callback: (value: any, index: any, values: any) => {
          const totalTicks = values.length - 2;
          const monthArray = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];

          const currentTick = new Date(values[index].value);
          if (currentTick.getDate() === 1) {
            return monthArray[currentTick.getMonth()];
          }
          if (currentTick.getDate() === 10 || currentTick.getDate() === 20) {
            return currentTick.getDate();
          }
          if (totalTicks < 60) {
            return currentTick.getDate();
          }
        },
        font: {
          weight: (values: any) => {
            if (values.tick.label.length === 3) return "bold";
          },
        },
      },
    },
    volume: {
      type: "linear",
      position: "right",
      min: 0,
      max: Math.max(...BTCPrices.map((el) => el.Volume)) * 10,
      grid: { display: false },
      ticks: { display: false },
    },
  },
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
};

const Chart = () => {
  const chartRef = useRef<ChartJS>(null);
  const chartRef2 = useRef<ChartJS>(null);

  const options2 = {
    layout: {
      padding: {
        left:
          chartRef.current?.chartArea.left !== undefined
            ? chartRef.current?.chartArea.left + 53
            : 53,
        right: 58,
      },
    },
    aspectRatio: 10,
    animation: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: { display: false, drawBorder: false },
        ticks: { display: false },
        max:
          Math.ceil(Math.max(...BTCPrices.map((el) => el.Open + 1000)) / 1000) *
          1000,
      },
      x: {
        type: "time",
        time: { unit: "day" },
        grid: { drawBorder: false, drawTicks: false },
        ticks: {
          callback: (value: any, index: any, values: any) => {
            const totalTicks = values.length - 2;
            const monthArray = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];

            const currentTick = new Date(values[index].value);
            if (currentTick.getDate() === 1) {
              return monthArray[currentTick.getMonth()];
            }
            if (currentTick.getDate() === 10 || currentTick.getDate() === 20) {
              return currentTick.getDate();
            }
            if (totalTicks < 60) {
              return currentTick.getDate();
            }
          },
          font: {
            weight: (values: any) => {
              if (values.tick.label.length === 3) return "bold";
            },
          },
          mirror: true,
        },
        min: BTCPrices[0].Date,
        max: BTCPrices[BTCPrices.length - 1].Date,
      },
    },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  };

  const getGradient = (ctx: any, chartArea: any, data: any, scales: any) => {
    const { left, right, top, bottom, width, height } = chartArea;
    const { x, y } = scales;
    const gradientBorder = ctx.createLinearGradient(0, 0, 0, bottom);
    let shift = y.getPixelForValue(BTCPrices[0].Open) / bottom;
    if (shift > 1) shift = 1;
    if (shift < 0) shift = 0;
    try {
      gradientBorder.addColorStop(0, "rgb(106, 173, 56)");
      gradientBorder.addColorStop(shift, "rgb(106, 173, 56)");
      gradientBorder.addColorStop(shift, "rgba(255, 63, 63, 1)");
      gradientBorder.addColorStop(1, "rgba(255, 63, 63, 1)");
    } catch {}
    return gradientBorder;
  };

  const belowGradient = (ctx: any, chartArea: any, data: any, scales: any) => {
    const { left, right, top, bottom, width, height } = chartArea;
    const { x, y } = scales;
    const gradientBackground = ctx.createLinearGradient(
      0,
      y.getPixelForValue(data.datasets[0].data[0]),
      0,
      bottom
    );
    try {
      gradientBackground.addColorStop(0, "rgba(255, 63, 63, 0)");
      gradientBackground.addColorStop(1, "rgba(255, 63, 63, 0.5)");
    } catch {}
    return gradientBackground;
  };

  const aboveGradient = (ctx: any, chartArea: any, data: any, scales: any) => {
    const { left, right, top, bottom, width, height } = chartArea;
    const { x, y } = scales;
    const gradientBackground = ctx.createLinearGradient(
      0,
      y.getPixelForValue(data.datasets[0].data[0]),
      0,
      top
    );
    try {
      gradientBackground.addColorStop(0, "rgba(106, 173, 56, 0)");
      gradientBackground.addColorStop(1, "rgba(106, 173, 56, 0.5)");
    } catch {}
    return gradientBackground;
  };

  const crosshairLine = (chart: any, event: any) => {
    const {
      canvas,
      ctx,
      chartArea: { left, right, top, bottom },
    } = chart;

    const coorX = event.offsetX;
    const coorY = event.offsetY;

    chart.update("none");
    ctx.restore();

    // if (coorX >= left && coorX <= right && coorY >= top && coorY <= bottom)
    //   canvas.style.cursor = "crosshair";
    // else canvas.style.cursor = "default";

    ctx.strokeStyle = "#666";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    ctx.beginPath();
    if (coorY >= top && coorY <= bottom && coorX >= left && coorX <= right) {
      ctx.moveTo(left, coorY);
      ctx.lineTo(right, coorY);
      ctx.stroke();

      ctx.closePath();

      ctx.beginPath();
      ctx.moveTo(coorX, top);
      ctx.lineTo(coorX, bottom);
      ctx.stroke();

      ctx.closePath();

      crosshairLabel(chart, event);
      crosshairPoint(chart, event);
    }
    ctx.setLineDash([]);
  };

  const crosshairLabel = (chart: any, event: any) => {
    const {
      ctx,
      data,
      chartArea: { top, bottom, left, right, width, height },
      scales: { x, y },
    } = chart;

    const coorX = event.offsetX;
    const coorY = event.offsetY;
    const textWidth =
      ctx.measureText(new Date(x.getValueForPixel(coorX)).toLocaleString())
        .width + 10;

    //yLabel
    ctx.beginPath();
    ctx.fillStyle = "rgba(132, 132, 132, 1)";
    ctx.fillRect(0, coorY - 8, left, 16);
    ctx.closePath();

    ctx.font = "12px sans-serif";
    ctx.fillStyle = "white";
    ctx.textBaseLine = "middle";
    ctx.textAlign = "center";
    ctx.fillText(y.getValueForPixel(coorY).toFixed(2), left / 2, coorY + 4);

    //xLabel
    ctx.beginPath();
    ctx.fillStyle = "rgba(132, 132, 132, 1)";
    ctx.fillRect(coorX - textWidth / 2, bottom, textWidth, 16);
    ctx.closePath();

    ctx.fillStyle = "white";
    ctx.fillText(
      new Date(x.getValueForPixel(coorX)).toLocaleString(),
      coorX,
      bottom + 12
    );
  };

  const crosshairPoint = (chart: any, event: any) => {
    const {
      ctx,
      data,
      chartArea: { top, bottom, left, right, width, height },
      scales: { x, y },
    } = chart;

    const coorX = event.offsetX;
    const coorY = event.offsetY;

    ctx.beginPath();
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.lineWidth = 0;
    ctx.setLineDash([]);

    const min = chart.config.options.scales.x.min;
    const max = chart.config.options.scales.x.max;

    const angle = Math.PI / 180;
    const segments =
      width /
      (BTCPrices.map((e) => e.Date).indexOf(max) -
        BTCPrices.map((e) => e.Date).indexOf(min));

    const yOpening = y.getPixelForValue(data.datasets[0].data[0]);
    let index =
      Math.floor((coorX - left) / segments) +
      BTCPrices.map((e) => e.Date).indexOf(min);
    let yStart = y.getPixelForValue(data.datasets[0].data[index]);
    let yEnd = y.getPixelForValue(data.datasets[0].data[index + 1]);
    let yInterpolation =
      yStart +
      ((yEnd - yStart) / segments) *
        (coorX - x.getPixelForValue(data.labels[index]));

    if (yInterpolation >= yOpening) ctx.fillStyle = "rgba(255, 63, 63, 1)";
    else ctx.fillStyle = "rgba(106, 173, 56, 1)";

    //draw the circle
    ctx.arc(coorX, yInterpolation, 4, angle * 0, angle * 360, false);
    ctx.fill();
    ctx.stroke();
  };

  const zoom = (chart: any, event: any) => {
    const min = chart.config.options.scales.x.min;
    const max = chart.config.options.scales.x.max;

    const timestamp = chart.scales.x.getValueForPixel(event.offsetX);
    const dayTimestamp = new Date(timestamp).setHours(0, 0, 0, 0);
    const scrollPoint = BTCPrices.map((e) =>
      new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString()
    ).indexOf(dayTimestamp.toLocaleString());

    if (event.wheelDeltaY >= 0) {
      if (
        BTCPrices.map((e) => e.Date).indexOf(min) + 1 <
        BTCPrices.map((e) => e.Date).indexOf(max) - 1
      ) {
        chart.config.options.scales.x.min =
          BTCPrices[BTCPrices.map((e) => e.Date).indexOf(min) + 1].Date;

        chart.config.options.scales.x.max =
          BTCPrices[BTCPrices.map((e) => e.Date).indexOf(max) - 1].Date;
      }

      if (
        BTCPrices.map((e) => e.Date).indexOf(min) >= scrollPoint - 4 &&
        BTCPrices.map((e) => e.Date).indexOf(min) <= scrollPoint
      )
        chart.config.options.scales.x.min = min;
      if (
        BTCPrices.map((e) => e.Date).indexOf(max) <= scrollPoint + 4 &&
        BTCPrices.map((e) => e.Date).indexOf(max) >= scrollPoint
      )
        chart.config.options.scales.x.max = max;
    }

    if (event.wheelDeltaY < 0) {
      if (BTCPrices.map((e) => e.Date).indexOf(min) - 1 !== -1)
        chart.config.options.scales.x.min =
          BTCPrices[BTCPrices.map((e) => e.Date).indexOf(min) - 1].Date;
      if (BTCPrices.map((e) => e.Date).indexOf(max) + 1 !== BTCPrices.length)
        chart.config.options.scales.x.max =
          BTCPrices[BTCPrices.map((e) => e.Date).indexOf(max) + 1].Date;
      const weekms = 86400000 * 14;
      const range = max - min;
      if (range >= weekms) {
        if (
          BTCPrices.map((e) => e.Date).indexOf(min) >= scrollPoint - 4 &&
          BTCPrices.map((e) => e.Date).indexOf(min) <= scrollPoint
        )
          chart.config.options.scales.x.min = min;
        if (
          BTCPrices.map((e) => e.Date).indexOf(max) <= scrollPoint + 4 &&
          BTCPrices.map((e) => e.Date).indexOf(max) >= scrollPoint
        )
          chart.config.options.scales.x.max = max;
      }
    }

    chart.update("none");
  };

  const zoomBox = (min: any, max: any) => {
    chartRef2.current?.update("none");
    const {
      ctx,
      canvas,
      chartArea: { top, bottom, left, right, width, height },
      scales: { x, y },
    } = chartRef2.current as any;

    if (min === undefined) min = BTCPrices[0].Date;
    if (max === undefined) max = BTCPrices[BTCPrices.length - 1].Date;

    //this blue slider
    const zoomBoxItem = (min: any, max: any) => {
      if (min === undefined || min === -1) min = BTCPrices[0].Date;
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = "rgba(54, 162, 235, 0.4)";
      ctx.fillRect(
        x.getPixelForValue(new Date(min)),
        top,
        x.getPixelForValue(new Date(max)) - x.getPixelForValue(new Date(min)),
        height
      );
      ctx.closePath();
      ctx.restore();

      const angle = Math.PI / 180;

      ctx.beginPath();
      ctx.strokeStyle = "rgba(54, 162, 235, 1)";
      ctx.fillStyle = "#fff";
      ctx.arc(
        x.getPixelForValue(new Date(min)),
        height / 2,
        7,
        angle * 0,
        angle * 360,
        false
      );
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      ctx.restore();

      ctx.strokeStyle = "rgba(54, 162, 235, 1)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x.getPixelForValue(new Date(min)) - 2, height / 2 - 3.5);
      ctx.lineTo(x.getPixelForValue(new Date(min)) - 2, height / 2 + 3.5);
      ctx.stroke();
      ctx.restore();

      ctx.strokeStyle = "rgba(54, 162, 235, 1)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x.getPixelForValue(new Date(min)) + 2, height / 2 - 3.5);
      ctx.lineTo(x.getPixelForValue(new Date(min)) + 2, height / 2 + 3.5);
      ctx.stroke();
      ctx.restore();

      ctx.beginPath();
      ctx.strokeStyle = "rgba(54, 162, 235, 1)";
      ctx.fillStyle = "#fff";
      ctx.arc(
        x.getPixelForValue(new Date(max)),
        height / 2,
        7,
        angle * 0,
        angle * 360,
        false
      );
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      ctx.restore();

      ctx.strokeStyle = "rgba(54, 162, 235, 1)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x.getPixelForValue(new Date(max)) - 2, height / 2 - 3.5);
      ctx.lineTo(x.getPixelForValue(new Date(max)) - 2, height / 2 + 3.5);
      ctx.stroke();
      ctx.restore();

      ctx.strokeStyle = "rgba(54, 162, 235, 1)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x.getPixelForValue(new Date(max)) + 2, height / 2 - 3.5);
      ctx.lineTo(x.getPixelForValue(new Date(max)) + 2, height / 2 + 3.5);
      ctx.stroke();
      ctx.restore();
      //chartRef2.current?.update("none");
    };
    zoomBoxItem(min, max);

    canvas.addEventListener("mousemove", (e: any) => {
      //changing cursor on slider
      mouseCursor(e);
    });

    //changing cursor on slider
    const mouseCursor = (event: any) => {
      if (
        chartRef.current?.config?.options?.scales?.x?.min !== undefined &&
        chartRef.current?.config?.options?.scales?.x?.max !== undefined
      ) {
        let minChart1 = chartRef.current?.config?.options?.scales?.x?.min;
        if (minChart1 === undefined || minChart1 === -1)
          minChart1 = BTCPrices[0].Date;

        if (
          (event.offsetX > x.getPixelForValue(new Date(minChart1)) - 7 &&
            event.offsetX <= x.getPixelForValue(new Date(minChart1)) + 7) ||
          (event.offsetX >
            x.getPixelForValue(
              new Date(chartRef.current?.config?.options?.scales?.x?.max)
            ) -
              7 &&
            event.offsetX <=
              x.getPixelForValue(
                new Date(chartRef.current?.config?.options?.scales?.x?.max)
              ) +
                7)
        )
          canvas.style.cursor = "ew-resize";
        else if (
          event.offsetX > x.getPixelForValue(new Date(minChart1)) + 7 &&
          event.offsetX <
            x.getPixelForValue(
              new Date(chartRef.current?.config?.options?.scales?.x?.max)
            ) -
              7
        )
          canvas.style.cursor = "move";
        else canvas.style.cursor = "default";
      }
    };

    canvas.addEventListener("mousedown", (e: any) => {
      dragStart(e);
    });

    (window as any).addEventListener("mouseup", (e: any) => {
      canvas.onmousemove = null;
    });

    //making it slide
    const dragStart = (event: any) => {
      if (
        chartRef.current?.config?.options?.scales?.x?.min !== undefined &&
        chartRef.current?.config?.options?.scales?.x?.max !== undefined
      ) {
        let minChart1 = chartRef.current?.config?.options?.scales?.x?.min;
        if (minChart1 === undefined || minChart1 === -1)
          minChart1 = BTCPrices[0].Date;
        let maxChart1 = chartRef.current?.config?.options?.scales?.x?.max;
        if (maxChart1 === undefined || maxChart1 === -1)
          maxChart1 = BTCPrices[BTCPrices.length - 1].Date;
        //left side
        if (
          event.offsetX >= x.getPixelForValue(new Date(minChart1)) - 7 &&
          event.offsetX <= x.getPixelForValue(new Date(minChart1)) + 7
        ) {
          canvas.onmousemove = (e: any) => {
            dragMove(chartRef.current, e);
          };

          const dragMove = (chart: any, event: any) => {
            const timestamp = x.getValueForPixel(event.offsetX);
            const dayTimestamp = new Date(timestamp).setHours(0, 0, 0, 0);
            let scrollPoint = BTCPrices.map((e) =>
              new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString()
            ).indexOf(dayTimestamp.toLocaleString());

            //if too much on left
            if (event.offsetX < left && scrollPoint === -1) scrollPoint = 0;

            //if too much on right
            if (
              event.offsetX > right &&
              scrollPoint === -1 &&
              chartRef.current?.config?.options?.scales?.x?.max !== undefined
            ) {
              scrollPoint =
                BTCPrices.map((e) =>
                  new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString()
                ).indexOf(
                  new Date(chartRef.current?.config?.options?.scales?.x?.max)
                    .setHours(0, 0, 0, 0)
                    .toLocaleString()
                ) - 4;
            }

            //if left one is beyond the right one
            if (
              chartRef.current?.config.options?.scales?.x?.max !== undefined
            ) {
              if (
                scrollPoint >
                BTCPrices.map((e) =>
                  new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString()
                ).indexOf(
                  new Date(chartRef.current?.config.options?.scales.x.max)
                    .setHours(0, 0, 0, 0)
                    .toLocaleString()
                ) -
                  4
              ) {
                scrollPoint =
                  BTCPrices.map((e) =>
                    new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString()
                  ).indexOf(
                    new Date(chartRef.current?.config.options?.scales.x.max)
                      .setHours(0, 0, 0, 0)
                      .toLocaleString()
                  ) - 4;
              }
            }
            if (
              chartRef.current?.config?.options?.scales?.x?.min !== undefined
            ) {
              //updating the chart
              chartRef.current.config.options.scales.x.min =
                BTCPrices[scrollPoint].Date;
            }

            chartRef.current?.update("none");
            chartRef2.current?.update("none");
            //updating the slider
            zoomBoxItem(
              BTCPrices[scrollPoint].Date,
              chartRef.current?.config?.options?.scales?.x?.max
            );
          };
        }

        //right side
        if (
          event.offsetX >=
            x.getPixelForValue(
              new Date(chartRef.current?.config?.options?.scales?.x?.max)
            ) -
              7 &&
          event.offsetX <=
            x.getPixelForValue(
              new Date(chartRef.current?.config?.options?.scales?.x?.max)
            ) +
              7
        ) {
          canvas.onmousemove = (e: any) => {
            dragMove(chartRef.current, e);
          };

          const dragMove = (chart: any, event: any) => {
            const timestamp = x.getValueForPixel(event.offsetX);
            const dayTimestamp = new Date(timestamp).setHours(0, 0, 0, 0);
            let scrollPoint = BTCPrices.map((e) =>
              //new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString()
              new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString()
            ).indexOf(dayTimestamp.toLocaleString());

            //too much on right
            if (
              event.offsetX > right &&
              scrollPoint === -1 &&
              chartRef.current?.config?.options?.scales?.x?.min !== undefined
            )
              scrollPoint = BTCPrices.length - 1;

            //too much on left
            if (
              event.offsetX < left &&
              scrollPoint === -1 &&
              chartRef.current?.config?.options?.scales?.x?.min !== undefined
            ) {
              scrollPoint =
                BTCPrices.map((e) =>
                  new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString()
                ).indexOf(
                  new Date(chartRef.current?.config?.options?.scales?.x?.min)
                    .setHours(0, 0, 0, 0)
                    .toLocaleString()
                ) + 4;
            }

            //the right slider is beyond the left one
            if (
              chartRef.current?.config.options?.scales?.x?.min !== undefined
            ) {
              if (
                scrollPoint <
                BTCPrices.map((e) =>
                  new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString()
                ).indexOf(
                  new Date(chartRef.current?.config.options?.scales.x.min)
                    .setHours(0, 0, 0, 0)
                    .toLocaleString()
                ) +
                  4
              )
                scrollPoint =
                  BTCPrices.map((e) =>
                    new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString()
                  ).indexOf(
                    new Date(chartRef.current?.config.options?.scales.x.min)
                      .setHours(0, 0, 0, 0)
                      .toLocaleString()
                  ) + 4;
            }

            if (
              chartRef.current?.config?.options?.scales?.x?.max !== undefined
            ) {
              //updating the chart
              chartRef.current.config.options.scales.x.max =
                BTCPrices[scrollPoint].Date;
            }

            chartRef.current?.update("none");
            chartRef2.current?.update("none");
            //updating the slider
            zoomBoxItem(
              chartRef.current?.config?.options?.scales?.x?.min,
              BTCPrices[scrollPoint].Date
            );
          };
        }

        //chartRef.current?.update("none");
        if (
          event.offsetX >
            x.getPixelForValue(
              new Date(chartRef.current?.config?.options?.scales?.x?.min)
            ) +
              8 &&
          event.offsetX <
            x.getPixelForValue(
              new Date(chartRef.current?.config?.options?.scales?.x?.max)
            ) -
              8
        ) {
          canvas.onmousemove = (e: any) => {
            dragMoveCenter(chartRef.current, e, minChart1, maxChart1);
          };
        }
        const dragMoveCenter = (
          chart: any,
          e: any,
          staticScaleMin: any,
          staticScaleMax: any
        ) => {
          //starting point
          const dragStartingPoint = x.getValueForPixel(event.offsetX);
          const dayDragStartingPoint = new Date(dragStartingPoint).setHours(
            0,
            0,
            0,
            0
          );
          let startingPointIndex = BTCPrices.map((e) =>
            new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString()
          ).indexOf(dayDragStartingPoint.toLocaleString());

          //difference
          const timestamp = x.getValueForPixel(e.offsetX);
          const dayTimestamp = new Date(timestamp).setHours(0, 0, 0, 0);
          let scrollPoint = BTCPrices.map((e) =>
            new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString()
          ).indexOf(dayTimestamp.toLocaleString());

          const difference = scrollPoint - startingPointIndex;

          if (scrollPoint === -1 && e.offsetX >= right) {
            scrollPoint = BTCPrices.length - 1;
          }

          const range =
            BTCPrices.map((e) =>
              new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString()
            ).indexOf(
              new Date(staticScaleMin).setHours(0, 0, 0, 0).toLocaleString()
            ) -
            BTCPrices.map((e) =>
              new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString()
            ).indexOf(
              new Date(staticScaleMax).setHours(0, 0, 0, 0).toLocaleString()
            );

          const minVal =
            BTCPrices.map((e) =>
              new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString()
            ).indexOf(
              new Date(staticScaleMax).setHours(0, 0, 0, 0).toLocaleString()
            ) +
            difference -
            range;

          const maxVal =
            BTCPrices.map((e) =>
              new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString()
            ).indexOf(
              new Date(staticScaleMax).setHours(0, 0, 0, 0).toLocaleString()
            ) + difference;

          let minChart1;
          let maxChart1;
          if (minVal < 0 && e.offsetX < right) {
            minChart1 = BTCPrices[0].Date;
            maxChart1 = BTCPrices[range].Date;
          } else if (
            maxVal >= BTCPrices.length - 1 ||
            (difference < 0 && e.offsetX >= right)
          ) {
            minChart1 = BTCPrices[BTCPrices.length - 1 - range].Date;
            maxChart1 = BTCPrices[BTCPrices.length - 1].Date;
          } else {
            minChart1 =
              BTCPrices[
                BTCPrices.map((e) =>
                  new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString()
                ).indexOf(
                  new Date(staticScaleMin).setHours(0, 0, 0, 0).toLocaleString()
                ) + difference
              ].Date;
            maxChart1 =
              BTCPrices[
                BTCPrices.map((e) =>
                  new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString()
                ).indexOf(
                  new Date(staticScaleMax).setHours(0, 0, 0, 0).toLocaleString()
                ) + difference
              ].Date;
          }

          // let difference2 = 0;

          // if (e.movementX > 0) difference2 = 1;
          // if (e.movementX < 0) difference2 = -1;

          // let minChart1 =
          //   BTCPrices[
          //     BTCPrices.map((e) =>
          //       new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString()
          //     ).indexOf(
          //       new Date(chart.config.options.scales.x.min)
          //         .setHours(0, 0, 0, 0)
          //         .toLocaleString()
          //     ) + difference
          //   ].Date;
          // let maxChart1 =
          //   BTCPrices[
          //     BTCPrices.map((e) =>
          //       new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString()
          //     ).indexOf(
          //       new Date(chart.config.options.scales.x.max)
          //         .setHours(0, 0, 0, 0)
          //         .toLocaleString()
          //     ) + difference
          //   ].Date;

          if (maxChart1 === undefined)
            maxChart1 = BTCPrices[BTCPrices.length - 1].Date;

          if (minChart1 === undefined) maxChart1 = BTCPrices[0].Date;

          // if (minChart1 === BTCPrices[0].Date) {
          //   chart.config.options.scales.x.min = BTCPrices[0].Date;
          //   chart.config.options.scales.x.max =
          //     chart.config.options.scales.x.max;
          // } else if (maxChart1 === BTCPrices[BTCPrices.length - 1].Date) {
          //   chart.config.options.scales.x.min =
          //     chart.config.options.scales.x.min;
          //   chart.config.options.scales.x.max =
          //     BTCPrices[BTCPrices.length - 1].Date;
          // } else if (
          //   chart.config.options.scales.x.min > BTCPrices[0].Date &&
          //   chart.config.options.scales.x.max <
          //     BTCPrices[BTCPrices.length - 1].Date
          // ) {
          chart.config.options.scales.x.min = minChart1;
          chart.config.options.scales.x.max = maxChart1;
          //}

          chartRef.current?.update("none");
          chartRef2.current?.update("none");
          //updating the slider
          zoomBoxItem(minChart1, maxChart1);
        };
      }
    };
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.canvas.addEventListener("mousemove", (e: any) => {
        crosshairLine(chartRef.current, e);
      });
      chartRef.current.canvas.addEventListener("wheel", (e: any) => {
        zoom(chartRef.current, e);
        zoomBox(
          chartRef.current?.config.options?.scales?.x?.min,
          chartRef.current?.config.options?.scales?.x?.max
        );
        e.preventDefault();
      });
      zoomBox(BTCPrices[0].Date, BTCPrices[BTCPrices.length - 1].Date);
      (window as any).addEventListener("resize", (e: any) => {
        chartRef2.current?.resize();
        if (chartRef.current?.config.options?.scales?.x?.min !== undefined)
          zoomBox(
            chartRef.current?.config.options?.scales.x?.min,
            chartRef.current?.config.options?.scales.x?.max
          );
      });
    }
  }, []);

  const data = {
    labels: BTCPrices.map((el) => {
      const date = new Date(el.Date);
      date.setHours(0, 0, 0, 0);
      return date;
    }),
    datasets: [
      {
        label: "Weekly Sales",
        data: BTCPrices.map((el) => el.Open),
        fill: {
          target: { value: BTCPrices[0].Open },
          below: (context: any) => {
            const chart = context.chart;
            const { ctx, chartArea, data, scales } = chart;
            if (!chartArea) return null;
            return belowGradient(ctx, chartArea, data, scales);
          },
          above: (context: any) => {
            const chart = context.chart;
            const { ctx, chartArea, data, scales } = chart;
            if (!chartArea) return null;
            return aboveGradient(ctx, chartArea, data, scales);
          },
        },
        borderColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea, data, scales } = chart;
          if (!chartArea) return null;
          return getGradient(ctx, chartArea, data, scales);
        },
        tension: 0,
        pointRadius: 0,
        pointHitRadius: 0,
        pointHoverRadius: 0,
        borderWidth: 2,
      },
      {
        label: "Stock Volume",
        type: "bar",
        data: BTCPrices.map((el) => el.Volume),
        pointRadius: 0,
        pointHitRadius: 0,
        pointHoverRadius: 0,
        yAxisID: "volume",
        barPercentage: 0.9,
        categoryPercentage: 1,
      },
    ],
  };

  const data2 = {
    labels: BTCPrices.map((el) => {
      const date = new Date(el.Date);
      date.setHours(0, 0, 0, 0);
      return date;
    }),
    datasets: [
      {
        data: BTCPrices.map((el) => el.Open),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        tension: 0,
        pointRadius: 0,
        pointHitRadius: 0,
        pointHoverRadius: 0,
        borderWidth: 1,
        width: "100%",
      },
    ],
  };

  const dottedLine = {
    id: "dottedLine",
    beforeDatasetsDraw(chart: any, args: any, pluginOptions: any) {
      const {
        ctx,
        data,
        chartArea: { left, right, width },
        scales: { x, y },
      } = chart;

      const startingPoint = data.datasets[0].data[0];

      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.setLineDash([1, 5]);
      ctx.strokeStyle = "rgba(102, 102, 102, 1)";
      ctx.moveTo(left, y.getPixelForValue(startingPoint));
      ctx.lineTo(right, y.getPixelForValue(startingPoint));
      ctx.stroke();
      ctx.closePath();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.fillStyle = "rgba(102, 102, 102, 1)";
      ctx.fillRect(0, y.getPixelForValue(startingPoint) - 8, left, 16);
      ctx.closePath();

      ctx.font = "12px sans-serif";
      ctx.fillStyle = "white";
      ctx.baseLine = "middle";
      ctx.textAlign = "center";
      ctx.fillText(
        startingPoint.toFixed(2),
        left / 2,
        y.getPixelForValue(startingPoint) + 4
      );
    },
  };

  // const customTickMarks = {
  //   id: "customTickMarks",
  //   beforeDatasetsDraw(chart: any, args: any, pluginOptions: any) {
  //     const {
  //       ctx,
  //       data,
  //       chartArea: { bottom },
  //       scales: { x, y },
  //     } = chart;

  //     ctx.save();

  //     const startTick = BTCPrices.map((el) =>
  //       new Date(el.Date).setHours(0, 0, 0, 0).toLocaleString()
  //     ).indexOf(new Date(x.min).setHours(0, 0, 0, 0).toLocaleString());
  //     const endTick = BTCPrices.map((el) =>
  //       new Date(el.Date).setHours(0, 0, 0, 0).toLocaleString()
  //     ).indexOf(new Date(x.max).setHours(0, 0, 0, 0).toLocaleString());
  //     const totalTicks = endTick - startTick;

  //     BTCPrices.map((el) => el.Date).forEach((date: any, index: any) => {
  //       ctx.beginPath();
  //       ctx.strokeStyle = "rgba(102, 102, 102, 0.5)";
  //       ctx.lineWidth = 1;
  //       if (new Date(date).getDate() === 1) {
  //         ctx.moveTo(x.getPixelForValue(new Date(date)), bottom);
  //         ctx.lineTo(x.getPixelForValue(new Date(date)), bottom + 8);
  //       }
  //       if (
  //         new Date(date).getDate() === 10 ||
  //         new Date(date).getDate() === 20
  //       ) {
  //         ctx.moveTo(x.getPixelForValue(new Date(date)), bottom);
  //         ctx.lineTo(x.getPixelForValue(new Date(date)), bottom + 8);
  //       }

  //       if (totalTicks < 60) {
  //         ctx.moveTo(x.getPixelForValue(new Date(date)), bottom);
  //         ctx.lineTo(x.getPixelForValue(new Date(date)), bottom + 8);
  //       }
  //       ctx.stroke();
  //       ctx.closePath();
  //       ctx.restore();
  //     });
  //   },
  // };

  const customTooltip = {
    id: "customTooltip",
    afterDraw(chart: any, args: any, pluginOptions: any) {
      const {
        ctx,
        chartArea: { top, bottom, left, right, width, height },
        scales: { x, y },
      } = chart;

      chart.canvas.addEventListener("mousemove", (e: any) => {
        tooltipPosition(chart, e);
      });

      ctx.save();

      const tooltipPosition = (chart: any, e: any) => {
        ctx.beginPath();
        ctx.fillStyle = "rgba(102, 102, 102, 0.2)";
        ctx.strokeStyle = "rgba(102, 102, 102, 0.2)";
        ctx.lineJoin = "round";
        ctx.lineWidth = 5;
        ctx.fillRect(e.offsetX + 10, e.offsetY + 10, 150, 50);
        ctx.strokeRect(e.offsetX + 10, e.offsetY + 10, 150, 50);
        ctx.closePath();
        ctx.restore();
      };
    },
  };

  return (
    <Flex
      color="rgba(255, 255, 255, 0.5)"
      w="100%"
      borderRadius="4px"
      border="1px solid #4E4F52"
      flexDirection="column"
      p="30px"
      position="relative"
      bgColor="white"
      overflow="visible"
    >
      <ChartRJS
        type="line"
        data={data as any}
        options={options as any}
        plugins={[dottedLine, customTooltip]}
        ref={chartRef}
      />
      <ChartRJS
        type="line"
        data={data2 as any}
        options={options2 as any}
        plugins={[]}
        ref={chartRef2}
      />
    </Flex>
  );
};

export default Chart;
