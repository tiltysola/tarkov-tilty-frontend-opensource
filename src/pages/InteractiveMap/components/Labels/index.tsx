import { Group, Text } from 'react-konva';

interface LabelsProps {
  labels: InteractiveMap.Label[];
  show: boolean;
}

const Index = (props: LabelsProps & InteractiveMap.UtilProps) => {
  const { labels = [], baseMapStatus, baseScale, heightRange, real2imagePos, show } = props;
  if (baseMapStatus === 'loaded' && show) {
    return (
      <Group>
        {labels.map((label) => {
          const labelHeight = ((label.top || 0) + (label.bottom || 0)) / 2;
          let opacity = 1;
          if (labelHeight < heightRange[0] || labelHeight > heightRange[1]) {
            opacity = 0.1;
          }
          return (
            <Text
              id={`im-label-text-${label.text}-${label.position[0]}-${label.position[1]}`}
              x={real2imagePos.x(label.position[0])}
              y={real2imagePos.y(label.position[1])}
              fontFamily="JinBuTi"
              text={label.text}
              fontSize={((label.size || 60) * baseScale) / 12}
              fill="#cccccc"
              width={600}
              offsetX={300}
              offsetY={((label.size || 60) * baseScale) / 18}
              align="center"
              shadowColor="#000000"
              shadowBlur={6}
              rotation={label.rotation}
              opacity={opacity}
            />
          );
        })}
      </Group>
    );
  } else {
    return null;
  }
};

export default Index;
