export const timeFormat = (time: number) => {
  const scale = [
    1000 * 60,
    1000 * 60 * 60,
    1000 * 60 * 60 * 24,
    1000 * 60 * 60 * 24 * 30,
  ];
  if (time < scale[0]) {
    return `${Math.round(time / 1000)} 秒`;
  } else if (time < scale[1]) {
    return `${Math.round(time / scale[0])} 分钟`;
  } else if (time < scale[2]) {
    return `${Math.round(time / scale[1])} 小时`;
  } else if (time < scale[3]) {
    return `${Math.round(time / scale[2])} 天`;
  } else {
    return `${Math.round(time / scale[3])} 月`;
  }
};

export const timeDiffFormat = (time: number) => {
  const scale = [
    1000 * 60,
    1000 * 60 * 60,
    1000 * 60 * 60 * 24,
    1000 * 60 * 60 * 24 * 30,
  ];
  if (time < scale[0]) {
    return `${Math.round(time / 1000)} 秒 前`;
  } else if (time < scale[1]) {
    return `${Math.round(time / scale[0])} 分钟 前`;
  } else if (time < scale[2]) {
    return `${Math.round(time / scale[1])} 小时 前`;
  } else if (time < scale[3]) {
    return `${Math.round(time / scale[2])} 天 前`;
  } else {
    return `${Math.round(time / scale[3])} 月 前`;
  }
};
