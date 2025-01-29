// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Canvas, FabricObject } from 'fabric';

declare module 'fabric' {
  interface Canvas {
    updateZIndexes: () => void;
  }

  interface FabricObject {
    id: string;
    zIndex: number;
  }
}
