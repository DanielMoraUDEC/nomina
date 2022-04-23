import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  title:string = "";
  isSelect = false;
  definition = "";

  contrato(event:any) {
    this.isSelect= true;
    switch(event.value){
      case '1': this.title = "Contrato a Término Fijo";
      this.tipe1();
      break;
      case '2': this.title = "Contrato a término indefinido";
      this.tipe2();
      break;
      case '3': this.title = "Contrato de Obra o labor";
      this.tipe3();
      break;
      case '4': this.title = "Contrato civil por prestación de servicios";
      this.tipe4();
      break;
      case '5': this.title = "Contrato de aprendizaje";
      this.tipe5();
      break;
    }
  }

  tipe1(){
    this.definition = "fffffff";
  }
  tipe2(){
    
  }
  tipe3(){
    
  }
  tipe4(){
    
  }
  tipe5(){
    
  }


}
