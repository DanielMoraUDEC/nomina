import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface tabla {
  descripcion: string,
  valor: string
}

interface tablaNomina {
  baseSal: number,
  baseCotizacion: number,
  baseSalPlusTransAux: number,
  baseSalPlusExtras: number,
  baseSalPlusHolidays: number,
  salMinusPension: number,
  salMinusEPS: number,
  totalSal: number
}

interface tablaNominaServ {
  impuestos: number,
  uvt: number,
  uvtRetention: number,
  retefuente: number,
  reteICA: number,
  total: number
}

interface tablaPrestaciones {
  arl: number,
  pensiones: number,
  caja: number,
  cesantias: number,
  intereses: number,
  prima: number,
  vacaciones: number,
  totPrestaciones: number
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title: string = "";
  isSelect = false;
  definition = "";
  form: FormGroup = new FormGroup({});
  form0: FormGroup = new FormGroup({});
  form1: FormGroup = new FormGroup({});
  form2: FormGroup = new FormGroup({});
  form3: FormGroup = new FormGroup({});

  isCalculated = false;
  prima: number = 0;
  cesantias: number = 0;
  taxCesanti: number = 0;
  vacations: number = 0;
  liquidacion: boolean = false;
  listaTotales: tabla[] = [];
  nomina: boolean = false;
  selection: string = "";
  showCalculates: boolean = false;
  showCalculates2: boolean = false;
  otherspays: boolean = false;

  baseSalPlusExtras = 0;
  baseSal = 0;
  baseSalPlusHolidays = 0;
  baseSalPlusTransAux = 0;
  salMinusPension = 0;
  salMinusEPS = 0;

  invalidContract = false;

  arl = 0;
  pensiones = 0;
  caja = 0;
  vacaciones = 0;
  intereses = 0;
  totPrestaciones = 0;
  disabled: boolean = true;
  contIndxTable = 0;

  termFijo = false;
  termIndf = false;
  serv = false;
  labor = false;
  aprend = false;

  lista: tabla[] = [];

  listaNomina: any[] = [];
  listaPrestaciones: any[] = [];
  listaNominaServ: any[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      salary: new FormControl(0, Validators.required),
      transAux: new FormControl(0, Validators.required),
      startDate: new FormControl(new Date, Validators.required),
      endDate: new FormControl(new Date, Validators.required),
      hours1: new FormControl(0),
      hours2: new FormControl(0),
      hours3: new FormControl(0),
      hours4: new FormControl(0),
    });

    this.form0 = new FormGroup({
      salary: new FormControl('', Validators.required),
      transAux: new FormControl('', Validators.required),
      startDate: new FormControl(new Date, Validators.required),
      endDate: new FormControl(new Date, Validators.required),
      daysNormal: new FormControl('', [Validators.required, Validators.min(1)]),
      daysNight: new FormControl(''),
      hrsExtraNight: new FormControl(''),
      hrsExtraDay: new FormControl(''),
      workOnHolidaysDay: new FormControl(''),
      workOnHolidaysNight: new FormControl('')
    });

    this.form1 = new FormGroup({
      salary: new FormControl('', Validators.required),
      transAux: new FormControl('', Validators.required),
      startDate: new FormControl(new Date, Validators.required),
      endDate: new FormControl(new Date, Validators.required),
      daysNormal: new FormControl('', [Validators.required, Validators.min(1)]),
      daysNight: new FormControl(''),
      hrsExtraNight: new FormControl(''),
      hrsExtraDay: new FormControl(''),
      workOnHolidaysDay: new FormControl(''),
      workOnHolidaysNight: new FormControl(''),
      arlLevel: new FormControl('', [Validators.required, Validators.min(1), Validators.max(6)])
    });

    this.form2 = new FormGroup({
      tipeContract: new FormControl('', Validators.required),
      option: new FormControl('', Validators.required)
    });

    this.form3 = new FormGroup({
      startDate: new FormControl(new Date, Validators.required),
      endDate: new FormControl(new Date, Validators.required),
      faseType: new FormControl('', Validators.required)
    });
  }


  contrato(event: any) {
    this.isSelect = true;

    if (this.form2.controls['option'].value == '1') {
      this.liquidacion = false;
      this.nomina = true;
      this.selection = "nomina";
    }
    if (this.form2.controls['option'].value == '2') {
      this.liquidacion = true;
      this.nomina = false;
      this.selection = "liquidacion";
    }

    let contract = this.form2.controls['tipeContract'].value;
    switch (contract) {
      case '1': this.title = "Contrato a Término Fijo";
        this.showCalculates = true;
        this.showCalculates2 = false;
        this.tipe1();
        this.termFijo = true;
        this.termIndf = false;
        this.aprend = false;
        this.labor = false;
        this.serv = false;
        break;
      case '2': this.title = "Contrato a término indefinido";
        this.showCalculates = true;
        this.showCalculates2 = false;
        this.tipe2();
        this.termFijo = false;
        this.termIndf = true;
        this.aprend = false;
        this.labor = false;
        this.serv = false;
        break;
      case '3': this.title = "Contrato de Obra o labor";
        this.showCalculates = false;
        this.showCalculates2 = true;
        this.tipe3();
        this.termFijo = false;
        this.termIndf = false;
        this.aprend = false;
        this.labor = true;
        this.serv = false;
        break;
      case '4': this.title = "Contrato civil por prestación de servicios";
        this.showCalculates = false;
        this.showCalculates2 = true;
        this.tipe4();
        this.termFijo = false;
        this.termIndf = false;
        this.aprend = false;
        this.labor = false;
        this.serv = true;
        break;
      case '5': this.title = "Contrato de aprendizaje";
        this.showCalculates = false;
        this.showCalculates2 = true;
        this.tipe5();
        this.termFijo = false;
        this.termIndf = false;
        this.aprend = true;
        this.labor = false;
        this.serv = false;
        break;
    }
  }

  tipe1() {
    this.definition = "Este tipo de contrato tiene una duración entre un día y tres años y puede ser renovado hasta por tres veces su permanencia. El empleado goza de todas las prestaciones sociales establecidas por la ley (cesantías, vacaciones y primas) y para su finalización es necesario un preaviso de 30 días." + "\n" +
      "Las deducciones por nómina de este tipo de contrato son iguales a las de cualquier contrato de vínculo laboral. La vinculación puede ser directamente con la empresa o a través de temporales.";
  }
  tipe2() {
    this.definition = "El contrato a término indefinido no tiene estipulada una fecha de culminación de la obligación contractual, cuya duración no haya sido" + "\n" +
      "expresamente estipulada o no resulte de la naturaleza de la obra o servicio que debe ejecutarse. Puede hacerse por escrito o de forma verbal.";
  }
  tipe3() {
    this.definition = "Es un contrato que se realiza para una labor específica y termina en el momento que la obra llegue a su fin. Este tipo de vinculación es característica de trabajos de construcción, de universidades y colegios." + "\n" +
      "Este contrato es igual en términos de beneficios y descuentos a los contratos indefinidos y definidos, por ser un contrato laboral.";
  }
  tipe4() {
    this.definition = "Este tipo de contrato tiene una duración entre un día y tres años y puede ser renovado hasta por tres veces su permanencia. El empleado goza de todas las prestaciones sociales establecidas por la ley (cesantías, vacaciones y primas) y para su finalización es necesario un preaviso de 30 días." + "\n" +
      "Las deducciones por nómina de este tipo de contrato son iguales a las de cualquier contrato de vínculo laboral. La vinculación puede ser directamente con la empresa o a través de temporales.";
  }
  tipe5() {
    this.definition = "Es aquel mediante el cual una persona natural realiza formación teórica práctica en una entidad autorizada, a cambio de que la empresa proporcione los medios para adquirir formación profesional requerida en el oficio, actividad u ocupación, por cualquier" + "\n" +
      "tiempo determinado no superior a dos (2) años, y por esto recibe un apoyo de sostenimiento mensual, que sea como mínimo en la fase lectiva el equivalente al 50% de" + "\n" +
      "un (1) salario mínimo mensual vigente y durante la fase práctica será equivalente al setenta y cinco por ciento (75%) de un salario mínimo mensual legal vigente.";
  }

  calcular() {
    if (this.form.valid || this.form0.valid || this.form1.valid) {
      this.isCalculated = true;

      switch (this.selection) {
        case "liquidacion":
          let days = (Date.parse(this.form.controls['endDate'].value) - Date.parse(this.form.controls['startDate'].value)) / (1000 * 3600 * 24);
          this.Calulated(days);
          break;
        case "nomina":
          this.NominaCalculated();
          break;
      }
    }
  }

  Calulated(days: number) {
    console.log(days);
    //prima
    this.listaTotales = [];
    if (this.form.controls['transAux'].value == "false") {
      this.prima = this.form.controls['salary'].value / 360 * days;
      this.cesantias = this.form.controls['salary'].value / 360 * days;
    } else {
      this.prima = (this.form.controls['salary'].value + 117172) / 360 * days;
      this.cesantias = (this.form.controls['salary'].value + 117172) / 360 * days;
    }
    //cesantias
    this.cesantias = this.form.controls['salary'].value / 360 * days;

    this.taxCesanti = days * 0.12 * this.cesantias / 360;

    this.vacations = this.form.controls['salary'].value / 720 * days;


    if (this.form.controls['hours1'].value > 0 || this.form.controls['hours2'].value > 0 || this.form.controls['hours3'].value > 0 || this.form.controls['hours4'].value > 0) {

      let horas1 = this.form.controls['salary'].value / 30 / 8 * 1.25 * this.form.controls['hours1'].value;
      let horas2 = (this.form.controls['salary'].value / 30 / 8 * 1.75 * this.form.controls['hours2'].value) + (this.form.controls['salary'].value / 30 / 8 * 0.35 * this.form.controls['hours2'].value);
      let horas3 = this.form.controls['salary'].value / 30 / 8 * 2 * this.form.controls['hours3'].value;
      let horas4 = (this.form.controls['salary'].value / 30 / 8 * 2.5 * this.form.controls['hours4'].value) + (this.form.controls['salary'].value / 30 / 8 * 2.1 * this.form.controls['hours4'].value);

      this.listaTotales = [{
        descripcion: "Cesantías",
        valor: this.cesantias.toFixed(2)
      }, {
        descripcion: "Intereses Sobre las cesantías",
        valor: this.taxCesanti.toFixed(2)
      }, {
        descripcion: "Prima de servicios",
        valor: this.prima.toFixed(2)
      }, {
        descripcion: "Vacaciones",
        valor: this.vacations.toFixed(2)
      }, {
        descripcion: "Horas extra diurnas",
        valor: horas1.toFixed(2)
      }, {
        descripcion: "Horas extra nocturnas(Incluido recargo nocturno)",
        valor: horas2.toFixed(2)
      }
        , {
        descripcion: "Horas extra diurnas dominicales",
        valor: horas3.toFixed(2)
      }, {
        descripcion: "Horas extra nocturnas dominicales(Incluido recargo nocturno)",
        valor: horas4.toFixed(2)
      }];

    } else {
      this.listaTotales = [{
        descripcion: "Cesantías",
        valor: this.cesantias.toFixed(2)
      }, {
        descripcion: "Intereses Sobre las cesantías",
        valor: this.taxCesanti.toFixed(2)
      }, {
        descripcion: "Prima de servicios",
        valor: this.prima.toFixed(2)
      }, {
        descripcion: "Vacaciones",
        valor: this.vacations.toFixed(2)
      }];

    }

    this.lista = [];
    this.listaTotales.forEach(element => {
      this.lista.push(element);
    });


  }

  NominaCalculated() {

    let contract = this.form2.controls['tipeContract'].value;
    switch (contract) {
      case '1': this.title = "Contrato a Término Fijo";
        this.NominaFuncs();
        break;
      case '2': this.title = "Contrato a término indefinido";
        this.NominaFuncs();
        break;
      case '3': this.title = "Contrato de Obra o labor";
        this.NominaFuncs();
        break;
      case '4': this.title = "Contrato civil por prestación de servicios";
        this.NominaServ();
        break;
      case '5': this.title = "Contrato de aprendizaje";
        this.NominaApredizaje();
        break;
    }
  }

  NominaApredizaje(){

    this.contIndxTable += 1;

    let days = (Date.parse(this.form3.controls['endDate'].value) - Date.parse(this.form3.controls['startDate'].value)) / (1000 * 3600 * 24);
    console.log(days);
    if(days > 730)
    {
      this.invalidContract = true;
      this.title = "El contrato es inválido";
      this.definition = "El tipo de contrato seleccionado legalmente no está constituido para durar más de dos años"
      + " por lo tanto los datos ingresados hacen que no sea válido para el cálculo de nómina. Si desea conocer más"
      + " sobre este tipo de contrato visite la siguiente página:";

      let obj: tablaNomina = {
        baseSal: 0,
        baseCotizacion: 0,
        baseSalPlusExtras: 0,
        baseSalPlusHolidays: 0,
        baseSalPlusTransAux: 0,
        salMinusPension: 0,
        salMinusEPS: 0,
        totalSal: 0
      };

      if (this.contIndxTable > 1) {
        this.listaNomina.splice(0, this.listaNomina.length);
      }
      
      this.listaNomina.push(obj);
    }
    else
    {
      let faseType = this.form3.controls['faseType'].value
      console.log(faseType);

      if(faseType == "true"){
        this.baseSal = days * 33333.3 * 0.5;
      }

      if(faseType == "false"){
        this.baseSal = days * 33333.3;
        console.log(this.baseSal)
      }

      let obj: tablaNomina = {
        baseSal: this.baseSal,
        baseCotizacion: 0,
        baseSalPlusExtras: 0,
        baseSalPlusHolidays: 0,
        baseSalPlusTransAux: 0,
        salMinusPension: 0,
        salMinusEPS: 0,
        totalSal: 0
      };

      if (this.contIndxTable > 1) {
        this.listaNomina.splice(0, this.listaNomina.length);
      }
      
      this.listaNomina.push(obj);
    }
  }

  NominaServ() {
    let tot = 0;
    let subTot = 0;

    this.contIndxTable += 1;

    if (this.form1.controls['transAux'].value == 'false') {

      this.baseSal = this.form1.controls['daysNormal'].value * 33333.33 + (this.form1.controls['daysNight'].value * (33333.33 + 5625));
      this.baseSal = (this.form1.controls['salary'].value - this.baseSal) + this.baseSal;

      this.baseSalPlusExtras = ((this.baseSal * 1.75 * this.form0.controls['hrsExtraNight'].value) / 240) + ((this.baseSal * 1.25 * this.form1.controls['hrsExtraDay'].value) / 240)

      this.baseSalPlusHolidays = (this.form1.controls['workOnHolidaysDay'].value * 8333.33) + (this.form1.controls['workOnHolidaysNight'].value * 10416.67)

      this.baseSalPlusTransAux = 0;

      this.salMinusPension = this.baseSal * 0.4 * 0.16;

      this.salMinusEPS = this.baseSal * 0.4 * 0.125;

      subTot = this.baseSal + ((this.baseSal * 1.75 * this.form1.controls['hrsExtraNight'].value) / 240) + ((this.baseSal * 1.25 * this.form1.controls['hrsExtraDay'].value) / 240) + (this.form1.controls['workOnHolidaysDay'].value * 8333.33) + (this.form1.controls['workOnHolidaysNight'].value * 10416.67)

      tot = subTot - (this.salMinusEPS + this.salMinusPension);

    } else {
      this.baseSal = this.form1.controls['daysNormal'].value * 33333.33 + (this.form1.controls['daysNight'].value * (33333.33 + 5625));
      this.baseSal = (this.form1.controls['salary'].value - this.baseSal) + this.baseSal;

      this.baseSalPlusExtras = ((this.baseSal * 1.75 * this.form1.controls['hrsExtraNight'].value) / 240) + ((this.baseSal * 1.25 * this.form1.controls['hrsExtraDay'].value) / 240)// + (this.form.controls['salary'].value * ) 

      this.baseSalPlusHolidays = (this.form1.controls['workOnHolidaysDay'].value * 8333.33) + (this.form1.controls['workOnHolidaysNight'].value * 10416.67)

      this.baseSalPlusTransAux = 117172;

      this.salMinusPension = this.baseSal * 0.4 * 0.16;

      this.salMinusEPS = this.baseSal * 0.4 * 0.125;

      subTot = this.baseSal + 117172 + (this.form1.controls['workOnHolidaysDay'].value * 8333.33) + (this.form1.controls['workOnHolidaysNight'].value * 10416.67) + ((this.baseSal * 1.75 * this.form1.controls['hrsExtraNight'].value) / 240) + ((this.baseSal * 1.25 * this.form1.controls['hrsExtraDay'].value) / 240)

      tot = subTot - (this.salMinusEPS + this.salMinusPension);
    }

    // parafiscales - prestaciones
    let arlLevel = this.form1.controls['arlLevel'].value;
    switch (arlLevel) {
      case 1:
        this.arl = subTot * 0.4 * 0.0052;
        break;
      case 2:
        this.arl = subTot * 0.4 * 0.01044;
        break;
      case 3:
        this.arl = subTot * 0.4 * 0.02436;
        break;
      case 4:
        this.arl = subTot * 0.4 * 0.04350;
        break;
      case 5:
        this.arl = subTot * 0.4 * 0.06960;
        break;
      default:
        this.arl = subTot * 0.4 * 0.06960;
        break;
    }

    this.pensiones = (subTot - this.baseSalPlusTransAux) * 0.12;
    this.caja = (subTot - this.baseSalPlusTransAux) * 0.04;
    this.cesantias = subTot * 0.0833;
    this.intereses = subTot * 0.01;
    this.prima = subTot * 0.0833;
    this.vacaciones = (subTot - this.baseSalPlusTransAux - this.baseSalPlusExtras) * 0.0417;
    this.totPrestaciones = this.arl + this.pensiones + this.caja + this.cesantias + this.intereses + this.prima + this.vacaciones;

    let impuestos = tot - this.salMinusPension - this.salMinusEPS - this.arl;

    let uvt = (tot - this.salMinusPension - this.salMinusEPS - this.arl) / 38004
    let uvtRetention = 0;

    if (uvt > 0 && uvt < 95) {
      uvtRetention = 0;
    }

    if (uvt > 95 && uvt < 150) {
      uvtRetention = (uvt - 95) * 0.19;
    }

    if (uvt > 150 && uvt < 360) {
      uvtRetention = (uvt - 150) * 0.28 + 10;
    }

    if (uvt > 360) {
      uvtRetention = (uvt - 360) * 0.33 + 69;
    }

    let obj: tablaNomina = {
      baseSal: this.baseSal,
      baseCotizacion: this.baseSal * 0.4,
      baseSalPlusExtras: this.baseSalPlusExtras,
      baseSalPlusHolidays: this.baseSalPlusHolidays,
      baseSalPlusTransAux: this.baseSalPlusTransAux,
      salMinusPension: this.salMinusPension,
      salMinusEPS: this.salMinusEPS,
      totalSal: tot - uvtRetention * 38004 - impuestos * 0.0069
    };

    let obj2: tablaPrestaciones = {
      arl: this.arl,
      pensiones: this.pensiones,
      caja: this.caja,
      cesantias: this.cesantias,
      intereses: this.intereses,
      prima: this.prima,
      vacaciones: this.vacaciones,
      totPrestaciones: this.totPrestaciones
    }

    let obj3: tablaNominaServ = {
      impuestos: impuestos,
      uvt: uvt,
      uvtRetention: uvtRetention,
      retefuente: uvtRetention * 38004,
      reteICA: impuestos * 0.0069,
      total: tot - uvtRetention * 38004 - impuestos * 0.0069
    }

    if (this.contIndxTable > 1) {
      this.listaNomina.splice(0, this.listaNomina.length);
      this.listaPrestaciones.splice(0, this.listaPrestaciones.length);
      this.listaNominaServ.splice(0, this.listaNominaServ.length);
    }

    this.listaNomina.push(obj);
    this.listaPrestaciones.push(obj2);
    this.listaNominaServ.push(obj3);
  }

  NominaFuncs() {
    let tot = 0;
    let subTot = 0;

    this.contIndxTable += 1;

    if (this.form0.controls['transAux'].value == 'false') {

      this.baseSal = this.form0.controls['daysNormal'].value * 33333.33 + (this.form0.controls['daysNight'].value * (33333.33 + 5625));
      this.baseSal = (this.form0.controls['salary'].value - this.baseSal) + this.baseSal;

      this.baseSalPlusExtras = ((this.baseSal * 1.75 * this.form0.controls['hrsExtraNight'].value) / 240) + ((this.baseSal * 1.25 * this.form0.controls['hrsExtraDay'].value) / 240)

      this.baseSalPlusHolidays = (this.form0.controls['workOnHolidaysDay'].value * 8333.33) + (this.form0.controls['workOnHolidaysNight'].value * 10416.67)

      this.baseSalPlusTransAux = 0;

      this.salMinusPension = this.baseSal * 0.04;

      this.salMinusEPS = this.baseSal * 0.04;

      subTot = this.baseSal + ((this.baseSal * 1.75 * this.form0.controls['hrsExtraNight'].value) / 240) + ((this.baseSal * 1.25 * this.form0.controls['hrsExtraDay'].value) / 240) + (this.form0.controls['workOnHolidaysDay'].value * 8333.33) + (this.form0.controls['workOnHolidaysNight'].value * 10416.67)

      tot = subTot - (this.salMinusEPS + this.salMinusPension);

    } else {
      this.baseSal = this.form0.controls['daysNormal'].value * 33333.33 + (this.form0.controls['daysNight'].value * (33333.33 + 5625));
      this.baseSal = (this.form0.controls['salary'].value - this.baseSal) + this.baseSal;

      this.baseSalPlusExtras = ((this.baseSal * 1.75 * this.form0.controls['hrsExtraNight'].value) / 240) + ((this.baseSal * 1.25 * this.form0.controls['hrsExtraDay'].value) / 240)// + (this.form.controls['salary'].value * ) 

      this.baseSalPlusHolidays = (this.form0.controls['workOnHolidaysDay'].value * 8333.33) + (this.form0.controls['workOnHolidaysNight'].value * 10416.67)

      this.baseSalPlusTransAux = 117172;

      this.salMinusPension = this.baseSal * 0.04;

      this.salMinusEPS = this.baseSal * 0.04;

      subTot = this.baseSal + 117172 + (this.form0.controls['workOnHolidaysDay'].value * 8333.33) + (this.form0.controls['workOnHolidaysNight'].value * 10416.67) + ((this.baseSal * 1.75 * this.form0.controls['hrsExtraNight'].value) / 240) + ((this.baseSal * 1.25 * this.form0.controls['hrsExtraDay'].value) / 240)

      tot = subTot - (this.salMinusEPS + this.salMinusPension);
    }

    // parafiscales - prestaciones
    this.arl = (subTot - this.baseSalPlusTransAux) * 0.0052;
    this.pensiones = (subTot - this.baseSalPlusTransAux) * 0.12;
    this.caja = (subTot - this.baseSalPlusTransAux) * 0.04;
    this.cesantias = subTot * 0.0833;
    this.intereses = subTot * 0.01;
    this.prima = subTot * 0.0833;
    this.vacaciones = (subTot - this.baseSalPlusTransAux - this.baseSalPlusExtras) * 0.0417;
    this.totPrestaciones = this.arl + this.pensiones + this.caja + this.cesantias + this.intereses + this.prima + this.vacaciones;

    let obj: tablaNomina = {
      baseSal: this.baseSal,
      baseCotizacion: this.baseSal * 0.4,
      baseSalPlusExtras: this.baseSalPlusExtras,
      baseSalPlusHolidays: this.baseSalPlusHolidays,
      baseSalPlusTransAux: this.baseSalPlusTransAux,
      salMinusPension: this.salMinusPension,
      salMinusEPS: this.salMinusEPS,
      totalSal: tot
    };

    let obj2: tablaPrestaciones = {
      arl: this.arl,
      pensiones: this.pensiones,
      caja: this.caja,
      cesantias: this.cesantias,
      intereses: this.intereses,
      prima: this.prima,
      vacaciones: this.vacaciones,
      totPrestaciones: this.totPrestaciones
    }

    if (this.contIndxTable > 1) {
      this.listaNomina.splice(0, this.listaNomina.length);
      this.listaPrestaciones.splice(0, this.listaPrestaciones.length);
    }

    this.listaNomina.push(obj);
    this.listaPrestaciones.push(obj2);
  }

  morePays(event: any) {
    this.disabled = false;
    console.log(event.value);
    if (event.value == '1') {
      this.otherspays = true;
    } else {
      this.otherspays = false;
    };

  }
}
