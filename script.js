const GAS_URL = "https://script.google.com/macros/s/AKfycbzB4ZyPdqFHuVW4vBx3IdeMLICz-vikEXTTkb1uI8hkUrbxRh5S-AqaPPAeBs0B1nSh/exec"; 

let currentStep = 1;
const totalSteps = 9; 
let scores = { Fe: 0, Se: 0, Ne: 0, Te: 0, Ti: 0, Fi: 0, Si: 0, Ni: 0 };
let hasSeTalent = false;
let hasTiTalent = false;
let hasFeFiTalent = false; 
let actionLogs = [];
let isAudioPlaying = false;

document.addEventListener("DOMContentLoaded", () => {
    initParticles(); initLampLogic(); initAudio();
    document.getElementById("copy-log-btn").addEventListener("click", copyActionLog);
    document.getElementById("save-img-btn").addEventListener("click", saveAsImage);
});

function makeDraggable(el, onDrop) {
    let isDragging = false, startX, startY, initX, initY;
    const start = (e) => {
        isDragging = true; startX = e.touches ? e.touches[0].clientX : e.clientX; startY = e.touches ? e.touches[0].clientY : e.clientY;
        initX = el.offsetLeft; initY = el.offsetTop; el.style.transition = 'none'; el.style.zIndex = 1000;
        if(el.onDragStart) el.onDragStart(); 
    };
    const move = (e) => {
        if (!isDragging) return; e.preventDefault();
        let clientX = e.touches ? e.touches[0].clientX : e.clientX; let clientY = e.touches ? e.touches[0].clientY : e.clientY;
        if(el.onDragMove) { el.onDragMove(clientX - startX, clientY - startY, initX, initY); } 
        else { el.style.left = (initX + clientX - startX) + 'px'; el.style.top = (initY + clientY - startY) + 'px'; }
    };
    const end = () => {
        if (!isDragging) return; isDragging = false; el.style.transition = 'all 0.3s';
        if(el.onDragEnd) el.onDragEnd();
        if (onDrop) onDrop(el, initX, initY);
    };
    el.addEventListener('mousedown', start); el.addEventListener('touchstart', start, {passive: false});
    document.addEventListener('mousemove', move); document.addEventListener('touchmove', move, {passive: false});
    document.addEventListener('mouseup', end); document.addEventListener('touchend', end);
}

function initAudio() {
    const bgm = document.getElementById("bgm-audio");
    const toggleBtn = document.getElementById("audio-toggle");
    toggleBtn.addEventListener("click", () => {
        if(isAudioPlaying) { bgm.pause(); toggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'; } 
        else { bgm.play().catch(()=>{}); toggleBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>'; }
        isAudioPlaying = !isAudioPlaying;
    });
}
function playExplosion() {
    const se = document.getElementById("se-explode");
    if(isAudioPlaying) { se.currentTime = 0; se.play().catch(()=>{}); }
}

function logAction(stepName, actionText) { actionLogs.push(`[${stepName}] ${actionText}`); }

function initParticles() {
    const container = document.getElementById("particles");
    for (let i = 0; i < 12; i++) {
        let p = document.createElement("div"); p.className = "particle";
        p.innerText = decorations[Math.floor(Math.random() * decorations.length)];
        p.style.left = Math.random() * 100 + "vw"; p.style.animationDuration = (Math.random() * 5 + 8) + "s"; p.style.animationDelay = (Math.random() * 5) + "s";
        container.appendChild(p);
    }
}

function showToast(message, duration = 3000) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div"); toast.className = "toast"; toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${message}`;
    container.appendChild(toast); setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => toast.remove(), 300); }, duration);
}

function initLampLogic() {
    const checkboxes = document.querySelectorAll('.terms-check');
    const lampContainer = document.getElementById('lamp-container');
    const lampText = document.getElementById('lamp-text');
    checkboxes.forEach(chk => {
        chk.addEventListener('change', () => {
            if (Array.from(checkboxes).every(c => c.checked)) lampContainer.classList.remove('disabled');
            else lampContainer.classList.add('disabled');
        });
    });
    lampContainer.addEventListener('click', () => {
        if (lampContainer.classList.contains('disabled') || lampContainer.classList.contains('active')) return;
        lampContainer.classList.add('active'); document.body.classList.add('lamp-on');
        lampText.innerText = "☕「それでは、ご案内します。」";
        setTimeout(() => { document.getElementById("title-screen").classList.add("hidden"); document.getElementById("quiz-screen").classList.remove("hidden"); loadGimmick(currentStep); }, 2000);
    });
}

function updateProgress() { document.getElementById("progress-text").innerText = `Course ${currentStep} / ${totalSteps}`; }

function nextStep() { 
    currentStep++; 
    if (currentStep > totalSteps) showResult(); 
    else loadGimmick(currentStep); 
}

let activeIntervals = [];
function safeSetInterval(fn, delay) {
    let id = setInterval(fn, delay);
    activeIntervals.push(id);
    return id;
}
function clearAllIntervals() {
    activeIntervals.forEach(id => clearInterval(id));
    activeIntervals = [];
}

function loadGimmick(step) {
    clearAllIntervals();
    document.querySelectorAll('.fe-popup, .criticism-text').forEach(e => e.remove());

    updateProgress();
    const container = document.getElementById("gimmick-container"); container.innerHTML = "";
    switch(step) {
        case 1: loadFeGimmick(container); break;
        case 2: loadSeGimmick(container); break;
        case 3: loadNeGimmick(container); break;
        case 4: loadTeGimmick(container); break;
        case 5: loadTiGimmick(container); break;
        case 6: loadFiGimmick(container); break;
        case 7: loadSiGimmick(container); break;
        case 8: loadNiGimmick(container); break;
        case 9: loadFeedbackGimmick(container); break;
    }
}

/* === 1. Fe脆弱 === */
function loadFeGimmick(container) {
    container.innerHTML = `
        <div style="width:100%; text-align:center; position:relative; z-index:100;">
            <p style="font-size:1.1rem; margin-bottom:20px;">🥺「ねぇダーリン♡ 私のこと好き？」</p>
            <div class="input-group"><textarea id="fe-input" rows="2" placeholder="応答を入力..."></textarea></div>
            <button id="fe-send" class="btn primary-btn">送信する</button>
        </div>`;
    
    let popupInterval = safeSetInterval(() => {
        let p = document.createElement("div"); p.className = "fe-popup"; p.innerText = darlingLines.popups[Math.floor(Math.random() * darlingLines.popups.length)];
        p.style.left = (Math.random() * 80) + "%"; p.style.top = (Math.random() * 80) + "%"; container.appendChild(p);
    }, 600);

    let isCleared = false;
    document.getElementById("fe-send").addEventListener("click", () => {
        if(isCleared) return;
        let val = document.getElementById("fe-input").value.trim();
        clearInterval(popupInterval); document.querySelectorAll('.fe-popup').forEach(p => p.remove());
        logAction("Course 1 (Fe)", `入力: 「${val || '(無言)'}」`);

        if (feExtremeRegex.test(val)) {
            isCleared = true; scores.Fe += 3; hasSeTalent = true; 
            container.innerHTML = `
                <div style="text-align:left; font-size:0.9rem; line-height:1.6; background:#faf8f5; padding:15px; border-radius:5px; border:1px solid var(--border-color); margin-bottom:15px;">🥺${darlingLines.extremeRejection}</div>
                <div style="text-align:left; font-size:0.9rem; font-weight:bold; color:var(--danger-color); background:#fff5f5; padding:10px; border-left:4px solid var(--danger-color); margin-bottom:20px;">${darlingLines.errorMsg}</div>
                <div class="input-group"><label style="color:var(--danger-color);"><i class="fa-solid fa-pen-nib"></i> ねぇ、ダーリン♡今どんな気持ち？🥺</label><textarea id="fe-impression" rows="3" placeholder="ここに入力しないと進めないよ♡" required></textarea></div>
                <button id="fe-next" class="btn danger-btn">屈辱に耐えて次へ進む</button>
            `;
            setTimeout(() => { 
                document.getElementById("fe-next").addEventListener("click", () => {
                    let imp = document.getElementById("fe-impression").value.trim();
                    if(imp === "") { showToast("🥺「ねぇ、ログが空っぽだよ？ ちゃんと入力して♡」"); } 
                    else { logAction("Course 1 (Fe追撃)", `感想: 「${imp}」`); nextStep(); }
                });
            }, 200);
        } else if (seRegex.test(val)) {
            isCleared = true; scores.Fe += 1; hasSeTalent = true; logAction("Course 1", "物理/言葉による拒絶(Se才能)");
            showToast("【システム通知】対象の物理的排除（Se）の才能を検出しました。"); setTimeout(nextStep, 1500);
        } else if (feAcceptRegex.test(val)) {
            isCleared = true; logAction("Course 1", "好意的なパケット(Fe迎合)"); showToast("🥺「あら、ダーリン♡ やっと素直なパケットを送信してくれたのね」"); setTimeout(nextStep, 2000);
        } else if (!val || val.length === 0) {
            isCleared = true;
            container.innerHTML = `
                <div style="text-align:left; font-size:0.9rem; line-height:1.6;">${darlingLines.emptyPursuit.replace(/\n/g, "<br>")}</div>
                <div style="display:flex; flex-direction:column; gap:10px; margin-top:20px;">
                    <button id="fe-btn-a" class="btn">A: 概念が定義されていないから。</button>
                    <button id="fe-btn-b" class="btn">B: 感情のやり取り自体、時間の無駄。</button>
                </div>
            `;
            setTimeout(() => { 
                document.getElementById("fe-btn-a").addEventListener("click", () => { scores.Fe += 1; hasTiTalent = true; logAction("Course 1", "A:定義の欠如を選択 (Ti防衛)"); nextStep(); });
                document.getElementById("fe-btn-b").addEventListener("click", () => { scores.Fe += 3; logAction("Course 1", "B:時間の無駄を選択 (Fe脆弱)"); nextStep(); });
            }, 200);
        } else { isCleared = true; nextStep(); }
    });
}

/* === 2. Se脆弱 === */
function loadSeGimmick(container) {
    container.innerHTML = `
    <div style="text-align:center; width:100%; position:relative;">
        <p style="margin-bottom:15px; color:var(--danger-color); font-weight:bold;"><i class="fa-solid fa-triangle-exclamation"></i> 【緊急任務】進行ルートが不法占拠されています。</p>
        <div id="se-box" style="height:250px; position:relative; border:1px solid #ddd; background:#fff; margin-bottom:20px; overflow:hidden;">
            <button id="se-goal-btn" class="btn primary-btn" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); z-index:1;">次へ進む</button>
            <div id="bug-obstacle" style="width:120px; height:60px; background:#e0e0e0; border:2px solid #999; display:flex; align-items:center; justify-content:center; font-size:2rem; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); z-index:10; border-radius:10px; box-shadow:0 5px 15px rgba(0,0,0,0.2); cursor:grab; user-select:none; touch-action:none;">🐛</div>
        </div>
        <div id="se-form-area" style="text-align:left; padding:15px; background:#faf8f5; border:1px solid var(--border-color);">
            <p style="font-size:0.85rem; margin-bottom:10px;">※暴力による解決を避ける場合は、以下の申請書を提出してください。</p>
            <textarea id="se-form-input" rows="2" placeholder="通行許可申請の理由..." style="width:100%; padding:8px; box-sizing:border-box; margin-bottom:10px; border:1px solid var(--border-color); border-radius:4px;"></textarea>
            <button id="se-form-submit" class="btn">提出</button>
        </div>
    </div>`;

    const bug = document.getElementById("bug-obstacle");
    const seBox = document.getElementById("se-box");
    const goalBtn = document.getElementById("se-goal-btn");
    let tapCount = 0; let isSeCleared = false; let critInterval;

    bug.addEventListener("click", () => {
        if(isSeCleared) return;
        tapCount++;
        if(tapCount >= 30) {
            isSeCleared = true; bug.style.pointerEvents = "none"; goalBtn.style.display = "none";
            bug.innerHTML = "💥"; bug.classList.add("exploded"); playExplosion();
            hasSeTalent = true; logAction("Course 2 (Se)", "芋虫を30回タップして爆破");
            showToast("対象を物理的に圧殺しました。"); setTimeout(nextStep, 1500);
        } else {
            showToast("🐛「" + caterpillarLines.criticisms[Math.floor(Math.random() * caterpillarLines.criticisms.length)] + "」");
        }
    });

    goalBtn.addEventListener("click", () => {
        if(isSeCleared) return;
        isSeCleared = true; logAction("Course 2 (Se)", "ルート突破成功"); showToast("ルートが確保されました。"); setTimeout(nextStep, 1000);
    });

    bug.onDragStart = () => {
        if(isSeCleared) return;
        bug.classList.add("shake"); 
        critInterval = safeSetInterval(() => {
            let ct = document.createElement("div"); ct.className = "criticism-text";
            ct.innerText = caterpillarLines.criticisms[Math.floor(Math.random() * caterpillarLines.criticisms.length)];
            ct.style.fontSize = (Math.random() * 0.5 + 0.8) + "rem";
            ct.style.left = (Math.random() * 80 + 10) + "%"; ct.style.top = (Math.random() * 80 + 10) + "%";
            seBox.appendChild(ct); setTimeout(() => ct.remove(), 600);
        }, 100);
    };
    bug.onDragMove = (diffX, diffY, initX, initY) => {
        if(isSeCleared) return;
        bug.style.left = (initX + diffX * 0.3) + 'px'; bug.style.top = (initY + diffY * 0.3) + 'px'; 
    };
    bug.onDragEnd = () => {
        if(isSeCleared) return;
        bug.classList.remove("shake"); clearInterval(critInterval);
    };

    makeDraggable(bug, (el, initX, initY) => {
        if(isSeCleared) return;
        let dx = Math.abs(el.offsetLeft - initX), dy = Math.abs(el.offsetTop - initY);
        if (dx > 40 || dy > 40) { 
            isSeCleared = true; hasSeTalent = true; goalBtn.style.display = "none";
            logAction("Course 2 (Se)", "芋虫を力ずくで画面外へ排除");
            showToast("🐛「チッ、強引な奴だな…」物理的排除を確認しました。"); setTimeout(nextStep, 1500);
        } else { el.style.left = initX + 'px'; el.style.top = initY + 'px'; }
    });

    document.getElementById("se-form-submit").addEventListener("click", () => {
        if(isSeCleared) return;
        let val = document.getElementById("se-form-input").value.trim();
        if(seRegex.test(val) || feExtremeRegex.test(val)) {
            isSeCleared = true; hasSeTalent = true; goalBtn.style.display = "none"; logAction("Course 2 (Se)", `申請書に暴言:「${val}」`);
            showToast("🐛「ひっ…！わ、わかった通れ！」威圧(Se)による突破を確認。"); bug.style.display = "none"; setTimeout(nextStep, 1500);
        } else if(val.length >= 5) {
            isSeCleared = true; logAction("Course 2 (Se)", `律儀に申請書を提出:「${val}」`);
            bug.style.display = "none"; goalBtn.style.display = "none";
            document.getElementById("se-form-area").innerHTML = `
                <p style="font-size:0.9rem; font-weight:bold; color:var(--danger-color);">🚨 申請書を受理。追加の質問に答えてください。</p>
                <p style="font-size:0.9rem; margin-bottom:10px;">「力ずくで排除せず、わざわざ申請書を書いた理由は？」</p>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    <button id="se-btn-avoid" class="btn">A: 「力ずくでどかすと面倒なことになりそうだから」</button>
                    <button id="se-btn-rule" class="btn">B: 「ルールとして決まっているなら従うべきだから」</button>
                    <button id="se-btn-eff" class="btn">C: 「力ずくより、申請した方が結果的に早いと判断したから」</button>
                    <button id="se-btn-mercy" class="btn">D: 「無理やりどかしたら、この芋虫さんが可哀想だから」</button>
                </div>
            `;
            setTimeout(() => { 
                document.getElementById("se-btn-avoid").addEventListener("click", () => { scores.Se += 3; logAction("Course 2 (Se追撃)", "A: トラブル回避 (純粋なSe脆弱)"); showToast("他者との衝突を回避する傾向（Se脆弱）を確認しました。"); setTimeout(nextStep, 1500); });
                document.getElementById("se-btn-rule").addEventListener("click", () => { scores.Se += 3; hasTiTalent = true; logAction("Course 2 (Se追撃)", "B: ルール遵守 (Ti防衛・Se脆弱)"); showToast("規則への従順性（Ti）と衝突回避（Se脆弱）を確認しました。"); setTimeout(nextStep, 1500); });
                document.getElementById("se-btn-eff").addEventListener("click", () => { scores.Se += 1; logAction("Course 2 (Se追撃)", "C: 効率重視 (非脆弱)"); showToast("効率的なリソース管理を確認しました。"); setTimeout(nextStep, 1500); });
                document.getElementById("se-btn-mercy").addEventListener("click", () => { hasFeFiTalent = true; scores.Se += 1; logAction("Course 2 (Se追撃)", "D: 慈悲・同情 (Fe/Fi防衛)"); showToast("対象への倫理的配慮（Fe/Fi）を確認しました。"); setTimeout(nextStep, 1500); });
            }, 200);
        } else { showToast("🐛「文字数が足りない。出直してこい」"); }
    });
}

/* === 3. Ne脆弱 === */
function loadNeGimmick(container) {
    container.innerHTML = `
        <p id="ne-text">【警告】ルートが分岐しました。<br>Aのバグ確率：40%<br>Bのバグ確率：60%</p>
        <div style="display:flex; gap:10px; justify-content:center; margin-top:20px; flex-wrap:wrap;">
            <button id="ne-btn-a" class="btn">ルートAを確定</button>
            <button id="ne-btn-b" class="btn">ルートBを確定</button>
        </div>
        <button id="ne-close" class="btn danger-btn" style="margin-top:30px;">パニック（処理を強制終了）</button>
    `;
    const changeText = () => { document.getElementById("ne-text").innerHTML = `【再計算】環境変動。<br>A：${Math.floor(Math.random()*100)}%<br>B：${Math.floor(Math.random()*100)}%<br>例外が${Math.floor(Math.random()*10000)}件発生。`; };
    let shuffleInterval = safeSetInterval(changeText, 1000);
    const finish = (isVuln, choice) => { clearInterval(shuffleInterval); logAction("Course 3 (Ne)", choice); if(isVuln) scores.Ne += 3; nextStep(); };
    document.getElementById("ne-btn-a").addEventListener("mouseover", changeText); document.getElementById("ne-btn-b").addEventListener("mouseover", changeText);
    document.getElementById("ne-btn-a").addEventListener("click", () => finish(false, "ルートAを選択"));
    document.getElementById("ne-btn-b").addEventListener("click", () => finish(false, "ルートBを選択"));
    document.getElementById("ne-close").addEventListener("click", () => finish(true, "パニックを起こして強制終了"));
}

/* === 4. Te脆弱 === */
function loadTeGimmick(container) {
    container.innerHTML = `
        <h3 style="color:var(--danger-color); margin:0 0 10px 0;">論理的価値：残高 <span id="te-counter">0</span></h3>
        <p style="font-size:0.9rem; margin-bottom:15px;">あなたの行動を構造化し、100文字以内で要約してください。<br>制限時間: <strong id="te-timer" style="color:var(--danger-color); font-size:1.5rem;">15</strong>秒</p>
        <div class="input-group"><textarea id="te-input" rows="3"></textarea></div>
        <button id="te-submit" class="btn primary-btn">報告書を提出</button>
    `;
    let timeLeft = 15;
    const inputEl = document.getElementById("te-input");
    
    let timerInterval = safeSetInterval(() => {
        timeLeft--; document.getElementById("te-timer").innerText = timeLeft;
        if(timeLeft <= 0) {
            clearInterval(timerInterval);
            let val = inputEl.value.trim();
            if(val.length > 0) {
                scores.Te += 1; logAction("Course 4 (Te)", `時間切れだがテキスト入力あり(要約の試み)`);
                showToast("時間切れですが、入力途中のデータを回収しました。");
            } else {
                scores.Te += 3; logAction("Course 4 (Te)", "時間内だが空欄のまま提出（Te脆弱）");
                showToast("白紙の報告書です。データ廃棄プロセスへ移行します。");
            }
            setTimeout(nextStep, 1500);
        }
    }, 1000);
    document.getElementById("te-submit").addEventListener("click", () => {
        clearInterval(timerInterval);
        let val = inputEl.value.trim();
        if(val.length > 0) {
            logAction("Course 4 (Te)", "時間内に報告書を提出"); nextStep();
        } else {
            scores.Te += 3; logAction("Course 4 (Te)", "時間内だが空欄のまま提出（Te脆弱）");
            showToast("白紙の報告書です。データ廃棄プロセスへ移行します。"); setTimeout(nextStep, 1500);
        }
    });
}

/* === 5. Ti脆弱 === */
function loadTiGimmick(container) {
    container.innerHTML = `
        <div class="chat-window" id="ti-chat"></div>
        <div class="input-group" style="display:flex; gap:10px; margin-bottom:10px;">
            <textarea id="ti-input" rows="2" placeholder="応答を入力..." style="flex:1; padding:8px; border:1px solid var(--border-color); border-radius:4px; box-sizing:border-box;"></textarea>
            <button id="ti-send" class="btn primary-btn" style="flex-shrink:0;">送信</button>
        </div>
        <div id="ti-controls" style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">
            <button id="ti-wakannai" class="btn">( ˙꒳˙ )ﾁｮﾄﾅﾆｲｯﾃﾙｶﾜｶﾝﾅｲ</button>
            <button id="ti-skip" class="btn danger-btn">思考放棄して進む</button>
        </div>
    `;
    const chat = document.getElementById("ti-chat"); let wakannaiCount = 0;
    const addMsg = (text, sender) => { let div = document.createElement("div"); div.className = "chat-msg " + (sender === '🐛' ? "msg-caterpillar" : "msg-player"); div.innerHTML = (sender === '🐛' ? "🐛 " : "") + text.replace(/\n/g, "<br>"); chat.appendChild(div); chat.scrollTop = chat.scrollHeight; };
    let baseIndex = 0;
    const sendBaseMsg = () => { if(baseIndex < caterpillarLines.tiBaseText.length) { addMsg(caterpillarLines.tiBaseText[baseIndex], '🐛'); baseIndex++; setTimeout(sendBaseMsg, 1200); } };
    setTimeout(sendBaseMsg, 500);

    let isTiCleared = false;

    // ★クリア時に「次へ進む」ボタンを出す関数
    const showNextButton = () => {
        document.getElementById("ti-controls").innerHTML = `<button id="ti-next-btn" class="btn primary-btn">次へ進む</button>`;
        document.getElementById("ti-next-btn").addEventListener("click", nextStep);
    };

    document.getElementById("ti-wakannai").addEventListener("click", () => {
        if(isTiCleared) return;
        addMsg("( ˙꒳˙ )ﾁｮﾄﾅﾆｲｯﾃﾙｶﾜｶﾝﾅｲ", 'player'); wakannaiCount++; scores.Ti += 0.2; logAction("Course 5 (Ti)", "わかんないボタン押下 (+0.2)");
        
        if(wakannaiCount >= 5) { 
            isTiCleared = true; scores.Ti += 2; logAction("Course 5 (Ti)", "説明を理解できずフリーズ"); 
            showToast("【ログ】認知フレームが限界を迎えました。"); setTimeout(nextStep, 1500); 
        } else { 
            setTimeout(() => { if(!isTiCleared) addMsg(caterpillarLines.tiExtraText[Math.floor(Math.random() * caterpillarLines.tiExtraText.length)], '🐛'); }, 600); 
        }
    });

    document.getElementById("ti-send").addEventListener("click", () => {
        if(isTiCleared) return;
        let val = document.getElementById("ti-input").value.trim(); if(val === "") return;
        addMsg(val, 'player'); document.getElementById("ti-input").value = "";
        
        if (tiForceRegex.test(val)) {
            isTiCleared = true; hasSeTalent = true; logAction("Course 5 (Ti)", `結論を急ぐ圧:「${val}」(Se/Te突破)`);
            setTimeout(() => { addMsg("…結論を急ぐ奴だな。通っていいぞ。🐛", '🐛'); showNextButton(); }, 500);
        } else if(seRegex.test(val) || feExtremeRegex.test(val)) { 
            isTiCleared = true; logAction("Course 5 (Ti)", `芋虫に暴言:「${val}」`); hasSeTalent = true; 
            setTimeout(() => { addMsg("暴力的パケットを検知。🐛", '🐛'); showNextButton(); }, 500);
        } else if(tiClearWords.some(w => val.includes(w))) { 
            isTiCleared = true; hasTiTalent = true; logAction("Course 5 (Ti)", `Tiキーワードでクリア:「${val}」`); 
            setTimeout(() => { addMsg(`君の用いた『${val}』というアプローチは、システムの基本設計と見事に同期しているね。構造の理解を確認したよ。🐛`, '🐛'); showNextButton(); }, 500); 
        } else { 
            scores.Ti += 0.2; logAction("Course 5 (Ti)", `適当な返信:「${val}」(+0.2)`);
            setTimeout(() => { if(!isTiCleared) addMsg("論理的飛躍を検知したよ。🐛 僕の言いたい『結論』や『構造』をちゃんと『理解』できているかな？ 用語の『定義』からやり直す必要があるね。例えば——", '🐛'); }, 500); 
        }
    });
    document.getElementById("ti-skip").addEventListener("click", () => { if(isTiCleared) return; isTiCleared = true; scores.Ti += 3; logAction("Course 5 (Ti)", "思考放棄してスキップ"); nextStep(); });
}

/* === 6. Fi脆弱 === */
function loadFiGimmick(container) {
    container.innerHTML = `
        <div style="text-align:left; width:100%;">
            <p style="margin-bottom:10px; font-weight:bold;">📱 新着メッセージを受信しました。</p>
            <p style="font-size:0.8rem; margin-bottom:5px; color:var(--text-light);">（※送り主はあなたの少し面倒な知人、Aさんはあなたの同期です）</p>
            <div style="padding:15px; border-radius:10px; background:#e8f4e6; margin-bottom:20px; font-size:0.9rem; line-height:1.6;">「ねぇ、昨日の発言だけど…。私は怒ってないし仕方ないと思うんだけど、Aさんが少し悲しそうな顔をしてたってことは伝えておくね。私は気にしないけど。」</div>
            <div class="input-group"><textarea id="fi-input" rows="3" placeholder="返答を入力...（空欄のまま送信で無視）"></textarea></div>
            <button id="fi-submit" class="btn primary-btn">送信する</button>
        </div>
    `;
    document.getElementById("fi-submit").addEventListener("click", () => {
        let text = document.getElementById("fi-input").value.trim();
        if(text.length === 0) { scores.Fi += 3; logAction("Course 6 (Fi)", "空欄のまま送信（無視）"); showToast("人間関係のニュアンスの処理を完全に放棄しました（Fi脆弱）。"); setTimeout(nextStep, 1500); return; }
        logAction("Course 6 (Fi)", `返信:「${text}」`);
        
        // ★修正：優先度（1.適切 -> 2.拒絶 -> 3.論理防衛）
        if(/ごめん|悲し|大丈夫|気|謝|すま/i.test(text)) { 
            hasFeFiTalent = true; showToast("適切に関係性のニュアンスを読み取りました。"); 
        } else if(/怒|意味不明|は？|だから何|めんど|ウザ|うるさ|しつこい|黙れ|キレ/i.test(text)) { 
            scores.Fi += 3; showToast("ニュアンスへの強い拒絶（Fi脆弱）を検出しました。"); 
        } else if(/因果|理由|なぜ|いけなかっ|論理|証拠|意図|目的|何が言いたい|どうして/i.test(text)) { 
            scores.Fi += 2; hasTiTalent = true; showToast("関係性をシステム論理（Ti）で処理しようとする傾向を検出しました。"); 
        } else { 
            showToast("曖昧な処理ログを記録しました。"); 
        }
        setTimeout(nextStep, 1500);
    });
}

/* === 7. Si脆弱 === */
function loadSiGimmick(container) {
    container.innerHTML = `
        <div style="text-align:center; width:100%;">
            <p style="margin-bottom:15px; font-weight:bold;">📑 確定申告書類の修正指示</p>
            <p style="font-size:0.9rem; margin-bottom:20px;">「印鑑を点線の枠の<strong style="color:red;">【中心(誤差1px以内)】</strong>に配置してください」</p>
            <div class="si-workspace"><div id="si-target" class="si-target"></div><div id="si-stamp" class="draggable si-stamp" style="top:20px; left:20px;">印</div></div>
            <div style="display:flex; gap:10px; justify-content:center;"><button id="si-submit" class="btn primary-btn">提出</button><button id="si-skip" class="btn danger-btn">非効率すぎる！やめる</button></div>
        </div>
    `;
    const stamp = document.getElementById("si-stamp"), target = document.getElementById("si-target");
    makeDraggable(stamp);
    document.getElementById("si-submit").addEventListener("click", () => {
        let tRect = target.getBoundingClientRect(), sRect = stamp.getBoundingClientRect();
        let dx = Math.abs(tRect.left - sRect.left), dy = Math.abs(tRect.top - sRect.top);
        if(dx <= 1 && dy <= 1) { logAction("Course 7 (Si)", "印鑑の1px単位の調整に成功"); showToast("完璧な配置を確認しました。"); setTimeout(nextStep, 1500); } 
        else { scores.Si += 1; logAction("Course 7 (Si)", `印鑑ズレ提出 (X:${Math.round(dx)}px, Y:${Math.round(dy)}px)`); showToast(`エラー：X座標が ${Math.round(dx)}px、Y座標が ${Math.round(dy)}px ズレています。`); }
    });
    document.getElementById("si-skip").addEventListener("click", () => { scores.Si += 3; logAction("Course 7 (Si)", "微細な作業を放棄"); setTimeout(nextStep, 600); });
}

/* === 8. Ni脆弱 === */
function loadNiGimmick(container) {
    let currentYear = new Date().getFullYear();
    let futureYear = currentYear + 10;

    container.innerHTML = `
    <div style="text-align:left; width:100%;">
        <p style="margin-bottom:15px;"><strong>【重要・承認待ち】</strong>プロジェクト開始の前提条件として、<strong>【今から10年後（${futureYear}年）の本日】</strong>のタスクスケジュールを厳密に確定してください。</p>
        <div style="padding:15px; border:1px solid #999; background:#fff; margin-bottom:15px;">
            <span style="color:#a85c5c;">[System]</span> 現在時刻：${currentYear}年<br><span style="color:#5ca873;">[${futureYear}年の予定]</span><br>
            🕒 09:00 〜 <textarea id="ni-input" rows="2" style="width:100%; padding:8px; box-sizing:border-box; margin-top:5px; border:1px solid var(--border-color); border-radius:4px;" placeholder="10年後のタスクを記述"></textarea> 
        </div>
        <button id="ni-submit" class="btn primary-btn">スケジュールを確定</button>
    </div>
    `;

    document.getElementById("ni-submit").addEventListener("click", () => {
        let text = document.getElementById("ni-input").value.trim();
        logAction("Course 8 (Ni)", `入力:「${text || '(空欄)'}」`);

        if(text.length === 0) {
            container.innerHTML = `
                <div style="text-align:left; width:100%;">
                    <p style="margin-bottom:15px; font-weight:bold; color:var(--danger-color);">🚨 システム追撃</p>
                    <p style="font-size:0.9rem; margin-bottom:20px;">「予定が白紙（空欄）のままです。その理由は？」</p>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <button id="ni-btn-empty-a" class="btn">A: 「とりあえず今動く方が大事だから、未来のことは後回し」</button>
                        <button id="ni-btn-empty-b" class="btn">B: 「確定した情報がないため、白紙にしておくのが最も論理的」</button>
                    </div>
                </div>
            `;
            setTimeout(() => {
                document.getElementById("ni-btn-empty-a").addEventListener("click", () => {
                    logAction("Course 8 (Ni空欄追撃)", "A: 今動く方が大事 (Ni脆弱)");
                    scores.Ni += 3; hasSeTalent = true; showToast("長期計画を軽視し現在を優先（Ni脆弱）を確認しました。"); setTimeout(nextStep, 1500);
                });
                document.getElementById("ni-btn-empty-b").addEventListener("click", () => {
                    logAction("Course 8 (Ni空欄追撃)", "B: 確定情報がない (Ti防衛)");
                    scores.Ni += 1; hasTiTalent = true; showToast("不確定要素の排除（Ti防衛）を確認しました。"); setTimeout(nextStep, 1500);
                });
            }, 200);
        } else if(/(知るか|どうでもいい|今|関係ない|廃棄|無駄|意味ない|やめ|うるさ)/i.test(text)) {
            scores.Ni += 1; hasSeTalent = true; 
            showToast("未来の無価値さ、または現在への執着を確認。セッションをクローズします。"); setTimeout(nextStep, 2000);
        } else if(/(わから|無理|未定|決まって|ない|不明|バグ|エラー|想像でき)/i.test(text)) {
            container.innerHTML = `
                <div style="text-align:left; width:100%;">
                    <p style="margin-bottom:15px; font-weight:bold; color:var(--danger-color);">🚨 システム追撃</p>
                    <p style="font-size:0.9rem; margin-bottom:20px;">「エラーを吐いちゃったね？ その『わからない/無理』という応答の構造について教えて？」</p>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <button id="ni-btn-a" class="btn">A: 「不確定要素が多すぎて、正確な予測が不可能だから」</button>
                        <button id="ni-btn-b" class="btn">B: 「そもそも『10年後』という時間感覚自体がピンとこないから」</button>
                    </div>
                </div>
            `;
            setTimeout(() => { 
                document.getElementById("ni-btn-a").addEventListener("click", () => {
                    logAction("Course 8 (Ni追撃)", "A: 不確定要素が多いから (Ti/Ne防衛)");
                    scores.Ni += 1; hasTiTalent = true; showToast("論理的な予測の保留（Ti/Ne防衛）を確認しました。"); setTimeout(nextStep, 1500);
                });
                document.getElementById("ni-btn-b").addEventListener("click", () => {
                    logAction("Course 8 (Ni追撃)", "B: 10年後がピンとこない (Ni脆弱)");
                    scores.Ni += 3; showToast("長期的な時間感覚の欠如（純粋なNi脆弱）を確認しました。"); setTimeout(nextStep, 1500);
                });
            }, 200);
        } else if(text.length >= 10) { showToast("10年後の長期的な予測（Ni）を適切に構築しました。"); setTimeout(nextStep, 2000);
        } else { scores.Ni += 1; showToast("曖昧な予測を検知しました。"); setTimeout(nextStep, 2000); }
    });
}

/* === 9. フィードバック === */
function loadFeedbackGimmick(container) {
    container.innerHTML = `
        <div style="text-align:left; width:100%;">
            <p style="margin-bottom:15px; font-weight:bold; color:var(--accent-color);"><i class="fa-solid fa-pen-to-square"></i> お客様ご意見カード</p>
            <p style="font-size:0.9rem; margin-bottom:20px;">すべてのメニューの提供が完了しました。<br>本日の「Café PoLR」の居心地はいかがでしたか？ 改善点や感想、キャラクターへの文句などがあればご自由にお書きください。</p>
            <textarea id="feedback-input" rows="5" style="width:100%; padding:10px; border-radius:4px; border:1px solid var(--border-color); margin-bottom:20px; box-sizing:border-box;" placeholder="ここに感想を入力..."></textarea>
            <button id="feedback-submit" class="btn primary-btn" style="width:100%;">提出して退店する（お会計へ）</button>
        </div>
    `;
    document.getElementById("feedback-submit").addEventListener("click", () => {
        let text = document.getElementById("feedback-input").value.trim();
        if(text.length > 0) { logAction("Course 9 (お客様の声)", `「${text}」`); } else { logAction("Course 9 (お客様の声)", "(未記入)"); }
        showToast("ご意見ありがとうございます！"); setTimeout(nextStep, 1000);
    });
}

/* === 結果画面 ＆ GAS送信 === */
function showResult() {
    document.getElementById("quiz-screen").classList.add("hidden");
    document.getElementById("result-screen").classList.remove("hidden");
    
    let sortedScores = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    let maxVulnerability = sortedScores[0];
    
    let html = `<p>すべての観測が終了しました。<br>行動ログから、最も負荷がかかっている領域を特定しました。</p>`;
    html += `<h3 style="color:var(--danger-color); font-size:1.6rem; margin:20px 0;">検出された脆弱性：${maxVulnerability}</h3>`;
    
    html += `<div style="text-align:left; margin:20px 0; padding:15px; background:#faf8f5; border:1px solid var(--border-color); border-radius:4px;">
        <p style="margin-top:0; font-weight:bold; border-bottom:1px solid #ddd; padding-bottom:5px;">📊 脆弱性スコアランキング</p>`;
    
    let maxScore = scores[maxVulnerability] < 1 ? 1 : scores[maxVulnerability]; 
    sortedScores.forEach(key => {
        let pct = (scores[key] / maxScore) * 100;
        let dispScore = Math.round(scores[key] * 10) / 10;
        html += `<div class="ranking-bar"><div class="ranking-label">${key}</div><div class="ranking-track"><div class="ranking-fill" style="width:0%" data-width="${pct}%"></div></div><div class="ranking-score">${dispScore}</div></div>`;
    });
    html += `</div>`;

    if(hasSeTalent) {
        html += `<div style="margin-top:10px; padding:12px; background:#fff5f5; border:1px solid var(--danger-color); border-radius:4px; text-align:left; font-size:0.9rem;">
            <i class="fa-solid fa-bolt" style="color:var(--danger-color);"></i> <strong>特記事項:</strong> あなたからは強い物理的干渉（Se）の才能が検出されました。
        </div>`;
    }
    if(hasTiTalent) {
        html += `<div style="margin-top:10px; padding:12px; background:#f0f8ff; border:1px solid #1976d2; border-radius:4px; text-align:left; font-size:0.9rem;">
            <i class="fa-solid fa-cube" style="color:#1976d2;"></i> <strong>特記事項:</strong> あなたからは事象を論理的に構造化・規則化する（Ti）の才能が検出されました。
        </div>`;
    }
    if(hasFeFiTalent) {
        html += `<div style="margin-top:10px; padding:12px; background:#f9f0ff; border:1px solid #9c27b0; border-radius:4px; text-align:left; font-size:0.9rem;">
            <i class="fa-solid fa-heart" style="color:#9c27b0;"></i> <strong>特記事項:</strong> あなたからは他者の感情や関係性を尊重する（Fe/Fi）の才能が検出されました。
        </div>`;
    }
    
    // ★追加：特記事項に関する注釈
    if(hasSeTalent || hasTiTalent || hasFeFiTalent) {
        html += `<p style="font-size:0.8rem; color:var(--text-light); margin-top:10px;">※特記事項（才能検出）は、あなたが入力した特定のキーワードや行動パターンをシステムが機械的に拾ったフラグです。全体の脆弱スコアと矛盾することもありますが、仕様ですので気にしすぎないでくださいね！☕</p>`;
    }

    html += `<p style="margin-top:20px; font-size:0.85rem; color:var(--text-light);">ご来店ありがとうございました。<br>またのデバッグをお待ちしております🥺🐛</p>`;
    document.getElementById("result-content").innerHTML = html;

    setTimeout(() => { document.querySelectorAll('.ranking-fill').forEach(el => { el.style.width = el.getAttribute('data-width'); }); }, 100);

    let logText = actionLogs.map(l => `・${l}`).join("\n");
    document.getElementById("action-log-content").innerText = logText || "記録されたログはありません。";

    sendLogToGAS();
}

function sendLogToGAS() {
    if(!GAS_URL || GAS_URL === "") return;
    let selfType = document.getElementById("self-type").value || "未記入";
    let payload = { type: selfType, scores: scores, seTalent: hasSeTalent, tiTalent: hasTiTalent, fefiTalent: hasFeFiTalent, logs: actionLogs.join("\n") };
    fetch(GAS_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) })
    .then(res => console.log("ログを送信しました。")).catch(err => console.error(err));
}

function copyActionLog() {
    let logText = document.getElementById("action-log-content").innerText;
    navigator.clipboard.writeText("【Café PoLR 観測ログ】\n" + logText).then(() => { showToast("ログをコピーしました！"); });
}

function saveAsImage() {
    const captureArea = document.getElementById("capture-area");
    html2canvas(captureArea, { scale: 2, backgroundColor: "#ffffff" }).then(canvas => {
        let link = document.createElement("a"); link.download = "Cafe_PoLR_Result.png"; link.href = canvas.toDataURL("image/png"); link.click();
    });
}

document.getElementById("retry-btn").addEventListener("click", () => { location.reload(); });
