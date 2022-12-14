// import { apiKey, driveId, auth } from '/modules/conf.js';

function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.readonly"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }
  function loadClient() {
    gapi.client.setApiKey(apiKey); // api key here
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/drive/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }
  // Make sure the client is loaded and sign-in is complete before calling this method.
  function execute() {
    // authenticate().then(loadClient());
    
    return gapi.client.drive.files.list({
      'supportsAllDrives': true,
      'includeItemsFromAllDrives': true,
      'corpora': 'drive',
      'driveId': driveId, // ID of drive to connect 
      'fields':'files(id, name, parents, webViewLink)', // fields we want to include

    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                let allFiles = response.result.files;
          
                let fileNames = [];
                for (const file of allFiles) {
                    fileNames.push(file.name);
                    const getUl = document.querySelector('.list-manga-dir');
                    let creatLi = document.createElement('li');
                    let creatA = document.createElement('a');
                    
                    creatA.setAttribute('href', file['webViewLink']);
                    creatA.textContent = file['name'];
                    getUl.appendChild(creatLi);
                    const getElementLi = getUl.lastChild;
                    console.log(creatA);
                    getElementLi.appendChild(creatA);

                    console.log("Nom : ", file['name']);
                    console.log("Link : ", file['webViewLink']);
                    }
                    console.log(fileNames);
                console.log("Response", response.result.files);
              },
        // .then(function(response) {
        //   const getUl = document.querySelector('list-manga-dir');
        //   let creatLi = document.createElement('li');
        //   response.forEach((item, index) => {
        //     getUl.appendChild(creatLi);
        //   })
        // },
              function(err) { console.error("Execute error", err); });
  }
  gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: auth}); // auth2 key authentification
  });

/**
 * Create a folder and prints the folder ID
 * @return{obj} folder Id
 * */
  async function createFolder() {
  
    // TODO: R??cup??rer tout les nom de dossier dans un tableau

    // TODO : Cr??ation d'une boucle pour cr??er tout les dossiers.

    // TODO : Cr??ation des dossiers
    const fileMetadata = {
      name: 'Invoices',
      mimeType: 'application/vnd.google-apps.folder',
    };
    try {
      const file = await gapi.client.drive.files.create({
        resource: fileMetadata,
        fields: 'id',
      });
      console.log('Folder Id:', file.data.id);
      return file.data.id;
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }
  

  // Here function for move old folder to new folder
  function moveFolder() {

  }

  // Here function for remove old folder
  function removeOldFolder() {

  }




