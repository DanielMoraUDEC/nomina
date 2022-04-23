import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  title:string = "";
  isSelect = false;
  definition = "";
  form : FormGroup = new FormGroup ({});

  constructor(){
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      salary : new FormControl('', Validators.required),
      transAux : new FormControl('', Validators.required)
    }); 
  }


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
    this.definition = "Este tipo de contrato tiene una duración entre un día y tres años y puede ser renovado hasta por tres veces su permanencia. El empleado goza de todas las prestaciones sociales establecidas por la ley (cesantías, vacaciones y primas) y para su finalización es necesario un preaviso de 30 días." + "\n" +
     "Las deducciones por nómina de este tipo de contrato son iguales a las de cualquier contrato de vínculo laboral. La vinculación puede ser directamente con la empresa o a través de temporales.";
  }
  tipe2(){
    
  }
  tipe3(){
    
  }
  tipe4(){
    
  }
  tipe5(){
    
  }

  calcular(){
    if(this.form.valid){
      console.log(this.form.value);
    }
    
  }


}
