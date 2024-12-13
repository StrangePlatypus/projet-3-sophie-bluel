// RECUPERATION DES PROJETS

// Mise en place d'une récupération localStorage
let projects = window.localStorage.getItem('projects')
// Si le localStorage est vide, récupération sur l'API
if (projects === null) {
    const reponse = await fetch("http://localhost:5678/api/works")
    projects = await reponse.json()
    //Transformation des pièces en format JSON
    const valeurProjects = JSON.stringify(projects)
    // Stockage des informations dans le localStorage
    window.localStorage.setItem('projects', valeurProjects)
} else {
    // On utilise les données de 'projets'
    projects = JSON.parse(projects)
}


// ON GENERE LES DIFFERENTS PROJETS

function genererProjects(projects) {
    for (let i = 0; i < projects.length; i++) {
        const figure = projects[i]
        const divGallery = document.querySelector(".gallery")
        // Création d'une balise "figure" pour chaque projet
        const elementProject = document.createElement("figure")
        elementProject.dataset.id = projects[i].id
        // Création des balises
        const imageProject = document.createElement("img")
        imageProject.src = figure.imageUrl
        const captionProject = document.createElement("figcaption")
        captionProject.innerText = figure.title
        // Incrémentation des balises à la div "gallery"
        divGallery.appendChild(elementProject)
        elementProject.appendChild(imageProject)
        elementProject.appendChild(captionProject)
    }
}

genererProjects(projects)

// RECUPERATION DES CATEGORIES
let categories = window.localStorage.getItem('categories')
if (categories === null) {
    let response = await fetch("http://localhost:5678/api/categories")
    categories = await response.json()
    const valeurCategories = JSON.stringify(categories)
    window.localStorage.setItem('categories', valeurCategories)
} else {
    categories = JSON.parse(categories)
}

// CREATION DES BOUTONS
function genererBoutons(categories) {
    for (let i = 0; i < categories.length; i++) {
        const button = categories[i]
        const divButtons = document.querySelector(".buttons")
        const elementCategorie = document.createElement("button")
        elementCategorie.setAttribute("class", "btn-filter btn" + categories[i].id)
        elementCategorie.setAttribute("id", categories[i].id)
        const buttonName = button.name
        divButtons.appendChild(elementCategorie)
        elementCategorie.innerText = buttonName
    }
}

genererBoutons(categories)

// GESTION DES BOUTONS

// Bouton "TOUS"
const btnAll = document.querySelector("#btn-all")
// Au clic, on affiche tous les projets
btnAll.addEventListener("click", function () {
    document.querySelector(".gallery").innerHTML = "";
    genererProjects(projects)
})

// Bouton "OBJETS"
const btnObjects = document.querySelector(".btn1")

btnObjects.addEventListener("click", function () {
    const projectsObjects = projects.filter(function (projects) {
        return projects.categoryId == btnObjects.id
    })
    document.querySelector(".gallery").innerHTML = ""
    genererProjects(projectsObjects)
})

// Bouton "APPARTEMENTS"
const btnApartments = document.querySelector(".btn2")

btnApartments.addEventListener("click", function () {
    const projectsApartments = projects.filter(function (projects) {
        return projects.categoryId == btnApartments.id
    })
    document.querySelector(".gallery").innerHTML = ""
    genererProjects(projectsApartments)
})


// Bouton "HOTEL & RESTAURANT"
const btnHotelRest = document.querySelector(".btn3")

btnHotelRest.addEventListener("click", function () {
    const projectsHotelRest = projects.filter(function (projects) {
        return projects.categoryId == btnHotelRest.id
    })
    document.querySelector(".gallery").innerHTML = ""
    genererProjects(projectsHotelRest)
})
