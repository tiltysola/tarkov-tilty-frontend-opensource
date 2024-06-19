import { useMemo } from 'react';
import { Circle, Group, Line, Rect } from 'react-konva';

import { calculateHypotenuse } from '@/pages/InteractiveMap/utils';

interface RulerProps {
  baseScale: number;
  rulerPosition?: InteractiveMap.Position2D[];
}

const Index = (props: RulerProps) => {
  const { baseScale, rulerPosition } = props;

  const length = useMemo(() => {
    if (rulerPosition) {
      return calculateHypotenuse(rulerPosition[0], rulerPosition[1]);
    } else {
      return 0;
    }
  }, [rulerPosition]);

  const rulerHeight = 25 * baseScale; // 尺子高度
  const tickDistance = 10 * baseScale; // 刻度间隔
  const majorTickEvery = 50 * baseScale; // 主刻度间隔
  const minorTickLength = 5 * baseScale; // 次刻度线长度
  const majorTickLength = 10 * baseScale; // 主刻度线长度

  if (rulerPosition) {
    const ShapeGroup: any[] = [];
    ShapeGroup.push(
      <Rect
        x={0}
        y={0}
        width={length}
        height={rulerHeight}
        fill="#ffffff88"
        stroke="#88888888"
        strokeWidth={1 * baseScale}
        shadowColor="#000000"
        shadowBlur={6 * baseScale}
      />,
    );
    for (let i = 0; i <= length; i += tickDistance) {
      const isMajor = i % majorTickEvery === 0;
      const tickLength = isMajor ? majorTickLength : minorTickLength;
      const tickLine = (
        <Line points={[i, 0, i, tickLength]} stroke="#888888" strokeWidth={1 * baseScale} />
      );
      ShapeGroup.push(tickLine);
    }
    return (
      <Group>
        <Group
          x={rulerPosition[0].x}
          y={rulerPosition[0].y}
          rotation={
            (Math.atan2(
              rulerPosition[1].y - rulerPosition[0].y,
              rulerPosition[1].x - rulerPosition[0].x,
            ) *
              180) /
            Math.PI
          }
        >
          {ShapeGroup}
        </Group>
        <Group>
          <Circle
            x={rulerPosition[0].x}
            y={rulerPosition[0].y}
            radius={3 * baseScale}
            fill="#28888888"
          />
          <Circle
            x={rulerPosition[1].x}
            y={rulerPosition[1].y}
            radius={3 * baseScale}
            fill="#28888888"
          />
        </Group>
      </Group>
    );
  } else {
    return null;
  }
};

export default Index;
