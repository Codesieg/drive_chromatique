let fileNames = [];
let idFiles = [];
let newFolderId;

// Get credentials
let apiKey;
let oAuth;
let folderId;
let driveId;

let validate = document
  .getElementById("validate")
  .addEventListener("click", getCredentials);

function getCredentials() {
  apiKey = document.getElementById("apiKey").value;
  oAuth = document.getElementById("oAuth").value;
  driveId = document.getElementById("driveId").value;
  folderId = document.getElementById("folderId").value;
  console.log(
    "apikey : " +
      apiKey +
      " oAuth : " +
      oAuth +
      " driveid : " +
      driveId +
      " folderId : " +
      folderId
  );
}

// authenticate to google
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
  gapi.client.setApiKey(apiKey); // api key here
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
      //   fileId: "1OPtsPWZ9uz2zMkodRXqQLoxf9K2U1F",
      // })
      .list({
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
        corpora: "drive",
        driveId: driveId, // ID of drive to connect
        fields: "files(id, name, parents, webViewLink)", // fields we want to include
        q: `'${FOLDER_ID}' in parents and trashed = false`, // Find only in chromatique folder
        pagesize: 3,
      })
      .then(
        function (response) {
          // Handle the results here (response.result has the parsed body).
          let allFiles = response.result.files;
          for (const file of allFiles) {
            fileNames.push(file.name);
            idFiles.push(file.id);
            const getUl = document.querySelector(".list-manga-dir");
            let creatLi = document.createElement("li");
            let creatA = document.createElement("a");
            let creatSpan = document.createElement("span");

            creatA.setAttribute("href", file["webViewLink"]);
            creatA.textContent = file["name"];
            creatSpan.textContent = " - " + file["id"];
            getUl.appendChild(creatLi);
            const getElementLi = getUl.lastChild;
            console.log(creatA);
            getElementLi.appendChild(creatA);
            getElementLi.appendChild(creatSpan);

            console.log("Nom : ", file["name"]);
            console.log("Link : ", file["webViewLink"]);
          }
          console.log(idFiles);
          console.log("Response", response.result.files);
        },
        function (err) {
          console.error("Execute error", err);
        }
      )
  );
}
gapi.load("client:auth2", function () {
  gapi.auth2.init({ client_id: oAuth }); // auth2 key authentification
});

/**
 * Create a folder and prints the folder ID
 * @return{obj} folder Id
 * */
async function createFolder() {
  // Indiquer dans quels dossier créer le dossier de remplacement
  const fileMetadata = {
    // name: fileName,
    name: "#1 Dossier déplacement pour new lien.", // TODO : input pour le nom du dossier
    mimeType: "application/vnd.google-apps.folder",
    // parents: [FOLDER_ID],
  };
  try {
    const file = await gapi.client.drive.files.create({
      resource: fileMetadata,
      fields: "id",
    });
    newFolderId = file.result.id;
    console.log("Folder Id:", file.result.id);

    return file.result.name;
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}

// Here function for move old folder to new folder
async function moveFolder() {
  // Create new folder
  createFolder(newFolderId);

  //TODO : Needs to make a array with all id sub folders

  for (const idFile of idFiles) {
    try {
      // Retrieve the existing parents to remove
      const file = await gapi.client.drive.files.get({
        fileId: folderId,
        fields: "parents",
      });
      // Move the file to the new folder
      const previousParents = file.result.parents
        .map(function (parent) {
          return parent.id;
        })
        .join(",");
      const files = await gapi.client.drive.files.update({
        fileId: idFile,
        addParents: newFolderId,
        removeParents: previousParents,
        fields: "id, parents",
      });

      console.log("Folder Id:", idFile + " déplacé ");
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

  // TODO : Renomer le nouveau dossier, supprimer l'ancien puis créer le prochain
}

async function renameFolder() {
  try {
    const getFile = await gapi.client.drive.files.get({
      fileId: newFolderId,
    });
    const updateFile = await gapi.client.drive.files.update({
      fileId: newFolderId,
      name: "chroma bis",
      fields: "id, parents",
    });
    console.log("ok");

    const deleteFile = await gapi.client.drive.files.delete({
      fileId: folderId,
    });
    console.log(folderId + " deleted");

    //
  } catch (error) {
    console.log("too bad");
  }
}
