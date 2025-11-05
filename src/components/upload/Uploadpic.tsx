/*
 * @Author: your name
 * @Date: 2021-11-02 20:06:28
 * @LastEditTime: 2021-11-24 11:27:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /planet-m/src/components/publishPost/postUploadPic/postUploadPic.tsx
 */
import React, { FC, useEffect, useState } from 'react';
import { ImageUploader, Toast } from 'antd-mobile';
import { UPLOADPICAPI } from '@/api';
import { PIC_UPLOAD_FAILED } from '@/assets/image.ts';
import {uuid} from '@/mixin/index';
import './index.less';
interface uploadPicProps {
  transFileList: any,
  receiveList: (file: any) => void
}

const UploadPic: FC<uploadPicProps> = ({ transFileList, receiveList }) => {
  const uploadPicture = async (file: File) => {
    /**
     * @description: 上传图片
     * @param {*}
     * @return {*}
     */
    const publishPostText_DOM = document.getElementsByClassName('publish-post-text')[0];    
    try {
      if (transFileList && transFileList.length < 9) {
        const formFile: FormData = new FormData();
        formFile.append('file', file);
        const res: any = await UPLOADPICAPI._uploadPicture(formFile);
        
        let pictureUrl = null;
        if (res) {
          publishPostText_DOM.scrollTop = publishPostText_DOM.scrollHeight;
          if(window.location.hostname == 'bbplanet.bilibili.co'){
            pictureUrl =  res.location?.replace('http','https');
          }else{
            pictureUrl =  res.location;
          }
          return {
            url: `${pictureUrl}?uuid=${uuid()}`,
          };
        }
      }
    } catch (error: any) {
      Toast.show({
        content: '有图片上传失败，请删除重试'
      });
      publishPostText_DOM.scrollTop = publishPostText_DOM.scrollHeight;
      return {
        url:`${PIC_UPLOAD_FAILED}?uuid=${uuid()}`
      };
    }
  };

  const beforeUpload = (files: File[]) => {
    
    /**
     * @description: 限制图片大小和数量
     * @param {*}
     * @return {*}
     */
    const restNum = 9 - transFileList.length;
    if (restNum < files.length) {
      Toast.show('最多上传9张图片');
      return [] as any;
    }
    if (restNum > 0) {
      files = files.slice(0, restNum);
      return files.filter((file, idx) => {
        if (file.size > 1024 * 1024 * 20) {
          Toast.show('请选择小于 20M 的图片');
          return false;
        }
        return true;
      });
    }
  };

  return (
    <div className="c-upload">
      <ImageUploader maxCount={9}
        value={transFileList}
        multiple={true}
        upload={uploadPicture}
        onChange={(file) => {
          receiveList(file);
        }}
        beforeUpload={beforeUpload}
        style={{ '--cell-size': '111px' }}
      />
    </div>
  );
};
export { UploadPic };
export default UploadPic;