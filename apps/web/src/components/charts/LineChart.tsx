import ReactECharts from 'echarts-for-react';
import { useThemeStore } from '@stores/themeStore';

interface LineChartProps {
  data: { name: string; value: number }[];
  xAxisData: string[];
  title?: string;
  color?: string;
  height?: number;
  smooth?: boolean;
  area?: boolean;
}

export function LineChart({ data, xAxisData, title, color = '#3B82F6', height = 250, smooth = true, area = false }: LineChartProps) {
  const { isDark } = useThemeStore();
  const textColor = isDark ? '#CBD5E1' : '#475569';
  const gridColor = isDark ? '#334155' : '#E2E8F0';

  const option = {
    title: title ? { text: title, textStyle: { color: textColor, fontSize: 14 } } : undefined,
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderColor: gridColor,
      textStyle: { color: textColor },
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLine: { lineStyle: { color: gridColor } },
      axisLabel: { color: textColor },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: gridColor } },
      axisLabel: { color: textColor },
      splitLine: { lineStyle: { color: gridColor, type: 'dashed' } },
    },
    series: [
      {
        data: data.map((d) => d.value),
        type: 'line',
        smooth,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color, width: 2 },
        itemStyle: { color },
        areaStyle: area
          ? {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: color + '40' },
                  { offset: 1, color: color + '00' },
                ],
              },
            }
          : undefined,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height }} opts={{ renderer: 'canvas' }} />;
}