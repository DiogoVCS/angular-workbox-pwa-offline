import { Component, OnInit } from '@angular/core';
import { IList } from './lists/list.model';
import { ListsService } from './lists/lists.service';
import { db } from './indexedDb/db';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'pwa-offline';
  lists: Array<IList> = new Array();

  constructor(private listsService: ListsService) {}

  async ngOnInit(): Promise<void> {
    this.listsService.getAll().subscribe((data: Array<IList>) => {
      this.lists = data;
      this.addAllToIndexedDb(data);
    });
  }

  async addAllToIndexedDb(data: IList[]) {
    //    await db.lists.bulkAdd(data);
    //    console.log(JSON.stringify(data));
    await db.lists.bulkAdd(data);
  }

  addList(newList: string) {
    this.listsService
      .createList({ title: newList })
      .subscribe((data: IList) => {
        this.lists.push({ ...data });
        db.lists.add(data)
      });
  }

  removeList(id: string) {
    this.listsService.removeList(id).subscribe((data: IList) => {
      this.listsService.getAll().subscribe((newData: Array<IList>) => {
        this.lists = newData;
      });
    });
  }
}
