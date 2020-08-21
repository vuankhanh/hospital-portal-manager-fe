import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListenConfigurationService {
  city: City;

  listenCity$: BehaviorSubject<City> = new BehaviorSubject<City>(this.city);
  listenCity: Observable<City> = this.listenCity$.asObservable();
  constructor() { }

  setCity(cities){
    this.city = cities;
    this.listenCity$.next(this.city);
  }
}

export interface City{
  ID: number;
  city: string;
  created_at: string;
  updated_at: string;
}
