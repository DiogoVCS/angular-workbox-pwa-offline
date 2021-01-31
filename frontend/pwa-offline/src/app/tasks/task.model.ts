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

    save(): PromiseExtended<void> {
      return db.transaction('rw', db.tasks, db.additionalFields, async () => {

        // Add or update our selves. If add, record this.id.
        this._id = await db.tasks.put(this);

        // Save all navigation properties (arrays of emails and phones)
        // Some may be new and some may be updates of existing objects.
        // put() will handle both cases.
        // (record the result keys from the put() operations into emailIds and phoneIds
        //  so that we can find local deletes)
        const [additionalFieldsIds] = await Promise.all([
          Promise.all(this.additionalFields.map(additionalField => db.additionalFields.put(additionalField))),
        ]);

        // Was any email or phone number deleted from out navigation properties?
        // Delete any item in DB that reference us, but is not present
        // in our navigation properties:
        await Promise.all([
          db.additionalFields.where('taskId').equals(this._id) // references us
            .and(additionalField => additionalFieldsIds.indexOf(additionalField._id) === -1) // Not anymore in our array
            .delete(),
        ]);
      });
    }
}

