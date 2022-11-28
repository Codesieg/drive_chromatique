let fileNames = [];
let idFiles = [];
let newFolderId;
let mainNewFolder;
let firstFolder = false;

let newId;

// Get credentials
// let apiKey;
// let oAuth;
// let folderId;
// let driveId;
// let apiKey = "AIzaSyA3TUHMYHWTb7uPTn9LE8CIS_K4LfgeUH0";
// let oAuth = "763374182806-7g4ufr9sr7dtur1ua16bihe4j9f6iga5.apps.googleusercontent.com";
// let driveId = "" ;
// let folderId = "1UcNLgd4r1kq8uAfwa2dlHl09FuRZbjdl";

// let validate = document
//   .getElementById("validate")
//   .addEventListener("click", getCredentials);

// function getCredentials() {
//   apiKey = document.getElementById("apiKey").value;
//   oAuth = document.getElementById("oAuth").value;
//   driveId = document.getElementById("driveId").value;
//   folderId = document.getElementById("folderId").value;
//   console.log(
//     "apikey : " +
//       apiKey +
//       " oAuth : " +
//       oAuth +
//       " driveid : " +
//       driveId +
//       " folderId : " +
//       folderId
//   );

  gapi.load("client:auth2", function () {
    console.log("gapi loaded");
    gapi.auth2.init({ client_id: "763374182806-7g4ufr9sr7dtur1ua16bihe4j9f6iga5.apps.googleusercontent.com" }); // auth2 key authentification
  });

//   if (gapi.load) {
//     const btnCharger = document.getElementById("charger");
//     btnCharger.classList.remove("d-none");
//     const btnValidate = document.getElementById("validate");
//     console.log(btnValidate);
//     btnValidate.classList.add("d-none");
//   }
// }

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
  gapi.client.setApiKey("AIzaSyA3TUHMYHWTb7uPTn9LE8CIS_K4LfgeUH0"); // api key here
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
  // we begin to creat the new folder
  creatFirstFolder();
}

/**
 * Create a folder and prints the folder ID
 * @return{obj} folder Id
 * */
let filemetadata;
async function createFolder(newFolderName) {
  // Indiquer dans quels dossier créer le dossier de remplacement
fileMetadata = {
    name: newFolderName, // TODO : input pour le nom du dossier
    mimeType: "application/vnd.google-apps.folder",
    parents: [mainNewFolder],
  };
  try {
    const file = await gapi.client.drive.files.create({
      resource: fileMetadata,
      fields: "id",
    });

    newFolderId = file.result.id;
    console.log("Folder Id:", file.result.id);
    // listSubFolders(newFolderId);
    return file.result.id;
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}
/**
* Copy a folder 
* 
* */
async function copyFolder(parentId, copiedFolderId ) {
 // Indiquer dans quels dossier créer le dossier de remplacement
return gapi.client.drive.files.copy({
  "fileId": copiedFolderId,
  "resource": {
    "parents": [ parentId ]
}
})
    .then(function(response) {
            // Handle the results here (response.result has the parsed body).
            console.log("Response", response);
          },
          function(err) { console.error("Execute error", err); });
}

// Here function for move old folder to new folder
async function moveFolder() {
  // Create new folder
  //TODO : Needs to make a array with all id sub folders

  for (const idFile of idFiles) {
    console.log(idFile)
    try {
      // Retrieve the existing parents to move and remove
      const file = await gapi.client.drive.files.get({
        fileId: "1-AGaKDyle53S6ud5twedEsf39srw71ak",
        fields: "parents",
      });
      console.log(file);
      const previousParents = file.result.parents;
      console.log(previousParents);

      previousParents.map(function (parent) {
        return parent.id;
      })
      .join(",");
      // Move the file to the new folder
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

async function regenerateIdFolder() {
gapi.client.drive.files.generateIds({
    "count": 1
  })
  .then(
      function(response) {
        newId =  response.result.ids;
        console.log(newId["0"]);
        return newId["0"];
      }
  )
  try {
    const getFile = await gapi.client.drive.files.get({
      fileId: newFolderId,
    });
    console.log(getFile);
    const updateFile = await gapi.client.drive.files.update({
      fileId: newId,
      name: "chroma bis",
      fields: "id, parents",
    });
    console.log(updateFile);
    console.log("ok");
    //
  } catch (error) {
    console.log("too bad");
  }
}

async function creatFirstFolder() {
  // creating the new folder 
  fileMetadata = {
    name: "new folder 271122", // TODO : input pour le nom du dossier
    mimeType: "application/vnd.google-apps.folder",
  };
  // TODO : explain why firstfolder is needed
    firstFolder == false;
    const file = await gapi.client.drive.files.create({
      resource: fileMetadata,
      fields: "id",
    });
    mainNewFolder = file.result.id;
    console.log("Folder Id:", file.result.id);
}

function listFolders() {
  return gapi.client.drive.files
    .list({
      includeItemsFromAllDrives: false,
      fields: "files(id, name, parents, webViewLink)", // fields we want to include
      q: `'1E4HZZh1aysmnhpklWkaUzoVUO0vwuE_W' in parents`,
    })
    .then(
      function (response) {
        // Handle the results here (response.result has the parsed body).
        let allFiles = response.result.files;
        for (const file of allFiles) {
          fileNames.push(file.name);
          idFiles.push(file.id);
          const getUl = document.querySelector("#list-manga-dir");
          let creatLi = document.createElement("li");
          let creatA = document.createElement("a");
          let creatSpan = document.createElement("span");

          creatLi.classList.add("list-manga-dir");

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
          console.log("Id : ", file["id"]);
          createFolder( file["name"] );
        } 
        console.log(idFiles);
        console.log("Response", response.result.files);
      },
      function (err) {
        console.error("Execute error", err);
      }
    );
}

function listSubFolders(subFoldersId) {
  return gapi.client.drive.files
  .list({
    includeItemsFromAllDrives: false,
    fields: "files(id, name, parents, webViewLink)", // fields we want to include
    q: `'${subFoldersId}' in parents`,
  })
  .then(
    function (response) {
      // Handle the results here (response.result has the parsed body).
      let allFiles = response.result.files;
      for (const file of allFiles) {
        fileNames.push(file.name);
        idFiles.push(file.id);
        const getUl = document.querySelector("#list-manga-dir");
        let creatLi = document.createElement("li");
        let creatA = document.createElement("a");
        let creatSpan = document.createElement("span");

        creatLi.classList.add("list-manga-dir");

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
        createFolder(file["name"]);

      }
      console.log(idFiles);
      console.log("Response", response.result.files);
    },
    function (err) {
      console.error("Execute error", err);
    }
  );
}

// Besoin supp venir gérer le partage des dossiers et connecter le tout à autocode pour la maj des liens

// récupération de l'id du parent et liste de tous les dossiers présent
// Ajout des droits de partage par lien et récupération des liens des dossiers
// MAJ des liens dans autocode



