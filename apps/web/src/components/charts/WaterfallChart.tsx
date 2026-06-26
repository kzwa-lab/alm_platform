import ReactECharts from 'echarts-for-react';
import { useThemeStore } from '@stores/themeStore';

interface WaterfallChartProps {
  data: { name: string; value: number; isTotal?: boolean }[];
  title?: string;
  height?: number;
  positiveColor?: string;
  negativeColor?: string;
  totalColor?: string;
}

export function WaterfallChart({
  data,
  title,
  height = 250,
  positiveColor = '#10B981',
  negativeColor = '#EF4444',
  totalColor = '#3B82F6',
}: WaterfallChartProps) {
  const { isDark } = useThemeStore();
  const textColor = isDark ? '#CBD5E1' : '#475569';
  const gridColor = isDark ? '#334155' : '#E2E8F0';

  // Calculate cumulative values for waterfall
  let cumulative = 0;
  const seriesData: { value: [number, number]; itemStyle: { color: string } }[] = [];
  
  for (const item of data) {
    if (item.isTotal) {
      const value = item.value;
      seriesData.push({ value: [cumulative, value], itemStyle: { color: totalColor } });
      cumulative = value;
    } else {
      const start = cumulative;
      cumulative += item.value;
      seriesData.push({
        value: [start, cumulative],
        itemStyle: { color: item.value >= 0 ? positiveColor : negativeColor },
      });
    }
  }

  const option = {
    title: title ? { text: title, textStyle: { color: textColor, fontSize: 14 } } : undefined,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderColor: gridColor,
      textStyle: { color: textColor },
      formatter: (params: Array<{ data: { value: [number, number] }; name: string }>) => {
        const param = params[0];
        const start = param.data.value[0];
        const end = param.data.value[1];
        const diff = end - start;
        return `${param.name}<br/>Start: ${start.toFixed(2)}<br/>End: ${end.toFixed(2)}<br/>Change: ${diff >= 0 ? '+' : ''}${diff.toFixed(2)}`;
      },
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.name),
      axisLine: { lineStyle: { color: gridColor } },
      axisLabel: { color: textColor, rotate: 30 },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: gridColor } },
      axisLabel: { color: textColor },
      splitLine: { lineStyle: { color: gridColor, type: 'dashed' } },
    },
    series: [
      {
        type: 'custom',
        renderItem: (
          _params: { coordSys: { dataToPoint: (coords: number[]) => number[] } },
          api: {
            value: (idx: number) => number;
            coord: (coords: number[]) => number[];
            style: () => { fill: string };
          }
        ) => {
          const categoryIndex = api.value(0);
          const start = api.value(1);
          const end = api.value(2);
          const startPoint = api.coord([categoryIndex, start]);
          const endPoint = api.coord([categoryIndex, end]);
          const width = api.coord([categoryIndex + 0.4, 0])[0] - api.coord([categoryIndex - 0.4, 0])[0];
          const height = endPoint[1] - startPoint[1];

          return {
            type: 'rect',
            shape: {
              x: startPoint[0] - width / 2,
              y: Math.min(startPoint[1], endPoint[1]),
              width: width,
              height: Math.abs(height),
            },
            style: api.style(),
          };
        },
        data: seriesData.map((d, i) => [i, d.value[0], d.value[1]]),
        itemStyle: {
          color: (params: { dataIndex: number }) => seriesData[params.dataIndex].itemStyle.color,
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height }} opts={{ renderer: 'canvas' }} />;
}