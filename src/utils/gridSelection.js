/** MUI X Data Grid v8 row selection model */
export const EMPTY_ROW_SELECTION = { type: 'include', ids: new Set() };

export function createRowSelection(ids = []) {
  return { type: 'include', ids: new Set(ids) };
}

/** Accept legacy array[] or v8 { type, ids } */
export function normalizeRowSelectionModel(model) {
  if (!model) return EMPTY_ROW_SELECTION;
  if (Array.isArray(model)) {
    return { type: 'include', ids: new Set(model) };
  }
  if (model.ids instanceof Set) {
    return model;
  }
  return EMPTY_ROW_SELECTION;
}

export function getSelectedRowIds(rows, model) {
  const normalized = normalizeRowSelectionModel(model);
  if (normalized.type === 'exclude') {
    return rows.filter((row) => !normalized.ids.has(row.id)).map((row) => row.id);
  }
  return Array.from(normalized.ids);
}

export function hasRowSelection(model) {
  const normalized = normalizeRowSelectionModel(model);
  if (normalized.type === 'exclude') return true;
  return normalized.ids.size > 0;
}
