interface UseElementResizeOptions {
  min: number;
  max: number;
}

const defaultOption: UseElementResizeOptions = {
  min: 250,
  max: Infinity,
};

export const useElementResize = (
  handle: HTMLElement,
  target: HTMLElement,
  option?: UseElementResizeOptions
) => {
  const realOption = option || defaultOption;

  const { min, max } = realOption;
  let startX: number;
  let startWidth: number;

  const mousedown = (event: MouseEvent) => {
    startX = event.clientX;
    startWidth = parseInt(getComputedStyle(target).width);

    document.documentElement.addEventListener("mousemove", mousemove);
    document.documentElement.addEventListener("mouseup", mouseup);
  };

  const mousemove = (event: MouseEvent) => {
    const newWidth = startWidth + event.clientX - startX;
    if (newWidth > max || newWidth < min) return;
    target.style.setProperty("width", `${newWidth}px`);
  };

  const mouseup = () => {
    document.documentElement.removeEventListener("mousemove", mousemove);
    document.documentElement.removeEventListener("mouseup", mouseup);
  };

  handle.addEventListener("mousedown", mousedown);
};
