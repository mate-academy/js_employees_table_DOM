import { ACTION_TYPES, ASCENDING, NUMERIC_VALUES } from '../constants';
import { compareValues } from '../utils/sort';
import { normalizeNumberString } from '../utils/formatter';

const StoreProto = {
  getAll(acces) {
    return acces.getEmployees().map((emp) => ({ ...emp }));
  },
  getById(acces, id) {
    return acces.getEmployees().find((emp) => emp.id === id) || null;
  },
  add(acces, employee) {
    const newEmployee = { ...employee, id: acces.nextId() };

    acces.pushEmployee(newEmployee);
    acces.emitChange(ACTION_TYPES.ADD, newEmployee);

    return newEmployee;
  },
  update(id, fieldValue, acces) {
    const employees = acces.getEmployees();
    const idx = employees.findIndex((emp) => emp.id === Number(id));

    if (idx === -1) {
      return null;
    }

    const field = Object.keys(fieldValue)[0];
    const updated = { ...employees[idx], ...fieldValue };

    acces.replaceAt(idx, updated);
    acces.emitChange(ACTION_TYPES.UPDATE, { field, value: updated[field], id });
  },
  remove(acces, id) {
    const idx = acces.getEmployees().findIndex((emp) => emp.id === id);

    if (idx === -1) {
      return false;
    }

    acces.removeAt(idx);
    acces.emitChange();

    return true;
  },
  getAllSorted(field, direction, acces) {
    const isNumeric = NUMERIC_VALUES.includes(field);

    const sorted = acces
      .getEmployees()
      .slice()
      .sort((emp1, emp2) => {
        const v1 = emp1[field];
        const v2 = emp2[field];
        const cmp = compareValues(v1, v2, isNumeric);

        return direction === ASCENDING ? cmp : -cmp;
      });

    acces.emitChange(ACTION_TYPES.SORT, sorted);
  },
  subscribe(acces, fn) {
    return acces.subscribe(fn);
  },
  unsubscribe(acces, fn) {
    return acces.unsubscribe(fn);
  },
};

export const createEmployeeStore = (initial = []) => {
  const employees = initial.map((emp, idx) => {
    return {
      ...emp,
      id: idx,
      salary: Number(normalizeNumberString(emp.salary).slice(1)),
    };
  });

  let idCounter = employees.reduce((max, emp) => Math.max(max, emp.id || 0), 0);
  const listeners = new Set();

  const acces = {
    getEmployees: () => employees,
    pushEmployee: (emp) => employees.push(emp),
    replaceAt: (idx, emp) => {
      employees[idx] = emp;
    },
    removeAt: (idx) => employees.splice(idx, 1),
    nextId: () => ++idCounter,
    emitChange: (actionType, payload) => {
      listeners.forEach((fn) => {
        try {
          fn({ type: actionType, payload });
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      });
    },
    subscribe: (fn) => {
      listeners.add(fn);

      return () => listeners.delete(fn);
    },
    unsubscribe: (fn) => listeners.delete(fn),
  };

  return {
    getAll: () => StoreProto.getAll(acces),
    getById: (id) => StoreProto.getById(acces, id),
    add: (employee) => StoreProto.add(acces, employee),
    update: (id, fieldValue) => StoreProto.update(id, fieldValue, acces),
    remove: (id) => StoreProto.remove(acces, id),
    getAllSorted: (field, direction) =>
      StoreProto.getAllSorted(field, direction, acces),
    subscribe: (fn) => StoreProto.subscribe(acces, fn),
    unsubscribe: (fn) => StoreProto.unsubscribe(acces, fn),
  };
};
