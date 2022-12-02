import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastNotificationService } from 'src/app/services/toast-notification.service';
import { InformationsService } from 'src/app/services/informations.service';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';
import { ActivatedRoute, Router } from '@angular/router';

import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ajout-commande',
  templateUrl: './ajout-commande.component.html',
  styleUrls: ['./ajout-commande.component.scss']
})
export class AjoutCommandeComponent implements OnInit {
 
  lienAjoute = "/commandes/newCommande"

  apiList = "/commandes/listCommandes"

  apiParametres = "/commandes/getAllParametres"

  lienModifie = "/commandes/modifierCommande/"

  lienGetById = "/commandes/getById/"
  lienGetById2 = "/commandes/getById/"
  
  pageList = "/commande/list"

  lienGetByIdDocumentPrecedent = "/devis/getById/"
 
  lienGetDocuments = "/commandes/getDevis/"
 
  titreDocument = this.fonctionPartagesService.titreDocuments.commande

  titreDocumentPrecedent = this.fonctionPartagesService.titreDocuments.devis

  modeTiere = this.fonctionPartagesService.modeTiere.client
  
  titreCrud = this.fonctionPartagesService.titreCrud.ajouter
  
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
    private router: Router, ) 
  {
         
  }
  
  ngOnInit(): void {
  }

}
 
 