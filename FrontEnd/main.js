// On dit que allProjects est un tableau (format Array)
let allProjects = []
// On dit que allCategories est un objet Set() pour y stocker les valeurs plus tard
const allCategories = new Set()
const gallery = document.querySelector(".gallery")
let token = sessionStorage.getItem("token")
let userId = sessionStorage.getItem("userId")
let newProject = {
    image: "string",
    title: "string",
    category: "integer"
}


async function initAccueil() {
    // On récupère les données de works et categories
    allProjects = await getData("works")
    const categories = await getData("categories")
    // On ajoute chaque catégorie de la liste des catégories récupérées à la variable AllCategories
    for (const cat of categories) {
        allCategories.add(cat)
    }
    // On génère tous les projets
    genererProjects()
    // Si on a le token, la page change et on ajoute l'eventListener du bouton logout
    if (token !== null) {
        modifierPage()
        ajoutListenerLogout()
        // Sinon, on génère les boutons et on ajoute l'eventListener du bouton login
    } else {
        genererBoutons()
        ajoutListenerLogin()
    }
}

initAccueil()

// RECUPERATION DES PROJETS ET DES CATEGORIES ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// En fonction du type de données souhaité
async function getData(type) {
    try {
        // On récupère via l'API les données du type voulu (categories ou works)
        const reponse = await fetch(`http://localhost:5678/api/${type}`)
        return reponse.json()
    } catch {
        // En cas d'erreur lors de la récupération on renvoie un console.log
        console.log(`Erreur lors de la récupérations des ${type}`, error)
    }
}

// ON GENERE LES PROJETS
function genererProjects(filter = 0) {
    let filteredProjects = allProjects
    if (filter != 0) {
        filteredProjects = filteredProjects.filter(projects => projects.categoryId == filter)
    }
    gallery.innerHTML = ""
    const fragment = document.createDocumentFragment()
    for (const project of filteredProjects) {
        const figure = document.createElement("figure")
        figure.dataset.id = project.id
        figure.innerHTML = `<img src="${project.imageUrl}" alt="${project.title}">
                            <figcaption>${project.title}</figcaption>`
        fragment.appendChild(figure)
    }
    gallery.appendChild(fragment)
}

// GESTION DES BOUTONS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function genererBoutons() {
    const divButtons = document.querySelector(".buttons")
    // création d'un fragment pour améliorer le web reflow
    const fragment = document.createDocumentFragment()
    // On crée le bouton 'Tous' (catégorie qui existe pas dans l'API)
    const btnAll = document.createElement("button")
    btnAll.classList.add("btn-filter")
    btnAll.classList.add("btn-selected")
    btnAll.dataset.id = 0
    btnAll.textContent = "Tous"
    fragment.appendChild(btnAll)
    // Pour chaque categorie de toutes les catégories, on crée un élément button avec un data-id = categorie.id
    for (const categorie of allCategories) {
        const button = document.createElement("div")
        button.classList.add("btn-filter")
        button.textContent = categorie.name
        button.dataset.id = categorie.id
        fragment.appendChild(button)
    }
    // On inscrit le fragment dans la div et on ajout le eventListener
    divButtons.appendChild(fragment)
    ajoutListenerFiltres()
}

function ajoutListenerFiltres() {
    const filtres = document.querySelectorAll(".btn-filter")
    // Pour chaque filtre parmi les filtres
    for (const filtre of filtres) {
        filtre.addEventListener("click", function (event) {
            // On empêche la page de s'actualiser
            event.preventDefault()
            // On récupère le data-id du bouton qui a été cliqué
            const button = event.target
            const buttonId = button.dataset.id
            // On génére les projets en fonction du data-id du bouton cliqué
            genererProjects(buttonId)
            // On modifie la class du bouton qui était selectionné et... 
            document.querySelector(".btn-selected").classList.remove("btn-selected")
            // ... On l'ajoute au bouton qui vient d'être cliqué
            button.classList.add("btn-selected")
        }
        )
    }
}

// GESTION DES BOUTONS LOGIN LOGOUT //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ajoutListenerLogin() {
    const linkLogin = document.getElementById("btn-login")
    linkLogin.addEventListener("click", function () {
        window.location.href = "login.html"
    })
}

function ajoutListenerLogout() {
    const linkLogout = document.getElementById("btn-logout")
    linkLogout.addEventListener("click", function () {
        const bandeau = document.getElementById("bandeau")
        bandeau.classList.add("hidden")
        linkLogout.id = "btn-login"
        linkLogout.innerText = "login"
        const btnModifier = document.querySelector(".btn-modifier")
        btnModifier.innerHTML = ""
        ajoutListenerLogin()
        sessionStorage.clear()
        genererBoutons()
        ajoutListenerLogin()
    })
}

// MODIFICATION DE LA PAGE APRES CONNEXION //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function modifierPage() {
    const bandeau = document.getElementById("bandeau")
    bandeau.classList.remove("hidden")
    const linkLogin = document.getElementById("btn-login")
    linkLogin.id = "btn-logout"
    linkLogin.innerText = "logout"
    const titrePortfolio = document.getElementById("titre-portfolio")
    const btnModifier = document.createElement("button")
    btnModifier.classList.add("btn-modifier", "modal-trigger")
    btnModifier.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier'
    titrePortfolio.after(btnModifier)
    ajoutListenerModifier()
    genererPhotosModale()
    afficherFormulaireNouveauProjet()
}

// GESTION DE LA MODALE //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ajoutListenerModifier() {
    const btnModifier = document.querySelector(".btn-modifier")
    btnModifier.addEventListener("click", function (event) {
        event.preventDefault()
        const modaleContainer = document.querySelector(".modal-container")
        modaleContainer.classList.remove("hidden")
        ajoutListenerModalTrigger()
    })
}

function refreshModale() {
    const titreModale = document.querySelector(".titre-modale")
    titreModale.innerText = "Galerie photo"
    const btnValider = document.querySelector("#btn-valider")
    btnValider.classList.add("hidden")
    btnValider.classList.remove("btn-available")
    const btnAdd = document.querySelector("#btn-add-modale")
    btnAdd.classList.remove("hidden")
    const formNouveauProjet = document.querySelector("#formNouveauProjet")
    formNouveauProjet.classList.add("hidden")
    const title = document.getElementById("titreNouveauProjet")
    title.value = ""
    const projetsModale = document.getElementById("projets-modale")
    projetsModale.classList.remove("hidden")
    const btnBack = document.querySelector(".back-modale")
    btnBack.classList.add("hidden")
    const divInput = document.querySelector("#img-input")
    divInput.classList.remove("hidden")
    const divUpload = document.querySelector("#img-upload")
    divUpload.classList.add("hidden")
    divUpload.innerHTML = ""
}

function ajoutListenerModalTrigger() {
    const modalTrigger = document.querySelectorAll(".modal-trigger")
    modalTrigger.forEach(trigger => trigger.addEventListener("click", function () {
        const modaleContainer = document.querySelector(".modal-container")
        modaleContainer.classList.add("hidden")
        refreshModale()
        refreshNewProject()
        ajoutListenerModifier()
    }))
}

async function genererPhotosModale() {
    const projetsModale = document.querySelector("#projets-modale")
    projetsModale.innerHTML = ""
    allProjects = await getData("works")
    const fragment = document.createDocumentFragment()
    for (let i = 0; i < allProjects.length; i++) {
        const figure = document.createElement("figure")
        figure.classList.add("figure-modale")
        figure.innerHTML = `<img src="${allProjects[i].imageUrl}" alt="${allProjects[i].title}">`
        const trashBtn = document.createElement("button")
        trashBtn.classList.add("trash-btn")
        trashBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`
        trashBtn.id = allProjects[i].id
        figure.appendChild(trashBtn)
        fragment.appendChild(figure)
    }
    projetsModale.appendChild(fragment)
    ajoutListenerDelete()
    ajoutListenerProjetUpload()
}

function ajoutListenerBack() {
    const btnBack = document.querySelector(".back-modale")
    btnBack.addEventListener("click", function () {
        refreshModale()
        refreshNewProject()
    })
}

// GESTION AJOUT ET SUPPRESSION DE PROJETS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function refreshNewProject() {
    newProject = {
        title: "string",
        imageUrl: "string",
        categoryId: "string",
    }
}

function ajoutListenerDelete() {
    const deleteButtons = document.querySelectorAll(".trash-btn")
    deleteButtons.forEach(deleteButton => {
        deleteButton.addEventListener("click", function () {
            const projectId = deleteButton.id
            fetch(`http://localhost:5678/api/works/${projectId}`, {
                method: "DELETE",
                headers: {
                    "accept": "/",
                    "Authorization": `Bearer ${token}`,
                    "resquestContent-Type": "multipart/form-data"
                }
            }).then((response) => {
                if (response.ok) {
                    alert("Projet supprimé avec succès.")
                } else {
                    alert("Erreur " + response.status + " lors de la suppression du projet.")
                }
                genererPhotosModale()
                genererProjects()
            })

        })
    })
}

function afficherFormulaireNouveauProjet() {
    const btnAjouter = document.querySelector("#btn-add-modale")
    btnAjouter.addEventListener("click", async function () {
        const projetsModale = document.querySelector("#projets-modale")
        projetsModale.classList.add("hidden")
        const btnBack = document.querySelector(".back-modale")
        btnBack.classList.remove("hidden")
        const btnValider = document.querySelector("#btn-valider")
        btnValider.classList.remove("hidden")
        const titreModale = document.querySelector(".titre-modale")
        titreModale.innerText = "Ajout photo"
        const btnAdd = document.querySelector("#btn-add-modale")
        btnAdd.classList.add("hidden")

        const formNouveauProjet = document.querySelector("#formNouveauProjet")
        formNouveauProjet.classList.remove("hidden")
        const listeCategories = document.getElementById("catNouveauProjet")
        listeCategories.innerHTML = ""
        const catNeutre = document.createElement("option")
        catNeutre.innerText = ""
        listeCategories.appendChild(catNeutre)
        const fragment = document.createDocumentFragment()
        const allCategories = await getData("categories")
        for (const categorie of allCategories) {
            const option = document.createElement("option")
            option.value = categorie.id
            option.innerText = categorie.name
            fragment.appendChild(option)
        }
        listeCategories.appendChild(fragment)
        ajoutListenerBack()
    })
}

function ajoutListenerProjetUpload() {
    const imgInput = document.getElementById("upload")
    imgInput.addEventListener("change", function () {
        const file = imgInput.files[0]
        const messageErreur = document.querySelector("#size-error")
        if (file != null) {
            const tailleOk = 4194304
            if (file.size > tailleOk) {
                messageErreur.classList.remove("hidden")
            } else {
                // Création de l'emplacement d'affichage de l'image
                const img = document.createElement("img")
                img.classList.add("choosen-img")
                img.file = file
                img.src = URL.createObjectURL(file)
                img.alt = img.title = file.name
                const divInput = document.querySelector("#img-input")
                divInput.classList.add("hidden")
                const divUpload = document.querySelector("#img-upload")
                divUpload.classList.remove("hidden")
                divUpload.appendChild(img)
                messageErreur.classList.add("hidden")
                enableBtnEnvoi()

                // Utilisation du FileReader pour lire m'image en tant qu'ArrayBuffer pour pouvoir analyser chaque octet
                const reader = new FileReader()
                reader.onload = function (event) {
                    const arrayBuffer = event.target.result
                    // Chaque élément de Uint8Array représente un octet de l'image
                    const binaryImg = new Uint8Array(arrayBuffer)
                    let binaryString = ""
                    // On parcoure ensuite chaque octet et on le convertit en sa représentation binaire avec byte.toString(2)
                    // .padStart(8, '0')garantit que chaque représentation binaire est longue de 8 bits, complétée par des zéros non significatifs si nécessaire
                    binaryImg.forEach(byte => {
                        binaryString += byte.toString(2).padStart(8, '0') + ''
                    })
                    newProject.image = binaryString
                }
                reader.readAsArrayBuffer(file)
            }
        }
    })
}

function enableBtnEnvoi() {
    const formNouveauProjet = document.getElementById("formNouveauProjet")
    formNouveauProjet.addEventListener("click", function () {
        const imgInput = document.getElementById("upload")
        const file = imgInput.files[0]
        const title = document.getElementById("titreNouveauProjet").value
        const select = document.getElementById("catNouveauProjet")
        const choixCat = select.options[select.selectedIndex].text
        if (file != null && title != undefined && choixCat != "") {
            const btnEnvoi = document.getElementById("btn-valider")
            btnEnvoi.classList.add("btn-available")
            btnEnvoi.removeAttribute("disabled")
            envoieNouveauProjetAPI()
        }
    })

}

function envoieNouveauProjetAPI() {
    const btnEnvoi = document.getElementById("btn-valider")
    btnEnvoi.addEventListener("click", e => {
        e.preventDefault()
        const title = document.getElementById("titreNouveauProjet").value
        const select = document.getElementById("catNouveauProjet")
        const idCat = select.options[select.selectedIndex].value
        newProject.title = title
        newProject.category = idCat
        console.log(newProject)
        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: newProject
        }).then((response) => {
            if (response.ok) {
                alert("Projet ajouté avec succès.")
            } else {
                alert("Erreur " + response.status + " lors de l'ajout du projet.")
            }
            refreshNewProject()
            const modaleContainer = document.querySelector(".modal-container")
            modaleContainer.classList.add("hidden")
            ajoutListenerModifier()
        })

    })
}