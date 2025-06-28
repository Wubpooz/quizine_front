import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteStatusButtonComponent } from './website-status-button.component';

describe('WebsiteStatusButtonComponent', () => {
  let component: WebsiteStatusButtonComponent;
  let fixture: ComponentFixture<WebsiteStatusButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteStatusButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WebsiteStatusButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
