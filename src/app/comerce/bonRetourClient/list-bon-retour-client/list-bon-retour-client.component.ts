import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastNotificationService } from 'src/app/services/toast-notification.service';
import { InformationsService } from 'src/app/services/informations.service';
import {formatDate} from '@angular/common';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';
import { UtiliteService } from 'src/app/services/utilite.service';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { GenerationPdfFactureService } from 'src/app/services/generation-pdf-facture.service';

@Component({
  selector: 'app-list-bon-retour-client',
  templateUrl: './list-bon-retour-client.component.html',
  styleUrls: ['./list-bon-retour-client.component.scss']
})
export class ListBonRetourClientComponent implements OnInit {
  formBL:FormGroup

  apiDelete = "/bonRetourClients/deleteBonRetourClient"
  apiList = "/bonRetourClients/listBonRetourClients"
  
  pageDetails = "/bonRetourClient/details/"
  pageModifie = "/bonRetourClient/modifier/"
  pageAjoute = "/bonRetourClient/ajout"

  isOpenModalDelete = false
  idDeleteModal = ""
  params1Delete = ""
  params2Delete = ""

  deleteItem(){
     
    if (this.isLoading) {
      return
    }

    this.isLoading = true

    this.http.post(this.informationGenerale.baseUrl + this.apiDelete +"/"+this.idDeleteModal, {},this.tokenStorageService.getHeader()).subscribe(

      res => {
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
            this.getBonLivraisons(this.request)
            this.closeModalDelete()
            this.notificationToast.showSuccess("Votre BonLivraison est bien supprimée !")
         }
      }, err => {
        this.isLoading = false
        alert("Désole, ilya un problème de connexion internet")
      }
    );

  }

  openModalDelete(id, params2){
    this.idDeleteModal = id
    this.isOpenModalDelete = true
    this.params1Delete = "Le Bon Retour Client"
    this.params2Delete = params2
  }

  closeModalDelete(){
    this.isOpenModalDelete = false
  }
  
  titreDocument = this.fonctionPartages.titreDocuments.bonRetourClient

  constructor(private utilite:UtiliteService, private fb:FormBuilder, 
    private router:Router, private http: HttpClient, 
    public informationGenerale: InformationsService,
    private notificationToast:ToastNotificationService,
    private tokenStorageService:TokenStorageService,
    public fonctionPartages:FonctionPartagesService,
    public generationPdfFacture: GenerationPdfFactureService) {
   
    this.formBL = this.fb.group({
      numero:[''],
      date:[''],
      totalRemise:[''],
      client:[''],
      totalHT:[''],
      totalTVA:[''],
      tFiscale:[''],
      totalTTC:[''],
      totalGain:[''],
      transfertBonLivraison:[''],
      limit: 50
    })
  }

  gotToAdd(){
    this.router.navigate([this.pageAjoute]);
  }

  objectKeys = Object.keys;

  itemsNotShowInput = ["client", "date"]

  titreFile = "Liste Bon Retour Client"
  nameFile = "liste_bon_retour_client"
  printout() {
    this.utilite.printout(this.bonLivraisons, this.items, this.titreFile)
  }

  generatePDF() {
    this.utilite.generatePDF(this.bonLivraisons, this.items, this.titreFile, this.nameFile)
  }
  
  exportexcel() {
    /* table id is passed over here */
    this.utilite.exportexcel(this.bonLivraisons, this.items, this.titreFile, this.nameFile)
  }
  
  items = { 
    numero:"Numero",
    date:"Date",
    client:"Client",
    totalRemise:"Total_Remise",
    totalHT:"Total_HT",
    totalTVA:"Total_TVA",
    tFiscale:"Timbre_Fiscale",
    totalTTC:"Total_TTC",
    totalGain:"Total_Gain",
    transfertBonLivraison:"Transfert Bon Livraison"
  };

  itemsVariable = { 
    numero:"active",
    date:"active",
    client:"active",
    totalRemise:"active",
    totalHT:"active",
    totalTVA:"active",
    tFiscale:"active",
    totalTTC:"active",
    totalGain:"active",
    transfertBonLivraison:'active'
  };

  request = { 
    dateStart: this.informationGenerale.idDateAujourdCurrent,
    dateEnd: this.informationGenerale.idDateFinCurrent,
    magasin:"",
    search:{
      numero:"",
      client:"",
      date:"",
      tiers:"",
      totalRemise:"",
      totalHT:"",
      totalTVA:"",
      tFiscale:"",
      totalTTC:"",
      totalGain:"",
      transfertBonLivraison:""
    },
    orderBy:{ 
      numero:0,
      client:0,
      date:0,
      tiers:0,
      totalRemise:0,
      totalHT:0,
      totalTVA:0,
      tFiscale:0,
      totalTTC:0,
      totalGain:0,
      transfertBonLivraison:0
    },
    limit: 50,
    page:1,
    isRetourVenteContoire:false
  } 

  oldRequest = {
    dateStart: this.informationGenerale.idDateAujourdCurrent,
    dateEnd: this.informationGenerale.idDateFinCurrent,
    magasin:"",
    search:{
      numero:"",
      client:"",
      date:"",
      tiers:"",
      totalRemise:"",
      totalHT:"",
      totalTVA:"",
      tFiscale:"",
      totalTTC:"",
      totalGain:"",
      transfertBonLivraison:""
    },
    orderBy:{ 
      numero:0,
      client:0,
      date:0,
      tiers:0,
      totalRemise:0,
      totalHT:0,
      totalTVA:0,
      tFiscale:0,
      totalTTC:0,
      totalGain:0,
      transfertBonLivraison:0
    },
    limit: 50,
    page:1,
    isRetourVenteContoire:false
  } 
  
  isRetourVenteContoire = false

  ngOnInit(): void {
     if(this.router.url.indexOf("retourVenteComptoire") > -1){
        this.isRetourVenteContoire = true
        this.pageDetails = "/retourVenteComptoire/details/"
        this.pageModifie = "/retourVenteComptoire/modifier/"
        this.pageAjoute = "/retourVenteComptoire/ajout"
      
     }
     this.getBonLivraisons(this.request)

  }

  isLoading = false

  bonLivraisons = []

  getBonLivraisons(request) {

    if (this.isLoading) {
      return
    }

    for(let key in this.request.search){
      this.request.search[key] = this.formBL.value[key]
    }

    this.request.dateStart = request.dateStart 
    this.request.dateEnd = request.dateEnd 
    this.request.limit = this.formBL.value.limit
    this.request.magasin = this.informationGenerale.idSocieteCurrent

    if(!this.testSyncronisation(this.request, this.oldRequest)){
      this.request.page = 1
    }

    this.request.isRetourVenteContoire = this.isRetourVenteContoire
    this.isLoading = true

    this.http.post(this.informationGenerale.baseUrl + this.apiList, this.request,this.tokenStorageService.getHeader()).subscribe(

      res => {
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          this.bonLivraisons = resultat.resultat.docs
          this.totalPage = resultat.resultat.pages
          this.oldRequest = resultat.request
          if(this.totalPage < this.request.page && this.request.page != 1){
            this.request.page = this.totalPage 
            this.getBonLivraisons(this.request)
          }

          if(!this.testSyncronisation(this.request, resultat.request) || (this.request.page != resultat.request.page) ){
            this.getBonLivraisons(this.request)
          }
        }
      }, err => {
        this.isLoading = false
        alert("Désole, ilya un problème de connexion internet")
      }
    );
  }

  testSyncronisation(request1, request2){
    for(let key in request1.search){
      if(request1.search[key] != request2.search[key]){
        return false
      }
    }
 
    for(let key in request1.orderBy){
      if(request1.orderBy[key] != request2.orderBy[key]){
        return false
      }
    }

    if(request1.dateStart != request2.dateStart || request1.dateEnd != request2.dateEnd){
      return false
    }
   
    if(request1.limit != request2.limit){
      return false
    }

    if(request1.magasin != request2.magasin){
      return false
    }

    return true;
  }

  totalPage = 1

  getDate(date){
    return formatDate(new Date(date), 'yyyy-MM-dd', 'en');
  }

  setLimitPage(newLimitPage: number) {
    this.request.limit = newLimitPage
    this.request.page = 1
    this.getBonLivraisons(this.request)
  }

  setPage(newPage: number) {
    this.request.page = newPage
    this.getBonLivraisons(this.request)
  }

  changeCroissante(key){
    var classStyle = key+"-croissante";
    var buttons = document.getElementsByClassName(classStyle);
    if(this.request.orderBy[key] == 1){
      this.request.orderBy[key] = -1
      this.activationCroissante(buttons[0], buttons[1])
    }else{
      this.request.orderBy[key] = 1
      this.activationCroissante(buttons[1], buttons[0])
    }

    for(let varkey in  this.request.orderBy){
      if(key != varkey){
         this.request.orderBy[varkey] = 0
      }
    }
    
    this.getBonLivraisons(this.request)
  }


  activationCroissante(buttons1, buttons2){
    var buttons = document.getElementsByClassName("croissante");

    for(let i = 0; i < buttons.length; i++){
      var classList = buttons[i].getAttribute("class")
      classList = classList.replace("active-buttons-croissante","")
      buttons[i].setAttribute("class", classList) 
    }
   
    classList = buttons2.getAttribute("class")
    classList = classList.replace("active-buttons-croissante","")
    classList += " active-buttons-croissante"
    buttons2.setAttribute("class", classList)
  }


}
