import { ASCENDING, DESCENDING } from '../constants';

function TableState() {
  this._sort = { field: null, direction: ASCENDING };
  this._activeEditor = null;
  this._selectedRowId = null;

  const that = this;

  this.state = {
    getSort: () => that.getSort(),
    setSort: (field) => that.setSort(field),
    getActiveEditor: () => that.getActiveEditor(),
    setActiveEditor: (activeEditor) => that.setActiveEditor(activeEditor),
    getSelectedRowId: () => that.getSelectedRowId(),
    setSelectedRowId: (selectedRowId) => that.setSelectedRowId(selectedRowId),
  };
}

TableState.prototype = {
  constructor: TableState,

  getSort() {
    return { ...this._sort };
  },

  setSort(field) {
    if (this._sort.field !== field) {
      this._sort.field = field;
      this._sort.direction = ASCENDING;
    } else {
      this._sort.direction =
        this._sort.direction === ASCENDING ? DESCENDING : ASCENDING;
    }
  },
  getActiveEditor() {
    return this._activeEditor;
  },
  setActiveEditor(activeEditor) {
    this._activeEditor = activeEditor;
  },
  getSelectedRowId() {
    return this._selectedRowId;
  },
  setSelectedRowId(selectedRowId) {
    this._selectedRowId = selectedRowId;
  },
};

const state = new TableState();

export const tableState = state.state;
