console.log('hello from main');
const technosDiv = document.querySelector('#technos');

function loadTechnologies() {
    fetch('http://localhost:3001/technos')
        .then(response => {
            response.json()
                .then(technos => {
                    const allTechnos = technos.map(techno => `<div><b>${techno.name}</b> ${techno.description}  <a href="${techno.url}">site de ${techno.name}</a> </div>`)
                            .join('');
            
                    technosDiv.innerHTML = allTechnos; 
                });
        })
        .catch(console.error);
}

loadTechnologies(technos);

if (navigator.serviceWorker) {
    navigator.serviceWorker.register("service-worker.js")
        .catch(error => console.error)
}