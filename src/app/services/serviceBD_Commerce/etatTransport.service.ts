
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { InformationsService } from '../informations.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class EtatTransport {

  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private httpClient: HttpClient,
    private informationGeneral: InformationsService) { }

  getClient(client): Observable<any> {
    let API_URL = `${this.informationGeneral.baseUrl}/clients/getById/${client}`;
    return this.httpClient.get(API_URL, { headers: this.httpHeaders })
      .pipe(map((res: any) => {

        //console.log("res", res)

        return res.resultat || {}
      }),
        catchError(this.handleError)
      )
  }

  getFournisseur(fournisseur): Observable<any> {
    let API_URL = `${this.informationGeneral.baseUrl}/fournisseurs/getById/${fournisseur}`;
    return this.httpClient.get(API_URL, { headers: this.httpHeaders })
      .pipe(map((res: any) => {

        //console.log("res", res)

        return res.resultat || {}
      }),
        catchError(this.handleError)
      )
  }

  getTiers(tiers): Observable<any> {
    let API_URL = `${this.informationGeneral.baseUrl}/typeTiers/getById/${tiers}`;
    return this.httpClient.get(API_URL, { headers: this.httpHeaders })
      .pipe(map((res: any) => {

        //console.log("res", res)

        return res.resultat || {}
      }),
        catchError(this.handleError)
      )
  }

  getTransporteur(transpoteur): Observable<any> {
    let API_URL = `${this.informationGeneral.baseUrl}/transporteurs/getById/${transpoteur}`;
    return this.httpClient.get(API_URL, { headers: this.httpHeaders })
      .pipe(map((res: any) => {

        //console.log("res", res)

        return res.resultat || {}
      }),
        catchError(this.handleError)
      )
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Handle client error
      errorMessage = error.error.message;
    } else {
      // Handle server error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
