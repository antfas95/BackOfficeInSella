import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

export interface MyData {
  id?: string;
  name: string;
  user: string;
  filepath: string;
  size: number;
  date: string;
  approval: number;
  description: string;
  type: string;
}

@Component({
  selector: 'app-carica-documenti',
  templateUrl: './carica-documenti.page.html',
  styleUrls: ['./carica-documenti.page.scss'],
})
export class CaricaDocumentiPage {
// Upload Code

  // Upload Task
  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  UploadedFileURL: Observable<string>;

  // Uploaded Image List
  images: Observable<MyData[]>;

  // File details
  fileName: string;
  fileSize: number;
  date: string = new Date().toISOString();
  approval: number;
  user: string;
  description: string;

  // Status check
  isUploading: boolean;
  isUploaded: boolean;

  private imageCollection: AngularFirestoreCollection<MyData>;

  type: string;
  // tslint:disable-next-line: max-line-length
  constructor(public router: Router, public alertCtrl: AlertController, private storage: AngularFireStorage, private authService: AuthenticationService , private database: AngularFirestore) {
    this.isUploading = false;
    this.isUploaded = false;
    this.user = this.authService.userDetails().email;
    // Set collection where our documents/ images info will save
    this.imageCollection = database.collection<MyData>(this.user);
    this.images = this.imageCollection.valueChanges();
  }

  async presentAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Upload fallito',
      message: '' + message,
      buttons: ['Conferma']
    });
    alert.present();
  }

async doConfirmDocument(event: FileList) {

  // Insert description

  const confirm = this.alertCtrl.create({
    header: 'Carica file',
    message: 'Inserisci una descrizione prima di caricare il file!',
    inputs: [{
      name: 'descr',
      placeholder: 'Descrizione > 5 caratteri',
      value: '',
    },
  ],
    buttons: [
      {
        text: 'NO',
        handler: () => {
          console.log('Disagree clicked');
          this.presentAlert('Caricamento annullato');
          return;
        }
      },
      {
        text: 'SI',
        handler: data => {

          // Check description
          this.description = data.descr;
          if (this.description.length <= 5) {
            this.presentAlert('La lunghezza della descrizione non rispetta il formato');
            return;
          }
          // The File object
          const file = event.item(0);
            // Upload and pre-check Validation for Images, docx, pdf
          console.log(file.type);
          if (file.type.split('/')[0] === 'image'
            || file.type === 'application/pdf'
            || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ) {
              this.type = file.type.split('/')[0];
              console.log(this.type);
              this.isUploading = true;
              this.isUploaded = false;

            // Boolean Flag pre approval Document
            this.approval = 0;

            // File Name
              this.fileName = file.name;

            // The storage path
              const path = this.user + `/${new Date().getTime()}_${file.name}`;


            // Totally optional metadata
              const customMetadata = { app: this.user + ' Upload Demo' };

            // File reference
              const fileRef = this.storage.ref(path);

            // The main task
              this.task = this.storage.upload(path, file, { customMetadata });

            // Get file progress percentage
              this.percentage = this.task.percentageChanges();
              this.snapshot = this.task.snapshotChanges().pipe(
              finalize(() => {
                // Get uploaded file storage path
                this.UploadedFileURL = fileRef.getDownloadURL();

                this.UploadedFileURL.subscribe(resp => {
                  this.addImagetoDB({
                    name: file.name,
                    user: this.user,
                    filepath: resp,
                    size: this.fileSize,
                    date: this.date,
                    approval: this.approval,
                    description: this.description,
                    type: this.type
                  });
                  this.isUploading = false;
                  this.isUploaded = true;
                }, error => {
                  console.error(error);
                });
              }),
              tap(snap => {
                  this.fileSize = snap.totalBytes;
              })
            );
            console.log('Agree clicked');
          } else {
            this.presentAlert('Formato file non supportato!');
            console.error('unsupported file type :( ');
            return;
          }
        }
      }
    ]
  });
  (await confirm).present();
}

  addImagetoDB(image: MyData) {
    // Create an ID for document
    image.id = this.database.createId();

    // Set document id with value in database
    this.imageCollection.doc(image.id).set(image).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log('error ' + error);
    });
  }

  goBack() {
    this.router.navigate(['dashboard-def']);
  }

  async presentAlert1(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Funzionalità',
      message: '' + message,
      buttons: ['Conferma']
    });
    alert.present();
  }

  otherFunction() {
    this.presentAlert1 ('Funzione ancora non implementata');
  }

  logout() {
    this.authService.logoutUser();
    this.router.navigate(['home']);
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
