import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { NavController } from '@ionic/angular';
import { UtenteService } from '../services/utente.service';
import { Utente } from '../models/Utente';
import { AlertController } from '@ionic/angular';
import { SMS } from '@ionic-native/sms/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.page.html',
  styleUrls: ['./registrazione.page.scss'],
})
export class RegistrazionePage implements OnInit {

  //Data che mi serve come valore che viene prelevato all'interno della pagina
  cittanascita: string;
  datanascita: Date;
  //Data di oggi
  mydate = new Date().toISOString();

  utente: Utente = {
    email: '',
    nome: '',
    cognome: '',
    datanascita: '',
    codice_fiscale: '',
    sesso: '',
    cittàNascita: '',
    residenza: '',
    indirizzo: '',
    stato: false,
    caricamenti: false,
  };

  //Variabili utili per l'autentcicazione
  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email è un campo obbligatorio' },
      { type: 'pattern', message: 'Inserisci una mail valida' }
    ],
    'password': [
      { type: 'required', message: 'Password è un campo obbligatorio' },
      { type: 'minlength', message: 'La password deve essere di almeno 5 caratteri lunga' }
    ],
    'password2': [
      { type: 'required', message: 'Password è un campo obbligatorio' },
      { type: 'minlength', message: 'La password deve essere di almeno 5 caratteri lunga' }
    ],
    'nome' : [
      { type: 'required', message: 'Il nome è un campo obbligatorio' },
      { type: 'minlenght', message: 'Il nome deve essere di almeno 3 caratteri' }
    ],
    'cognome' : [
      { type: 'required', message: 'Il cognome è un campo obbligatorio' },
      { type: 'minlenght', message: 'Il cognome deve essere di almeno 3 caratteri' }
    ],
    'nascita': [
      { type: 'required', message: 'La città è un campo obbligatorio' },
    ],
    'codfiscale': [
      { type: 'required', message: 'Codice Fiscale è un campo obbligatorio' },
      { type: 'pattern', message: 'Inserisci un codice fiscale valido' }
    ],
    'citta': [
      { type: 'required', message: 'La città è un campo obbligatorio' },
    ],
    'residenza': [
      { type: 'required', message: 'La residenza è un campo obbligatorio' },
    ],
    'sesso': [
      { type: 'required', message: 'Il sesso è un campo obbligatorio' },
    ],
    'indirizzo': [
      { type: 'required', message: 'Indirizzo è un campo obbligatorio' },
    ],
  };

  user: any;
  emailAuth: string;
  password: string;
  password1: string;

  // tslint:disable-next-line: max-line-length
  constructor(private emailComposer: EmailComposer, private sms: SMS, public alertCtrl: AlertController, public router: Router, private navCtrl: NavController, private authService: AuthenticationService, private formBuilder: FormBuilder, public itemService: UtenteService) {
    this.user = this.authService.userDetails();

    
    if (this.user) {
        // User is signed in.
        console.log ('Utente loggato');
        this.emailAuth = this.authService.userDetails().email;
      } else {
        console.log ('Utente non loggato ');
        this.reload();
        //this.authService.logoutUser();
        //this.router.navigate(['home']);
        // No user is signed in.
      }
    //this.reload();
   }

   reload() {
    this.authService.logoutUser();
    this.router.navigate(['home']);
   }
   
  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      password2: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      nome: new FormControl('', Validators.compose([
        Validators.minLength(3),
        Validators.required
      ])),
      cognome: new FormControl('', Validators.compose([
        Validators.minLength(3),
        Validators.required
      ])),
      nascita: new FormControl('', Validators.compose([
      ])),
      codfiscale: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]$')
      ])),
      citta: new FormControl('', Validators.compose([
      ])),
      residenza: new FormControl('', Validators.compose([
      ])),
      sesso: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      indirizzo: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
    this.itemService.getUsers().subscribe(items => {
      console.log (items);
    });
  }

  goBack() {
    this.router.navigate(['dashboard-def']);
  }

  addCliente() {
    this.utente.cittàNascita = this.cittanascita;
    this.utente.datanascita = this.datanascita.toString().substring(0, 10);
    console.log ('Ecco tutte le info: ' + this.utente.nome + this.utente.cognome + this.utente.email + this.utente.codice_fiscale + this.utente.indirizzo + this.utente.sesso + this.utente.cittàNascita);
    this.itemService.addCliente(this.utente);
    this.utente.nome = '';
    this.utente.cognome = '';
    this.utente.indirizzo = '';
    this.utente.codice_fiscale = '';
    this.utente.cittàNascita = '';
    this.utente.residenza = '';
    this.utente.sesso = '';
    this.cittanascita = '';
    this.utente.email = '';
  }

  tryRegister(value) {
    this.errorMessage = '';
    this.successMessage = 'Il tuo account è stato correttamente creato prova a loggarti';
    //this.utente.datanascita = this.datanascita.toString().substring(0, 10);
    this.utente.cittàNascita = this.cittanascita;
    if (this.password === this.password1) {
      this.itemService.addCliente(this.utente);
      // Send a text message using default options
      /*
      console.log ('Invio il messaggio');
      this.sms.send('+393383177453', 'Hello world!');
      */

       let email = {
        to: this.utente.email,
        //cc: 'erika@mustermann.de',
        //bcc: ['john@doe.com', 'jane@doe.com'],
        subject: 'Registrazione avvenuta con successo',
        body: 'Ciao ' + this.utente.nome + 'Benvenuto in Sella' + 
        "\nEcco le tue creadenziali per l'applicazione dedicata, con la quale potrai interagire facilmente e da casa con noi \n" + 
        'Username: ' + this.utente.email + 
        '\nPassword: ' + this.password + 
        '\nCordiali saluti,' + 
        '\\nBanca Sella, gruppo Biella.',
        isHtml: true
      }
      // Send a text message using default options
      this.emailComposer.open(email);
      this.utente.nome = '';
      this.utente.cognome = '';
      this.utente.indirizzo = '';
      this.utente.codice_fiscale = '';
      this.utente.cittàNascita = '';
      this.utente.residenza = '';
      this.utente.sesso = '';
      this.cittanascita = '';
      this.utente.email = '';
      this.password = '';
      this.password1 = '';
      this.authService.registerUser(value)
     .then(res => {
       console.log(res);
       this.errorMessage = '';
       this.successMessage = 'Il tuo account è stato correttamente creato prova a loggarti';
       this.utente.datanascita = this.datanascita.toString().substring(0, 10);
       this.utente.cittàNascita = this.cittanascita;
       this.itemService.addCliente(this.utente);
       this.utente.nome = '';
       this.utente.cognome = '';
       this.utente.indirizzo = '';
       this.utente.codice_fiscale = '';
       this.utente.cittàNascita = '';
       this.utente.sesso = '';
       this.cittanascita = '';
       this.utente.email = '';
     }, err => {
       console.log(err);
       this.errorMessage = err.message;
       this.successMessage = '';
     });
    } else {
      this.passwordDiverse('Password e Conferma password non coincidono');
    }
  }

  goLoginPage() {
    this.navCtrl.navigateBack('');
  }

  getCitta() {
    this.utente.cittàNascita = this.cittanascita;
    console.log('Ecco il valore della data inserita' + this.datanascita.toString().substring(0, 10));
  }

  dataChanged(date) {
    this.utente.datanascita = this.datanascita.toString();
    console.log ("Ecco il valore associato all'utente: " + this.utente.datanascita);
    //E' esattamente viceversa la prima console mostra la data inserita la seconda invece quella odierna, incluso orario
    console.log("Questa in teoria dovrebbe essere la data di oggi" + date.detail.value);
    console.log("Questa è la data inserita da me: " + this.mydate);
    console.log ("Valore associato alla mia data di nascita: " + this.datanascita.toString());
  }

  async presentAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Compila il form correttamente',
      message: 'Non hai inserito ' + message,
      buttons: ['Conferma']
    });
    alert.present();
  }

  async passwordDiverse(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Compila il form correttamente',
      message: '' + message,
      buttons: ['Conferma']
    });
    alert.present();
  }

  otherFunction() {
    this.presentAlert ('Funzione ancora non implementata');
  }

  logout() {
    this.authService.logoutUser();
    this.router.navigate (['home']);
  }

  paginaRegistrazione() {
    this.router.navigate(['registrazione']);
  }

  paginaIncontri() {
    this.router.navigate(['incontro']);
  }

  approvaDomanda() {
    this.router.navigate(['approvazione']);
  }

  caricaDocumenti() {
    this.router.navigate(['carica-documenti']);
  }
}
