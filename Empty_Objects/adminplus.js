//https://raw.githubusercontent.com/wilsquar3d/public/master/Empty_Objects/adminplus.js

if( data )
{
  if( !data.empty_objects )
  {
    data.empty_objects = {};
  }
  
  data.empty_objects.nb = {
    bundles: {
      "id": -1,
      "displayName": "",
      "bundlePrefix": "",
      "bundleUuid": ""
    },
    data_types: {
      "id": -1,
      "displayName": "",
      "dataTypeUuid": "",
      "applicationName": "",
      "canBePublished": false,
      "canBeUploaded": false,
      "sortOrder": -1,
      "isVisibleOnDevice": false
    },
    plugins: {
      "id": -1,
      "displayName": "",
      "sortOrder": -1,
      "applicationPluginUuid": "",
      "applicationName": ""
    },
    tenants: {
      "userList": [],
      "revoked": false,
      "id": -1,
      "customerUuid": "",
      "customerName": "",
      "customerShortName": "",
      "salesRep": "",
      "admin": "",
      "dispatchPlusCustomerId": "",
      "bundleIds": [],
      "datatypeIds": "[]",
      "datatypeIdList": [],
      "applicationPluginIds": "[]",
      "applicationPluginIdList": []
    }
  };
  
  data.empty_objects.efb = {
    aircrafts: {
      "id": -1,
      "displayName": "",
      "typeCode": ""
    },
    lookups: {
      "publishDataTypes": [],
      "otherDataTypes": [],
      "deviceRegistrationStatuses": [],
      "releaseStatuses": []
    },
    packages: {},
    profiles: {
      "id": -1,
      "displayName": "",
      "sortOrder": -1,
      "applicationPluginUuid": "",
      "applicationName": ""
    },
    releases: {
      "id": -1,
      "releaseCode": "",
      "releaseName": "",
      "releaseDescription": "",
      "createdDate": "", //YYYY-MM-DDThh:mm:ss+00:00
      "publishedDate": "",
      "authorName": "",
      "releaseStatus": "",
      "packageIds": "[]",
      "packageIdList": [],
      "templateId": -1,
      "groupName": "",
      "autoDataTypeIds": "[]",
      "autoDataTypeIdList": [],
      "isTestPublished": false
    }
  };
}
