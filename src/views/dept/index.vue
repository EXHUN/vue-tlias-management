<script setup>
import { ref, onMounted } from 'vue';
import { queryAllApi, addApi, queryByIdApi, updateApi } from "@/api/dept";
import { ElMessage } from 'element-plus';

// 钩子函数
onMounted(() => {
  search();
})

// 查询
const search = async () => {
  // const result = await axios.get('https://m1.apifoxmock.com/m1/6415117-6112378-default/depts');
  // if(result.data.code) { // JS隐式类型转换 0 - false ， 其它数字 - true, '' - false,其它 - true, null、undefined - false
  //   deptList.value = result.data.data;
  // }

  const result = await queryAllApi();
  if (result.code) {
    deptList.value = result.data;
  }
}
const deptList = ref([])

// Dialog对话框
const dialogFormVisible = ref(false);
const formTitle = ref('');

const dept = ref({ name: '' });

// 新增部门
const addDept = () => {
  dialogFormVisible.value = true;
  formTitle.value = '新增部门';
  dept.value = { name: '' };
  // 重置表单的校验规则
  if (deptFormRef.value)
    deptFormRef.value.resetFields()
}

// 保存部门
const save = async () => {
  // 表单校验
  if (!deptFormRef.value) return
  deptFormRef.value.validate(async (valid) => { // valid表示是否校验通过:true 通过/ false 不通过
    if (valid) {
      let result;

      if(dept.value.id) {// 修改
        result = await updateApi(dept.value);
      }else { // 新增
        result = await addApi(dept.value);
      }

      if (result.code) { // 成功
        // 提示信息
        ElMessage.success("操作成功");
        // 关闭对话框
        dialogFormVisible.value = false;
        // 查询最新数据
        search();
      } else { // 失败
        // 提示信息
        ElMessage.error(result.msg);
      }
    } else { // 不通过
      ElMessage.error("表单校验不通过");
    }
  })
}

// 表单校验
const rules = ref({
  name: [
    { required: true, message: '部门名称是必填项', trigger: 'blur' },
    { min: 2, max: 10, message: '部门名称的长度应该在2-10位', trigger: 'blur' },
  ]
})

const deptFormRef = ref();

// 编辑
const edit = async (id) => {
  formTitle.value = '修改部门';
  // 重置表单的校验规则
  if (deptFormRef.value)
    deptFormRef.value.resetFields()
  const result = await queryByIdApi(id);
  if (result.code) {
    dialogFormVisible.value = true;
    dept.value = result.data;
  }
}


</script>

<template>
  <h1>部门管理</h1>
  <div class="container">
    <el-button type="primary" @click="addDept"> + 新增部门</el-button>
  </div>

  <!-- 表格 -->
  <div class="container">
    <el-table :data="deptList" border style="width: 100%">
      <el-table-column type="index" label="序号" width="100" align="center" />
      <el-table-column prop="name" label="部门名称" width="260" align="center" />
      <el-table-column prop="updateTime" label="最后操作时间" width="300" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="edit(scope.row.id)"><el-icon>
              <EditPen />
            </el-icon>编辑</el-button>
          <el-button type="danger" size="small"><el-icon>
              <Delete />
            </el-icon>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- Dialog对话框 -->
  <el-dialog v-model="dialogFormVisible" :title="formTitle" width="500">
    <el-form :model="dept" :rules="rules" ref="deptFormRef">
      <el-form-item label="部门名称" label-width="80px" prop="name">
        <el-input v-model="dept.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-dialog>


</template>

<style scoped>
.container {
  margin: 10px 0px;
}
</style>
