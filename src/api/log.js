// 日志分页查询
export const getLogPage = async ({ page = 1, pageSize = 10, ...params } = {}) => {
  // 拼接query参数
  const searchParams = new URLSearchParams({ page, pageSize, ...params });
  const token = localStorage.getItem('token');
  const res = await fetch(`/log/page?${searchParams.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (res.status === 401) throw new Error('token无效或已过期，请重新登录');
  if (!res.ok) throw new Error('请求失败：' + res.status);
  return await res.json();
};
