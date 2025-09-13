// Variables globales
let currentReport = null;
let currentReportType = null;

document.addEventListener('DOMContentLoaded', function() {
    const modeBU = document.getElementById('mode-bu');
    const modeB21 = document.getElementById('mode-b21');
    const formBU = document.getElementById('form-bu');
    const formB21 = document.getElementById('form-b21');
    const outputContainer = document.getElementById('output');
    
    // Navigation principale
    const navCreate = document.getElementById('nav-create');
    const navSaved = document.getElementById('nav-saved');
    const savedSection = document.getElementById('saved-reports');
    const mainSection = document.querySelector('main');
    const modeSelector = document.getElementById('mode-selector');

    // Event listeners pour la navigation
    navCreate.addEventListener('click', function() {
        switchSection('create');
    });

    navSaved.addEventListener('click', function() {
        switchSection('saved');
        loadSavedReports();
    });

    modeBU.addEventListener('click', function() {
        switchMode('bu');
    });

    modeB21.addEventListener('click', function() {
        switchMode('b21');
    });

    // Recherche et filtres
    const searchInput = document.getElementById('search-reports');
    const filterSelect = document.getElementById('filter-type');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterReports);
    }
    if (filterSelect) {
        filterSelect.addEventListener('change', filterReports);
    }

    function switchSection(section) {
        if (section === 'create') {
            navCreate.classList.add('active');
            navSaved.classList.remove('active');
            mainSection.style.display = 'block';
            modeSelector.style.display = 'flex';
            savedSection.style.display = 'none';
        } else {
            navSaved.classList.add('active');
            navCreate.classList.remove('active');
            mainSection.style.display = 'none';
            modeSelector.style.display = 'none';
            savedSection.style.display = 'block';
        }
        outputContainer.classList.remove('active');
    }

    function switchMode(mode) {
        if (mode === 'bu') {
            modeBU.classList.add('active');
            modeB21.classList.remove('active');
            formBU.classList.add('active');
            formB21.classList.remove('active');
            currentReportType = 'BU';
        } else {
            modeB21.classList.add('active');
            modeBU.classList.remove('active');
            formB21.classList.add('active');
            formBU.classList.remove('active');
            currentReportType = 'B2-1';
        }
        outputContainer.classList.remove('active');
        hideOutputButtons();
    }

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bu-date').value = today;
    document.getElementById('b21-date').value = today;
    
    // Initialiser le type de rapport
    currentReportType = 'BU';
    
    // Charger les rapports sauvegardés au démarrage
    loadSavedReports();
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
    const saveBtn = document.getElementById('save-report-btn');
    const editBtn = document.getElementById('edit-report-btn');

    reportContent.textContent = report;
    currentReport = report;
    outputContainer.classList.add('active');
    
    showOutputButtons();

    outputContainer.scrollIntoView({ behavior: 'smooth' });
}

function showOutputButtons() {
    document.getElementById('copy-btn').style.display = 'inline-block';
    document.getElementById('save-report-btn').style.display = 'inline-block';
    document.getElementById('edit-report-btn').style.display = 'inline-block';
}

function hideOutputButtons() {
    document.getElementById('copy-btn').style.display = 'none';
    document.getElementById('save-report-btn').style.display = 'none';
    document.getElementById('edit-report-btn').style.display = 'none';
}

function copyReport() {
    const reportContent = document.getElementById('report-content').textContent;
    
    navigator.clipboard.writeText(reportContent).then(function() {
        const copyBtn = document.getElementById('copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copié !';
        copyBtn.style.background = '#27ae60';
        
        setTimeout(function() {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#3498db';
        }, 2000);
    }).catch(function(err) {
        alert('Erreur lors de la copie : ' + err);
    });
}

// === FONCTIONS DE SAUVEGARDE ET GESTION ===

function saveCurrentReport() {
    if (!currentReport) {
        alert('Aucun rapport à sauvegarder');
        return;
    }

    const reportData = {
        id: Date.now(),
        type: currentReportType,
        content: currentReport,
        createdAt: new Date(),
        title: generateReportTitle(currentReport, currentReportType)
    };

    saveReportToStorage(reportData);
    
    const saveBtn = document.getElementById('save-report-btn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = '✅ Sauvegardé !';
    saveBtn.style.background = '#27ae60';
    
    setTimeout(function() {
        saveBtn.textContent = originalText;
        saveBtn.style.background = '#27ae60';
    }, 2000);
    
    // Recharger la liste si on est dans la section sauvegardée
    if (document.getElementById('saved-reports').style.display !== 'none') {
        loadSavedReports();
    }
}

function generateReportTitle(report, type) {
    const lines = report.split('\n');
    let date = '';
    let lieu = type;
    
    // Extraire la date de la première ligne avec *
    for (let line of lines) {
        if (line.trim().startsWith('*') && line.includes('202')) {
            date = line.replace('*', '').trim();
            break;
        }
    }
    
    return `${lieu} - ${date}`;
}

function saveReportToStorage(reportData) {
    let savedReports = JSON.parse(localStorage.getItem('monitorat_reports')) || [];
    savedReports.unshift(reportData); // Ajouter en début de liste
    localStorage.setItem('monitorat_reports', JSON.stringify(savedReports));
}

function getSavedReports() {
    return JSON.parse(localStorage.getItem('monitorat_reports')) || [];
}

function loadSavedReports() {
    const reportsList = document.getElementById('reports-list');
    const savedReports = getSavedReports();
    
    if (savedReports.length === 0) {
        reportsList.innerHTML = `
            <div class="no-reports">
                <p>📝 Aucun rapport sauvegardé pour le moment.</p>
                <p>Générez votre premier rapport pour le voir apparaître ici !</p>
            </div>
        `;
        return;
    }

    reportsList.innerHTML = savedReports.map(report => createReportItem(report)).join('');
}

function createReportItem(report) {
    const createdDate = new Date(report.createdAt);
    const formattedCreatedDate = createdDate.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const preview = report.content.substring(0, 200) + (report.content.length > 200 ? '...' : '');
    
    return `
        <div class="report-item" data-id="${report.id}">
            <div class="report-header">
                <div>
                    <div class="report-title">${report.title}</div>
                    <div class="report-meta">
                        Créé le ${formattedCreatedDate} • Type: ${report.type}
                    </div>
                </div>
                <div class="report-actions">
                    <button class="action-btn view-btn" onclick="viewReport(${report.id})">👁️ Voir</button>
                    <button class="action-btn edit-btn" onclick="editReport(${report.id})">✏️ Modifier</button>
                    <button class="action-btn duplicate-btn" onclick="duplicateReport(${report.id})">📋 Dupliquer</button>
                    <button class="action-btn delete-btn" onclick="deleteReport(${report.id})">🗑️ Supprimer</button>
                </div>
            </div>
            <div class="report-preview">${preview}</div>
        </div>
    `;
}

function viewReport(reportId) {
    const reports = getSavedReports();
    const report = reports.find(r => r.id === reportId);
    
    if (report) {
        document.getElementById('report-content').textContent = report.content;
        document.getElementById('output').classList.add('active');
        currentReport = report.content;
        currentReportType = report.type;
        
        // Masquer le bouton sauvegarder puisque c'est déjà sauvegardé
        document.getElementById('save-report-btn').style.display = 'none';
        document.getElementById('copy-btn').style.display = 'inline-block';
        document.getElementById('edit-report-btn').style.display = 'inline-block';
        
        document.getElementById('output').scrollIntoView({ behavior: 'smooth' });
    }
}

function editReport(reportId) {
    const reports = getSavedReports();
    const report = reports.find(r => r.id === reportId);
    
    if (report) {
        // Basculer vers la section création
        document.getElementById('nav-create').click();
        
        // Sélectionner le bon mode
        if (report.type === 'BU') {
            document.getElementById('mode-bu').click();
            populateBUForm(report.content);
        } else {
            document.getElementById('mode-b21').click();
            populateB21Form(report.content);
        }
        
        // Supprimer l'ancien rapport puisqu'on va le modifier
        deleteReport(reportId, false);
    }
}

function duplicateReport(reportId) {
    const reports = getSavedReports();
    const report = reports.find(r => r.id === reportId);
    
    if (report) {
        const duplicatedReport = {
            ...report,
            id: Date.now(),
            createdAt: new Date(),
            title: report.title + ' (Copie)'
        };
        
        saveReportToStorage(duplicatedReport);
        loadSavedReports();
        
        // Notification
        alert('✅ Rapport dupliqué avec succès !');
    }
}

function deleteReport(reportId, showConfirm = true) {
    if (showConfirm && !confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
        return;
    }
    
    let reports = getSavedReports();
    reports = reports.filter(r => r.id !== reportId);
    localStorage.setItem('monitorat_reports', JSON.stringify(reports));
    loadSavedReports();
    
    if (showConfirm) {
        alert('🗑️ Rapport supprimé avec succès !');
    }
}

function clearAllReports() {
    if (!confirm('⚠️ Êtes-vous sûr de vouloir supprimer TOUS les rapports sauvegardés ?\nCette action est irréversible !')) {
        return;
    }
    
    localStorage.removeItem('monitorat_reports');
    loadSavedReports();
    alert('🗑️ Tous les rapports ont été supprimés !');
}

function filterReports() {
    const searchTerm = document.getElementById('search-reports').value.toLowerCase();
    const filterType = document.getElementById('filter-type').value;
    const reports = getSavedReports();
    
    let filteredReports = reports;
    
    // Filtrer par type
    if (filterType !== 'all') {
        filteredReports = filteredReports.filter(report => report.type === filterType);
    }
    
    // Filtrer par terme de recherche
    if (searchTerm) {
        filteredReports = filteredReports.filter(report => 
            report.title.toLowerCase().includes(searchTerm) ||
            report.content.toLowerCase().includes(searchTerm)
        );
    }
    
    // Afficher les résultats filtrés
    const reportsList = document.getElementById('reports-list');
    if (filteredReports.length === 0) {
        reportsList.innerHTML = `
            <div class="no-reports">
                <p>🔍 Aucun rapport trouvé pour cette recherche.</p>
                <p>Essayez avec d'autres mots-clés ou supprimez les filtres.</p>
            </div>
        `;
        return;
    }
    
    reportsList.innerHTML = filteredReports.map(report => createReportItem(report)).join('');
}

function editCurrentReport() {
    if (!currentReport || !currentReportType) {
        alert('Aucun rapport à modifier');
        return;
    }
    
    // Basculer vers la section création
    document.getElementById('nav-create').click();
    
    // Sélectionner le bon mode et pré-remplir le formulaire
    if (currentReportType === 'BU') {
        document.getElementById('mode-bu').click();
        populateBUForm(currentReport);
    } else {
        document.getElementById('mode-b21').click();
        populateB21Form(currentReport);
    }
}

function populateBUForm(reportContent) {
    // Extraire les données du rapport pour pré-remplir le formulaire
    // Cette fonction analyse le contenu du rapport et remplit les champs
    const lines = reportContent.split('\n');
    
    // Extraire la date (chercher la ligne avec la date formatée)
    for (let line of lines) {
        if (line.includes('202')) {
            const dateMatch = line.match(/(\d{2})\s(\w+)\s(\d{4})/);
            if (dateMatch) {
                // Convertir la date française vers le format HTML
                const day = dateMatch[1];
                const monthName = dateMatch[2];
                const year = dateMatch[3];
                const monthIndex = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
                                   'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
                                   .indexOf(monthName);
                if (monthIndex !== -1) {
                    const isoDate = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${day}`;
                    document.getElementById('bu-date').value = isoDate;
                }
            }
        }
    }
    
    // Extraire l'heure (chercher la ligne avec l'horaire)
    for (let line of lines) {
        if (line.includes('h') && line.includes('-')) {
            const timeMatch = line.match(/(\d{2})h(\d{2})\s*-\s*(\d{2})h(\d{2})/);
            if (timeMatch) {
                document.getElementById('bu-heure-debut').value = `${timeMatch[1]}:${timeMatch[2]}`;
                document.getElementById('bu-heure-fin').value = `${timeMatch[3]}:${timeMatch[4]}`;
            }
        }
    }
    
    // Cette approche peut être étendue pour extraire tous les champs
    alert('📝 Formulaire pré-rempli ! Modifiez les champs nécessaires et régénérez le rapport.');
}

function populateB21Form(reportContent) {
    // Similaire à populateBUForm mais pour B2-1
    const lines = reportContent.split('\n');
    
    // Même logique pour extraire date et heure
    for (let line of lines) {
        if (line.includes('202')) {
            const dateMatch = line.match(/(\d{2})\s(\w+)\s(\d{4})/);
            if (dateMatch) {
                const day = dateMatch[1];
                const monthName = dateMatch[2];
                const year = dateMatch[3];
                const monthIndex = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
                                   'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
                                   .indexOf(monthName);
                if (monthIndex !== -1) {
                    const isoDate = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${day}`;
                    document.getElementById('b21-date').value = isoDate;
                }
            }
        }
    }
    
    for (let line of lines) {
        if (line.includes('h') && line.includes('-')) {
            const timeMatch = line.match(/(\d{2})h(\d{2})\s*-\s*(\d{2})h(\d{2})/);
            if (timeMatch) {
                document.getElementById('b21-heure-debut').value = `${timeMatch[1]}:${timeMatch[2]}`;
                document.getElementById('b21-heure-fin').value = `${timeMatch[3]}:${timeMatch[4]}`;
            }
        }
    }
    
    alert('📝 Formulaire pré-rempli ! Modifiez les champs nécessaires et régénérez le rapport.');
}


