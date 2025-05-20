import request from '../utils/request'

// 查询全部部门数据
export const queryAllApi = () => request.get('/depts');

// 新增 (相应数据是json 所以要传入一个对象)
export const addApi = (dept) => request.post('/depts',dept);

// 根据ID查询部门
export const queryByIdApi = (id) => request.get(`/depts/${id}`);

// 修改 (相应数据是json 所以要传入一个对象)
export const updateApi = (dept) => request.put('/depts',dept);

// 删除