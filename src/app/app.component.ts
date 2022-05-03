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
  form2 : FormGroup = new FormGroup ({});

  isCalculated = false;
  prima:number = 0;
  cesantias:number = 0;
  taxCesanti:number = 0;

  constructor(){
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      salary : new FormControl('', Validators.required),
      transAux : new FormControl('', Validators.required),
      startDate: new FormControl(new Date, Validators.required),
      endDate: new FormControl(new Date, Validators.required)
    }); 
    this.form2 = new FormGroup({
      tipeContract:new FormControl('', Validators.required),
      option : new FormControl('', Validators.required)
    }); 
  }


  contrato(event:any) {
    this.isSelect= true;

    let contract = this.form2.controls['tipeContract'].value;
    
    switch(contract){
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
      this.isCalculated = true;
      let days = (Date.parse(this.form.controls['endDate'].value) - Date.parse(this.form.controls['startDate'].value))/ (1000 * 3600 * 24);         
      this.Calulated(days);
    }
    
  }
  Calulated(days: number){
    console.log(days);
    //prima
    if(this.form.controls['transAux'].value == "false"){
      this.prima = this.form.controls['salary'].value / 360 * days;
      this.cesantias = this.form.controls['salary'].value / 360 * days;
    }else{
      this.prima = (this.form.controls['salary'].value + 117172) /360 * days;
      this.cesantias = (this.form.controls['salary'].value + 117172) / 360 * days;
    }
     //cesantias
     this.cesantias = this.form.controls['salary'].value / 360 * days;

     this.taxCesanti = days * 0.12 * this.cesantias / 360;
  }


}
