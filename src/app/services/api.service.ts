import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService
{

  deviceId   : string = '';
  deviceSubj : BehaviorSubject<any>;


  constructor(
    private http: HttpClient
  )
  {
    this.deviceSubj = new BehaviorSubject([]);

    Device.getId().then( ( device : any ) => {

      this.deviceId = device?.uuid;

      this.deviceSubj.next( this.deviceId );

    });
  }


  public getDeviceId()
  {
    return this.deviceId;
  }


  public sendWhatsAppLog(text: string)
  {
    return this.http.get<any>(`https://api.callmebot.com/whatsapp.php?phone=+556284619997&text=${text}&apikey=562678`);
  }


  public getQeueItem()
  {
    return this.http.post<any>(`https://sms.fariaslgx.com/api/queue/get`, {
      'device-id' : this.deviceId
    });
  }


  public setQeueStatus(id: number, status: number)
  {
    return this.http.put<any>(`https://sms.fariaslgx.com/api/queue/${id}`, {
      'device-id' : this.deviceId,
      'status'    : status
    });
  }


}
