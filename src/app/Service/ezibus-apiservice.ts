import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SessionService } from './SessionService';
import {Observable, throwError} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
// import { Bus } from "src/app/core/models/bus.model";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EziBusService {
  loading: boolean;
  baseurl = environment.apiUrl;
  basicToken = btoa(`${environment.public_user}:${environment.public_password}`);
  constructor(
    private http: HttpClient,
    private router: Router,
    private sessionService: SessionService
  ) {
  }
  // operatorId ='a1ceb086-3757-416c-3cbb-08dc46bbea6a';
  operatorId ='3e8f594d-b594-449d-f5ee-08dd8ade3cad';
  getApiService(url): any {
    // this.user = this.sessionService.getItem("currentUser");
    return this.http
      .get<any>(`${this.baseurl}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${this.basicToken}`,
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
        Authorization: `Basic ${this.basicToken}`,
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      },
    });
  }

  updateApiService(url, body): Observable<any> {
    return this.http.put(`${this.baseurl}${url}`, body, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${this.basicToken}`,
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      },
    });
  }

  getAllLocations(){
    let url = `/api/public/locations`;
    return this.getApiService(url).then((data) => {
      return data;
    })
      .catch((item) => {
        return false;
      });;
  }

  searchAllTrip(departureLocationId,arrivalLocationId,tripDate){
    let url = `​/api/public/saerchAllTrip/${departureLocationId}/${arrivalLocationId}/${tripDate}`;
    return this.getApiService(url).then((data) => {
      return data;
    });
  }
  searchTrip(departureLocationId,arrivalLocationId,tripDate){
    let url = `​/api/public/searchTrip/${this.operatorId}/${departureLocationId}/${arrivalLocationId}/${tripDate}`;
    return this.getApiService(url).then((data) => {
     return data;
    });
  }
  
  getOperatorAccounts(){
    let url = `/api/public/bankAccounts/${this.operatorId}`;
    return this.getApiService(url).then((data) => {
      return data;
    })
      .catch((item) => {
        return false;
      });;
  }

  search(departureLocationId, arrivalLocationId, tripDate){
    let url = `/api/public/searchTrip/${this.operatorId}/${departureLocationId}/${arrivalLocationId}/${tripDate}`;
    return this.getApiService(url).then((data) => {
      console.log(data)
      return data;
    })
  }

  reserve(data){
    let url = `/api/public/reserve`;
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

  ContactRegistration(data){
    let url = `/api/public/submitContactUsForm`;
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

  reserveMultiple(data){
    console.log(data);
    let url = `/api/public/reserveMultiple`;
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

  getDestinations(){
    let url = `/api/public/activeDestinations`;
    return this.getApiService(url).then((data) => {
      return data;
    })
      .catch((item) => {
        return false;
      });;
  }

  getReservationData(billCode){
    let url = `/api/public/getReservationData/${billCode}`;
    return this.getApiService(url).then((data) => {
      return data;
    })
      .catch((item) => {
        return false;
      });
  }


  getAvailableRoutes(){
    let url = `/api/public/lines`;
    return this.getApiService(url).then((data) => {
      return data;
    })
      .catch((item) => {
        return false;
      });
  }

  confirmAwashOtp(data){
    let url = `/api/public/confirmAwashOtpPayment`;
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
