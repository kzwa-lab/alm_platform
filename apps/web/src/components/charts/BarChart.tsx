import ReactECharts from 'echarts-for-react';
import { useThemeStore } from '@stores/themeStore';

interface BarChartProps {
  data: { name: string; value: number }[];
  title?: string;
  color?: string;
  height?: number;
  horizontal?: boolean;
}

export function BarChart({ data, title, color = '#3B82F6', height = 250, horizontal = false }: BarChartProps) {
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
      type: horizontal ? 'value' : 'category',
      data: horizontal ? undefined : data.map((d) => d.name),
      axisLine: { lineStyle: { color: gridColor } },
      axisLabel: { color: textColor },
      splitLine: horizontal ? { lineStyle: { color: gridColor, type: 'dashed' } } : undefined,
    },
    yAxis: {
      type: horizontal ? 'category' : 'value',
      data: horizontal ? data.map((d) => d.name) : undefined,
      axisLine: { lineStyle: { color: gridColor } },
      axisLabel: { color: textColor },
      splitLine: horizontal ? undefined : { lineStyle: { color: gridColor, type: 'dashed' } },
    },
    series: [
      {
        data: data.map((d) => d.value),
        type: 'bar',
        itemStyle: {
          color,
          borderRadius: horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0],
        },
        barWidth: '60%',
      },
    ],
  };

  return <ReactECharts option={option} style={{ height }} opts={{ renderer: 'canvas' }} />;
}
