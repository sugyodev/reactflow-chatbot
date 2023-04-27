import React from 'react';

export default ({
  fromX,
  fromY,
  fromPosition,
  toX,
  toY,
  toPosition,
  connectionLineType,
  connectionLineStyle,
}) => {
  return (
    <g>
      <path
        fill="none"
        stroke="#aaa"
        strokeWidth={1}
        className="animated"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
      <circle cx={toX} cy={toY} fill="#fff" r={3} stroke="#ccc" strokeWidth={1.2} />
    </g>
  );
};
