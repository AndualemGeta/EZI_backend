import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SessionService } from './SessionService';
import {Observable, throwError} from 'rxjs';
import {catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import {cbe_url,telebirr_url,mpesa_url,amole_url,awash_url,hellocash_url } from '../utils/constants';
import { get } from 'jquery';
@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  loading: boolean;
  constructor(
    private http: HttpClient,
    private router: Router,
    private sessionService: SessionService
  ) {
  }

 baseurl ="https://gateway.arifpay.org"; 
  operatorId ='a1ceb086-3757-416c-3cbb-08dc46bbea6a';
  getApiService(url): any {
    // this.user = this.sessionService.getItem("currentUser");
    return this.http
      .get<any>(`${this.baseurl}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: "Basic R2hpb25wdWJsaWM6R0hJT04xMjM0",
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        },
      })
      .toPromise();
  }

  postApiService(url, body): Observable<any> {
    // this.user = this.sessionService.getItem("currentUser");
    return this.http.post(`${this.baseurl}${url}`, body, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: "Basic R2hpb25wdWJsaWM6R0hJT04xMjM0",
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'x-arifpay-key':'GMSnPIvK3TsPZPBQjWvw2snZ0vYtrivb'
      },
    });
  }

  updateApiService(url, body): Observable<any> {
    return this.http.put(`${this.baseurl}${url}`, body, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      },
    });
  }
  
  createSession(data,paymentMethod){
    let url=this.getPaymentUrl(paymentMethod);
    return this.postApiService(url,data).pipe(
      map((data: any) => {
        return data;
      }),
      catchError((error) => {
        let errorMsg;
        if (error.error instanceof ErrorEvent) {
          errorMsg = "Error:" + error.error.message;
        } else {
          errorMsg = this.getServerErrorMessage(error);
        }
        return throwError(errorMsg);
      })
    );
  }

  private getPaymentUrl(paymentMethod){
    if(paymentMethod=='CBE'){
      return cbe_url;
  }
  else if(paymentMethod=='MPESSA'){
    return mpesa_url;   }
    else if(paymentMethod=='TELEBIRR'){
      return telebirr_url;   }
      else if(paymentMethod=='AMOLE'){      
        return amole_url;   }
        else if(paymentMethod=='AWASH'){      
          return awash_url;   }
          else if(paymentMethod=='HELLOCASH'){      
            return hellocash_url;   }
}
  private getServerErrorMessage(error: HttpErrorResponse): any {
    switch (error.status) {
      case 400: {
        return error.error;
      }
      case 401: {
        return this.router.navigate(["/login"]);
      }
      case 403: {
        return "The access is permanently forbidden you have insufficient rights to access the resource";
      }
      case 404: {
        return this.router.navigate(["/error"]);
      }
      case 422: {
        return error.error;
      }
      case 500: {
        return "Internal Server Error: Please Contact Server Administrator";
      }
      default: {
        return "Server Error: try later";
      }
    }
  }

}
