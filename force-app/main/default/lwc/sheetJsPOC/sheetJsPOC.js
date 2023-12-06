import { LightningElement, track } from 'lwc';
//import readFileFromRecord from '@salesforce/apex/ReadFileData.readFileFromRecord';
import { loadScript } from 'lightning/platformResourceLoader';
import sheetjs from '@salesforce/resourceUrl/sheetjs';
const columns = [
    { label: 'OrderNumber', fieldName: 'OrderNumber' },
    { label: 'ProductName', fieldName: 'ProductName'},
    { label: 'TotalAmount', fieldName: 'TotalAmount' }
];
let XLS = {};
export default class SheetJsPOC extends LightningElement {
    @track acceptedFormats = ['.xls', '.xlsx'];
    data;

    connectedCallback() {
        Promise.all([
            loadScript(this, sheetjs)
        ]).then(() => {
            XLS = XLSX
            //this.readFromFile()
        })
    }


    // async readFromFile() {
    //     let returnVal = await readFileFromRecord({recordId:'test'})
    //     let wb = XLS.read(returnVal, {type:'base64', WTF:false});
    //     console.log(this.to_json(wb));
    // }

    // to_json(workbook) {
    //     var result = {};
	// 	workbook.SheetNames.forEach(function(sheetName) {
	// 		var roa = XLS.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
	// 		if(roa.length) result[sheetName] = roa;
	// 	});
	// 	return JSON.stringify(result, 2, 2);
    // }

    handleUploadFinished(event){
        const uploadedFiles = event.detail.files;
        if(uploadedFiles.length > 0) {   
            this.ExcelToJSON(uploadedFiles[0])
        }
    }

    ExcelToJSON(file){
        var reader = new FileReader();
        reader.onload = event => {
            var data=event.target.result;
            var workbook=XLS.read(data, {
                type: 'binary'
            });

            // const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            // const raw_data = XLSX.utils.sheet_to_json(worksheet, {header:1});
            var XL_row_object = XLS.utils.sheet_to_row_object_array(workbook.Sheets["Sheet1"]);
            console.log('XL_row_object',XL_row_object);
            var data = JSON.stringify(XL_row_object);
            console.log('data',data);
            console.log('stringify', JSON.stringify(data));
            // console.log('raw_data', raw_data);
            // console.log('JSON.stringify(raw_data)', JSON.stringify(raw_data));
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