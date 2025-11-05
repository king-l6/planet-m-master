/*
 * @Author: your name
 * @Date: 2021-11-15 11:12:49
 * @LastEditTime: 2022-01-24 20:19:22
 * @LastEditors: Yixeu
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \planet-m\planet-m\src\api\config\index.ts
 */
import axios from 'axios';
import { AxiosResponse } from 'axios';
import { Toast } from 'antd-mobile';
import { config } from 'react-transition-group';

interface IAxiosConfig {
  method:
  | 'GET'
  | 'get'
  | 'POST'
  | 'post'
  | 'PUT'
  | 'put'
  | 'DELETE'
  | 'delete';
  params?: any;
  data?: any;
  headers?: { [index: string]: string };
}

const BASE_URL: string = import.meta.env.MODE === 'development' ? '/api/api' : `${location.origin}/api`;

const HEADER_PARAMS = {
  'X-CSRF': `csrf-${Math.random()}`,
  // 'x1-bilispy-color': 'planet',
  'X-UserType': 1,
  'X-AppKey': 'ops.teamwork.portal',
  // 'X-Account': 'zhanghaonan'
}; 
axios.interceptors.request.use(
  (config) => {
    if(sessionStorage.getItem('workCode')){
      config.headers['X-BB-WorkCode'] = sessionStorage.getItem('workCode');
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Add a response interceptor
axios.interceptors.response.use(
  (res: any) => {
    const { data } = res;
    // 统一处理response data ，适用于错误封装
    if (data && data.code === 0) {
      return data.data;
    } else if (data && data.code === -101 && import.meta.env.MODE != 'development' && window.location.hash.split('?')[0] !== '#/detail') {
      window.location.href = `${import.meta.env.VITE_DASHBOARD}`;
    } else if (data && data.code === -101  && window.location.hash.split('?')[0] === '#/detail') {
      window.location.href =`https://dashboard-mng.biliapi.net/api/v4/user/dashboard_login?caller=bbplanet&path=%2F${encodeURIComponent(window.location.hash)}`;
    }
    else {
      const { url } = res?.config;
      if((/article\/transWorkCode/g).test(url)){
        Toast.clear();
        Toast.show({
          icon: 'fail',
          content: '用户昵称不存在',
        });
      }else{
        Toast.clear();
        Toast.show({
          icon: 'fail',
          content: data.message,
        });
      }
    }
    return Promise.reject(data);
  },
  (error) => Promise.reject(error),
);

export function request<T>(
  url: string,
  config: any,
): Promise<
  AxiosResponse<{
    code: string;
    errcode: string;
    message: string;
    obj: T;
  }>
  > {
  const headers = {
    ...config.headers,
    Accept: 'application/json',
    'Content-Type': config && config['Content-Type'] ? config['Content-Type'] : 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    // crossDomain: 'true',
    ...HEADER_PARAMS
  };

  if(config.isCacheControl){
    headers['Cache-Control'] = 'no-cache';
  }
  config.params = config.params || {};

  return axios.request<{
    code: string;
    errcode: string;
    message: string;
    obj: T;
  }>({
    url: config.picture ? url : BASE_URL + url,
    headers,
    ...config,
    withCredentials: true
  });
}
