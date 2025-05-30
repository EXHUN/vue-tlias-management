import request from '../utils/request'

// 查询员工列表数据
export const queryPageApi = (name,gender,begin,end,page,pageSize) =>
 request.get(`/emps?name=${name}&gender=${gender}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`) 

// 新增 (相应数据是json 所以要传入一个对象)


// 根据ID查询部门


// 修改 (相应数据是json 所以要传入一个对象)


// 删除
