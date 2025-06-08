/**
 * @param {Document} doc - The parsed HTML document
 */
function extractContent(doc) {


    const playerData = extractPlayerData(doc);
    displayPlayerData(playerData);

    const images = extractImages(doc);
    displayImages(images);
}

/**
 * @param {Document} doc - The parsed HTML document
 * @returns {Array} Array of player objects
 */
function extractPlayerData(doc) {
    const players = [];


    const player1 = {
        name: "Player 1",
        aember: doc.getElementById("aember-counter-p1")?.textContent || "0",
        chains: doc.getElementById("chains-counter-p1")?.textContent || "0",
        handSize: doc.getElementById("hand-size-p1")?.textContent || "Hand Size: 6"
    };
    players.push(player1);

    
    const player2 = {
        name: "Player 2",
        aember: doc.getElementById("aember-counter-p2")?.textContent || "0",
        chains: doc.getElementById("chains-counter-p2")?.textContent || "0",
        handSize: doc.getElementById("hand-size-p2")?.textContent || "Hand Size: 6"
    };
    players.push(player2);

    return players;
}

/**
 * @param {Document} doc - The parsed HTML document
 * @returns {Array} Array of image objects
 */
function extractImages(doc) {
    const images = [];
    const imgElements = doc.querySelectorAll("img");

    imgElements.forEach(img => {
        const src = img.getAttribute("src");
        const alt = img.getAttribute("alt");

        if (src) {
            const absoluteSrc = new URL(src, "https://keyforgecounter.netlify.app/").href;
            images.push({
                src: absoluteSrc,
                alt: alt || "No alt text"
            });
        }
    });

    return images;
}

/**
 * @param {Array} players - Array of player objects
 */
function displayPlayerData(players) {
    const resultDiv = document.getElementById("result");

    players.forEach(player => {
        const playerDiv = document.createElement("div");
        playerDiv.className = "player-info";

        playerDiv.innerHTML = `
            <h2>${player.name}</h2>
            <p>Aember: ${player.aember}</p>
            <p>Chains: ${player.chains}</p>
            <p>${player.handSize}</p>
        `;

        resultDiv.appendChild(playerDiv);
    });
}

/**
 * @param {Array} images 
 */
function displayImages(images) {
    const resultDiv = document.getElementById("result");

    const imagesTitle = document.createElement("h2");
    imagesTitle.textContent = "Images";
    resultDiv.appendChild(imagesTitle);

    const imageContainer = document.createElement("div");
    imageContainer.className = "image-container";

    images.forEach(image => {
        const img = document.createElement("img");
        img.src = image.src;
        img.alt = image.alt;
        img.title = image.alt;
        imageContainer.appendChild(img);
    });

    resultDiv.appendChild(imageContainer);
}


function scrapeWebsite() {
    const targetUrl = "https://keyforgecounter.netlify.app/";
    const proxyUrl = "https://corsproxy.io/?"; // salvou o trab
    const url = proxyUrl + encodeURIComponent(targetUrl);

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            // transforma em html
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // Extrai
            extractContent(doc);
        })
        .catch(error => {
            document.getElementById("result").innerHTML = `<p>Error: ${error.message}</p>`;
        });
}


function setupEventListeners() {
    document.getElementById("scrapeBtn").addEventListener("click", scrapeWebsite);
}

window.onload = setupEventListeners;
