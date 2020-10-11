import {IAdditionalFieldModel} from '../aditional-fields/additional-field.model';
import {db} from '../indexedDb/db';
import {PromiseExtended} from 'dexie';

export class TaskModel {

  title: string;
  _reportId: string;
  _id: string;
  completed: boolean;
  additionalFields: IAdditionalFieldModel[];

  constructor(title: string, reportId: string, completed: boolean, id?: string) {
    this.title = title;
    this._reportId = reportId;
    this.completed = completed;
    if (id) {
      this._id = id;
    }
    // Define navigation properties.
    // Making them non-enumerable will prevent them from being handled by indexedDB
    // when doing put() or add().
    Object.defineProperties(this, {
      additionalFields: {value: [], enumerable: false, writable: true},
    });
  }

    async loadNavigationProperties(): Promise<void> {
      [this.additionalFields] = await Promise.all([
        db.additionalFields.where('taskId').equals(this._id).toArray(),
      ]);
    }
}

