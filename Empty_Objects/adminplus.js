//https://raw.githubusercontent.com/wilsquar3d/public/master/Empty_Objects/adminplus.js

function add_emptyObjects_adminplus( elem )
{
  if( elem )
  {
    if( !elem.empty_objects )
    {
      elem.empty_objects = {};
    }

    elem.empty_objects.nb = {
      bundles: {
        "id": -1,
        "displayName": "",
        "bundlePrefix": "",
        "bundleUuid": "${guid}"
      },
      data_types: {
        "id": -1,
        "displayName": "",
        "dataTypeUuid": "${guid}",
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
        "applicationPluginUuid": "${guid}",
        "applicationName": ""
      },
      tenants: {
        "userList": [],
        "revoked": false,
        "id": -1,
        "customerUuid": "${guid}",
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

    elem.empty_objects.efb = {
      aircrafts: {
        "id": -1,
        "displayName": "",
        "typeCode": "${guid}"
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
        "releaseCode": "${guid}",
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
}
