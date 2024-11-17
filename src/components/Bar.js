import Svg, { Rect } from 'react-native-svg';
import { View } from 'react-native';

const Bar = ({ segments, width, height }) => {
  let xOffset = 0;
  const totalRatios = segments.reduce((acc, curr) => acc + curr.ratio, 0); 
  const adjustedSegments = segments.map(segment => ({
      ...segment,
      ratio: segment.ratio / totalRatios
  }));

  return (
    <Svg width={width} height={height}>
      {adjustedSegments.map((segment, index) => {
        const segmentWidth = (index === adjustedSegments.length - 1) ?
                              width - xOffset : 
                              Math.floor(segment.ratio * width);
        const rect = (
          <Rect
            key={index}
            x={xOffset.toString()}
            y="0"
            width={segmentWidth.toString()}
            height={height.toString()}
            fill={segment.color}
          />
        );
        xOffset += segmentWidth;
        return rect;
      })}
    </Svg>
  );
};


export const HorizontalBarChart = ({ data, width, height, borderRadius }) => {
    return (
      <View style={{ borderRadius, overflow: 'hidden', width, height }}>
        <Bar segments={data} width={width} height={height} />
      </View>
    );
};
