import { useMemo } from 'react';

import './style.less';

interface CoordinateProps {
  position: InteractiveMap.Position2D;
  image2realPos?: InteractiveMap.ImageTransformProps;
}

const Index = (props: CoordinateProps) => {
  const { position, image2realPos } = props;

  const realPosition = useMemo(() => {
    return image2realPos?.p(position) || { x: 0, y: 0 };
  }, [position, image2realPos]);

  return (
    <div className="im-coordinate">
      <span>{realPosition.x.toFixed(1)}</span>
      <span>{realPosition.y.toFixed(1)}</span>
    </div>
  );
};

export default Index;
