import { LightningElement, track } from 'lwc';
import sheetjs from '@salesforce/resourceUrl/sheetjs';
import { loadScript } from 'lightning/platformResourceLoader';

let XLS = {};

export default class FileUploadWithFetchAPI extends LightningElement {
    endpoint = 'https://fileuploadpoc-dev-ed.develop.my.salesforce.com/services/data/v58.0/sobjects/ContentVersion';
    accessToken = '00D5j00000CuOHk!AR8AQKplGYQbqsJOKXwXHTGS9ctwkIfmsS4PBQbIkQumi9r3.Mjn7.03AR4JMxrZTGM1BWDDMqLNbK1H3FMlaJUFrp1pQm2W';
    body;
    @track acceptedFormats = ['.xls', '.xlsx'];


    // insertContentVersion(){
    //     fetch(this.endpoint, 
    //         {
    //             method:'POST', 
    //             headers:{ 
    //                 "Authorization": 'Bearer '+this.accessToken, 
    //                 "Content-Type": "application/json"}, 
    //             body: this.body
    //         })
    //     .then(response => response.text())
    //     .then(text  => console.log(text))
    //     .catch(error => console.log('error', error))
    // }


    insertContentVersion(){
        // for (var pair of this.body.entries()) {
        //     console.log(pair[0]+ ', ' + pair[1]); 
        // }
        console.log('this.body', this.body);
        fetch(this.endpoint, 
            {
                method:'POST', 
                headers:{ 
                    "Authorization": 'Bearer '+this.accessToken, 
                    "Content-Type": "multipart/form-data; boundary=\"boundary_string\""}, 
                    mode: "no-cors",
                body: new FormData()
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

    // async readData(file){
    //     var reader = new FileReader();
    //     reader.onload = event => {
    //         var base64 = reader.result.split(',');
    //         var bodyObject = {};
    //         bodyObject.Title = 'Insert From LWC 1';
    //         bodyObject.VersionData = window.btoa(base64);
    //         bodyObject.PathOnClient = 'InsertedFromLWC1.xlsx';
    //         bodyObject.ContentLocation = 'S';
    //         this.body = JSON.stringify(bodyObject);
            
    //     };
    //     reader.onerror = function(ex) {
    //         this.error=ex;
    //         this.dispatchEvent(
    //             new ShowToastEvent({
    //                 title: 'Error while reding the file',
    //                 message: ex.message,
    //                 variant: 'error',
    //             }),
    //         );
    //     };
    //     reader.readAsBinaryString(file);
    // }

    /**
     * @description form data test
     * @param {*} file 
     */
    async readData(file){
        var reader = new FileReader();
        reader.onload = event => {
            console.log(window.btoa(reader.result));
            var base64 = reader.result.split(',');
            let data = "";
            data += '--boundary_string\r\n';
            data += 'Content-Type:application/octet-stream\r\n';
            data += 'Content-Disposition: form-data; name="VersionData";'+ 'filename="SampleData(1011).xlsx"\r\n';
            data += '\r\n';
            data +=  reader.result + '\r\n';
            data += '--boundary_string\r\n';
            data += 'Content-Disposition: form-data; ' + 'name="entity_content";\r\n'
            data += 'Content-Type: application/json\r\n';
            data += '\r\n';
            data += '{\r\n';
            data += '"Title" : "Test title",\r\n';
            data += '"ContentLocation" : "S", \r\n';
            data += '"PathOnClient" : "SampleData(1011).xlsx"\r\n';
            data += '}\r\n';                
            data += '--boundary_string';
            console.log('data-->'+data);

            // const contentVersion = {
            //     FirstPublishLocationId: "0055j000009SFYWAA4",
            //     Title: 'Test File',
            //     PathOnClient: 'test.xlsx',
            //     Origin: "C",
            // };

            // var formDataObject = new FormData();
            // formDataObject.setBoundary('boundary_string');
            // formDataObject.append("entity_content", JSON.stringify(contentVersion), {
            //     contentType: "application/json",
            // });

            // formDataObject.append("VersionData", window.btoa(base64), {
            //     filename: 'test.xlsx',
            //     contentType: 'EXCEL_X',
            // });

            // formDataObject.append('Title', 'Test File');
            // formDataObject.append('VersionData', window.btoa(base64));
            // formDataObject.append('PathOnClient', 'test.xlsx');
            // formDataObject.append('ContentLocation', 'S');
            this.body = data;
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
        console.log('handleClick');
        this.insertContentVersion();
    }


    handleFileChange(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            console.log('reader.result',reader.result);
            const data = new Uint8Array(reader.result);
            console.log('data',data);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            console.log('jsonData',JSON.stringify(jsonData));
            this.postFormData(jsonData);
        };
        reader.readAsArrayBuffer(file);
      }

    postFormData(data) {
        let formData = new FormData();
        //formData.append('fileData', JSON.stringify(data));
        formData.append('PathOnClient', 'test.xlsx');
        formData.append('Title', 'Test File');
        formData.append('VersionData', window.btoa(data));
        console.log('formData', formData);
        fetch(this.endpoint, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + this.accessToken,
            'Content-Type': 'multipart/form-data'
          },
          body: formData
        })
        .then(response => response.text())
        .then(text  => console.log(text))
        .catch(error => console.log('error', error))
      }
}