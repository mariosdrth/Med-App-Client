import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HomeComponent } from './home.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CookieService } from 'ngx-cookie-service';
import { BrowserCookiesModule } from '@ngx-utils/cookies/browser';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

class MockGlobalService {
  loggedIn = false;
  checkIfLoggedIn() {
    return this.loggedIn;
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let globalService: MockGlobalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ModalModule.forRoot(),
        HttpClientModule,
        BrowserCookiesModule.forRoot(),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      providers: [CookieService],
      declarations: [HomeComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    globalService = new MockGlobalService();
    fixture.detectChanges();
  });

  afterEach(() => {
    globalService = null;
  });

  it('should not be logged in', () => {
    globalService.loggedIn = false;
    expect(component).toBeTruthy();
  });

  it('should check title is there', () => {
    globalService.loggedIn = false;
    const loginButton = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(loginButton.textContent.trim()).toContain('Home Page');
  });

  it('should check title is there', () => {
    globalService.loggedIn = false;
    const loginButton = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(loginButton.textContent.trim()).toContain('Connect to continue');
  });

  it('should check login button is there', () => {
    globalService.loggedIn = false;
    const loginButton = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(loginButton.textContent.trim()).toContain('Login');
  });
});
