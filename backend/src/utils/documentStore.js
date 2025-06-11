import { v4 as uuidv4 } from 'uuid';

const store = new Map();
export function saveDocumentText(text) {
  const docId = uuidv4();
  store.set(docId, text);
  return docId;
}

export function getDocumentText(docId) {
  return store.get(docId);
}
