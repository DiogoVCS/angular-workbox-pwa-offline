import { Component, OnInit } from '@angular/core';
import { List } from './lists/list.model';
import { ListsService } from './lists/lists.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'pwa-offline';
  lists: Array<List> = new Array();

  constructor(private listsService: ListsService) {}

  async ngOnInit(): Promise<void> {
    this.listsService.getAll().subscribe((data: Array<List>) => {
      this.lists = data;
    });
  }

  addList(newList: string) {
    this.listsService.createList({ title: newList }).subscribe((data: List) => {
      this.lists.push({ ...data });
    });
  }

  removeList(id: string) {
    this.listsService.removeList(id).subscribe((data: List) => {
      this.listsService.getAll().subscribe((newData: Array<List>) => {
        this.lists = newData;
      });
    });
  }
}
