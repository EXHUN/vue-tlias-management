<script setup>
  import { ref,watch } from "vue";

  // 搜索表单对象
  const searchEmp = ref({name:'',gender:'',date:[],begin:'',end:''})

  // 侦听searchEmp的date属性
  watch(() => searchEmp.value.date, (newVal,oldVal) => {
    if(newVal.length == 2) {
      searchEmp.value.begin = newVal[0];
      searchEmp.value.end = newVal[1];
    }else {
      searchEmp.value.begin = '';
      searchEmp.value.end = '';
    }
  })

  // 查询员工列表
  const search = () => {
    console.log(searchEmp.value);
    
  }

 
  // 清空员工列表
  const clear = () => {
    searchEmp.value = {name:'',gender:'',date:[],begin:'',end:''},
    search();
  }

  // watch侦听 -------演示--------
    // 1.侦听一个响应式数据
    // const a = ref('');
    // watch(a,(newVal,oldVal) => {
    //   console.log(`变化后的值：${newVal}, 变化前的值：${oldVal}`);
    // })

    // 2.侦听一个对象(侦听对象的全部属性)
    // const user = ref({name:'',age:10});
    // watch(user,(newVal,oldVal) => {
    //   console.log(newVal);
    // },{deep:true}) // deep:true表示深度侦听

    // 3. 侦听对象中的某一个属性
    //    const user = ref({name:'',age:10});
    //    watch(() =>  user.value.age ,(newVal,oldVal) => {
    //   console.log(`变化后的值：${newVal}, 变化前的值：${oldVal}`);
    // })
</script>

<template>
  <h1>员工管理</h1>

  <!-- 搜索栏 -->
  <div class="container">
    {{ searchEmp }}
    <el-form :inline="true" :model="searchEmp" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="searchEmp.name" placeholder="请输入员工姓名" clearable />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="searchEmp.gender" placeholder="请选择" clearable>
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间">
       <el-date-picker
        v-model="searchEmp.date"
        type="daterange"
        range-separator="到"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD"
      />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="info" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
  .container {
    margin:15px 0px;
  }
</style>