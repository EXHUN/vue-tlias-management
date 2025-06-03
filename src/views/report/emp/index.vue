<script setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import { getEmpGenderData, getEmpJobData } from "@/api/report";

// 性别统计数据
const genderData = ref([]);
// 职位统计数据
const jobList = ref([]);
const dataList = ref([]);

// 获取员工性别统计
const fetchGenderData = async () => {
  const token = localStorage.getItem("token");
  try {
    const json = await getEmpGenderData(token);
    if (json && json.code === 1) {
      genderData.value = json.data;
      renderGenderChart();
    } else {
      genderData.value = [];
    }
  } catch (e) {
    genderData.value = [];
    console.error("获取性别统计失败：", e.message || e);
  }
};

// 获取员工职位统计
const fetchJobData = async () => {
  const token = localStorage.getItem("token");
  try {
    const json = await getEmpJobData(token);
    if (json && json.code === 1) {
      jobList.value = json.data.jobList;
      dataList.value = json.data.dataList;
      renderJobChart();
    } else {
      jobList.value = [];
      dataList.value = [];
    }
  } catch (e) {
    jobList.value = [];
    dataList.value = [];
    console.error("获取职位统计失败：", e.message || e);
  }
};

// 渲染性别统计图
const renderGenderChart = () => {
  const chart = echarts.init(document.getElementById("genderChart"));
  chart.setOption({
    title: { text: "员工性别统计", left: "center" },
    tooltip: { trigger: "item" },
    legend: { bottom: 10, left: "center" },
    series: [
      {
        name: "性别",
        type: "pie",
        radius: "50%",
        data: genderData.value.map(item => ({
          name: item.name,
          value: item.value
        })),
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0,0,0,0.5)" }
        }
      }
    ]
  });
};

// 渲染职位统计图
const renderJobChart = () => {
  const chart = echarts.init(document.getElementById("jobChart"));
  chart.setOption({
    title: { text: "员工职位统计", left: "center" },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: jobList.value },
    yAxis: { type: "value" },
    series: [
      {
        name: "人数",
        type: "bar",
        data: dataList.value
      }
    ]
  });
};

onMounted(() => {
  fetchGenderData();
  fetchJobData();
});
</script>

<template>
  <div class="charts-center charts-center-up">
    <div class="charts-row charts-row-large">
      <el-card style="flex: 1; max-width: 700px;">
        <div id="genderChart" style="width: 100%; height: 480px;"></div>
      </el-card>
      <el-card style="flex: 1; max-width: 700px;">
        <div id="jobChart" style="width: 100%; height: 480px;"></div>
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