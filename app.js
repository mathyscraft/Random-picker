if(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.querySelector('link[rel="icon"]').setAttribute('href', 'img/icon_dark.svg')
}

const form = document.getElementById('form') ;
console.log(form);

const resultDiv = document.getElementById("result");

let n = 2; // Nombre de valeurs

function addChoice() {
    n++;
    form.insertBefore(document.createElement("input"), document.getElementById('choose-button'));
    form.children[n - 1].type = "text";
    form.children[n - 1].placeholder = "Choix "+n;
}

function deleteChoice() {
    if (n !== 2) {
        n-- ;
        form.children[n].remove();
    }
}

function choose() {

    let randomNumber = getRandom()
    let result = form.children[randomNumber].value;

    if (result !== "") {
        console.log(result);
        resultDiv.innerHTML = result;      
    } else {
        console.log(undefined);
        resultDiv.innerHTML = "choix "+(randomNumber + 1);
    }

    // Animation
    resultDiv.hidden = false ;
    resultDiv.style.animation = "show-result 1s ease";
    setTimeout(() => {
        resultDiv.style.animation = "";
    }, 1010);

}

function getRandom() {
    return Math.floor(Math.random() * n);
}

function exportData() {
    let values;

    for (i = 0; i < n; i++) {
        if (i === 0) {
            values = 'const data = {"n":"'+n+'",'
        }
        if (i !== (n-1)) {
        values += '"value-'+(i+1)+'":"'+form.children[i].value+'",';
        } else {
            values += '"value-'+(i+1)+'":"'+form.children[i].value+'"}';
        }
    }
    console.log(values);   

    let blob = new Blob([values],{type: 'text/javascript'}); // Convertit values en données brutes
    let exportLink = document.createElement('a');
    exportLink.setAttribute('href', window.URL.createObjectURL(blob)); //
    exportLink.setAttribute('download', 'data.mathys');
    exportLink.click();
    window.URL.revokeObjectURL(blob);

}

// Créer un élément input qui sera activé par la fonction import data
let importButton = document.createElement('input');
importButton.setAttribute('type', 'file');
importButton.setAttribute('accept', '.mathys');

function importData() {
    importButton.click();
}

// Lorqu'un fichier est chargé :
importButton.addEventListener("change", loadData, false);

function loadData() {
    let file = importButton.files;

    // Si il y a des fichiers importés :
    if (file.length !== 0) {
        // On crée un fichier contenant les données brutes importées puis on le declare
        console.log(file[0].type);
        let script = document.createElement('script');
        script.src = window.URL.createObjectURL(file[0]);
        script.type = "text/javascript";
        document.querySelector('body').insertBefore(script, document.querySelector('script'));
        console.log(script.src);

        // Laisse au fichier le temps de charger puis le lit
        setTimeout(() => {
            implementData()
        }, 300)

        window.URL.revokeObjectURL(file[0]);
    }
}

function implementData() {
    n = data.n ;// Assigne à n la valeur n du fichier importé

    // Si il y a plus de valeurs que de input dejà present :
    if (n > form.children.length-1) {
        for (i = 0; i < n-(form.children.length-2); i++) {
            n--; // la fonction addchoice incrémente n de 1
            addChoice();
        }
    }
    // Applique ensuite les valeurs importées à chacun des input
    for (i = 0; i < n; i++) {
        form.children[i].value = data['value-'+(i + 1)];
    }
}