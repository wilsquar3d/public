

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
  
  data.empty_objects.efb: {
    profiles: {}
  };
}
