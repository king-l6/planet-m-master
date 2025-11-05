/*
 * @Author: your name
 * @Date: 2021-12-03 17:34:42
 * @LastEditTime: 2021-12-03 17:34:42
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \bibiball\planet-m\src\api\wxsignature.ts
 */
import { request } from '@/api/config';
import { TypeWxSignatureAPI } from './index.d';

//  获取微信字段详情
const _getWxSignature = (data: TypeWxSignatureAPI.APIGetWxSignature) => request(
  `/planet/wechat/getWxSignature?url=${data.url}`,
  {
    method: 'get',
  },
);

export {
  _getWxSignature
};