'use strict';

import { addEditingEvent } from './addEditingEvent';
import { addFormSubmitEvent } from './addFormSumbitEvent';
import { addSelectRowEvent } from './addSelectRowEvent';
import { addTableSortEvent } from './addTableSortEvent';
import { createForm } from './createForm';

addTableSortEvent();
addSelectRowEvent();
createForm();
addFormSubmitEvent();
addEditingEvent();
