import Dexie from 'dexie';
import {IReport} from '../reports/report.model';

export class ReportDatabase extends Dexie {
  reports: Dexie.Table<IReport, string>;

  constructor() {
    super('reportsDatabase');

    this.version(1).stores({
      reports: '_id,description,notes',
    });

    this.reports = this.table('reports');
  }
}

export let db = new ReportDatabase();
