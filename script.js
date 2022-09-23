  /**
   * Sample JavaScript code for drive.files.list
   * See instructions for running APIs Explorer code samples locally:
   * https://developers.google.com/explorer-help/code-samples#javascript
   */

  function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.readonly"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }
  function loadClient() {
    gapi.client.setApiKey("AIzaSyA3TUHMYHWTb7uPTn9LE8CIS_K4LfgeUH0");
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
      'driveId':'0AFIye_b5hvkvUk9PVA',
      'fields':'files(id,name, parents, webViewLink)',

    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                let allDir = response.result.files;
                for (const dir of allDir) {
                  console.log(dir);
                  const getUl = document.querySelector('.list-manga-dir');
                  let creatLi = document.createElement('li');
                  let creatA = document.createElement('a');
                
                  creatA.setAttribute('href', dir['webViewLink']);
                  creatA.textContent = dir['name'];
                  getUl.appendChild(creatLi);
                  const getElementLi = getUl.lastChild;
                  console.log(creatA);
                  getElementLi.appendChild(creatA);

                  console.log("Nom : ", dir['name']);
                  console.log("Link : ", dir['webViewLink']);
                }
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
    gapi.auth2.init({client_id: "763374182806-7g4ufr9sr7dtur1ua16bihe4j9f6iga5.apps.googleusercontent.com"});
  });
