import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizDescriptionComponent } from './quiz-description.component';

describe('QuizDescriptionComponent', () => {
  let component: QuizDescriptionComponent;
  let fixture: ComponentFixture<QuizDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizDescriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuizDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
