document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const resultsSection = document.getElementById('results-section');
    const resultsGrid = document.getElementById('results-grid');
    const loadingSpinner = document.getElementById('loading-spinner');
    const noResults = document.getElementById('no-results');

    // Modals
    const closeButtons = document.querySelectorAll('.close-modal');

    // State
    const apiKey = '14dlpp67XvJ208JzGltlY4eEu9OyLg0a';
    const API_BASE_URL = 'https://api.opensubtitles.com/api/v1';

    // Event Listeners
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal);
        });
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Functions
    async function handleSearch() {
        const query = searchInput.value.trim();
        if (!query) return;

        showLoading(true);
        resultsSection.classList.remove('hidden');
        resultsGrid.innerHTML = '';
        noResults.classList.add('hidden');

        try {
            const data = await searchSubtitles(query);
            displayResults(data.data);
        } catch (error) {
            console.error('Search error:', error);
            showToast('Failed to fetch subtitles. Check your API Key.', 'error');
        } finally {
            showLoading(false);
        }
    }

    async function searchSubtitles(query) {
        const response = await fetch(`${API_BASE_URL}/subtitles?query=${encodeURIComponent(query)}`, {
            headers: {
                'Api-Key': apiKey,
                'Content-Type': 'application/json',
                'X-User-Agent': 'BeamlakSRTs v1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
    }

    function displayResults(subtitles) {
        if (!subtitles || subtitles.length === 0) {
            noResults.classList.remove('hidden');
            return;
        }

        // Prioritize English subtitles
        subtitles.sort((a, b) => {
            const isEnA = a.attributes.language === 'en' || a.attributes.language === 'en-US';
            const isEnB = b.attributes.language === 'en' || b.attributes.language === 'en-US';
            if (isEnA && !isEnB) return -1;
            if (!isEnA && isEnB) return 1;
            return b.attributes.download_count - a.attributes.download_count; // Secondary sort by downloads
        });

        subtitles.forEach(sub => {
            const card = createResultCard(sub);
            resultsGrid.appendChild(card);
        });
    }

    function createResultCard(sub) {
        const div = document.createElement('div');
        div.className = 'result-card';

        const attributes = sub.attributes;
        const title = attributes.feature_details.title || attributes.feature_details.movie_name;
        const year = attributes.feature_details.year;
        const lang = attributes.language;
        const downloads = attributes.download_count;
        const fileId = attributes.files[0].file_id; // Taking the first file

        div.innerHTML = `
            <h3>${title} (${year})</h3>
            <div class="result-meta">
                <span title="Language"><i class="fa-solid fa-language"></i> ${lang}</span>
                <span title="Downloads"><i class="fa-solid fa-download"></i> ${downloads}</span>
            </div>
            <div class="result-actions">
                <button class="download-icon-btn" title="Download">
                    <i class="fa-solid fa-file-arrow-down"></i>
                </button>
            </div>
        `;

        // Add click event for download
        div.querySelector('.download-icon-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            initiateDownload(fileId, title);
        });

        return div;
    }

    async function initiateDownload(fileId, title) {
        if (!apiKey) return;

        try {
            const response = await fetch(`${API_BASE_URL}/download`, {
                method: 'POST',
                headers: {
                    'Api-Key': apiKey,
                    'Content-Type': 'application/json',
                    'X-User-Agent': 'BeamlakSRTs v1.0'
                    // 'Authorization': 'Bearer YOUR_JWT_TOKEN' // Required for some downloads
                },
                body: JSON.stringify({ file_id: fileId })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Download failed');
            }

            const data = await response.json();

            // Force download by fetching the content and creating a blob
            showToast('Fetching subtitle file...', 'info');

            const fileResponse = await fetch(data.link);
            const blob = await fileResponse.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            // Ensure filename ends with .srt
            let fileName = data.file_name;
            if (!fileName.endsWith('.srt')) fileName += '.srt';
            a.download = fileName;

            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            showToast('Download started!', 'success');

        } catch (error) {
            console.error('Download error:', error);
            showToast('Download failed. You may need a VIP account or JWT token.', 'error');
        }
    }

    // UI Helpers
    function openModal(modal) {
        modal.classList.remove('hidden');
        // Small delay to allow display:flex to apply before opacity transition
        setTimeout(() => modal.classList.add('active'), 10);
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }

    function showLoading(isLoading) {
        if (isLoading) {
            loadingSpinner.classList.remove('hidden');
        } else {
            loadingSpinner.classList.add('hidden');
        }
    }

    function showToast(message, type = 'info') {
        // Simple toast implementation
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ef4444' : '#10b981'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 2000;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
});
