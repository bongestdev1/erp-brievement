import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InformationsService } from 'src/app/services/informations.service';
import { HttpClient } from '@angular/common/http';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';

@Component({
  selector: 'app-details-bon-retour-client',
  templateUrl: './details-bon-retour-client.component.html',
  styleUrls: ['./details-bon-retour-client.component.scss']
})
export class DetailsBonRetourClientComponent implements OnInit {
  lienGetById = "/bonRetourClients/getById/"
  apiParametres = "/bonRetourClients/getAllParametres"

  titreDocument = this.fonctionPartagesService.titreDocuments.bonRetourClient
  
  titreDocumentTransfert = this.fonctionPartagesService.titreDocuments.bonRetourClient

  modeTiere = this.fonctionPartagesService.modeTiere.client

  titreCrud = this.fonctionPartagesService.titreCrud.details
  
  pageList="/bonRetourClient/list"

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


