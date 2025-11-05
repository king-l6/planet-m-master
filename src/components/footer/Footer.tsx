import React, { FC, useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router';
import { PUBLISHAPI } from '@/api';
import { Toast, Button } from 'antd-mobile';
import { htmlSpanParse, pushInnerFormat, regFilter } from '@/page/publish/components/publishEdit/edit';
import { encryption, handlePostTitle } from '@/mixin';
import { clearCache } from 'react-router-cache-route';
import SvgIcon from '@/components/svgicon';
import { PIC_TIPM } from '@/assets/image.ts';

import { Store } from '@/store';

import './index.less';


interface PostFunctionProps {
  postTitle: string,
  postText: string,
  PostInner: string;
  fileList: Array<[]>,
}

const Footer: FC<PostFunctionProps> = ({ postTitle, postText, fileList, PostInner }) => {
  const History = useHistory();
  const routeParams = new URLSearchParams(History.location.search) as any;
  const [disabledState, setDisableState] = useState(false);

  const [publishButtonState, setPublishButtonState] = useState(false);

  const { state, dispatch } = useContext(Store);

  useEffect(() => {
    postTitle.trim() ? setPublishButtonState(true) : setPublishButtonState(false);
  }, [postTitle]);

  
  const publishPost = async () => {
    /**
     * @description: 发布功能
     * @param {*}
     * @return {*}
     */
    const fileUrlList: any = [];
    if (fileList.length > 0) {
      fileList.map((item: any) => {
        fileUrlList.push(item.imgUrl);
      });
    }    
    const publishData = {
      'title': handlePostTitle(postTitle),
      'simpleContent': encryption(regFilter(pushInnerFormat(postText))),
      'fullContent': encryption(regFilter(pushInnerFormat(postText))),
      'picList': fileUrlList,
      'atUserList': htmlSpanParse(postText)
    };
    
    if ([...(postTitle)].length <= 30) {
      if ([...(postTitle.trim())].length === 0) {
        Toast.show({
          content: '请输入标题',
          duration: 3000
        });
      } else if ([...(postTitle.trim())].length > 0 
      // && PostInner.length <= 1000
      ) {
        Toast.show({
          content: '帖子发布中...'
        });
        setDisableState(true);
        try {
          const res: any = await PUBLISHAPI._publishPost(publishData);
          clearCache();
          if (res && res.code != -101) {
            sessionStorage.setItem('bf', '1');
            Toast.clear();
            if (routeParams.get('from') && routeParams.get('from') == '1') {
              History.goBack();
            } else {
              History.replace('/');
            }
            //发帖后新增帖子埋点
            (window as any)?._sendTrack?.({ na:12, sf: res.businessId }, true);

          }
        } catch (error) {
          Toast.show({
            content: '帖子发布中...',
            duration:5000,
            afterClose:()=>{
              setDisableState(false);
            }
          });
        }
      } else {
        // Toast.show({
        //   content: '正文最多可输入1000个字',
        //   duration: 3000
        // });
      }
    } else {
      Toast.show({
        content: '标题最多可输入30个字',
        duration: 3000
      });
    }
  };

  const formetFont = (e:any) => {
    if(e.length <= 5){
      return e;
    } else {
      return e.slice(0,5) + '...';
    }
  };

  return (
    <div className="c-footer">
      {
        state.userInfo.currentOfficial ? <div className='c-footer-server expect'>
          
          <div className='c-footer-server-wrap expect'>
            <div className='identitycard expect'>当前身份为:{formetFont(state.userInfo.nickName)}</div>
            {state.editIsBlur || state.titleIsBlur ?<img src={PIC_TIPM} className='tips'/> :null}
            {
              state.userInfo.avatarUrl ? <img src={state.userInfo.avatarUrl} alt="" className='iconService'/>
                : <SvgIcon type="icon-default_tx" className='iconService'/>
            }
          </div>
        </div> : <></>
      }
      <Button
        className={!publishButtonState ? '' : 'publish-button'}
        onClick={publishPost}
        disabled={disabledState}
      >
        发布
      </Button> 
    </div>
  );
};
export { Footer };
export default Footer;    