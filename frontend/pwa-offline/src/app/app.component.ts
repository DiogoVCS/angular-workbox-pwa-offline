import {Component, OnInit} from '@angular/core';
import {IReport} from './reports/report.model';
import {ReportsService} from './reports/reports.service';
import {db} from './indexedDb/db';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'pwa-offline';
  reports: Array<IReport> = [];

  constructor(private reportsService: ReportsService) {
  }

  async ngOnInit(): Promise<void> {
    this.reportsService.getAll().subscribe(
      (data: Array<IReport>) => {
        this.reports = data;
        this.addAllToIndexedDb(data);
      },
      async (error) => {
        console.log('Error fetching all reports: ' + error);
        this.reports = await db.reports.toArray();
      }
    );
  }

  async addAllToIndexedDb(data: IReport[]): Promise<string> {
    return db.reports.bulkPut(data);
    // return db.reports.bulkAdd(data);
  }

  async addReport(description: string, notes: string): Promise<void> {
    await this.reportsService
      .createReport({description, notes})
      .subscribe(
        (data: IReport) => {
          this.reports.push({...data});
          db.reports.add(data);
          console.log('(Subscribe) Added Report: ');
        },
        (error) => {
          console.log('Error adding report: ' + error);
        },
        () => {
          console.log('Complete ??: ');
        }
      );
  }

  async removeReport(id: string): Promise<void> {
    await db.reports.delete(id);
    await this.reportsService.removeReport(id).subscribe((data: IReport) => {
    });
  }

  async updateReportNotes(report: IReport, reportNewNotes: string): Promise<void> {
    await this.reportsService
      .patchReportNotes({...report, notes: reportNewNotes})
      .subscribe(
        async (data: IReport) => {
          console.log(`Update report Subscription: ${JSON.stringify(data)}`);
          await db.reports.update(report, {notes: reportNewNotes});
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
