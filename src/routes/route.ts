/**
 * @description: 路由
 * @param {*}
 * @return {*}
 */

import { lazy } from 'react';
import { Home, Personal, Detail, Publish, Aite, History, Result, Message, Aitem, Reply, Favor, Collection, Notify, Official } from '@/page';

interface IRoute {
  path: string;
  Component: React.FC;
  routes?: any;
  isCashe?: boolean;
  cashType?: 'always' | 'back' | 'forward';
  title?:string
}

const routes: IRoute[] = [
  {
    path: '/',
    Component: Home,
    isCashe: true,
    cashType: 'always',
    title:'首页'
  },
  {
    path: '/personal',
    Component: Personal,
    isCashe: true,
    cashType: 'always',
    title:'我的'
  },
  {
    path: '/publish',
    Component: Publish,
    isCashe: true,
    cashType: 'back',
    title: '发表帖子'
  },
  {
    path: '/detail',
    Component: Detail,
    isCashe: true,
    title:'帖子详情'
  },
  {
    path: '/globalSearch',
    Component: History,
    title:'首页'
  },
  {
    path: '/globalSearchResult',
    Component: Result,
    isCashe: true,
    title:'首页'
  },
  {
    path: '/message',
    Component: Message,
    title:'消息'
  },
  {
    path: '/aiteMe',
    Component: Aitem,
    isCashe: true,
    title:'@我的'
  },
  {
    path: '/replyMe',
    Component: Reply,
    isCashe: true,
    title:'评论与回复'
  },
  {
    path: '/favorMe',
    Component: Favor,
    isCashe: true,
    title:'为我点赞'
  },
  {
    path: '/collectionMine',
    Component: Collection,
    isCashe: true,
    title:'收藏我的'
  },
  {
    path: '/messageConfig',
    Component: Notify,
    title:'消息通知设置'
  },
  {
    path: '/official',
    Component: Official,
    title:'官方号'
  },
  
];



export default routes;
