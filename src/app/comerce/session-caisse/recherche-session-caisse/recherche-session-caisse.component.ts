import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SessionCaisse } from 'src/app/model/modelCommerce/sessionCaisse';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';
import { InformationsService } from 'src/app/services/informations.service';
import { SessionCaisseService } from 'src/app/services/serviceBD_Commerce/sessionCaisse.service';
import { ToastNotificationService } from 'src/app/services/toast-notification.service';

@Component({
  selector: 'app-recherche-session-caisse',
  templateUrl: './recherche-session-caisse.component.html',
  styleUrls: ['./recherche-session-caisse.component.scss']
})
export class RechercheSessionCaisseComponent implements OnInit {
  dates = {
    dateStart: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
    dateEnd:  formatDate(new Date(), 'yyyy-MM-dd', 'en'),}

  formC: FormGroup
  changeVar = false

  listTotalRegl = []

  sessionCaisse = new SessionCaisse()

  utilisateur

  erreurSessionCaisse = {
    utilisateur: "",
  }

  request = {
    dateStart: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
    dateEnd:  formatDate(new Date(), 'yyyy-MM-dd', 'en'),
    search: {
      caisse: "",
      utilisateur: "",
      numero: "",
      dateOuverture: "",
      cloture: "",
      dateCloture: "",
      fondCaisseOuvrier: "",
      fondCaisseAdmin: "",
      totalCaisse: "",
      montantDifference: "",
      remarque: "",
    },
    orderBy: {
      dateEcheance: 0,
      dateReglement: 0,
      modeReglement: 0,
      montant: 0,
      notes: 0,
      numCheque: 0,
      tresorerie: 0,
      client: 0,
      numero: 0,
      solde: 0,
    },
    societe: "",
    limit: 3,
    page: 1
  }

  constructor(
    private fb: FormBuilder,
    private fonctionPartagesService: FonctionPartagesService,
    private tokenStorageService: TokenStorageService,
    public informationGenerale: InformationsService,
    private sessionCaisseSer: SessionCaisseService,) {
      this.formC = this.fb.group({
        dateStart: [''],
        dateEnd: [''],
  
        limit: 10
      })
      this.getAllParametres()
  }

  ngOnInit(): void {
    this.utilisateur = this.tokenStorageService.getUser()
    this.sessionCaisse.utilisateur = this.utilisateur.id
    this.getAllParametres()
  }

  envoitListeRegl(listReg) {
    this.listTotalRegl = listReg
  }

  getReleveDate(dates) {
    this.changeVar = false
    this.dates.dateStart = dates.dateStart
    this.dates.dateEnd = dates.dateEnd
  }

  //Get Liste des reglements
  getListReglements() {
    this.changeVar = true
  }



  //Get parametre of sessionCaisse
  allUtilisateurs = []
  getAllParametres() {
    let request = {
      societe: this.informationGenerale.idSocieteCurrent,
      exercice: this.informationGenerale.exerciceCurrent
    }
    this.sessionCaisseSer.parametre(request)
      .subscribe(
        res => {
          let resultat: any = res
          if (resultat.status) {
            this.allUtilisateurs = resultat.utilisateurs
          }
        },
        error => {
          alert("Désole, ilya un problème de connexion internet")
        });
  }

  //autocomplete Utilisateur
  keySelectedUtilisateur = "nom"
  objetUtilisateur = {
    nom: "Nom",
    prenom: "Prenom",
  }
  setUtilisateurID(id) {
    this.sessionCaisse.utilisateur = id
  }
  //open modal ajout Caisse
  isOpenModalAjoutElement = false
  idAjoutElementModal = ""
  typeElement
  closeModalAjoutElement() {
    this.isOpenModalAjoutElement = false
    //this.getAllParametres()
  }
  openModalAjoutUtilisateur() {
    this.typeElement = this.fonctionPartagesService.titreOfModal.ajouterUtilisateur
    this.isOpenModalAjoutElement = true
  }

}
