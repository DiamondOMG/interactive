export interface LiftData {
  Total: string;
  "screen.screen_name": string;
  "libraryItem.label": string;
  screenLabel: string;
  "screen.storeLocation": string;
  "screen.storeSection": string;
  libraryItemId: string;
  itemId: string;
  screenId: string;
  [key: string]: string; // Support for flattened displayCount_DATE
}
