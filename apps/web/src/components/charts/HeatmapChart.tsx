import ReactECharts from 'echarts-for-react';
import { useThemeStore } from '@stores/themeStore';

interface HeatmapChartProps {
  data: { x: string; y: string; value: number }[];
  xAxisData: string[];
  yAxisData: string[];
  title?: string;
  height?: number;
  minValue?: number;
  maxValue?: number;
  colorScale?: string[];
}

export function HeatmapChart({
  data,
  xAxisData,
  yAxisData,
  title,
  height = 300,
  minValue = 0,
  maxValue = 100,
  colorScale = ['#10B981', '#F59E0B', '#EF4444'],
}: HeatmapChartProps) {
  const { isDark } = useThemeStore();
  const textColor = isDark ? '#CBD5E1' : '#475569';
  const gridColor = isDark ? '#334155' : '#E2E8F0';

  const option = {
    title: title ? { text: title, textStyle: { color: textColor, fontSize: 14 } } : undefined,
    tooltip: {
      position: 'top',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderColor: gridColor,
      textStyle: { color: textColor },
      formatter: (params: { data: [number, number, number] }) => {
        const x = xAxisData[params.data[0]];
        const y = yAxisData[params.data[1]];
        const v = params.data[2];
        return `${y} × ${x}<br/>Value: ${v.toFixed(2)}`;
      },
    },
    grid: { left: '15%', right: '10%', top: '10%', bottom: '15%' },
    xAxis: {
      type: 'category',
      data: xAxisData,
      splitArea: { show: true },
      axisLabel: { color: textColor, rotate: 45 },
      axisLine: { lineStyle: { color: gridColor } },
    },
    yAxis: {
      type: 'category',
      data: yAxisData,
      splitArea: { show: true },
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: gridColor } },
    },
    visualMap: {
      min: minValue,
      max: maxValue,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%',
      inRange: { color: colorScale },
      textStyle: { color: textColor },
    },
    series: [
      {
        type: 'heatmap',
        data: data.map((d) => [xAxisData.indexOf(d.x), yAxisData.indexOf(d.y), d.value]),
        label: {
          show: true,
          color: textColor,
          formatter: (params: { data: [number, number, number] }) => params.data[2].toFixed(1),
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height }} opts={{ renderer: 'canvas' }} />;
}
