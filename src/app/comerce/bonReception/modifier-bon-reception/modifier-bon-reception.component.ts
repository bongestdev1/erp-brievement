import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InformationsService } from 'src/app/services/informations.service';
import { ToastNotificationService } from 'src/app/services/toast-notification.service';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';
import {formatDate} from '@angular/common';
import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modifier-bon-reception',
  templateUrl: './modifier-bon-reception.component.html',
  styleUrls: ['./modifier-bon-reception.component.scss']
})
export class ModifierBonReceptionComponent implements OnInit {
  public isCollapsed: boolean;
  public multiCollapsed1: boolean;
  public multiCollapsed2: boolean;

  bonLivraisonFormGroup: FormGroup;

  lienAjoute = "/bonReceptions/newBonReception"

  apiList = "/bonReceptions/listBonReceptions"

  apiParametres = "/bonReceptions/getAllParametres"

  lienModifie = "/bonReceptions/modifierBonReception/"

  lienGetById = "/bonReceptions/getById/"

  pageList="/bonReception/list"

  apiAjouteReception = "/bonReceptions/addReception/"

  titreDocument = this.fonctionPartagesService.titreDocuments.bonReception

  modeTiere = this.fonctionPartagesService.modeTiere.fournisseur
  
  titreCrud = this.fonctionPartagesService.titreCrud.modifier
 
  @Output() closeModalModifier = new EventEmitter<string>();
  @Input() id
  @Input() isPopup

  closeModalModifierEvent(){
    this.closeModalModifier.emit()
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
    if(this.router.url.indexOf("achatComptoire") > -1){
      this.pageList = "/achatComptoire/list"
    }
  }

}
 
 