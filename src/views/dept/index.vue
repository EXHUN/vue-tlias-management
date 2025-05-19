<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 钩子函数
onMounted(() => {
  search();
})

// 查询
const search = async () => {
  const result = await axios.get('https://m1.apifoxmock.com/m1/6415117-6112378-default/depts');
  if(result.data.code) { // JS隐式类型转换 0 - false ， 其它数字 - true, '' - false,其它 - true, null、undefined - false
    deptList.value = result.data.data;
  }
}


const deptList = ref([])
</script>

<template>
  <h1>部门管理</h1>
  <div class="container">
    <el-button type="primary"> + 新增部门</el-button>
  </div>

  <div class="container">
    <el-table :data="deptList" border style="width: 100%">
      <el-table-column type="index" label="序号"  width="100" align="center"/>
      <el-table-column prop="name" label="部门名称" width="260" align="center"/>
      <el-table-column prop="updateTime" label="最后操作时间" width="300" align="center"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small"><el-icon><EditPen /></el-icon>编辑</el-button>
          <el-button type="danger" size="small"><el-icon><Delete /></el-icon>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<style scoped>
.container {
  margin: 10px 0px;
}
</style>
