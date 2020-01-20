import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BookingService } from './booking.service';
import * as moment from 'moment';
import { Sector } from 'src/app/shared/models/sector-model';


@Injectable({
  providedIn: 'root'
})
export class DataService{

  apiSectorsUrl: string = 'https://localhost:44393/api/sectors';

  private _selectedSectors = new BehaviorSubject<Sector[]>([]);
  currentSelectedSectors = this._selectedSectors.asObservable();

  private markers = new BehaviorSubject<object []>(null);
  currentMarkers = this.markers.asObservable();

  private _fromDate = new BehaviorSubject<any>(moment().format('YYYY-MM-DD'));
  currentFromDate = this._fromDate.asObservable();

  private _toDate = new BehaviorSubject<any>(moment().format('YYYY-MM-DD'));
  currentToDate = this._toDate.asObservable();

  clearSelectedSectors: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private httpService: HttpClient,
    private bookingService: BookingService
    ) {
      this.clearSelectedSectors.subscribe(s => this._selectedSectors.next([]));
    }

  showAllSectors(){
    this.httpService.get(this.apiSectorsUrl)
    .subscribe(
      data => {
        this.currentMarkers = data as Observable<object []>;
        this.changeMarkers(this.currentMarkers);
      }
    );
  }

  get selectedSectors() {
    return this._selectedSectors.getValue();
  }

  get fromDate() {
    return this._fromDate.getValue();
  }

  get toDate() {
    return this._toDate.getValue();
  }

  renderMarkers(startDate, endDate) {
    this.bookingService.filterByDate(startDate, endDate)
        .subscribe(
          data => {
          this.changeMarkers(data);
        })
  }

  selectSector(marker): void {
    this._selectedSectors.next(([...this._selectedSectors.getValue(), marker]));
  }

  changeMarkers(markers) {
    this.markers.next(markers);
  }

  changeDateRange(startDate, endDate) {
    if (startDate != null || endDate != null) {
      this.fromDate.next(startDate);
      this.toDate.next(endDate);
      this.bookingService.filterByDate(startDate, endDate)
        .subscribe(
          data => {
          this.changeMarkers(data);
        })
    }
    else {
      this.showAllSectors();
    }
  }
}
