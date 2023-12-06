import { LightningElement, track } from 'lwc';

export default class FileUploadWithFetchAPI extends LightningElement {
    endpoint = 'https://fileuploadpoc-dev-ed.develop.my.salesforce.com/services/data/v57.0/sobjects/ContentVersion';
    accessToken = '00D5j00000CuOHk!AR8AQIKepGg4i9iyscZe_PvOAo6NxloJejK.WoqjUu.RLW5.u4Qkb0.Kbr.xMemnz0ctr.S8kNY7dN3MOSlHTS2_f586uXRg';
    body;
    @track acceptedFormats = ['.xls', '.xlsx'];
    fileName;

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
            this.body = this.createRequestBodyAsJson(base64);
            
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

    createRequestBodyAsJson(base64){
        var bodyAsObject = {};
        bodyAsObject.Title = 'Insert From LWC 1';
        bodyAsObject.VersionData = window.btoa(base64);
        bodyAsObject.PathOnClient = 'InsertedFromLWC1.xlsx';
        bodyAsObject.ContentLocation = 'S';
        
        return JSON.stringify(bodyAsObject);
    }

    handleClick(){
        this.insertContentVersion();
    }
}