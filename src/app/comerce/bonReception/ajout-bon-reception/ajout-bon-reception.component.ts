import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastNotificationService } from 'src/app/services/toast-notification.service';
import { InformationsService } from 'src/app/services/informations.service';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';
import {formatDate} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { timeStamp } from 'console';

@Component({
  selector: 'app-ajout-bon-reception',
  templateUrl: './ajout-bon-reception.component.html',
  styleUrls: ['./ajout-bon-reception.component.scss']
})
export class AjoutBonReceptionComponent implements OnInit {
  public isCollapsed: boolean;
  public multiCollapsed1: boolean;
  public multiCollapsed2: boolean;

  bonLivraisonFormGroup: FormGroup;

  lienAjoute = "/bonReceptions/newBonReception"

  apiList = "/bonReceptions/listBonReceptions"

  apiParametres = "/bonReceptions/getAllParametres"

  lienModifie = "/bonReceptions/modifierBonReception/"

  lienGetById = "/bonReceptions/getById/"
  
  lienGetById2 = "/bonReceptions/getById/"

  lienGetByIdDocumentPrecedent = "/bonCommandes/getById/"
 
  lienGetDocuments = "/bonReceptions/getBonCommandes/"

  titreDocument = this.fonctionPartagesService.titreDocuments.bonReception

  titreDocumentPrecedent = this.fonctionPartagesService.titreDocuments.bonCommande

  modeTiere = this.fonctionPartagesService.modeTiere.fournisseur
  
  titreCrud = this.fonctionPartagesService.titreCrud.ajouter
 
  pageList="/bonReception/list"

  @Output() closeModal = new EventEmitter<string>();

  @Input() isPopup = false

  @Input() isOpenModal = false

  
  closeModalLocal(){
    this.closeModal.emit()
  }

  constructor(
    private notificationToast:ToastNotificationService, 
    private http: HttpClient, 
    public informationGenerale: InformationsService, 
    public fonctionPartagesService:FonctionPartagesService,
    private route: ActivatedRoute, 
    private router: Router ) 
  {

    if(this.router.url.indexOf("achatComptoire") > -1){
      this.pageList = "/achatComptoire/list"
   }
         
  }
  
  ngOnInit(): void {
  }

}
 
 