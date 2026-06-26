import ReactECharts from 'echarts-for-react';
import { useThemeStore } from '@stores/themeStore';

interface PieChartProps {
  data: { name: string; value: number }[];
  title?: string;
  height?: number;
  donut?: boolean;
  colors?: string[];
}

export function PieChart({ data, title, height = 250, donut = false, colors }: PieChartProps) {
  const { isDark } = useThemeStore();
  const textColor = isDark ? '#CBD5E1' : '#475569';

  const defaultColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

  const option = {
    title: title ? { text: title, textStyle: { color: textColor, fontSize: 14 } } : undefined,
    tooltip: {
      trigger: 'item',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      textStyle: { color: textColor },
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: textColor },
    },
    color: colors || defaultColors,
    series: [
      {
        type: 'pie',
        radius: donut ? ['40%', '70%'] : '70%',
        center: ['40%', '50%'],
        data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        label: {
          show: !donut,
          color: textColor,
        },
        labelLine: {
          show: !donut,
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height }} opts={{ renderer: 'canvas' }} />;
}
