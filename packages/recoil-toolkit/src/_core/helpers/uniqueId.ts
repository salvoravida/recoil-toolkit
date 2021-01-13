let uniqueIdCounter = 0;

export function uniqueId() {
   // eslint-disable-next-line no-plusplus
   return ++uniqueIdCounter;
}
