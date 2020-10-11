import Dexie from 'dexie';
import {IReport} from '../reports/report.model';
import {IAdditionalFieldModel} from '../aditional-fields/additional-field.model';
import {TaskModel} from '../tasks/task.model';

export class ReportDatabase extends Dexie {
  reports: Dexie.Table<IReport, string>;
  tasks: Dexie.Table<TaskModel, string>;
  additionalFields: Dexie.Table<IAdditionalFieldModel, string>;

  constructor() {
    super('reportsDatabase');

    this.version(1).stores({
      reports: '_id,description,notes',
      tasks: '_id,_reportId,title,completed',
      additionalFields: '_id,taskId,type,description',
    });

    this.tasks = this.table('tasks');
    this.tasks.mapToClass(TaskModel);

    this.reports = this.table('reports');
    this.additionalFields = this.table('additionalFields');

  }
}


export let db = new ReportDatabase();
