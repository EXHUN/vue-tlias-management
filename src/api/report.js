// 获取员工性别统计
export const getEmpGenderData = async (token) => {
    if (!token) throw new Error("未登录或token失效，请先登录");
    const res = await fetch("/report/empGenderData", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (res.status === 401) throw new Error("token无效或已过期，请重新登录");
    if (!res.ok) throw new Error("请求失败：" + res.status);
    return await res.json();
};

// 获取员工职位统计
export const getEmpJobData = async (token) => {
    if (!token) throw new Error("未登录或token失效，请先登录");
    const res = await fetch("/report/empJobData", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (res.status === 401) throw new Error("token无效或已过期，请重新登录");
    if (!res.ok) throw new Error("请求失败：" + res.status);
    return await res.json();
};

// 获取班级人数统计
export const getClazzStudentCount = async (token) => {
    if (!token) throw new Error("未登录或token失效，请先登录");
    const res = await fetch("/report/studentCountData", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (res.status === 401) throw new Error("token无效或已过期，请重新登录");
    if (!res.ok) throw new Error("请求失败：" + res.status);
    return await res.json();
};

// 获取学历统计
export const getDegreeStat = async (token) => {
    if (!token) throw new Error("未登录或token失效，请先登录");
    const res = await fetch("/report/studentDegreeData", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (res.status === 401) throw new Error("token无效或已过期，请重新登录");
    if (!res.ok) throw new Error("请求失败：" + res.status);
    return await res.json();
};

