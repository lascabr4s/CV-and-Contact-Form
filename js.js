(function() { //c'est une fonction Anonyme --> auto invoquée --> (function(){tu écrit là})(); <--



    // ------------------------------------------------------------------------------------

    let onglet = document.querySelectorAll(".nav li");
    for (elt of onglet) {
        elt.addEventListener("click", manageMenu);
    }
    // en JQUERY
    // $('.nav li').on('click', manageMenu);
    // ------------------------------------------------------------------------------------

    let data1 = {};
    let permute2 = false;

    // ------------------------------------------------------------------------------------

    getData();

    function getData() {
        $.ajax({ //methode AJAX pour RECUPERER des données et ASYNC
                //on créé un objet litteral
                type: "GET",
                url: "./json.json",
                dataType: "json",
            })
            .done(function(data) {
                //affichage des données reçues dans la page html
                // console.log(response);
                affichage(data);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                }

            )
    }

    // --------------------------- 2eme solution MODERNE en JS----------------------------
    // ------------------------------------------------------------------------------------
    // faire un copier/coller en changeant simplement le chemin du fichier:
    // function getData() {
    //     fetch("./json.json")
    //         .then(response => response.json()) // le '=>' est une fonction fléchée
    //         .then(data => affichage(data)) //équivalent en syntaxe normale --> function(data){}
    //         .catch(function(error) {
    //             console.log(error);
    //         });
    // }
    // ------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------
    function manageMenu(event) {
        resetMenu();
        document.querySelector("#" + event.target.id).classList.add("click");
        manageSection(event.target.id);
    }

    // on reprend la variable declaré au début pour poser les écouteurs sur la nav
    function resetMenu() {
        for (elt of onglet) {
            elt.classList.remove("click");
        }
    }

    function manageSection(id) {
        let corespondance = {};
        corespondance.exp = "pl_div";
        corespondance.form = "os_div";
        corespondance.aut = "fl_div";
        corespondance.aurelien = "am_div";
        resetSection();
        if (corespondance[id] != "am_div") {
            document.querySelector("#" + corespondance[id]).style.display = "block";
        } else {
            managePopup();
        }
        // console.log(corespondance.exp);
        // console.log(corespondance["exp"]);
        // console.log(corespondance[id])
        // console.log(document.querySelector("#" + corespondance[id]));
    }

    function managePopup() {

        // Par précaution, on réinitialise la fenetre popup!!!
        if ($('#popup').length == 1) {
            $('#popup').remove();
        }

        // ------------
        // solution en Jquery pour injecter la div POPUP
        // $(".wrapper").append(popup);

        // solution en JS pour injecter la popup
        let myDiv = document.createElement("div");
        myDiv.setAttribute("class", "popup");
        myDiv.setAttribute("id", "popup");
        // -------------

        let popup2 = '<div id="entete">';
        popup2 += '<span class="permutation">Formulaire</span>';
        popup2 += '<span class="croix">X</span>';
        popup2 += '</div>'
        popup2 += '<div id="corps"></div>';
        myDiv.innerHTML = popup2;

        let coordonnee = '<table>';
        coordonnee += '<tr><td>Tel: </td><td>' + data1.tel + '</td></tr>';
        coordonnee += '<tr><td>Mail: </td><td>' + data1.mail + '</td></tr>';
        coordonnee += '<tr><td>Adresse: </td><td>' + data1.adresse.num + ' ' + data1.adresse.rue + '<br>' + data1.adresse.zip + '<br>' + data1.adresse.ville + '</td></tr>';
        coordonnee += '</table>';

        document.querySelector(".wrapper").appendChild(myDiv);

        document.querySelector("#corps").innerHTML = coordonnee;

        document.querySelector(".croix").addEventListener("click", resetPopup);
        document.querySelector(".permutation").addEventListener("click", permute);
    }
    // permet de faire permuter l'affichage du popup avec le bouton "formulaire"
    function permute() {
        if (permute2) {
            managePopup();
            permute2 = false;
        } else {
            affForm();
            permute2 = true;
        }
    }

    function affForm() {
        document.querySelector("#corps").innerHTML = "";
        // en Jquery
        // $('#corps').empty();
        let formulaire = '<input id="sujet" name="sujet" placeholder="Sujet" type="text">';
        formulaire += '<textarea id="text" name="text" placeholder="Texte..." cols="30" rows="10"></textarea>';
        formulaire += '<button id="btn" name="btn" type="button">ENVOYER</button>';
        document.querySelector("#corps").innerHTML = formulaire;

        // ----------les 2 façcons pour poser un ecouteur (JS/Jquery)-----------
        // document.querySelector("#btn").addEventListener("click", sendData);
        $("#btn").on("click", sendData);
        // ---------------------------------------------------------------------
    }

    function sendData() {
        let formData = {};
        formData.sujet = $("#sujet").val(); //en jquery on recupere les données pour l'objet litteral
        formData.text = $("#text").val();

        let fetchData = {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json"
            }
        }
        const result = fetch("traitement.php", fetchData);
        const myJson = result.json();
        console.log(result);
        success(myJson);
    }

    function success(myJson) {
        console.log(myJson);
    }

    function resetPopup() {
        document.querySelector("#popup").remove();
    }

    function resetSection() {
        document.querySelector("#pl_div").style.display = "none";
        document.querySelector("#os_div").style.display = "none";
        document.querySelector("#fl_div").style.display = "none";
        document.querySelector("#am_div").style.display = "none";
    }
    // ------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------
    function affichage(data) {
        data1 = data;
        // on modifie le titre du CV
        let h1 = document.querySelector(".header h1");
        h1.textContent = data.prenom + " " + data.nom;

        // on injecte les données de json vers le html en jquery
        let experience = data.exp;
        // console.log(experience);
        $.each( //EACH equivalent à un FOR OF de js(envoi toujours par défaut 2 parametres)
            experience,
            function(index, value) {
                // console.log(index, value);
                $("#pl_div").append(
                    '<div class="mondiv id="mondiv' + index + '">' +
                    'Date de début : ' + value.datedeb +
                    '<br>Date de fin : ' + value.datefin +
                    '<br>Fonction : ' + value.resume +
                    '<span class="plus" id="plus' + index + '">...</span>' +
                    '</div>'
                )
            }
        );
        $(".plus").on("click", function(event) {
            let id = event.target.id.slice(4);
            // console.log($('#' + id).length);
            // pour eviter la repetition
            if ($('#e' + id).length == 0) {
                $(this).append('<span id ="e' + id + '"><br>Description :' + data1.exp[id].description + '<br>Entreprise :' + data1.exp[id].entreprise + '</span>');
            } else {
                $('#e' + id).remove();
            }
        });

        let formation = data.formation;
        $.each(
            formation,
            function(index, value) {
                // console.log(index, value);
                $('#os_div').append(
                    '<div class="mondiv" id="mondiv2' + index + ' ">' +
                    'Date de début : ' + value.datedeb +
                    '<br>Date de fin : ' + value.datefin +
                    '<br>Ecole : ' + value.ecole +
                    '<br>Titre : ' + value.titre +
                    '</div>'
                )
            });

        let autres = data.autres;
        let hobbies = autres.hobbies.toString(); //'toString' me transforme le tableau dans le json en chaine de caractere
        let langues = autres.langues.toString();
        $('#fl_div').append(
            '<div class="mondiv3">' +
            '<p>Mes hobbies : ' + hobbies + '</p>' +
            '<p>Mes langues : ' + langues + '</p>' +
            '</div>'
        )


    }
    // en JQUERY
    // $('h1').html(myReturnData.prenom + ' ' + myReturnData.nom);
    // ------------------------------------------------------------------------------------

})();