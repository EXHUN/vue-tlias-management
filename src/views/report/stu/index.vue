<script setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import { getClazzStudentCount, getDegreeStat } from "@/api/report";

// 班级人数统计数据
const clazzList = ref([]);
const clazzCountList = ref([]);
// 学历统计数据
const degreeData = ref([]);

// 获取班级人数统计
const fetchClazzStudentCount = async () => {
  const token = localStorage.getItem("token");
  try {
    const json = await getClazzStudentCount(token);
    if (json && json.code === 1) {
      clazzList.value = json.data.clazzList;
      clazzCountList.value = json.data.dataList;
      renderClazzChart();
    } else {
      clazzList.value = [];
      clazzCountList.value = [];
    }
  } catch (e) {
    clazzList.value = [];
    clazzCountList.value = [];
    console.error("获取班级人数统计失败：", e.message || e);
  }
};

// 获取学历统计
const fetchDegreeStat = async () => {
  const token = localStorage.getItem("token");
  try {
    const json = await getDegreeStat(token);
    if (json && json.code === 1) {
      degreeData.value = json.data;
      renderDegreeChart();
    } else {
      degreeData.value = [];
    }
  } catch (e) {
    degreeData.value = [];
    console.error("获取学历统计失败：", e.message || e);
  }
};

// 渲染学历统计饼状图
const renderDegreeChart = () => {
  const chart = echarts.init(document.getElementById("degreeChart"));
  chart.setOption({
    title: { text: "学员学历统计", left: "center" },
    tooltip: { trigger: "item" },
    legend: { bottom: 10, left: "center" },
    series: [
      {
        name: "学历",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: true, position: 'outside' },
        emphasis: {
          label: { show: true, fontSize: 18, fontWeight: 'bold' }
        },
        data: degreeData.value
      }
    ]
  });
};

// 渲染班级人数统计柱状图
const renderClazzChart = () => {
  const chart = echarts.init(document.getElementById("clazzChart"));
  chart.setOption({
    title: { text: "班级人数统计", left: "center" },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: clazzList.value },
    yAxis: { type: "value" },
    series: [
      {
        name: "人数",
        type: "bar",
        data: clazzCountList.value,
        itemStyle: { color: '#5470c6' }
      }
    ]
  });
};

onMounted(() => {
  fetchClazzStudentCount();
  fetchDegreeStat();
});
</script>

<template>
  <div class="charts-center charts-center-up">
    <div class="charts-row charts-row-large">
      <el-card style="flex: 1; max-width: 700px;">
        <div id="clazzChart" style="width: 100%; height: 480px;"></div>
      </el-card>
      <el-card style="flex: 1; max-width: 700px;">
        <div id="degreeChart" style="width: 100%; height: 480px;"></div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.charts-center {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.charts-center-up {
  align-items: flex-start;
  padding-top: 40px;
}
.charts-row {
  display: flex;
  gap: 32px;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: nowrap;
  min-width: 1050px;
}
.charts-row-large {
  gap: 48px;
}
</style>