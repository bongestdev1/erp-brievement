import { Component, OnInit,  Input, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastNotificationService } from 'src/app/services/toast-notification.service';
import { InformationsService } from 'src/app/services/informations.service';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';
import {formatDate} from '@angular/common';
import { Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timeStamp } from 'console';

@Component({
  selector: 'app-modifier-bon-retour-client',
  templateUrl: './modifier-bon-retour-client.component.html',
  styleUrls: ['./modifier-bon-retour-client.component.scss']
})
export class ModifierBonRetourClientComponent implements OnInit {
  public isCollapsed: boolean;
  public multiCollapsed1: boolean;
  public multiCollapsed2: boolean;

  @Output() closeModalModifier = new EventEmitter<string>();
  @Input() id
  @Input() isPopup
  closeModalModifierEvent(){
    this.closeModalModifier.emit()
  }

  bonLivraisonFormGroup: FormGroup;

  lienAjoute = "/bonRetourClients/newBonRetourClient"

  apiList = "/bonRetourClients/listBonRetourClients"
 
  apiParametres = "/bonRetourClients/getAllParametres"

  lienModifie = "/bonRetourClients/modifierBonRetourClient/"

  lienGetById = "/bonRetourClients/getById/"
 
  titreDocument = this.fonctionPartagesService.titreDocuments.bonRetourClient

  modeTiere = this.fonctionPartagesService.modeTiere.client
  
  titreCrud = this.fonctionPartagesService.titreCrud.modifier
 
  pageList = "/bonRetourClient/list"
 
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
    if(this.router.url.indexOf("retourVenteComptoire") > -1){
      this.pageList = "/retourVenteComptoire/list"
   }
  }

  

}
 
 