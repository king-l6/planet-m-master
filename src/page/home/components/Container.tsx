import React, { useState, FC } from 'react';
import { ComponentTabBar, ComponentSvgIcon, ComponentCard } from '@/components';
import { useDidUpdate } from 'hooooks';
import { useHistory } from 'react-router';
import { IsPc } from '@/mixin';
interface IProps {
  recommendDataSource: Array<any>;
  lastDataSource: Array<any>;
  changeTab: (order: number) => void;
  tabActive: number;
  topDivState: boolean;
}

const tabBarArr: Array<{ text: string; key: number }> = [
  {
    text: '全部',
    key: 1,
  },
];

const ComponentContainer: FC<IProps> = ({
  recommendDataSource,
  lastDataSource,
  changeTab,
  tabActive,
  topDivState,
}) => {
  const [translateX, setTranletX] = useState(
    tabActive === 2 ? 'translateX(-100vw)' : ('translateX(0)' as string)
  );
  const History = useHistory();
  useDidUpdate(() => {
    setTranletX(tabActive === 2 ? 'translateX(-100vw)' : 'translateX(0)');
  }, [tabActive]);

  const toGlobalSearch = () => {
    History.push('/globalSearch');
  };

  const currentVersion = sessionStorage.getItem('app_version');

  const DOMSearch: React.ReactElement = (
    <div className="home-page-container-search" onClick={toGlobalSearch}>
      <ComponentSvgIcon type={'icon-list_search'} />
      <span>搜一搜</span>
    </div>
  );

  return (
    <div
      className={
        parseInt(currentVersion) === 2
          ? 'home-page-container home-page-container-v2'
          : 'home-page-container'
      }
    >
      {parseInt(currentVersion) === 2 ? null : (
        <>
          <div className="home-page-container-tips" />
          <ComponentTabBar.BarWithExtra
            dataArr={tabBarArr}
            activeTab={tabActive}
            changeTab={(key: number) => {
              changeTab(key);
            }}
            extra={!IsPc() ? DOMSearch : null}
          />
        </>
      )}

      <div className="home-page-container-box">
        <div></div>
        <div className="home-page-container-tab">
          <div
            className="home-page-container-tab-tabpane"
            style={{
              transform: translateX,
            }}
          >
            {recommendDataSource &&
              recommendDataSource.map((s: any, index: number) => {
                return s.hide &&
                  s.hide === 1 ? null :  (
                    <ComponentCard
                      key={`${s.businessId}-${s.isRead}`}
                      data={s}
                      orderType={tabActive}
                      lunarH={4}
                      isHomePage={true}
                    />
                  );
              })}
          </div>
          <div
            className="home-page-container-tab-tabpane"
            style={{
              transform: translateX,
            }}
          >
            {lastDataSource &&
              lastDataSource.map((s: any, index: number) => {
                return s.hide && s.hide === 1 ? null : (
                  <ComponentCard
                    key={`${s.businessId}-1`}
                    data={s}
                    hideType={true}
                    orderType={tabActive}
                    lunarH={4}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ComponentContainer };
export default ComponentContainer;
