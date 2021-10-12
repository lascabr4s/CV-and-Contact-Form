(function() {

    remplissage();

    function remplissage() {
        let obj = localStorage.getItem("data"); //objet litteral
        let obj2 = localStorage.getItem("data2"); // notation JSON
        // console.log(obj);
        // console.log(obj2);

        if (obj2) {
            let obj3 = JSON.parse(obj2);
            document.querySelector("#nom").value = obj3.nom;
            document.querySelector("#prenom").value = obj3.prenom;
            document.querySelector("#age").value = obj3.age;
            document.querySelector("#dt").value = obj3.dt;
            document.querySelector("#pays").value = obj3.pays;
            document.querySelector("#comment").value = obj3.comment;
            switch (obj3.genre) {
                case "homme":
                    document.querySelector("#homme").checked = true;
                    break;
                case "femme":
                    document.querySelector("#femme").checked = true;
                    break;
            }

            for (elt of obj3.music) {
                document.querySelector("#" + elt).checked = true;
            }
        }
    }


    let nom = document.querySelector("#nom");
    let prenom = document.querySelector("#prenom");
    let pays = document.querySelector("#pays");
    let comment = document.querySelector("#comment");
    let dt = document.querySelector("#dt");
    let age = document.querySelector("#age");
    let ok = true;
    let msg;

    // verifie si la syntaxe est bonne, avec
    // une expressions reguliere
    let testLettreValid = /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/;
    let testNombreValid = /^[0-9]$/;


    bouton_envoi.addEventListener("click", Validation);


    // evite de repeter le style sur chaque "if"
    function messageErreur(nom, msg) {
        nom.style.color = "red";
        // nom.style.backgroundColor = "black";
        nom.style.padding = "1px";
        nom.textContent = msg;
        ok = false;
    }

    // permet de reinitialiser apres chaque message erreur
    function resetMessage() {
        missnom.textContent = "";
        missprenom.textContent = "";
        misspays.textContent = "";
        missdt.textContent = "";
        missage.textContent = "";
        ok = true;
    }

    function Validation() {
        resetMessage();
        if (nom.validity.valueMissing) {
            msg = "Nom manquant";
            messageErreur(missnom, msg);
        }

        if (testLettreValid.test(nom.value) == false) {
            if (ok) {
                msg = "Format erroné";
                messageErreur(missnom, msg);
            }
        }

        if (prenom.validity.valueMissing) {
            msg = "Prénom manquant";
            messageErreur(missprenom, msg);
        }

        if (testLettreValid.test(prenom.value) == false) {
            if (ok) {
                msg = "Format erroné";
                messageErreur(missprenom, msg);
            }
        }

        if (pays.validity.valueMissing) {
            msg = "Sélectionner un pays";
            messageErreur(misspays, msg);
        }

        if (dt.validity.valueMissing) {
            msg = "Saisir une date";
            messageErreur(missdt, msg);
        }

        if (age.validity.valueMissing) {
            msg = "Entrez votre age";
            messageErreur(missage, msg);
        }

        if (age.value <= 0) {
            msg = "Saisir un nombre positif";
            messageErreur(missage, msg);
        }

        if (ok) {
            createData();
        }
    }

    // permet d'envoyer les données du formulaire
    function createData() {
        let dataForm = {};
        dataForm.nom = nom.value;
        dataForm.prenom = prenom.value;
        dataForm.comment = comment.value;
        dataForm.dt = dt.value;
        dataForm.age = age.value;
        dataForm.genre = document.querySelector('input[name=genre]:checked').value;
        dataForm.pays = pays.value;
        let chkbx = document.querySelectorAll('input[type=checkbox]:checked');
        let music = [];
        for (let elt of chkbx) {
            // console.log(elt.getAttribute('id'));
            music.push(elt.getAttribute('id'));
        }
        dataForm.music = music;

        // -------------------------OBJET LITTERAL/NOTATION JSON---------------
        // envoie de l'objet literal en notation JSON
        // console.log(JSON.stringify(dataForm));
        // recepere la notation JSON en objet litteral 
        // console.log(JSON.parse(JSON.stringify(dataForm)));
        // ----------------------------------------------------------------------

        localStorage.setItem("data2", JSON.stringify(dataForm));

        // sendData(dataForm);
        // sendData2(dataForm);
        sendData3(dataForm);
    }


    // 1ERE SOLUTION POUR ENVOYER DES DONNEES

    // fonction qui sert a envoyer des données
    // ON PEUT FAIRE UN COPIER/COLLER ------ de là .....
    function sendData(dataForm) {
        let fetchData = {
            method: "POST",
            body: JSON.stringify(dataForm),
            headers: {
                "Content-Type": "application/json"
            }
        }
        fetch("traitement.php", fetchData)
            .then(function(resp) {
                console.log(resp);
                if (resp.ok)
                    document.querySelector("#response").textContent = "ok ça s\'est bien passé";
                else
                    document.querySelector("#response").textContent = "ouuuuups";
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    // 2EME SOLUTION --façon la plus moderne---!!!!
    async function sendData2(dataForm) {
        let fetchData = {
            method: "POST",
            body: JSON.stringify(dataForm),
            headers: {
                "Content-Type": "application/json"
            }
        }
        const result = await fetch("traitement.php", fetchData);
        const myJson = await result.json();
        console.log(result);
        success(myJson);
    }

    function success(json) {
        // affichage des données json dans la page html deja existante
    }

    // 3EME SOLUTION ------avec JQUERY--------!!!!!!
    // penser à installer la librairie JQUERY et declarer le script dans le HTML
    function sendData3(json) {
        $.ajax({ //methode AJAX pour envoyer des données et ASYNC
                //on créé un objet litteral
                type: "POST",
                url: "traitement.php",
                dataType: "json",
                data: JSON.stringify(json)
            })
            .done(function(response) {
                    //affichage des données reçues dans la page html
                    document.querySelector("#response").textContent = "ok ça s\'est bien passé";
                }

            )
            .fail(function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                    document.querySelector("#response").textContent = "ouuuuups";
                }

            )
    }
    // .... à là---------------------------------------------



})();