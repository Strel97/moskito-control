import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigurationEditorComponent } from './configuration-editor.component';


describe('MoskitoControlConfigComponent', () => {
  let component: ConfigurationEditorComponent;
  let fixture: ComponentFixture<ConfigurationEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
