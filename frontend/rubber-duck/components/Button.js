import {useButton} from 'react-aria';
import {useRef} from 'react';

export default function Button(props) {
  let ref = useRef();
  let { buttonProps } = useButton(props, ref);
  let { children } = props;

  return (
    <button class="bg-black text-white p-2.5 w-fit mt-9" {...buttonProps} ref={ref} >
      {children}
    </button>
  );
}
