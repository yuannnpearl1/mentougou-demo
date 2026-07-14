// ===== 后端 API 配置 =====
var API_BASE_URL = 'http://localhost:8000';
var BACKEND_AVAILABLE = false;

// ===== 页面跳转映射 =====
var addressJson = {
    'zzzc': '#', 'spsp': '#', 'ypsp': '#', 'tzsp': '#',
    'jlqjsp': '#', 'ylqxsp': '#', 'zscqfw': '#', 'qzxcprz': '#',
    'sqkt': '#', 'aizs': '#', 'wdzx': '#', 'bdxz': '#',
    'zcjd': '#', 'ect': '#',
    'mtgjgs': '#', 'bjjgj': '#', 'xgzwwz': '#'
};

var jumpAddress = function (key) {
    var url = addressJson[key];
    if (url && url !== '#') { window.location.href = url; }
    else { alert('功能链接将在正式部署后配置'); }
};

// ===== 初始化 =====
window.onload = function () {
    // Swiper
    try {
        new Swiper(".mySwiper", {
            pagination: { el: ".swiper-pagination", clickable: true },
            speed: 300
        });
    } catch(e) { console.log('Swiper:', e.message); }
    // 检查后端是否在线
    checkBackend();
};

function checkBackend() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', API_BASE_URL + '/query?q=ping', true);
    xhr.timeout = 3000;
    xhr.onload = function () {
        BACKEND_AVAILABLE = true;
        console.log('QA 后端已连接');
        updateChatStatus('在线 · 智能回复');
    };
    xhr.onerror = function () {
        BACKEND_AVAILABLE = false;
        console.log('QA 后端未连接，使用本地知识库');
        updateChatStatus('离线 · 本地回复');
    };
    xhr.ontimeout = function () {
        BACKEND_AVAILABLE = false;
        updateChatStatus('离线 · 本地回复');
    };
    xhr.send();
}

function updateChatStatus(text) {
    var el = document.querySelector('.chat-status');
    if (el) el.textContent = text;
}

// ===== 本地知识库（后端不可用时的备选） =====
var knowledgeBase = [
    { keywords: ['营业执照','注册','开办','个体户','公司','企业'],
      answer: '营业执照办理流程：\n1. 在"北京市企业服务e窗通"平台名称自主申报\n2. 提交设立登记材料\n3. 等待审核（1-3个工作日）\n4. 领取营业执照\n\n咨询：010-69869700' },
    { keywords: ['食品经营许可证','食品','餐饮','饭店','食堂'],
      answer: '食品经营许可证办理：\n1. 取得营业执照后网上提交申请\n2. 准备食品安全管理制度等材料\n3. 现场核查\n4. 核查通过发证\n\n咨询：010-69842621' },
    { keywords: ['投诉','举报','电话','12315','维权'],
      answer: '投诉举报方式：\n1. 全国12315平台：拨打12315\n2. 门头沟区市场监管局：010-69869700\n3. 现场投诉：门头沟区滨河路70号\n\n工作时间：周一至周五 9:00-12:00, 13:30-17:30' },
    { keywords: ['年报','公示','年度报告','年检'],
      answer: '企业年报公示：\n1. 登录国家企业信用信息公示系统（www.gsxt.gov.cn）\n2. 点击"企业信息填报"\n3. 登录后填写提交\n\n年报时间：每年1月1日至6月30日' },
    { keywords: ['药品','药店','医药','经营'],
      answer: '药品经营许可办理：\n1. 取得营业执照\n2. 配备执业药师\n3. 场所符合GSP要求\n4. 提交许可申请\n\n咨询：010-69869700' },
    { keywords: ['特种设备','电梯','锅炉','压力容器','起重'],
      answer: '特种设备使用登记：\n1. 安装前告知\n2. 安装后监督检验\n3. 办理使用登记证\n4. 定期检验\n\n咨询：010-69842621' },
    { keywords: ['计量','器具','校准','检定','秤','天平'],
      answer: '计量器具检定/校准：\n1. 强制检定计量器具定期送检\n2. 也可委托第三方机构\n\n咨询：010-69842621' },
    { keywords: ['医疗器械','医疗','器械'],
      answer: '医疗器械经营许可/备案：\n1. 一类：备案\n2. 二类：备案经营\n3. 三类：许可经营\n\n咨询：010-69869700' },
    { keywords: ['知识产权','商标','专利','版权'],
      answer: '知识产权服务：\n1. 商标注册：国家知识产权局官网申请\n2. 专利：委托代理机构\n3. 维权：向市场监管局投诉\n\n咨询：010-69869700' },
    { keywords: ['认证','合格','3C','强制性','产品质量'],
      answer: '强制性产品认证（CCC）：\n1. 确认产品在CCC目录内\n2. 委托指定认证机构认证\n3. 获证后方可出厂销售\n\n咨询：010-69869700' },
    { keywords: ['地址','在哪','门头沟','办公','大厅','服务窗口'],
      answer: '门头沟区市场监督管理局\n地址：北京市门头沟区滨河路70号\n\n各监管所：\n- 城子街道所：69842146\n- 大峪街道所：69842001\n- 龙泉镇所：69805451\n\n工作时间：周一至周五 9:00-12:00, 13:30-17:30' },
    { keywords: ['你好','您好','在吗','hello','hi'],
      answer: '您好！我是门头沟区市场监督管理局AI智能助手。您可以咨询营业执照、食品许可、投诉举报、年报公示等问题，我会尽力解答！' }
];

function getLocalAnswer(input) {
    var text = input.trim().toLowerCase();
    if (!text) return '请输入您的问题。';
    for (var i = 0; i < knowledgeBase.length; i++) {
        for (var j = 0; j < knowledgeBase[i].keywords.length; j++) {
            if (text.indexOf(knowledgeBase[i].keywords[j]) !== -1) {
                return { answer: knowledgeBase[i].answer, sources: [] };
            }
        }
    }
    var fallbacks = [
        '您的问题我已记录。建议拨打门头沟区市场监管局：010-69869700 获取准确答复。',
        '请在工作时间拨打010-69869700咨询工作人员。',
        '您可以拨打010-69869700咨询，或点击上方"诉求快通"提交需求。'
    ];
    return { answer: fallbacks[Math.floor(Math.random() * fallbacks.length)], sources: [] };
}

// ===== 调用后端 API =====
function queryBackend(question) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', API_BASE_URL + '/query', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.timeout = 15000;

    return new Promise(function (resolve) {
        xhr.onload = function () {
            try {
                var data = JSON.parse(xhr.responseText);
                resolve({
                    answer: data.answer || '抱歉，暂无回复。',
                    sources: data.sources || [],
                    matched_entries: data.matched_entries || 0
                });
            } catch (e) {
                resolve(null);
            }
        };
        xhr.onerror = function () { resolve(null); };
        xhr.ontimeout = function () { resolve(null); };
        xhr.send(JSON.stringify({ question: question, top_k: 5 }));
    });
}

// ===== AI 聊天功能 =====
var chatOpen = false;

function openAIChat() {
    var overlay = document.getElementById('chatOverlay');
    overlay.classList.add('active');
    chatOpen = true;
    setTimeout(function () { document.getElementById('chatInput').focus(); }, 400);
}

function closeAIChat(event) {
    if (event && event.target !== document.getElementById('chatOverlay')) return;
    document.getElementById('chatOverlay').classList.remove('active');
    chatOpen = false;
}

function sendMessage() {
    var input = document.getElementById('chatInput');
    var text = input.value.trim();
    if (!text) return;
    input.value = '';

    addMessage(text, 'user');
    showTyping();

    var startTime = Date.now();

    // 优先调用后端 API
    if (BACKEND_AVAILABLE) {
        queryBackend(text).then(function (result) {
            hideTyping();
            var delay = Math.max(0, 600 - (Date.now() - startTime));
            setTimeout(function () {
                if (result) {
                    addMessageWithSources(result.answer, result.sources);
                } else {
                    // API 返回异常，用本地兜底
                    var fallback = getLocalAnswer(text);
                    addMessageWithSources(fallback.answer, []);
                }
            }, delay);
        });
    } else {
        // 后端不可用，用本地知识库
        setTimeout(function () {
            hideTyping();
            var result = getLocalAnswer(text);
            addMessageWithSources(result.answer, result.sources);
        }, 400 + Math.random() * 400);
    }
}

function sendSuggestion(text) {
    document.getElementById('chatInput').value = text;
    sendMessage();
}

function addMessage(text, type) {
    var container = document.getElementById('chatMessages');
    var div = document.createElement('div');
    div.className = 'message ' + (type === 'user' ? 'user-message' : 'ai-message');
    var bubble = document.createElement('div');
    bubble.className = 'message-bubble ' + (type === 'user' ? 'user-bubble' : 'ai-bubble');
    bubble.textContent = text;
    div.appendChild(bubble);
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function addMessageWithSources(text, sources) {
    var container = document.getElementById('chatMessages');
    var div = document.createElement('div');
    div.className = 'message ai-message';
    var bubble = document.createElement('div');
    bubble.className = 'message-bubble ai-bubble';

    var textNode = document.createTextNode(text);
    bubble.appendChild(textNode);

    if (sources && sources.length > 0) {
        var tagsDiv = document.createElement('div');
        tagsDiv.className = 'source-tags';
        for (var i = 0; i < Math.min(sources.length, 3); i++) {
            var tag = document.createElement('span');
            tag.className = 'source-tag';
            var src = sources[i];
            var label = typeof src === 'string' ? src : (src.title || src.name || '来源');
            tag.textContent = label.length > 20 ? label.substring(0, 20) + '…' : label;
            tagsDiv.appendChild(tag);
        }
        bubble.appendChild(tagsDiv);
    }

    div.appendChild(bubble);
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function addErrorMessage(text) {
    var container = document.getElementById('chatMessages');
    var div = document.createElement('div');
    div.className = 'message ai-message';
    var bubble = document.createElement('div');
    bubble.className = 'message-bubble error-bubble';
    bubble.textContent = text;
    div.appendChild(bubble);
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function showTyping() {
    var container = document.getElementById('chatMessages');
    var div = document.createElement('div');
    div.className = 'message ai-message'; div.id = 'typingIndicator';
    var bubble = document.createElement('div');
    bubble.className = 'message-bubble ai-bubble';
    var indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    for (var i = 0; i < 3; i++) {
        var dot = document.createElement('div');
        dot.className = 'typing-dot';
        indicator.appendChild(dot);
    }
    bubble.appendChild(indicator);
    div.appendChild(bubble);
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function hideTyping() {
    var el = document.getElementById('typingIndicator');
    if (el) el.remove();
}

function handleKeydown(event) {
    if (event.key === 'Enter') { event.preventDefault(); sendMessage(); }
}
// 阻止聊天打开时页面滚动
document.addEventListener('touchmove', function (e) {
    var overlay = document.getElementById('chatOverlay');
    if (chatOpen && overlay && overlay.classList.contains('active')) {
        var panel = document.getElementById('chatPanel');
        if (!panel.contains(e.target)) { e.preventDefault(); }
    }
}, { passive: false });
