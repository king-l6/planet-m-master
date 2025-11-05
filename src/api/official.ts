
import { request } from '@/api/config';
import {TypeOfficialAPI} from './index.d';

//  官方号个人相关信息获取
const _getOfficialUserInfo = (data:TypeOfficialAPI.APIOfficial) => request(
  `/planet/person/officialInfo?workCode=${data.workCode}`,
  {
    method: 'get',
  },
);

export {
  _getOfficialUserInfo,
};
