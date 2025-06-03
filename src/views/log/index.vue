<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getLogPage } from '@/api/log';

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const page = ref(1);
const pageSize = ref(10);

// 查询日志分页
const fetchLogPage = async () => {
  loading.value = true;
  try {
    const res = await getLogPage({ page: page.value, pageSize: pageSize.value });
    if (res && res.code === 1) {
      tableData.value = res.data.rows;
      total.value = res.data.total;
    } else {
      tableData.value = [];
      total.value = 0;
      ElMessage.error(res?.msg || '日志数据获取失败');
    }
  } catch (e) {
    tableData.value = [];
    total.value = 0;
    ElMessage.error(e.message || '日志数据获取失败');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchLogPage();
});

const handleCurrentChange = (val) => {
  page.value = val;
  fetchLogPage();
};
const handleSizeChange = (val) => {
  pageSize.value = val;
  page.value = 1;
  fetchLogPage();
};
</script>

<template>
  <div class="log-page-center">
    <el-table :data="tableData" v-loading="loading" border stripe style="width: 100%; max-height: 520px;" height="520">
      <!-- 不展示id，operateEmpId为第一列 -->
      <el-table-column prop="operateEmpId" label="操作人ID" width="100" align="center" />
      <el-table-column prop="operateEmpName" label="操作人姓名" width="120" align="center" />
      <el-table-column prop="operateTime" label="操作时间" width="180" align="center" />
      <el-table-column prop="className" label="操作类名" width="150" align="center" />
      <el-table-column prop="methodName" label="方法名" width="120" align="center" />
      <el-table-column prop="methodParams" label="方法参数" min-width="180" align="center" />
      <el-table-column prop="returnValue" label="返回值" min-width="120" align="center" />
      <el-table-column prop="costTime" label="耗时(ms)" width="100" align="center" />
    </el-table>
    <div style="margin-top: 16px; text-align: right;">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :current-page="page"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[10, 20, 50, 100]"
      />
    </div>
  </div>
</template>

<style scoped>
.log-page-center {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  padding-top: 40px;
  padding-left: 0;
  padding-right: 0;
}
/* 移除卡片样式 */
.log-table-card {
  width: 100%;
  margin: 0;
  box-shadow: none;
  border: none;
  background: none;
}
.el-table {
  max-height: 520px;
  overflow-y: auto;
  min-width: 1100px;
  border-radius: 0;
  box-shadow: none;
}
:deep(.el-table th),
:deep(.el-table td) {
  text-align: center !important;
}
</style>