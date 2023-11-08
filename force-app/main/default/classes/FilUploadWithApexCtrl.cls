/**
 * @description       : 
 * @author            : C.T. - Simplus Delivery
 * @group             : 
 * @last modified on  : 11-09-2023
 * @last modified by  : C.T. - Simplus Delivery
**/
public with sharing class FilUploadWithApexCtrl {
    @AuraEnabled
    public static String readFile(String recordId) {
        ContentDocumentLink contentDocumentLink = [
            SELECT id, ContentDocumentId, ContentDocument.Description, 
            ContentDocument.Title, LinkedEntityId 
            FROM ContentDocumentLink 
            WHERE LinkedEntityId = '0017F00002nb4ktQAA' 
            LIMIT 1
        ];

        ContentVersion cv = [
            SELECT VersionData 
            FROM ContentVersion 
            WHERE ContentDocumentId = :contentDocumentLink.ContentDocumentId 
            AND IsLatest = true
            LIMIT 1
        ];
        return EncodingUtil.base64Encode(cv.VersionData);
    }
}