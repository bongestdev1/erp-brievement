import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastNotificationService } from 'src/app/services/toast-notification.service';
import { InformationsService } from 'src/app/services/informations.service';
import { formatDate } from '@angular/common';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';
import { UtiliteService } from 'src/app/services/utilite.service';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';

@Component({
  selector: 'app-facture-avoir-achat-list',
  templateUrl: './facture-avoir-achat-list.component.html',
  styleUrls: ['./facture-avoir-achat-list.component.scss']
})
export class FactureAvoirAchatListComponent implements OnInit {

 
 

  formBL: FormGroup

  apiDelete = "/factureAvoirAchats/deleteFactureAvoir"
  apiList = "/factureAvoirAchats/listFactureAvoirs"


  pageDetails = "/factureAvoirAchat/details/"
  pageModifie = "/factureAvoirAchat/modifier/"
  pageAjoute = "/factureAvoirAchat/ajout"

  isOpenModalDelete = false
  idDeleteModal = ""
  params1Delete = ""
  params2Delete = ""

  deleteItem() {

    if (this.isLoading) {
      return
    }

    this.isLoading = true

    this.http.post(this.informationGenerale.baseUrl + this.apiDelete + "/" + this.idDeleteModal, {},this.tokenStorageService.getHeader()).subscribe(


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

  openModalDelete(id, params2) {
    this.idDeleteModal = id
    this.isOpenModalDelete = true
    this.params1Delete = "Le BonLivraison"
    this.params2Delete = params2
  }

  closeModalDelete() {
    this.isOpenModalDelete = false
  }

  constructor(private utilite: UtiliteService, private fb: FormBuilder,
    private router: Router, private http: HttpClient,
    public informationGenerale: InformationsService,
    private tokenStorageService:TokenStorageService,
    private notificationToast: ToastNotificationService,
    public fonctionPartages: FonctionPartagesService) {

    this.formBL = this.fb.group({
      numero: [''],
      typeAvoir: [''],
      date: [''],
      client: [''],
      totalHT: [''],
      totalTVA: [''],
      tFiscale: [''],
      totalTTC: [''],
      limit: 50
    })
    this.getBonLivraisons(this.request)
  }

  ngOnInit(): void {
  }

  gotToAdd() {
    this.router.navigate([this.pageAjoute]);
  }

  objectKeys = Object.keys;

  itemsNotShowInput = ["client", "date"]

  titreFile = "factureAchatListe"
  nameFile = "facture_achat_list"

  items = {
    numero: "Numero",
    date: "Date",
    client: "client",
    typeAvoir: "typeAvoir",
    totalHT: "Total_HT",
    totalTVA: "Total_TVA",
    tFiscale: "Timbre_Fiscale",
    totalTTC: "Total_TTC",
  };


  itemsVariable = {
    numero: "Numero",
    date: "Date",
    client: "client",
    typeAvoir: "typeAvoir",
    totalHT: "Total_HT",
    totalTVA: "Total_TVA",
    tFiscale: "Timbre_Fiscale",
    totalTTC: "Total_TTC",
  };

  request = {
    dateStart: this.informationGenerale.idDateAujourdCurrent,
    dateEnd: this.informationGenerale.idDateFinCurrent,
    magasin: "",
    search: {
      numero: "",
      client: "",
      typeAvoir: "",
      date: "",
      tiers: "",
      totalHT: "",
      totalTVA: "",
      tFiscale: "",
      totalTTC: "",
    },
    orderBy: {
      numero: 0,
      client: 0,
      typeAvoir: 0,
      date: 0,
      tiers: 0,
      totalHT: 0,
      totalTVA: 0,
      tFiscale: 0,
      totalTTC: 0,
    },
    limit: 50,
    page: 1
  }

  oldRequest = {
    dateStart: this.informationGenerale.idDateAujourdCurrent,
    dateEnd: this.informationGenerale.idDateFinCurrent,
    magasin: "",
    search: {
      numero: "",
      client: "",
      typeAvoir: "",
      date: "",
      tiers: "",
      totalHT: "",
      totalTVA: "",
      tFiscale: "",
      totalTTC: "",
    },
    orderBy: {
      numero: 0,
      client: 0,
      typeAvoir: 0,
      date: 0,
      tiers: 0,
      totalHT: 0,
      totalTVA: 0,
      tFiscale: 0,
      totalTTC: 0,
    },
    limit: 50,
    page: 1
  }

  isLoading = false

  bonLivraisons = []

  getBonLivraisons(request) {

    if (this.isLoading) {
      return
    }

    for (let key in this.request.search) {
      this.request.search[key] = this.formBL.value[key]
    }

    this.request.dateStart = request.dateStart
    this.request.dateEnd = request.dateEnd
    this.request.limit = this.formBL.value.limit
    this.request.magasin = this.informationGenerale.idSocieteCurrent

    if (!this.testSyncronisation(this.request, this.oldRequest)) {
      this.request.page = 1
    }

    this.isLoading = true
    this.http.post(this.informationGenerale.baseUrl + this.apiList, this.request,this.tokenStorageService.getHeader()).subscribe(

      res => {
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          this.bonLivraisons = resultat.resultat.docs
          this.totalPage = resultat.resultat.pages
          this.oldRequest = resultat.request
          if (this.totalPage < this.request.page && this.request.page != 1) {
            this.request.page = this.totalPage
            this.getBonLivraisons(this.request)
          }

          if (!this.testSyncronisation(this.request, resultat.request) || (this.request.page != resultat.request.page)) {
            this.getBonLivraisons(this.request)
          }
        }
      }, err => {
        this.isLoading = false
        alert("Désole, ilya un problème de connexion internet")
      }
    );
  }

  testSyncronisation(request1, request2) {
    for (let key in request1.search) {
      if (request1.search[key] != request2.search[key]) {
        return false
      }
    }

    for (let key in request1.orderBy) {
      if (request1.orderBy[key] != request2.orderBy[key]) {
        return false
      }
    }

    if (request1.dateStart != request2.dateStart || request1.dateEnd != request2.dateEnd) {
      return false
    }

    if (request1.limit != request2.limit) {
      return false
    }

    if (request1.magasin != request2.magasin) {
      return false
    }

    return true;
  }

  totalPage = 1

  getDate(date) {
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

  changeCroissante(key) {
    var classStyle = key + "-croissante";
    var buttons = document.getElementsByClassName(classStyle);
    if (this.request.orderBy[key] == 1) {
      this.request.orderBy[key] = -1
      this.activationCroissante(buttons[0], buttons[1])
    } else {
      this.request.orderBy[key] = 1
      this.activationCroissante(buttons[1], buttons[0])
    }

    for (let varkey in this.request.orderBy) {
      if (key != varkey) {
        this.request.orderBy[varkey] = 0
      }
    }

    this.getBonLivraisons(this.request)
  }


  activationCroissante(buttons1, buttons2) {
    var buttons = document.getElementsByClassName("croissante");

    for (let i = 0; i < buttons.length; i++) {
      var classList = buttons[i].getAttribute("class")
      classList = classList.replace("active-buttons-croissante", "")
      buttons[i].setAttribute("class", classList)
    }

    classList = buttons2.getAttribute("class")
    classList = classList.replace("active-buttons-croissante", "")
    classList += " active-buttons-croissante"
    buttons2.setAttribute("class", classList)
  }



}


