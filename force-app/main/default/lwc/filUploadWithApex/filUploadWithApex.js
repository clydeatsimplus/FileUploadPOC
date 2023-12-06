import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import apex_INSERT_FILE from '@salesforce/apex/FilUploadWithApexCtrl.insertFile'

export default class FilUploadWithApex extends LightningElement {
    acceptedFormats = ['.xls', '.xlsx'];
    fileName;

    @api recordId;
    fileData;

    handleUploadFinished(event) {
        const file = event.target.files[0]
        this.fileName = file.name;
        var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileData = {
                'filename': file.name,
                'base64': base64,
                'recordId': this.recordId
            }
            console.log(this.fileData)
        }
        reader.readAsDataURL(file)
    }
    
    handleClick(){
        const {base64, filename, recordId} = this.fileData
        apex_INSERT_FILE({ base64, filename, recordId }).then(result=>{
            this.fileData = null
            let title = `${filename} uploaded successfully!!`
            this.toast(title, "success")
        }).catch(error=>{
            console.log('error', error);
            this.fileData = null
            let title = `${filename} upload ERROR!!`
            this.toast(title, "error")
        })
    }

    toast(title, toastType){
        const toastEvent = new ShowToastEvent({
            title, 
            variant: toastType
        })
        this.dispatchEvent(toastEvent)
    }
}