import { Component, OnInit, Input, SimpleChanges , Output, EventEmitter, AfterContentChecked,  VERSION, Renderer2 } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ChangeDetectorRef } from '@angular/core';
import { InformationsService } from 'src/app/services/informations.service';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';

@Component({
  selector: 'app-auto-complete-multiple',
  templateUrl: './auto-complete-multiple.component.html',
  styleUrls: ['./auto-complete-multiple.component.scss']
})
export class AutoCompleteMultipleComponent implements OnInit {

  constructor(
    public informationGenerale: InformationsService,
    public fonctionPartagesService: FonctionPartagesService,
    private renderer: Renderer2,
    private modalService: NgbModal,
    ) {
      this.renderer.listen('window', 'click', (e: Event) => {
        if(!this.mouseInFilter && this.isOpen) {
          setTimeout(() => {
             this.isOpen = false
          });
        }
      });
  }

  //start modal Fournisseur
  modalReference: NgbModalRef;
  closeResult = '';
  idFournisseur
  open(content, idFournisseur) {
    this.idFournisseur = idFournisseur
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
    });
  }
  
  JoinAndClose() {
    this.modalReference.close();
  }
  //end modal Fournisseur

  mouseInFilter = false

  onMouseOutFilter(e){
    this.mouseInFilter = false;
  }

  onMouseEnterFilter(e) {
    this.mouseInFilter = true;
  }

  @Output() addElementEvent = new EventEmitter<object>();
  @Output() getElementsEvent = new EventEmitter<string>();
  @Output() openAddElementEvent = new EventEmitter<Object>();
 
  autocompleteValue = ""
  autocompleteValue2 = ""
  
  idAutocomplete="autocomplete"
  idAutocompleteItems = "autocomplete-items"
  idAutocompleteUpDown = "autocomplete-up-down"
  idMyInput = "myInput"
  idAutocompleteTable = "autocomplete-table"
  idItemListAutocomplete = "item-list-autocomplete"


  @Input() modeLoading = false
  
  @Input() pageDetails = null

  @Input() bordureRed = false

  @Input() modeMultiSortie = false

  @Input() shemaMultiSortie = {id:"1", name:"article1", description:"description1"}

  @Input() isLoading = false

  @Input() idHtml = "1"

  @Input() keySelected="name"

  @Input() idSelected=""

  @Input() objet ={name:"article1", description:"description1", categorie:"categorie1"}
  
  @Input() sendMode2Parametres = "non"

  @Input() parametres2
  
  items = {}
  itemsVariable = {}

  @Input()itemsNumberSimple = {}
  @Input()itemsNumberQuantite = {}

  isOpen = false

  @Input() articles:any = []

  openAddElement(){
    var newArticles = this.articles.filter(x => x.isCheckedAutocomplete )
    var listIds = []
    newArticles.filter(x => {
      listIds.push(x.id)
    })

    this.openAddElementEvent.emit(listIds);
  }

  id="myInput"
  articlesFilter=[]

  objectKeys = Object.keys;

  ngOnInit(): void {
    this.idAutocomplete += this.idHtml
    this.idAutocompleteItems += this.idHtml
    this.idAutocompleteUpDown += this.idHtml
    this.idMyInput += this.idHtml
    this.idAutocompleteTable += this.idHtml
    this.idItemListAutocomplete += this.idHtml

    var items = {}
    for(let key in this.objet){
      items[key] = "active"
      this.itemsVariable[key] = "active"
    } 
  
    this.items = items

    this.fonctionPartagesService.getValue().subscribe((value) => {
        if(this.idAutocompleteItems != value){
          setTimeout(() => {
            this.isOpen = false
          })
        }
    });
  }

  currentFocus = -1;

  focusoutInput(){ 
     if(!this.mouseInFilter && this.isOpen) {
      setTimeout(() => {
        
        if(this.autocompleteValue === ""){
          this.setValeurNull()
          return
        }
        
        this.isOpen = false

      })
    }
  }

  setValeurNull(){
    if(this.autocompleteValue == ""){
      this.currentFocus = -1;
      this.setArticle("")
      this.resetList()
    }
  }

  clickSearch(){
    setTimeout( () => {
      this.isOpen = !this.isOpen
      setTimeout( () => {
        if(this.isOpen){
          document.getElementById(this.idMyInput).focus();
          document.getElementById(this.idMyInput).onselect;
          this.fonctionPartagesService.setValue(this.idAutocompleteItems)
        }
      })
    },30)
  }

  clickInList = false
  
  resetClassList(){
    var elementsItems = document.getElementsByClassName('autocomplete-items-active')
    
    for(let i = 0; i < elementsItems.length; i++){
      if(elementsItems[i].id != this.idAutocompleteItems){
        elementsItems[i].setAttribute("class","autocomplete-items")
      }
    }
    var elementsItems2 = document.getElementsByClassName('autocomplete-items')
  }

  clickkeydown(e){
    
    setTimeout( () => { 
        if(document.getElementById(this.idAutocompleteItems) == null){
          return
        }

        if(document.getElementById(this.idAutocompleteItems).getAttribute("class").indexOf("autocomplete-items-active") == -1){
          document.getElementById(this.idAutocompleteItems).classList.add("autocomplete-items-active")
          document.getElementById(this.idAutocompleteUpDown).classList.remove("fa-caret-down")
          document.getElementById(this.idAutocompleteUpDown).classList.remove("fa-caret-up")
        }

        var element:any = document.getElementById(this.idMyInput)
        this.autocompleteValue = element.value
    
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          this.currentFocus++;
          /*and and make the current item more visible:*/
          this.activeItem()
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          this.currentFocus--;
          /*and and make the current item more visible:*/
          this.activeItem()
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
             this.clickEntrer()      
        }else{
          this.filterElements()
          this.currentFocus = -1; 
        }

    }, 10 );
  
  }


  

  filterElements(){
    if(this.modeLoading){
      this.getElementsEvent.emit(this.autocompleteValue)
    }else{
      this.articlesFilter = this.articles.filter(x => this.getFilteration(x))
    }
  }

  getFilteration(x):Boolean{
    for(let key in this.objet){
      if (typeof x[key] === 'string' || x[key] instanceof String){
        if(x[key].toUpperCase().indexOf(this.autocompleteValue.toUpperCase()) > -1){
          return true
        }
      }
    }
    return false
  }

  clickEntrer(){
    if(document.getElementById(this.idAutocompleteItems) == null){
      return
    }

    var childrens= document.getElementById(this.idItemListAutocomplete).children
   
    this.setValeurNull()

    if(this.currentFocus > -1 && this.currentFocus < childrens.length){
      this.addElementEvent.emit(this.articlesFilter[this.currentFocus].id);
      this.setValueInput()
      this.resetList()
    }else{
      this.currentFocus = -1;
    }
  }

  setArticle(id){
    
    this.articles.forEach(x => {
      if(x.id == id){
        x.isCheckedAutocomplete = !x.isCheckedAutocomplete
      }
    })

    // if(this.sendMode2Parametres == "oui"){
    //   this.addElementEvent.emit({id:id, item:this.parametres2});
    // }else{
    //   this.addElementEvent.emit(id);
    // }
  }

  getListCochee(){
    return this.articlesFilter.filter( x => x.isCheckedAutocomplete ).length
  }

  clickItem(item){
    if(this.modeMultiSortie){
      var chaine = ""
      for(let key in this.shemaMultiSortie){
        chaine += " / "+this.shemaMultiSortie[key] + " : "+item[key]
      }
      chaine = chaine.replace("/","")
      this.autocompleteValue = chaine
    }else{
      this.autocompleteValue = item[this.keySelected]
    }

    this.autocompleteValue2 = this.autocompleteValue 
    this.setArticle(item.id);
    // this.resetList()
    for(let i = 0; i < this.articlesFilter.length; i++){
      if(this.articlesFilter[i].id == item.id){
        this.currentFocus = i
      }
    }

    this.activeItem()
  }

  resetList(){
    this.currentFocus = -1;
    this.articlesFilter = this.articles
  
    this.clickSearch()
  }

  setValueInput(){
    
    if(this.modeMultiSortie){
      var chaine = ""
      for(let key in this.shemaMultiSortie){
        chaine += " / "+this.shemaMultiSortie[key] + " : "+this.articlesFilter[this.currentFocus][key]
      }
      chaine = chaine.replace("/","")
      this.autocompleteValue = chaine
    }else{
      this.autocompleteValue = this.articlesFilter[this.currentFocus][this.keySelected]
    }

    this.autocompleteValue2 = this.autocompleteValue 
    //this.idSelected = this.articlesFilter[this.currentFocus].id
    // this.setArticle(this.articlesFilter[this.currentFocus].id);
  }


  activeItem(){
    var childrens= document.getElementById(this.idItemListAutocomplete).children
    if(this.currentFocus > -1 && this.currentFocus < childrens.length){
       for(let i = 0; i < childrens.length; i++){
           if(i == this.currentFocus){
             this.setValueInput()
             childrens[i].setAttribute("class","item-list-autocomplete autocomplete-active");
             //childrens[i].scrollIntoView();
             var table = document.getElementById(this.idAutocompleteTable);
             var topTable = table.getBoundingClientRect().top;
             var topLine = childrens[i].getBoundingClientRect().top;
           
             table.scrollTop += (topLine - topTable)
           }else{
             childrens[i].setAttribute("class","item-list-autocomplete");
           }
       }
    }else{
      if(childrens.length > 0){
        if(this.currentFocus == -1){
          this.currentFocus = 0;
        }else{
          this.currentFocus = childrens.length-1
        }
      }
    }
  }

  getStyleItemAutoComplete(id){
    if(id == this.idSelected){
      return "item-list-autocomplete autocomplete-active"
    }else{
      return "item-list-autocomplete"
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.articlesFilter=this.articles
    var listFiltree = this.articles.filter(x => x.id == this.idSelected)
    
    if(this.idSelected == undefined || this.idSelected == null || this.idSelected.length == 0){
      this.idSelected = ""
    }


    setTimeout( () => { 
      
      if(listFiltree.length > 0){
        this.autocompleteValue = listFiltree[0][this.keySelected]
        
        for(let i = 0; i < this.articlesFilter.length; i++){
          if(this.articlesFilter[i].id == this.idSelected){
            this.currentFocus = i
          }
        }

        if(this.modeMultiSortie){
          var chaine = ""
          for(let key in this.shemaMultiSortie){
            chaine += " / "+this.shemaMultiSortie[key] + " : "+listFiltree[0][key]
          }
          chaine = chaine.replace("/","")
          this.autocompleteValue = chaine
        }else{
          this.autocompleteValue = listFiltree[0][this.keySelected]
        }


      }else{
        this.autocompleteValue = ""
        this.currentFocus = -1;
        if(document.getElementById(this.idItemListAutocomplete) != null){
          var childrens= document.getElementById(this.idItemListAutocomplete).children
          for(let i = 0; i < childrens.length; i++){
              childrens[i].setAttribute("class","item-list-autocomplete");
          }
        }
      }

      this.autocompleteValue2 = this.autocompleteValue
    },10)

  }

  detailsElement(){
    
  }

}
