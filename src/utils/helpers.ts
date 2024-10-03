export const get = (key: string): string | null => {
  return localStorage.getItem(key);
};

export const set = (key: string, value: string): string => {
  localStorage.setItem(key, value);
  return value;
};

export const getOrSet = (key: string, if_no: string) => {
  return get(key) ?? set(key, if_no);
};

export const has = (key: string) => get(key) !== null;

export const setClass = (
  el: HTMLElement,
  classname: string,
  on: boolean = true
) => {
  if (on) {
    el.classList.add(classname);
  } else {
    el.classList.remove(classname);
  }
};

export const isFolder = (id: number) => id > 0 && id < 10001;

export const isNote = (id: number) => id > 10000;
