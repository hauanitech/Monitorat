document.addEventListener('DOMContentLoaded', function() {
    const modeBU = document.getElementById('mode-bu');
    const modeB21 = document.getElementById('mode-b21');
    const formBU = document.getElementById('form-bu');
    const formB21 = document.getElementById('form-b21');
    const outputContainer = document.getElementById('output');

    modeBU.addEventListener('click', function() {
        switchMode('bu');
    });

    modeB21.addEventListener('click', function() {
        switchMode('b21');
    });

    function switchMode(mode) {
        if (mode === 'bu') {
            modeBU.classList.add('active');
            modeB21.classList.remove('active');
            formBU.classList.add('active');
            formB21.classList.remove('active');
        } else {
            modeB21.classList.add('active');
            modeBU.classList.remove('active');
            formB21.classList.add('active');
            formBU.classList.remove('active');
        }
        outputContainer.classList.remove('active');
        document.getElementById('copy-btn').style.display = 'none';
    }

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bu-date').value = today;
    document.getElementById('b21-date').value = today;
});

function formatDate(dateString) {
    const dateParts = dateString.split('-');
    const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
                   'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    
    const dayName = days[date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName} ${day} ${month} ${year}`;
}

function formatTime(timeString) {
    return timeString.replace(':', 'h');
}

function generateBUReport() {
    const date = document.getElementById('bu-date').value;
    const heureDebut = document.getElementById('bu-heure-debut').value;
    const heureFin = document.getElementById('bu-heure-fin').value;
    const nbInterventions = document.getElementById('bu-nb-interventions').value;
    const typesInterventions = document.getElementById('bu-types-interventions').value;
    const pretOrdinateurs = document.getElementById('bu-pret-ordinateurs').value;
    const retourOrdinateurs = document.getElementById('bu-retour-ordinateurs').value;
    const ordinateursTraites = document.getElementById('bu-ordinateurs-traites').value;
    const materielsTraites = document.getElementById('bu-materiels-traites').value;
    const aidesImpressions = document.getElementById('bu-aides-impressions').value;
    const autresObservations = document.getElementById('bu-autres-observations').value;

    if (!date || !heureDebut || !heureFin) {
        alert('Veuillez remplir tous les champs obligatoires (date et heures)');
        return;
    }

    const formattedDate = formatDate(date);
    const formattedHeureDebut = formatTime(heureDebut);
    const formattedHeureFin = formatTime(heureFin);

    const report = `-Date, heure, et lieu---------------------------------------------------------------------
* ${formattedDate}
* ${formattedHeureDebut} - ${formattedHeureFin}
* BU

-Interventions-----------------------------------------------------------------------------

Nombre d'interventions: 
${nbInterventions}

Types d'interventions / problèmes rencontrés : 
${typesInterventions || ''}

Prêt d'ordinateurs :
${pretOrdinateurs}
 
Retour d'ordinateurs :
${retourOrdinateurs}

Ordinateurs traités :
${ordinateursTraites}

Matériels traités : 
${materielsTraites || ''}


Aides impressions :
${aidesImpressions}

Autres observations : 
${autresObservations || ''}`;

    displayReport(report);
}

function generateB21Report() {
    const date = document.getElementById('b21-date').value;
    const heureDebut = document.getElementById('b21-heure-debut').value;
    const heureFin = document.getElementById('b21-heure-fin').value;
    const nbInterventions = document.getElementById('b21-nb-interventions').value;
    const typesInterventions = document.getElementById('b21-types-interventions').value;
    const aidesImpressions = document.getElementById('b21-aides-impressions').value;
    const salleB21 = document.getElementById('salle-b21').value;
    const salleB22 = document.getElementById('salle-b22').value;
    const salleB23 = document.getElementById('salle-b23').value;
    const salleB24 = document.getElementById('salle-b24').value;
    const salleB12 = document.getElementById('salle-b12').value;
    const salleB13 = document.getElementById('salle-b13').value;
    const salleCosip = document.getElementById('salle-cosip').value;
    const autresObservations = document.getElementById('b21-autres-observations').value;

    if (!date || !heureDebut || !heureFin) {
        alert('Veuillez remplir tous les champs obligatoires (date et heures)');
        return;
    }

    const formattedDate = formatDate(date);
    const formattedHeureDebut = formatTime(heureDebut);
    const formattedHeureFin = formatTime(heureFin);

    const report = `-Date, heure, et lieu---------------------------------------------------------------------
* ${formattedDate}
* ${formattedHeureDebut} -${formattedHeureFin}
* B2-1
-Interventions-----------------------------------------------------------------------------

Nombre d'interventions: 
${nbInterventions}

Types d'interventions / problèmes rencontrés : 
${typesInterventions || 'R.A.S'}

Aides impressions : 
${aidesImpressions}

Salles du bâtiment B :
- B2-1 : ${salleB21 || ''}
- B2-2 : ${salleB22 || ''}
- B2-3 : ${salleB23 || ''}
- B2-4 : ${salleB24 || ''}
- B1-2 : ${salleB12 || ''}
- B1-3 : ${salleB13 || ''}
- COSIP : ${salleCosip || ''}

Autres observations : 
${autresObservations || ''}`;

    displayReport(report);
}

function displayReport(report) {
    const reportContent = document.getElementById('report-content');
    const outputContainer = document.getElementById('output');
    const copyBtn = document.getElementById('copy-btn');

    reportContent.textContent = report;
    outputContainer.classList.add('active');
    copyBtn.style.display = 'inline-block';

    outputContainer.scrollIntoView({ behavior: 'smooth' });
}

function copyReport() {
    const reportContent = document.getElementById('report-content').textContent;
    
    navigator.clipboard.writeText(reportContent).then(function() {
        const copyBtn = document.getElementById('copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copié !';
        copyBtn.style.background = '#27ae60';
        
        setTimeout(function() {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#3498db';
        }, 2000);
    }).catch(function(err) {
        alert('Erreur lors de la copie : ' + err);
    });
}


