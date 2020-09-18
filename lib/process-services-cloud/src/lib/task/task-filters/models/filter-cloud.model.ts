/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DateCloudFilterType } from '../../../models/date-cloud-filter.model';
import { ComponentSelectionMode } from '../../../types';

export class TaskFilterCloudModel  {
    id: string;
    name: string;
    key: string;
    icon: string;
    index: number;
    appName: string;
    status: string;
    sort: string;
    assignee: string;
    order: string;
    owner: string;
    processDefinitionName?: string;
    processDefinitionId: string;
    processInstanceId: string;
    createdDate: Date;
    dueDate: Date;
    dueDateFrom: string;
    dueDateTo: string;
    taskName: string;
    taskId: string;
    parentTaskId: string;
    priority: number;
    standalone: boolean;
    lastModifiedFrom: Date;
    lastModifiedTo: Date;
    completedBy: string;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id || Math.random().toString(36).substr(2, 9);
            this.name = obj.name || null;
            this.key = obj.key || null;
            this.icon = obj.icon || null;
            this.index = obj.index || null;
            this.appName = obj.appName || obj.appName === '' ? obj.appName : null;
            this.status = obj.status || null;
            this.sort = obj.sort || null;
            this.assignee = obj.assignee || null;
            this.order = obj.order || null;
            this.owner = obj.owner || null;
            this.processDefinitionName = obj.processDefinitionName || null;
            this.processDefinitionId = obj.processDefinitionId || null;
            this.processInstanceId = obj.processInstanceId || null;
            this.createdDate = obj.createdDate || null;
            this.dueDate = obj.dueDate || null;
            this.dueDateFrom = obj.dueDateFrom || null;
            this.dueDateTo = obj.dueDateTo || null;
            this.taskName = obj.taskName || null;
            this.taskId = obj.taskId || null;
            this.parentTaskId = obj.parentTaskId || null;
            this.priority = obj.priority || null;
            this.standalone = obj.standalone || null;
            this.lastModifiedFrom = obj.lastModifiedFrom || null;
            this.lastModifiedTo = obj.lastModifiedTo || null;
            this.completedBy = obj.completedBy || null;
        }
    }
}
export class FilterParamsModel {

    id?: string;
    name?: string;
    key?: string;
    index?: number;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id || null;
            this.name = obj.name || null;
            this.key = obj.key || null;
            this.index = obj.index;
        }
    }
}

export class TaskFilterAction {
    actionType: string;
    icon: string;
    tooltip: string;
    filter: TaskFilterCloudModel;

    constructor(obj?: any) {
        if (obj) {
            this.actionType = obj.actionType || null;
            this.icon = obj.icon || null;
            this.tooltip = obj.tooltip || null;
            this.filter = obj.filter || null;
        }
    }
}

export interface FilterOptions {
    label?: string;
    value?: string;
}

export interface RangeKeys {
    from: string;
    to: string;
}

export class TaskFilterProperties {
    label: string;
    type: string;
    value: any;
    key: string;
    rangeKeys?: RangeKeys;
    options: FilterOptions[];
    dateFilterOptions?: DateCloudFilterType[];
    selectionMode?: ComponentSelectionMode;

    constructor(obj?: any) {
        if (obj) {
            this.label = obj.label || null;
            this.type = obj.type || null;
            this.value = obj.value || '';
            this.key = obj.key || null;
            this.rangeKeys = obj.rangeKeys || null;
            this.options = obj.options || null;
            this.dateFilterOptions = obj.dateFilterOptions || null;
            this.selectionMode = obj.selectionMode || null;
        }
    }
}
