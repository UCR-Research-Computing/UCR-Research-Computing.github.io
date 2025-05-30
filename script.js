// AI Prompt Gallery - script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("AI Prompt Gallery script loaded and DOM fully parsed.");

    // --- Firebase Initialization ---
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY", authDomain: "YOUR_AUTH_DOMAIN", projectId: "ai-prompt-gallery-dev",
        storageBucket: "YOUR_STORAGE_BUCKET", messagingSenderId: "YOUR_MESSAGING_SENDER_ID", appId: "app-id-placeholder"
    };
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const auth = firebase.auth();
    const promptsCollectionPath = `/artifacts/${firebaseConfig.projectId}/public/data/prompts`;
    console.log("Using Firestore collection path:", promptsCollectionPath);
    const promptsCollection = db.collection(promptsCollectionPath);
    let currentUserId = null;

    // --- Global Variables & DOM References ---
    const promptGalleryContainer = document.getElementById('prompt-gallery');
    const promptModal = document.getElementById('prompt-modal');
    const confirmationModal = document.getElementById('confirmation-modal');
    const addNewPromptBtn = document.getElementById('add-new-prompt-btn');
    // ... (other DOM elements as defined in previous steps) ...
    const closeBtns = document.querySelectorAll('.close-btn');
    const promptForm = document.getElementById('prompt-form');
    const modalTitleElement = document.getElementById('modal-title');
    const promptIdInput = document.getElementById('prompt-id');
    const promptTitleInput = document.getElementById('prompt-title');
    const promptTextInput = document.getElementById('prompt-text');
    const promptCategoryInput = document.getElementById('prompt-category');
    const promptKeywordsInput = document.getElementById('prompt-keywords');
    const savePromptButton = document.getElementById('save-prompt-btn');
    const confirmationMessageElement = document.getElementById('confirmation-message');
    const confirmDeleteButton = document.getElementById('confirm-yes-btn');
    const cancelDeleteButton = document.getElementById('confirm-no-btn');
    const alertOkButton = document.getElementById('alert-ok-btn');
    const categoryFilterSelect = document.getElementById('category-filter');
    const keywordSearchInput = document.getElementById('keyword-search');
    const sortOptionsSelect = document.getElementById('sort-options');
    const userIdDisplayElement = document.getElementById('user-id-display');
    const userIdPlaceholderElement = document.getElementById('userIdPlaceholder');

    let promptIdToDelete = null;
    let localPromptsCache = [];
    let userVotes = {};
    let currentlyOpenModal = null;


    // --- Initial Sample Data (for pre-population if Firestore is empty) ---
    const initialSamplePrompts = [
        {
            title: "Python CSV Parser & Histogram Plotter",
            fullText: "Generate a Python script to parse a CSV file, extract specific columns, and plot a histogram of numerical data using Matplotlib.",
            category: "Computer Science",
            keywords: ["python", "csv", "data analysis", "matplotlib", "code generation"],
            votes: 0,
            icon: "💻",
            // dateAdded: '2024-01-01T10:00:00Z' // This will be replaced by Firestore's serverTimestamp
        },
        {
            title: "CRISPR Gene Editing Paper Summary",
            fullText: "Summarize the key findings, experimental methods, and future research directions from the provided scientific paper on CRISPR-Cas9 gene editing, focusing on its implications for human health.",
            category: "Biology",
            keywords: ["crispr", "gene editing", "literature review", "summary", "human health"],
            votes: 0,
            icon: "🔬",
            // dateAdded: '2024-01-02T11:00:00Z'
        },
        {
            title: "Air Quality Data Analysis & Trends",
            fullText: "Analyze the provided dataset of air quality measurements (PM2.5, Ozone, NO2) from urban areas over the past year. Identify trends, potential correlations between pollutants, and suggest statistical methods for further investigation.",
            category: "Environmental Science",
            keywords: ["air quality", "data analysis", "trends", "statistics", "environmental data"],
            votes: 0,
            icon: "🌿",
            // dateAdded: '2024-01-03T12:00:00Z'
        },
        {
            title: "Alienation Themes: 'Catcher in the Rye' & '1984'",
            fullText: "Compare and contrast the themes of alienation and societal critique in 'The Catcher in the Rye' and '1984.' Provide textual evidence to support your analysis.",
            category: "Humanities",
            keywords: ["literature", "comparative analysis", "themes", "societal critique", "textual evidence"],
            votes: 0,
            icon: "📚",
            // dateAdded: '2024-01-04T13:00:00Z'
        },
        {
            title: "Quantum Entanglement Explanation",
            fullText: "Explain the concept of quantum entanglement to an undergraduate student with a basic understanding of classical mechanics, using analogies and avoiding overly complex mathematical formulations.",
            category: "Physics",
            keywords: ["quantum mechanics", "entanglement", "explanation", "physics education", "analogy"],
            votes: 0,
            icon: "💡",
            // dateAdded: '2024-01-05T14:00:00Z'
        }
    ];

    // --- Modal Helper Functions ---
    function showModal(modalElement) { /* ... (implementation from previous step) ... */ }
    function hideModal(modalElement) { /* ... (implementation from previous step) ... */ }
    function showMessageModal(message) { /* ... (implementation from previous step) ... */ }
    // (Ensuring these are present and correct from the previous step for brevity in this view)
    function showModal(modalElement){modalElement.style.display='flex';currentlyOpenModal=modalElement;}
    function hideModal(modalElement){modalElement.style.display='none';if(currentlyOpenModal===modalElement){currentlyOpenModal=null;}if(modalElement===confirmationModal){confirmationModal.classList.remove('alert-mode');}}
    function showMessageModal(message){confirmationMessageElement.textContent=message;confirmationModal.classList.add('alert-mode');showModal(confirmationModal);}

    // --- User Authentication (Simplified) ---
    auth.onAuthStateChanged(user => { /* ... (implementation from previous step) ... */
        if (user) {
            currentUserId = user.uid;
            if (userIdDisplayElement) userIdDisplayElement.textContent = currentUserId;
            if (userIdPlaceholderElement) userIdPlaceholderElement.textContent = currentUserId;
        } else {
            currentUserId = "mockUserId-" + Math.random().toString(36).substr(2, 9);
            if (userIdDisplayElement) userIdDisplayElement.textContent = `${currentUserId} (Mock)`;
            if (userIdPlaceholderElement) userIdPlaceholderElement.textContent = `${currentUserId.substring(0,15)}... (Mock)`;
        }
        checkAndPrePopulateFirestore();
        fetchPromptsFromFirestore();
    });

    // --- Firestore Data Fetching & Pre-population ---
    function fetchPromptsFromFirestore() { /* ... (implementation from previous step) ... */
        promptsCollection.orderBy("createdAt", "desc").onSnapshot(snapshot => {
            localPromptsCache = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            populateCategoryFilter();
            applyFiltersAndSort();
        }, error => {
            console.error("Error fetching prompts: ", error);
            showMessageModal("Error loading prompts. Check the console for details.");
        });
    }

    function checkAndPrePopulateFirestore() {
        promptsCollection.limit(1).get().then(snapshot => {
            if (snapshot.empty && initialSamplePrompts.length > 0) {
                console.log("Firestore is empty, pre-populating with sample prompts...");
                const batch = db.batch();
                initialSamplePrompts.forEach(promptData => { // promptData is from initialSamplePrompts
                    const newPromptRef = promptsCollection.doc(); // Auto-generate ID
                    // Prepare data for Firestore, ensuring all required fields are set
                    const dataToSave = {
                        ...promptData, // Spread existing fields (title, fullText, category, keywords, icon)
                        votes: promptData.votes || 0, // Ensure votes is 0 if not specified
                        creatorId: currentUserId || "system-generated",
                        createdAt: firebase.firestore.FieldValue.serverTimestamp() // Use server timestamp
                    };
                    delete dataToSave.dateAdded; // Remove client-side dateAdded if it existed
                    batch.set(newPromptRef, dataToSave);
                });
                batch.commit()
                    .then(() => console.log("Sample prompts pre-populated successfully."))
                    .catch(error => console.error("Error pre-populating prompts:", error));
            }
        }).catch(error => console.error("Error checking for initial prompts:", error));
    }


    // --- CORE UI Rendering, Voting, Filtering, Sorting (largely unchanged) ---
    function updateVoteUI(promptId) { /* ... (implementation from previous step) ... */ }
    async function handleUpvote(promptId) { /* ... (implementation from previous step) ... */ }
    async function handleDownvote(promptId) { /* ... (implementation from previous step) ... */ }
    function createVotingElement(prompt) { /* ... (implementation from previous step) ... */ }
    function renderPrompts(promptsToRender) { /* ... (implementation from previous step) ... */ }
    function populateCategoryFilter() { /* ... (implementation from previous step) ... */ }
    function applyFiltersAndSort() { /* ... (implementation from previous step) ... */ }
    // (Ensuring these are present and correct from the previous step for brevity in this view)
    function updateVoteUI(promptId){const prompt=localPromptsCache.find(p=>p.id===promptId);if(!prompt)return;const card=promptGalleryContainer.querySelector(`.prompt-card[data-id="${promptId}"]`);if(!card)return;const voteCountSpan=card.querySelector('.vote-count');const upvoteBtn=card.querySelector('.upvote-btn');const downvoteBtn=card.querySelector('.downvote-btn');if(voteCountSpan)voteCountSpan.textContent=prompt.votes;if(upvoteBtn&&downvoteBtn){upvoteBtn.classList.remove('active-upvote');downvoteBtn.classList.remove('active-downvote');if(userVotes[promptId]==='up')upvoteBtn.classList.add('active-upvote');else if(userVotes[promptId]==='down')downvoteBtn.classList.add('active-downvote');}}
    async function handleUpvote(promptId){const promptRef=promptsCollection.doc(promptId);const currentVoteStatus=userVotes[promptId];let voteIncrement=0;if(currentVoteStatus==='up'){voteIncrement=-1;userVotes[promptId]=null;}else if(currentVoteStatus==='down'){voteIncrement=2;userVotes[promptId]='up';}else{voteIncrement=1;userVotes[promptId]='up';}try{await promptRef.update({votes:firebase.firestore.FieldValue.increment(voteIncrement)});updateVoteUI(promptId);}catch(error){console.error("Error updating vote:",error);}}
    async function handleDownvote(promptId){const promptRef=promptsCollection.doc(promptId);const currentVoteStatus=userVotes[promptId];let voteIncrement=0;if(currentVoteStatus==='down'){voteIncrement=1;userVotes[promptId]=null;}else if(currentVoteStatus==='up'){voteIncrement=-2;userVotes[promptId]='down';}else{voteIncrement=-1;userVotes[promptId]='down';}try{await promptRef.update({votes:firebase.firestore.FieldValue.increment(voteIncrement)});updateVoteUI(promptId);}catch(error){console.error("Error updating vote:",error);}}
    function createVotingElement(prompt){const votingDiv=document.createElement('div');votingDiv.className='voting';const upvoteBtn=document.createElement('button');upvoteBtn.className='vote-btn upvote-btn';upvoteBtn.innerHTML='🔼';upvoteBtn.setAttribute('aria-label',`Upvote prompt titled ${prompt.title}`);upvoteBtn.addEventListener('click',(e)=>{e.stopPropagation();handleUpvote(prompt.id);});const voteCountSpan=document.createElement('span');voteCountSpan.className='vote-count';voteCountSpan.textContent=prompt.votes;const downvoteBtn=document.createElement('button');downvoteBtn.className='vote-btn downvote-btn';downvoteBtn.innerHTML='🔽';downvoteBtn.setAttribute('aria-label',`Downvote prompt titled ${prompt.title}`);downvoteBtn.addEventListener('click',(e)=>{e.stopPropagation();handleDownvote(prompt.id);});votingDiv.appendChild(upvoteBtn);votingDiv.appendChild(voteCountSpan);votingDiv.appendChild(downvoteBtn);if(userVotes[prompt.id]==='up')upvoteBtn.classList.add('active-upvote');else if(userVotes[prompt.id]==='down')downvoteBtn.classList.add('active-downvote');return votingDiv;}
    function renderPrompts(promptsToRender){if(!promptGalleryContainer){console.error("Prompt gallery container not found!");return;}promptGalleryContainer.innerHTML='';if(!promptsToRender||promptsToRender.length===0){promptGalleryContainer.innerHTML='<p>No prompts match your criteria. Try adjusting your filters or adding a new prompt!</p>';return;}promptsToRender.forEach(prompt=>{const card=document.createElement('div');card.className='prompt-card';card.dataset.id=prompt.id;const thumbnail=document.createElement('div');thumbnail.className='prompt-thumbnail';thumbnail.textContent=prompt.icon||'🖼️';card.appendChild(thumbnail);const titleH3=document.createElement('h3');titleH3.textContent=prompt.title;card.appendChild(titleH3);const textP=document.createElement('p');textP.className='prompt-text-display';textP.textContent=prompt.fullText;card.appendChild(textP);const categoryP=document.createElement('p');categoryP.className='category';categoryP.textContent=prompt.category;card.appendChild(categoryP);if(prompt.keywords&&prompt.keywords.length>0){const keywordsDiv=document.createElement('div');keywordsDiv.className='keywords';prompt.keywords.forEach(keyword=>{const keywordSpan=document.createElement('span');keywordSpan.className='keyword-tag';keywordSpan.textContent=keyword;keywordsDiv.appendChild(keywordSpan);});card.appendChild(keywordsDiv);}const votingElement=createVotingElement(prompt);card.appendChild(votingElement);const actionsDiv=document.createElement('div');actionsDiv.className='actions';const editBtn=document.createElement('button');editBtn.className='edit-btn';editBtn.textContent='Edit';editBtn.addEventListener('click',()=>openEditModal(prompt));const deleteBtn=document.createElement('button');deleteBtn.className='delete-btn';deleteBtn.textContent='Delete';deleteBtn.addEventListener('click',()=>openDeleteModal(prompt.id));actionsDiv.appendChild(editBtn);actionsDiv.appendChild(deleteBtn);card.appendChild(actionsDiv);promptGalleryContainer.appendChild(card);});}
    function populateCategoryFilter(){if(!categoryFilterSelect)return;const currentCategoryValue=categoryFilterSelect.value;categoryFilterSelect.innerHTML='<option value="all">All Categories</option>';const categories=[...new Set(localPromptsCache.map(p=>p.category))].sort();categories.forEach(category=>{const option=document.createElement('option');option.value=category;option.textContent=category;categoryFilterSelect.appendChild(option);});if(categories.includes(currentCategoryValue))categoryFilterSelect.value=currentCategoryValue;else categoryFilterSelect.value="all";}
    function applyFiltersAndSort(){let filteredPrompts=[...localPromptsCache];const selectedCategory=categoryFilterSelect.value;if(selectedCategory&&selectedCategory!=="all"){filteredPrompts=filteredPrompts.filter(p=>p.category===selectedCategory);}const searchTerm=keywordSearchInput.value.toLowerCase().trim();if(searchTerm){filteredPrompts=filteredPrompts.filter(p=>{const titleMatch=p.title.toLowerCase().includes(searchTerm);const textMatch=p.fullText.toLowerCase().includes(searchTerm);const keywordMatch=p.keywords&&p.keywords.some(k=>k.toLowerCase().includes(searchTerm));return titleMatch||textMatch||keywordMatch;});}const sortBy=sortOptionsSelect.value;switch(sortBy){case'popularity':filteredPrompts.sort((a,b)=>b.votes-a.votes);break;case'newest':filteredPrompts.sort((a,b)=>{const dateA=a.createdAt?.toDate?a.createdAt.toDate():new Date(0);const dateB=b.createdAt?.toDate?b.createdAt.toDate():new Date(0);return dateB-dateA;});break;case'alphabetical':filteredPrompts.sort((a,b)=>a.title.localeCompare(b.title,undefined,{sensitivity:'base'}));break;}renderPrompts(filteredPrompts);}


    // --- CRUD Operations with Firestore & Custom Modals ---
    function openAddModal() { /* ... (implementation from previous step) ... */ }
    function openEditModal(prompt) { /* ... (implementation from previous step) ... */ }
    async function handleFormSubmit(event) { /* ... (implementation from previous step) ... */ }
    function openDeleteModal(id) { /* ... (implementation from previous step) ... */ }
    async function handleDeleteConfirm() { /* ... (implementation from previous step) ... */ }
    // (Ensuring these are present and correct from the previous step for brevity in this view)
    function openAddModal(){promptForm.reset();promptIdInput.value='';modalTitleElement.textContent='Add New Prompt';savePromptButton.textContent='Save Prompt';showModal(promptModal);}
    function openEditModal(prompt){promptForm.reset();promptIdInput.value=prompt.id;promptTitleInput.value=prompt.title;promptTextInput.value=prompt.fullText;promptCategoryInput.value=prompt.category;promptKeywordsInput.value=prompt.keywords?prompt.keywords.join(', '):'';modalTitleElement.textContent='Edit Prompt';savePromptButton.textContent='Update Prompt';showModal(promptModal);}
    async function handleFormSubmit(event){event.preventDefault();const title=promptTitleInput.value.trim();const fullText=promptTextInput.value.trim();const category=promptCategoryInput.value.trim();const keywordsString=promptKeywordsInput.value.trim();const keywords=keywordsString?keywordsString.split(',').map(k=>k.trim()).filter(k=>k):[];const id=promptIdInput.value;if(!title||!fullText||!category){showMessageModal("Please fill in Title, Prompt Text, and Category.");return;}const promptData={title,fullText,category,keywords};try{if(id){promptData.updatedAt=firebase.firestore.FieldValue.serverTimestamp();await promptsCollection.doc(id).update(promptData);}else{promptData.creatorId=currentUserId||"unknown";promptData.createdAt=firebase.firestore.FieldValue.serverTimestamp();promptData.votes=0;promptData.icon='🆕';await promptsCollection.add(promptData);}hideModal(promptModal);}catch(error){console.error("Error saving prompt:",error);showMessageModal("Error saving prompt: "+error.message);}}
    function openDeleteModal(id){promptIdToDelete=id;const prompt=localPromptsCache.find(p=>p.id===id);confirmationMessageElement.textContent=prompt?`Are you sure you want to delete "${prompt.title}"?`:"Are you sure you want to delete this prompt?";confirmationModal.classList.remove('alert-mode');showModal(confirmationModal);}
    async function handleDeleteConfirm(){if(promptIdToDelete){try{await promptsCollection.doc(promptIdToDelete).delete();if(userVotes.hasOwnProperty(promptIdToDelete))delete userVotes[promptIdToDelete];promptIdToDelete=null;}catch(error){console.error("Error deleting prompt:",error);showMessageModal("Error deleting prompt: "+error.message);}}hideModal(confirmationModal);}

    // --- Event Listeners Setup ---
    // (Ensuring these are present and correct from the previous step for brevity in this view)
    if(addNewPromptBtn)addNewPromptBtn.addEventListener('click',openAddModal);
    if(promptForm)promptForm.addEventListener('submit',handleFormSubmit);
    if(confirmDeleteButton)confirmDeleteButton.addEventListener('click',handleDeleteConfirm);
    if(alertOkButton)alertOkButton.addEventListener('click',()=>hideModal(confirmationModal));
    closeBtns.forEach(btn=>{btn.addEventListener('click',(e)=>{const modalToClose=e.target.closest('.modal');if(modalToClose){hideModal(modalToClose);}});});
    window.addEventListener('click',(event)=>{if(event.target===promptModal)hideModal(promptModal);if(event.target===confirmationModal)hideModal(confirmationModal);});
    window.addEventListener('keydown',(event)=>{if(event.key==='Escape'&&currentlyOpenModal){hideModal(currentlyOpenModal);}});
    if(cancelDeleteButton)cancelDeleteButton.addEventListener('click',()=>{hideModal(confirmationModal);promptIdToDelete=null;});
    if(categoryFilterSelect)categoryFilterSelect.addEventListener('change',applyFiltersAndSort);
    if(keywordSearchInput)keywordSearchInput.addEventListener('input',applyFiltersAndSort);
    if(sortOptionsSelect)sortOptionsSelect.addEventListener('change',applyFiltersAndSort);
});
