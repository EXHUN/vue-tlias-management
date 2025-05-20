import request from '../utils/request'

// 查询全部部门数据
export const queryAllApi = () => request.get('/depts');

// 新增(相应数据是json 所以要传入一个对象)
export const addApi = (dept) => request.post('/depts',dept);
// 修改

// 删除