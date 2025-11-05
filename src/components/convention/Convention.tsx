

import { Toast } from 'antd-mobile';
import React, { FC, useEffect, useState, useRef, useLayoutEffect } from 'react';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import { PIC_COVER, PIC_BTN } from '@/assets/image.ts';
import { IsPc } from '@/mixin';
import { CONVENTIONAPI } from '@/api';

import './index.less';

import { ComponentSvgIcon } from '@/components';
import _ from 'lodash';

interface IProps {
  actionText?: string,
  dialogVisible?: number,
  maskClick?: boolean,
  getDialogState?: (dialogState: number) => void,
  onAction?: (number: number) => void,
}
const Convention: FC<IProps> = ({ onAction }) => {
  const cover = PIC_COVER;
  const tsSrc = 'https://s1.hdslb.com/bfs/static/ehr/afu-sdk/planet/animate.ts';
  const hdVideo = useRef(null);
  const RefVideo = useRef(null);
  const RefTime1 = useRef(null);
  const RefTime2 = useRef(null);
  const RefTime3 = useRef(null);
  const RefDebounceTimer = useRef(null);
  const [isCover, setIsCover] = useState(true);//是否用封面覆盖

  const [showText, setShowText] = useState(false);
  const [scrollBarHeight, setScrollHeight] = useState(0);
  const [conventionButton, setConventionButton] = useState(false);

  useLayoutEffect(() => {
    /**
     * @description: 确认公约
     * @param {*}
     * @return {*}
     */
    if (!(/(iPhone|iPad|iPod|iOS|(Android))/i.test(window?.navigator.userAgent))) {
      document.getElementById('root').style.background = '#0F112C';
    }
  }, []);

  useEffect(() => {
    initTs();
  }, []);


  const initTs = () => {
    const canvas = hdVideo.current.querySelector('.hdVideo-ts');
    canvas.style.width = '0px';
    canvas.style.height = '100vh';
    RefVideo.current = new JSMpeg.VideoElement(canvas, tsSrc, {
      canvas,
      autoplay: true,
      loop: false,
      progressive: false,//是否为chunk
      control: false,
      poster: cover,
      preserveDrawingBuffer: true,
      disableGl: true,
      decodeFirstFrame: false,
    }, {
      audio: false, //静音
      onPlay: () => {
        canvas.style.width = '46.1vh';
        setIsCover(false);

        RefTime1.current = setTimeout(() => {
          setShowText(true);
        }, 3500);

        RefTime2.current = setTimeout(() => {
          RefVideo.current.pause();
        }, 4000);
      },
      onPause: () => {
        clearTimeout(RefTime1.current);
        clearTimeout(RefTime2.current);
        RefVideo.current.player.currentTime = 3;
        RefVideo.current.play();
        RefTime3.current = setTimeout(() => {
          RefVideo.current.pause();
        }, 1000);
      },
      onEnded: () => {
        onAction(2);
      }
    });
  };

  const confirmConvention = async () => {
    /**
         * @description: 接口 - 确认公约
         * @param {*}
         * @return {*}
         */
    try {
      const res = await CONVENTIONAPI._confirmConvention();
      if (res) {
        clearTimeout(RefTime1.current);
        clearTimeout(RefTime2.current);
        clearTimeout(RefTime3.current);
        RefVideo.current.player.currentTime = 4;
        RefVideo.current.play();
        setShowText(false);
      }
    } catch (error) {
      console.info(error);
    }
  };

  return (
    <div className={IsPc() ? 'c-pc-convention' : 'c-convention'}>
      <div ref={hdVideo} className='hdVideo'>
        {isCover ? <img className="hdVideo-image" src={cover} /> : null}
        <canvas className="hdVideo-ts" ></canvas>
      </div>
      {
        showText ? <div className={IsPc() ? 'c-pc-convention-content fadeIn' : 'c-convention-content fadeIn'} >
          <div onScroll={(e: any) => {
            let scrollLength = e.target.scrollTop / (e.target.scrollHeight - e.target.offsetHeight) * (e.target.offsetHeight - 30);
            scrollLength = scrollLength < 0 ? 0 : scrollLength > (e.target.offsetHeight - 30) ? (e.target.offsetHeight - 30) : scrollLength;
            setScrollHeight(scrollLength);
            if ((e.target.scrollTop + e.target.clientHeight) >= (e.target.scrollHeight - 50)) {
              setConventionButton(true);
            }
          }} >
            <div>尊重他人是同事吧最基本的底线。请每一位同学发言时务必遵守公约，共建良好的交流氛围。</div>
            <div>禁止发布以下内容：</div>
            <div>1. 违反法规行为和内容，如传谣诽谤、侵犯隐私；</div>
            <div>2. 议论宗教、政治、民族、种族、性别、年龄、地域等内容的歧视性话题或引战行为；</div>
            <div>3. 使用不雅、色情词句，恶意人身攻击、骚扰、辱骂或其他不友善的行为；</div>
            <div>特别提醒所有伙伴：</div>
            <div>不鼓励以盈利为目的的内部交易以及内部福利买卖行为，请以严谨的态度推销产品、服务和发布买卖广告、征婚交友信息，并切实为自己的言行负责。也请其他同学提高鉴别能力，慎重判断行事。</div>
            <div>对于发布的禁止内容，公司将进行文字屏蔽处理，情节严重者将被禁言。欢迎大家互相监督，对各种不当行为进行劝诫和引导。
              让我们一起努力，维护B站人开放透明的内网，共建乐学温暖的精神家园！
            </div>

            <span className={IsPc() ? 'c-pc-convention-content-icon' : 'c-convention-content-icon'} style={{ top: `${scrollBarHeight + 100}px` }}><ComponentSvgIcon type="icon-scrollbar" /></span>

          </div>
          <p className="confirm">
            <img src={PIC_BTN} onClick={() => {
              Toast.clear();
              if (!conventionButton) {
                Toast.show({
                  maskClassName: 'component-convention-toast',
                  content: '请滚动阅读同事吧公约',
                  duration: 3000
                });
              } else {
                if (RefDebounceTimer.current) {
                  clearTimeout(RefDebounceTimer.current);
                }
                RefDebounceTimer.current = setTimeout(() => {
                  confirmConvention();
                }, 500);
              }
            }} />
          </p>
        </div> : null
      }
    </div>
  );
};
export { Convention };
export default Convention;
