<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import { shallowRef } from 'vue';
import * as echarts from 'echarts';
// import * as echarts from 'echarts/core';
// import { BarChart, LineChart } from 'echarts/charts';
// import {
//   TitleComponent,
//   AxisPointerComponent,
//   LegendComponent,
//   TooltipComponent,
//   GridComponent,
// } from 'echarts/components';
// import { CanvasRenderer } from 'echarts/renderers';

// echarts.use([
//   BarChart,
//   LineChart,
//   TitleComponent,
//   AxisPointerComponent,
//   LegendComponent,
//   TooltipComponent,
//   GridComponent,
//   CanvasRenderer,
// ]);

export default {
  mixins: [],
  props: {
    className: {
      type: String,
      default: 'chart',
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '350px',
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    chartData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeUnmount() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = shallowRef(echarts.init(this.$el));
      this.setOptions(this.chartData);
    },
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        xAxis: {
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          boundaryGap: false, // 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样
          axisTick: {
            show: false,
          }, // 坐标轴刻度相关设置。
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true, // grid 区域是否包含坐标轴的刻度标签。
        },
        tooltip: {
          trigger: 'axis', // 触发类型
          axisPointer: {
            type: 'cross', // 十字准星指示器。其实是种简写，表示启用两个正交的轴的 axisPointer。
          }, // 坐标轴指示器配置项。
          padding: [5, 10],
        },
        yAxis: {
          axisTick: {
            show: false,
          },
        },
        legend: {
          data: ['expected', 'actual'],
        }, // 图例
        series: [
          {
            name: 'expected',
            itemStyle: {
              color: '#FF005A',
            },
            lineStyle: {
              color: '#FF005A',
              width: 2,
            },
            smooth: true,
            type: 'line',
            data: expectedData,
            animationDuration: 2800,
            animationEasing: 'cubicInOut',
          },
          {
            name: 'actual',
            smooth: true,
            type: 'line',
            itemStyle: {
              color: '#3888fa',
            },
            areaStyle: {
              color: '#f3f8ff',
            },
            lineStyle: {
              color: '#3888fa',
              width: 2,
            },
            data: actualData,
            animationDuration: 2800,
            animationEasing: 'quadraticOut',
          },
        ],
      });
    },
  },
};
</script>
