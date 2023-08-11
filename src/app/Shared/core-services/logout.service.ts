import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  private readonly loggedOutSubject = new BehaviorSubject(false);
  public readonly loggedOut$ = this.loggedOutSubject.asObservable();
  constructor( private storageService: LocalStorageService) { }
  performLogout = (): void => {
    this.storageService.clear();
    this.loggedOutSubject.next(true);
}
}
