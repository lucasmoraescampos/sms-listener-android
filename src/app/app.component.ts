import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SMS } from '@ionic-native/sms/ngx';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from './services/api.service';

// https://capacitorjs.com/docs/v2/apis/background-task
import { Plugins } from '@capacitor/core';
const { App, BackgroundTask } = Plugins;

@Component({
  selector    : 'app-root',
  templateUrl : 'app.component.html',
  styleUrls   : ['app.component.scss'],
})
export class AppComponent implements OnInit
{

  private notificationID: number = 0;

  private unsubscribe$ = new Subject();

  public intervalControl : any;
  public deviceId : any;


  constructor(
    private sms    : SMS,
    private apiSrv : ApiService
  )
  {
    this.apiSrv.deviceSubj
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe( ( data : any ) => {

        this.deviceId = data

      });
  }


  ngOnInit()
  {
    if (Capacitor.isNativePlatform())
    {
      StatusBar.setBackgroundColor({ color: '#FAFAFA' });
      StatusBar.setStyle({ style: Style.Light });
    }

    this.init();

    App.addListener('appStateChange', state => {

      clearInterval( this.intervalControl );
      this.init();

    });
  }


  init()
  {
    this.intervalControl = setInterval(() => {

      this.apiSrv.getQeueItem().subscribe( data => {

        if( !Array.isArray( data.data ) )
        {
          this.send( data.data );
        }

      });

    }, 5 * 1000);
  }



  public send( data )
  {
    this.sms.send(data.target, data.message, {
      android: { intent: '' }
    }).then( res => {

      this.apiSrv.setQeueStatus( data.id, 2 )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe( res => {
        //console.log(res)
      });

      this.notificationID++;

    }).catch(err => {

      this.apiSrv.setQeueStatus( data.id, 3 )
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe( res => {
          //console.log(res)
        });

    });
  }



}
