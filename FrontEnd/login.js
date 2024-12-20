function ajoutListenerConnexion() {
    const loginForm = document.querySelector("#connexion-form")
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault()
        // On récupère l'email et le mot de passe entré par l'utilisateur dans le formulaire
        const infosLogin = {
            email: event.target.querySelector('[name=email').value,
            password: event.target.querySelector('[name=motDePasse]').value
        }
        // On le passe au format JSON
        const infoLoginJSON = JSON.stringify(infosLogin)
        // On utilise ces informations pour vérifier si les informations de connexion correspondent à celles de l'API
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json"
            },
            body: infoLoginJSON
        }).then((response) => response.json())
        .then((data) => {
            if(data.token != undefined){
            // On récupère le token et on l'inscrit dans le localStorage
            const token = data.token
            const userId = data.userId
            sessionStorage.setItem("token", token)
            sessionStorage.setItem("userId", userId)
            window.location.href = "index.html"
        } else {
            const messageErreur = document.getElementById("message-erreur")
            messageErreur.classList.remove("hidden")
        }
        })
    
    })
}

ajoutListenerConnexion()