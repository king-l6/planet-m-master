import React, { FC, useState } from 'react';
import { Toast, Loading } from 'antd-mobile';
import { UPLOADPICAPI } from '@/api';
import { PIC_UPLOAD_FAILED } from '@/assets/image.ts';
import SvgIcon from '@/components/svgicon';
import { dataURLtoFile } from '@/mixin';
import './index.less';
import { useDidUpdate } from 'hooooks';

interface uploadPicProps {
  maxCount: number
  receiveList: (file: any) => void
  transFileList: any
  deleteImg: (idx:number) => void
}

const WXUpload: FC<uploadPicProps> = ({ maxCount, receiveList, transFileList, deleteImg }) => {
  const wx = (window as any).wx;
  const [uploadState, setUploadState] = useState(true);
  const [imgLoading, setimgLoading] = useState(true);
  useDidUpdate(() => {
    if (transFileList.length >= maxCount) {
      setUploadState(false);
    } else {
      setUploadState(true);
    }
  }, [transFileList]);

  const upload = () => {
    /**
         * @description: 图片上传
         * @param {*} 
         * @return {*}
         */
    const arr: any = [];
    wx.chooseImage({
      /**
         * @description: 1.调用选取图片接口，获取图片的本地id
         * @param {*} 
         * @return {*}
         */
      count: maxCount - transFileList.length,
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      sizeType: ['original', 'compressed'], // ['original', 'compressed']可以指定是原图还是压缩图，默认二者都有
      success: async function (res: any) {
        console.info('chooseImage调用成功:',res);
        const localIds = res.localIds;
        await readImages(localIds, arr);
        for (let i = 0; i < arr.length; i++) {
          let pictureUrl = null;
          const publishPostText_DOM = document.getElementsByClassName('publish-post-text')[0];
          try {
            //4. 上传真正的图片
            const formFile: FormData = new FormData();
            formFile.append('file', arr[i]);
            const res: any = await UPLOADPICAPI._uploadPicture(formFile);
            if (res) {
              if (window.location.hostname == 'bbplanet.bilibili.co') {
                pictureUrl = res.location?.replace('http', 'https');
              } else {
                pictureUrl = res.location;
              }
              //图片展示
              const singleImg = {
                imgUrl: pictureUrl,
                imgState: true,
                isFake: false
              };
              // 替换掉假的图片
              for (let i = 0; i < transFileList.length; i++) {
                if (transFileList[i].isFake) {
                  transFileList[i] = singleImg;
                  break;
                }
              }
              receiveList([...transFileList]);
              setimgLoading(false);
              publishPostText_DOM.scrollTop = publishPostText_DOM.scrollHeight;
            }
          } catch (error) {
            console.info(error);
            Toast.show({
              content: '有图片上传失败，请删除重试'
            });

            const singleImg = {
              imgUrl: `${PIC_UPLOAD_FAILED}`,
              imgState: true,
              isFake: false
            };
            for (let i = 0; i < transFileList.length; i++) {
              if (transFileList[i].isFake) {
                transFileList[i] = singleImg;
                break;
              }
            }
            receiveList([...transFileList]);
            setimgLoading(false);
            publishPostText_DOM.scrollTop = publishPostText_DOM.scrollHeight;
          }
        }
      },
      fail: function (res: any) {
        console.info(res);
      }
    });
  };

  const readImages = async (imgLocalId: string, arr: any) => {
    /**
         * @description: //2. 通过本地id获取图片的base64
         * @param {*} 
         * @return {*}
         */
    for (let i = 0; i < imgLocalId.length; i++) {
      const File = await doreadImage(imgLocalId[i]);
      arr.push(File);
    }
  };

  const doreadImage = (item: any) => {
    /**
         * @description: 图片的localID转为File
         * @param {*} 
         * @return {*}
         */
    return new Promise(resolve => {
      wx.getLocalImgData({
        localId: item, // 图片的localID
        success: async (res: any) => {
          console.info('getLocalImgData调用成功:',res);
          const localData = res.localData;
          const singleImg = {
            imgUrl: localData,
            imgState: false,
            isFake: true
          };
          transFileList.push(singleImg);
          receiveList([...transFileList]);
          let data = '';
          if (localData.indexOf('data:image') === 0) {
            //苹果的直接赋值，默认生成'data:image/jpg;base64,'的头部拼接
            // data = localData;
            let File  ;
            const format = localData.split(';')[0].split('/')[1];
            // console.info('1',format);
            if(format){
              File = await dataURLtoFile(localData, `${new Date().getTime()}.${format}`);
            }else{
              File = await dataURLtoFile(data, `${new Date().getTime()}.jpg`);
            }
            resolve(File);
          } else {
            //安卓在拼接前需要对localData进行换行符的全局替换
            const itemSplit = item.split('.');
            const format = itemSplit[itemSplit.length -1];
            // console.info('2',format);
            let File ;
            if(format){
              data = `data:image/${format};base64,${localData?.replace(/\n/g, '')}`;
              File = await dataURLtoFile(data, `${new Date().getTime()}.${format}`);
            }else{
              data = `data:image/jpeg;base64,${localData?.replace(/\n/g, '')}`;
              File = await dataURLtoFile(data, `${new Date().getTime()}.jpg`);
            }
            resolve(File);
          }
          //3. 图片的base64转为图片
          // const File = await dataURLtoFile(data, `${new Date().getTime()}.jpg`);
          // resolve(File);
        },
        fail: (error: any) => {
          console.info('getLocalImgData调用失败', error);
        }
      });
    });
  };

  interface ImgCellProps {
    imgUrl: string
    imgIndex: number
    imgLoading: boolean
    urls: any
  }
  const ImgCell: FC<ImgCellProps> = ({ imgUrl, imgIndex, imgLoading, urls }) => {
    return <>
      <div className="img-cell" draggable={false} >
        <div className="img-delete" onClick={() => { deleteImg(imgIndex); }}>
          <div>
            <SvgIcon type="icon-photo_delete" />
          </div>
        </div>
        <img src={imgUrl} draggable={false} onClick={() => {
          wx.previewImage({
            current: imgUrl,
            urls
          });
        }} />
        {!imgLoading ? <div className="img-loading">
          <Loading />
          <span>上传中...</span>
        </div> : null}
      </div>
    </>;
  };
  return (
    <div className="c-wxupload">
      <div className="c-wxupload-container">
        {transFileList.length > 0 ? transFileList.map((item: any, idx: number) => {
          return <ImgCell
            key={`${item.imgUrl}-${idx}`}
            imgUrl={item.imgUrl}
            imgIndex={idx}
            imgLoading={item.imgState}
            urls={transFileList.map((file: any) => { return file.imgUrl; })}
          />;
        }) : null}
        <div className={uploadState ? 'upload-add' : 'upload-add upload-add-hidden'} onClick={() => { upload(); }}>
          <SvgIcon type="icon-send_add_line" />
        </div>
      </div>
    </div>
  );
};
export { WXUpload };
export default WXUpload;