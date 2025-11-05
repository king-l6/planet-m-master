/*
 * @Author: your name
 * @Date: 2021-10-28 17:55:17
 * @LastEditTime: 2022-01-25 20:23:56
 * @LastEditors: Yixeu
 * @Description: In User Settings Edit
 * @FilePath: /planet-m/src/routes/RouteConfig.tsx
 */
import * as React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  withRouter,
  useHistory,
  useLocation
} from 'react-router-dom';
import { dropByCacheKey } from 'react-router-cache-route';

import { ComponentMenu, ComponentSearchHead } from '@/components';
import { CacheRoute, CacheSwitch } from 'react-router-cache-route';
import routes from './route';
import { Toast } from 'antd-mobile';
import { IsPc } from '@/mixin';

const ComponentBottom: React.FC = () => {
  /**
   * @description: 首页&我的 独立底部菜单 需要关联Route
   * @param {*}
   * @return {*}
   */
  const history = useHistory();
  const location = useLocation();
  const { pathname } = location;

  const setRouteActive = (value: string) => {
    if (value === '/publish') {
      history.push(`${value}?from=${pathname === '/' ? 1 : 2}`);
    } else if (value === '/') {
      history.replace(value);
      dropByCacheKey('/personal');
    }
    else {
      history.replace(value);
    }
  };

  return (
    <React.Fragment>
      {
        (pathname === '/' || pathname === '/personal')  ? <ComponentMenu activeTab={pathname} changeTab={(url: string) => {
          setRouteActive(url);
        }} /> : null
      }
    </React.Fragment>
  );
};

const ComponentGlobalSearch: React.FC = () => {
  const location = useLocation();
  const { pathname } = location;
  return (
    <React.Fragment>
      {
        pathname === '/globalSearch' || pathname === '/globalSearchResult' ? <ComponentSearchHead /> : null
      }
    </React.Fragment>
  );
};


const MainRoute = withRouter(({ location }) => (
  <CacheSwitch location={location}>
    {routes.map((route, index: number) => (
      route.isCashe ?
        <CacheRoute
          cacheKey={route.path}
          key={index}
          path={route.path}
          when={route.cashType ? route.cashType : 'forward'}
          exact
          render={(props: any) => {
            Toast.clear();            
            if(route.cashType === 'back'){
              document.title = '发布帖子';
            }else{
              document.title = route.title?route.title:'';
            }                         
            return <route.Component {...props} />;}} /> :
        <Route
          key={index}
          path={route.path}
          exact
          render={(props: any) => {
            document.title = route.title ? route.title : '';
            return <route.Component {...props} />;
          }}
        />
    ))}
  </CacheSwitch>
));

const RouteConfig = (props: any) => {
  return <Router>
    <div>
      <ComponentGlobalSearch />
      <MainRoute />
    </div>
    {
      !IsPc()?<ComponentBottom /> : null
    }
    
  </Router>;
};

export default RouteConfig;
