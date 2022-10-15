//import { useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { Chart as ChartJS, Filler, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Tooltip, LineController, BarController, TimeScale, } from "chart.js";
import { Chart as ChartRJS } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns";
ChartJS.register(LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Tooltip, LineController, BarController, zoomPlugin, Filler, TimeScale);
export const defaultColors = {
    above: "rgb(106, 173, 56)",
    below: "rgb(255, 63, 63)",
    barChart: "#ccc",
    tooltip: "rgb(102, 102, 102)",
    tooltipDate: "white",
    tooltipTime: "lightgrey",
    tooltipData: "lightgrey",
    xLabel: "rgb(102, 102, 102)",
    yLabel: "rgb(102, 102, 102)",
    openLabel: "rgba(102, 102, 102, 0.7)",
    minChartLine: "rgb(54, 162, 235)",
    minChartBackground: "rgba(54, 162, 235, 0.2)",
    slide: "rgba(54, 162, 235, 0.4)",
};
const Chart = ({ colors = {
    above: "rgb(106, 173, 56)",
    below: "rgb(255, 63, 63)",
    barChart: "#ccc",
    tooltip: "rgb(102, 102, 102)",
    tooltipDate: "white",
    tooltipTime: "lightgrey",
    tooltipData: "lightgrey",
    xLabel: "rgb(102, 102, 102)",
    yLabel: "rgb(102, 102, 102)",
    openLabel: "rgba(102, 102, 102, 0.7)",
    minChartLine: "rgb(54, 162, 235)",
    minChartBackground: "rgba(54, 162, 235, 0.2)",
    slide: "rgba(54, 162, 235, 0.4)",
}, font = "Arial", dataset, currency = "USD", }) => {
    const chartRef = useRef(null);
    const chartRef2 = useRef(null);
    const barChartColor = colors.barChart;
    const slideColor = colors.slide;
    ChartJS.defaults.font.family = `'FontAwesome', '${font}', 'Arial', 'sans-serif'`;
    const getGradient = (ctx, chartArea, data, scales) => {
        const { bottom } = chartArea;
        const { y } = scales;
        const gradientBorder = ctx.createLinearGradient(0, 0, 0, bottom);
        let shift = y.getPixelForValue(dataset[0].Open) / bottom;
        if (shift > 1)
            shift = 1;
        if (shift < 0)
            shift = 0;
        try {
            gradientBorder.addColorStop(0, colors.above);
            gradientBorder.addColorStop(shift, colors.above);
            gradientBorder.addColorStop(shift, colors.below);
            gradientBorder.addColorStop(1, colors.below);
        }
        catch (_a) { }
        return gradientBorder;
    };
    const belowGradient = (ctx, chartArea, data, scales) => {
        const { bottom } = chartArea;
        const { y } = scales;
        const gradientBackground = ctx.createLinearGradient(0, y.getPixelForValue(data.datasets[0].data[0]), 0, bottom);
        try {
            gradientBackground.addColorStop(0, "rgba(255, 63, 63, 0)");
            gradientBackground.addColorStop(1, "rgba(255, 63, 63, 0.5)");
        }
        catch (_a) { }
        return gradientBackground;
    };
    const aboveGradient = (ctx, chartArea, data, scales) => {
        const { top } = chartArea;
        const { y } = scales;
        const gradientBackground = ctx.createLinearGradient(0, y.getPixelForValue(data.datasets[0].data[0]), 0, top);
        try {
            gradientBackground.addColorStop(0, "rgba(106, 173, 56, 0)");
            gradientBackground.addColorStop(1, "rgba(106, 173, 56, 0.5)");
        }
        catch (_a) { }
        return gradientBackground;
    };
    const crosshairLine = (chart, event) => {
        const { ctx, chartArea: { left, right, top, bottom }, } = chart;
        const coorX = event.offsetX;
        const coorY = event.offsetY;
        chart.update("none");
        ctx.restore();
        ctx.strokeStyle = "#666";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        if (coorY >= top && coorY <= bottom && coorX >= left && coorX <= right) {
            ctx.beginPath();
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
    const crosshairLabel = (chart, event) => {
        const { ctx, chartArea: { bottom, left, right }, scales: { x, y }, } = chart;
        const coorX = event.offsetX;
        const coorY = event.offsetY;
        const textWidth = ctx.measureText(new Date(x.getValueForPixel(coorX)).toLocaleString())
            .width + 10;
        //yLabel
        ctx.beginPath();
        ctx.fillStyle = colors.yLabel;
        ctx.fillRect(0, coorY - 8, left, 16);
        ctx.closePath();
        ctx.font = "12px Sora";
        ctx.fillStyle = "white";
        ctx.textBaseLine = "middle";
        ctx.textAlign = "center";
        ctx.fillText(y.getValueForPixel(coorY).toFixed(2), left / 2, coorY + 4);
        //xLabel
        let xPosition;
        if (coorX > right - textWidth / 2)
            xPosition = right - textWidth;
        else if (coorX < left + textWidth / 2)
            xPosition = left;
        else
            xPosition = coorX - textWidth / 2;
        ctx.beginPath();
        ctx.fillStyle = colors.xLabel;
        ctx.fillRect(xPosition, bottom, textWidth, 16);
        ctx.closePath();
        ctx.fillStyle = "white";
        ctx.fillText(new Date(x.getValueForPixel(coorX)).toLocaleString(), xPosition + textWidth / 2, bottom + 12);
    };
    const crosshairPoint = (chart, event) => {
        const { ctx, data, chartArea: { left, right, width }, scales: { x, y }, } = chart;
        const coorX = event.offsetX;
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 0, 0, 0)";
        ctx.lineWidth = 0;
        ctx.setLineDash([]);
        const min = chart.config.options.scales.x.min;
        const max = chart.config.options.scales.x.max;
        const angle = Math.PI / 180;
        const leftOffset = x.getPixelForValue(x.min) - left;
        const rightOffset = right - x.getPixelForValue(x.max);
        const width2 = width - (leftOffset + rightOffset);
        const segments = width2 /
            (dataset.map((e) => e.Date).indexOf(max) -
                dataset.map((e) => e.Date).indexOf(min));
        const yOpening = y.getPixelForValue(data.datasets[0].data[0]);
        let index = Math.floor((coorX - (left + leftOffset)) / segments) +
            dataset.map((e) => e.Date).indexOf(min);
        let yStart = y.getPixelForValue(data.datasets[0].data[index]);
        let yEnd = y.getPixelForValue(data.datasets[0].data[index + 1]);
        let yInterpolation = yStart +
            ((yEnd - yStart) / segments) *
                (coorX - x.getPixelForValue(data.labels[index]));
        if (yInterpolation >= yOpening)
            ctx.fillStyle = colors.below;
        else
            ctx.fillStyle = colors.above;
        //draw the circle
        ctx.arc(coorX, yInterpolation, 4, angle * 0, angle * 360, false);
        ctx.fill();
        ctx.stroke();
    };
    const zoom = (chart, event) => {
        const min = chart.config.options.scales.x.min;
        const max = chart.config.options.scales.x.max;
        const minIndex = dataset.map((e) => e.Date).indexOf(min);
        const maxIndex = dataset.map((e) => e.Date).indexOf(max);
        const timestamp = chart.scales.x.getValueForPixel(event.offsetX);
        const dayTimestamp = new Date(timestamp).setHours(0, 0, 0, 0);
        const scrollPoint = dataset
            .map((e) => new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString())
            .indexOf(dayTimestamp.toLocaleString());
        //zoom in
        if (event.wheelDeltaY >= 0) {
            if (minIndex + 1 < maxIndex - 1) {
                chart.config.options.scales.x.min = dataset[minIndex + 1].Date;
                chart.config.options.scales.x.max = dataset[maxIndex - 1].Date;
            }
            if (minIndex >= scrollPoint - 8 && minIndex <= scrollPoint)
                chart.config.options.scales.x.min = min;
            if (maxIndex <= scrollPoint + 8 && maxIndex >= scrollPoint)
                chart.config.options.scales.x.max = max;
        }
        //zoom out
        if (event.wheelDeltaY < 0) {
            if (minIndex - 1 !== -1)
                chart.config.options.scales.x.min = dataset[minIndex - 1].Date;
            if (maxIndex + 1 !== dataset.length)
                chart.config.options.scales.x.max = dataset[maxIndex + 1].Date;
            const weekms = 86400000 * 14;
            const range = max - min;
            if (range >= weekms) {
                if (minIndex >= scrollPoint - 8 && minIndex <= scrollPoint)
                    chart.config.options.scales.x.min = min;
                if (maxIndex <= scrollPoint + 8 && maxIndex >= scrollPoint)
                    chart.config.options.scales.x.max = max;
            }
        }
        chart.update("none");
    };
    const zoomBox = (min, max) => {
        var _a;
        (_a = chartRef2.current) === null || _a === void 0 ? void 0 : _a.update("none");
        const { ctx, canvas, chartArea: { top, left, right, height }, scales: { x }, } = chartRef2.current;
        const radius = 7;
        if (min === undefined)
            min = dataset[0].Date;
        if (max === undefined)
            max = dataset[dataset.length - 1].Date;
        //this blue slider
        const zoomBoxItem = (min, max) => {
            if (min === undefined || min === -1)
                min = dataset[0].Date;
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = slideColor;
            ctx.fillRect(x.getPixelForValue(new Date(min)), top, x.getPixelForValue(new Date(max)) - x.getPixelForValue(new Date(min)), height);
            ctx.closePath();
            ctx.restore();
            const angle = Math.PI / 180;
            const slideDot = (radius, xPosition) => {
                ctx.beginPath();
                ctx.strokeStyle = colors.minChartLine;
                ctx.fillStyle = "#fff";
                ctx.arc(x.getPixelForValue(xPosition), height / 2, radius, angle * 0, angle * 360, false);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
                ctx.strokeStyle = colors.minChartLine;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(x.getPixelForValue(xPosition) - 2, height / 2 - radius / 2);
                ctx.lineTo(x.getPixelForValue(xPosition) - 2, height / 2 + radius / 2);
                ctx.stroke();
                ctx.restore();
                ctx.strokeStyle = colors.minChartLine;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(x.getPixelForValue(xPosition) + 2, height / 2 - radius / 2);
                ctx.lineTo(x.getPixelForValue(xPosition) + 2, height / 2 + radius / 2);
                ctx.stroke();
                ctx.restore();
            };
            slideDot(radius, new Date(min));
            slideDot(radius, new Date(max));
        };
        zoomBoxItem(min, max);
        canvas.addEventListener("mousemove", (e) => {
            //changing cursor on slider
            mouseCursor(e);
        });
        //changing cursor on slider
        const mouseCursor = (event) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
            if (((_e = (_d = (_c = (_b = (_a = chartRef.current) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.scales) === null || _d === void 0 ? void 0 : _d.x) === null || _e === void 0 ? void 0 : _e.min) !== undefined &&
                ((_k = (_j = (_h = (_g = (_f = chartRef.current) === null || _f === void 0 ? void 0 : _f.config) === null || _g === void 0 ? void 0 : _g.options) === null || _h === void 0 ? void 0 : _h.scales) === null || _j === void 0 ? void 0 : _j.x) === null || _k === void 0 ? void 0 : _k.max) !== undefined) {
                let minChart1 = (_q = (_p = (_o = (_m = (_l = chartRef.current) === null || _l === void 0 ? void 0 : _l.config) === null || _m === void 0 ? void 0 : _m.options) === null || _o === void 0 ? void 0 : _o.scales) === null || _p === void 0 ? void 0 : _p.x) === null || _q === void 0 ? void 0 : _q.min;
                if (minChart1 === undefined || minChart1 === -1)
                    minChart1 = dataset[0].Date;
                if ((event.offsetX > x.getPixelForValue(new Date(minChart1)) - radius &&
                    event.offsetX <=
                        x.getPixelForValue(new Date(minChart1)) + radius) ||
                    (event.offsetX >
                        x.getPixelForValue(new Date((_v = (_u = (_t = (_s = (_r = chartRef.current) === null || _r === void 0 ? void 0 : _r.config) === null || _s === void 0 ? void 0 : _s.options) === null || _t === void 0 ? void 0 : _t.scales) === null || _u === void 0 ? void 0 : _u.x) === null || _v === void 0 ? void 0 : _v.max)) -
                            radius &&
                        event.offsetX <=
                            x.getPixelForValue(new Date((_0 = (_z = (_y = (_x = (_w = chartRef.current) === null || _w === void 0 ? void 0 : _w.config) === null || _x === void 0 ? void 0 : _x.options) === null || _y === void 0 ? void 0 : _y.scales) === null || _z === void 0 ? void 0 : _z.x) === null || _0 === void 0 ? void 0 : _0.max)) +
                                radius))
                    canvas.style.cursor = "ew-resize";
                else if (event.offsetX > x.getPixelForValue(new Date(minChart1)) + radius &&
                    event.offsetX <
                        x.getPixelForValue(new Date((_5 = (_4 = (_3 = (_2 = (_1 = chartRef.current) === null || _1 === void 0 ? void 0 : _1.config) === null || _2 === void 0 ? void 0 : _2.options) === null || _3 === void 0 ? void 0 : _3.scales) === null || _4 === void 0 ? void 0 : _4.x) === null || _5 === void 0 ? void 0 : _5.max)) -
                            radius)
                    canvas.style.cursor = "move";
                else
                    canvas.style.cursor = "default";
            }
        };
        canvas.addEventListener("mousedown", (e) => {
            dragStart(e);
        });
        window.addEventListener("mouseup", (e) => {
            canvas.onmousemove = null;
        });
        //making it slide
        const dragStart = (event) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15;
            if (((_e = (_d = (_c = (_b = (_a = chartRef.current) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.scales) === null || _d === void 0 ? void 0 : _d.x) === null || _e === void 0 ? void 0 : _e.min) !== undefined &&
                ((_k = (_j = (_h = (_g = (_f = chartRef.current) === null || _f === void 0 ? void 0 : _f.config) === null || _g === void 0 ? void 0 : _g.options) === null || _h === void 0 ? void 0 : _h.scales) === null || _j === void 0 ? void 0 : _j.x) === null || _k === void 0 ? void 0 : _k.max) !== undefined) {
                let minChart1 = (_q = (_p = (_o = (_m = (_l = chartRef.current) === null || _l === void 0 ? void 0 : _l.config) === null || _m === void 0 ? void 0 : _m.options) === null || _o === void 0 ? void 0 : _o.scales) === null || _p === void 0 ? void 0 : _p.x) === null || _q === void 0 ? void 0 : _q.min;
                if (minChart1 === undefined || minChart1 === -1)
                    minChart1 = dataset[0].Date;
                let maxChart1 = (_v = (_u = (_t = (_s = (_r = chartRef.current) === null || _r === void 0 ? void 0 : _r.config) === null || _s === void 0 ? void 0 : _s.options) === null || _t === void 0 ? void 0 : _t.scales) === null || _u === void 0 ? void 0 : _u.x) === null || _v === void 0 ? void 0 : _v.max;
                if (maxChart1 === undefined || maxChart1 === -1)
                    maxChart1 = dataset[dataset.length - 1].Date;
                //left side
                if (event.offsetX >= x.getPixelForValue(new Date(minChart1)) - radius &&
                    event.offsetX <= x.getPixelForValue(new Date(minChart1)) + radius) {
                    canvas.onmousemove = (e) => {
                        dragMove(e);
                    };
                    const dragMove = (event) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
                        const timestamp = x.getValueForPixel(event.offsetX);
                        const dayTimestamp = new Date(timestamp).setHours(0, 0, 0, 0);
                        let scrollPoint = dataset
                            .map((e) => new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString())
                            .indexOf(dayTimestamp.toLocaleString());
                        //if too much on left
                        if (event.offsetX < left && scrollPoint === -1)
                            scrollPoint = 0;
                        //if too much on right
                        if (event.offsetX > right &&
                            scrollPoint === -1 &&
                            ((_e = (_d = (_c = (_b = (_a = chartRef.current) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.scales) === null || _d === void 0 ? void 0 : _d.x) === null || _e === void 0 ? void 0 : _e.max) !== undefined) {
                            scrollPoint =
                                dataset
                                    .map((e) => new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString())
                                    .indexOf(new Date((_k = (_j = (_h = (_g = (_f = chartRef.current) === null || _f === void 0 ? void 0 : _f.config) === null || _g === void 0 ? void 0 : _g.options) === null || _h === void 0 ? void 0 : _h.scales) === null || _j === void 0 ? void 0 : _j.x) === null || _k === void 0 ? void 0 : _k.max)
                                    .setHours(0, 0, 0, 0)
                                    .toLocaleString()) - 4;
                        }
                        //if left one is beyond the right one
                        if (((_p = (_o = (_m = (_l = chartRef.current) === null || _l === void 0 ? void 0 : _l.config.options) === null || _m === void 0 ? void 0 : _m.scales) === null || _o === void 0 ? void 0 : _o.x) === null || _p === void 0 ? void 0 : _p.max) !== undefined) {
                            if (scrollPoint >
                                dataset
                                    .map((e) => new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString())
                                    .indexOf(new Date((_r = (_q = chartRef.current) === null || _q === void 0 ? void 0 : _q.config.options) === null || _r === void 0 ? void 0 : _r.scales.x.max)
                                    .setHours(0, 0, 0, 0)
                                    .toLocaleString()) -
                                    4) {
                                scrollPoint =
                                    dataset
                                        .map((e) => new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString())
                                        .indexOf(new Date((_t = (_s = chartRef.current) === null || _s === void 0 ? void 0 : _s.config.options) === null || _t === void 0 ? void 0 : _t.scales.x.max)
                                        .setHours(0, 0, 0, 0)
                                        .toLocaleString()) - 4;
                            }
                        }
                        if (((_y = (_x = (_w = (_v = (_u = chartRef.current) === null || _u === void 0 ? void 0 : _u.config) === null || _v === void 0 ? void 0 : _v.options) === null || _w === void 0 ? void 0 : _w.scales) === null || _x === void 0 ? void 0 : _x.x) === null || _y === void 0 ? void 0 : _y.min) !== undefined) {
                            //updating the chart
                            chartRef.current.config.options.scales.x.min =
                                dataset[scrollPoint].Date;
                        }
                        (_z = chartRef.current) === null || _z === void 0 ? void 0 : _z.update("none");
                        (_0 = chartRef2.current) === null || _0 === void 0 ? void 0 : _0.update("none");
                        //updating the slider
                        zoomBoxItem(dataset[scrollPoint].Date, (_5 = (_4 = (_3 = (_2 = (_1 = chartRef.current) === null || _1 === void 0 ? void 0 : _1.config) === null || _2 === void 0 ? void 0 : _2.options) === null || _3 === void 0 ? void 0 : _3.scales) === null || _4 === void 0 ? void 0 : _4.x) === null || _5 === void 0 ? void 0 : _5.max);
                    };
                }
                //right side
                if (event.offsetX >=
                    x.getPixelForValue(new Date((_0 = (_z = (_y = (_x = (_w = chartRef.current) === null || _w === void 0 ? void 0 : _w.config) === null || _x === void 0 ? void 0 : _x.options) === null || _y === void 0 ? void 0 : _y.scales) === null || _z === void 0 ? void 0 : _z.x) === null || _0 === void 0 ? void 0 : _0.max)) -
                        radius &&
                    event.offsetX <=
                        x.getPixelForValue(new Date((_5 = (_4 = (_3 = (_2 = (_1 = chartRef.current) === null || _1 === void 0 ? void 0 : _1.config) === null || _2 === void 0 ? void 0 : _2.options) === null || _3 === void 0 ? void 0 : _3.scales) === null || _4 === void 0 ? void 0 : _4.x) === null || _5 === void 0 ? void 0 : _5.max)) +
                            radius) {
                    canvas.onmousemove = (e) => {
                        dragMove(chartRef.current, e);
                    };
                    const dragMove = (chart, event) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10;
                        const timestamp = x.getValueForPixel(event.offsetX);
                        const dayTimestamp = new Date(timestamp).setHours(0, 0, 0, 0);
                        let scrollPoint = dataset
                            .map((e) => new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString())
                            .indexOf(dayTimestamp.toLocaleString());
                        //too much on right
                        if (event.offsetX > right &&
                            scrollPoint === -1 &&
                            ((_e = (_d = (_c = (_b = (_a = chartRef.current) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.scales) === null || _d === void 0 ? void 0 : _d.x) === null || _e === void 0 ? void 0 : _e.min) !== undefined)
                            scrollPoint = dataset.length - 1;
                        //too much on left
                        if (event.offsetX < left &&
                            scrollPoint === -1 &&
                            ((_k = (_j = (_h = (_g = (_f = chartRef.current) === null || _f === void 0 ? void 0 : _f.config) === null || _g === void 0 ? void 0 : _g.options) === null || _h === void 0 ? void 0 : _h.scales) === null || _j === void 0 ? void 0 : _j.x) === null || _k === void 0 ? void 0 : _k.min) !== undefined) {
                            scrollPoint =
                                dataset
                                    .map((e) => new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString())
                                    .indexOf(new Date((_q = (_p = (_o = (_m = (_l = chartRef.current) === null || _l === void 0 ? void 0 : _l.config) === null || _m === void 0 ? void 0 : _m.options) === null || _o === void 0 ? void 0 : _o.scales) === null || _p === void 0 ? void 0 : _p.x) === null || _q === void 0 ? void 0 : _q.min)
                                    .setHours(0, 0, 0, 0)
                                    .toLocaleString()) + 4;
                        }
                        //the right slider is beyond the left one
                        if (((_u = (_t = (_s = (_r = chartRef.current) === null || _r === void 0 ? void 0 : _r.config.options) === null || _s === void 0 ? void 0 : _s.scales) === null || _t === void 0 ? void 0 : _t.x) === null || _u === void 0 ? void 0 : _u.min) !== undefined) {
                            if (scrollPoint <
                                dataset
                                    .map((e) => new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString())
                                    .indexOf(new Date((_w = (_v = chartRef.current) === null || _v === void 0 ? void 0 : _v.config.options) === null || _w === void 0 ? void 0 : _w.scales.x.min)
                                    .setHours(0, 0, 0, 0)
                                    .toLocaleString()) +
                                    4)
                                scrollPoint =
                                    dataset
                                        .map((e) => new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString())
                                        .indexOf(new Date((_y = (_x = chartRef.current) === null || _x === void 0 ? void 0 : _x.config.options) === null || _y === void 0 ? void 0 : _y.scales.x.min)
                                        .setHours(0, 0, 0, 0)
                                        .toLocaleString()) + 4;
                        }
                        if (((_3 = (_2 = (_1 = (_0 = (_z = chartRef.current) === null || _z === void 0 ? void 0 : _z.config) === null || _0 === void 0 ? void 0 : _0.options) === null || _1 === void 0 ? void 0 : _1.scales) === null || _2 === void 0 ? void 0 : _2.x) === null || _3 === void 0 ? void 0 : _3.max) !== undefined) {
                            //updating the chart
                            chartRef.current.config.options.scales.x.max =
                                dataset[scrollPoint].Date;
                        }
                        (_4 = chartRef.current) === null || _4 === void 0 ? void 0 : _4.update("none");
                        (_5 = chartRef2.current) === null || _5 === void 0 ? void 0 : _5.update("none");
                        //updating the slider
                        zoomBoxItem((_10 = (_9 = (_8 = (_7 = (_6 = chartRef.current) === null || _6 === void 0 ? void 0 : _6.config) === null || _7 === void 0 ? void 0 : _7.options) === null || _8 === void 0 ? void 0 : _8.scales) === null || _9 === void 0 ? void 0 : _9.x) === null || _10 === void 0 ? void 0 : _10.min, dataset[scrollPoint].Date);
                    };
                }
                if (event.offsetX >
                    x.getPixelForValue(new Date((_10 = (_9 = (_8 = (_7 = (_6 = chartRef.current) === null || _6 === void 0 ? void 0 : _6.config) === null || _7 === void 0 ? void 0 : _7.options) === null || _8 === void 0 ? void 0 : _8.scales) === null || _9 === void 0 ? void 0 : _9.x) === null || _10 === void 0 ? void 0 : _10.min)) +
                        radius +
                        1 &&
                    event.offsetX <
                        x.getPixelForValue(new Date((_15 = (_14 = (_13 = (_12 = (_11 = chartRef.current) === null || _11 === void 0 ? void 0 : _11.config) === null || _12 === void 0 ? void 0 : _12.options) === null || _13 === void 0 ? void 0 : _13.scales) === null || _14 === void 0 ? void 0 : _14.x) === null || _15 === void 0 ? void 0 : _15.max)) -
                            radius +
                            1) {
                    canvas.onmousemove = (e) => {
                        try {
                            dragMoveCenter(chartRef.current, e, minChart1, maxChart1);
                        }
                        catch (_a) { }
                    };
                }
                const dragMoveCenter = (chart, e, staticScaleMin, staticScaleMax) => {
                    var _a, _b;
                    //starting point
                    const dragStartingPoint = x.getValueForPixel(event.offsetX);
                    const dayDragStartingPoint = new Date(dragStartingPoint).setHours(0, 0, 0, 0);
                    let startingPointIndex = dataset
                        .map((e) => new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString())
                        .indexOf(dayDragStartingPoint.toLocaleString());
                    //difference
                    const timestamp = x.getValueForPixel(e.offsetX);
                    const dayTimestamp = new Date(timestamp).setHours(0, 0, 0, 0);
                    let scrollPoint = dataset
                        .map((e) => new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString())
                        .indexOf(dayTimestamp.toLocaleString());
                    const difference = scrollPoint - startingPointIndex;
                    if (scrollPoint === -1 && e.offsetX >= right) {
                        scrollPoint = dataset.length - 1;
                    }
                    const range = dataset
                        .map((e) => new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString())
                        .indexOf(new Date(staticScaleMin).setHours(0, 0, 0, 0).toLocaleString()) -
                        dataset
                            .map((e) => new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString())
                            .indexOf(new Date(staticScaleMax).setHours(0, 0, 0, 0).toLocaleString());
                    const minVal = dataset
                        .map((e) => new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString())
                        .indexOf(new Date(staticScaleMax).setHours(0, 0, 0, 0).toLocaleString()) +
                        difference -
                        range;
                    const maxVal = dataset
                        .map((e) => new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString())
                        .indexOf(new Date(staticScaleMax).setHours(0, 0, 0, 0).toLocaleString()) + difference;
                    let minChart1;
                    let maxChart1;
                    if (minVal < 0 && e.offsetX < right) {
                        minChart1 = dataset[0].Date;
                        maxChart1 = dataset[range].Date;
                    }
                    else if (maxVal > dataset.length - 1 ||
                        (difference < 0 && e.offsetX >= right)) {
                        minChart1 = dataset[dataset.length - 1 - range].Date;
                        maxChart1 = dataset[dataset.length - 1].Date;
                    }
                    else {
                        minChart1 =
                            dataset[dataset
                                .map((e) => new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString())
                                .indexOf(new Date(staticScaleMin)
                                .setHours(0, 0, 0, 0)
                                .toLocaleString()) + difference].Date;
                        maxChart1 =
                            dataset[dataset
                                .map((e) => new Date(e.Date).setHours(0, 0, 0, 0).toLocaleString())
                                .indexOf(new Date(staticScaleMax)
                                .setHours(0, 0, 0, 0)
                                .toLocaleString()) + difference].Date;
                    }
                    if (maxChart1 === undefined)
                        maxChart1 = dataset[dataset.length - 1].Date;
                    if (minChart1 === undefined)
                        maxChart1 = dataset[0].Date;
                    chart.config.options.scales.x.min = minChart1;
                    chart.config.options.scales.x.max = maxChart1;
                    (_a = chartRef.current) === null || _a === void 0 ? void 0 : _a.update("none");
                    (_b = chartRef2.current) === null || _b === void 0 ? void 0 : _b.update("none");
                    //updating the slider
                    zoomBoxItem(minChart1, maxChart1);
                };
            }
        };
    };
    const tooltipPosition = (e) => {
        const { ctx, chartArea: { top, bottom, left, right }, scales: { x }, } = chartRef.current;
        let xTooltip;
        let yTooltip;
        const rightSide = right - e.offsetX;
        const margin = 20;
        const tooltipWidth = 200;
        const tooltipHeight = 100;
        const xPadding = 10;
        const yPadding = 20;
        const gap = 30;
        if (rightSide <= tooltipWidth + margin) {
            xTooltip = e.offsetX - (tooltipWidth + margin);
        }
        else
            xTooltip = e.offsetX + margin;
        if (e.offsetY <= tooltipHeight + 2 * margin)
            yTooltip = e.offsetY + margin;
        else
            yTooltip = e.offsetY - (tooltipHeight + margin);
        if (e.offsetX >= left &&
            e.offsetX <= right &&
            e.offsetY >= top &&
            e.offsetY <= bottom) {
            ctx.beginPath();
            ctx.fillStyle = colors.tooltip;
            ctx.strokeStyle = colors.tooltip;
            ctx.lineJoin = "round";
            ctx.lineWidth = 5;
            ctx.fillRect(xTooltip, yTooltip, tooltipWidth, tooltipHeight);
            ctx.strokeRect(xTooltip, yTooltip, tooltipWidth, tooltipHeight);
            ctx.closePath();
            ctx.restore();
            //header
            const dateCursor = new Date(x.getValueForPixel(e.offsetX));
            const dateIndex = dataset
                .map((el) => new Date(el.Date).setHours(0, 0, 0, 0).toLocaleString())
                .indexOf(dateCursor.setHours(0, 0, 0, 0).toLocaleString());
            const drawText = (align, baseLine, fillStyle, font, text, xPosition, yPosition) => {
                ctx.textAlign = align;
                ctx.textBaseLine = baseLine;
                ctx.fillStyle = fillStyle;
                ctx.font = font;
                ctx.fillText(text, xPosition, yPosition);
                ctx.restore();
            };
            //date
            drawText("left", "middle", colors.tooltipDate, "bolder 12px Sora", dateCursor.toLocaleDateString(), xTooltip + xPadding, yTooltip + yPadding);
            //time
            drawText("right", "middle", colors.tooltipTime, "bolder 10px Sora", new Date(x.getValueForPixel(e.offsetX)).toLocaleTimeString(), xTooltip + tooltipWidth - xPadding, yTooltip + yPadding);
            let dotColor;
            if (dataset[dateIndex].Open < dataset[0].Open) {
                dotColor = colors.below;
            }
            else
                dotColor = colors.above;
            //colored dot 1
            const dotSpace = 20;
            drawText("left", "middle", dotColor, "10px FontAwesome", "\uf111", xTooltip + xPadding, yTooltip + yPadding + gap);
            //colored dot 1 text
            const priceText = "Price: ";
            const priceTextWidth = ctx.measureText(priceText).width + 13;
            drawText("left", "middle", colors.tooltipData, "12px Sora", priceText, xTooltip + xPadding + dotSpace, yTooltip + yPadding + gap);
            //colored dot 1 value
            drawText("left", "middle", colors.tooltipData, "12px Sora", new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency,
                minimumFractionDigits: 2,
            }).format(dataset[dateIndex].Open), xTooltip + dotSpace + xPadding + priceTextWidth, yTooltip + yPadding + gap);
            //colored dot 2
            drawText("left", "middle", "white", "12px FontAwesome", "\uf080", xTooltip + xPadding, yTooltip + yPadding + 2 * gap);
            //colored dot 2 text
            const volumeText = "Volume: ";
            const volumeTextWidth = ctx.measureText(volumeText).width + 8;
            drawText("left", "middle", colors.tooltipData, "12px Sora", volumeText, xTooltip + xPadding + dotSpace, yTooltip + yPadding + 2 * gap);
            //colored dot 2 value
            drawText("left", "middle", colors.tooltipData, "12px Sora", new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency,
                minimumFractionDigits: 2,
                notation: "compact",
            }).format(dataset[dateIndex].Volume), xTooltip + dotSpace + xPadding + volumeTextWidth, yTooltip + yPadding + 2 * gap);
        }
    };
    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.canvas.addEventListener("mousemove", (e) => {
                crosshairLine(chartRef.current, e);
                tooltipPosition(e);
            });
            chartRef.current.canvas.addEventListener("wheel", (e) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                zoom(chartRef.current, e);
                zoomBox((_d = (_c = (_b = (_a = chartRef.current) === null || _a === void 0 ? void 0 : _a.config.options) === null || _b === void 0 ? void 0 : _b.scales) === null || _c === void 0 ? void 0 : _c.x) === null || _d === void 0 ? void 0 : _d.min, (_h = (_g = (_f = (_e = chartRef.current) === null || _e === void 0 ? void 0 : _e.config.options) === null || _f === void 0 ? void 0 : _f.scales) === null || _g === void 0 ? void 0 : _g.x) === null || _h === void 0 ? void 0 : _h.max);
                e.preventDefault();
            });
            zoomBox(dataset[0].Date, dataset[dataset.length - 1].Date);
            window.addEventListener("resize", (e) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                (_a = chartRef2.current) === null || _a === void 0 ? void 0 : _a.resize();
                if (((_e = (_d = (_c = (_b = chartRef.current) === null || _b === void 0 ? void 0 : _b.config.options) === null || _c === void 0 ? void 0 : _c.scales) === null || _d === void 0 ? void 0 : _d.x) === null || _e === void 0 ? void 0 : _e.min) !== undefined)
                    zoomBox((_h = (_g = (_f = chartRef.current) === null || _f === void 0 ? void 0 : _f.config.options) === null || _g === void 0 ? void 0 : _g.scales.x) === null || _h === void 0 ? void 0 : _h.min, (_l = (_k = (_j = chartRef.current) === null || _j === void 0 ? void 0 : _j.config.options) === null || _k === void 0 ? void 0 : _k.scales.x) === null || _l === void 0 ? void 0 : _l.max);
            });
        }
    });
    const options = {
        animations: false,
        layout: {
            padding: {
                left: 10,
                //right: 50
                right: 0,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value, index, ticks) {
                        return (new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: currency,
                            minimumFractionDigits: 0,
                            notation: "compact",
                        }).format(value) + "  ");
                    },
                },
                max: Math.ceil(Math.max(...dataset.map((el) => el.Open + 1000)) / 1000) * 1000,
            },
            x: {
                type: "time",
                time: { unit: "day" },
                grid: {
                    drawOnChartArea: false,
                    drawTicks: true,
                    drawBorder: false,
                    offset: false,
                },
                min: dataset[0].Date,
                max: dataset[dataset.length - 1].Date,
                ticks: {
                    callback: (value, index, values) => {
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
                        weight: (values) => {
                            if (values.tick.label.length === 3)
                                return "bold";
                        },
                    },
                },
            },
            volume: {
                type: "linear",
                position: "right",
                min: 0,
                max: Math.max(...dataset.map((el) => el.Volume)) * 10,
                grid: { display: false },
                ticks: { display: false },
            },
        },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
    };
    const data = {
        labels: dataset.map((el) => {
            const date = new Date(el.Date);
            date.setHours(0, 0, 0, 0);
            return date;
        }),
        datasets: [
            {
                label: "Weekly Sales",
                data: dataset.map((el) => el.Open),
                fill: {
                    target: { value: dataset[0].Open },
                    below: (context) => {
                        const chart = context.chart;
                        const { ctx, chartArea, data, scales } = chart;
                        if (!chartArea)
                            return null;
                        return belowGradient(ctx, chartArea, data, scales);
                    },
                    above: (context) => {
                        const chart = context.chart;
                        const { ctx, chartArea, data, scales } = chart;
                        if (!chartArea)
                            return null;
                        return aboveGradient(ctx, chartArea, data, scales);
                    },
                },
                borderColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea, data, scales } = chart;
                    if (!chartArea)
                        return null;
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
                data: dataset.map((el) => el.Volume),
                backgroundColor: barChartColor,
                pointRadius: 0,
                pointHitRadius: 0,
                pointHoverRadius: 0,
                yAxisID: "volume",
                barPercentage: 0.9,
                categoryPercentage: 1,
            },
        ],
    };
    const options2 = {
        layout: {
            padding: {
                left: 50,
                //right: 58,
                right: 8,
            },
        },
        aspectRatio: 10,
        animation: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: { display: false, drawBorder: false },
                ticks: { display: false },
                max: Math.ceil(Math.max(...dataset.map((el) => el.Open + 1000)) / 1000) * 1000,
            },
            x: {
                type: "time",
                time: { unit: "day" },
                grid: { drawBorder: false, drawTicks: false },
                ticks: {
                    callback: (value, index, values) => {
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
                        weight: (values) => {
                            if (values.tick.label.length === 3)
                                return "bold";
                        },
                    },
                    mirror: true,
                },
                min: dataset[0].Date,
                max: dataset[dataset.length - 1].Date,
            },
        },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
    };
    const data2 = {
        labels: dataset.map((el) => {
            const date = new Date(el.Date);
            date.setHours(0, 0, 0, 0);
            return date;
        }),
        datasets: [
            {
                data: dataset.map((el) => el.Open),
                borderColor: colors.minChartLine,
                backgroundColor: colors.minChartBackground,
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
        beforeDatasetsDraw(chart, args, pluginOptions) {
            const { ctx, data, chartArea: { left, right }, scales: { y }, } = chart;
            const height = 16;
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
            ctx.fillStyle = colors.openLabel;
            ctx.fillRect(0, y.getPixelForValue(startingPoint) - height / 2, left, height);
            ctx.closePath();
            ctx.font = "12px Sora";
            ctx.fillStyle = "white";
            ctx.baseLine = "middle";
            ctx.textAlign = "center";
            ctx.fillText(startingPoint.toFixed(2), left / 2, y.getPixelForValue(startingPoint) + 4);
        },
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(ChartRJS, { type: "line", data: data, options: options, plugins: [dottedLine], ref: chartRef }),
        React.createElement(ChartRJS, { type: "line", data: data2, options: options2, plugins: [], ref: chartRef2 })));
};
export default Chart;
