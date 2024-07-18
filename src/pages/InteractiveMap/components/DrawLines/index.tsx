import { Circle, Group, Line } from 'react-konva';

import './style.less';

interface DrawLinesProps {
  activeMapId?: string;
  cursorPosition: InteractiveMap.Position2D;
  drawLines: InteractiveMap.iMDrawLine[];
  drawTempPoints: number[];
  show: string[];
}

const Index = (props: DrawLinesProps & InteractiveMap.DrawProps & InteractiveMap.UtilProps) => {
  const {
    activeMapId,
    cursorPosition,
    drawLines,
    strokeType,
    strokeColor,
    strokeWidth,
    eraserWidth,
    drawTempPoints,
    baseMapStatus,
    baseScale,
    show,
  } = props;

  if (baseMapStatus === 'loaded' && drawLines?.length > 0 && show.length > 0) {
    return (
      <Group>
        {drawLines
          .filter((drawLine) => {
            return drawLine.mapId === activeMapId;
          })
          .map((drawLine) => {
            if (show.includes('drawLine')) {
              return (
                <Line
                  id={`im-drawline-line-${drawLine.uuid}`}
                  points={drawLine.points}
                  stroke={drawLine.strokeColor}
                  strokeWidth={drawLine.strokeWidth * baseScale}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    drawLine.tool === 'eraser' ? 'destination-out' : 'source-over'
                  }
                  shadowColor="#000"
                  shadowBlur={drawLine.strokeWidth * baseScale}
                  listening={false}
                />
              );
            } else {
              return null;
            }
          })}
        <Line
          id={'im-drawline-line-temp'}
          points={drawTempPoints}
          stroke={strokeColor}
          strokeWidth={(strokeType === 'draw' ? strokeWidth : eraserWidth) * baseScale}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
          globalCompositeOperation={strokeType === 'eraser' ? 'destination-out' : 'source-over'}
          shadowColor="#000"
          shadowBlur={(strokeType === 'draw' ? strokeWidth : eraserWidth) * baseScale}
          listening={false}
        />
        {(strokeType === 'draw' || strokeType === 'eraser') && (
          <Circle
            x={cursorPosition.x}
            y={cursorPosition.y}
            radius={((strokeType === 'draw' ? strokeWidth : eraserWidth) * baseScale) / 2}
            fill="#00000088"
            listening={false}
          />
        )}
      </Group>
    );
  } else {
    return null;
  }
};

export default Index;
