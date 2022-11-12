import { Component, OnInit, Input, ViewChild, SimpleChanges, ElementRef } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
//import { UserService } from '../../../services/user/user.service';
import { Router, Event } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';

@Component({
  selector: 'app-popup-choix-transfert-document',
  templateUrl: './popup-choix-transfert-document.component.html',
  styleUrls: ['./popup-choix-transfert-document.component.scss']
})
export class PopupChoixTransfertDocumentComponent implements OnInit {

  classCss = "modalAjoutElement"
  
  @Input()id=""
  @Input()isOpen = false

  @Input()type = "vente"
 
  @Output() closeModal = new EventEmitter<string>();
 
  constructor(
    private router:Router,  
    private http: HttpClient,
    public fonctionPartagesService:FonctionPartagesService){ 
  
  }

  ngOnInit(): void {
  }

  openPopup() {
    this.classCss = "modalAjoutElement modalAjoutElement-open"
  }

  closePopup(){
    this.closeModal.emit();
    this.classCss = "modalAjoutElement"
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.isOpen){
      this.openPopup()
    }
  }

  goBonLivraison(){
    this.router.navigate(['/bonLivraisonCommandeTransfert/'+this.id])
  }

  goVenteComptoire(){
    this.router.navigate(['/venteComptoireCommandeTransfert/'+this.id])
  }

  goBonReception(){
    this.router.navigate(['/bonReceptionTransfert/'+this.id])
  }

  goAchatComptoire(){
    this.router.navigate(['/achatComptoireTransfert/'+this.id])
  }


}
