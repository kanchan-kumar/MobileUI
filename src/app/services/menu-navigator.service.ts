import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { ActionInfo } from '../containers/action-info';

@Injectable()
export class MenuNavigatorService {

  menuActionSubject = new Subject();
  menuNavigatorObservable$ = this.menuActionSubject.asObservable();
  constructor() { }
  get $menuObservable(): Observable<any> {
    return this.menuNavigatorObservable$;
  }

  doAction(action: ActionInfo) {
    this.menuActionSubject.next(action);
  }
}
