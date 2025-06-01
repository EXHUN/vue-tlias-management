import request from '../utils/request'

// 查询班级列表数据
export const queryClazzPageApi = (name, begin, end, page, pageSize) =>
  request.get(`/clazzs?name=${name}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`)

// 新增班级
export const addClazzApi = (clazz) => request.post('/clazzs', clazz)

// 根据ID查询班级
export const queryClazzInfoApi = (id) => request.get(`/clazzs/${id}`)

// 修改班级
export const updateClazzApi = (clazz) => request.put('/clazzs', clazz)

// 删除班级
export const deleteClazzApi = (id) => request.delete(`/clazzs/${id}`)

// 查询所有班级 （请求路径：/clazzs/list）
export const queryAllClazzApi = () => request.get('/clazzs/list')