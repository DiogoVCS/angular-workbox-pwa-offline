import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { List } from './list.model';

@Injectable({
  providedIn: 'root',
})
export class ListsService {
  constructor(private httpClient: HttpClient) {}

  getById(id: string) {
    return this.httpClient.get(`http://localhost:3000/lists/${id}`);
  }

  getAll(): Observable<List[]> {
    return this.httpClient.get<List[]>(`http://localhost:3000/lists/`);
  }

  createList(list: List): Observable<List> {
    console.log(list);
    return this.httpClient.post<List>('http://localhost:3000/lists', list);
  }

  removeList(id: string) {
    return this.httpClient.delete(`http://localhost:3000/lists/${id}`);
  }
}
