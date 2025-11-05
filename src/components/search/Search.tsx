import React, { FC, useEffect, useState } from 'react';
import SvgIcon from '@/components/svgicon';
import { isiOS } from '@/mixin';
import './index.less';


interface SearchProps {
  value: string
  onChange?: (value: any) => void
  placeholder?: string
  clearable?: boolean
  onClear?:()=>void
  keydown?:(e:any)=>void
  inputRef?:any
}

const Search: FC<SearchProps> = ({ value, onChange, placeholder, clearable,onClear, keydown, inputRef }) => {
  const [clearState, setClearState] = useState(false);
  useEffect(() => {
    if(value.length > 0){
      setClearState(true);
    }else{
      setClearState(false);
    }
  }, [value]);

  return (
    <div className="c-search">
      <div className="search-input-box">
        <div className='search-input-box-icon'>
          <SvgIcon type="icon-list_search" />
        </div>
        <div className="search-input">
          <form action='' onSubmit={(e)=>{e.preventDefault();}}>
            <input type='search'
              ref={inputRef?inputRef:null}
              placeholder={placeholder}
              value={value}
              onChange={(e) => { onChange(e); }} 
              onKeyDown={keydown?(e)=>{ keydown(e); }:null}
              onBlur={()=> {
                //解决IOS键盘收起时下方留白
                if(isiOS){
                  window.scrollTo(0,0);
                }
              }}
            />
          </form>
          
          {
            clearable ? <div className={clearState?'':'search-input-clear'} onClick={() => {onClear();	}}>
              <SvgIcon type="icon-photo_delete" />
            </div> : null
          }
        </div>
      </div>
    </div>

  );
};
export {Search};
export default Search;