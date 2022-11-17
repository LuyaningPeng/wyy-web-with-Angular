export function silentEvent(e: Event): void {
  e.stopPropagation();
  e.preventDefault();
}

export function getElementOffset(elem: HTMLElement): {top: number, left: number} {
  if (!elem.getClientRects().length)
    return {top: 0, left: 0};

  const rect = elem.getBoundingClientRect();
  const win = elem.ownerDocument.defaultView;
  return {
    top: rect.top + win!.scrollY,
    left: rect.left + win!.scrollX
  }
}
