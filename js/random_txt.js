import { app } from "../../scripts/app.js";

// ============ 常量 ============
const EXTENSION_NAME = "Hezl.RandomTXT";
const NODE_NAME = "HezlRandomTXT";

// ============ CSS 注入 ============
let cssInjected = false;
function injectCSS() {
    if (cssInjected) return;
    cssInjected = true;
    const style = document.createElement("style");
    style.textContent = `
.hezl-rtxt-container {
    width: 100%;
    height: 100%;
    min-height: 300px;
    display: flex;
    border: 1px solid var(--border-color, #444);
    background: var(--comfy-menu-bg, #1e1e1e);
    color: var(--input-text, #ddd);
    font-size: 12px;
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
}
/* 确保父级链高度传递 */
.comfy-widget-custom .hezl-rtxt-container {
    height: 100%;
}
.comfy-widget-custom {
    height: 100% !important;
    min-height: 300px;
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
}
/* 移除节点底部额外边距 */
.comfy-node .comfy-widget-custom {
    margin-bottom: 0 !important;
}

/* ===== 左侧面板 ===== */
.hezl-rtxt-left {
    width: 240px;
    min-width: 120px;
    max-width: 500px;
    overflow: hidden;
    border-right: 1px solid var(--border-color, #444);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
}
.hezl-rtxt-left-toolbar {
    display: flex;
    gap: 3px;
    padding: 4px 4px;
    border-bottom: 1px solid var(--border-color, #444);
    flex-shrink: 0;
    flex-wrap: wrap;
}
.hezl-rtxt-search {
    width: 100%;
    background: var(--comfy-input-bg, #333);
    color: var(--input-text, #ddd);
    border: 1px solid var(--border-color, #555);
    border-radius: 3px;
    padding: 2px 4px;
    font-size: 12px;
    box-sizing: border-box;
}
.hezl-rtxt-btn {
    cursor: pointer;
    background: var(--comfy-input-bg, #333);
    border: 1px solid var(--border-color, #555);
    color: var(--input-text, #ddd);
    border-radius: 3px;
    padding: 2px 6px;
    font-size: 11px;
    white-space: nowrap;
}
.hezl-rtxt-btn:hover { background: #445; border-color: #6c9; }
.hezl-rtxt-btn.primary { background: #4a8; color: #000; border-color: #6c9; }
.hezl-rtxt-btn.primary:hover { background: #6c9; }
.hezl-rtxt-btn.all-on { background: #4a8; color: #000; border-color: #6c9; }
.hezl-rtxt-btn.all-on:hover { background: #6c9; }
.hezl-rtxt-btn.all-off { background: #844; color: #fff; border-color: #c66;  }
.hezl-rtxt-btn.all-off:hover { background: #a55; }
.hezl-rtxt-btn-row { display: flex; gap: 3px; width: 100%; flex-wrap: wrap; }
.hezl-rtxt-num-input {
    width: 50px;
    background: var(--comfy-input-bg, #333);
    color: var(--input-text, #ddd);
    border: 1px solid var(--border-color, #555);
    border-radius: 3px;
    padding: 2px 4px;
    font-size: 12px;
    text-align: center;
}
/* 隐藏 number 输入框的上下箭头 */
.hezl-rtxt-num-input::-webkit-outer-spin-button,
.hezl-rtxt-num-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
.hezl-rtxt-num-input { -moz-appearance: textfield; }
/* 种子输入框：宽度自适应内容 */
.hezl-rtxt-seed-input {
    width: 120px;
    text-align: left;
}
.hezl-rtxt-sep-divider {
    width: 1px;
    background: var(--border-color, #555);
    flex-shrink: 0;
    align-self: stretch;
    margin: 0 8px;
}

/* ===== 🗳️ + 数量输入框 + 微调按钮 组合 ===== */
.hezl-merge-group {
    display: flex;
    align-items: stretch;
    gap: 0;
    flex-shrink: 0;
}
.hezl-merge-group .hezl-rtxt-btn {
    border-radius: 3px 0 0 3px;
    border-right: none;
}
.hezl-merge-group .hezl-rtxt-num-input {
    border-radius: 0;
    border-right: none;
    width: 36px;
    text-align: center;
}
.hezl-spinner-btns {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
}
.hezl-spinner-btn {
    width: 16px;
    height: 10px;
    box-sizing: border-box;
    border: 1px solid var(--border-color, #555);
    background: var(--comfy-input-bg, #333);
    color: var(--input-text, #ddd);
    font-size: 7px;
    line-height: 1;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}
.hezl-spinner-btn.up { border-radius: 0 3px 0 0; }
.hezl-spinner-btn.down { border-radius: 0 0 3px 0; border-top: none; }
.hezl-spinner-btn:hover { background: #445; border-color: #6c9; }

.hezl-rtxt-tree {
    flex: 1;
    overflow: auto;
    padding: 2px;
}
.hezl-tree-row {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 1px 2px;
    white-space: nowrap;
    cursor: default;
}
.hezl-tree-row:hover { background: rgba(255,255,255,0.05); }
.hezl-tree-row.shift-selected { background: rgba(106,204,153,0.25); }
.hezl-tree-toggle {
    width: 14px;
    cursor: pointer;
    text-align: center;
    flex-shrink: 0;
    user-select: none;
}
.hezl-tree-icon { flex-shrink: 0; width: 14px; text-align: center; }
.hezl-tree-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}
/* 右键菜单 */
.hezl-ctx-menu {
    position: fixed;
    z-index: 100001;
    min-width: 120px;
    background: var(--comfy-menu-bg, #1e1e1e);
    border: 1px solid var(--border-color, #555);
    border-radius: 4px;
    padding: 4px 0;
    font-size: 12px;
    user-select: none;
}
.hezl-ctx-item {
    padding: 6px 14px;
    cursor: pointer;
    color: var(--input-text, #ddd);
}
.hezl-ctx-item:hover {
    background: var(--comfy-input-bg, #2a2a2a);
}
/* 重命名内联输入框 */
.hezl-tree-rename-input {
    flex: 1;
    min-width: 40px;
    background: var(--comfy-input-bg, #111);
    color: var(--input-text, #ddd);
    border: 1px solid #4a8;
    border-radius: 2px;
    padding: 0 3px;
    font-size: 12px;
    outline: none;
}
.hezl-tree-check {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    cursor: pointer;
    accent-color: #4a8;
    margin: 0;
}
.hezl-tree-children { margin-left: 16px; }
.hezl-tree-empty { padding: 8px; color: #888; font-style: italic; text-align: center; }

/* 分隔条 */
.hezl-rtxt-resizer {
    width: 5px;
    cursor: col-resize;
    background: var(--border-color, #444);
    flex-shrink: 0;
}
.hezl-rtxt-resizer:hover, .hezl-rtxt-resizer.dragging { background: #6c9; }

/* ===== 右侧面板 ===== */
.hezl-rtxt-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
}
.hezl-rtxt-toolbar {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 4px 6px;
    border-bottom: 1px solid var(--border-color, #444);
    flex-shrink: 0;
}
.hezl-rtxt-toolbar-row {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
}
.hezl-rtxt-toolbar-group {
    display: flex;
    gap: 3px;
    align-items: center;
}
.hezl-rtxt-preset-select {
    flex: 1;
    min-width: 80px;
    max-width: 200px;
    background: var(--comfy-input-bg, #333);
    color: var(--input-text, #ddd);
    border: 1px solid var(--border-color, #555);
    border-radius: 3px;
    padding: 2px 4px;
    font-size: 12px;
}

.hezl-rtxt-items {
    flex: 1;
    overflow: auto;
    padding: 4px;
}
.hezl-rtxt-item-wrap {
    display: flex;
    align-items: stretch;
    gap: 4px;
    margin-bottom: 4px;
}
.hezl-rtxt-item-index {
    width: 22px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: bold;
    color: #6c9;
    user-select: none;
}
.hezl-rtxt-item {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 3px 5px;
    white-space: nowrap;
    border-radius: 4px;
    border: 1px solid var(--border-color, #555);
    background: var(--comfy-input-bg, #2a2a2a);
    cursor: grab;
    flex: 1;
    min-width: 0;
}
.hezl-rtxt-item:hover { border-color: #6c9; }
.hezl-rtxt-item.dragging { opacity: 0.4; cursor: grabbing; }
.hezl-rtxt-item.drag-over { border-color: #6c9; border-style: dashed; }
.hezl-rtxt-item.disabled { opacity: 0.5; }
.hezl-rtxt-item.merge-active { border-color: #ee0; }
.hezl-item-toggle {
    min-width: 28px;
    height: 20px;
    border: 1px solid var(--border-color, #555);
    border-radius: 3px;
    cursor: pointer;
    flex-shrink: 0;
    font-size: 12px;
    line-height: 1;
    padding: 0 4px;
    background: #555;
    color: #ddd;
}
.hezl-item-toggle.on {
    background: #4a8;
    color: #000;
    border-color: #6c9;
}
.hezl-item-toggle:hover { opacity: 0.85; }
.hezl-item-name {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.hezl-sep { color: #666; flex-shrink: 0; }
.hezl-dice {
    width: 26px;
    height: 20px;
    border: 1px solid var(--border-color, #555);
    background: var(--comfy-input-bg, #333);
    border-radius: 3px;
    cursor: pointer;
    flex-shrink: 0;
    font-size: 12px;
    line-height: 1;
    opacity: 0.5;
}
.hezl-dice.active {
    opacity: 1;
    background: #4a8;
    border-color: #6c9;
}
.hezl-dice:hover { opacity: 0.85; }
.hezl-dice.active:hover { opacity: 1; }
.hezl-item-line-btn {
    width: 200px;
    flex-shrink: 0;
    text-align: left;
    background: var(--comfy-input-bg, #333);
    color: var(--input-text, #ddd);
    border: 1px solid var(--border-color, #555);
    border-radius: 3px;
    padding: 2px 6px;
    font-size: 12px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.hezl-item-line-btn:hover { border-color: #6c9; }
.hezl-item-line-btn.random-active { border: 1px solid red; }
.hezl-item-remove {
    width: 18px;
    height: 18px;
    border: none;
    background: transparent;
    color: #a66;
    cursor: pointer;
    font-size: 15px;
    line-height: 1;
    flex-shrink: 0;
    border-radius: 3px;
}
.hezl-item-remove:hover { background: #433; color: #f88; }
.hezl-items-empty { padding: 12px; color: #888; text-align: center; font-style: italic; }
.hezl-drag-handle { color: #666; cursor: grab; flex-shrink: 0; user-select: none; }

/* ===== 弹窗 ===== */
.hezl-modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 100000;
}
.hezl-modal {
    position: fixed;
    width: 420px;
    max-width: 90vw;
    max-height: 60vh;
    background: var(--comfy-menu-bg, #1e1e1e);
    border: 1px solid var(--border-color, #555);
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.hezl-modal-header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 10px;
    border-bottom: 1px solid var(--border-color, #444);
    font-weight: bold;
    color: var(--input-text, #ddd);
}
.hezl-modal-search {
    width: 100%;
    background: var(--comfy-input-bg, #333);
    color: var(--input-text, #ddd);
    border: 1px solid var(--border-color, #555);
    border-radius: 3px;
    padding: 4px 6px;
    font-size: 12px;
    box-sizing: border-box;
}
.hezl-modal-close {
    cursor: pointer;
    background: transparent;
    border: none;
    color: #a66;
    font-size: 18px;
    line-height: 1;
    padding: 0 4px;
}
.hezl-modal-close:hover { color: #f88; }
.hezl-modal-list {
    flex: 1;
    overflow: auto;
    padding: 4px;
    position: relative;
}
.hezl-modal-item {
    padding: 5px 8px;
    cursor: pointer;
    border-radius: 3px;
    color: var(--input-text, #ddd);
    word-break: break-all;
    white-space: normal;
    content-visibility: auto;
    contain-intrinsic-size: auto 26px;
}
.hezl-modal-item:hover { background: rgba(106,204,153,0.2); }
.hezl-modal-item.selected {
    background: #4a8;
    color: #000;
    font-weight: bold;
}
.hezl-modal-empty { padding: 16px; color: #888; text-align: center; font-style: italic; }

/* 间隔符按钮 */
.hezl-item-sep-btn {
    width: 28px;
    height: 20px;
    border: 1px solid var(--border-color, #555);
    background: var(--comfy-input-bg, #333);
    border-radius: 3px;
    cursor: pointer;
    flex-shrink: 0;
    font-size: 12px;
    line-height: 1;
    padding: 0;
    opacity: 0.7;
}
.hezl-item-sep-btn:hover { opacity: 1; border-color: #6c9; }

/* 间隔符弹窗 */
.hezl-sep-modal { width: 360px; max-height: 80vh; }
.hezl-sep-body {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.hezl-sep-hint {
    color: #999;
    font-size: 11px;
    line-height: 1.5;
}
.hezl-sep-input-wrap { width: 100%; box-sizing: border-box; }
.hezl-sep-input {
    width: 100%;
    box-sizing: border-box;
    background: var(--comfy-input-bg, #333);
    color: var(--input-text, #ddd);
    border: 1px solid var(--border-color, #555);
    border-radius: 3px;
    padding: 5px 8px;
    font-size: 13px;
}
.hezl-sep-input:focus { outline: none; border-color: #6c9; }
.hezl-sep-quick {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}
.hezl-sep-quick-btn { font-size: 11px; padding: 2px 6px; }
.hezl-sep-actions {
    display: flex;
    gap: 6px;
    justify-content: flex-end;
    margin-top: 2px;
}
`;
    document.head.appendChild(style);
}

// ============ Python random.Random 复刻（MT19937）============
// 用于前端预计算 🎲 随机模式下每个 txt 将输出的行，使词组按钮显示与后端 execute() 一致的结果。
// 已通过多轮测试验证与 CPython random.Random 字节级一致（choice/sample/getrandbits）。
// 关键陷阱：JS 中 ^ 优先级低于 +，必须用括号保证 (mt[i] ^ mul) + key + j 的求值顺序。
const MT_N = 624;
const MT_M = 397;
const MT_MATRIX_A = 0x9908b0df;
const MT_UPPER_MASK = 0x80000000;
const MT_LOWER_MASK = 0x7fffffff;

class PyRandom {
    constructor(seed) {
        this.mt = new Array(MT_N);
        this.index = MT_N;
        this.seed(seed);
    }

    seed(s) {
        s = Number(s);
        if (!Number.isFinite(s) || s < 0) s = 0;
        s = Math.floor(s);
        // 转换为 uint32 数组（little-endian），与 CPython _PyLong_AsByteArray 一致。
        // Python 的 random.Random(seed) 对 seed >= 2^32 会拆成多元素 key 调用 init_by_array，
        // 必须复刻此行为，否则大种子结果不一致。
        // 限制：JS Number 精度为 2^53，超过此值会丢失精度（与前端 parseInt 一致，可接受）。
        const key = [];
        if (s === 0) {
            key.push(0);
        } else {
            let remaining = s;
            while (remaining > 0) {
                key.push((remaining & 0xffffffff) >>> 0);
                remaining = Math.floor(remaining / 0x100000000);
            }
        }
        // init_genrand(19650218) — CPython init_by_array 内部第一步
        this.mt[0] = 19650218 >>> 0;
        for (let i = 1; i < MT_N; i++) {
            this.mt[i] = ((Math.imul(1812433253, (this.mt[i-1] ^ (this.mt[i-1] >>> 30))) + i) >>> 0);
        }
        this.index = MT_N;
        // init_by_array(key)
        this._init_by_array(key);
    }

    _init_by_array(init_key) {
        let i = 1, j = 0;
        let k = Math.max(MT_N, init_key.length);
        for (let n = 0; n < k; n++) {
            const mul = Math.imul((this.mt[i-1] ^ (this.mt[i-1] >>> 30)), 1664525);
            this.mt[i] = (((this.mt[i] ^ mul) + init_key[j] + j) >>> 0);
            i++; j++;
            if (i >= MT_N) { this.mt[0] = this.mt[MT_N-1]; i = 1; }
            if (j >= init_key.length) { j = 0; }
        }
        for (let n = 0; n < MT_N - 1; n++) {
            const mul = Math.imul((this.mt[i-1] ^ (this.mt[i-1] >>> 30)), 1566083941);
            this.mt[i] = (((this.mt[i] ^ mul) - i) >>> 0);
            i++;
            if (i >= MT_N) { this.mt[0] = this.mt[MT_N-1]; i = 1; }
        }
        this.mt[0] = MT_UPPER_MASK;
        this.index = MT_N;
    }

    _genrand_uint32() {
        if (this.index >= MT_N) {
            for (let kk = 0; kk < MT_N - MT_M; kk++) {
                let y = ((this.mt[kk] & MT_UPPER_MASK) | (this.mt[kk+1] & MT_LOWER_MASK)) >>> 0;
                this.mt[kk] = (this.mt[kk+MT_M] ^ (y >>> 1) ^ ((y & 1) ? MT_MATRIX_A : 0)) >>> 0;
            }
            for (let kk = MT_N - MT_M; kk < MT_N - 1; kk++) {
                let y = ((this.mt[kk] & MT_UPPER_MASK) | (this.mt[kk+1] & MT_LOWER_MASK)) >>> 0;
                this.mt[kk] = (this.mt[kk + (MT_M - MT_N)] ^ (y >>> 1) ^ ((y & 1) ? MT_MATRIX_A : 0)) >>> 0;
            }
            let y = ((this.mt[MT_N-1] & MT_UPPER_MASK) | (this.mt[0] & MT_LOWER_MASK)) >>> 0;
            this.mt[MT_N-1] = (this.mt[MT_M-1] ^ (y >>> 1) ^ ((y & 1) ? MT_MATRIX_A : 0)) >>> 0;
            this.index = 0;
        }
        let y = this.mt[this.index++];
        y = (y ^ (y >>> 11)) >>> 0;
        y = (y ^ ((y << 7) & 0x9d2c5680)) >>> 0;
        y = (y ^ ((y << 15) & 0xefc60000)) >>> 0;
        y = (y ^ (y >>> 18)) >>> 0;
        return y >>> 0;
    }

    _bit_length(n) {
        let k = 0;
        while (n > 0) { n = Math.floor(n / 2); k++; }
        return k;
    }

    _getrandbits(k) {
        // k <= 32
        if (k <= 0) return 0;
        return (this._genrand_uint32() >>> (32 - k)) >>> 0;
    }

    _randbelow(n) {
        if (n <= 0) throw new Error("n must be positive");
        let k = this._bit_length(n);
        let r = this._getrandbits(k);
        while (r >= n) {
            r = this._getrandbits(k);
        }
        return r;
    }

    choice(seq) {
        return seq[this._randbelow(seq.length)];
    }

    sample(population, k) {
        const n = population.length;
        if (k < 0 || k > n) throw new Error("invalid sample size");
        const result = new Array(k);
        // 与 CPython random.sample 一致：小总体用池方法，大总体用集合方法
        let setsize = 21;
        if (k > 5) {
            setsize += Math.pow(4, Math.ceil(Math.log(k * 3) / Math.log(4)));
        }
        if (n <= setsize) {
            const pool = population.slice();
            for (let i = 0; i < k; i++) {
                const j = this._randbelow(n - i);
                result[i] = pool[j];
                pool[j] = pool[n - i - 1];
            }
        } else {
            const selected = new Set();
            for (let i = 0; i < k; i++) {
                let j = this._randbelow(n);
                while (selected.has(j)) {
                    j = this._randbelow(n);
                }
                selected.add(j);
                result[i] = population[j];
            }
        }
        return result;
    }
}

// ============ 状态管理 ============
const nodeStates = new WeakMap();

function getState(node) {
    if (!nodeStates.has(node)) {
        nodeStates.set(node, {
            items: [],        // {path, name, enabled, random, selected_line, lines}
            tree: null,
            presets: [],
            currentPreset: "",
            leftWidth: 240,
            treeExpanded: {},  // path -> bool
            treeSelected: {},  // path -> bool (txt文件)
            treeShiftSelected: {}, // path -> bool (shift多选临时高亮)
            lastSelectedPath: null, // 上次选中的txt路径（用于shift范围选）
            searchText: "",
            merge_enabled: false,   // 合并随机输出开关
            merge_count: 1,         // 合并随机输出数量
            seed_mode: "random",    // "random"=每次随机, "fixed"=固定种子
            seed: 0,                // 种子值
        });
    }
    return nodeStates.get(node);
}

// ============ API 调用 ============
async function fetchTree() {
    const resp = await fetch("/hezl_randomtxt/tree");
    const data = await resp.json();
    return data.tree || [];
}
async function fetchFile(path) {
    const resp = await fetch(`/hezl_randomtxt/file?path=${encodeURIComponent(path)}`);
    const data = await resp.json();
    return { lines: data.lines || [], trLines: data.tr_lines || [] };
}
async function fetchPresets() {
    const resp = await fetch("/hezl_randomtxt/presets");
    const data = await resp.json();
    return data.presets || [];
}
async function savePresetAPI(name, data) {
    const resp = await fetch("/hezl_randomtxt/preset/save", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, data }),
    });
    return await resp.json();
}
async function loadPresetAPI(name) {
    const resp = await fetch("/hezl_randomtxt/preset/load", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
    return await resp.json();
}
async function renamePresetAPI(oldName, newName) {
    const resp = await fetch("/hezl_randomtxt/preset/rename", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old: oldName, new: newName }),
    });
    return await resp.json();
}
async function deletePresetAPI(name) {
    const resp = await fetch("/hezl_randomtxt/preset/delete", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
    return await resp.json();
}

// ============ 序列化 ============
function serializeState(node) {
    const state = getState(node);
    return {
        items: state.items.map(it => ({
            path: it.path,
            name: it.name,
            enabled: it.enabled,
            random: it.random,
            selected_line: it.selected_line,
            separator: it.separator ?? ",",
        })),
        merge_enabled: state.merge_enabled,
        merge_count: state.merge_count,
        seed_mode: state.seed_mode,
        seed: state.seed,
    };
}
function serializeConfigStr(node) {
    return JSON.stringify(serializeState(node));
}

async function restoreState(node, stateObj) {
    const state = getState(node);
    state.items = [];
    state.merge_enabled = !!(stateObj && stateObj.merge_enabled);
    state.merge_count = (stateObj && stateObj.merge_count) || 1;
    state.seed_mode = (stateObj && stateObj.seed_mode) || "random";
    state.seed = (stateObj && stateObj.seed) || 0;
    if (stateObj && stateObj.items) {
        for (const item of stateObj.items) {
            const newItem = {
                path: item.path,
                name: item.name || item.path.split("/").pop(),
                enabled: !!item.enabled,
                random: !!item.random,
                selected_line: item.selected_line || 0,
                separator: item.separator ?? ",",
                lines: [],
                tr_lines: [],
            };
            try {
                const f = await fetchFile(item.path);
                newItem.lines = f.lines;
                newItem.tr_lines = f.trLines;
            } catch (e) { newItem.lines = []; newItem.tr_lines = []; }
            state.items.push(newItem);
        }
    }
    renderItems(node);
    // 同步合并/种子 UI
    updateMergeBtn(node);
    updateSeedBtn(node);
    if (node._hezl_seed_input) node._hezl_seed_input.value = state.seed;
    const mci = node._hezl_merge_btn?.parentElement?.querySelector("input.hezl-rtxt-num-input");
    if (mci) mci.value = state.merge_count;
}

// ============ 递归收集文件夹下所有txt ============
function collectFiles(treeNode) {
    const files = [];
    if (treeNode.type === "file") {
        files.push(treeNode);
    } else if (treeNode.type === "folder") {
        for (const child of treeNode.children || []) {
            files.push(...collectFiles(child));
        }
    }
    return files;
}

// 收集文件夹下所有txt的路径（用于文件夹勾选联动）
function collectFilePaths(treeNode) {
    const paths = [];
    if (treeNode.type === "file") {
        paths.push(treeNode.path);
    } else if (treeNode.type === "folder") {
        for (const child of treeNode.children || []) {
            paths.push(...collectFilePaths(child));
        }
    }
    return paths;
}

// 文件夹是否所有子txt都已勾选
function isFolderAllSelected(node, folderNode) {
    const paths = collectFilePaths(folderNode);
    if (paths.length === 0) return false;
    const state = getState(node);
    return paths.every(p => state.treeSelected[p]);
}

// ============ 添加文件到右侧 ============
async function addItem(node, fileNode) {
    const state = getState(node);
    if (state.items.some(it => it.path === fileNode.path)) return;
    const item = {
        path: fileNode.path,
        name: fileNode.name,
        enabled: true,
        random: true,
        selected_line: 0,
        separator: ",",
        lines: [],
        tr_lines: [],
    };
    try {
        const f = await fetchFile(fileNode.path);
        item.lines = f.lines;
        item.tr_lines = f.trLines;
    } catch (e) { item.lines = []; item.tr_lines = []; }
    state.items.push(item);
    renderItems(node);
}

async function addSelectedFiles(node) {
    const state = getState(node);
    const selectedPaths = Object.keys(state.treeSelected).filter(k => state.treeSelected[k]);
    if (selectedPaths.length === 0) {
        alert("请先勾选要添加的 txt 文件");
        return;
    }
    // 从树中找到对应的文件节点
    const allFiles = [];
    if (state.tree) {
        for (const tn of state.tree) {
            allFiles.push(...collectFiles(tn));
        }
    }
    for (const fp of selectedPaths) {
        const fn = allFiles.find(f => f.path === fp);
        if (fn) await addItem(node, fn);
    }
    // 添加后清空选择
    state.treeSelected = {};
    renderTree(node);
}

// ============ 树过滤 ============
function filterTree(tree, query) {
    if (!query) return tree;
    const q = query.toLowerCase();
    const result = [];
    for (const node of tree) {
        if (node.type === "file") {
            if (node.name.toLowerCase().includes(q)) {
                result.push(node);
            }
        } else if (node.type === "folder") {
            const nameMatch = node.name.toLowerCase().includes(q);
            const filteredChildren = filterTree(node.children || [], query);
            if (nameMatch || filteredChildren.length > 0) {
                result.push({ ...node, children: filteredChildren });
            }
        }
    }
    return result;
}

// ============ 收集可见的txt文件（过滤后） ============
function collectVisibleFiles(tree) {
    const files = [];
    for (const node of tree) {
        if (node.type === "file") {
            files.push(node);
        } else if (node.type === "folder") {
            files.push(...collectVisibleFiles(node.children || []));
        }
    }
    return files;
}

// ============ 目录树渲染 ============
function renderTree(node) {
    const state = getState(node);
    const container = node._hezl_tree_el;
    if (!container) return;
    container.innerHTML = "";

    if (!state.tree || state.tree.length === 0) {
        container.innerHTML = '<div class="hezl-tree-empty">SaveTXT 文件夹为空<br>请添加 txt 文件</div>';
        return;
    }

    const displayTree = filterTree(state.tree, state.searchText);
    if (displayTree.length === 0) {
        container.innerHTML = '<div class="hezl-tree-empty">未找到匹配的文件</div>';
        return;
    }

    const rootWrap = document.createElement("div");
    for (const child of displayTree) {
        rootWrap.appendChild(renderTreeNode(node, child));
    }
    container.appendChild(rootWrap);
    // 同步更新全选按钮图标状态
    updateSelectAllBtn(node);
}

function renderTreeNode(node, treeNode) {
    const wrap = document.createElement("div");
    const row = document.createElement("div");
    row.className = "hezl-tree-row";

    if (treeNode.type === "folder") {
        const state = getState(node);
        // 默认收起；仅在用户显式展开时展开；搜索时强制展开以便看到匹配结果
        const expanded = state.searchText ? true : (state.treeExpanded[treeNode.path] === true);
        const toggle = document.createElement("span");
        toggle.className = "hezl-tree-toggle";
        toggle.textContent = expanded ? "▼" : "▶";

        const icon = document.createElement("span");
        icon.className = "hezl-tree-icon";
        icon.textContent = "📁";

        const name = document.createElement("span");
        name.className = "hezl-tree-name";
        name.textContent = treeNode.name;

        // 文件夹勾选框（联动子txt）
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = "hezl-tree-check";
        cb.checked = isFolderAllSelected(node, treeNode);
        cb.title = "勾选/取消此文件夹下所有txt文件";
        cb.addEventListener("click", (e) => {
            // 阻止冒泡到row
            e.stopPropagation();
        });
        cb.addEventListener("change", () => {
            const s = getState(node);
            const paths = collectFilePaths(treeNode);
            const targetChecked = cb.checked;
            for (const p of paths) {
                s.treeSelected[p] = targetChecked;
            }
            // 重新渲染整棵树以更新父/子文件夹勾选状态
            renderTree(node);
        });

        row.appendChild(toggle);
        row.appendChild(icon);
        row.appendChild(name);
        row.appendChild(cb);
        // 悬停提示：列出文件夹内的子文件夹和txt文件名
        const childItems = (treeNode.children || []);
        if (childItems.length > 0) {
            row.title = childItems.map(c => (c.type === "folder" ? "📁 " : "📄 ") + c.name).join("\n");
        } else {
            row.title = "（空文件夹）";
        }
        wrap.appendChild(row);

        const childrenWrap = document.createElement("div");
        childrenWrap.className = "hezl-tree-children";
        childrenWrap.style.display = expanded ? "" : "none";
        for (const child of treeNode.children || []) {
            childrenWrap.appendChild(renderTreeNode(node, child));
        }
        wrap.appendChild(childrenWrap);

        toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            const s = getState(node);
            const isExp = s.treeExpanded[treeNode.path] === true;
            s.treeExpanded[treeNode.path] = !isExp;
            childrenWrap.style.display = !isExp ? "" : "none";
            toggle.textContent = !isExp ? "▼" : "▶";
        });
    } else {
        // txt 文件
        const state = getState(node);
        const spacer = document.createElement("span");
        spacer.className = "hezl-tree-toggle";
        spacer.textContent = "";

        const icon = document.createElement("span");
        icon.className = "hezl-tree-icon";
        icon.textContent = "📄";

        const name = document.createElement("span");
        name.className = "hezl-tree-name";
        name.textContent = treeNode.name;
        name.title = treeNode.path;

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = "hezl-tree-check";
        cb.checked = !!state.treeSelected[treeNode.path];
        cb.addEventListener("click", (e) => {
            e.stopPropagation();
        });
        cb.addEventListener("change", () => {
            state.treeSelected[treeNode.path] = cb.checked;
            state.lastSelectedPath = treeNode.path;
            // 清空shift临时高亮
            state.treeShiftSelected = {};
            renderTree(node);
        });

        // shift+点击行实现范围多选
        row.addEventListener("click", (e) => {
            if (e.target === cb || e.target === toggle || e.target.tagName === "INPUT") return;
            handleTreeRowClick(node, treeNode, e.shiftKey);
        });

        // 高亮shift选中
        if (state.treeShiftSelected[treeNode.path]) {
            row.classList.add("shift-selected");
        }

        row.appendChild(spacer);
        row.appendChild(icon);
        row.appendChild(name);
        row.appendChild(cb);
        // 悬停提示：显示txt文件全名
        row.title = treeNode.name;
        wrap.appendChild(row);
    }

    // 右键菜单（重命名等）
    row.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const nameEl = row.querySelector(".hezl-tree-name");
        showTreeContextMenu(node, treeNode, e.clientX, e.clientY, nameEl);
    });

    return wrap;
}

// ============ 右键菜单 & 重命名 ============
let treeContextMenu = null;
function closeTreeContextMenu() {
    if (treeContextMenu && treeContextMenu.parentNode) {
        treeContextMenu.parentNode.removeChild(treeContextMenu);
    }
    treeContextMenu = null;
    document.removeEventListener("mousedown", onContextMenuOutside, true);
    document.removeEventListener("keydown", onContextMenuEsc, true);
}
function onContextMenuOutside(e) {
    if (treeContextMenu && !treeContextMenu.contains(e.target)) closeTreeContextMenu();
}
function onContextMenuEsc(e) {
    if (e.key === "Escape") closeTreeContextMenu();
}
function showTreeContextMenu(node, treeNode, x, y, nameEl) {
    closeTreeContextMenu();
    const menu = document.createElement("div");
    menu.className = "hezl-ctx-menu";

    const renameItem = document.createElement("div");
    renameItem.className = "hezl-ctx-item";
    renameItem.textContent = "重命名";
    renameItem.addEventListener("click", () => {
        closeTreeContextMenu();
        startRename(node, treeNode, nameEl);
    });
    menu.appendChild(renameItem);

    menu.style.left = x + "px";
    menu.style.top = y + "px";
    document.body.appendChild(menu);
    // 防止越界
    const r = menu.getBoundingClientRect();
    if (r.right > window.innerWidth - 4) menu.style.left = (window.innerWidth - r.width - 4) + "px";
    if (r.bottom > window.innerHeight - 4) menu.style.top = (window.innerHeight - r.height - 4) + "px";

    treeContextMenu = menu;
    setTimeout(() => {
        document.addEventListener("mousedown", onContextMenuOutside, true);
        document.addEventListener("keydown", onContextMenuEsc, true);
    }, 0);
}

// 内联重命名：将名称 span 替换为输入框
function startRename(node, treeNode, nameEl) {
    if (!nameEl) return;
    const oldName = treeNode.name;
    const isFile = treeNode.type === "file";
    const input = document.createElement("input");
    input.type = "text";
    input.className = "hezl-tree-rename-input";
    input.value = oldName;
    nameEl.replaceWith(input);
    input.focus();
    // 选中文件名主体（不含 .txt 后缀）
    if (isFile && oldName.toLowerCase().endsWith(".txt")) {
        input.setSelectionRange(0, oldName.length - 4);
    } else {
        input.select();
    }

    let done = false;
    const finish = (commit) => {
        if (done) return;
        done = true;
        const newName = input.value.trim();
        const span = document.createElement("span");
        span.className = "hezl-tree-name";
        span.textContent = oldName;
        input.replaceWith(span);
        if (!commit || !newName || newName === oldName) return;
        commitRename(node, treeNode, newName);
    };
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); finish(true); }
        else if (e.key === "Escape") { e.preventDefault(); finish(false); }
    });
    input.addEventListener("blur", () => finish(true));
}

async function commitRename(node, treeNode, newName) {
    const state = getState(node);
    try {
        const resp = await fetch("/hezl_randomtxt/rename", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: treeNode.path, new_name: newName })
        });
        const data = await resp.json();
        if (!resp.ok || data.error) {
            alert("重命名失败: " + (data.error || "未知错误"));
            return;
        }
        const oldPath = treeNode.path;
        const newPath = data.new_path;
        const isFolder = treeNode.type === "folder";
        updateStatePathsAfterRename(state, oldPath, newPath, isFolder);
        // 重新加载目录树并刷新右侧条目
        try { state.tree = await fetchTree(); } catch (e) { /* ignore */ }
        renderTree(node);
        renderItems(node);
    } catch (e) {
        alert("重命名失败: " + e.message);
    }
}

// 重命名后更新 state 中以路径为 key 的字段，保持选中/展开/已添加条目不丢失
function updateStatePathsAfterRename(state, oldPath, newPath, isFolder) {
    state.treeShiftSelected = {};
    if (isFolder) {
        const prefix = oldPath + "/";
        const newSel = {};
        for (const k in state.treeSelected) {
            if (k === oldPath) newSel[newPath] = state.treeSelected[k];
            else if (k.startsWith(prefix)) newSel[newPath + "/" + k.slice(prefix.length)] = state.treeSelected[k];
            else newSel[k] = state.treeSelected[k];
        }
        state.treeSelected = newSel;

        const newExp = {};
        for (const k in state.treeExpanded) {
            if (k === oldPath) newExp[newPath] = state.treeExpanded[k];
            else if (k.startsWith(prefix)) newExp[newPath + "/" + k.slice(prefix.length)] = state.treeExpanded[k];
            else newExp[k] = state.treeExpanded[k];
        }
        state.treeExpanded = newExp;

        for (const it of state.items) {
            if (it.path === oldPath) it.path = newPath;
            else if (it.path.startsWith(prefix)) it.path = newPath + "/" + it.path.slice(prefix.length);
        }
        if (state.lastSelectedPath && state.lastSelectedPath.startsWith(prefix)) {
            state.lastSelectedPath = newPath + "/" + state.lastSelectedPath.slice(prefix.length);
        }
    } else {
        if (oldPath in state.treeSelected) {
            state.treeSelected[newPath] = state.treeSelected[oldPath];
            delete state.treeSelected[oldPath];
        }
        for (const it of state.items) {
            if (it.path === oldPath) {
                it.path = newPath;
                it.name = newPath.split("/").pop();
            }
        }
        if (state.lastSelectedPath === oldPath) state.lastSelectedPath = newPath;
    }
}

// ============ shift+点击范围多选 ============
function handleTreeRowClick(node, fileNode, isShift) {
    const state = getState(node);
    if (!isShift) {
        // 普通点击：切换该文件勾选，并记为anchor
        const newVal = !state.treeSelected[fileNode.path];
        state.treeSelected[fileNode.path] = newVal;
        state.lastSelectedPath = fileNode.path;
        state.treeShiftSelected = {};
        renderTree(node);
        return;
    }
    // shift+点击：从 lastSelectedPath 到当前路径范围全选
    if (!state.lastSelectedPath) {
        // 没有anchor，退化为普通点击
        state.treeSelected[fileNode.path] = !state.treeSelected[fileNode.path];
        state.lastSelectedPath = fileNode.path;
        renderTree(node);
        return;
    }
    // 收集当前可见的txt文件顺序（过滤后）
    const displayTree = filterTree(state.tree, state.searchText);
    const orderedFiles = collectVisibleFiles(displayTree);
    const fromIdx = orderedFiles.findIndex(f => f.path === state.lastSelectedPath);
    const toIdx = orderedFiles.findIndex(f => f.path === fileNode.path);
    if (fromIdx === -1 || toIdx === -1) {
        // anchor不在可见列表，退化为普通点击
        state.treeSelected[fileNode.path] = !state.treeSelected[fileNode.path];
        state.lastSelectedPath = fileNode.path;
        renderTree(node);
        return;
    }
    const startIdx = Math.min(fromIdx, toIdx);
    const endIdx = Math.max(fromIdx, toIdx);
    // 清空旧的shift高亮
    state.treeShiftSelected = {};
    for (let i = startIdx; i <= endIdx; i++) {
        const f = orderedFiles[i];
        state.treeSelected[f.path] = true;
        state.treeShiftSelected[f.path] = true;
    }
    // anchor保持不变，便于继续shift点击
    renderTree(node);
}

// ============ 全选/不选 ============
function toggleSelectAll(node) {
    const state = getState(node);
    const displayTree = filterTree(state.tree, state.searchText);
    const visibleFiles = collectVisibleFiles(displayTree);
    if (visibleFiles.length === 0) return;
    // 判断是否全部已选
    const allSelected = visibleFiles.every(f => state.treeSelected[f.path]);
    for (const f of visibleFiles) {
        state.treeSelected[f.path] = !allSelected;
    }
    renderTree(node);
    updateSelectAllBtn(node);
}

// 更新"全选"按钮图标：全部已选显示🟩 ，否则显示 ✅️
function updateSelectAllBtn(node) {
    const btn = node._hezl_select_all_btn;
    if (!btn) return;
    const state = getState(node);
    const displayTree = filterTree(state.tree, state.searchText);
    const visibleFiles = collectVisibleFiles(displayTree);
    const allSelected = visibleFiles.length > 0 && visibleFiles.every(f => state.treeSelected[f.path]);
    btn.textContent = allSelected ? "🟩" : "✅️";
}

// ============ 收集所有文件夹路径 ============
function collectFolderPaths(treeNodes) {
    const paths = [];
    function walk(nodes) {
        for (const n of nodes || []) {
            if (n.type === "folder") {
                paths.push(n.path);
                walk(n.children || []);
            }
        }
    }
    walk(treeNodes);
    return paths;
}

function expandAllFolders(node) {
    const state = getState(node);
    for (const p of collectFolderPaths(state.tree)) {
        state.treeExpanded[p] = true;
    }
    renderTree(node);
}

function collapseAllFolders(node) {
    const state = getState(node);
    for (const p of collectFolderPaths(state.tree)) {
        state.treeExpanded[p] = false;
    }
    renderTree(node);
}

// ============ 移除全部右侧条目 ============
function removeAllItems(node) {
    const state = getState(node);
    if (state.items.length === 0) return;
    if (!confirm(`确定要移除全部 ${state.items.length} 个 txt 文件吗？`)) return;
    state.items = [];
    renderItems(node);
}

// ============ 全开启/全关闭 ============
function toggleAllItems(node, btn) {
    const state = getState(node);
    if (state.items.length === 0) return;
    const allEnabled = state.items.every(it => it.enabled);
    const target = !allEnabled;
    for (const it of state.items) {
        it.enabled = target;
    }
    renderItems(node);
    updateAllToggleBtn(node, btn);
}

function updateAllToggleBtn(node, btn) {
    if (!btn) return;
    const state = getState(node);
    const allEnabled = state.items.length > 0 && state.items.every(it => it.enabled);
    if (allEnabled) {
        btn.textContent = "🔴";
        btn.className = "hezl-rtxt-btn all-off";
    } else {
        btn.textContent = "🟢";
        btn.className = "hezl-rtxt-btn all-on";
    }
}

// ============ 全部随机/全部固定 ============
function toggleAllRandom(node, btn) {
    const state = getState(node);
    if (state.items.length === 0) return;
    const anyRandom = state.items.some(it => it.random);
    const target = !anyRandom;
    for (const it of state.items) {
        it.random = target;
    }
    renderItems(node);
}

function updateAllRandomBtn(node) {
    const btn = node._hezl_all_random_btn;
    if (!btn) return;
    const state = getState(node);
    const anyRandom = state.items.some(it => it.random);
    if (anyRandom) {
        btn.textContent = "📌";
        btn.title = "关闭全部随机";
        btn.className = "hezl-rtxt-btn all-off";
    } else {
        btn.textContent = "🎲";
        btn.title = "开启全部随机";
        btn.className = "hezl-rtxt-btn all-on";
    }
}

// ====== 合并随机输出按钮状态 ======
function updateMergeBtn(node) {
    const btn = node._hezl_merge_btn;
    if (!btn) return;
    const state = getState(node);
    if (state.merge_enabled) {
        btn.textContent = "🗳️";
        btn.title = "合并随机输出已开启（点击关闭）";
        btn.className = "hezl-rtxt-btn all-on";
    } else {
        btn.textContent = "🗳️";
        btn.title = "合并随机输出已关闭（点击开启）";
        btn.className = "hezl-rtxt-btn";
    }
}

// ====== 种子按钮状态 ======
function updateSeedBtn(node) {
    const btn = node._hezl_seed_btn;
    if (!btn) return;
    const state = getState(node);
    if (state.seed_mode === "fixed") {
        btn.textContent = "⏸️";
        btn.title = "固定种子（相同种子输出相同结果，点击切换为随机）";
        btn.className = "hezl-rtxt-btn all-on";
    } else {
        btn.textContent = "🔀";
        btn.title = "随机种子（每次执行都不同，点击切换为固定）";
        btn.className = "hezl-rtxt-btn";
    }
}

// ============ 随机预计算 ============
// 复刻后端 execute() 的随机逻辑，基于当前 seed 预计算每个 🎲 开启项将选中的行，
// 使前端词组按钮显示与后端实际输出一致的结果。
// 注意：必须与 nodes.py 的 execute() 严格保持一致——
//   - 始终用 random.Random(seed)（后端已改为始终用 seed）
//   - 跳过 enabled=false 的项（不消耗 RNG 状态）
//   - random 项调用 rng.choice(lines)，非 random 项用 lines[selected_line]
//   - 合并模式下按钮不显示预计算（输出是 merge sample，非逐项）
// 返回：与 state.items 等长的数组，元素为 { line, lineIndex } 或 null（无法预计算）
function computePreviewLines(node) {
    const state = getState(node);
    const result = new Array(state.items.length).fill(null);

    // 合并模式下逐项无独立输出，不预计算
    if (state.merge_enabled) return result;

    // 复刻 rng = random.Random(seed)
    let rng;
    try {
        rng = new PyRandom(state.seed);
    } catch (e) {
        return result;
    }

    for (let i = 0; i < state.items.length; i++) {
        const item = state.items[i];
        // 跳过未启用项（与后端一致，不消耗 RNG）
        if (!item.enabled) continue;
        const lines = item.lines || [];
        if (lines.length === 0) continue;

        if (item.random) {
            // 复刻 rng.choice(lines)
            try {
                const idx = rng._randbelow(lines.length);
                result[i] = { line: lines[idx], lineIndex: idx };
            } catch (e) {
                // RNG 错误时跳过
            }
        } else {
            // 手动选择：不消耗 RNG
            let idx = item.selected_line || 0;
            if (idx < 0 || idx >= lines.length) idx = 0;
            result[i] = { line: lines[idx], lineIndex: idx };
        }
    }
    return result;
}

// ============ 右侧列表渲染 ============
function renderItems(node) {
    const state = getState(node);
    const container = node._hezl_items_el;
    if (!container) return;
    container.innerHTML = "";

    // 更新顶部按钮状态
    updateAllToggleBtn(node, node._hezl_all_toggle_btn);
    updateAllRandomBtn(node);

    if (state.items.length === 0) {
        container.innerHTML = '<div class="hezl-items-empty">在左侧勾选 txt 文件后点击"添加"</div>';
        return;
    }

    // 预计算 🎲 随机模式下每个项将输出的行（与后端 execute 一致）
    const previews = computePreviewLines(node);

    const frag = document.createDocumentFragment();
    state.items.forEach((item, index) => {
        // 外层包裹：序号在边框外
        const itemWrap = document.createElement("div");
        itemWrap.className = "hezl-rtxt-item-wrap";

        // 序号（在边框外，左侧）
        const indexEl = document.createElement("span");
        indexEl.className = "hezl-rtxt-item-index";
        indexEl.textContent = String(index + 1);
        indexEl.title = `输出顺序: ${index + 1}`;

        const row = document.createElement("div");
        let rowClass = "hezl-rtxt-item" + (item.enabled ? "" : " disabled");
        if (state.merge_enabled) rowClass += " merge-active";
        row.className = rowClass;
        row.draggable = true;
        row.dataset.index = index;

        // 拖拽手柄
        const handle = document.createElement("span");
        handle.className = "hezl-drag-handle";
        handle.textContent = "⋮⋮";

        // 开启/关闭按钮
        const toggleBtn = document.createElement("button");
        toggleBtn.className = "hezl-item-toggle" + (item.enabled ? " on" : "");
        toggleBtn.textContent = item.enabled ? "🟢" : "🔴";
        toggleBtn.title = "启用/禁用此词条输出";
        toggleBtn.addEventListener("click", () => {
            item.enabled = !item.enabled;
            toggleBtn.classList.toggle("on", item.enabled);
            toggleBtn.textContent = item.enabled ? "🟢" : "🔴";
            row.classList.toggle("disabled", !item.enabled);
            // 切换启用状态会改变 RNG 消耗顺序（禁用项不消耗 RNG），需重新预计算
            renderItems(node);
        });

        // 文件名
        const nameSpan = document.createElement("span");
        nameSpan.className = "hezl-item-name";
        nameSpan.textContent = item.name;
        nameSpan.title = item.path;

        const sep1 = document.createElement("span");
        sep1.className = "hezl-sep";
        sep1.textContent = "|";

        // 🎲/📌 随机模式按钮（🎲绿色底=随机开启，📌灰色底=随机关闭/固定）
        const diceBtn = document.createElement("button");
        diceBtn.className = "hezl-dice" + (item.random ? " active" : "");
        diceBtn.textContent = item.random ? "🎲" : "📌";
        diceBtn.title = item.random ? "随机模式已开启（点击固定当前选择）" : "随机模式已关闭（点击开启随机选取一行）";

        // 词组选择按钮（点击弹窗）- 有译文时显示译文，悬停显示原文
        // 🎲 开启时显示基于种子预计算的行（与后端 execute 输出一致），否则显示手动选择的行
        const lineBtn = document.createElement("button");
        // 📌 固定模式时词组按钮边框为红色，提示用户关注手动选择的行
        lineBtn.className = "hezl-item-line-btn" + (!item.random ? " random-active" : "");
        const preview = previews[index];
        // 生效行索引：🎲 开启且有预览时用预计算索引，否则用手动选择索引
        const effIdx = (item.random && preview) ? preview.lineIndex : (item.selected_line || 0);
        const hasEn = item.lines.length > 0 && effIdx < item.lines.length;
        const enLine = hasEn ? item.lines[effIdx] : "";
        const hasTr = item.tr_lines.length > 0 && effIdx < item.tr_lines.length
            && item.tr_lines[effIdx].trim() !== "";
        const trLine = hasTr ? item.tr_lines[effIdx] : "";
        const displayLine = trLine || enLine || "(空)";
        const displayText = displayLine.length > 35 ? displayLine.substring(0, 32) + "..." : displayLine;
        lineBtn.textContent = displayText;
        // 悬停显示完整内容：有译文时同时显示译文与原文，便于核对将输出的原文
        lineBtn.title = !hasEn ? "(空) - 点击选择词组"
            : (trLine ? `${trLine}\n${enLine}` : enLine);
        lineBtn.addEventListener("click", (e) => openLineModal(node, index, e.currentTarget));

        // 随机按钮点击：切换 🎲/📌 并重新渲染（切换会改变 RNG 消耗顺序，影响后续所有项的预览）
        diceBtn.addEventListener("click", () => {
            item.random = !item.random;
            diceBtn.classList.toggle("active", item.random);
            diceBtn.textContent = item.random ? "🎲" : "📌";
            // 📌 固定模式时词组按钮边框为红色
            lineBtn.classList.toggle("random-active", !item.random);
            diceBtn.title = item.random ? "随机模式已开启（点击固定当前选择）" : "随机模式已关闭（点击开启随机选取一行）";
            renderItems(node);
        });

        const sep2 = document.createElement("span");
        sep2.className = "hezl-sep";
        sep2.textContent = "|";

        // 自定义间隔符按钮（此 txt 输出与下一个 txt 输出之间的分隔符）
        const sepBtn = document.createElement("button");
        sepBtn.className = "hezl-item-sep-btn";
        sepBtn.textContent = "⁉️";
        const curSep = item.separator ?? ",";
        sepBtn.title = "自定义与下个txt之间的间隔符号\n当前: " + sepToDisplay(curSep)
            + (index === state.items.length - 1 ? "\n（这是最后一项，间隔符不会生效）" : "");
        sepBtn.addEventListener("click", (e) => openSeparatorModal(node, index, e.currentTarget));

        // 删除按钮
        const removeBtn = document.createElement("button");
        removeBtn.className = "hezl-item-remove";
        removeBtn.textContent = "×";
        removeBtn.title = "移除";
        removeBtn.addEventListener("click", () => {
            state.items.splice(index, 1);
            renderItems(node);
        });

        row.appendChild(handle);
        row.appendChild(toggleBtn);
        row.appendChild(sep1);
        row.appendChild(diceBtn);
        row.appendChild(sepBtn);
        row.appendChild(removeBtn);
        row.appendChild(sep2);
        row.appendChild(lineBtn);
        row.appendChild(nameSpan);

        // 拖拽排序
        setupItemDrag(row, node);

        // 右键菜单：定位文件
        row.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.stopPropagation();
            showItemContextMenu(node, item, e.clientX, e.clientY);
        });

        itemWrap.appendChild(indexEl);
        itemWrap.appendChild(row);
        frag.appendChild(itemWrap);
    });
    container.appendChild(frag);
}

// ============ 右侧txt文件框右键菜单 ============
let itemContextMenu = null;
function closeItemContextMenu() {
    if (itemContextMenu && itemContextMenu.parentNode) {
        itemContextMenu.parentNode.removeChild(itemContextMenu);
    }
    itemContextMenu = null;
    document.removeEventListener("mousedown", onItemCtxOutside, true);
    document.removeEventListener("keydown", onItemCtxEsc, true);
}
function onItemCtxOutside(e) {
    if (itemContextMenu && !itemContextMenu.contains(e.target)) closeItemContextMenu();
}
function onItemCtxEsc(e) {
    if (e.key === "Escape") closeItemContextMenu();
}
function showItemContextMenu(node, item, x, y) {
    closeItemContextMenu();
    const menu = document.createElement("div");
    menu.className = "hezl-ctx-menu";

    const locateItem = document.createElement("div");
    locateItem.className = "hezl-ctx-item";
    locateItem.textContent = "📍 定位文件";
    locateItem.addEventListener("click", () => {
        closeItemContextMenu();
        locateFileInTree(node, item.path);
    });
    menu.appendChild(locateItem);

    menu.style.left = x + "px";
    menu.style.top = y + "px";
    document.body.appendChild(menu);
    const r = menu.getBoundingClientRect();
    if (r.right > window.innerWidth - 4) menu.style.left = (window.innerWidth - r.width - 4) + "px";
    if (r.bottom > window.innerHeight - 4) menu.style.top = (window.innerHeight - r.height - 4) + "px";

    itemContextMenu = menu;
    setTimeout(() => {
        document.addEventListener("mousedown", onItemCtxOutside, true);
        document.addEventListener("keydown", onItemCtxEsc, true);
    }, 0);
}

// 在左侧目录树中定位指定路径的txt文件：展开所有父文件夹并滚动到该文件
function locateFileInTree(node, filePath) {
    const state = getState(node);
    if (!state.tree) return;
    // 将路径按 "/" 拆分，逐级展开父文件夹
    const parts = filePath.split("/");
    let currentPath = "";
    for (let i = 0; i < parts.length - 1; i++) {
        currentPath = currentPath ? currentPath + "/" + parts[i] : parts[i];
        state.treeExpanded[currentPath] = true;
    }
    // 清除搜索文本，确保文件可见
    state.searchText = "";
    // 重新渲染树
    renderTree(node);
    // 滚动到目标文件
    requestAnimationFrame(() => {
        const treeEl = node._hezl_tree_el;
        if (!treeEl) return;
        const rows = treeEl.querySelectorAll(".hezl-tree-row");
        for (const row of rows) {
            const nameEl = row.querySelector(".hezl-tree-name");
            if (nameEl && nameEl.title === filePath) {
                row.scrollIntoView({ block: "center" });
                // 高亮闪烁
                row.style.background = "rgba(106,204,153,0.4)";
                setTimeout(() => { row.style.background = ""; }, 1200);
                break;
            }
        }
    });
}

// ============ 拖拽排序 ============
function setupItemDrag(row, node) {
    row.addEventListener("dragstart", (e) => {
        row.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", row.dataset.index);
    });
    row.addEventListener("dragend", () => {
        row.classList.remove("dragging");
        // 清理所有 drag-over
        const container = node._hezl_items_el;
        if (container) {
            container.querySelectorAll(".drag-over").forEach(el => el.classList.remove("drag-over"));
        }
    });
    row.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        const dragging = node._hezl_items_el.querySelector(".dragging");
        if (dragging && dragging !== row) {
            row.classList.add("drag-over");
        }
    });
    row.addEventListener("dragleave", () => {
        row.classList.remove("drag-over");
    });
    row.addEventListener("drop", (e) => {
        e.preventDefault();
        row.classList.remove("drag-over");
        const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
        const toIndex = parseInt(row.dataset.index);
        if (isNaN(fromIndex) || isNaN(toIndex) || fromIndex === toIndex) return;
        const state = getState(node);
        const [moved] = state.items.splice(fromIndex, 1);
        state.items.splice(toIndex, 0, moved);
        renderItems(node);
    });
}

// ============ 词组选择弹窗 ============
let currentModal = null;
function openLineModal(node, itemIndex, btnEl) {
    closeLineModal();
    const state = getState(node);
    const item = state.items[itemIndex];
    if (!item) return;

    const overlay = document.createElement("div");
    overlay.className = "hezl-modal-overlay";

    const modal = document.createElement("div");
    modal.className = "hezl-modal";

    // 头部
    const header = document.createElement("div");
    header.className = "hezl-modal-header";

    const title = document.createElement("span");
    title.style.flex = "1";
    title.textContent = item.name + " - 选择词组"
        + ((item.tr_lines || []).length > 0 ? "（译文显示/原文输出）" : "");

    const closeBtn = document.createElement("button");
    closeBtn.className = "hezl-modal-close";
    closeBtn.textContent = "×";
    closeBtn.title = "关闭";

    header.appendChild(title);
    header.appendChild(closeBtn);

    // 搜索栏
    const searchWrap = document.createElement("div");
    searchWrap.style.padding = "6px 10px";
    searchWrap.style.borderBottom = "1px solid var(--border-color, #444)";
    searchWrap.style.display = "flex";
    searchWrap.style.gap = "4px";
    searchWrap.style.alignItems = "center";

    // 🌏️ 原文/译文切换按钮（默认显示译文，切换后显示原文）
    const hasTr = (item.tr_lines || []).some(l => l.trim());
    let showOriginal = false; // false=显示译文(.tr), true=显示原文(.txt)
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "hezl-rtxt-btn";
    toggleBtn.textContent = "🌏️";
    toggleBtn.title = hasTr ? "当前显示译文，点击切换为原文" : "无译文文件";
    toggleBtn.style.flexShrink = "0";
    if (!hasTr) toggleBtn.style.opacity = "0.4";
    toggleBtn.disabled = !hasTr;
    toggleBtn.addEventListener("click", () => {
        showOriginal = !showOriginal;
        toggleBtn.title = showOriginal ? "当前显示原文，点击切换为译文" : "当前显示译文，点击切换为原文";
        toggleBtn.classList.toggle("all-on", showOriginal);
        renderList(searchInput.value);
    });

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.className = "hezl-modal-search";
    searchInput.placeholder = "搜索词组...";
    searchWrap.appendChild(toggleBtn);
    searchWrap.appendChild(searchInput);

    // 列表
    const listEl = document.createElement("div");
    listEl.className = "hezl-modal-list";

    modal.appendChild(header);
    modal.appendChild(searchWrap);
    modal.appendChild(listEl);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    currentModal = overlay;

    const MAX_RENDER = 2000;
    function renderList(filter) {
        listEl.innerHTML = "";
        const q = (filter || "").toLowerCase();
        const lines = item.lines || [];
        const trLines = item.tr_lines || [];
        const frag = document.createDocumentFragment();
        let count = 0;
        let total = 0;
        let selectedEl = null;
        for (let i = 0; i < lines.length; i++) {
            const en = lines[i];
            const tr = (i < trLines.length) ? trLines[i] : "";
            const trTrim = tr.trim();
            // 主显示：🌏️切换控制 — 默认显示译文，切换后显示原文；无译文时始终显示原文
            const mainText = showOriginal ? en : (trTrim || en);
            // 搜索：译文与原文都参与匹配
            if (q && !en.toLowerCase().includes(q) && !tr.toLowerCase().includes(q)) continue;
            total++;
            if (count >= MAX_RENDER) continue;
            const itemEl = document.createElement("div");
            const isSel = (i === item.selected_line);
            itemEl.className = "hezl-modal-item" + (isSel ? " selected" : "");
            if (isSel) selectedEl = itemEl;
            itemEl.textContent = mainText;
            // 悬停显示译文与原文，便于核对将输出的原文
            itemEl.title = trTrim ? `${tr}\n${en}` : en;
            const idx = i;
            itemEl.addEventListener("click", () => {
                item.selected_line = idx;
                closeLineModal();
                renderItems(node);
            });
            frag.appendChild(itemEl);
            count++;
        }
        if (total === 0) {
            listEl.innerHTML = '<div class="hezl-modal-empty">未找到匹配词组</div>';
            return;
        }
        listEl.appendChild(frag);
        if (total > MAX_RENDER) {
            const note = document.createElement("div");
            note.className = "hezl-modal-empty";
            note.textContent = `仅显示前 ${MAX_RENDER} 条（共 ${total} 条），请细化搜索`;
            listEl.appendChild(note);
        }
        if (selectedEl) {
            listEl.scrollTop = Math.max(0, selectedEl.offsetTop - listEl.clientHeight / 2 + selectedEl.offsetHeight / 2);
        } else {
            listEl.scrollTop = 0;
        }
    }

    renderList("");
    // 渲染列表后再定位弹窗，确保使用真实高度
    positionModal(modal, btnEl);

    // 搜索防抖，避免大量词组时输入卡顿
    let searchTimer = null;
    searchInput.addEventListener("input", () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => renderList(searchInput.value), 150);
    });
    closeBtn.addEventListener("click", closeLineModal);
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeLineModal();
    });
    searchInput.focus();
}

// 将弹窗定位到触发按钮附近（用户当前浏览区域中心）
function positionModal(modal, btnEl) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const mw = modal.offsetWidth;
    const mh = modal.offsetHeight;
    let left, top;
    if (btnEl && btnEl.getBoundingClientRect) {
        const r = btnEl.getBoundingClientRect();
        left = r.left + r.width / 2 - mw / 2;
        top = r.top + r.height / 2 - mh / 2;
    } else {
        left = (vw - mw) / 2;
        top = (vh - mh) / 2;
    }
    left = Math.max(8, Math.min(vw - mw - 8, left));
    top = Math.max(8, Math.min(vh - mh - 8, top));
    modal.style.left = left + "px";
    modal.style.top = top + "px";
}

function closeLineModal() {
    if (currentModal) {
        currentModal.remove();
        currentModal = null;
    }
}

// ============ 间隔符弹窗 ============
// 真实分隔符 <-> 输入框显示文本：把不可见的 \n \t 转义为可见字符
function sepToDisplay(sep) {
    if (sep === "") return "(空)";
    return sep.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/\t/g, "\\t").replace(/\r/g, "\\r");
}
function displayToSep(text) {
    // 反转义：将 \n \t \r \\ 还原为真实字符
    let out = "";
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === "\\" && i + 1 < text.length) {
            const next = text[i + 1];
            if (next === "n") { out += "\n"; i++; continue; }
            if (next === "t") { out += "\t"; i++; continue; }
            if (next === "r") { out += "\r"; i++; continue; }
            if (next === "\\") { out += "\\"; i++; continue; }
        }
        out += ch;
    }
    return out;
}

function openSeparatorModal(node, itemIndex, btnEl) {
    closeLineModal();
    const state = getState(node);
    const item = state.items[itemIndex];
    if (!item) return;

    const overlay = document.createElement("div");
    overlay.className = "hezl-modal-overlay";

    const modal = document.createElement("div");
    modal.className = "hezl-modal hezl-sep-modal";

    // 头部
    const header = document.createElement("div");
    header.className = "hezl-modal-header";
    const title = document.createElement("span");
    title.style.flex = "1";
    title.textContent = `间隔符号 - ${item.name}`;
    const closeBtn = document.createElement("button");
    closeBtn.className = "hezl-modal-close";
    closeBtn.textContent = "×";
    closeBtn.title = "关闭";
    header.appendChild(title);
    header.appendChild(closeBtn);

    // 主体
    const body = document.createElement("div");
    body.className = "hezl-sep-body";

    const hint = document.createElement("div");
    hint.className = "hezl-sep-hint";
    hint.textContent = "此 txt 输出与下一个 txt 输出之间的间隔符号。可用 \\n 表示换行，\\t 表示制表符。";

    const inputWrap = document.createElement("div");
    inputWrap.className = "hezl-sep-input-wrap";
    const input = document.createElement("input");
    input.type = "text";
    input.className = "hezl-sep-input";
    input.value = sepToDisplay(item.separator ?? ",");
    input.placeholder = "如: , 或 ,  或 、 或 \\n";
    inputWrap.appendChild(input);

    // 快捷选项
    const quick = document.createElement("div");
    quick.className = "hezl-sep-quick";
    const quickOptions = [
        { label: ",（逗号）", value: "," },
        { label: ", （逗号空格）", value: ", " },
        { label: "、（顿号）", value: "、" },
        { label: " （空格）", value: " " },
        { label: "\\n（换行）", value: "\n" },
        { label: " | ", value: " | " },
        { label: "清空（无间隔）", value: "" },
    ];
    for (const opt of quickOptions) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "hezl-rtxt-btn hezl-sep-quick-btn";
        b.textContent = opt.label;
        b.addEventListener("click", () => {
            input.value = sepToDisplay(opt.value);
            input.focus();
        });
        quick.appendChild(b);
    }

    // 操作按钮
    const actions = document.createElement("div");
    actions.className = "hezl-sep-actions";
    const okBtn = document.createElement("button");
    okBtn.type = "button";
    okBtn.className = "hezl-rtxt-btn primary";
    okBtn.textContent = "确定";
    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "hezl-rtxt-btn";
    cancelBtn.textContent = "取消";
    actions.appendChild(okBtn);
    actions.appendChild(cancelBtn);

    body.appendChild(hint);
    body.appendChild(inputWrap);
    body.appendChild(quick);
    body.appendChild(actions);

    modal.appendChild(header);
    modal.appendChild(body);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    currentModal = overlay;

    function commit() {
        item.separator = displayToSep(input.value);
        closeLineModal();
        renderItems(node);
    }
    okBtn.addEventListener("click", commit);
    cancelBtn.addEventListener("click", closeLineModal);
    closeBtn.addEventListener("click", closeLineModal);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); commit(); }
        else if (e.key === "Escape") { e.preventDefault(); closeLineModal(); }
    });
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeLineModal();
    });

    // 定位（基于真实高度）
    positionModal(modal, btnEl);
    input.focus();
    input.select();
}

// ============ 预设管理 ============
async function refreshPresets(node) {
    const state = getState(node);
    const select = node._hezl_preset_select;
    if (!select) return;
    try { state.presets = await fetchPresets(); } catch (e) { state.presets = []; }
    select.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "— 选择预设 —";
    select.appendChild(placeholder);
    for (const p of state.presets) {
        const opt = document.createElement("option");
        opt.value = p;
        opt.textContent = p;
        if (p === state.currentPreset) opt.selected = true;
        select.appendChild(opt);
    }
}

async function onPresetChange(node) {
    const state = getState(node);
    const select = node._hezl_preset_select;
    const name = select.value;
    if (!name) { state.currentPreset = ""; return; }
    try {
        const resp = await loadPresetAPI(name);
        if (resp.data) {
            await restoreState(node, resp.data);
            state.currentPreset = name;
        }
    } catch (e) { console.error("加载预设失败:", e); }
}

async function onSavePreset(node) {
    const state = getState(node);
    const name = prompt("请输入预设名称:", state.currentPreset || "");
    if (!name) return;
    try {
        const resp = await savePresetAPI(name, serializeState(node));
        if (resp.ok) {
            state.currentPreset = resp.name || name;
            await refreshPresets(node);
        } else { alert("保存失败: " + (resp.error || "未知错误")); }
    } catch (e) { alert("保存失败: " + e.message); }
}

async function onRenamePreset(node) {
    const state = getState(node);
    if (!state.currentPreset) { alert("请先选择一个预设"); return; }
    const newName = prompt("请输入新的预设名称:", state.currentPreset);
    if (!newName || newName === state.currentPreset) return;
    try {
        const resp = await renamePresetAPI(state.currentPreset, newName);
        if (resp.ok) { state.currentPreset = resp.name || newName; await refreshPresets(node); }
        else { alert("重命名失败: " + (resp.error || "未知错误")); }
    } catch (e) { alert("重命名失败: " + e.message); }
}

async function onDeletePreset(node) {
    const state = getState(node);
    if (!state.currentPreset) { alert("请先选择一个预设"); return; }
    if (!confirm(`确定要删除预设 "${state.currentPreset}" 吗？`)) return;
    try {
        const resp = await deletePresetAPI(state.currentPreset);
        if (resp.ok) { state.currentPreset = ""; await refreshPresets(node); }
        else { alert("删除失败: " + (resp.error || "未知错误")); }
    } catch (e) { alert("删除失败: " + e.message); }
}

// ============ 拖拽调整左栏宽度 ============
function setupResizer(node, leftPanel, resizer) {
    resizer.addEventListener("mousedown", function (e) {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = leftPanel.offsetWidth;
        resizer.classList.add("dragging");
        function onMove(ev) {
            const newWidth = Math.max(120, Math.min(500, startWidth + (ev.clientX - startX)));
            leftPanel.style.width = newWidth + "px";
            getState(node).leftWidth = newWidth;
        }
        function onUp() {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
            resizer.classList.remove("dragging");
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        }
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    });
}

// ============ 构建 UI ============
function buildUI(node) {
    const state = getState(node);
    injectCSS();
    node.size = [820, 540];

    // 移除默认的 config 文本控件
    for (let i = node.widgets.length - 1; i >= 0; i--) {
        if (node.widgets[i].name === "config") node.widgets.splice(i, 1);
    }

    const container = document.createElement("div");
    container.className = "hezl-rtxt-container";

    // ===== 左侧面板 =====
    const leftPanel = document.createElement("div");
    leftPanel.className = "hezl-rtxt-left";
    leftPanel.style.width = state.leftWidth + "px";

    // 顶部工具栏：搜索 + 按钮
    const leftToolbar = document.createElement("div");
    leftToolbar.className = "hezl-rtxt-left-toolbar";

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.className = "hezl-rtxt-search";
    searchInput.placeholder = "搜索文件名...";
    searchInput.addEventListener("input", () => {
        state.searchText = searchInput.value;
        renderTree(node);
    });

    const btnRow = document.createElement("div");
    btnRow.className = "hezl-rtxt-btn-row";

    const refreshBtn = document.createElement("button");
    refreshBtn.className = "hezl-rtxt-btn";
    refreshBtn.textContent = "🔄";
    refreshBtn.title = "刷新目录树（重新读取SaveTXT文件夹）";
    refreshBtn.addEventListener("click", async () => {
        refreshBtn.textContent = "...";
        refreshBtn.disabled = true;
        try {
            state.tree = await fetchTree();
        } catch (e) {
            console.error("刷新目录树失败:", e);
            state.tree = [];
        }
        renderTree(node);
        refreshBtn.textContent = "🔄";
        refreshBtn.disabled = false;
    });

    const expandBtn = document.createElement("button");
    expandBtn.className = "hezl-rtxt-btn";
    expandBtn.textContent = "⏬️";
    expandBtn.title = "展开全部文件夹";
    expandBtn.addEventListener("click", () => expandAllFolders(node));

    const collapseBtn = document.createElement("button");
    collapseBtn.className = "hezl-rtxt-btn";
    collapseBtn.textContent = "⏏️";
    collapseBtn.title = "收起全部文件夹";
    collapseBtn.addEventListener("click", () => collapseAllFolders(node));

    const selectAllBtn = document.createElement("button");
    selectAllBtn.className = "hezl-rtxt-btn";
    selectAllBtn.textContent = "✅️";
    selectAllBtn.title = "全选/取消全选当前可见的txt文件";
    selectAllBtn.addEventListener("click", () => {
        toggleSelectAll(node);
        updateSelectAllBtn(node);
    });
    node._hezl_select_all_btn = selectAllBtn;

    const addBtn = document.createElement("button");
    addBtn.className = "hezl-rtxt-btn primary";
    addBtn.textContent = "📄👉️";
    addBtn.title = "将勾选的txt文件添加到右侧";
    addBtn.addEventListener("click", () => addSelectedFiles(node));

    btnRow.appendChild(refreshBtn);
    btnRow.appendChild(expandBtn);
    btnRow.appendChild(collapseBtn);
    btnRow.appendChild(selectAllBtn);
    btnRow.appendChild(addBtn);
    leftToolbar.appendChild(searchInput);
    leftToolbar.appendChild(btnRow);
    leftPanel.appendChild(leftToolbar);

    const treeEl = document.createElement("div");
    treeEl.className = "hezl-rtxt-tree";
    treeEl.textContent = "加载中...";
    leftPanel.appendChild(treeEl);
    node._hezl_tree_el = treeEl;

    // 分隔条
    const resizer = document.createElement("div");
    resizer.className = "hezl-rtxt-resizer";
    setupResizer(node, leftPanel, resizer);

    // ===== 右侧面板 =====
    const rightPanel = document.createElement("div");
    rightPanel.className = "hezl-rtxt-right";

    const toolbar = document.createElement("div");
    toolbar.className = "hezl-rtxt-toolbar";

    const presetSelect = document.createElement("select");
    presetSelect.className = "hezl-rtxt-preset-select";
    presetSelect.innerHTML = '<option value="">— 选择预设 —</option>';
    presetSelect.addEventListener("change", () => onPresetChange(node));
    node._hezl_preset_select = presetSelect;

    const saveBtn = document.createElement("button");
    saveBtn.className = "hezl-rtxt-btn";
    saveBtn.textContent = "📥️";
    saveBtn.title = "保存预设";
    saveBtn.addEventListener("click", () => onSavePreset(node));

    const renameBtn = document.createElement("button");
    renameBtn.className = "hezl-rtxt-btn";
    renameBtn.textContent = "✏️";
    renameBtn.title = "重命名预设";
    renameBtn.addEventListener("click", () => onRenamePreset(node));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "hezl-rtxt-btn";
    deleteBtn.textContent = "🗑️";
    deleteBtn.title = "删除预设";
    deleteBtn.addEventListener("click", () => onDeletePreset(node));

    const allToggleBtn = document.createElement("button");
    allToggleBtn.className = "hezl-rtxt-btn all-off";
    allToggleBtn.textContent = "🟢";
    allToggleBtn.title = "开启/关闭所有txt文件输出";
    allToggleBtn.addEventListener("click", () => toggleAllItems(node, allToggleBtn));
    node._hezl_all_toggle_btn = allToggleBtn;

    const allRandomBtn = document.createElement("button");
    allRandomBtn.className = "hezl-rtxt-btn all-on";
    allRandomBtn.textContent = "🎲";
    allRandomBtn.title = "开启全部随机";
    allRandomBtn.addEventListener("click", () => toggleAllRandom(node, allRandomBtn));
    node._hezl_all_random_btn = allRandomBtn;

    const removeAllBtn = document.createElement("button");
    removeAllBtn.className = "hezl-rtxt-btn all-off";
    removeAllBtn.textContent = "👈️📄";
    removeAllBtn.title = "移除右侧全部txt文件";
    removeAllBtn.addEventListener("click", () => removeAllItems(node));

    // ====== 合并随机输出控件 ======
    const mergeBtn = document.createElement("button");
    mergeBtn.className = "hezl-rtxt-btn";
    mergeBtn.textContent = "🗳️";
    mergeBtn.title = "开启/关闭 合并随机输出词组";
    mergeBtn.addEventListener("click", () => {
        state.merge_enabled = !state.merge_enabled;
        updateMergeBtn(node);
        renderItems(node);
    });
    node._hezl_merge_btn = mergeBtn;

    const mergeCountInput = document.createElement("input");
    mergeCountInput.type = "number";
    mergeCountInput.className = "hezl-rtxt-num-input";
    mergeCountInput.min = "1";
    mergeCountInput.value = state.merge_count;
    mergeCountInput.title = "合并随机输出的词组数量";
    mergeCountInput.addEventListener("input", () => {
        const v = parseInt(mergeCountInput.value) || 1;
        state.merge_count = Math.max(1, v);
    });

    // 数量输入框右侧的上下微调按钮
    const spinUp = document.createElement("button");
    spinUp.className = "hezl-spinner-btn up";
    spinUp.textContent = "▲";
    spinUp.title = "增加数量";
    spinUp.addEventListener("click", () => {
        const v = Math.max(1, (parseInt(mergeCountInput.value) || 1) + 1);
        mergeCountInput.value = v;
        state.merge_count = v;
    });
    const spinDown = document.createElement("button");
    spinDown.className = "hezl-spinner-btn down";
    spinDown.textContent = "▼";
    spinDown.title = "减少数量";
    spinDown.addEventListener("click", () => {
        const v = Math.max(1, (parseInt(mergeCountInput.value) || 1) - 1);
        mergeCountInput.value = v;
        state.merge_count = v;
    });
    const spinnerBtns = document.createElement("div");
    spinnerBtns.className = "hezl-spinner-btns";
    spinnerBtns.appendChild(spinUp);
    spinnerBtns.appendChild(spinDown);

    // 将 🗳️ + 数量输入框 + 微调按钮 组合成一个整体（无内部间隙）
    const mergeGroup = document.createElement("div");
    mergeGroup.className = "hezl-merge-group";
    mergeGroup.appendChild(mergeBtn);
    mergeGroup.appendChild(mergeCountInput);
    mergeGroup.appendChild(spinnerBtns);

    // ====== 种子控件 ======
    const seedBtn = document.createElement("button");
    seedBtn.className = "hezl-rtxt-btn";
    seedBtn.textContent = "🔀";
    seedBtn.title = "随机种子（每次执行都不同）";
    seedBtn.addEventListener("click", () => {
        state.seed_mode = state.seed_mode === "fixed" ? "random" : "fixed";
        updateSeedBtn(node);
    });
    node._hezl_seed_btn = seedBtn;

    const seedInput = document.createElement("input");
    seedInput.type = "text";
    seedInput.className = "hezl-rtxt-num-input hezl-rtxt-seed-input";
    seedInput.value = state.seed;
    seedInput.title = "种子值（固定模式时相同种子输出相同结果）";
    seedInput.addEventListener("input", () => {
        const v = parseInt(seedInput.value) || 0;
        state.seed = Math.max(0, v);
        // 种子变化会改变 🎲 随机预览，需重新渲染词组按钮
        renderItems(node);
    });
    node._hezl_seed_input = seedInput;

    // ====== 🛎️ 生成随机种子按钮 ======
    // 点击后：生成新随机种子填入种子输入框、切换为"⏸️ 固定模式"、刷新所有 🎲 预览。
    // 这样种子值、按钮预览与后端 execute() 实际输出三者完全一致，便于复现。
    const genSeedBtn = document.createElement("button");
    genSeedBtn.className = "hezl-rtxt-btn";
    genSeedBtn.textContent = "🛎️";
    genSeedBtn.title = "生成随机种子（填入新种子、切换为固定模式、刷新所有词组预览）";
    genSeedBtn.addEventListener("click", () => {
        state.seed = Math.floor(Math.random() * 1000000000);
        state.seed_mode = "fixed";
        if (node._hezl_seed_input) node._hezl_seed_input.value = state.seed;
        updateSeedBtn(node);
        // 种子已变化，刷新 🎲 预览使其与 execute() 实际输出一致
        renderItems(node);
    });
    node._hezl_gen_seed_btn = genSeedBtn;

    // 初始化按钮状态
    updateMergeBtn(node);
    updateSeedBtn(node);

    // 顶部分两行：第一行=预设管理，第二行=批量操作+合并+种子
    const toolbarRow1 = document.createElement("div");
    toolbarRow1.className = "hezl-rtxt-toolbar-row";
    const presetGroup = document.createElement("div");
    presetGroup.className = "hezl-rtxt-toolbar-group";
    presetGroup.appendChild(presetSelect);
    presetGroup.appendChild(saveBtn);
    presetGroup.appendChild(renameBtn);
    presetGroup.appendChild(deleteBtn);
    toolbarRow1.appendChild(presetGroup);

    const toolbarRow2 = document.createElement("div");
    toolbarRow2.className = "hezl-rtxt-toolbar-row";
    // 第一组：批量操作按钮
    const batchGroup = document.createElement("div");
    batchGroup.className = "hezl-rtxt-toolbar-group";
    batchGroup.appendChild(removeAllBtn);
    batchGroup.appendChild(allToggleBtn);
    batchGroup.appendChild(allRandomBtn);
    toolbarRow2.appendChild(batchGroup);
    // 第二组：🗳️ + 数量输入框 + 微调按钮
    toolbarRow2.appendChild(mergeGroup);
    // 第三组：种子控件
    const seedGroup = document.createElement("div");
    seedGroup.className = "hezl-rtxt-toolbar-group";
    seedGroup.appendChild(genSeedBtn);
    seedGroup.appendChild(seedBtn);
    seedGroup.appendChild(seedInput);
    toolbarRow2.appendChild(seedGroup);

    toolbar.appendChild(toolbarRow1);
    toolbar.appendChild(toolbarRow2);
    rightPanel.appendChild(toolbar);

    const itemsEl = document.createElement("div");
    itemsEl.className = "hezl-rtxt-items";
    rightPanel.appendChild(itemsEl);
    node._hezl_items_el = itemsEl;

    container.appendChild(leftPanel);
    container.appendChild(resizer);
    container.appendChild(rightPanel);

    // DOM 控件
    const widget = node.addDOMWidget("config", "custom", container, {
        getValue: () => serializeConfigStr(node),
        setValue: (v) => {
            if (node._hezl_restored) return;
            if (typeof v === "string" && v && v !== "{}") {
                node._hezl_restored = true;
                try { restoreState(node, JSON.parse(v)); } catch (e) { console.error("恢复状态失败:", e); }
            }
        },
    });
    widget.serializeValue = function () { return serializeConfigStr(node); };
    widget.options = widget.options || {};

    // ====== 跨前端兼容方案（旧前端 + Nodes 2.0）======
    // 核心原理：min=max=getHeight=动态值，widget 高度锁定在 node._widgetHeight
    // - 旧前端：getHeight() 返回值作为 widget 高度
    // - Nodes 2.0：getMinHeight()=getMaxHeight() 使 widget 高度固定，无反馈循环
    // - onResize 同步 _widgetHeight = node.size[1] - 偏移量，跟随用户拖拽
    const WIDGET_OFFSET = 50; // 标题栏 + 内边距偏移
    node._widgetHeight = Math.max(300, (node.size?.[1] || 540) - WIDGET_OFFSET);

    widget.options.getMinHeight = function () { return node._widgetHeight; };
    widget.options.getMaxHeight = function () { return node._widgetHeight; };
    widget.options.getHeight   = function () { return node._widgetHeight; };

    node.resizable = true;

    // 容器用 CSS height:100% 填充父级（前端通过 getter 设置 wrapper 确定高度）
    container.style.width = "100%";

    // 初始化加载
    (async () => {
        try { state.tree = await fetchTree(); } catch (e) { state.tree = []; console.error("加载目录树失败:", e); }
        renderTree(node);
        renderItems(node);
        await refreshPresets(node);
    })();

    return widget;
}

// ============ 扩展注册 ============
app.registerExtension({
    name: EXTENSION_NAME,

    async init() {
        // 拦截 queuePrompt：在随机种子模式下，每次执行前生成新种子并显示在输入框
        // 这样 PNG 元数据中保存的 config 会包含本次使用的种子，拖放图片复现时种子一致
        // 同时刷新词组按钮预览，使预览与本次实际输出一致
        const origQueuePrompt = app.queuePrompt;
        app.queuePrompt = function (...args) {
            try {
                const graph = app.graph || window.graph;
                if (graph && graph._nodes) {
                    for (const n of graph._nodes) {
                        if (n.type === NODE_NAME) {
                            const st = getState(n);
                            if (st.seed_mode === "random") {
                                st.seed = Math.floor(Math.random() * 1000000000);
                                if (n._hezl_seed_input) n._hezl_seed_input.value = st.seed;
                                // 种子已更新，刷新 🎲 预览使其与本次执行输出一致
                                renderItems(n);
                            }
                        }
                    }
                }
            } catch (e) { console.error("HezlRandomTXT: 更新随机种子失败", e); }
            return origQueuePrompt.apply(this, args);
        };
    },

    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name !== NODE_NAME) return;

        const origOnCreated = nodeType.prototype.onNodeCreated;
        nodeType.prototype.onNodeCreated = function () {
            origOnCreated?.apply(this, arguments);
            buildUI(this);
        };

        const origOnConfigure = nodeType.prototype.onConfigure;
        nodeType.prototype.onConfigure = function (info) {
            origOnConfigure?.apply(this, arguments);
            if (this._hezl_restored) return;
            const configWidget = this.widgets?.find(w => w.name === "config");
            if (configWidget && configWidget.value) {
                const v = configWidget.value;
                if (typeof v === "string" && v && v !== "{}") {
                    this._hezl_restored = true;
                    try { restoreState(this, JSON.parse(v)); } catch (e) { console.error("恢复状态失败:", e); }
                }
            }
        };

        // 节点拖拽时同步 _widgetHeight，使 widget 高度跟随节点变化
        const origOnResize = nodeType.prototype.onResize;
        nodeType.prototype.onResize = function () {
            origOnResize?.apply(this, arguments);
            if (this._widgetHeight !== undefined) {
                this._widgetHeight = Math.max(300, (this.size?.[1] || 540) - 50);
                this.graph?.setDirtyCanvas(true, true);
            }
        };
    },
});
