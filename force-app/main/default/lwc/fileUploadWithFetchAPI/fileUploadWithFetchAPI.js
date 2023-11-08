import { LightningElement, track } from 'lwc';
import sheetjs from '@salesforce/resourceUrl/sheetjs';
import { loadScript } from 'lightning/platformResourceLoader';

let XLS = {};

export default class FileUploadWithFetchAPI extends LightningElement {
    endpoint = 'https://fileuploadpoc-dev-ed.develop.my.salesforce.com/services/data/v57.0/sobjects/ContentVersion';
    accessToken = '00D5j00000CuOHk!AR8AQE2XMd3YJRxjVrAWYX56.A.zYRkeYE6rOWvjZ8WsIQGhkxXaJGNDQSI4Xc7KfppiGc.aZSgko9Xnkl3rL1UtLRMU5QdM';
    body;
    @track acceptedFormats = ['.xls', '.xlsx'];

    insertContentVersion(){
        fetch(this.endpoint, 
            {
                method:'POST', 
                headers:{ 
                    "Authorization": 'Bearer '+this.accessToken, 
                    "Content-Type": "application/json"}, 
                body: this.body
            })
        .then(response => response.text())
        .then(text  => console.log(text))
        .catch(error => console.log('error', error))
    }


    connectedCallback() {
        Promise.all([
            loadScript(this, sheetjs)
        ]).then(() => {
            XLS = XLSX
        })
    }

    handleUploadFinished(event){
        const uploadedFiles = event.detail.files;
        if(uploadedFiles.length > 0) {   
            this.readData(uploadedFiles[0])
        }
    }

    async readData(file){
        var reader = new FileReader();
        reader.onload = event => {
            var base64 = reader.result.split(',');
            var bodyObject = {};
            bodyObject.Title = 'Insert From LWC 1';
            bodyObject.VersionData = window.btoa(base64);
            bodyObject.PathOnClient = 'InsertedFromLWC1.xlsx';
            bodyObject.ContentLocation = 'S';
            this.body = JSON.stringify(bodyObject);
            
        };
        reader.onerror = function(ex) {
            this.error=ex;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while reding the file',
                    message: ex.message,
                    variant: 'error',
                }),
            );
        };
        reader.readAsBinaryString(file);
    }

    handleClick(){
        this.insertContentVersion();
    }


    // handleFileChange(event) {
    //     const file = event.target.files[0];
    //     const reader = new FileReader();
    //     reader.onload = () => {
    //         console.log('reader.result',reader.result);
    //         const data = new Uint8Array(reader.result);
    //         console.log('data',data);
    //         const workbook = XLSX.read(data, { type: 'array' });
    //         const sheetName = workbook.SheetNames[0];
    //         const worksheet = workbook.Sheets[sheetName];
    //         const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    //         console.log('jsonData',JSON.stringify(jsonData));
    //         //this.postFormData(jsonData);
    //     };
    //     reader.readAsArrayBuffer(file);
    //   }

    // postFormData(data) {
    //     const formData = new FormData();
    //     formData.append('fileData', JSON.stringify(data));
    //     formData.append('PathOnClient', 'test.xlsx');
    //     formData.append('Title', 'Test File');
    //     formData.append('VersionData', data);
    //     console.log('formData', formData);
    //     fetch(this.endpoint, {
    //       method: 'POST',
    //       body: formData,
    //       headers: {
    //         'Authorization': 'Bearer ' + this.accessToken,
    //         'Content-Type': 'multipart/form-data'
    //       }
    //     })
    //     .then(response => {
    //       if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //       }
    //       return response.json();
    //     })
    //     .then(data => {
    //       console.log(data);
    //     })
    //     .catch(error => {
    //       console.error('There was a problem with the fetch operation:', error);
    //     });
    //   }
}