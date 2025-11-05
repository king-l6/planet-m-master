import { request } from '@/api/config';
import {TypeBrowserNumberAPI} from './index.d';

const _getBrowseArticle = (data:TypeBrowserNumberAPI.APIGETBrowserNumber) => request(
  '/planet/article/browseArticle',
  {
    method:'post',
    data
  }
);

export {
  _getBrowseArticle
}; 