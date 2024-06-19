import { atom } from 'recoil';

const mobileMenuVisibleState = atom<any>({
  key: 'mobileMenuVisibleState',
  default: false,
});

export default mobileMenuVisibleState;
