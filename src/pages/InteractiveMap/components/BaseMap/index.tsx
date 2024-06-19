import { Image, Text } from 'react-konva';

interface BaseMapProps {
  id: string;
  baseMap: HTMLImageElement | undefined;
  activeLayer: InteractiveMap.Layer | undefined;
  status: 'loaded' | 'loading' | 'failed';
  coordinateRotation?: number;
  resolution: { width: number; height: number };
}

const Index = (props: BaseMapProps) => {
  const { id, baseMap, activeLayer, status, coordinateRotation = 180, resolution } = props;

  if (baseMap && status === 'loaded') {
    return (
      <Image
        id={id}
        image={baseMap}
        rotation={coordinateRotation - 180}
        offset={{ x: coordinateRotation === 90 ? baseMap.width : 0, y: 0 }}
        scaleX={coordinateRotation === 90 ? Math.abs(baseMap.height / baseMap.width) : 1}
        scaleY={coordinateRotation === 90 ? Math.abs(baseMap.width / baseMap.height) : 1}
        opacity={activeLayer ? 0.1 : 1}
      />
    );
  } else if (status === 'loading') {
    return (
      <Text
        id={id}
        fontFamily="JinBuTi"
        text={'地图正在载入中...'}
        fontSize={24}
        fill="#cccccc"
        width={resolution.width}
        height={resolution.height}
        align="center"
        verticalAlign="middle"
        shadowColor="#000000"
        shadowBlur={6}
      />
    );
  } else if (status === 'failed') {
    return (
      <Text
        id={id}
        fontFamily="JinBuTi"
        text={'地图载入失败...'}
        fontSize={24}
        fill="#cccccc"
        width={resolution.width}
        height={resolution.height}
        align="center"
        verticalAlign="middle"
        shadowColor="#000000"
        shadowBlur={6}
      />
    );
  }
};

export default Index;
