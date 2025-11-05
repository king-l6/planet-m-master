import React, { FunctionComponent, HTMLAttributes, useEffect, useState, useContext } from 'react';
import { PhotoProvider, PhotoSlider } from 'react-photo-view';
import { Store } from '@/store';
import 'react-photo-view/dist/index.css';

interface IProps {
  // 查看的图片列表
  viewImageList?: any;
  // 查看图片当前索引
  viewImageIndex?: number;
  // 是否加载预览图片组件
  isImageViewer?: boolean;
  // 是否显示旋转按钮
  spinButton?: boolean;
  // 是否显示全屏显示按钮
  fullScreenButton?: boolean;
  // 当预览图片列表索引发生变化
  indexChange?: (index: number) => void;
  // 关闭图片预览
  toCloseView?: () => void;
}

const FullScreenIcon = (props: HTMLAttributes<any>) => {
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  useEffect(() => {
    document.onfullscreenchange = () => {
      setFullscreen(Boolean(document.fullscreenElement));
    };
  }, []);
  return (
    <svg
      className="PhotoView-PhotoSlider__toolbarIcon"
      fill="white"
      width="44"
      height="44"
      viewBox="0 0 768 768"
      {...props}
    >
      {fullscreen ? (
        <path d="M511.5 256.5h96v63h-159v-159h63v96zM448.5 607.5v-159h159v63h-96v96h-63zM256.5 256.5v-96h63v159h-159v-63h96zM160.5 511.5v-63h159v159h-63v-96h-96z" />
      ) : (
        <path d="M448.5 160.5h159v159h-63v-96h-96v-63zM544.5 544.5v-96h63v159h-159v-63h96zM160.5 319.5v-159h159v63h-96v96h-63zM223.5 448.5v96h96v63h-159v-159h63z" />
      )}
    </svg>
  );
};

const ImageView: FunctionComponent<IProps> = (props) => {
  const { spinButton = true, fullScreenButton = true } = props;

  const { state, dispatch } = useContext(Store);


  /* react-photo-view组件传参说明 */
  /**
        * images：渲染的图片组<array>[{src: ''}, {src: ''}]
        * index：初始显示图片序号<number>
        * visible：是否显示图片预览<boolean>
        * onIndexChange：切换图片的回调处理函数<Function>
        * onClose：关闭图片预览的回调处理函数<Function>
        */
  const toggleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      const element = document.getElementById('PhotoView_Slider');
      if (element) {
        element.requestFullscreen();
      }
    }
  };

  return (
    <PhotoProvider>
      <PhotoSlider images={state.photoViewer} index={state.photoIndex} visible={state.photoViewerShow}
        onIndexChange={(index: number) => {
          dispatch({
            value: {
              ...state,
              photoIndex: index,
            }
          });
        }} onClose={() => {
          dispatch({
            value: {
              ...state,
              photoViewerShow: false,
              photoIndex: 0,
              photoViewer: []
            }
          });
        }}
        toolbarRender={({ rotate, onRotate }) => {
          return (
            <>
              {
                spinButton ?
                  <svg
                    className="PhotoView-PhotoSlider__toolbarIcon"
                    onClick={() => onRotate(rotate + 90)}
                    width="44"
                    height="44"
                    fill="white"
                    viewBox="0 0 768 768"
                  >
                    <path d="M565.5 202.5l75-75v225h-225l103.5-103.5c-34.5-34.5-82.5-57-135-57-106.5 0-192 85.5-192 192s85.5 192 192 192c84 0 156-52.5 181.5-127.5h66c-28.5 111-127.5 192-247.5 192-141 0-255-115.5-255-256.5s114-256.5 255-256.5c70.5 0 135 28.5 181.5 75z" />
                  </svg> : null
              }
              {fullScreenButton && document.fullscreenEnabled && (
                <FullScreenIcon onClick={() => { toggleFullScreen(); }} />
              )}
            </>
          );
        }}
      />
    </PhotoProvider>
  );
};

export default ImageView;