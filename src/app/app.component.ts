import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface tabla{
  descripcion:string,
  valor:number
}

interface tablaNomina{
  baseSal: number,
  baseSalPlusTransAux: number,
  baseSalPlusExtras: number,
  baseSalPlusHolidays: number,
  salMinusPension: number,
  salMinusEPS: number,
  totalSal: number
}

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
  form0: FormGroup = new FormGroup ({});
  form2 : FormGroup = new FormGroup ({});

  isCalculated = false;
  prima:number = 0;
  cesantias:number = 0;
  taxCesanti:number = 0;
  liquidacion:boolean = false;
  nomina:boolean = false;

  selection: string = "";

  baseSalPlusExtras = 0;  
  baseSal = 0;
  baseSalPlusHolidays = 0;
  baseSalPlusTransAux = 0;
  salMinusPension = 0;
  salMinusEPS = 0;

  contIndxTable = 0;

  lista:tabla[] = [];

  listaNomina:tablaNomina[] = [];

  constructor(){
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      salary : new FormControl('', Validators.required),
      transAux : new FormControl('', Validators.required),
      startDate: new FormControl(new Date, Validators.required),
      endDate: new FormControl(new Date, Validators.required),
    }); 

    this.form0 = new FormGroup({
      salary : new FormControl('', Validators.required),
      transAux : new FormControl('', Validators.required),
      startDate: new FormControl(new Date, Validators.required),
      endDate: new FormControl(new Date, Validators.required),
      daysNormal: new FormControl('', [Validators.required, Validators.min(1)]),
      daysNight: new FormControl(''),
      hrsExtraNight: new FormControl(''),
      hrsExtraDay: new FormControl(''),
      workOnHolidaysDay: new FormControl(''),
      workOnHolidaysNight: new FormControl('')
    });

    this.form2 = new FormGroup({
      tipeContract:new FormControl('', Validators.required),
      option : new FormControl('', Validators.required)
    }); 
  }


  contrato(event:any) {
    this.isSelect= true;

    if(this.form2.controls['option'].value == '1'){
      this.liquidacion = false;
      this.nomina = true;
      this.selection = "nomina";
    }else{
      this.liquidacion = true;
      this.nomina = false;
      this.selection = "liquidacion";
    }

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
    this.definition = "El contrato a término indefinido no tiene estipulada una fecha de culminación de la obligación contractual, cuya duración no haya sido" + "\n" +
     "expresamente estipulada o no resulte de la naturaleza de la obra o servicio que debe ejecutarse. Puede hacerse por escrito o de forma verbal.";
  }
  tipe3(){
    this.definition = "Es un contrato que se realiza para una labor específica y termina en el momento que la obra llegue a su fin. Este tipo de vinculación es característica de trabajos de construcción, de universidades y colegios." + "\n" +
     "Este contrato es igual en términos de beneficios y descuentos a los contratos indefinidos y definidos, por ser un contrato laboral.";
  }
  tipe4(){
    this.definition = "Este tipo de contrato tiene una duración entre un día y tres años y puede ser renovado hasta por tres veces su permanencia. El empleado goza de todas las prestaciones sociales establecidas por la ley (cesantías, vacaciones y primas) y para su finalización es necesario un preaviso de 30 días." + "\n" +
     "Las deducciones por nómina de este tipo de contrato son iguales a las de cualquier contrato de vínculo laboral. La vinculación puede ser directamente con la empresa o a través de temporales.";
  }
  tipe5(){
    this.definition = "Es aquel mediante el cual una persona natural realiza formación teórica práctica en una entidad autorizada, a cambio de que la empresa proporcione los medios para adquirir formación profesional requerida en el oficio, actividad u ocupación, por cualquier" + "\n" +
     "tiempo determinado no superior a dos (2) años, y por esto recibe un apoyo de sostenimiento mensual, que sea como mínimo en la fase lectiva el equivalente al 50% de" + "\n" + 
     "un (1) salario mínimo mensual vigente y durante la fase práctica será equivalente al setenta y cinco por ciento (75%) de un salario mínimo mensual legal vigente.";
  }

  calcular(){
    if(this.form.valid || this.form0.valid){
      this.isCalculated = true;
      
      switch(this.selection){
        case "liquidacion":
          let days = (Date.parse(this.form.controls['endDate'].value) - Date.parse(this.form.controls['startDate'].value))/ (1000 * 3600 * 24);
          this.Calulated(days);
          break;
        case "nomina":
          this.NominaCalculated();
          break;
      }
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


     let obj:tabla = {
       descripcion: "prima",
       valor: this.prima
     };

     this.lista.push(obj);
     this.lista.push(obj);
     this.lista.push(obj);
     this.lista.push(obj);
     this.lista.push(obj);
     this.lista.push(obj);
     this.lista.push(obj);

     this.lista.push(obj);
     this.lista.push(obj);
     this.lista.push(obj);
     this.lista.push(obj);

     this.lista.push(obj);

  }

  NominaCalculated(){
    
    let tot = 0;

    this.contIndxTable += 1;

    if(this.form0.controls['transAux'].value == 'false'){
      
      this.baseSal = this.form0.controls['daysNormal'].value * 33333.33 + (this.form0.controls['daysNight'].value * (33333.33 + 5625)); 
      this.baseSal = (this.form0.controls['salary'].value - this.baseSal) + this.baseSal;

      this.baseSalPlusExtras = ((this.baseSal * 1.75 * this.form0.controls['hrsExtraNight'].value) / 240) + ((this.baseSal * 1.25 * this.form0.controls['hrsExtraDay'].value) / 240)
    
      this.baseSalPlusHolidays = (this.form0.controls['workOnHolidaysDay'].value * 8333.33) + (this.form0.controls['workOnHolidaysNight'].value * 10416.67)
    
      this.baseSalPlusTransAux = 0;

      this.salMinusPension = this.baseSal * 0.04;

      this.salMinusEPS = this.baseSal * 0.04;

      tot = this.baseSal + ((this.baseSal * 1.75 * this.form0.controls['hrsExtraNight'].value) / 240) + ((this.baseSal * 1.25 * this.form0.controls['hrsExtraDay'].value) / 240) + (this.form0.controls['workOnHolidaysDay'].value * 8333.33) + (this.form0.controls['workOnHolidaysNight'].value * 10416.67)
    
      tot = tot - (this.salMinusEPS + this.salMinusPension);

    }else{
      this.baseSal = this.form0.controls['daysNormal'].value * 33333.33 + (this.form0.controls['daysNight'].value * (33333.33 + 5625)); 
      this.baseSal = (this.form0.controls['salary'].value - this.baseSal) + this.baseSal;
      
      this.baseSalPlusExtras = ((this.baseSal * 1.75 * this.form0.controls['hrsExtraNight'].value) / 240) + ((this.baseSal * 1.25 * this.form0.controls['hrsExtraDay'].value) / 240)// + (this.form.controls['salary'].value * ) 
    
      this.baseSalPlusHolidays = (this.form0.controls['workOnHolidaysDay'].value * 8333.33) + (this.form0.controls['workOnHolidaysNight'].value * 10416.67)
    
      this.baseSalPlusTransAux = 117172;

      this.salMinusPension = this.baseSal * 0.04;

      this.salMinusEPS = this.baseSal * 0.04;

      tot = this.baseSal + 117172 + (this.form0.controls['workOnHolidaysDay'].value * 8333.33) + (this.form0.controls['workOnHolidaysNight'].value * 10416.67) + ((this.baseSal * 1.75 * this.form0.controls['hrsExtraNight'].value) / 240) + ((this.baseSal * 1.25 * this.form0.controls['hrsExtraDay'].value) / 240)

      tot = tot - (this.salMinusEPS + this.salMinusPension);
    }

    let obj:tablaNomina = {
      baseSal: this.baseSal,
      baseSalPlusExtras: this.baseSalPlusExtras,
      baseSalPlusHolidays: this.baseSalPlusHolidays,
      baseSalPlusTransAux: this.baseSalPlusTransAux,
      salMinusPension: this.salMinusPension,
      salMinusEPS: this.salMinusEPS,
      totalSal: tot
    };

    if(this.contIndxTable > 1){
      this.listaNomina.splice(0, this.listaNomina.length);
    }

    this.listaNomina.push(obj);
    
  }
}
