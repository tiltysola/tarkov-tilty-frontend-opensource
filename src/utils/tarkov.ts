import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const getFleaMarketFees = (_rewardsTotal: number, _basePrice: number) => {
  const V0 = _basePrice;
  const VR = _rewardsTotal;
  const P0 = VR >= V0 ? Math.log10(V0 / VR) : Math.pow(Math.log10(V0 / VR), 1.08);
  const PR = VR <= V0 ? Math.log10(VR / V0) : Math.pow(Math.log10(VR / V0), 1.08);
  const Q = 1;
  const TI = 0.03;
  const TR = 0.03;
  return Math.round(V0 * TI * Math.pow(4, P0) * Q + VR * TR * Math.pow(4, PR) * Q);
};

export const getMaxFleaMarketProfits = (_basePrice: number, _discount = 0) => {
  const profitCalculator: any = (startReward: number, endReward: number) => {
    if (endReward - startReward < 2) {
      return startReward;
    }
    const positionReward = Math.round((startReward + endReward) / 2);
    const ps = Math.round((startReward + positionReward) / 2);
    const profitSmaller = ps - getFleaMarketFees(ps, _basePrice) * (1 - _discount);
    const pl = Math.round((endReward + positionReward) / 2);
    const profitLarger = pl - getFleaMarketFees(pl, _basePrice) * (1 - _discount);
    if (profitSmaller > profitLarger) {
      return profitCalculator(startReward, positionReward);
    } else {
      return profitCalculator(positionReward, endReward);
    }
  };
  return profitCalculator(_basePrice, Math.pow(2, 31));
};

export const calculatePenetration = (props: {
  durability: number;
  class: number;
  penetration: number;
}) => {
  const d = props.durability;
  const c = props.class;
  const p = props.penetration;
  const a = (121 - 5000 / (45 + d * 2)) * c / 10;
  if (a - 15 < p && p < a) {
    return 0.4 * Math.pow(a - p - 15, 2) / 100;
  } else if (a <= p) {
    return (100 + p / (0.9 * a - p)) / 100;
  } else {
    return 0;
  }
};

export const quaternionToEulerAngles = (q: number[]) => {
  // 四元数各分量
  const x = q[0];
  const z = q[1];
  const y = q[2];
  const w = q[3];

  // 计算欧拉角
  let roll = Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + y * y));
  let pitch = Math.asin(Math.max(Math.min(2 * (w * y - z * x), 1), -1));
  let yaw = Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z));

  // 将弧度转换为度（如果需要）
  roll = roll * 180 / Math.PI;
  pitch = pitch * 180 / Math.PI;
  yaw = yaw * 180 / Math.PI;

  return [yaw, pitch, roll]; // 返回ZYX欧拉角
};

export const readFileContent = async (file: File): Promise<string | ArrayBuffer | null> => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const tarkovGamePathResolve = {
  resolveGameRootPath: async (handler: FileSystemDirectoryHandle) => {
    const entries = await (handler as any).entries();
    let subHandle = null;
    for await (const [, entry] of entries) {
      if (entry.kind === 'directory') {
        if (entry.name === 'Logs') {
          subHandle = await handler.getDirectoryHandle(entry.name);
        }
      }
    }
    return subHandle;
  },
  resolveLogPath: async (handler: FileSystemDirectoryHandle) => {
    const entries = await (handler as any).entries();
    let subHandle = null;
    let stamp = 0;
    for await (const [, entry] of entries) {
      if (entry.kind === 'directory') {
        const matches = entry.name.match(/log_([0-9]+\.[0-9]+\.[0-9]+_[0-9]+-[0-9]+-[0-9]+)_([0-9.]+)/i);
        if (matches) {
          const matchStamp = dayjs(matches[1], 'YYYY.MM.DD_HH-mm-ss').valueOf();
          if (matchStamp > stamp) {
            stamp = matchStamp;
            subHandle = await handler.getDirectoryHandle(entry.name);
          }
        }
      }
    }
    return subHandle;
  },
  checkPath: async (handler: FileSystemDirectoryHandle) => {
    const { resolveGameRootPath, resolveLogPath } = tarkovGamePathResolve;
    const gameRootPathHandle = await resolveGameRootPath(handler);
    const logPathHandle = await resolveLogPath(gameRootPathHandle || handler);
    return !!logPathHandle;
  },
  resolveLogFile: async (handler: FileSystemDirectoryHandle, fileType: 'application'|'notifications') => {
    const entries = await (handler as any).entries();
    let subHandle = null;
    for await (const [, entry] of entries) {
      if (entry.kind === 'file') {
        if (entry.name.indexOf(fileType) !== -1) {
          subHandle = await (handler as any).getFileHandle(entry.name) as FileSystemFileHandle;
        }
      }
    }
    return subHandle;
  },
  getLogFileMeta: async (handler: FileSystemFileHandle) => {
    const file = await handler.getFile();
    return file;
  },
  parseLogFile: async (handler: FileSystemFileHandle) => {
    const file = await handler.getFile();
    const content = await readFileContent(file);
    if (typeof content === 'string') {
      return content.split('\n');
    } else {
      return [];
    }
  },
  parseLine: (textArray: string[]) => {
    const logs = [];
    let buffer = '';
    textArray.forEach((line) => {
      const regexp = /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9.:+]+/i;
      if (regexp.test(line)) {
        if (buffer) logs.push(buffer.trim());
        buffer = line;
      } else {
        buffer += `\n${line}`;
      }
    });
    logs.push(buffer);
    return logs;
  },
  parseProfileLine: (text: string): InteractiveMap.ProfileLogProps | null => {
    const regexp = /SelectProfile ProfileId:(.+?) AccountId:(.+)/i;
    const result = text.match(regexp);
    if (result) {
      return {
        profileId: result[1],
        accountId: result[2]?.trim(),
      };
    } else {
      return null;
    }
  },
  parseRaidLine: (text: string): InteractiveMap.RaidLogProps | null => {
    const regexp = /'Profileid: (.+?), Status: (.+?), RaidMode: (.+?), Ip: (.+?), Port: (.+?), Location: (.+?), Sid: (.+?), GameMode: (.+?), shortId: (.+?)'/i;
    const sidRegexp = /(.+?)-(.+?)_(.+)/i;
    const result = text.match(regexp);
    if (result) {
      const sidResult = result[7].match(sidRegexp);
      return {
        profileId: result[1],
        status: result[2],
        raidMode: result[3],
        ip: result[4],
        port: result[5],
        location: result[6],
        sid: result[7],
        gameMode: result[8],
        shortId: result[9],
        realTime: sidResult && sidResult[3],
      };
    } else {
      return null;
    }
  },
  parseUserConfirmedLine: (text: string): InteractiveMap.UserConfirmedLogProps | null => {
    const regexp = /Got notification \| UserConfirmed/i;
    const result = text.match(regexp);
    if (result) {
      return JSON.parse(text.split('\n').splice(1).join('\n'));
    } else {
      return null;
    }
  },
  parseMessageLine: (text: string) => {
    const regexp = /Got notification \| ChatMessageReceived/i;
    const result = text.match(regexp);
    if (result) {
      return JSON.parse(text.split('\n').splice(1).join('\n'));
    } else {
      return null;
    }
  },
};
