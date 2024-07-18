import { atom, selector } from 'recoil';

const availLangs = ['zh'];

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const searchLang = urlParams.get('lang');

const defaultLang = searchLang || localStorage.getItem('lang') || navigator.language.split('-')[0];

const langState = atom<string>({
  key: 'langState',
  default: availLangs.includes(defaultLang) ? defaultLang : 'zh',
});

const langStateSelector = selector({
  key: 'langStateSelector',
  get: ({ get }) => {
    const currentLang = get(langState);
    return currentLang;
  },
  set: ({ get, set }, newValue) => {
    const previousLang = get(langState);
    set(langState, newValue);
    if (previousLang !== newValue) {
      localStorage.setItem('lang', newValue as string);
    }
  },
});

export default langStateSelector;
