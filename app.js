document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const usernameInput = document.getElementById('username');
    const profileCard = document.getElementById('profile');
    const loadingIndicator = document.getElementById('loadingSpinner');
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme');

    // Set the initial theme based on localStorage
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    }

    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '☀️';
        }
    });

    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        fetchProfile();
    });
    
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchProfile();
        }
    });

    async function fetchProfile() {
        const username = usernameInput.value.trim();
        if (!username) {
            return;
        }

        profileCard.style.display = 'none';
        profileCard.innerHTML = '';
        loadingIndicator.style.display = 'block';

        try {
            const [userResponse, reposResponse] = await Promise.all([
                fetch(`https://api.github.com/users/${username}`),
                fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
            ]);

            if (!userResponse.ok) {
                throw new Error('User not found');
            }
            
            const userData = await userResponse.json();
            const reposData = reposResponse.ok ? await reposResponse.json() : [];

            const topRepos = reposData
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 3);

            // FIX 1: Generate the language breakdown array from your repo history
            const languagesData = calculateLanguages(reposData);

            // FIX 2: Pass all three arguments in the exact required order
            displayProfile(userData, topRepos, languagesData);
        }
        catch (error) {
            profileCard.style.display = 'block';
            profileCard.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        }
        finally {
            loadingIndicator.style.display = 'none';
        }
    }

    function calculateLanguages(repos) {
        const counts = {};
        let total = 0;

        const colors = {
            'JavaScript': '#f1e05a',
            'Python': '#3572A5',
            'Java': '#b07219',
            'C++': '#f34b7d',
            'C#': '#178600',
            'PHP': '#4F5D95',
            'TypeScript': '#2b7489',
            'Ruby': '#701516',
            'Go': '#00ADD8',
            'Shell': '#89e051',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'Other': '#ededed'
        };

        repos.forEach(repo => {
            if (repo.language) {
                counts[repo.language] = (counts[repo.language] || 0) + 1;
                total++;
            }
        });

        if (total === 0) {
            return [];
        }

        return Object.keys(counts).map(lang => {
            const percentage = Math.round((counts[lang] / total) * 100);
            const color = colors[lang] || '#' + Math.floor(Math.random() * 16777215).toString(16);
            return { name: lang, percentage, color };
        }).sort((a, b) => b.percentage - a.percentage);
    }

        function displayProfile(user, topRepos, languages) {
        profileCard.style.display = 'block';

        // 1. Languages Section (Handles user profiles with 0 repositories or 0 code languages)
        let languagesHTML = '';
        if (languages && languages.length > 0) {
            languagesHTML = `
                <div class="languages-section">
                    <h3>📊 Language Distribution</h3>
                    <div class="languages-bar">
                        ${languages.map(lang => `
                            <div class="lang-segment" style="width: ${lang.percentage}%; background-color: ${lang.color};" title="${lang.name}: ${lang.percentage}%"></div>
                        `).join('')}
                    </div>
                    <ul class="lang-legend">
                        ${languages.map(lang => `
                            <li class="legend-item">
                                <span class="legend-color" style="background-color: ${lang.color};"></span>
                                <strong>${lang.name}</strong> ${lang.percentage}%
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        } else {
            // Fallback indicator for accounts without public language stats
            languagesHTML = `
                <div class="languages-section">
                    <h3>📊 Language Distribution</h3>
                    <p class="repo-desc" style="font-style: italic; opacity: 0.7;">No coding language statistics available for this user.</p>
                </div>
            `;
        }

        // 2. Popular Repositories Section (Handles accounts with no public repos)
        let reposHTML = '<div class="repos-section"><h3>⭐ Popular Repositories</h3>';
        if (topRepos && topRepos.length > 0) {
            reposHTML += topRepos.map(repo => `
                <div class="repo-card">
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                    <p class="repo-desc">${repo.description || 'No description available'}</p>
                    <div class="repo-meta">
                        <span>⭐ ${repo.stargazers_count}</span>
                        <span>🍴 ${repo.forks_count}</span>
                        <span>● ${repo.language || 'Plain Text'}</span>
                    </div>
                </div>
            `).join('');
        } else {
            // Fallback indicator for accounts with zero repositories
            reposHTML += `<p class="repo-desc" style="font-style: italic; opacity: 0.7;">No public repositories found.</p>`;
        }
        reposHTML += '</div>';

        // 3. Main Card Template Generation
        profileCard.innerHTML = `
            <div class="profile-card">
                <img src="${user.avatar_url}" alt="${user.name || user.login}" class="avatar">
                <h2>${user.name || user.login}</h2>
                <p>${user.bio || 'This user hasn\'t written a biography yet.'}</p>
                <div class="stats" style="display: flex; justify-content: space-around; margin-top: 15px; margin-bottom: 20px;">
                    <div><strong>Repos:</strong> ${user.public_repos}</div>
                    <div><strong>Followers:</strong> ${user.followers}</div>
                    <div><strong>Following:</strong> ${user.following}</div>
                </div>
                
                ${languagesHTML}
                ${reposHTML}
                
                <br>
                <a href="${user.html_url}" target="_blank" style="color: #0366d6; text-decoration: none; font-weight: bold;">View Full Profile</a>
            </div>
        `;
    }



});
