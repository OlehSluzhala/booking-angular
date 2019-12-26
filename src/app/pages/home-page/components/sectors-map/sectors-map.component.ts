import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../../../core/services/data.service';

const now = new Date();

@Component({
  selector: 'app-sectors-map',
  templateUrl: './sectors-map.component.html',
  styleUrls: ['./sectors-map.component.css']
})
export class SectorsMapComponent implements OnInit {

  minDate = { year: now.getFullYear(), month: now.getMonth() + 1 , day: now.getDate() };
  latitude = 49.886416;
  longitude = 23.493211;
  mapType = 'satellite';
  markers: object [];

  constructor(
    private httpService: HttpClient,
    private dataService: DataService 
    ) { }

  today(): string{
    return `${now.getFullYear()}-${now.getMonth()}-${now.getDay()}`;
  }

  sectorNumber: any;
  dateRange: any;
  previous: any;

  convertDate(dateRange){
    return `${dateRange.getFullYear()}-${dateRange.getMonth()}-${dateRange.getDay()}`;
  }

  reverseMarker(marker, infowindow){
    this.dataService.changeNumber(marker.number);
    infowindow.close();
  }

  clickedMarker(infowindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }

  filterByDate(){ 
    this.httpService.get(`https://localhost:44393/api/sectors/free?fromDate=${this.dateRange.startDate.format('YYYY MM DD')}&toDate=${this.dateRange.endDate.format('YYYY MM DD')}`)
      .subscribe(
        data => {
        this.markers = data as object [];
      })
  }


  ngOnInit() {
    this.dataService.currentSectorNumber.subscribe(number => this.sectorNumber = number);
    this.dataService.currentDateRange.subscribe(range => this.dateRange = range);
    this.httpService.get(`https://localhost:44393/api/sectors/free?fromDate=${this.dateRange.startDate}&toDate=${this.dateRange.endDate}`)
      .subscribe(
        data => {
        this.markers = data as object [];
      }
    );
  }

}
