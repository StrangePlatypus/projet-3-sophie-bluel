import {genererBandeau, genererFormContact, genererLogin, genererIntroduction, genererPortfolio, genererBoutons, genererProjects } from "./containers.js"


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

const mainContainer = document.querySelector("main")

genererIntroduction()
genererPortfolio()
genererBoutons(categories)
genererProjects(projects)
genererFormContact()

// GESTION DES BOUTONS /////////////////////////////////////////////////////////////////

// Bouton "TOUS"
const btnAll = document.querySelector("#btn-all")
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

// GESTION DE LA PAGE DE CONNEXION /////////////////////////////////////////////////////

function ajoutListenerConnexion() {
    const loginForm = document.querySelector("#connexion-form")
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault()
        const infosLogin = {
            email: event.target.querySelector('[name=email').value,
            password: event.target.querySelector('[name=motDePasse]').value
        }
        const infoLoginJSON = JSON.stringify(infosLogin)
        const response = fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json"
            },
            body: infoLoginJSON
        }).then((response) =>{
        console.log(response.ok)
        if (response.ok == true) {
            console.log("ok")
            const mainContainer = document.getElementById("main-login")
            mainContainer.innerHTML = ""
            mainContainer.id = ""
            const linkLogin = document.getElementById("btn-login-gras")
            linkLogin.id = "btn-logout"
            linkLogin.innerText = "logout"
            genererBandeau()
            genererIntroduction()
            genererPortfolio()
            genererProjects(projects)
            const titrePortfolio = document.getElementById("titre-portfolio")
            const btnModifier = document.createElement("a")
            btnModifier.href = "#"
            btnModifier.classList.add("btn-modifier")
            btnModifier.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Modifier'
            titrePortfolio.after(btnModifier)
        } else {
            const btnLogin = document.getElementById("btn-connexion")
            const messageErreur = document.createElement("p")
            messageErreur.innerText = "Erreur dans l’identifiant ou le mot de passe"
            btnLogin.before(messageErreur)
            console.log(messageErreur)
        }
    })
    })
}

const linkLogin = document.getElementById("btn-login")
linkLogin.addEventListener("click", function(){
    linkLogin.id = "btn-login-gras"
    mainContainer.innerHTML = ""
    genererLogin()
    ajoutListenerConnexion()
})

const linkAccueil = document.getElementById("logo")
linkAccueil.addEventListener("click", function(){
    mainContainer.id = ""
    linkLogin.id = "btn-login"
    mainContainer.innerHTML = ""
    genererIntroduction()
    genererPortfolio()
    genererBoutons(categories)
    genererProjects(projects)
    genererFormContact()
})

