import request from '../utils/request'

// 修改密码
export const changePasswordApi = (data) => request.post('/emps/updatePwd', data);
