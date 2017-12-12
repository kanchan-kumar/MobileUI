import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMainNavComponent } from './dashboard-main-nav.component';

describe('DashboardMainNavComponent', () => {
  let component: DashboardMainNavComponent;
  let fixture: ComponentFixture<DashboardMainNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardMainNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMainNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
