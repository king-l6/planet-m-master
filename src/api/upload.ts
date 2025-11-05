import { request } from '@/api/config';

const _uploadPicture = (data:FormData) => request(
  '/planet/common/upload',
  {
    method:'post',
    data
  }
);

export {
  _uploadPicture
};