import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.scss']
})
export class AccordionItemComponent implements OnInit {


  @Input() table=[]
  showBody = false;
  objectKeys = Object.keys;

  itemsG = {
    client: "Client",
    numero: "Numero",
    dateOperation: "Date Opération",
    dateEcheance: "Date Echeance",
    libelle: "Libelle",
    modeReglement: "Mode Règlement",
    debit: "Débit",
    credit: "Crédit",
    solde: "Solde",
  };
  itemsVariableG = {
    client: "active",
    numero: "active",
    dateOperation: "active",
    dateEcheance: "active",
    libelle: "active",
    modeReglement: "Mode Règlement",
    debit: "active",
    credit: "active",
    solde: "active",
  };

  tabNumbers = ['solde','credit','debit']

  constructor(
    public fonctionPartagesService: FonctionPartagesService
  ) { }

  ngOnInit(): void {
    console.log(this.table);
  }

  nombresAvecEspaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  getDate(date) {
    if (date == "") { return"" }
    else {
      let dateVar = new Date(date).toLocaleDateString('fr')
      return dateVar

    }
  }
  toggle(){
     this.showBody =!this.showBody
  }
}
