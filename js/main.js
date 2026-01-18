// デフォルトの検索サイト
const defaultSites = [
    {
        name: '株探決算ページ',
        url: 'https://kabutan.jp/stock/finance?code=TESTSEARCH'
    },
    {
        name: 'マネックス銘柄スカウター',
        url: 'https://monex.ifis.co.jp/index.php?sa=report_zaimu&bcode=TESTSEARCH'
    },
    {
        name: 'Trading View',
        url: 'https://jp.tradingview.com/chart/zh1Bhl2H/?symbol=TESTSEARCH'
    },
    {
        name: '四季報オンライン',
        url: 'https://shikiho.toyokeizai.net/stocks/TESTSEARCH'
    },
    {
        name: 'Yahoo!ファイナンス',
        url: 'https://finance.yahoo.co.jp/quote/TESTSEARCH'
    },
    {
        name: 'X (Twitter)',
        url: 'https://twitter.com/search?src=typd&q=TESTSEARCH'
    },
    {
        name: 'バフェットコード',
        url: 'https://www.buffett-code.com/company/TESTSEARCH/'
    },
    {
        name: 'YouTube',
        url: 'https://www.youtube.com/results?search_query=TESTSEARCH'
    }
];

// ローカルストレージのキー
const STORAGE_KEY = 'customSearchSites';

// サイトデータの初期化
let sites = [];

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    // サイトデータの読み込み
    loadSites();
    
    // UIの初期化
    renderSitesList();
    
    // イベントリスナーの設定
    setupEventListeners();
    
    // キーボードナビゲーションの設定
    setupKeyboardNavigation();
});

// サイトデータの読み込み
function loadSites() {
    const savedSites = localStorage.getItem(STORAGE_KEY);
    if (savedSites) {
        try {
            sites = JSON.parse(savedSites);
        } catch (e) {
            console.error('サイトデータの読み込みに失敗しました', e);
            sites = [...defaultSites];
        }
    } else {
        sites = [...defaultSites];
    }
}

// サイトデータの保存
function saveSites() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
}

// サイトリストのレンダリング
function renderSitesList() {
    const sitesList = document.getElementById('sites-list');
    if (!sitesList) {
        console.error('sites-list element not found');
        return;
    }
    
    sitesList.innerHTML = '';
    
    sites.forEach((site, index) => {
        const siteItem = document.createElement('div');
        siteItem.className = 'site-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `site-${index}`;
        checkbox.dataset.index = index;
        
        const label = document.createElement('label');
        label.htmlFor = `site-${index}`;
        label.textContent = site.name;
        
        siteItem.appendChild(checkbox);
        siteItem.appendChild(label);
        sitesList.appendChild(siteItem);
    });
}

// イベントリスナーの設定
function setupEventListeners() {
    // 個別検索ボタン
    const searchButtons = document.querySelectorAll('.search-row:not(.google-row) .search-btn');
    searchButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const input = document.querySelectorAll('.search-row:not(.google-row) .search-input')[index];
            performSearch(input.value);
        });
    });
    
    // Enterキーで検索
    const searchInputs = document.querySelectorAll('.search-row:not(.google-row) .search-input');
    searchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(input.value);
            }
        });
    });
    
    // Google検索ボタン
    document.getElementById('google-btn').addEventListener('click', () => {
        const query = document.getElementById('google-input').value.trim();
        if (query) {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        }
    });
    
    // Google検索のEnterキー
    document.getElementById('google-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = e.target.value.trim();
            if (query) {
                window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
            }
        }
    });
    
    // 一括検索ボタン
    document.getElementById('bulk-search-btn').addEventListener('click', performBulkSearch);
    
    // 一括入力ボタン
    document.getElementById('bulk-input-btn').addEventListener('click', performBulkInput);
    
    // 一括入力のEnterキー
    document.getElementById('bulk-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performBulkInput();
        }
    });
    
    // リセットボタン
    document.getElementById('reset-btn').addEventListener('click', resetAllSearchInputs);
    
    // サイト編集ボタン
    document.getElementById('edit-sites-btn').addEventListener('click', openEditModal);
    
    // エクスポートボタン
    document.getElementById('export-btn').addEventListener('click', exportSites);
    
    // インポートボタン
    document.getElementById('import-btn').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    
    // ファイル選択
    document.getElementById('import-file').addEventListener('change', importSites);
    
    // モーダル関連
    document.querySelector('.close').addEventListener('click', closeEditModal);
    document.getElementById('cancel-btn').addEventListener('click', closeEditModal);
    document.getElementById('save-sites-btn').addEventListener('click', saveSitesFromModal);
    document.getElementById('add-site-btn').addEventListener('click', addSiteEditor);
    
    // モーダル外クリックで閉じる
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('edit-modal');
        if (e.target === modal) {
            closeEditModal();
        }
    });
}

// 一括入力機能
function performBulkInput() {
    const input = document.getElementById('bulk-input').value.trim();
    
    if (!input) {
        alert('検索キーワードを入力してください\n\n例: 7203,6758,9984\n（カンマ、スペース、読点で区切り）');
        return;
    }
    
    // 複数の区切り文字に対応（半角カンマ、全角カンマ、スペース、読点）
    // 正規表現で分割: ,、，、空白、タブ
    const keywords = input
        .split(/[,，、\s]+/) // カンマ（半角・全角）、読点、空白文字で分割
        .map(keyword => keyword.trim()) // 前後の空白を削除
        .filter(keyword => keyword.length > 0) // 空文字を除外
        .slice(0, 15); // 最大15個まで
    
    if (keywords.length === 0) {
        alert('有効な検索キーワードが見つかりませんでした');
        return;
    }
    
    // すべての検索窓を取得
    const searchInputs = document.querySelectorAll('.search-row:not(.google-row) .search-input');
    
    // まず全ての検索窓をクリア
    searchInputs.forEach(input => {
        input.value = '';
    });
    
    // 入力されたキーワードを上から順に設定
    keywords.forEach((keyword, index) => {
        if (index < searchInputs.length) {
            searchInputs[index].value = keyword;
        }
    });
    
    // 成功メッセージ
    alert(`${keywords.length}個のキーワードを入力しました\n\n${keywords.join('\n')}`);
    
    // 入力欄をクリア
    document.getElementById('bulk-input').value = '';
}

// 全検索窓をリセット
function resetAllSearchInputs() {
    const confirmed = confirm('すべての検索窓をクリアしますか？');
    
    if (!confirmed) {
        return;
    }
    
    // すべての検索窓をクリア
    const searchInputs = document.querySelectorAll('.search-row:not(.google-row) .search-input');
    searchInputs.forEach(input => {
        input.value = '';
    });
    
    // Google検索窓もクリア
    document.getElementById('google-input').value = '';
    
    // 一括入力窓もクリア
    document.getElementById('bulk-input').value = '';
    
    alert('すべての検索窓をクリアしました');
}

// 検索実行
function performSearch(query) {
    if (!query || !query.trim()) {
        alert('検索キーワードを入力してください');
        return;
    }
    
    const checkedSites = getCheckedSites();
    
    if (checkedSites.length === 0) {
        alert('検索するサイトを選択してください');
        return;
    }
    
    checkedSites.forEach(site => {
        const searchUrl = site.url.replace('TESTSEARCH', encodeURIComponent(query.trim()));
        window.open(searchUrl, '_blank');
    });
}

// 一括検索
function performBulkSearch() {
    const checkedSites = getCheckedSites();
    
    // 1つのサイトのみチェックされている場合のみ実行
    if (checkedSites.length !== 1) {
        alert('一括検索は1つのサイトのみ選択している場合に使用できます');
        return;
    }
    
    const searchInputs = document.querySelectorAll('.search-row:not(.google-row) .search-input');
    const queries = [];
    
    searchInputs.forEach((input, index) => {
        const value = input.value.trim();
        if (value) {
            queries.push(value);
        }
    });
    
    if (queries.length === 0) {
        alert('検索キーワードを入力してください');
        return;
    }
    
    // 確認ダイアログ
    const confirmed = confirm(`${queries.length}個のキーワードで検索します。\n${queries.length}個のタブが開きますがよろしいですか？\n\n検索キーワード:\n${queries.join(', ')}`);
    
    if (!confirmed) {
        return;
    }
    
    const site = checkedSites[0];
    let blockedCount = 0;
    
    // すべてのタブを即座に開く（ユーザーの操作から直接実行）
    queries.forEach((query) => {
        const searchUrl = site.url.replace('TESTSEARCH', encodeURIComponent(query));
        const newWindow = window.open(searchUrl, '_blank');
        
        // ポップアップがブロックされたかチェック
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            blockedCount++;
        }
    });
    
    // ポップアップブロックの警告
    if (blockedCount > 0) {
        setTimeout(() => {
            alert(`⚠️ ${blockedCount}個のタブがブロックされました。\n\nブラウザのアドレスバー右側にあるポップアップブロックのアイコンをクリックして、このサイトからのポップアップを「常に許可」してください。\n\nその後、もう一度「一括検索」ボタンをクリックしてください。`);
        }, 500);
    }
}

// チェックされているサイトを取得
function getCheckedSites() {
    const checkboxes = document.querySelectorAll('#sites-list input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => sites[parseInt(cb.dataset.index)]);
}

// サイト編集モーダルを開く
function openEditModal() {
    const modal = document.getElementById('edit-modal');
    const editor = document.getElementById('sites-editor');
    
    editor.innerHTML = '';
    
    sites.forEach((site, index) => {
        editor.appendChild(createSiteEditor(site, index));
    });
    
    modal.style.display = 'block';
}

// サイト編集モーダルを閉じる
function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

// サイトエディターの作成
function createSiteEditor(site, index) {
    const container = document.createElement('div');
    container.className = 'site-editor-item';
    container.dataset.index = index;
    
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'サイト名';
    
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'site-name-input';
    nameInput.value = site.name;
    nameInput.placeholder = 'サイト名';
    
    const urlLabel = document.createElement('label');
    urlLabel.textContent = 'URL (TESTSEARCHを検索語に置き換えます)';
    
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.className = 'site-url-input';
    urlInput.value = site.url;
    urlInput.placeholder = 'https://example.com/search?q=TESTSEARCH';
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-site-btn';
    removeBtn.textContent = '削除';
    removeBtn.addEventListener('click', () => {
        container.remove();
    });
    
    container.appendChild(nameLabel);
    container.appendChild(nameInput);
    container.appendChild(urlLabel);
    container.appendChild(urlInput);
    container.appendChild(removeBtn);
    
    return container;
}

// サイトエディターを追加
function addSiteEditor() {
    const editor = document.getElementById('sites-editor');
    const newIndex = editor.children.length;
    
    if (newIndex >= 15) {
        alert('サイトは最大15個まで登録できます');
        return;
    }
    
    const newSite = { name: '', url: '' };
    editor.appendChild(createSiteEditor(newSite, newIndex));
}

// モーダルからサイトを保存
function saveSitesFromModal() {
    const editors = document.querySelectorAll('.site-editor-item');
    const newSites = [];
    
    editors.forEach(editor => {
        const name = editor.querySelector('.site-name-input').value.trim();
        const url = editor.querySelector('.site-url-input').value.trim();
        
        if (name && url) {
            newSites.push({ name, url });
        }
    });
    
    if (newSites.length === 0) {
        alert('少なくとも1つのサイトを設定してください');
        return;
    }
    
    sites = newSites;
    saveSites();
    renderSitesList();
    closeEditModal();
    
    alert('サイトを保存しました');
}

// エクスポート
function exportSites() {
    const dataStr = JSON.stringify(sites, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'custom-search-sites.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

// インポート
function importSites(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedSites = JSON.parse(e.target.result);
            
            if (!Array.isArray(importedSites)) {
                throw new Error('無効なデータ形式です');
            }
            
            // バリデーション
            const validSites = importedSites.filter(site => 
                site.name && site.url && typeof site.name === 'string' && typeof site.url === 'string'
            );
            
            if (validSites.length === 0) {
                throw new Error('有効なサイトデータがありません');
            }
            
            // 最大15個まで
            sites = validSites.slice(0, 15);
            saveSites();
            renderSitesList();
            
            alert(`${sites.length}個のサイトをインポートしました`);
        } catch (error) {
            alert('インポートに失敗しました: ' + error.message);
        }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // リセット
}

// キーボードナビゲーション
function setupKeyboardNavigation() {
    const inputs = document.querySelectorAll('.search-input');
    
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                
                if (e.shiftKey) {
                    // Shift+Tab: 前の入力欄へ
                    const prevIndex = index - 1;
                    if (prevIndex >= 0) {
                        inputs[prevIndex].focus();
                    }
                } else {
                    // Tab: 次の入力欄へ
                    const nextIndex = index + 1;
                    if (nextIndex < inputs.length) {
                        inputs[nextIndex].focus();
                    }
                }
            }
        });
    });
}
