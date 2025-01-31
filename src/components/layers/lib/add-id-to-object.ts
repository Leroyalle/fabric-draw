import { FabricObject } from 'fabric';

export const addIdToObject = (object: FabricObject) => {
  if (!object.id) {
    const timestamp = new Date().getTime();
    object.id = `${object.type}-${timestamp}`;
  }
};
