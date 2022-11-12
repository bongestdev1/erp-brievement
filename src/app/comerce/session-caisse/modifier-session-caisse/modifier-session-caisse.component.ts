import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InformationsService } from 'src/app/services/informations.service';
import { ToastNotificationService } from 'src/app/services/toast-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionCaisse } from 'src/app/model/modelCommerce/sessionCaisse';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';
import { SessionCaisseService } from 'src/app/services/serviceBD_Commerce/sessionCaisse.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-modifier-session-caisse',
  templateUrl: './modifier-session-caisse.component.html',
  styleUrls: ['./modifier-session-caisse.component.scss']
})
export class ModifierSessionCaisseComponent implements OnInit {

  @Output() closeModalAjoutSessionCaisse = new EventEmitter<string>();

  @Input() isPopup = false

  @Input() isOpenModalAjoutSessionCaisse = false
 
  compteurChangeListReg = 0

  ngOnChanges(changes: SimpleChanges) {
    if (this.isOpenModalAjoutSessionCaisse) {
      for (let key in this.erreurSessionCaisse) {
        this.erreurSessionCaisse[key] = ""

        if (document.getElementById(key) != null) {
          document.getElementById(key).classList.remove("border-erreur")
        }
      }

      for (let key in this.sessionCaisse) {
        this.sessionCaisse[key] = ""
      }

      this.getAllParametres()
    }
  }

  closeAjoutCaisse() {
    this.closeModalAjoutSessionCaisse.emit();
  }

  sessionCaisseFormGroup: FormGroup;

  objectKeys = Object.keys;
  id = "";

  request = new SessionCaisse()

  sessionCaisse = new SessionCaisse()

  utilisateur

  erreurSessionCaisse = {
    caisse: "",
    utilisateur: "",
    numero: "",
    dateOuverture: "",
    fondCaisseOuvrier: "",
    fondCaisseAdmin: "",
  }

  constructor(

    private notificationToast: ToastNotificationService,
    public informationGenerale: InformationsService,
    private fonctionPartagesService: FonctionPartagesService,
    private sessionCaisseSer: SessionCaisseService,
    private router: Router,
    private route: ActivatedRoute,) {
  }

  getSessionCaisse(id) {

    this.isLoading = true
    this.sessionCaisseSer.get(id)
      .subscribe(
        res => {
          this.isLoading = false
          let response: any = res
          if (response.status) {
            for (let key in this.sessionCaisse) {
              this.sessionCaisse[key] = response.resultat[key]
            }
            this.sessionCaisse.id = response.resultat.id
            this.sessionCaisse.dateOuverture = formatDate(new Date(this.sessionCaisse.dateOuverture), 'yyyy-MM-dd', 'en');
          }
        },
        error => {
          this.isLoading = false
          alert("Désole, ilya un problème de connexion internet")
        });

  }

  ngOnInit(): void {
    this.getAllParametres()
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id.length > 1) {
      this.getSessionCaisse(this.id)
    }
  }

  listTotalRegl = []
  envoitListeRegl(listReg) {
    this.listTotalRegl = listReg
    this.compteurChangeListReg++
  }

  controleInputs() {
    for (let key in this.erreurSessionCaisse) {
      this.erreurSessionCaisse[key] = ""
      if (document.getElementById(key) != null) {
        document.getElementById(key).classList.remove("border-erreur")
      }
    }
    var isValid = true
    for (let key in this.erreurSessionCaisse) {
      if (key == 'fondCaisseAdmin' || key == 'fondCaisseOuvrier') {
        if (this.sessionCaisse[key] < 0) {
          if (document.getElementById(key) != null) {
            document.getElementById(key).classList.add("border-erreur")
          }
          this.erreurSessionCaisse[key] = "Veuillez saisir un entier superieur à zéro"
          isValid = false
        }

      } else if (key == 'caisse' || key == 'utilisateur' || key == 'numero' || key == 'dateOuverture') {
        if (this.sessionCaisse[key] == "") {
          if (document.getElementById(key) != null) {
            document.getElementById(key).classList.add("border-erreur")
          }
          this.erreurSessionCaisse[key] = "Veuillez remplir ce champ"
          isValid = false
        }

      }
    }
    return isValid
  }

  isLoading = false
  ModifierSessionCaisse() {
    if (!this.controleInputs()) {
      this.notificationToast.showError("Veuillez remplir les champs obligatoires !")
      return
    }

    for (let key in this.sessionCaisse) {
      this.request[key] = this.sessionCaisse[key]
    }

    if (this.isLoading) {
      return
    }

    for (let key in this.sessionCaisse) {
      this.request[key] = this.sessionCaisse[key]
    }
    this.request.societe = this.informationGenerale.idSocieteCurrent
    this.isLoading = true
    this.sessionCaisseSer.update(this.id, this.request)
      .subscribe(
        res => {
          this.isLoading = false
          let resultat: any = res
          if (resultat.status) {
            this.router.navigate(["sessionCaisses/list"]);
            this.notificationToast.showSuccess("Votre session Caisse est bien modifiée !")
          }
        },
        error => {
          this.isLoading = false
          alert("Désole, ilya un problème de connexion internet")
        });

  }

  //Get parametre of sessionCaisse 
  allSessionCaisses = []
  allCaisses = []
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
            this.allCaisses = resultat.caisses
            this.allUtilisateurs = resultat.utilisateurs
            this.allSessionCaisses = resultat.sessionCaisses
            this.sessionCaisse.numero = resultat.numeroAutomatique
          }
        },
        error => {
          this.isLoading = false
          alert("Désole, ilya un problème de connexion internet")
        });
  }

  clickIsCloture(){
    if(this.sessionCaisse.cloture == "non"){
      this.sessionCaisse.dateCloture = formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.sessionCaisse.cloture = "oui"
    }else{
      this.sessionCaisse.dateCloture = ""
      this.sessionCaisse.cloture = "non"
    }
  }
  //Get Liste des reglements
  changeVar = false
  getListReglements() {
    if (this.sessionCaisse.dateCloture < this.sessionCaisse.dateOuverture) {
      this.notificationToast.showError("Votre date de cloture est inférieur à la date d'ouveture !")
      return
    }
    this.changeVar = true
  }

  //autocomplete caisse
  keySelectedCaisse = "libelle"
  objetCaisse = {
    libelle: "Libelle",
  }
  setCaisseID(id) {
    this.sessionCaisse.caisse = id
  }

  //open modal ajout Caisse
  isOpenModalAjoutElement = false
  idAjoutElementModal = ""
  typeElement
  closeModalAjoutElement() {
    this.isOpenModalAjoutElement = false
    this.getAllParametres()
  }
  openModalAjoutCaisse() {
    this.typeElement = this.fonctionPartagesService.titreOfModal.ajouterCaisse
    this.isOpenModalAjoutElement = true
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

  openModalAjoutUtilisateur() {
    this.typeElement = this.fonctionPartagesService.titreOfModal.ajouterUtilisateur
    this.isOpenModalAjoutElement = true
  }
}
