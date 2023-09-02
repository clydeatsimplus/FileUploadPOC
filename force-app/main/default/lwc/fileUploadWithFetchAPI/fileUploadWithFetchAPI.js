import { LightningElement, track } from 'lwc';
//import sheetjs from '@salesforce/resourceUrl/sheetjs';

//let XLS = {};

export default class FileUploadWithFetchAPI extends LightningElement {
    endpoint = 'https://fileuploadpoc-dev-ed.develop.my.salesforce.com/services/data/v57.0/sobjects/ContentVersion';
    accessToken = '00D5j00000CuOHk!AR8AQHyApIRt0Td2mCyIkYJvG65R2N82TrM9zt3G.Ww6qpNhl9YHE2L.nhtUfu6shheca4jSW3YK7R1VaKqvwr8xikbadyIA';
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


    // connectedCallback() {
    //     Promise.all([
    //         loadScript(this, sheetjs)
    //     ]).then(() => {
    //         XLS = XLSX
    //     })
    // }

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
}