import { useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import './style.less';

interface TooltipProps {
  height: number;
}

interface ShowTooltipProps {
  x: number;
  y: number;
  text: JSX.Element | string;
}

export let showTooltip = (props: ShowTooltipProps) => {
  console.log(props);
};

const Index = (props: TooltipProps) => {
  const { height } = props;

  const [position, setPosition] = useState<InteractiveMap.Position2D>({
    x: 0,
    y: 0,
  });
  const [text, setText] = useState<JSX.Element | string>('');
  const [show, setShow] = useState(false);

  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    showTooltip = (_props: ShowTooltipProps) => {
      setPosition(_props);
      setText(_props.text);
      setTimeout(() => setShow(true));
    };
  }, []);

  useEffect(() => {
    const documentClick = (e: MouseEvent | TouchEvent) => {
      if (show && tooltipRef.current) {
        const isClickInside = tooltipRef.current.contains(e.target as Node);
        if (!isClickInside) {
          setShow(false);
        }
      }
    };
    document.addEventListener('click', documentClick);
    document.addEventListener('touchend', documentClick);
    return () => {
      document.removeEventListener('click', documentClick);
      document.removeEventListener('touchend', documentClick);
    };
  }, [show]);

  return (
    <div
      className={classNames('im-tooltip', {
        active: show,
      })}
      style={{
        left: position.x,
        bottom: `calc(${height}px - ${position.y}px + 32px)`,
      }}
      ref={tooltipRef}
    >
      {typeof text === 'string' ? <span>{text}</span> : text}
    </div>
  );
};

export default Index;
