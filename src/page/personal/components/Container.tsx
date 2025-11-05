import React, { useState, FC } from 'react';
import { ComponentTabBar, ComponentSvgIcon, ComponentCard } from '@/components';
import { PIC_EMPTY } from '@/assets/image.ts';
import { useDidUpdate } from 'hooooks';
interface IProps {
  tabAmount: { collectionCount: number, participateCount: number, publishCount: number },
  joinDataSource: Array<any>;
  starDataSource: Array<any>;
  publishDataSource: Array<any>;
  changeTab: (order: number) => void;
  tabActive: number;
  topDivState:boolean;
}

const tabBarArr = [
  {
    text: '发布',
    amount: 0,
    key: 0,
    egText: 'publishCount'
  },
  {
    text: '参与',
    amount: 0,
    key: 1,
    egText: 'participateCount'
  },
  {
    text: '收藏',
    amount: 0,
    key: 2,
    egText: 'collectionCount'
  }
];

const ComponentContainer: FC<IProps> = ({ tabAmount, tabActive, changeTab, joinDataSource, starDataSource, publishDataSource, topDivState }) => {

  const [translateX, setTranletX] = useState(tabActive === 0 ? 'translateX(0)' : tabActive === 1 ? 'translateX(-100vw)' : 'translateX(-200vw)' as string);

  useDidUpdate(() => {
    setTranletX(tabActive === 0 ? 'translateX(0)' : tabActive === 1 ? 'translateX(-100vw)' : 'translateX(-200vw)');
  }, [tabActive]);

  return <div className="personal-page-container">
    <ComponentTabBar.BarAverage
      dataArr={tabBarArr}
      activeTab={tabActive}
      changeTab={(key: number) => {
        changeTab(key);
      }}
      tabAmount={tabAmount}
    />
    {topDivState?<div className='personal-page-container-topdiv'></div>:null}
    
    <div className="personal-page-container-box">
      <div className="personal-page-container-tab" >
        <div className="personal-page-container-tab-tabpane" style={{
          transform: translateX,
        }}>
          {
            !publishDataSource?null: publishDataSource.length > 0? publishDataSource.map((s: any, index: number) => {
              return <ComponentCard key={s.businessId} data={s} hideType={true} lunarH={4}/>;
            }):<div className="no-result">
              <img src={PIC_EMPTY} alt="" />
              <span>这里什么都没有叻～</span>
            </div>
          }
        </div>
        <div className="personal-page-container-tab-tabpane" style={{
          transform: translateX,
        }}>
          {
            !joinDataSource? null: joinDataSource.length > 0? joinDataSource.map((s: any, index: number) => {
              return <ComponentCard key={s.businessId} data={s} hideType={true} lunarH={4} />;
            }):<div className="no-result">
              <img src={PIC_EMPTY} alt="" />
              <span>这里什么都没有叻～</span>
            </div>
          }

        </div>
        <div className="personal-page-container-tab-tabpane" style={{
          transform: translateX,
        }}>
          {
            !starDataSource? null: starDataSource.length > 0?starDataSource.map((s: any, index: number) => {
              return <ComponentCard key={s.businessId} data={s} hideType={true} lunarH={4} />;
            }):<div className="no-result">
              <img src={PIC_EMPTY} alt="" />
              <span>这里什么都没有叻～</span>
            </div>
          }

        </div>
      </div>
    </div>
  </div>;
};

export { ComponentContainer };
export default ComponentContainer;
