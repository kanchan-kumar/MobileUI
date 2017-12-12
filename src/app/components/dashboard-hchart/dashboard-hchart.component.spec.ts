import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHchartComponent } from './dashboard-hchart.component';

describe('DashboardHchartComponent', () => {
  let component: DashboardHchartComponent;
  let fixture: ComponentFixture<DashboardHchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardHchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardHchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
