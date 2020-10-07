import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FirstRunPage } from './first-run.page';

describe('FirstRunPage', () => {
  let component: FirstRunPage;
  let fixture: ComponentFixture<FirstRunPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstRunPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FirstRunPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
