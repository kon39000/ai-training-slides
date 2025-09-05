// グローバル変数
let resources = [];
let currentFilter = 'all';
let currentSort = 'latest';
let weeklyAdditions = 0;

// DOM要素の取得
const searchInput = document.getElementById('searchInput');
const addResourceBtn = document.getElementById('addResourceBtn');
const addResourceModal = document.getElementById('addResourceModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const resourceForm = document.getElementById('resourceForm');
const resourcesGrid = document.getElementById('resourcesGrid');
const navLinks = document.querySelectorAll('.nav-link');
const filterBtns = document.querySelectorAll('.filter-btn');
const totalResourcesEl = document.getElementById('totalResources');
const weeklyAdditionsEl = document.getElementById('weeklyAdditions');
const resourceCountEl = document.getElementById('resourceCount');
const challengeProgress = document.getElementById('challengeProgress');

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    loadSampleData();
    updateStats();
    renderResources();
    setupEventListeners();
});

// イベントリスナーの設定
function setupEventListeners() {
    // 検索機能
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // モーダル制御
    addResourceBtn.addEventListener('click', openModal);
    closeModal.addEventListener('click', closeModalHandler);
    cancelBtn.addEventListener('click', closeModalHandler);
    
    // フォーム送信
    resourceForm.addEventListener('submit', handleFormSubmit);
    
    // カテゴリーフィルター
    navLinks.forEach(link => {
        link.addEventListener('click', handleCategoryFilter);
    });
    
    // ソートフィルター
    filterBtns.forEach(btn => {
        btn.addEventListener('click', handleSortFilter);
    });
    
    // モーダル外クリックで閉じる
    addResourceModal.addEventListener('click', function(e) {
        if (e.target === addResourceModal) {
            closeModalHandler();
        }
    });
    
    // ESCキーでモーダルを閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && addResourceModal.classList.contains('show')) {
            closeModalHandler();
        }
    });
}

// サンプルデータの読み込み
function loadSampleData() {
    const sampleResources = [
        {
            id: 1,
            title: 'React公式ドキュメント',
            url: 'https://react.dev/',
            description: 'React.jsの公式ドキュメント。最新の機能とベストプラクティスが学べます。',
            category: 'javascript',
            tags: ['React', 'JavaScript', 'フロントエンド'],
            dateAdded: new Date('2025-01-10'),
            isThisWeek: true
        },
        {
            id: 2,
            title: 'ChatGPT for Developers',
            url: 'https://openai.com/chatgpt',
            description: 'AI開発支援ツール。コード生成や問題解決に活用できます。',
            category: 'ai',
            tags: ['AI', 'ChatGPT', '開発支援'],
            dateAdded: new Date('2025-01-12'),
            isThisWeek: true
        },
        {
            id: 3,
            title: 'MDN Web Docs',
            url: 'https://developer.mozilla.org/',
            description: 'Web開発の信頼できるリファレンス。HTML、CSS、JavaScriptの詳細な情報。',
            category: 'webdev',
            tags: ['HTML', 'CSS', 'JavaScript', 'リファレンス'],
            dateAdded: new Date('2025-01-08'),
            isThisWeek: false
        },
        {
            id: 4,
            title: 'VS Code',
            url: 'https://code.visualstudio.com/',
            description: '人気のコードエディタ。豊富な拡張機能で開発効率アップ。',
            category: 'tools',
            tags: ['エディタ', 'VSCode', '開発環境'],
            dateAdded: new Date('2025-01-05'),
            isThisWeek: false
        },
        {
            id: 5,
            title: 'Gemini AI',
            url: 'https://gemini.google.com/',
            description: 'Googleの最新AI。コード分析や技術的な質問に優れた回答を提供。',
            category: 'ai',
            tags: ['AI', 'Gemini', 'Google'],
            dateAdded: new Date('2025-01-14'),
            isThisWeek: true
        }
    ];
    
    resources = sampleResources;
    weeklyAdditions = sampleResources.filter(r => r.isThisWeek).length;
}

// 統計の更新
function updateStats() {
    totalResourcesEl.textContent = resources.length;
    weeklyAdditionsEl.textContent = weeklyAdditions;
    
    // チャレンジ進捗の更新
    const progress = Math.min((weeklyAdditions / 3) * 100, 100);
    challengeProgress.style.width = progress + '%';
    challengeProgress.parentElement.nextElementSibling.textContent = `${weeklyAdditions}/3 完了`;
}

// リソースの描画
function renderResources() {
    const filteredResources = getFilteredResources();
    resourceCountEl.textContent = `${filteredResources.length}件`;
    
    if (filteredResources.length === 0) {
        resourcesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>リソースが見つかりません</h3>
                <p>検索条件を変更するか、新しいリソースを追加してください。</p>
            </div>
        `;
        return;
    }
    
    resourcesGrid.innerHTML = filteredResources.map(resource => `
        <div class="resource-card ${resource.category} fade-in">
            <div class="resource-header">
                <div>
                    <h3 class="resource-title">${escapeHtml(resource.title)}</h3>
                    <a href="${escapeHtml(resource.url)}" target="_blank" class="resource-url">
                        ${escapeHtml(resource.url)}
                    </a>
                </div>
                <div class="resource-actions">
                    <button class="action-btn" onclick="editResource(${resource.id})" title="編集">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="deleteResource(${resource.id})" title="削除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="resource-description">${escapeHtml(resource.description)}</p>
            <div class="resource-meta">
                <div class="resource-tags">
                    ${resource.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
                <span class="resource-date">${formatDate(resource.dateAdded)}</span>
            </div>
        </div>
    `).join('');
}

// フィルタリングされたリソースを取得
function getFilteredResources() {
    let filtered = resources;
    
    // カテゴリーフィルター
    if (currentFilter !== 'all') {
        filtered = filtered.filter(resource => resource.category === currentFilter);
    }
    
    // 検索フィルター
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(resource => 
            resource.title.toLowerCase().includes(searchTerm) ||
            resource.description.toLowerCase().includes(searchTerm) ||
            resource.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    // ソート
    switch (currentSort) {
        case 'latest':
            filtered.sort((a, b) => b.dateAdded - a.dateAdded);
            break;
        case 'popular':
            // ここでは単純に日付順とします（実際は閲覧数やいいね数でソート）
            filtered.sort((a, b) => b.dateAdded - a.dateAdded);
            break;
        case 'alphabetical':
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }
    
    return filtered;
}

// 検索処理
function handleSearch() {
    renderResources();
}

// カテゴリーフィルター処理
function handleCategoryFilter(e) {
    e.preventDefault();
    
    // アクティブクラスの更新
    navLinks.forEach(link => link.classList.remove('active'));
    e.target.classList.add('active');
    
    currentFilter = e.target.dataset.category;
    renderResources();
}

// ソートフィルター処理
function handleSortFilter(e) {
    // アクティブクラスの更新
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    currentSort = e.target.dataset.sort;
    renderResources();
}

// モーダルを開く
function openModal() {
    addResourceModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    document.getElementById('resourceTitle').focus();
}

// モーダルを閉じる
function closeModalHandler() {
    addResourceModal.classList.remove('show');
    document.body.style.overflow = '';
    resourceForm.reset();
}

// フォーム送信処理
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(resourceForm);
    const newResource = {
        id: Date.now(),
        title: document.getElementById('resourceTitle').value,
        url: document.getElementById('resourceUrl').value,
        description: document.getElementById('resourceDescription').value,
        category: document.getElementById('resourceCategory').value,
        tags: document.getElementById('resourceTags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0),
        dateAdded: new Date(),
        isThisWeek: true
    };
    
    // バリデーション
    if (!newResource.title || !newResource.url || !newResource.category) {
        alert('必須フィールドを入力してください。');
        return;
    }
    
    // URLの形式チェック
    try {
        new URL(newResource.url);
    } catch {
        alert('有効なURLを入力してください。');
        return;
    }
    
    // リソースを追加
    resources.unshift(newResource);
    weeklyAdditions++;
    
    // 統計とリソース表示を更新
    updateStats();
    renderResources();
    
    // モーダルを閉じる
    closeModalHandler();
    
    // 成功メッセージ
    showNotification('リソースが追加されました！', 'success');
}

// リソースの編集
function editResource(id) {
    const resource = resources.find(r => r.id === id);
    if (!resource) return;
    
    // フォームに値を設定
    document.getElementById('resourceTitle').value = resource.title;
    document.getElementById('resourceUrl').value = resource.url;
    document.getElementById('resourceDescription').value = resource.description;
    document.getElementById('resourceCategory').value = resource.category;
    document.getElementById('resourceTags').value = resource.tags.join(', ');
    
    // フォームの送信ハンドラーを一時的に変更
    resourceForm.onsubmit = function(e) {
        e.preventDefault();
        updateResource(id);
    };
    
    openModal();
}

// リソースの更新
function updateResource(id) {
    const resourceIndex = resources.findIndex(r => r.id === id);
    if (resourceIndex === -1) return;
    
    const updatedResource = {
        ...resources[resourceIndex],
        title: document.getElementById('resourceTitle').value,
        url: document.getElementById('resourceUrl').value,
        description: document.getElementById('resourceDescription').value,
        category: document.getElementById('resourceCategory').value,
        tags: document.getElementById('resourceTags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)
    };
    
    resources[resourceIndex] = updatedResource;
    
    // フォームハンドラーを元に戻す
    resourceForm.onsubmit = handleFormSubmit;
    
    updateStats();
    renderResources();
    closeModalHandler();
    
    showNotification('リソースが更新されました！', 'success');
}

// リソースの削除
function deleteResource(id) {
    if (!confirm('このリソースを削除しますか？')) return;
    
    const resourceIndex = resources.findIndex(r => r.id === id);
    if (resourceIndex === -1) return;
    
    const resource = resources[resourceIndex];
    resources.splice(resourceIndex, 1);
    
    // 今週追加されたものだった場合は週間追加数を減らす
    if (resource.isThisWeek) {
        weeklyAdditions = Math.max(0, weeklyAdditions - 1);
    }
    
    updateStats();
    renderResources();
    
    showNotification('リソースが削除されました。', 'info');
}

// 通知表示
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // アニメーション
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自動削除
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ユーティリティ関数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return '今日';
    if (days === 1) return '昨日';
    if (days < 7) return `${days}日前`;
    if (days < 30) return `${Math.floor(days / 7)}週間前`;
    
    return date.toLocaleDateString('ja-JP');
}

// ローカルストレージの読み書き
function saveToLocalStorage() {
    localStorage.setItem('techcurator_resources', JSON.stringify(resources));
    localStorage.setItem('techcurator_weekly', weeklyAdditions.toString());
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('techcurator_resources');
    const savedWeekly = localStorage.getItem('techcurator_weekly');
    
    if (saved) {
        try {
            resources = JSON.parse(saved).map(r => ({
                ...r,
                dateAdded: new Date(r.dateAdded)
            }));
        } catch (e) {
            console.error('Failed to load resources from localStorage:', e);
        }
    }
    
    if (savedWeekly) {
        weeklyAdditions = parseInt(savedWeekly) || 0;
    }
}

// ページ離脱時にデータを保存
window.addEventListener('beforeunload', saveToLocalStorage);