"use client";

import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import useRawForecast from "@/hooks/useRawForecast";
import { ForecastEntry } from "@/types/weather";
import { useTheme } from "next-themes";

interface ChartProps {
  city: string;
}

const Chart: React.FC<ChartProps> = ({ city }) => {
  const { rawList = [], error } = useRawForecast(city);
  const { theme } = useTheme();
  const [option, setOption] = useState({});

  useEffect(() => {
    if (!rawList.length) return;

    const entries: ForecastEntry[] = rawList;

    const categories = entries.map((entry) =>
      new Date(entry.dt_txt).toLocaleString("en-US", {
        weekday: "short",
        hour: "numeric",
      })
    );

    const temperature = entries.map((e) => e.main.temp);
    const feelsLike = entries.map((e) => e.main.feels_like);
    const humidity = entries.map((e) => e.main.humidity);
    const wind = entries.map((e) => e.wind.speed);
    const pressure = entries.map((e) => e.main.pressure);
    const seaLevel = entries.map((e) => e.main.sea_level ?? 0);
    const description = entries.map((e) => e.weather[0].description);
    const icons = entries.map((e) => e.weather[0].icon);

    const isDark = theme === "dark";
    const textColor = isDark ? "#eee" : "#222";
    const bgColor = isDark ? "#212121" : "#ffffff";
    const borderColor = isDark ? "#444" : "#ddd";

    setOption({
      backgroundColor: "transparent",
      animationDuration: 800,
      tooltip: {
        trigger: "axis",
        backgroundColor: bgColor,
        borderColor,
        borderWidth: 1,
        textStyle: {
          color: textColor,
          fontSize: 13,
          fontFamily: "Segoe UI, sans-serif",
        },
        extraCssText:
          "box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 10px; border-radius: 8px;",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          const i = params[0].dataIndex;
          const date = new Date(entries[i].dt_txt).toLocaleString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
            hour: "numeric",
          });
          const iconUrl = `https://openweathermap.org/img/wn/${icons[i]}@2x.png`;

          return `
            <div style="display: flex; justify-content: space-between; gap: 16px;">
              <div>
                <div style="font-size: 14px; font-weight: 600;">${date}</div>
                <div>🌡️ Temp: ${temperature[i]}°C</div>
                <div>🤒 Feels Like: ${feelsLike[i]}°C</div>
                <div>💧 Humidity: ${humidity[i]}%</div>
                <div>💨 Wind: ${wind[i]} m/s</div>
                <div>🎯 Pressure: ${pressure[i]} hPa</div>
                <div>🌊 Sea Level: ${seaLevel[i]} hPa</div>
              </div>
              <div style="text-align: center;">
                <img src="${iconUrl}" alt="icon" style="width: 60px; height: 60px;" />
                <div style="margin-top: 4px; font-size: 13px; font-style: italic;">${description[i]}</div>
              </div>
            </div>
          `;
        },
      },
      legend: {
        data: [
          "Temp",
          "Feels Like",
          "Humidity",
          "Wind",
          "Pressure",
          "Sea Level",
        ],
        icon: "rect",
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          color: textColor,
          fontSize: 12,
        },
        top: 10,
        type: "scroll",
      },
      grid: {
        left: "7%",
        right: "5%",
        bottom: "10%",
        top: "20%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: categories,
        boundaryGap: false,
        axisLabel: {
          fontSize: 13,
          color: textColor,
        },
        axisLine: {
          lineStyle: { color: textColor },
        },
        splitLine: { show: false },
      },
      yAxis: [
        {
          type: "value",
          name: "Temperature (°C)",
          axisLine: { lineStyle: { color: textColor } },
          axisLabel: { color: textColor },
          splitLine: { show: false },
        },
        {
          type: "value",
          name: "Pressure (hPa)",
          axisLine: { lineStyle: { color: textColor } },
          axisLabel: { color: textColor },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: "Temp",
          type: "line",
          symbol: "none",
          data: temperature,
          smooth: true,
          yAxisIndex: 0,
          lineStyle: { width: 2, color: "#ff4500" },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "#ff6347" },
                { offset: 1, color: "rgba(255, 69, 0, 0)" },
              ],
            },
          },
        },
        {
          name: "Feels Like",
          type: "line",
          symbol: "none",
          data: feelsLike,
          smooth: true,
          yAxisIndex: 0,
          lineStyle: { width: 2, color: "#36a2eb" },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "#36a2eb" },
                { offset: 1, color: "rgba(54, 162, 235, 0)" },
              ],
            },
          },
        },
        {
          name: "Humidity",
          type: "line",
          symbol: "none",
          data: humidity,
          smooth: true,
          yAxisIndex: 0,
          lineStyle: { color: "#4bc0c0", width: 2 },
          areaStyle: {
            color: "rgba(75,192,192,0.2)",
          },
        },
        {
          name: "Wind",
          type: "line",
          symbol: "none",
          data: wind,
          yAxisIndex: 0,
          smooth: true,
          lineStyle: { color: "#ffcd56", width: 2, type: "dashed" },
          areaStyle: {
            color: "rgba(255,205,86,0.2)",
          },
        },
        {
          name: "Pressure",
          type: "line",
          symbol: "none",
          data: pressure,
          yAxisIndex: 1,
          smooth: true,
          lineStyle: { color: "#9966cc", width: 2 },
          areaStyle: {
            color: "rgba(153,102,204,0.2)",
          },
        },
        {
          name: "Sea Level",
          type: "line",
          symbol: "none",
          data: seaLevel,
          yAxisIndex: 1,
          smooth: true,
          lineStyle: { color: "#ff6666", width: 2 },
          areaStyle: {
            color: "rgba(255,102,102,0.2)",
          },
        },
      ],
    });
  }, [rawList, theme]);

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <ReactECharts
    className="p-2"
      option={option}
      style={{ height: "430px", width: "100%" }}
      notMerge
      lazyUpdate
    />
  );
};

export default Chart;
