import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLowerPanelComponent } from './dashboard-lower-panel.component';

describe('DashboardLowerPanelComponent', () => {
  let component: DashboardLowerPanelComponent;
  let fixture: ComponentFixture<DashboardLowerPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardLowerPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLowerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
