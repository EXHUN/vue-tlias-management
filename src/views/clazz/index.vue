<script setup>
import { ref, reactive, watch, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  queryClazzPageApi,
  queryClazzInfoApi,
  addClazzApi,
  updateClazzApi,
  deleteClazzApi
} from "@/api/clazz";

// 搜索表单
const searchForm = reactive({
  name: "",
  date: [],
  begin: "",
  end: ""
});

// 监听日期选择
watch(() => searchForm.date, (val) => {
  if (val && val.length === 2) {
    searchForm.begin = val[0];
    searchForm.end = val[1];
  } else {
    searchForm.begin = "";
    searchForm.end = "";
  }
});

// 分页
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 班级列表
const clazzList = ref([]);

// 查询班级列表
const fetchClazzList = async () => {
  const res = await queryClazzPageApi(
    searchForm.name,
    searchForm.begin,
    searchForm.end,
    currentPage.value,
    pageSize.value
  );
  if (res && res.code === 1) {
    clazzList.value = res.data.rows;
    total.value = res.data.total;
  } else {
    clazzList.value = [];
    total.value = 0;
  }
};

// 搜索
const handleSearch = () => {
  currentPage.value = 1;
  fetchClazzList();
};

// 清空
const handleClear = () => {
  searchForm.name = "";
  searchForm.date = [];
  searchForm.begin = "";
  searchForm.end = "";
  handleSearch();
};

// 分页事件
const handleSizeChange = (val) => {
  pageSize.value = val;
  fetchClazzList();
};
const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchClazzList();
};

// 弹窗表单
const dialogVisible = ref(false);
const dialogTitle = ref("新增班级");
const formRef = ref();
const formData = reactive({
  id: null,
  name: "",
  room: "",
  beginDate: "",
  endDate: "",
  masterId: null,
  subject: null
});

// 校验规则
const rules = {
  name: [{ required: true, message: "请输入班级名称", trigger: "blur" }],
  room: [{ required: true, message: "请输入班级教室", trigger: "blur" }],
  beginDate: [{ required: true, message: "请选择开课时间", trigger: "change" }],
  endDate: [{ required: true, message: "请选择结课时间", trigger: "change" }],
  subject: [{ required: true, message: "请选择学科", trigger: "change" }]
};

// 学科选项
const subjectOptions = [
  { label: "Java", value: 1 },
  { label: "前端", value: 2 },
  { label: "大数据", value: 3 },
  { label: "Python", value: 4 },
  { label: "Go", value: 5 },
  { label: "嵌入式", value: 6 }
];

// 新增班级
const handleAdd = () => {
  dialogTitle.value = "新增班级";
  Object.assign(formData, {
    id: null,
    name: "",
    room: "",
    beginDate: "",
    endDate: "",
    masterId: null,
    subject: null
  });
  dialogVisible.value = true;
  nextTick(() => formRef.value && formRef.value.clearValidate());
};

// 编辑班级
const handleEdit = async (row) => {
  const res = await queryClazzInfoApi(row.id);
  if (res && res.code === 1) {
    dialogTitle.value = "编辑班级";
    Object.assign(formData, res.data);
    dialogVisible.value = true;
    nextTick(() => formRef.value && formRef.value.clearValidate());
  }
};

// 保存班级
const handleSave = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    let res;
    if (formData.id) {
      res = await updateClazzApi(formData);
    } else {
      res = await addClazzApi(formData);
    }
    if (res && res.code === 1) {
      ElMessage.success("保存成功");
      dialogVisible.value = false;
      fetchClazzList();
    } else {
      ElMessage.error(res && res.msg ? res.msg : "保存失败");
    }
  });
};

// 删除班级
const handleDelete = (row) => {
  ElMessageBox.confirm("确定要删除该班级吗？", "提示", {
    type: "warning"
  }).then(async () => {
    const res = await deleteClazzApi(row.id);
    if (res && res.code === 1) {
      ElMessage.success("删除成功");
      fetchClazzList();
    } else if (res && res.code === "关联学生") {
      ElMessage.error("该班级下有学生，不能直接删除");
    } else {
      ElMessage.error(res && res.msg ? res.msg : "删除失败");
    }
  });
};

onMounted(fetchClazzList);
</script>

<template>
  <h1>班级管理</h1>
  <!-- 搜索栏 -->
  <div class="container">
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="班级名称">
        <el-input v-model="searchForm.name" placeholder="请输入班级名称" clearable />
      </el-form-item>
      <el-form-item label="结课时间">
        <el-date-picker
          v-model="searchForm.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleClear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 功能按钮 -->
  <div class="container">
    <el-button type="primary" @click="handleAdd">新增班级</el-button>
  </div>

  <!-- 数据表格 -->
  <div class="container">
    <el-table :data="clazzList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="55" align="center" />
      <el-table-column prop="name" label="班级名称" width="200" align="center" />
      <el-table-column prop="room" label="班级教室" width="120" align="center" />
      <el-table-column prop="beginDate" label="开课时间" width="120" align="center" />
      <el-table-column prop="endDate" label="结课时间" width="120" align="center" />
      <el-table-column prop="subject" label="学科" width="100" align="center">
        <template #default="scope">
          <span>
            {{ subjectOptions.find(opt => opt.value === scope.row.subject)?.label || scope.row.subject }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="masterId" label="班主任ID" width="100" align="center" />
      <el-table-column prop="updateTime" label="最后操作时间" width="220" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 分页条 -->
  <div class="container">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5,10,20,30,50,75,100]"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

  <!-- 新增/编辑班级弹窗 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="班级名称" prop="name">
        <el-input v-model="formData.name" maxlength="30" show-word-limit placeholder="请输入班级名称" />
      </el-form-item>
      <el-form-item label="班级教室" prop="room">
        <el-input v-model="formData.room" maxlength="20" show-word-limit placeholder="请输入班级教室" />
      </el-form-item>
      <el-form-item label="开课时间" prop="beginDate">
        <el-date-picker v-model="formData.beginDate" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="结课时间" prop="endDate">
        <el-date-picker v-model="formData.endDate" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="学科" prop="subject">
        <el-select v-model="formData.subject" placeholder="请选择学科">
          <el-option v-for="item in subjectOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="班主任ID" prop="masterId">
        <el-input v-model="formData.masterId" placeholder="请输入班主任ID" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  margin: 10px 0px;
}
</style>