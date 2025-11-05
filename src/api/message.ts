import { request } from '@/api/config';
import {TypeMessageAPI} from './index.d';

const _getMessageCount = () => request(
  '/planet/messageCenter/messageCount',
  {
    method:'get',
  }
);

const _getConfig = () => request(
  '/planet/messageCenter/getNotifyConfig',
  {
    method:'get',
  }
);
const _changeConfig = (data:TypeMessageAPI.APIChangeConfig) => request(
  '/planet/messageCenter/updateNotifyConfig',
  {
    method:'post',
    data
  }
);

const _getComment = (data:TypeMessageAPI.APIGetComment) => request(
  `/planet/messageCenter/atMePage?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
  {
    method:'get',
  }
);

const _getFavor = (data:TypeMessageAPI.APIGetFavor) => request(
  `/planet/messageCenter/likePage?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
  {
    method:'get',
  }
);

const _getReply = (data:TypeMessageAPI.APIGetReply) => request(
  `/planet/messageCenter/commentReplyPage?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
  {
    method:'get',
  }
);

const _getCollection = (data:TypeMessageAPI.APIGetCollection) => request(
  `/planet/messageCenter/collectionPage?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
  {
    method:'get',
  }
);

const _favor = (data:any) => request(
  '/planet/operation/like',
  {
    method:'post',
    data
  }
);


export {
  _getMessageCount,
  _getConfig,
  _changeConfig,
  _getComment,
  _getFavor,
  _getReply,
  _getCollection,
  _favor,
};