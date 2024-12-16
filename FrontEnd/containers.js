const body = document.querySelector("body")
const mainContainer = document.querySelector("main")

// CREATION DE LA PAGE DE LOGIN
export function genererLogin() {
    
    const mainContainer = document.querySelector("main")
    mainContainer.id = "main-login"
    const loginTitle = document.createElement("h2")
    loginTitle.innerText = "Log In"
    const loginForm = document.createElement("form")
    loginForm.id = "connexion-form"
    const labelEmailLogin = document.createElement("label")
    labelEmailLogin.for = "email"
    labelEmailLogin.innerText = "E-mail"
    const inputEmailLogin = document.createElement("input")
    inputEmailLogin.id = "email"
    inputEmailLogin.type = "text"
    inputEmailLogin.name = "email"
    const labelMDPLogin = document.createElement("label")
    labelMDPLogin.for = "motDePasse"
    labelMDPLogin.innerText = "Mot de passe"
    const inputMDPLogin = document.createElement("input")
    inputMDPLogin.id = "motDePasse"
    inputMDPLogin.type = "password"
    inputMDPLogin.name = "motDePasse"
    const btnLogin = document.createElement("button")
    btnLogin.id = "btn-connexion"
    btnLogin.innerText = "Se connecter"
    const mdpOublie = document.createElement("a")
    mdpOublie.href = "#"
    mdpOublie.innerText = "Mot de passe oublié"
    

    mainContainer.appendChild(loginTitle)
    mainContainer.appendChild(loginForm)
    loginForm.appendChild(labelEmailLogin)
    loginForm.appendChild(inputEmailLogin)
    loginForm.appendChild(labelMDPLogin)
    loginForm.appendChild(inputMDPLogin)
    loginForm.appendChild(btnLogin)
    mainContainer.appendChild(mdpOublie)
}

// GENERER INTRODUCTION
export function genererIntroduction() {
    const sectionIntro = document.createElement("section")
    sectionIntro.id = "introduction"
    const imgIntro = document.createElement("img")
    imgIntro.src = "./assets/images/sophie-bluel.png"
    imgIntro.alt = ""
    const articleIntro = document.createElement("article")
    const titreIntro = document.createElement("h2")
    titreIntro.innerText = "Designer d'espace"
    const p1Intro = document.createElement("p")
    p1Intro.innerText = "Je raconte votre histoire, je valorise vos idées. Je vous accompagne de la conception à la livraison finale du chantier."
    const p2Intro = document.createElement("p")
    p2Intro.innerText = "Chaque projet sera étudié en commun, de façon à mettre en valeur les volumes, les matières et les couleurs dans le respect de l’esprit des lieux et le choix adapté des matériaux.Le suivi du chantier sera assuré dans le souci du détail, le respect du planning et du budget."
    const p3Intro = document.createElement("p")
    p3Intro.innerText = "En cas de besoin, une équipe pluridisciplinaire peut - être constituée: architecte DPLG, décorateur(trice)"

    mainContainer.appendChild(sectionIntro)
    sectionIntro.appendChild(imgIntro)
    sectionIntro.appendChild(articleIntro)
    articleIntro.appendChild(titreIntro)
    articleIntro.appendChild(p1Intro)
    articleIntro.appendChild(p2Intro)
    articleIntro.appendChild(p3Intro)
}

// GENERER PORTFOLIO
export function genererPortfolio() {
    const sectionPortfolio = document.createElement("section")
    sectionPortfolio.id = "portfolio"
    const titrePortfolio = document.createElement("h2")
    titrePortfolio.id = "titre-portfolio"
    titrePortfolio.innerText = "Mes Projets"
    const btnPortfolio = document.createElement("div")
    btnPortfolio.classList.add("buttons")
    const galleryPortofolio = document.createElement("div")
    galleryPortofolio.classList.add("gallery")

    mainContainer.appendChild(sectionPortfolio)
    sectionPortfolio.appendChild(titrePortfolio)
    sectionPortfolio.appendChild(btnPortfolio)
    sectionPortfolio.appendChild(galleryPortofolio)
}

// CREATION DES BOUTONS
export function genererBoutons(categories) {
    const divButtons = document.querySelector(".buttons")
    const btnAll = document.createElement("button")
    btnAll.id = "btn-all"
    btnAll.classList.add("btn-filter")
    btnAll.innerText = "Tous"
    divButtons.appendChild(btnAll)
    for (let i = 0; i < categories.length; i++) {   
        const button = categories[i]
        const elementCategorie = document.createElement("button")
        elementCategorie.setAttribute("class", "btn-filter btn" + categories[i].id)
        elementCategorie.setAttribute("id", categories[i].id)
        const buttonName = button.name
        divButtons.appendChild(elementCategorie)
        elementCategorie.innerText = buttonName
    }
}

// ON GENERE LES DIFFERENTS PROJETS
export function genererProjects(projects) {

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

// CREATION DU FORMULAIRE DE CONTACT
export function genererFormContact() {
    const sectionContact = document.createElement("section")
    sectionContact.id = "contact"
    const titreContact = document.createElement("h2")
    titreContact.innerText = "Contact"
    const sousTitreContact = document.createElement("p")
    sousTitreContact.innerText = "Vous avez un projet ? Discutons-en !"
    const formContact = document.createElement("form")
    formContact.action = "#"
    formContact.method = "post"
    const labelNomContact = document.createElement("label")
    labelNomContact.for = "name"
    labelNomContact.innerText = "Nom"
    const inputNomContact = document.createElement("input")
    inputNomContact.type = "text"
    inputNomContact.name = "name"
    inputNomContact.id = "name"
    const labelEmailContact = document.createElement("label")
    labelEmailContact.for = "email"
    labelEmailContact.innerText = "Email"
    const inputEmailContact = document.createElement("input")
    inputEmailContact.type = "email"
    inputEmailContact.name = "email"
    inputEmailContact.id = "email"
    const labelMessageContact = document.createElement("label")
    labelMessageContact.for = "message"
    labelMessageContact.innerText = "Message"
    const textareaContact = document.createElement("textarea")
    textareaContact.name = "message"
    textareaContact.id = "message"
    textareaContact.cols = "30"
    textareaContact.rows = "10"
    const submitContact = document.createElement("input")
    submitContact.type = "submit"
    submitContact.value = "Envoyer"

    mainContainer.appendChild(sectionContact)
    sectionContact.appendChild(titreContact)
    sectionContact.appendChild(sousTitreContact)
    sectionContact.appendChild(formContact)
    formContact.appendChild(labelNomContact)
    formContact.appendChild(inputNomContact)
    formContact.appendChild(labelEmailContact)
    formContact.appendChild(inputEmailContact)
    formContact.appendChild(labelMessageContact)
    formContact.appendChild(textareaContact)
    formContact.appendChild(submitContact)  
}

// CREATION BANDEAU 
export function genererBandeau(){
    const bandeau = document.createElement("div")
    bandeau.id = "bandeau"
    bandeau.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>'
    const textBandeau = document.createElement("p")
    textBandeau.innerText = "Mode édition"
    
    body.prepend(bandeau)
    bandeau.appendChild(textBandeau)
}