import type { MouseEvent } from 'react'
import { MouseSensor } from '@dnd-kit/core';

export default class PlannerMouseSensor extends MouseSensor {
  static activators = [
    {
      eventName: 'onMouseDown' as const,
      handler: ({ nativeEvent: event }: MouseEvent) => {
        return shouldHandleEvent(event.target as HTMLElement);
      },
    },
  ];
}

function shouldHandleEvent(element: HTMLElement | null) {
    let cur = element;
    
    while (cur) {
        console.log({cur})
        if (cur.dataset && cur.dataset.noDnd) {
      return false;
    }
    cur = cur.parentElement;
  }

  return true;
}
