/*
 * @Author: your name
 * @Date: 2021-11-10 20:54:16
 * @LastEditTime: 2021-11-12 16:50:01
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /planet-m/src/api/convention.ts
 */
import { request } from '@/api/config';

// 确认公约接口
const _confirmConvention = ()=> request(
  '/planet/convention/update',
  {
    method: 'post'
  }
);

export {
  _confirmConvention
};