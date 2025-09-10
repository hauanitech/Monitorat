// User Authentication and Management
let currentUser = null;
let currentEditingReport = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('monitorat-current-user');
    if (savedUser) {
        currentUser = savedUser;
        showApp();
    } else {
        showLogin();
    }
    
    // Initialize navigation
    setupNavigation();
    
    // Initialize form functionality
    setupFormHandlers();
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bu-date').value = today;
    document.getElementById('b21-date').value = today;
    
    // Initialize session backup system (only when logged in)
    if (currentUser) {
        loadFormData();
        setupAutoSave();
    }
}

function showLogin() {
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById('app-container').style.display = 'none';
}

function showApp() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
    document.getElementById('current-user').textContent = currentUser;
    loadReportsList();
}

function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');
    
    // Simple authentication (can be enhanced with real backend)
    if (username === '' || password === '') {
        showLoginError('Veuillez remplir tous les champs.');
        return;
    }
    
    if (username.length < 3) {
        showLoginError('Le nom d\'utilisateur doit contenir au moins 3 caractères.');
        return;
    }
    
    // For now, accept any username with password length >= 4
    if (password.length < 4) {
        showLoginError('Le mot de passe doit contenir au moins 4 caractères.');
        return;
    }
    
    // Store user
    currentUser = username;
    localStorage.setItem('monitorat-current-user', username);
    
    // Initialize user data if not exists
    if (!localStorage.getItem(`monitorat-reports-${username}`)) {
        localStorage.setItem(`monitorat-reports-${username}`, JSON.stringify([]));
    }
    
    // Clear form and show app
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    errorDiv.style.display = 'none';
    
    showApp();
    
    // Initialize systems after login
    loadFormData();
    setupAutoSave();
}

function showLoginError(message) {
    const errorDiv = document.getElementById('login-error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        // Save current form data before logout
        saveFormData();
        
        // Clear user session
        currentUser = null;
        localStorage.removeItem('monitorat-current-user');
        
        // Show login screen
        showLogin();
        
        // Hide any open modals
        closeModal();
    }
}

function setupNavigation() {
    const navCreate = document.getElementById('nav-create');
    const navReports = document.getElementById('nav-reports');
    const createSection = document.getElementById('create-section');
    const reportsSection = document.getElementById('reports-section');
    const modeSelector = document.getElementById('mode-selector');
    
    navCreate.addEventListener('click', function() {
        navCreate.classList.add('active');
        navReports.classList.remove('active');
        createSection.classList.add('active');
        reportsSection.classList.remove('active');
        modeSelector.style.display = 'flex';
        closeModal();
    });
    
    navReports.addEventListener('click', function() {
        navReports.classList.add('active');
        navCreate.classList.remove('active');
        reportsSection.classList.add('active');
        createSection.classList.remove('active');
        modeSelector.style.display = 'none';
        loadReportsList();
        closeModal();
    });
}

function setupFormHandlers() {
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
}

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

// Session backup functionality
let isLoadingData = false;

function saveFormData() {
    if (isLoadingData || !currentUser) return; // Prevent saving during data loading or when not logged in
    
    const buData = {};
    const b21Data = {};
    
    // Save BU form data
    const buInputs = document.querySelectorAll('#form-bu input, #form-bu textarea');
    buInputs.forEach(input => {
        if (input.id) {
            buData[input.id] = input.value;
        }
    });
    
    // Save B2-1 form data
    const b21Inputs = document.querySelectorAll('#form-b21 input, #form-b21 textarea');
    b21Inputs.forEach(input => {
        if (input.id) {
            b21Data[input.id] = input.value;
        }
    });
    
    localStorage.setItem(`monitorat-bu-data-${currentUser}`, JSON.stringify(buData));
    localStorage.setItem(`monitorat-b21-data-${currentUser}`, JSON.stringify(b21Data));
}

function loadFormData() {
    if (!currentUser) return;
    
    isLoadingData = true;
    try {
        // Load BU form data
        const buData = JSON.parse(localStorage.getItem(`monitorat-bu-data-${currentUser}`) || '{}');
        Object.entries(buData).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element && value !== '' && value !== null && value !== undefined) {
                element.value = value;
            }
        });
        
        // Load B2-1 form data
        const b21Data = JSON.parse(localStorage.getItem(`monitorat-b21-data-${currentUser}`) || '{}');
        Object.entries(b21Data).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element && value !== '' && value !== null && value !== undefined) {
                element.value = value;
            }
        });
    } catch (error) {
        console.log('Error loading saved form data:', error);
    }
    isLoadingData = false;
}

function setupAutoSave() {
    // Add event listeners to all form inputs for auto-save
    const allInputs = document.querySelectorAll('#form-bu input, #form-bu textarea, #form-b21 input, #form-b21 textarea');
    allInputs.forEach(input => {
        input.addEventListener('input', saveFormData);
        input.addEventListener('change', saveFormData);
    });
}

// Report Management
function saveReport(type) {
    if (!currentUser) return;
    
    let reportData, reportContent;
    
    if (type === 'BU') {
        reportData = collectBUFormData();
        reportContent = generateBUReportContent(reportData);
    } else if (type === 'B21') {
        reportData = collectB21FormData();
        reportContent = generateB21ReportContent(reportData);
    }
    
    if (!reportData.date || !reportData.heureDebut || !reportData.heureFin) {
        alert('Veuillez remplir tous les champs obligatoires (date et heures)');
        return;
    }
    
    // Create report object
    const report = {
        id: currentEditingReport ? currentEditingReport.id : Date.now().toString(),
        type: type,
        title: `Rapport ${type} - ${formatDate(reportData.date)}`,
        date: reportData.date,
        createdAt: currentEditingReport ? currentEditingReport.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        formData: reportData,
        content: reportContent
    };
    
    // Save to storage
    const reports = getUserReports();
    
    if (currentEditingReport) {
        // Update existing report
        const index = reports.findIndex(r => r.id === currentEditingReport.id);
        if (index !== -1) {
            reports[index] = report;
        }
        currentEditingReport = null;
    } else {
        // Add new report
        reports.unshift(report); // Add to beginning
    }
    
    localStorage.setItem(`monitorat-reports-${currentUser}`, JSON.stringify(reports));
    
    // Clear form data after saving
    clearFormData(type);
    
    // Show success message
    alert(`Rapport ${type} sauvegardé avec succès !`);
    
    // Switch to reports view
    document.getElementById('nav-reports').click();
}

function generateBUReportContent(data) {
    const formattedDate = formatDate(data.date);
    const formattedHeureDebut = formatTime(data.heureDebut);
    const formattedHeureFin = formatTime(data.heureFin);

    return `-Date, heure, et lieu---------------------------------------------------------------------
* ${formattedDate}
* ${formattedHeureDebut} - ${formattedHeureFin}
* BU

-Interventions-----------------------------------------------------------------------------

Nombre d'interventions: 
${data.nbInterventions}

Types d'interventions / problèmes rencontrés : 
${data.typesInterventions || ''}

Prêt d'ordinateurs :
${data.pretOrdinateurs}
 
Retour d'ordinateurs :
${data.retourOrdinateurs}

Ordinateurs traités :
${data.ordinateursTraites}

Matériels traités : 
${data.materielsTraites || ''}


Aides impressions :
${data.aidesImpressions}

Autres observations : 
${data.autresObservations || ''}`;
}

function generateB21ReportContent(data) {
    const formattedDate = formatDate(data.date);
    const formattedHeureDebut = formatTime(data.heureDebut);
    const formattedHeureFin = formatTime(data.heureFin);

    return `-Date, heure, et lieu---------------------------------------------------------------------
* ${formattedDate}
* ${formattedHeureDebut} -${formattedHeureFin}
* B2-1
-Interventions-----------------------------------------------------------------------------

Nombre d'interventions: 
${data.nbInterventions}

Types d'interventions / problèmes rencontrés : 
${data.typesInterventions || 'R.A.S'}

Aides impressions : 
${data.aidesImpressions}

Salles du bâtiment B :
- B2-1 : ${data.salleB21 || ''}
- B2-2 : ${data.salleB22 || ''}
- B2-3 : ${data.salleB23 || ''}
- B2-4 : ${data.salleB24 || ''}
- B1-2 : ${data.salleB12 || ''}
- B1-3 : ${data.salleB13 || ''}
- COSIP : ${data.salleCosip || ''}

Autres observations : 
${data.autresObservations || ''}`;
}

function collectBUFormData() {
    return {
        date: document.getElementById('bu-date').value,
        heureDebut: document.getElementById('bu-heure-debut').value,
        heureFin: document.getElementById('bu-heure-fin').value,
        nbInterventions: document.getElementById('bu-nb-interventions').value,
        typesInterventions: document.getElementById('bu-types-interventions').value,
        pretOrdinateurs: document.getElementById('bu-pret-ordinateurs').value,
        retourOrdinateurs: document.getElementById('bu-retour-ordinateurs').value,
        ordinateursTraites: document.getElementById('bu-ordinateurs-traites').value,
        materielsTraites: document.getElementById('bu-materiels-traites').value,
        aidesImpressions: document.getElementById('bu-aides-impressions').value,
        autresObservations: document.getElementById('bu-autres-observations').value
    };
}

function collectB21FormData() {
    return {
        date: document.getElementById('b21-date').value,
        heureDebut: document.getElementById('b21-heure-debut').value,
        heureFin: document.getElementById('b21-heure-fin').value,
        nbInterventions: document.getElementById('b21-nb-interventions').value,
        typesInterventions: document.getElementById('b21-types-interventions').value,
        aidesImpressions: document.getElementById('b21-aides-impressions').value,
        salleB21: document.getElementById('salle-b21').value,
        salleB22: document.getElementById('salle-b22').value,
        salleB23: document.getElementById('salle-b23').value,
        salleB24: document.getElementById('salle-b24').value,
        salleB12: document.getElementById('salle-b12').value,
        salleB13: document.getElementById('salle-b13').value,
        salleCosip: document.getElementById('salle-cosip').value,
        autresObservations: document.getElementById('b21-autres-observations').value
    };
}

function clearFormData(type) {
    if (type === 'BU') {
        const buInputs = document.querySelectorAll('#form-bu input, #form-bu textarea');
        buInputs.forEach(input => {
            if (input.type === 'date') {
                input.value = new Date().toISOString().split('T')[0];
            } else if (input.type === 'number') {
                input.value = '0';
            } else {
                input.value = '';
            }
        });
    } else if (type === 'B21') {
        const b21Inputs = document.querySelectorAll('#form-b21 input, #form-b21 textarea');
        b21Inputs.forEach(input => {
            if (input.type === 'date') {
                input.value = new Date().toISOString().split('T')[0];
            } else if (input.type === 'number') {
                input.value = input.id.includes('interventions') ? '1' : '0';
            } else {
                input.value = '';
            }
        });
    }
    
    // Clear session data
    localStorage.removeItem(`monitorat-bu-data-${currentUser}`);
    localStorage.removeItem(`monitorat-b21-data-${currentUser}`);
}

function getUserReports() {
    if (!currentUser) return [];
    try {
        return JSON.parse(localStorage.getItem(`monitorat-reports-${currentUser}`) || '[]');
    } catch (error) {
        console.error('Error loading reports:', error);
        return [];
    }
}

function loadReportsList() {
    const reportsList = document.getElementById('reports-list');
    const reports = getUserReports();
    
    if (reports.length === 0) {
        reportsList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Aucun rapport trouvé. Créez votre premier rapport !</p>';
        return;
    }
    
    reportsList.innerHTML = reports.map(report => `
        <div class="report-item" onclick="viewReport('${report.id}')">
            <div class="report-item-header">
                <span class="report-title">${report.title}</span>
                <span class="report-date">${new Date(report.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
            <div class="report-preview">
                ${report.content.substring(0, 100)}...
            </div>
        </div>
    `).join('');
}

function viewReport(reportId) {
    const reports = getUserReports();
    const report = reports.find(r => r.id === reportId);
    
    if (!report) {
        alert('Rapport non trouvé');
        return;
    }
    
    // Set current report for editing/deleting
    currentEditingReport = report;
    
    // Show modal
    document.getElementById('modal-title').textContent = report.title;
    document.getElementById('modal-report-content').textContent = report.content;
    document.getElementById('report-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('report-modal').style.display = 'none';
    currentEditingReport = null;
}

function editReport() {
    if (!currentEditingReport) return;
    
    // Load report data into form
    const report = currentEditingReport;
    
    // Switch to create view
    document.getElementById('nav-create').click();
    
    // Set mode and load form data
    if (report.type === 'BU') {
        document.getElementById('mode-bu').click();
        loadFormDataFromReport(report.formData, 'bu');
    } else if (report.type === 'B21') {
        document.getElementById('mode-b21').click();
        loadFormDataFromReport(report.formData, 'b21');
    }
    
    closeModal();
}

function loadFormDataFromReport(formData, type) {
    isLoadingData = true;
    
    Object.entries(formData).forEach(([key, value]) => {
        let elementId;
        
        // Map form data keys to element IDs
        if (type === 'bu') {
            const keyMap = {
                'date': 'bu-date',
                'heureDebut': 'bu-heure-debut',
                'heureFin': 'bu-heure-fin',
                'nbInterventions': 'bu-nb-interventions',
                'typesInterventions': 'bu-types-interventions',
                'pretOrdinateurs': 'bu-pret-ordinateurs',
                'retourOrdinateurs': 'bu-retour-ordinateurs',
                'ordinateursTraites': 'bu-ordinateurs-traites',
                'materielsTraites': 'bu-materiels-traites',
                'aidesImpressions': 'bu-aides-impressions',
                'autresObservations': 'bu-autres-observations'
            };
            elementId = keyMap[key] || key;
        } else if (type === 'b21') {
            const keyMap = {
                'date': 'b21-date',
                'heureDebut': 'b21-heure-debut',
                'heureFin': 'b21-heure-fin',
                'nbInterventions': 'b21-nb-interventions',
                'typesInterventions': 'b21-types-interventions',
                'aidesImpressions': 'b21-aides-impressions',
                'salleB21': 'salle-b21',
                'salleB22': 'salle-b22',
                'salleB23': 'salle-b23',
                'salleB24': 'salle-b24',
                'salleB12': 'salle-b12',
                'salleB13': 'salle-b13',
                'salleCosip': 'salle-cosip',
                'autresObservations': 'b21-autres-observations'
            };
            elementId = keyMap[key] || key;
        }
        
        const element = document.getElementById(elementId);
        if (element && value !== null && value !== undefined) {
            element.value = value;
        }
    });
    
    isLoadingData = false;
}

function deleteReport() {
    if (!currentEditingReport) return;
    
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le rapport "${currentEditingReport.title}" ?`)) {
        return;
    }
    
    const reports = getUserReports();
    const filteredReports = reports.filter(r => r.id !== currentEditingReport.id);
    
    localStorage.setItem(`monitorat-reports-${currentUser}`, JSON.stringify(filteredReports));
    
    closeModal();
    loadReportsList();
    
    alert('Rapport supprimé avec succès !');
}

function copyModalReport() {
    const reportContent = document.getElementById('modal-report-content').textContent;
    
    navigator.clipboard.writeText(reportContent).then(function() {
        alert('Rapport copié dans le presse-papiers !');
    }).catch(function(err) {
        alert('Erreur lors de la copie : ' + err);
    });
}

// Backward compatibility - keep original functions working
function generateBUReport() {
    const data = collectBUFormData();
    const report = generateBUReportContent(data);
    displayReport(report);
}

function generateB21Report() {
    const data = collectB21FormData();
    const report = generateB21ReportContent(data);
    displayReport(report);
}
