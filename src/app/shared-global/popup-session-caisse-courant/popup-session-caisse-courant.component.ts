import { Component, OnInit, Input, ViewChild, SimpleChanges, ElementRef } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
//import { UserService } from '../../../services/user/user.service';
import { Router, Event } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';
import { InformationsService } from 'src/app/services/informations.service';

@Component({
  selector: 'app-popup-session-caisse-courant',
  templateUrl: './popup-session-caisse-courant.component.html',
  styleUrls: ['./popup-session-caisse-courant.component.scss']
})
export class PopupSessionCaisseCourantComponent implements OnInit {

  classCss = "modalAjoutElement"
  
  @Input() id=""
  @Input() listeSessionCaisses = []
  @Input() isOpen = false
  @Output() closeModal = new EventEmitter<string>();

  constructor(  private router:Router,  
    private http: HttpClient,
    public fonctionPartagesService:FonctionPartagesService,
    public informationsService:InformationsService) { }

  setSession(item){
    var list = []
    list.push(item)
    this.informationsService.setSessionCaisseCurrent(list)
    this.closePopup()
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

}
