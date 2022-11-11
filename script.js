let fileNames = [];
let idFiles = [];
let newFolderId;

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
  const file =  gapi.client.drive.files.get({
    fileId: "1VR3moGu3ePANqR1iwK0iHZeqAvbeetF1",
  
  });
  console.log(file);
  return gapi.client.drive.files
    .list({
      // supportsAllDrives: true,
      includeItemsFromAllDrives: false,
      // corpora: "drive",
      // driveId: "0AIO1nysW2cHkUk9PVA", // ID of drive to connect
      fields: "files(id, name, parents, webViewLink)", // fields we want to include
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
        }
        console.log(idFiles);
        console.log("Response", response.result.files);
      },
      function (err) {
        console.error("Execute error", err);
      }
    );
}

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
  // createFolder(newFolderId);

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

// Besoin supp venir gérer le partage des dossiers et connecter le tout à autocode pour la maj des liens

// récupération de l'id du parent et liste de tous les dossiers présent
// Ajout des droits de partage par lien et récupération des liens des dossiers
// MAJ des liens dans autocode



