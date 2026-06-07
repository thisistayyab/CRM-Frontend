/** Normalize DataGrid columns so flex fields fill the grid evenly. */

export function isFixedGridColumn(col) {
  return (
    col.field === 'actions' ||
    col.field === 'image' ||
    (col.width != null && col.flex == null)
  );
}

export function withFlexColumns(columns = []) {
  return columns.map((col) => {
    if (isFixedGridColumn(col)) {
      const width = col.width ?? col.minWidth ?? 72;
      return {
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        ...col,
        width,
        minWidth: col.minWidth ?? width,
        maxWidth: col.maxWidth ?? width,
        flex: undefined,
      };
    }

    return {
      flex: col.flex ?? 1,
      minWidth: col.minWidth ?? 120,
      ...col,
    };
  });
}
