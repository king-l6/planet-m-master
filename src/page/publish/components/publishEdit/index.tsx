import
React,
{
  useEffect,
  useRef,
  useState,
  useContext,
  useImperativeHandle,
  forwardRef
} from 'react';
import { ComponentFullScreenDialog } from '@/components/index';
import Aite from '@/page/aite';
import './index.less';
import { Store } from '@/store';
import { Toast } from 'antd-mobile';
import { showAt, replaceAtUser, jugdeWriteSpace } from './edit';

type IEditorProps = {
  getchildText: (inner: any, text: any) => void
  getNumbers: (value: number) => void
  editBlur?: any
}

const Editor = forwardRef((props: IEditorProps, ref: any) => {
  const editRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const [isBlur, setIsBlur] = useState(false);
  const { state, dispatch } = useContext(Store);

  useEffect(() => {
    //解决富文本br标签问题
    if (editRef.current?.innerHTML === '<br>') {
      editRef.current.innerText = '';
      return;
    }
    
    props.getchildText(editRef.current?.innerHTML, editRef.current?.innerText);
  }, [editRef.current?.innerText]);

  const characterLimit = () => {
    const length = editRef.current.innerText.length;
    props.getNumbers(length);
    if (length > 1000) {
      // Toast.show({
      //   content: '正文最多可输入1000个字',
      //   duration: 3000
      // });
    }
  };

  const handkeKeyUp = (isAt?: boolean) => {
    characterLimit();
    jugdeWriteSpace();
    //判断是否在删除 删除不显示人员弹窗
    const currentText = editRef.current.innerText;
    setText(currentText);
    if (text.length > currentText.length) return;
    if (isAt || showAt()) {
      const select: any = window.getSelection();
      dispatch({
        value: {
          selection: {
            focusOffset: select.focusOffset,
            focusNode: select.focusNode.childNodes.length === 1 ?
              select.focusNode.childNodes[0] : select.focusNode
          }
        }
      });
      select && setTimeout(() => { editRef.current.blur(); setVisible(true);}, 500);
    }
  };

  const getAiteChildren = (data: any) => {
    replaceAtUser(data, state);
    setVisible(false);
  };

  const closeCallback = (close: boolean) => setVisible(close);

  //暴露给父元素方法
  useImperativeHandle(ref, () => ({
    handkeKeyUp,
  }), [handkeKeyUp]);

  return (
    <div>
      <div
        placeholder="请输入内容（支持@人员哦）"
        ref={editRef}
        id="editRef"
        className="editor"
        contentEditable
        onInput={() => handkeKeyUp(false)}
        onFocus={() => {
          setIsBlur(true);
          dispatch({
            value:{ 
              editIsBlur:true
            }
          });
        }}
        onBlur={() => {
          setIsBlur(false);
          dispatch({
            value:{ 
              editIsBlur:false
            }
          });
          if (props.editBlur) {
            props.editBlur();
          }
        }}
        onPaste={(e) => {
          const text = e.clipboardData.getData('Text');
          document.execCommand('insertText', false, text);
          e.preventDefault();
        }}
      ></div>
      <ComponentFullScreenDialog isShow={visible}>
        <Aite from="edit" getAiteChildren={getAiteChildren} closeCallback={closeCallback} />
      </ComponentFullScreenDialog>
    </div>
  );
});

export { Editor };
export default Editor;
