import { Article } from './../../model/modelComerce/article/article';
import { HttpClient, HttpResponse,HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from 'rxjs/operators';
import { TokenStorageService } from "../authentication/token-storage.service";
import { InformationsService } from '../informations.service';



@Injectable({
  providedIn: "root",
})
export class FraisParArticle {
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');


  constructor(private http: HttpClient,
    private informationGeneral: InformationsService,
    private tokenStorageService: TokenStorageService,
    ) {}



    getFraisParArticle(article : number):Observable<Article>{
      //console.log(article);
      var url = `/articles/getListeFraisByArticle/${article}`
      let API_URL = this.informationGeneral.baseUrl + url;

      return this.http.get<Article>(API_URL)
      .pipe(map((res: any) => {

        //console.log("res", res)

        return res || {}
      }),
      catchError(this.handleError)
      )
    }









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
