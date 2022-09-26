let fileNames = [];

function authenticate() {
  return gapi.auth2
    .getAuthInstance()
    .signIn({
      scope:
        "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.readonly",
    })
    .then(
      function () {
        console.log("Sign-in successful");
      },
      function (err) {
        console.error("Error signing in", err);
      }
    );
}
function loadClient() {
  gapi.client.setApiKey(API_KEY); // api key here
  return gapi.client
    .load("https://content.googleapis.com/discovery/v1/apis/drive/v3/rest")
    .then(
      function () {
        console.log("GAPI client loaded for API");
      },
      function (err) {
        console.error("Error loading GAPI client for API", err);
      }
    );
}
// Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
  return (
    gapi.client.drive.files
      // .get({
      //   supportsAllDrives: true,
      //   fileId: "1OPtsPWZ9uz2zMkodRXqQLox9If9K2U1F",
      // })
      .list({
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
        corpora: "drive",
        driveId: DRIVE_ID, // ID of drive to connect
        fields: "files(id, name, parents, webViewLink)", // fields we want to include
        q: `'${FOLDER_ID}' in parents and trashed = false`, // Find only in chromatique folder
        pagesize: 3,
      })
      .then(
        function (response) {
          // Handle the results here (response.result has the parsed body).
          let allFiles = response.result.files;
          console.log(allFiles);

          for (const file of allFiles) {
            fileNames.push(file.name);
            const getUl = document.querySelector(".list-manga-dir");
            let creatLi = document.createElement("li");
            let creatA = document.createElement("a");

            creatA.setAttribute("href", file["webViewLink"]);
            creatA.textContent = file["name"];
            getUl.appendChild(creatLi);
            const getElementLi = getUl.lastChild;
            console.log(creatA);
            getElementLi.appendChild(creatA);

            console.log("Nom : ", file["name"]);
            console.log("Link : ", file["webViewLink"]);
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
        function (err) {
          console.error("Execute error", err);
        }
      )
  );
}
gapi.load("client:auth2", function () {
  gapi.auth2.init({ client_id: AUTH }); // auth2 key authentification
});

/**
 * Create a folder and prints the folder ID
 * @return{obj} folder Id
 * */
async function createFolder() {
  // TODO: Récupérer tout les nom de dossier dans un tableau

  // TODO : Création d'une boucle pour créer tout les dossiers.

  // TODO : Création des dossiers
  // Indiquer dans quels dossier créer les dossier de remplacement
  // for (const fileName of fileNames) {
  const fileMetadata = {
    // name: fileName,
    name: "#1 Dossier déplacement pour new lien.",
    mimeType: "application/vnd.google-apps.folder",
    // parents: [FOLDER_ID],
  };
  try {
    const file = await gapi.client.drive.files.create({
      resource: fileMetadata,
      fields: "id",
    });
    console.log("Folder Id:", file.result.id);
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}
// }

// Here function for move old folder to new folder
async function moveFolder() {
  //TODO : Needs to make a array with all id sub folders
  try {
    // Retrieve the existing parents to remove
    const file = await gapi.client.drive.files.get({
      fileId: FOLDER_ID,
      fields: "parents",
    });
    console.log(file);
    // Move the file to the new folder
    const previousParents = file.result.parents
      .map(function (parent) {
        return parent.id;
      })
      .join(",");
    const files = await gapi.client.drive.files.update({
      fileId: "1B2kcn0ErNiziL8f3chdNDKvI1yFk4qjl",
      addParents: "157dD_TNjwE6UmSe6p2i4tFMEp4nZGhYA",
      removeParents: previousParents,
      fields: "id, parents",
    });

    return files.status;
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}
