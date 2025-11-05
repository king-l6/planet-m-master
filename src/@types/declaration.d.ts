declare module '*.less';

declare module '*.scss';

declare module '*.svg';

declare module '*.png';

declare module '*.jpg';

declare module '*.jpeg';

declare module '*.gif';

declare module '*.mov';

declare module '*.ts';


declare module '*.m2ts';

declare module '*.md' {
  const content: string;
  export default content;
}

declare module 'rc-form' {
  export const createForm: any;
  export const createFormField: any;
  export const formShape: any;
}

declare module '@cycjimmy/jsmpeg-player'