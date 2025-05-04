export const getSlotHeight = (slot: { isHour: boolean }) => slot.isHour ? 40 : 20;

export const getIntervalPosition = (
  timeSlots: { time: string; isHour: boolean }[],
  start: string,
  end: string
) => {
  let top = 0;
  let height = 0;
  let found = false;
  let startIdx = 0;
  let endIdx = 0;
  for (let i = 0; i < timeSlots.length; i++) {
    if (timeSlots[i].time === start) {
      found = true;
      startIdx = i;
    }
    if (!found) {
      top += getSlotHeight(timeSlots[i]);
    }
    if (found) {
      height += getSlotHeight(timeSlots[i]);
    }
    if (timeSlots[i].time === end) {
      endIdx = i;
      break;
    }
  }
  const startSlotHeight = getSlotHeight(timeSlots[startIdx]);
  const endSlotHeight = getSlotHeight(timeSlots[endIdx]);
  top += startSlotHeight / 2;
  height = height - startSlotHeight / 2 - endSlotHeight / 2;
  return { top, height };
}; 