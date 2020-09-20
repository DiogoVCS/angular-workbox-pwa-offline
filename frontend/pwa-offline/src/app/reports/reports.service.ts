import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IReport} from './report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(private httpClient: HttpClient) {
  }

  getById(id: string): Observable<IReport> {
    return this.httpClient.get<IReport>(`http://localhost:3000/api/reports/${id}`);
  }

  getAll(): Observable<IReport[]> {
    return this.httpClient.get<IReport[]>(`http://localhost:3000/api/reports/`);
  }

  createReport(report: IReport): Observable<IReport> {
    return this.httpClient.post<IReport>(
      'http://localhost:3000/api/reports',
      report
    );
  }

  removeReport(id: string): Observable<IReport> {
    return this.httpClient.delete<IReport>(`http://localhost:3000/api/reports/${id}`);
  }

  patchReportNotes(report: IReport): Observable<IReport> {
    return this.httpClient.patch<IReport>(
      `http://localhost:3000/api/reports/${report._id}`,
      report
    );
  }
}
