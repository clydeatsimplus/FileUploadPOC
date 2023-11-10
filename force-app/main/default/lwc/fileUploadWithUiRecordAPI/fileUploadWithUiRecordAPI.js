import { LightningElement, track } from 'lwc';
//import sheetjs from '@salesforce/resourceUrl/sheetjs';
import { loadScript } from 'lightning/platformResourceLoader';
import {createRecord} from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class FileUploadWithUiRecordAPI extends LightningElement {
    body;
    fileName;

    connectedCallback() {
        // Promise.all([
        //     loadScript(this, sheetjs)
        // ]).then(() => {
        //     XLS = XLSX
        // })
    }

    handleUploadFinished(event){
        const uploadedFiles = event.detail.files;
        if(uploadedFiles.length > 0) {   
            this.readData(uploadedFiles[0])
        }
    }

    async readData(file){
        this.fileName = file.name;
        var reader = new FileReader();
        reader.onload = event => {
            var base64 = reader.result.split(',');
            this.body = {
                Title:'Insert From LWC',
                PathOnClient: Date.now()+'InsertedFromLWC.xlsx',
                VersionData: window.btoa(base64),
                ContentLocation: 'S'
            };
            
        };
        // reader.onerror = function(ex) {
        //     this.error=ex;
        //     this.dispatchEvent(
        //         new ShowToastEvent({
        //             title: 'Error while reding the file',
        //             message: ex.message,
        //             variant: 'error',
        //         }),
        //     );
        // };
        reader.readAsBinaryString(file);
    }

    handleClick(){
        const payload={apiName:'ContentVersion',fields:this.body};
        createRecord(payload).then(result=>{
            let title = `${this.fileName} uploaded successfully!!`
            this.toast(title, "success")
        })
        .catch(error=>{
            let title = `${this.fileName} upload ERROR!!`
            this.toast(title, "error")
        });
    }

    
    toast(title, toastType){
        const toastEvent = new ShowToastEvent({
            title, 
            variant: toastType
        })
        this.dispatchEvent(toastEvent)
    }
}