import { LightningElement, track } from 'lwc';
import apex_ReadFile from '@salesforce/apex/FilUploadWithApexCtrl.readFile';
import sheetjs from '@salesforce/resourceUrl/sheetjs';
import { loadScript } from 'lightning/platformResourceLoader';

let XLS = {};

export default class FilUploadWithApex extends LightningElement {
    @track acceptedFormats = ['.xls', '.xlsx'];
    fileName;

    connectedCallback() {
        Promise.all([
            loadScript(this, sheetjs)
        ]).then(() => {
            XLS = XLSX
            //this.readFromFile()
        })
    }


    async readFromFile() {
        let returnVal = await apex_ReadFile({recordId:'test'})
        let wb = XLS.read(returnVal, {type:'base64', WTF:false});
        console.log('this.to_json(wb)',this.to_json(wb));
    }

    to_json(workbook) {
        var result = {};
		workbook.SheetNames.forEach(function(sheetName) {
			var roa = XLS.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
			if(roa.length) result[sheetName] = roa;
		});
		return JSON.stringify(result, 2, 2);
    }

    handleUploadFinished(event){
        const uploadedFiles = event.detail.files;
        if(uploadedFiles.length > 0) {   
            this.ExcelToJSON(uploadedFiles[0])
        }
    }

    ExcelToJSON(file){
        this.fileName = file.name;
        var reader = new FileReader();
        reader.onload = event => {
            var data=event.target.result;
            var workbook=XLS.read(data, {
                type: 'binary'
            });
            var XL_row_object = XLS.utils.sheet_to_row_object_array(workbook.Sheets["Sheet1"]);
            var data = JSON.stringify(XL_row_object);
            console.log('data',data);
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
}