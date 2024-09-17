// 鼠标滚轮滚动时可以滚动x轴溢出的元素
export const useXScroll = (el: HTMLElement) => {
  const handleWheel = (e: WheelEvent) => {
    const preventYWheel =
      (e.currentTarget as HTMLElement).offsetWidth <
      (e.currentTarget as HTMLElement).scrollWidth;
    if (!preventYWheel || e.deltaY === 0) return;
    (e.currentTarget as HTMLElement).scrollLeft += e.deltaY + e.deltaX;
    e.preventDefault();
  }

  if (!el) return

  el.addEventListener('wheel', handleWheel)
};
