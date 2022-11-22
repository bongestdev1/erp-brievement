import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InformationsService } from 'src/app/services/informations.service';
import { HttpClient } from '@angular/common/http';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';

@Component({
  selector: 'app-details-bon-reception',
  templateUrl: './details-bon-reception.component.html',
  styleUrls: ['./details-bon-reception.component.scss']
})
export class DetailsBonReceptionComponent implements OnInit {
 
  apiParametres = "/bonReceptions/getAllParametres"

  lienGetById = "/bonReceptions/getById/"

  titreDocument = this.fonctionPartagesService.titreDocuments.bonReception
  
  titreDocumentTransfert = this.fonctionPartagesService.titreDocuments.bonReception

  modeTiere = this.fonctionPartagesService.modeTiere.fournisseur

  titreCrud = this.fonctionPartagesService.titreCrud.modifier
  
  pageList="/bonReception/list"

  objectKeys = Object.keys;

  constructor(private http: HttpClient,
    public informationGenerale: InformationsService,
    private route: ActivatedRoute,
    public fonctionPartagesService: FonctionPartagesService) {
    
  }

  
  isLoading = false


  ngOnInit(): void {
    
  }
}


