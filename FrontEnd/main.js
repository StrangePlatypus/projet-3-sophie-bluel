//  MISE EN PLACE DU MAIN CONTAINER
export function genererPageAccueil() {
    const mainContainer = document.querySelector("main")

    // Introduction
    const introduction = document.createElement("section")
    introduction.setAttribute("id", "introduction")
    const imgIntroduction = document.createElement("img")
    imgIntroduction.src = "./assets/images/sophie-bluel.png"
    const article = document.createElement("article")
    const h2Intro = document.createElement("h2")
    h2Intro.innerText = "Designer d'espace"
    const pIntro = document.createElement("p")
    pIntro.innerHTML = "Je raconte votre histoire, je valorise vos idées. Je vous accompagne de la conception à la livraison finale du chantier.<br><br>Chaque projet sera étudié en commun, de façon à mettre en valeur les volumes, les matières et les couleurs dans le respect de l’esprit des lieux et le choix adapté des matériaux.Le suivi du chantier sera assuré dans le souci du détail, le respect du planning et du budget.<br><br>En cas de besoin, une équipe pluridisciplinaire peut - être constituée: architecte DPLG, décorateur(trice)"
    // Portfolio
    const portfolio = document.createElement("section")
    portfolio.setAttribute("id", "portfolio")
    const titrePortfolio = document.createElement("h2")
    titrePortfolio.innerText = "Mes Projets"
    const boutons = document.createElement("div")
    boutons.setAttribute("class", "buttons")
    const btnAll = document.createElement("button")
    btnAll.setAttribute("id", "btn-all")
    btnAll.setAttribute("class", "btn-filter")
    btnAll.innerHTML = "Tous"
    const gallery = document.createElement("div")
    gallery.setAttribute("class", "gallery")

    // Contact


    // On incrémente les sections dans le main
    mainContainer.prepend(introduction)
    mainContainer.appendChild(portfolio)
    // Incrémentation section Introduction
    introduction.appendChild(imgIntroduction)
    introduction.appendChild(article)
    article.appendChild(h2Intro)
    article.appendChild(pIntro)
    // Incrémentation section Portfolio
    portfolio.appendChild(titrePortfolio)
    portfolio.appendChild(boutons)
    boutons.appendChild(btnAll)
    portfolio.appendChild(gallery)


    // Incrémentation section Contact

}