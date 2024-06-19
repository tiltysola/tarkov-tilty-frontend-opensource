import axios from 'axios';

axios.interceptors.response.use(
  (res: any) => {
    if (typeof res.data === 'object') {
      if (!res.data.code || res.data.code === 200) {
        return res.data;
      } else if (res.data.extra) {
        const errorMsg = `${res.data.code}: ${res.data.extra}`;
        return Promise.reject(errorMsg);
      } else {
        const errorMsg = `${res.data.code}: ${res.data.errorMessage}`;
        return Promise.reject(errorMsg);
      }
    } else {
      // eslint-disable-next-line
      return Promise.reject('404: 接口未找到');
    }
  },
  (err) => {
    return Promise.reject(err);
  },
);
