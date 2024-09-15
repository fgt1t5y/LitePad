export const get = (key: string): string | null => {
  return localStorage.getItem(key);
};

export const set = (key: string, value: string) => {
  localStorage.setItem(key, value);
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
