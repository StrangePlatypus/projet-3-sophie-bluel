// On dit que allProjects est un tableau (format Array)
let allProjects = []
// On dit que allCategories est un objet Set() pour y stocker les valeurs plus tard
const allCategories = new Set()
const gallery = document.querySelector(".gallery")
// Récupération du token depuis le sessionStorage
let token = sessionStorage.getItem("token")


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
    } else {
        // Sinon, on génère les boutons et on ajoute l'eventListener du bouton login
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
        // Dans la liste des projets, on sélectionne les projets dont la catégorie correspond au filtre choisi (seulement s'il est différent de 0)
        filteredProjects = filteredProjects.filter(projects => projects.categoryId == filter)
    }
    // Création d'un fragment dans lequel on met les différents projets correspondants
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
    divButtons.innerHTML = ""
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
    // Au click sur 'login', redirection vers la page de login
    const linkLogin = document.getElementById("btn-login")
    linkLogin.addEventListener("click", function () {
        window.location.href = "login.html"
    })
}

function ajoutListenerLogout() {
    const linkLogout = document.getElementById("btn-logout")
    linkLogout.addEventListener("click", function () {
        // Au click sur 'logout', on fait disparaître le bandeau..
        const bandeau = document.getElementById("bandeau")
        bandeau.classList.add("hidden")
        // .. on remet 'logout' en 'login' ..
        linkLogout.id = "btn-login"
        linkLogout.innerText = "login"
        // .. et on retire le bouton 'modifier'
        const titrePortfolio = document.getElementById("titre-portfolio")
        titrePortfolio.innerHTML = "Mes Projets"
        // On relance les fonctions nécessaires et on vide le sessionStorage
        ajoutListenerLogin()
        sessionStorage.clear()
        genererBoutons()
    })
}

// MODIFICATION DE LA PAGE APRES CONNEXION //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function modifierPage() {
    // Après connection on affiche le bandeau ..
    const bandeau = document.getElementById("bandeau")
    bandeau.classList.remove("hidden")
    // .. on passe 'login' en 'logout' ..
    const linkLogin = document.getElementById("btn-login")
    linkLogin.id = "btn-logout"
    linkLogin.innerText = "logout"
    // .. on crée le bouton 'modifier' ..
    const titrePortfolio = document.getElementById("titre-portfolio")
    const btnModifier = document.createElement("span")
    btnModifier.classList.add("btn-modifier", "modal-trigger")
    btnModifier.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier'
    titrePortfolio.appendChild(btnModifier)
    // .. et on lance les fonctions utiles à la gestion des projets
    ajoutListenerModifier()
    genererPhotosModale()
    afficherFormulaireNouveauProjet()
    ajoutListenerProjetUpload()
}

// GESTION DE LA MODALE //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ajoutListenerModifier() {
    // Au click sur 'modifier' on affiche la modale et on lance la gestion des évênements pour la fermer
    const btnModifier = document.querySelector(".btn-modifier")
    btnModifier.addEventListener("click", function (event) {
        event.preventDefault()
        const modaleContainer = document.querySelector(".modal-container")
        modaleContainer.classList.remove("hidden")
        ajoutListenerModalTrigger()
    })
}

function refreshModale() {

    // On retourne à l'affichage initial de la modale
    const titreModale = document.querySelector(".titre-modale")
    titreModale.innerText = "Galerie photo"
    const btnAdd = document.querySelector("#btn-add-modale")
    btnAdd.classList.remove("hidden")
    const projetsModale = document.getElementById("projets-modale")
    projetsModale.classList.remove("hidden")
    
    // On cache le bouton 'back', le formulaire et le bouton 'valider'
    const btnBack = document.querySelector(".back-modale")
    btnBack.classList.add("hidden")
    const formNouveauProjet = document.querySelector("#formNouveauProjet")
    formNouveauProjet.classList.add("hidden")
    const btnValider = document.querySelector("#btn-valider")
    btnValider.classList.add("hidden")
    btnValider.classList.remove("btn-available")

    // On re-affiche la div pour l'ajout de photo
    const divInput = document.querySelector(".img-input")
    divInput.classList.remove("hidden")
    
    // On vide les champs du formulaire même s'il n'a pas été envoyé et on cache/vide la div de preview
    const title = document.getElementById("titreNouveauProjet")
    title.value = ""
    const imgInput = document.getElementById("upload")
    imgInput.value = ""
    const divUpload = document.querySelector("#img-upload")
    divUpload.classList.add("hidden")
    divUpload.innerHTML = ""
}

function ajoutListenerModalTrigger() {
    const modalTrigger = document.querySelectorAll(".modal-trigger")
    modalTrigger.forEach(trigger => trigger.addEventListener("click", function () {
        // Pour chaque bouton 'trigger' existant, au click, on cache la modale
        const modaleContainer = document.querySelector(".modal-container")
        modaleContainer.classList.add("hidden")
        // Puis on la rafraichi, on réécoute le bouton 'modifier' et on actualise les projets
        refreshModale()
        ajoutListenerModifier()
        genererProjects()
    }))
}

async function genererPhotosModale() {
    const projetsModale = document.querySelector("#projets-modale")
    projetsModale.innerHTML = ""
    // On récupère les projets
    allProjects = await getData("works")
    const fragment = document.createDocumentFragment()
    // Pour chaque projet de la liste, on crée une figure avec une image, un alt et un bouton pour supprimer le projet
    for (let i = 0; i < allProjects.length; i++) {
        const figure = document.createElement("figure")
        figure.dataset.id = allProjects[i].id
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
    // On lance la fonction qui gère la suppression de projet
    ajoutListenerDelete()
}

function ajoutListenerBack() {
    // Au click sur le bouton 'back', on rafraichi la modale
    const btnBack = document.querySelector(".back-modale")
    btnBack.addEventListener("click", function () {
        refreshModale()
    })
}

// GESTION AJOUT ET SUPPRESSION DE PROJETS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function ajoutListenerDelete() {
    const deleteButtons = document.querySelectorAll(".trash-btn")
    deleteButtons.forEach(deleteButton => {
        // Pour chaque bouton de suppression, au click ..
        deleteButton.addEventListener("click", function () {
            // .. on récupère l'id du bouton ..
            const projectId = deleteButton.id
            // .. on supprime le projet ayant le même id dans l'API et ..
            fetch(`http://localhost:5678/api/works/${projectId}`, {
                method: "DELETE",
                headers: {
                    "accept": "/",
                    "Authorization": `Bearer ${token}`,
                    "resquestContent-Type": "multipart/form-data"
                }
            }).then((response) => {
                if (response.ok) {
                    // .. si ça fonctionne, on ouvre une pop-up et on affiche le projet dans la gallery ..
                    genererProjects()
                    const projects = document.querySelectorAll("figure")
                    projects.forEach(figure => {
                        if (figure.dataset.id === deleteButton.id) {
                            figure.remove()
                        }
                    })
                    alert("Projet supprimé avec succès.")
                } else {
                    // si ça ne fonctionne pas on ouvre une pop-up d'alerte avec le code d'erreur
                    alert("Erreur " + response.status + " lors de la suppression du projet.")
                }
                // dans tous les cas on regénèr les photos de la modale
                genererPhotosModale()
            })

        })
    })
}

function afficherFormulaireNouveauProjet() {
    // Au click sur le bouton 'ajouter photo' ..
    const btnAjouter = document.querySelector("#btn-add-modale")
    btnAjouter.addEventListener("click", async function () {
        // .. on cache les projets de la modale et on affiche le formulaire
        const projetsModale = document.querySelector("#projets-modale")
        projetsModale.classList.add("hidden")
        const btnAdd = document.querySelector("#btn-add-modale")
        btnAdd.classList.add("hidden")
        const titreModale = document.querySelector(".titre-modale")
        titreModale.innerText = "Ajout photo"
        const btnBack = document.querySelector(".back-modale")
        btnBack.classList.remove("hidden")
        const btnValider = document.querySelector("#btn-valider")
        btnValider.classList.remove("hidden")
        const formNouveauProjet = document.querySelector("#formNouveauProjet")
        formNouveauProjet.classList.remove("hidden")
        // on réinitialise la liste des catégories pour la balise 'select'
        const listeCategories = document.getElementById("catNouveauProjet")
        listeCategories.innerHTML = ""
        // on crée la catégorie 'neutre'
        const catNeutre = document.createElement("option")
        catNeutre.innerText = ""
        listeCategories.appendChild(catNeutre)
        // on récupère toutes les catégories et on les ajoute à la liste des options de 'select'
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

function listenerChangeImage() {
    // Au click sur le bouton pour retirer l'image séléctionnée ..
    const btn = document.querySelector(".change-img")
    btn.addEventListener("click", function (event) {
        event.preventDefault()
        // .. on retourne à l'affichage initial de l'input type='file' ..
        const divUpload = document.querySelector("#img-upload")
        divUpload.classList.add("hidden")
        divUpload.innerHTML = ""
        const divInput = document.querySelector(".img-input")
        divInput.classList.remove("hidden")
        // .. on vide l'input ..
        const imgInput = document.getElementById("upload")
        imgInput.value = ""
        // .. on remet le bouton 'valider' en disabled avec le css correspondant
        const btnEnvoi = document.getElementById("btn-valider")
        btnEnvoi.classList.remove("btn-available")
        btnEnvoi.addAttribute("disabled")
        // .. on relance la vérification pour rendre le bouton 'valider' enable
        enableBtnEnvoi()
    })
}

function ajoutListenerProjetUpload() {
    // Lors d'un changement de l'input type='file' ..
    const imgInput = document.getElementById("upload")
    imgInput.addEventListener("change", function () {
        const file = imgInput.files[0]
        const messageErreur = document.querySelector("#size-error")
        // .. si l'utilisateur a bien séléctionné un fichier, on vérifie sa taille ..
        if (file != null) {
            const tailleOk = 4 * 1048576
            if (file.size > tailleOk) {
                // .. s'il est trop lourd on affiche un message d'erreur ..
                messageErreur.classList.remove("hidden")
            } else {
                // .. sinon on affiche l'image en récupérant les informations du fichier
                const btn = document.createElement("button")
                btn.classList.add("change-img")
                btn.innerHTML = '<i class="fa-solid fa-trash-can fa-xl"></i>'

                const img = document.createElement("img")
                img.classList.add("choosen-img")
                img.file = file
                img.src = URL.createObjectURL(file)
                img.alt = img.title = file.name

                // on cache la partie input
                const divInput = document.querySelector(".img-input")
                divInput.classList.add("hidden")

                const divUpload = document.querySelector("#img-upload")
                divUpload.innerHTML = ""
                divUpload.classList.remove("hidden")
                divUpload.appendChild(img)
                divUpload.appendChild(btn)
                messageErreur.classList.add("hidden")
                enableBtnEnvoi()
                listenerChangeImage()
            }
        }
    })
}

function enableBtnEnvoi() {
    const formNouveauProjet = document.getElementById("formNouveauProjet")
    // Lors d'un changement dans le formulaire ..
    formNouveauProjet.addEventListener("change", function () {
        // .. on récupère les différents champs du formulaire ..
        const imgInput = document.getElementById("upload")
        const file = imgInput.files[0]
        const title = document.getElementById("titreNouveauProjet").value
        const select = document.getElementById("catNouveauProjet")
        const choixCat = select.options[select.selectedIndex].text
        if (file != null && title != undefined && choixCat != "") {
            // .. si ils sont tous remplis, on 'active' le bouton 'valider' ..
            const btnEnvoi = document.getElementById("btn-valider")
            btnEnvoi.classList.add("btn-available")
            btnEnvoi.removeAttribute("disabled")
            // .. et on lance la fonction pour l'envoi de nouveau projet
            nouveauProjetAPI()
        }
    })

}


function nouveauProjetAPI() {
    // Au click sur le bouton envoyer ..
    const btnEnvoi = document.getElementById("btn-valider")
    btnEnvoi.addEventListener("click", e => {
        e.preventDefault()

        // .. on récupère les données du formulaire ..
        const image = document.getElementById("upload").files[0];
        const titre = document.getElementById("titreNouveauProjet").value
        const select = document.getElementById("catNouveauProjet")
        const categoryId = select.options[select.selectedIndex].value

        // .. on les inscrit dans un formData() ..
        const formData = new FormData()
        formData.append("image", image)
        formData.append("title", titre)
        formData.append("category", categoryId)

        // .. et on lance l'envoi du nouveau projet à l'API avec ces informations
        envoieNouveauProjet(token, formData, titre)

        // "Rechargement" dynamique de la page
        const modaleContainer = document.querySelector(".modal-container")
        modaleContainer.classList.add("hidden")
        const figure = document.createElement("figure")
        const img = document.createElement("img")
        img.file = image
        img.src = URL.createObjectURL(image)
        img.alt = img.title = image.name
        const caption = document.createElement("figcaption")
        caption.innerText = titre
        figure.appendChild(img)
        figure.appendChild(caption)
        gallery.appendChild(figure)
        ajoutListenerModifier()
        genererPhotosModale()

    })
}

function envoieNouveauProjet(token, formData, titre) {
    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    }).then((response) => {
        if (response.ok) {
            // Si le projet est bien créé, on informe l'utilisateur et on rafraichi les photos de la modale 
            alert("Projet " + titre + " ajouté avec succès.")
            const projetsModale = document.querySelector("#projets-modale")
            projetsModale.innerHTML = ""
            genererPhotosModale()
        } else {
            // Sinon on affiche le code erreur
            alert("Erreur " + response.status + " lors de l'ajout du projet.")
        }
    }
    )
}