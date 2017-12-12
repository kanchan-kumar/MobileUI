import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTestRunComponent } from './dashboard-test-run.component';

describe('DashboardTestRunComponent', () => {
  let component: DashboardTestRunComponent;
  let fixture: ComponentFixture<DashboardTestRunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardTestRunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTestRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
