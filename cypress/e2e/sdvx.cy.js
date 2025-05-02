describe('SDVX Profile with Injected Cookies', () => {
    before(() => {
        // Set cookies for both domains
        // Cookies expire in 7 days from generation
        cy.setCookie('M573SSID', Cypress.env('COOKIE_M573SSID'), {
            domain: 'p.eagate.573.jp',
            path: '/',
            secure: true,
            sameSite: 'None'
        });
    });

    it('Access profile page and extracting everything to json', () => {
        cy.visit('https://p.eagate.573.jp/game/sdvx/vi/playdata/profile/index.html');
        cy.get('#player_id').should('be.visible');

        // Initialize data object
        const profileData = {
            playerInfo: {},
            stats: {},
            timestamp: new Date().toISOString()
        };

        // Extract player information
        cy.get('#player_id').invoke('text').then((text) => {
            profileData.playerInfo.id = text.trim();
        });

        cy.get('#player_name p').eq(1).invoke('text').then((text) => {
            profileData.playerInfo.name = text.trim();
        });

        cy.get('#player_name p').eq(0).invoke('text').then((text) => {
            profileData.playerInfo.bio = text.trim();
        });

        extractImage('#apcard img').then((base64) => {
            profileData.playerInfo.apCard = base64;
        });

        cy.get('#force_point').invoke('text').then((text) => {
            profileData.playerInfo.forcePoint = parseFloat(text.trim());
        });

        cy.get('#force > .force_class').then(($el) => {
            profileData.playerInfo.forceClass = $el.attr('id');
        });

        cy.get('#force > .force_level').then(($el) => {
            profileData.playerInfo.forceLevel = $el.attr('id');
        });

        extractImageCSS('#force > .force_class').then((base64) => {
            profileData.playerInfo.forceClassImage = base64;
        });

        extractImageCSS('#force > .force_level').then((base64) => {
            profileData.playerInfo.forceLevelImage = base64;
        });

        // Extract profile stats
        cy.get('#profile_li li').each(($li) => {
            const category = $li.find('.profile_col').text().trim();
            let valueElement = $li.find('.profile_cnt');

            if (category === 'スキルLV') {
                valueElement = $li.find('.profile_skill');
            }

            const value = valueElement.length > 0 ? valueElement.text().trim() : '';

            switch (category) {
                case 'プレー回数':
                    profileData.stats.playCount = extractNumber(value);
                    break;
                case 'スキルLV':
                    const skillLevelClass = $li.find('[class*="skill_"]').attr('class');
                    profileData.stats.skillRank = skillLevelClass ?
                        skillLevelClass.split(' ').find(cls => cls.startsWith('skill_')).replace('skill_', '') : '';
                    profileData.stats.skillLevelBio = value;
                    extractImageCSS('.profile_skill').then((base64) => {
                        profileData.stats.skillLevelImage = base64;
                    });
                    break;
                case '所持PCB':
                    profileData.stats.pcbCount = extractNumber(value);
                    break;
                case 'BLASTER PASS':
                    if (value === '購入はこちらから') {
                        profileData.stats.blasterPass = false;
                    } else {
                        profileData.stats.blasterPass = true;
                    }
                    extractImageCSS('.profile_blasterpass').then((base64) => {
                        profileData.stats.blasterPassImage = base64;
                    });
                    break;
                case 'ARENA RANK':
                    const arenaClass = $li.find('[class*="arena_"]').attr('class');
                    profileData.stats.arenaRank = arenaClass ?
                        arenaClass.split(' ').find(cls => cls.startsWith('arena_')).replace('arena_', '') : '';
                    extractImageCSS('.profile_arena').then((base64) => {
                        profileData.stats.arenaRankImage = base64;
                    });
                    break;
                case 'ARENA POWER':
                    profileData.stats.arenaPower = parseInt($li.find('p').first().text().trim());
                    profileData.stats.arenaPowerExpiry = $li.find('p').eq(1).text().replace('まで', '').trim();
                    break;
                case '最終プレー日時':
                    profileData.stats.lastPlayDate = value;
                    break;
                case '最終プレー店舗':
                    profileData.stats.lastPlayStore = value;
                    break;
                case '連続プレー日数':
                    profileData.stats.consecutiveDays = extractNumber(value);
                    break;
                case '連続プレー週数':
                    profileData.stats.consecutiveWeeks = extractNumber(value);
                    break;
                default:
                    profileData.stats[category] = value;
                    break;
            }
        });

        // Finalize and save data
        cy.then(() => {
            // Save to JSON file
            cy.writeFile('cypress/exports/profileData.json', profileData);
            cy.log('Profile data extracted:', profileData);
        });
    });
});

// Function to extract image from src attribute
function extractImage(selector) {
    return new Cypress.Promise((resolve) => {
        cy.get(selector).then(($img) => {
            const src = $img.attr('src');
            if (!src) return resolve(null);

            const fullUrl = src.startsWith('http') ? src : `https://p.eagate.573.jp${src}`;

            cy.request({
                url: fullUrl,
                encoding: 'base64'
            }).then((response) => {
                resolve(`data:image/png;base64,${response.body}`);
            });
        });
    });
}

// Function to extract image from CSS background
function extractImageCSS(selector) {
    return new Cypress.Promise((resolve) => {
        cy.get(selector).then(($el) => {
            const backgroundImage = $el.css('background-image');
            if (!backgroundImage || backgroundImage === 'none') return resolve(null);

            const urlMatch = backgroundImage.match(/url\(["']?(.*?)["']?\)/);
            if (!urlMatch || !urlMatch[1]) return resolve(null);

            const src = urlMatch[1];
            const fullUrl = src.startsWith('http') ? src : `https://p.eagate.573.jp${src}`;

            cy.request({
                url: fullUrl,
                encoding: 'base64'
            }).then((response) => {
                resolve(`data:image/png;base64,${response.body}`);
            });
        });
    });
}

// Function to extract numeric value from text
function extractNumber(text) {
    return parseInt(text.replace(/[^\d]/g, '')) || 0;
}
