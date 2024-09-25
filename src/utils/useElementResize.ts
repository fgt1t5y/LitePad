interface UseElementResizeOptions {
  min: number;
  max: number;
  onLessThanMin?: () => void;
  onGreaterThanMin?: () => void;
}

const defaultOption: UseElementResizeOptions = {
  min: 250,
  max: 700,
  onLessThanMin: undefined,
  onGreaterThanMin: undefined,
};

export const useElementResize = (
  handle: HTMLElement,
  target: HTMLElement,
  option?: UseElementResizeOptions
) => {
  const realOption = option || defaultOption;

  const { min, max, onLessThanMin, onGreaterThanMin } = realOption;
  let startX: number;
  let startWidth: number;
  let isPassedMin: boolean = false;

  const mousedown = (event: MouseEvent) => {
    startX = event.clientX;
    startWidth = parseInt(getComputedStyle(target).width);
    document.body.classList.add("Resizing");

    document.documentElement.addEventListener("mousemove", mousemove);
    document.documentElement.addEventListener("mouseup", mouseup);
  };

  const mousemove = (event: MouseEvent) => {
    const newWidth = startWidth + event.clientX - startX;
    if (newWidth > max || newWidth < min) {
      if (min - newWidth > 30) {
        !isPassedMin && onLessThanMin && onLessThanMin();
        isPassedMin = true;
      } else {
        isPassedMin && onGreaterThanMin && onGreaterThanMin();
        isPassedMin = false;
      }
      return;
    }
    target.style.setProperty("width", `${newWidth}px`);
  };

  const mouseup = () => {
    document.body.classList.remove("Resizing");

    document.documentElement.removeEventListener("mousemove", mousemove);
    document.documentElement.removeEventListener("mouseup", mouseup);
  };

  handle.addEventListener("mousedown", mousedown);
};
