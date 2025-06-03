<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  queryStuPageApi,
  addStuApi,
  queryStuInfoApi,
  updateStuApi,
  deleteStuApi,
  violationApi
} from "@/api/stu";
import { queryAllClazzApi } from "@/api/clazz";

// 最高学历/下拉（可替换为接口获取）
const degreeOptions = ref([
  { label: "初中", value: 1 },
  { label: "高中", value: 2 },
  { label: "大专", value: 3 },
  { label: "本科", value: 4 },
  { label: "硕士", value: 5 },
  { label: "博士", value: 6 }
]);




// 所属班级下拉
const clazzOptions = ref([]);
const fetchClazzOptions = async () => {
  const res = await queryAllClazzApi();
  if (res && res.code === 1) {
    clazzOptions.value = (res.data || []).map(item => ({
      label: item.name,
      value: item.id
    }));
  }
};

// 搜索表单
const searchForm = reactive({
  name: "",
  degree: "",
  clazzId: ""
});

// 分页
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 学生列表
const stuList = ref([]);
// 多选
const multipleSelection = ref([]);

// 查询学生列表
const fetchStuList = async () => {
  const res = await queryStuPageApi(
    searchForm.name,
    searchForm.degree,
    searchForm.clazzId,
    currentPage.value,
    pageSize.value
  );
  if (res && res.code === 1) {
    stuList.value = res.data.rows;
    total.value = res.data.total;
  } else {
    stuList.value = [];
    total.value = 0;
  }
};

// 搜索
const handleSearch = () => {
  currentPage.value = 1;
  fetchStuList();
};

// 清空
const handleClear = () => {
  searchForm.name = "";
  searchForm.degree = "";
  searchForm.clazzId = "";
  handleSearch();
};

// 分页事件
const handleSizeChange = (val) => {
  pageSize.value = val;
  fetchStuList();
};
const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchStuList();
};

// 多选
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

// 批量删除
const handleBatchDelete = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning("请先选择要删除的学员");
    return;
  }
  ElMessageBox.confirm("确定要批量删除选中的学员吗？", "提示", {
    type: "warning"
  }).then(async () => {
    const ids = multipleSelection.value.map(item => item.id).join(",");
    const res = await deleteStuApi(ids);
    if (res && res.code === 1) {
      ElMessage.success("批量删除成功");
      fetchStuList();
    } else {
      ElMessage.error(res && res.msg ? res.msg : "批量删除失败");
    }
  });
};

// 弹窗表单
const dialogVisible = ref(false);
const dialogTitle = ref("新增学员");
const formRef = ref();
const formData = reactive({
  id: null,
  name: "",
  no: "",
  clazzId: "",
  gender: "",
  phone: "",
  degree: "",
  idCard: "",
  isCollege: "",
  address: "",
  graduationDate: "",
  violationCount: "",
  violationScore: "",
  updateTime: "",
  clazzName: ""
});

// 校验规则
const rules = {
  name: [
    { required: true, message: "请输入学员姓名", trigger: "blur" },
    { min: 2, max: 10, message: "姓名长度为2-10位", trigger: "blur" }
  ],
  no: [
    { required: true, message: "请输入学号", trigger: "blur" },
    { pattern: /^[A-Za-z0-9]{10}$/, message: "学号为10位数字或字母", trigger: "blur" }
  ],
  gender: [
    { required: true, message: "请选择性别", trigger: "change" }
  ],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "手机号格式非法", trigger: "blur" }
  ],
  idCard: [
    { required: true, message: "请输入身份证号", trigger: "blur" },
    { pattern: /^\d{18}$/, message: "身份证号格式非法", trigger: "blur" }
  ],
  isCollege: [
    { required: true, message: "请选择是否院校学员", trigger: "change" }
  ],
  address: [
    { min: 0, max: 100, message: "地址长度不能超过100位", trigger: "blur" }
  ],
  degree: [
    { required: true, message: "请选择最高学历", trigger: "change" }
  ],
  // graduationDate: [
  //   // 可选项，不强制校验
  // ],
  // clazzId: [
  //   // 可选项，不强制校验
  // ]
};

// 新增学员
const handleAdd = () => {
  dialogTitle.value = "新增学员";
  Object.assign(formData, {
    id: null,
    name: "",
    no: "",
    clazzId: "",
    gender: "",
    phone: "",
    degree: "",
    idCard: "",
    isCollege: "",
    address: "",
    graduationDate: "",
    violationCount: "",
    violationScore: "",
    updateTime: "",
    clazzName: ""
  });
  dialogVisible.value = true;
  nextTick(() => formRef.value && formRef.value.clearValidate());
};

// 编辑学员
const handleEdit = async (row) => {
  const res = await queryStuInfoApi(row.id);
  if (res && res.code === 1) {
    dialogTitle.value = "编辑学员";
    Object.assign(formData, res.data);
    dialogVisible.value = true;
    nextTick(() => formRef.value && formRef.value.clearValidate());
  }
};

// 保存学员
const handleSave = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    let res;
    if (formData.id) {
      res = await updateStuApi(formData);
    } else {
      res = await addStuApi(formData);
    }
    if (res && res.code === 1) {
      ElMessage.success("保存成功");
      dialogVisible.value = false;
      fetchStuList();
    } else {
      ElMessage.error(res && res.msg ? res.msg : "保存失败");
    }
  });
};

// 删除学员
const handleDelete = (row) => {
  ElMessageBox.confirm("确定要删除该学员吗？", "提示", {
    type: "warning"
  }).then(async () => {
    const res = await deleteStuApi(row.id);
    if (res && res.code === 1) {
      ElMessage.success("删除成功");
      fetchStuList();
    } else {
      ElMessage.error(res && res.msg ? res.msg : "删除失败");
    }
  });
};

// 违纪处理
const handleViolation = (row) => {
  ElMessageBox.prompt("请输入要扣除的分数", "违纪处理", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^[1-9]\d*$/,
    inputErrorMessage: "请输入正整数"
  }).then(async ({ value }) => {
    const res = await violationApi(row.id, value);
    if (res && res.code === 1) {
      ElMessage.success("扣分成功");
      fetchStuList();
    } else {
      ElMessage.error(res && res.msg ? res.msg : "扣分失败");
    }
  }).catch(() => { });
};

onMounted(() => {
  fetchClazzOptions();
  fetchStuList();
});
</script>

<template>
  <h1>学员管理</h1>
  <!-- 搜索栏 -->
  <div class="container">
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
      </el-form-item>
      <el-form-item label="最高学历">
        <el-select v-model="searchForm.degree" placeholder="请选择最高学历" clearable>
          <el-option v-for="item in degreeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属班级">
        <el-select v-model="searchForm.clazzId" placeholder="请选择班级" clearable>
          <el-option v-for="item in clazzOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button type="info" @click="handleClear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 功能按钮 -->
  <div class="container">
    <el-button type="primary" @click="handleAdd">新增学员</el-button>
    <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
  </div>

  <!-- 数据表格 -->
  <div class="container">
    <el-table :data="stuList" border style="width: 100%" @selection-change="handleSelectionChange">
      <!-- 复选框 -->
      <el-table-column type="selection" width="55" align="center" />
      <!-- 姓名 -->
      <el-table-column prop="name" label="姓名" align="center" />
      <!-- 学号 -->
      <el-table-column prop="no" label="学号" align="center" />
      <!-- 班级 -->
      <el-table-column prop="clazzId" label="班级" align="center">
        <template #default="scope">
          {{clazzOptions.find(opt => opt.value === scope.row.clazzId)?.label || scope.row.clazzId}}
        </template>
      </el-table-column>
      <!-- 性别 -->
      <el-table-column prop="gender" label="性别" align="center">
        <template #default="scope">
          <span v-if="scope.row.gender == 1">男</span>
          <span v-else-if="scope.row.gender == 2">女</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <!-- 手机号 -->
      <el-table-column prop="phone" label="手机号" align="center" />
      <!-- 最高学历 -->
      <el-table-column prop="degree" label="最高学历" align="center">
        <template #default="scope">
          {{degreeOptions.find(opt => opt.value === scope.row.degree)?.label || scope.row.degree}}
        </template>
      </el-table-column>
      <!-- 违纪次数 -->
      <el-table-column prop="violationCount" label="违纪次数" align="center" />
      <!-- 违纪扣分 -->
      <el-table-column prop="violationScore" label="违纪扣分" align="center" />
      <!-- 最后操作时间 -->
      <el-table-column prop="updateTime" label="最后操作时间" align="center" />
      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="220">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="warning" size="small" @click="handleViolation(scope.row)">违纪</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 分页条 -->
  <div class="container">
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30, 50, 75, 100]"
      background layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>

  <!-- 新增/编辑学员弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" style="width: 100%;">
      <el-row :gutter="24">
        <el-col :span="12" style="min-width: 350px;">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formData.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="formData.gender" placeholder="请选择">
              <el-option label="男" :value="1" />
              <el-option label="女" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="formData.idCard" placeholder="请输入身份证号" />
          </el-form-item>
          <el-form-item label="联系地址" prop="address">
            <el-input v-model="formData.address" placeholder="请输入联系地址" />
          </el-form-item>
          <el-form-item label="毕业时间" prop="graduationDate">
            <el-date-picker v-model="formData.graduationDate" type="date" placeholder="请选择毕业时间" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col :span="12" style="min-width: 350px;">
          <el-form-item label="学号" prop="no">
            <el-input v-model="formData.no" placeholder="请输入学号" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="formData.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="院校学员" prop="isCollege">
            <el-select v-model="formData.isCollege" placeholder="请选择">
              <el-option label="是" :value="1" />
              <el-option label="否" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="最高学历" prop="degree">
            <el-select v-model="formData.degree" placeholder="请选择">
              <el-option v-for="item in degreeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属班级" prop="clazzId">
            <el-select v-model="formData.clazzId" placeholder="请选择">
              <el-option v-for="item in clazzOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div style="text-align:center;">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  margin: 10px 0px;
}
</style>