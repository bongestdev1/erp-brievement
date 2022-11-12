
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { InformationsService } from '../informations.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { TokenStorageService } from '../authentication/token-storage.service';



@Injectable({
  providedIn: 'root'
})
export class Commandes {

  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private httpClient: HttpClient,
    private informationGeneral: InformationsService,
    private tokenStorageService: TokenStorageService,

    ) { }

  getCommandes(request): Observable<any> {

    console.log(request);

    var url = '/commandes/journalCommandes'
    let API_URL = this.informationGeneral.baseUrl + url;


    return this.httpClient.post<any>(API_URL, request,this.tokenStorageService.getHeader())
      .pipe(map((res: any) => {

         //console.log("res", res)

        return res || {}
      }),
        catchError(this.handleError)
      )
  }

  getBonCommandes(request): Observable<any> {

    console.log(request);

    var url = '/bonCommandes/listBonCommandes'
    let API_URL = this.informationGeneral.baseUrl + url;


    return this.httpClient.post<any>(API_URL, request,this.tokenStorageService.getHeader())
      .pipe(map((res: any) => {

        console.log("res", res)

        return res || {}
      }),
        catchError(this.handleError)
      )
  }

  getCommandesByClient(request): Observable<any> {

    console.log(request);

    var url = '/commandes/journalCommandesByClient'
    let API_URL = this.informationGeneral.baseUrl + url;


    return this.httpClient.post<any>(API_URL, request,this.tokenStorageService.getHeader())
      .pipe(map((res: any) => {

         //console.log("res", res)

        return res || {}
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
