import Dexie from 'dexie';
import { IList } from '../lists/list.model';

export class ListDatabase extends Dexie {
  lists: Dexie.Table<IList, number>;

  constructor() {
    super('ListsDatabase');

    var db = this;

    this.version(1).stores({
        lists: '_id,title',
    });

    this.lists = this.table('lists');
  }
}

export var db = new ListDatabase();
