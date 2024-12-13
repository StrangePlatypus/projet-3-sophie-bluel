// GESTION DE LA PAGE DE CONNEXION

export function ajoutListenerConnexion() {
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
        })
        console.log(response);
        

        /*
        if (verificationLogin === ) {
            console.log("ok")
        } else {
            const messageErreur = document.createElement("p")
            messageErreur.innerText = "Erreur dans l’identifiant ou le mot de passe"
            loginForm.appendChild(messageErreur)
            console.log(messageErreur)
        } */
    })
}

ajoutListenerConnexion()