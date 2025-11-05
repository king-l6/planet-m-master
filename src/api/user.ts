/*
 * @Author: your name
 * @Date: 2021-11-12 19:10:16
 * @LastEditTime: 2021-11-12 19:16:12
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /planet-m/src/api/user.ts
 */
import { request } from '@/api/config';

//  个人信息获取
const _getUserInfo = () => request(
  '/planet/person/info',
  {
    method: 'get',
    isCacheControl: true
  },
);

const _getWorkCode = (nickName:string) => request(
  `/planet/article/transWorkCode?nickname=${nickName}`,
  {
    method: 'get',
  }
);
export {
  _getUserInfo,
  _getWorkCode
};
