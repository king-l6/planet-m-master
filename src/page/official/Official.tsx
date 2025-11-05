/*
 * @Author: your name
 * @Date: 2021-11-13 17:43:05
 * @LastEditTime: 2022-02-09 16:27:03
 * @LastEditors: xushx
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \planet-m\planet-m\src\page\official\Official.tsx
 */
import React, { FC, useEffect,useState } from 'react';
import { MESSAGEBKGPIC } from '@/assets/image.ts';
import { OFFICIALAPI } from '@/api';
import { useHistory } from 'react-router';
import SvgIcon from '@/components/svgicon';
import './index.less';

const Official = () => {

  const History = useHistory();
  const routeParams = new URLSearchParams(History.location.search) as any;
  
  const [infoData,setInfoData] = useState(null);
  const workId = routeParams.get('workCode');
  
  useEffect(()=>{
    if(workId) officialInfo();
  },[]);
  
  const officialInfo = async () => {
    /**
     * @description: 官方号个人相关信息
     * @param {*}
     * @return {*}
     */
    try {
      const res = await OFFICIALAPI._getOfficialUserInfo({ workCode : workId });
      setInfoData(res);
    } catch (error) {
      console.info(error);
    }
  };

  const OfficialTitle = () => {
    return (
      <div className='page-official-title'>
        {
          infoData?.avatarUrl ? 
            <div className='page-official-title-imgwrap'>
              <img src={infoData?.avatarUrl} alt="" />
              <SvgIcon type="icon-V_icon" className="cert" />
            </div>
            : <SvgIcon type="icon-default_tx" className="avar" /> 
        }
        <div className='page-official-title-name'>{infoData?.accountNickname}</div>
      </div>
    );
  };

  const OfficialContent = () => {
    return (
      <div className='page-official-content'>
        <div className='page-official-content-tit'>简介</div>
        <div className='page-official-content-txt'>{infoData?.summary}</div>
      </div>
    );
  };

  return (
    <div className='page-official'>
      <OfficialTitle />
      <OfficialContent />
      <div className="page-official-bg">
        <img src={MESSAGEBKGPIC} alt="" />
      </div>
    </div>
  );
};
export { Official };
export default Official;