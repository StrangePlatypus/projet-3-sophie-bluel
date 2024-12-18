// On dit que allProjects est un tableau (format Array)
let allProjects = []
// On dit que allCategories est un objet Set() pour y stocker les valeurs plus tard
const allCategories = new Set()
const gallery = document.querySelector(".gallery")
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
        filtre.addEventListener("click", function(event) {
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

function ajoutListenerLogout(){
    const linkLogout = document.getElementById("btn-logout")
    linkLogout.addEventListener("click", function(){
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
function modifierPage(){
    const bandeau = document.getElementById("bandeau")
        bandeau.classList.remove("hidden")
        const linkLogin = document.getElementById("btn-login")
        linkLogin.id = "btn-logout"
        linkLogin.innerText = "logout"
        const titrePortfolio = document.getElementById("titre-portfolio")
        const btnModifier = document.createElement("button")
        btnModifier.classList.add("btn-modifier")
        btnModifier.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier'
        titrePortfolio.after(btnModifier)
}


// GESTION DE LA MODALE //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ajoutListenerModifier(){
    const btnModifier = document.querySelector(".btn-modifier")
    btnModifier.addEventListener("click", function(event){
        event.preventDefault()
        // création modale  
    })
}

// function genererModale(){}
