// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  serverEndpoint: "http://3.16.169.253/",
  socketEndpoint: "http://3.16.169.253:6001",
  VPNserverEndpoint:"http://10.201.233.240/",
  VPNsocketEndpoint:"http://10.201.233.240:6001/",
  socketAlarm: true,
  dataSocket: false,
  impianti : [
        {
            "id": "1",
            "nome":"italprogetti",
            "codice_impianto": "qwerty",
            "codice_registrazione":"abc",
            "api_host": "10.201.233.239",
            "socket_host":"10.201.233.240"
        },
        {
          "id": "2",
          "nome":"italprogetti ngrok",
          "codice_impianto": "qwertyu",
          "codice_registrazione":"def",
          "api_host": "5dd8db89.ngrok.io",
          "socket_host":"10.201.233.240"
          
      },
      {
        "id": "3",
        "nome":"italprogetti test",
        "codice_impianto": "test",
        "codice_registrazione":"test",
        "api_host": "5dd8db89.ngrok.io",
        "socket_host":"10.201.233.240"
        
    },
     {
      "id": "4",
      "nome":"WOLLSDORF",
      "codice_impianto": "WOLLS19;",
      "codice_registrazione":"Ww2019!",
      "api_host": "225c4bde.ngrok.io",
      "socket_host":"10.201.233.240"
      
  }
  
    
    
    ],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
