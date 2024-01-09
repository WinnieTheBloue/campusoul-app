import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataPage } from './data.page';

describe('DataPage', () => {
  let component: DataPage;
  let fixture: ComponentFixture<DataPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
