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

/* ===== 右侧分组框（用边框区分不同分组，无折叠，可拖拽排序）===== */
.hezl-group {
    border: 1px solid var(--border-color, #555);
    border-radius: 6px;
    margin-bottom: 6px;
    background: var(--comfy-input-bg, #2a2a2a);
    overflow: hidden;
    transition: border-color 0.15s, box-shadow 0.15s;
}
.hezl-group.dragging { opacity: 0.4; }
.hezl-group.group-drag-over { border-color: #6c9; box-shadow: 0 0 0 2px rgba(106,204,153,0.3); }
.hezl-group-header {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 3px 5px;
    background: var(--comfy-menu-bg, #1e1e1e);
    border-bottom: 1px solid var(--border-color, #444);
    flex-wrap: wrap;
}
/* 拖拽手柄（拖动改变分组顺序）*/
.hezl-group-handle {
    cursor: grab;
    color: #666;
    user-select: none;
    flex-shrink: 0;
    padding: 0 2px;
    font-size: 14px;
    line-height: 1;
}
.hezl-group-handle:hover { color: #6c9; }
.hezl-group-handle:active { cursor: grabbing; }
/* 分组名 + ✏️ 重命名按钮容器（左侧一组，margin-right:auto 与右侧按钮隔开）*/
.hezl-group-name-wrap {
    display: flex;
    align-items: center;
    gap: 2px;
    flex: 0 1 auto;      /* 名字占据动态宽度，可收缩 */
    min-width: 40px;
    margin-right: auto;  /* 推到左侧，与右侧工具栏按钮隔开 */
}
.hezl-group-name {
    font-weight: bold;
    color: #eee;
    cursor: pointer;
    padding: 0 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
}
.hezl-group-name:hover { color: #6c9; }
.hezl-group-rename-btn {
    border: none;
    background: transparent;
    color: #888;
    cursor: pointer;
    font-size: 11px;
    padding: 1px 3px;
    line-height: 1;
    flex-shrink: 0;
    border-radius: 3px;
}
.hezl-group-rename-btn:hover { color: #6c9; background: rgba(106,204,153,0.15); }
.hezl-group-toolbar {
    display: flex;
    gap: 4px;
    align-items: center;
    flex-wrap: wrap;
    flex-shrink: 0;
}
.hezl-group-body {
    padding: 4px;
    min-height: 30px;
    max-height: 50vh;
    overflow: auto;
}
/* item 拖拽时 body 可放置高亮（拖到空白区域追加到末尾）*/
.hezl-group-body.body-drag-over {
    background: rgba(106,204,153,0.12);
}
/* 分组框底部虚线 +分组 按钮 */
.hezl-add-group-btn {
    border: 2px dashed var(--border-color, #555);
    border-radius: 6px;
    background: transparent;
    color: var(--input-text, #ddd);
    padding: 8px;
    text-align: center;
    cursor: pointer;
    font-size: 13px;
    margin-bottom: 6px;
    width: 100%;
    box-sizing: border-box;
}
.hezl-add-group-btn:hover {
    border-color: #6c9;
    background: rgba(106,204,153,0.1);
    color: #6c9;
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
.hezl-dice.dice-active {
    opacity: 1;
    background: #4a8;
    border-color: #6c9;
}
.hezl-dice.dice-fixed {
    opacity: 1;
    background: #844;
    border-color: #c66;
    color: #fff;
}
.hezl-dice:hover { opacity: 0.85; }
.hezl-dice.dice-active:hover { opacity: 1; }
.hezl-item-line-btn {
    width: 100px;
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

/* ===== 轻量下拉小弹窗（锚定到触发元素）===== */
.hezl-popover {
    position: fixed;
    background: #2a2a2a;
    border: 1px solid #555;
    border-radius: 6px;
    padding: 10px;
    z-index: 10001;
    box-shadow: 0 6px 20px rgba(0,0,0,0.6);
    min-width: 200px;
    max-width: 340px;
    max-height: 70vh;
    overflow-y: auto;
    color: #ddd;
    font-size: 13px;
}
.hezl-popover-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-weight: bold;
    color: #eee;
    cursor: grab;
    user-select: none;
}
.hezl-popover-header.dragging { cursor: grabbing; }
.hezl-popover-close {
    background: none;
    border: none;
    color: #aaa;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    padding: 0 4px;
}
.hezl-popover-close:hover { color: #fff; }
.hezl-popover-toolbar {
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
}
.hezl-popover-actions {
    display: flex;
    gap: 6px;
    margin-top: 10px;
    justify-content: flex-end;
}
.hezl-popover .hezl-form-input,
.hezl-popover .hezl-form-textarea { box-sizing: border-box; }
.hezl-popover .hezl-form-textarea { width: 100%; min-height: 64px; resize: vertical; }

/* 弹窗内搜索框 */
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
/* 弹窗内列表项 */
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
/* 词组选择弹窗内的列表滚动区（独立滚动，保持头部与搜索框固定） */
.hezl-popover-list {
    max-height: 50vh;
    overflow-y: auto;
    padding: 2px;
}

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

/* 间隔符弹窗内容（容器由 .hezl-popover 提供） */
.hezl-sep-hint {
    color: #999;
    font-size: 11px;
    line-height: 1.5;
    margin-bottom: 8px;
}
.hezl-sep-input-wrap { width: 100%; box-sizing: border-box; margin-bottom: 8px; }
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
    margin-bottom: 4px;
}
.hezl-sep-quick-btn { font-size: 11px; padding: 2px 6px; }
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

// 创建一个新分组对象（每组独立 seed/合并/批量/分隔符）
function createGroup(name) {
    return {
        name: name || "分组",
        seed: 0,
        seed_mode: "random",    // "random"=每次随机, "fixed"=固定种子
        merge_enabled: false,   // 本组合并随机输出开关
        merge_count: 1,         // 本组合并随机输出数量
        separator: ", ",        // 本组输出与下一组输出之间的分隔符
        collapsed: false,       // 前端折叠状态
        items: [],              // {path, name, enabled, random, selected_line, separator, lines, tr_lines}
    };
}

function getState(node) {
    if (!nodeStates.has(node)) {
        nodeStates.set(node, {
            groups: [createGroup("默认分组")],  // 多分组结构，每组独立 seed/merge/items
            tree: null,
            presets: [],
            currentPreset: "",
            leftWidth: 240,
            treeExpanded: {},  // path -> bool
            treeSelected: {},  // path -> bool (txt文件)
            treeShiftSelected: {}, // path -> bool (shift多选临时高亮)
            lastSelectedPath: null, // 上次选中的txt路径（用于shift范围选）
            searchText: "",
            lastAddGroup: 0,    // 记住上次添加 txt 的目标分组索引
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
        groups: state.groups.map(g => ({
            name: g.name,
            seed: g.seed,
            seed_mode: g.seed_mode,
            merge_enabled: g.merge_enabled,
            merge_count: g.merge_count,
            separator: g.separator ?? ", ",
            items: g.items.map(it => ({
                path: it.path,
                name: it.name,
                enabled: it.enabled,
                random: it.random,
                selected_line: it.selected_line,
                separator: it.separator ?? ",",
            })),
        })),
    };
}
function serializeConfigStr(node) {
    return JSON.stringify(serializeState(node));
}

async function restoreState(node, stateObj) {
    const state = getState(node);
    // 注意：不能在此处清空 state.groups。restoreState 是 async（含 await fetchFile），
    // 若先清空，buildUI 的 IIFE 中 renderGroups 会在异步等待期间看到空数组并误添"默认分组"。
    // 改为先在本地 newGroups 中构建完整分组，所有 fetchFile 完成后原子赋值给 state.groups。
    // 旧格式兼容：顶层有 items 无 groups → 包装成单个默认分组
    let groupsData;
    if (stateObj && stateObj.items && !stateObj.groups) {
        groupsData = [{
            name: "默认分组",
            seed: stateObj.seed || 0,
            seed_mode: stateObj.seed_mode || "random",
            merge_enabled: !!(stateObj.merge_enabled),
            merge_count: stateObj.merge_count || 1,
            separator: ", ",
            items: stateObj.items,
        }];
    } else {
        groupsData = (stateObj && stateObj.groups) || [];
    }
    const newGroups = [];
    for (const gd of groupsData) {
        const group = createGroup(gd.name || "分组");
        group.seed = gd.seed || 0;
        group.seed_mode = gd.seed_mode || "random";
        group.merge_enabled = !!(gd.merge_enabled);
        group.merge_count = gd.merge_count || 1;
        group.separator = gd.separator ?? ", ";
        group.collapsed = !!(gd.collapsed);
        for (const item of (gd.items || [])) {
            const newItem = {
                path: item.path,
                name: item.name || (item.path || "").split("/").pop(),
                enabled: !!item.enabled,
                // random 默认值与 addItem 一致（true=🎲随机模式），避免旧预设无此字段时加载为 📌 固定模式导致与新建分组样式不一致
                random: item.random === undefined ? true : !!item.random,
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
            group.items.push(newItem);
        }
        newGroups.push(group);
    }
    // 所有异步 fetchFile 完成后，原子替换 state.groups
    state.groups = newGroups;
    if (state.groups.length === 0) {
        state.groups.push(createGroup("默认分组"));
    }
    renderGroups(node);
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

// ============ 添加文件到指定分组 ============
async function addItem(node, fileNode, gi) {
    const state = getState(node);
    const group = state.groups[gi];
    if (!group) return;
    // 同分组内同路径不重复添加
    if (group.items.some(it => it.path === fileNode.path)) return;
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
    group.items.push(item);
    renderGroupItems(node, gi);
}

// 点击"添加"按钮：只有一个分组时直接添加，多个分组时弹选择小窗
function addSelectedFiles(node, btnEl) {
    const state = getState(node);
    const selectedPaths = Object.keys(state.treeSelected).filter(k => state.treeSelected[k]);
    if (selectedPaths.length === 0) {
        alert("请先勾选要添加的 txt 文件");
        return;
    }
    if (state.groups.length === 0) state.groups.push(createGroup("默认分组"));
    // 仅一个分组：直接添加，无需选择
    if (state.groups.length === 1) {
        doAddSelectedFiles(node, 0);
        return;
    }
    // 多个分组：弹分组选择小窗
    openAddToGroupPopover(node, btnEl);
}

// 分组选择弹窗：选择目标分组后将勾选的 txt 添加进去；也可一键新建分组
function openAddToGroupPopover(node, btnEl) {
    closePopover();
    const state = getState(node);

    const popover = document.createElement("div");
    popover.className = "hezl-popover";

    const header = document.createElement("div");
    header.className = "hezl-popover-header";
    const title = document.createElement("span");
    title.style.flex = "1";
    title.textContent = "添加到分组";
    const closeBtn = document.createElement("button");
    closeBtn.className = "hezl-popover-close";
    closeBtn.textContent = "×";
    closeBtn.title = "关闭";
    header.appendChild(title);
    header.appendChild(closeBtn);

    const hint = document.createElement("div");
    hint.className = "hezl-sep-hint";
    hint.textContent = `将勾选的 ${Object.keys(state.treeSelected).filter(k => state.treeSelected[k]).length} 个 txt 添加到：`;

    const listEl = document.createElement("div");
    listEl.className = "hezl-popover-list";
    const lastGi = (state.lastAddGroup >= 0 && state.lastAddGroup < state.groups.length) ? state.lastAddGroup : 0;
    state.groups.forEach((g, gi) => {
        const item = document.createElement("div");
        item.className = "hezl-modal-item" + (gi === lastGi ? " selected" : "");
        item.textContent = `${g.name}（${g.items.length} 项）`;
        item.title = `添加到「${g.name}」`;
        item.addEventListener("click", () => {
            state.lastAddGroup = gi;
            closePopover();
            doAddSelectedFiles(node, gi);
        });
        listEl.appendChild(item);
    });

    const newGroupBtn = document.createElement("button");
    newGroupBtn.className = "hezl-rtxt-btn primary";
    newGroupBtn.textContent = "➕ 新建分组并添加";
    newGroupBtn.style.width = "100%";
    newGroupBtn.style.marginTop = "6px";
    newGroupBtn.addEventListener("click", () => {
        const gi = state.groups.length;
        state.groups.push(createGroup("分组 " + (state.groups.length + 1)));
        state.lastAddGroup = gi;
        closePopover();
        renderGroups(node);
        doAddSelectedFiles(node, gi);
    });

    popover.appendChild(header);
    popover.appendChild(hint);
    popover.appendChild(listEl);
    popover.appendChild(newGroupBtn);
    document.body.appendChild(popover);
    currentPopover = popover;
    makePopoverDraggable(popover, header);

    closeBtn.addEventListener("click", closePopover);
    bindPopoverClose(popover, btnEl);
    positionPopover(popover, btnEl);
}

// 实际执行添加：把勾选的 txt 依次添加到指定分组
async function doAddSelectedFiles(node, gi) {
    const state = getState(node);
    const selectedPaths = Object.keys(state.treeSelected).filter(k => state.treeSelected[k]);
    if (selectedPaths.length === 0) return;
    // 从树中找到对应的文件节点
    const allFiles = [];
    if (state.tree) {
        for (const tn of state.tree) {
            allFiles.push(...collectFiles(tn));
        }
    }
    for (const fp of selectedPaths) {
        const fn = allFiles.find(f => f.path === fp);
        if (fn) await addItem(node, fn, gi);
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
        // 重新加载目录树并刷新右侧分组（路径变更后需重新渲染所有分组）
        try { state.tree = await fetchTree(); } catch (e) { /* ignore */ }
        renderTree(node);
        renderGroups(node);
    } catch (e) {
        alert("重命名失败: " + e.message);
    }
}

// 重命名后更新 state 中以路径为 key 的字段，保持选中/展开/已添加条目不丢失
// 遍历所有分组的 items 更新路径（多分组结构）
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

        for (const g of state.groups) {
            for (const it of g.items) {
                if (it.path === oldPath) it.path = newPath;
                else if (it.path.startsWith(prefix)) it.path = newPath + "/" + it.path.slice(prefix.length);
            }
        }
        if (state.lastSelectedPath && state.lastSelectedPath.startsWith(prefix)) {
            state.lastSelectedPath = newPath + "/" + state.lastSelectedPath.slice(prefix.length);
        }
    } else {
        if (oldPath in state.treeSelected) {
            state.treeSelected[newPath] = state.treeSelected[oldPath];
            delete state.treeSelected[oldPath];
        }
        for (const g of state.groups) {
            for (const it of g.items) {
                if (it.path === oldPath) {
                    it.path = newPath;
                    it.name = newPath.split("/").pop();
                }
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

// ============ 分组内：全开启/全关闭 ============
function toggleAllItemsInGroup(node, gi) {
    const state = getState(node);
    const group = state.groups[gi];
    if (!group || group.items.length === 0) return;
    const allEnabled = group.items.every(it => it.enabled);
    const target = !allEnabled;
    for (const it of group.items) {
        it.enabled = target;
    }
    renderGroupItems(node, gi);
}

function updateAllToggleBtnForGroup(node, gi) {
    const group = getState(node).groups[gi];
    if (!group) return;
    const btn = group._toggleBtn;
    if (!btn) return;
    const allEnabled = group.items.length > 0 && group.items.every(it => it.enabled);
    btn.textContent = allEnabled ? "🔴" : "🟢";
    btn.className = "hezl-rtxt-btn " + (allEnabled ? "all-off" : "all-on");
    btn.title = allEnabled ? "关闭本组全部输出" : "开启本组全部输出";
}

// ============ 分组内：全部随机/全部固定 ============
function toggleAllRandomInGroup(node, gi) {
    const state = getState(node);
    const group = state.groups[gi];
    if (!group || group.items.length === 0) return;
    const anyRandom = group.items.some(it => it.random);
    const target = !anyRandom;
    for (const it of group.items) {
        it.random = target;
    }
    renderGroupItems(node, gi);
}

function updateAllRandomBtnForGroup(node, gi) {
    const group = getState(node).groups[gi];
    if (!group) return;
    const btn = group._randomBtn;
    if (!btn) return;
    const anyRandom = group.items.some(it => it.random);
    if (anyRandom) {
        btn.textContent = "📌";
        btn.title = "关闭本组全部随机";
        btn.className = "hezl-rtxt-btn all-off";
    } else {
        btn.textContent = "🎲";
        btn.title = "开启本组全部随机";
        btn.className = "hezl-rtxt-btn all-on";
    }
}

// ====== 分组内：合并随机输出按钮状态 ======
function updateMergeBtnForGroup(node, gi) {
    const group = getState(node).groups[gi];
    if (!group) return;
    const btn = group._mergeBtn;
    if (!btn) return;
    if (group.merge_enabled) {
        btn.textContent = "🗳️";
        btn.title = "本组合并随机输出已开启（点击关闭）";
        btn.className = "hezl-rtxt-btn all-on";
    } else {
        btn.textContent = "🗳️";
        btn.title = "本组合并随机输出已关闭（点击开启）";
        btn.className = "hezl-rtxt-btn";
    }
}

// ====== 分组内：种子按钮状态 ======
function updateSeedBtnForGroup(node, gi) {
    const group = getState(node).groups[gi];
    if (!group) return;
    const btn = group._seedBtn;
    if (!btn) return;
    if (group.seed_mode === "fixed") {
        btn.textContent = "⏸️";
        btn.title = "本组固定种子（相同种子输出相同结果，点击切换为随机）";
        btn.className = "hezl-rtxt-btn all-off";
    } else {
        btn.textContent = "🔀";
        btn.title = "本组随机种子（每次执行都不同，点击切换为固定）";
        btn.className = "hezl-rtxt-btn all-on";
    }
}

// ============ 随机预计算（按组）============
// 复刻后端 execute() 的组内随机逻辑，基于本组 seed 预计算每个 🎲 开启项将选中的行。
// 必须与 nodes.py execute() 组内逻辑严格一致：跳过 enabled=false、random 用 rng.choice。
// 返回：与 group.items 等长的数组，元素为 { line, lineIndex } 或 null。
// 由 renderGroupItems 调用，让 🎲 随机模式的词组按钮显示"当前种子会选出的行"，
// 与后端 execute() 输出一致；合并模式下返回全 null（合并模式不逐项输出）。
function computePreviewLinesForGroup(node, gi) {
    const group = getState(node).groups[gi];
    const result = new Array((group?.items || []).length).fill(null);
    if (!group || group.merge_enabled) return result;
    let rng;
    try { rng = new PyRandom(group.seed); } catch (e) { return result; }
    for (let i = 0; i < group.items.length; i++) {
        const item = group.items[i];
        if (!item.enabled) continue;
        const lines = item.lines || [];
        if (lines.length === 0) continue;
        if (item.random) {
            try { const idx = rng._randbelow(lines.length); result[i] = { line: lines[idx], lineIndex: idx }; } catch (e) {}
        } else {
            let idx = item.selected_line || 0;
            if (idx < 0 || idx >= lines.length) idx = 0;
            result[i] = { line: lines[idx], lineIndex: idx };
        }
    }
    return result;
}

// ============ 右侧分组区渲染 ============
// 遍历 state.groups，每个分组渲染一个分组栏（header + 工具栏 + body）。
// body 内的 items 列表由 renderGroupItems 单独渲染。
function renderGroups(node) {
    const state = getState(node);
    const container = node._hezl_groups_el;
    if (!container) return;
    const savedScrollTop = container.scrollTop;
    container.innerHTML = "";
    if (state.groups.length === 0) {
        state.groups.push(createGroup("默认分组"));
    }
    const frag = document.createDocumentFragment();
    state.groups.forEach((group, gi) => {
        frag.appendChild(buildGroupEl(node, gi));
    });
    // 末尾追加虚线"+分组"按钮（替代原顶部 ➕ 分组 按钮）
    const addGroupBtn = document.createElement("button");
    addGroupBtn.className = "hezl-add-group-btn";
    addGroupBtn.textContent = "➕ 分组";
    addGroupBtn.title = "在最后新增一个分组";
    addGroupBtn.addEventListener("click", () => addGroup(node));
    frag.appendChild(addGroupBtn);
    container.appendChild(frag);
    // DOM 插入后再渲染各组 items 列表与按钮状态
    state.groups.forEach((group, gi) => {
        renderGroupItems(node, gi);
    });
    container.scrollTop = savedScrollTop;
}

// 构建单个分组栏（header + 工具栏 + body），按钮 DOM 引用挂在 group 对象上
function buildGroupEl(node, gi) {
    const state = getState(node);
    const group = state.groups[gi];
    const groupEl = document.createElement("div");
    groupEl.className = "hezl-group";
    groupEl.dataset.gi = gi;

    // ===== header（顶部按钮栏：拖拽手柄 | 分组名+✏️ | 工具栏）=====
    const header = document.createElement("div");
    header.className = "hezl-group-header";

    // 拖拽手柄（拖动改变分组顺序）
    const handle = document.createElement("span");
    handle.className = "hezl-group-handle";
    handle.textContent = "⋮⋮";
    handle.title = "拖拽改变分组顺序";
    handle.draggable = true;
    handle.addEventListener("dragstart", (e) => {
        groupEl.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", JSON.stringify({ type: "group", gi }));
    });
    handle.addEventListener("dragend", () => {
        groupEl.classList.remove("dragging");
        const container = node._hezl_groups_el;
        if (container) container.querySelectorAll(".group-drag-over").forEach(el => el.classList.remove("group-drag-over"));
    });

    // 分组名 + ✏️ 重命名按钮（左侧一组，与其他按钮隔开）
    const nameWrap = document.createElement("div");
    nameWrap.className = "hezl-group-name-wrap";
    const nameEl = document.createElement("span");
    nameEl.className = "hezl-group-name";
    nameEl.textContent = group.name;
    nameEl.title = "双击重命名分组";
    nameEl.addEventListener("dblclick", () => renameGroup(node, gi));
    const renameBtn = document.createElement("button");
    renameBtn.className = "hezl-group-rename-btn";
    renameBtn.textContent = "✏️";
    renameBtn.title = "重命名分组";
    renameBtn.addEventListener("click", () => renameGroup(node, gi));
    nameWrap.appendChild(nameEl);
    nameWrap.appendChild(renameBtn);

    // 工具栏（右侧按钮组）
    const toolbar = document.createElement("div");
    toolbar.className = "hezl-group-toolbar";

    // 批量操作组：全开关 / 全随机（原 👈️📄 移除全部按钮已移除，逐个 × 删除即可）
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "hezl-rtxt-btn all-on";
    toggleBtn.textContent = "🟢";
    toggleBtn.addEventListener("click", () => toggleAllItemsInGroup(node, gi));
    group._toggleBtn = toggleBtn;

    const randomBtn = document.createElement("button");
    randomBtn.className = "hezl-rtxt-btn all-on";
    randomBtn.textContent = "🎲";
    randomBtn.addEventListener("click", () => toggleAllRandomInGroup(node, gi));
    group._randomBtn = randomBtn;

    const batchGroup = document.createElement("div");
    batchGroup.className = "hezl-rtxt-toolbar-group";
    batchGroup.appendChild(toggleBtn);
    batchGroup.appendChild(randomBtn);

    // 合并输出组：🗳️ + 数量 + ▲▼
    const mergeBtn = document.createElement("button");
    mergeBtn.className = "hezl-rtxt-btn";
    mergeBtn.textContent = "🗳️";
    mergeBtn.addEventListener("click", () => {
        group.merge_enabled = !group.merge_enabled;
        renderGroupItems(node, gi);
    });
    group._mergeBtn = mergeBtn;

    const mergeCountInput = document.createElement("input");
    mergeCountInput.type = "number";
    mergeCountInput.className = "hezl-rtxt-num-input";
    mergeCountInput.min = "1";
    mergeCountInput.value = group.merge_count;
    mergeCountInput.title = "本组合并随机输出数量";
    mergeCountInput.addEventListener("input", () => {
        group.merge_count = Math.max(1, parseInt(mergeCountInput.value) || 1);
    });
    group._mergeCountInput = mergeCountInput;

    const spinUp = document.createElement("button");
    spinUp.className = "hezl-spinner-btn up";
    spinUp.textContent = "▲";
    spinUp.title = "增加数量";
    spinUp.addEventListener("click", () => {
        group.merge_count = Math.max(1, group.merge_count + 1);
        mergeCountInput.value = group.merge_count;
    });
    const spinDown = document.createElement("button");
    spinDown.className = "hezl-spinner-btn down";
    spinDown.textContent = "▼";
    spinDown.title = "减少数量";
    spinDown.addEventListener("click", () => {
        group.merge_count = Math.max(1, group.merge_count - 1);
        mergeCountInput.value = group.merge_count;
    });
    const spinnerBtns = document.createElement("div");
    spinnerBtns.className = "hezl-spinner-btns";
    spinnerBtns.appendChild(spinUp);
    spinnerBtns.appendChild(spinDown);

    const mergeGroup = document.createElement("div");
    mergeGroup.className = "hezl-merge-group";
    mergeGroup.appendChild(mergeBtn);
    mergeGroup.appendChild(mergeCountInput);
    mergeGroup.appendChild(spinnerBtns);

    // 种子控制组：🛎️ + 🔀/⏸️ + 种子输入框
    const genSeedBtn = document.createElement("button");
    genSeedBtn.className = "hezl-rtxt-btn";
    genSeedBtn.textContent = "🛎️";
    genSeedBtn.title = "生成本组随机种子：填入新种子、切到固定模式，用种子计算随机行并固定为已选词组，本组所有 txt 变为 📌 固定模式（词组随种子变化）";
    genSeedBtn.addEventListener("click", () => {
        group.seed = Math.floor(Math.random() * 1000000000);
        group.seed_mode = "fixed";
        // 用新种子计算随机行，固定为 selected_line，再切 📌 固定模式。
        // 临时把所有 item 设为 🎲 模式，让 computePreviewLinesForGroup 用 rng 计算随机行
        // （复刻后端 rng.choice 顺序，保证 📌 词组随种子变化且与后端随机结果一致）。
        for (const it of group.items) it.random = true;
        const previews = computePreviewLinesForGroup(node, gi);
        for (let i = 0; i < group.items.length; i++) {
            const it = group.items[i];
            const prev = previews[i];
            if (prev) it.selected_line = prev.lineIndex;
            it.random = false; // 切 📌 固定模式
        }
        if (group._seedInput) group._seedInput.value = group.seed;
        renderGroupItems(node, gi);
    });

    const seedBtn = document.createElement("button");
    seedBtn.className = "hezl-rtxt-btn";
    seedBtn.textContent = "🔀";
    seedBtn.addEventListener("click", () => {
        group.seed_mode = group.seed_mode === "fixed" ? "random" : "fixed";
        renderGroupItems(node, gi);
    });
    group._seedBtn = seedBtn;

    const seedInput = document.createElement("input");
    seedInput.type = "text";
    seedInput.className = "hezl-rtxt-num-input hezl-rtxt-seed-input";
    seedInput.value = group.seed;
    seedInput.title = "本组种子值（固定模式时相同种子输出相同结果）";
    seedInput.addEventListener("input", () => {
        group.seed = Math.max(0, parseInt(seedInput.value) || 0);
        renderGroupItems(node, gi);
    });
    group._seedInput = seedInput;

    const seedGroup = document.createElement("div");
    seedGroup.className = "hezl-rtxt-toolbar-group";
    seedGroup.appendChild(genSeedBtn);
    seedGroup.appendChild(seedBtn);
    seedGroup.appendChild(seedInput);

    // 组间分隔符按钮
    const groupSepBtn = document.createElement("button");
    groupSepBtn.className = "hezl-item-sep-btn";
    groupSepBtn.textContent = "⁉️";
    groupSepBtn.title = "本组输出与下一组输出之间的分隔符\n当前: " + sepToDisplay(group.separator ?? ", ");
    groupSepBtn.addEventListener("click", (e) => openGroupSeparatorPopover(node, gi, e.currentTarget));

    // 删除分组
    const deleteGroupBtn = document.createElement("button");
    deleteGroupBtn.className = "hezl-rtxt-btn all-off";
    deleteGroupBtn.textContent = "❌";
    deleteGroupBtn.title = "删除此分组";
    deleteGroupBtn.addEventListener("click", () => deleteGroup(node, gi));

    toolbar.appendChild(batchGroup);
    toolbar.appendChild(mergeGroup);
    toolbar.appendChild(seedGroup);
    toolbar.appendChild(groupSepBtn);
    toolbar.appendChild(deleteGroupBtn);

    header.appendChild(handle);
    header.appendChild(nameWrap);
    header.appendChild(toolbar);

    // ===== body（显示区域）=====
    const body = document.createElement("div");
    body.className = "hezl-group-body";
    group._bodyEl = body;
    group._groupEl = groupEl;

    // ===== body 作为 item 拖拽的 drop 目标（拖到空白区域追加到本组末尾）=====
    // item row 的 drop 优先（row 是更具体的 target 且 stopPropagation）；
    // 当目标组为空或鼠标落在 row 之外的空白区域时，body 的 drop 触发，追加到末尾
    body.addEventListener("dragover", (e) => {
        const dragging = (node._hezl_groups_el || document).querySelector(".hezl-rtxt-item.dragging");
        if (!dragging) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        // 鼠标不在任何 item row 上时，高亮 body 表示可追加到末尾
        if (!e.target.closest(".hezl-rtxt-item")) {
            body.classList.add("body-drag-over");
        } else {
            body.classList.remove("body-drag-over");
        }
    });
    body.addEventListener("dragleave", (e) => {
        if (!body.contains(e.relatedTarget)) {
            body.classList.remove("body-drag-over");
        }
    });
    body.addEventListener("drop", (e) => {
        body.classList.remove("body-drag-over");
        let payload;
        try { payload = JSON.parse(e.dataTransfer.getData("text/plain")); } catch (_) { return; }
        if (!payload || payload.type !== "item") return;
        e.preventDefault();
        e.stopPropagation();
        const fromGi = payload.gi;
        const fromIdx = payload.idx;
        const toGi = gi;
        const state = getState(node);
        const fromGroup = state.groups[fromGi];
        const toGroup = state.groups[toGi];
        if (!fromGroup || !toGroup) return;
        // 追加到目标组末尾
        const toIdx = toGroup.items.length;
        if (fromGi === toGi && fromIdx === toIdx - 1) return; // 已是最后一项，无需移动
        const [moved] = fromGroup.items.splice(fromIdx, 1);
        const insertIdx = (fromGi === toGi && fromIdx < toIdx) ? toIdx - 1 : toIdx;
        toGroup.items.splice(insertIdx, 0, moved);
        renderGroupItems(node, fromGi);
        if (toGi !== fromGi) renderGroupItems(node, toGi);
    });

    // ===== 分组拖拽：在 groupEl 上接收 drop 改变分组顺序 =====
    // 仅响应 type==="group" 的拖拽（item 拖拽有自己的 drop 处理，冒泡到此会被 type 检查过滤）
    groupEl.addEventListener("dragover", (e) => {
        const container = node._hezl_groups_el;
        if (!container) return;
        const dragging = container.querySelector(".hezl-group.dragging");
        if (!dragging || dragging === groupEl) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        groupEl.classList.add("group-drag-over");
    });
    groupEl.addEventListener("dragleave", (e) => {
        // 仅当离开 groupEl 本身（而非进入子元素）时移除高亮
        if (!groupEl.contains(e.relatedTarget)) {
            groupEl.classList.remove("group-drag-over");
        }
    });
    groupEl.addEventListener("drop", (e) => {
        groupEl.classList.remove("group-drag-over");
        let payload;
        try { payload = JSON.parse(e.dataTransfer.getData("text/plain")); } catch (_) { return; }
        if (!payload || payload.type !== "group") return; // 非分组拖拽不处理
        e.preventDefault();
        e.stopPropagation();
        const fromGi = payload.gi;
        const toGi = gi;
        if (fromGi === toGi) return;
        const st = getState(node);
        const [moved] = st.groups.splice(fromGi, 1);
        const insertIdx = (fromGi < toGi) ? toGi - 1 : toGi;
        st.groups.splice(insertIdx, 0, moved);
        // 修正 lastAddGroup 索引（受数组重排影响）
        if (st.lastAddGroup === fromGi) st.lastAddGroup = toGi;
        else if (fromGi < st.lastAddGroup && toGi >= st.lastAddGroup) st.lastAddGroup -= 1;
        else if (fromGi > st.lastAddGroup && toGi <= st.lastAddGroup) st.lastAddGroup += 1;
        renderGroups(node);
    });

    groupEl.appendChild(header);
    groupEl.appendChild(body);
    return groupEl;
}

// 渲染单个分组的 items 列表，并更新该组工具栏按钮状态
function renderGroupItems(node, gi) {
    const state = getState(node);
    const group = state.groups[gi];
    if (!group) return;
    const container = group._bodyEl;
    if (!container) return;
    // 保存滚动位置：innerHTML="" 会重置 scrollTop/scrollLeft
    const savedScrollTop = container.scrollTop;
    const savedScrollLeft = container.scrollLeft;
    container.innerHTML = "";

    // 更新本组工具栏按钮状态
    updateAllToggleBtnForGroup(node, gi);
    updateAllRandomBtnForGroup(node, gi);
    updateMergeBtnForGroup(node, gi);
    updateSeedBtnForGroup(node, gi);
    if (group._seedInput) group._seedInput.value = group.seed;
    if (group._mergeCountInput) group._mergeCountInput.value = group.merge_count;

    if (group.items.length === 0) {
        container.innerHTML = '<div class="hezl-items-empty">在左侧勾选 txt 后点击"添加"到此分组</div>';
        return;
    }

    // 注：🎲 随机模式词组按钮显示为空（不显示预览），previews 仅由 🛎️ 按钮单独调用计算用于固定 selected_line。

    const frag = document.createDocumentFragment();
    group.items.forEach((item, index) => {
        const itemWrap = document.createElement("div");
        itemWrap.className = "hezl-rtxt-item-wrap";

        const indexEl = document.createElement("span");
        indexEl.className = "hezl-rtxt-item-index";
        indexEl.textContent = String(index + 1);
        indexEl.title = `输出顺序: ${index + 1}`;

        const row = document.createElement("div");
        let rowClass = "hezl-rtxt-item" + (item.enabled ? "" : " disabled");
        if (group.merge_enabled) rowClass += " merge-active";
        row.className = rowClass;
        row.draggable = true;
        row.dataset.gi = gi;
        row.dataset.idx = index;

        const handle = document.createElement("span");
        handle.className = "hezl-drag-handle";
        handle.textContent = "⋮⋮";

        const toggleBtn = document.createElement("button");
        toggleBtn.className = "hezl-item-toggle" + (item.enabled ? " on" : "");
        toggleBtn.textContent = item.enabled ? "🟢" : "🔴";
        toggleBtn.title = "启用/禁用此词条输出";
        toggleBtn.addEventListener("click", () => {
            item.enabled = !item.enabled;
            renderGroupItems(node, gi);
        });

        const nameSpan = document.createElement("span");
        nameSpan.className = "hezl-item-name";
        nameSpan.textContent = item.name;
        nameSpan.title = item.path;

        const sep1 = document.createElement("span");
        sep1.className = "hezl-sep";
        sep1.textContent = "|";

        // 🎲/📌 随机模式按钮（类名用命名空间化的 dice-active/dice-fixed，避免与全局 .fixed 冲突）
        const diceBtn = document.createElement("button");
        diceBtn.className = "hezl-dice" + (item.random ? " dice-active" : " dice-fixed");
        diceBtn.textContent = item.random ? "🎲" : "📌";
        diceBtn.title = item.random ? "随机模式已开启（点击固定当前选择）" : "随机模式已关闭（点击开启随机选取一行）";

        const lineBtn = document.createElement("button");
        lineBtn.className = "hezl-item-line-btn";
        if (item.random) {
            // 🎲 随机模式：词组按钮显示为空（执行时随机选一行，不显示预览）
            lineBtn.textContent = "";
            lineBtn.title = "🎲 随机模式（执行时输出随机一行）- 点击可选择词组";
        } else {
            const selIdx = item.selected_line || 0;
            const hasEn = item.lines.length > 0 && selIdx < item.lines.length;
            const enLine = hasEn ? item.lines[selIdx] : "";
            const hasTr = item.tr_lines.length > 0 && selIdx < item.tr_lines.length
                && item.tr_lines[selIdx].trim() !== "";
            const trLine = hasTr ? item.tr_lines[selIdx] : "";
            const displayLine = trLine || enLine || "(空)";
            const displayText = displayLine.length > 35 ? displayLine.substring(0, 32) + "..." : displayLine;
            lineBtn.textContent = displayText;
            lineBtn.title = !hasEn ? "(空) - 点击选择词组"
                : (trLine ? `${trLine}\n${enLine}` : enLine);
        }
        lineBtn.addEventListener("click", (e) => openLinePopover(node, gi, index, e.currentTarget));

        diceBtn.addEventListener("click", () => {
            item.random = !item.random;
            renderGroupItems(node, gi);
        });

        const sep2 = document.createElement("span");
        sep2.className = "hezl-sep";
        sep2.textContent = "|";

        const sepBtn = document.createElement("button");
        sepBtn.className = "hezl-item-sep-btn";
        sepBtn.textContent = "⁉️";
        const curSep = item.separator ?? ",";
        sepBtn.title = "自定义与下个txt之间的间隔符号\n当前: " + sepToDisplay(curSep)
            + (index === group.items.length - 1 ? "\n（这是本组最后一项，间隔符不会生效）" : "");
        sepBtn.addEventListener("click", (e) => openSeparatorPopover(node, gi, index, e.currentTarget));

        const removeBtn = document.createElement("button");
        removeBtn.className = "hezl-item-remove";
        removeBtn.textContent = "×";
        removeBtn.title = "移除";
        removeBtn.addEventListener("click", () => {
            group.items.splice(index, 1);
            renderGroupItems(node, gi);
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

        setupItemDrag(row, node, gi);

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
    container.scrollTop = savedScrollTop;
    container.scrollLeft = savedScrollLeft;
}

// ============ 分组管理 ============
function addGroup(node) {
    const state = getState(node);
    state.groups.push(createGroup("分组 " + (state.groups.length + 1)));
    renderGroups(node);
}

function renameGroup(node, gi) {
    const group = getState(node).groups[gi];
    if (!group) return;
    const name = prompt("分组名称：", group.name);
    if (name && name.trim()) {
        group.name = name.trim();
        renderGroups(node);
    }
}

function deleteGroup(node, gi) {
    const state = getState(node);
    const group = state.groups[gi];
    if (!group) return;
    if (state.groups.length <= 1) {
        alert("至少保留一个分组");
        return;
    }
    const msg = group.items.length > 0
        ? `确定删除分组「${group.name}」及其中的 ${group.items.length} 个 txt 吗？`
        : `确定删除空分组「${group.name}」吗？`;
    if (!confirm(msg)) return;
    state.groups.splice(gi, 1);
    if (state.lastAddGroup >= state.groups.length) state.lastAddGroup = state.groups.length - 1;
    renderGroups(node);
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

// ============ 拖拽排序（支持跨分组移动）============
function setupItemDrag(row, node, gi) {
    row.addEventListener("dragstart", (e) => {
        row.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
        // 用 JSON 传递源分组索引与项索引，drop 时据此跨组移动；type:"item" 与分组拖拽区分
        e.dataTransfer.setData("text/plain", JSON.stringify({ type: "item", gi, idx: parseInt(row.dataset.idx) }));
    });
    row.addEventListener("dragend", () => {
        row.classList.remove("dragging");
        // 清理所有分组内的 drag-over
        const container = node._hezl_groups_el;
        if (container) {
            container.querySelectorAll(".drag-over").forEach(el => el.classList.remove("drag-over"));
        }
    });
    row.addEventListener("dragover", (e) => {
        // 仅响应 item 拖拽（分组拖拽用 .hezl-group.dragging，不在此处理）
        const dragging = (node._hezl_groups_el || document).querySelector(".hezl-rtxt-item.dragging");
        if (!dragging) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (dragging !== row) {
            row.classList.add("drag-over");
        }
    });
    row.addEventListener("dragleave", () => {
        row.classList.remove("drag-over");
    });
    row.addEventListener("drop", (e) => {
        let payload;
        try { payload = JSON.parse(e.dataTransfer.getData("text/plain")); } catch (_) { return; }
        if (!payload || payload.type !== "item" || isNaN(payload.gi) || isNaN(payload.idx)) return;
        e.preventDefault();
        e.stopPropagation();
        row.classList.remove("drag-over");
        const fromGi = payload.gi;
        const fromIdx = payload.idx;
        const toGi = gi;
        const toIdx = parseInt(row.dataset.idx);
        const state = getState(node);
        const fromGroup = state.groups[fromGi];
        const toGroup = state.groups[toGi];
        if (!fromGroup || !toGroup) return;
        // 同组同位置无操作
        if (fromGi === toGi && fromIdx === toIdx) return;
        const [moved] = fromGroup.items.splice(fromIdx, 1);
        // 同组内：源在目标之前时，移除后目标索引需 -1
        const insertIdx = (fromGi === toGi && fromIdx < toIdx) ? toIdx - 1 : toIdx;
        toGroup.items.splice(insertIdx, 0, moved);
        renderGroupItems(node, fromGi);
        if (toGi !== fromGi) renderGroupItems(node, toGi);
    });
}

// ============ 轻量下拉小弹窗（锚定到触发元素）============
let currentPopover = null;
let popoverOutsideHandler = null;
let popoverEscHandler = null;
let popoverScrollHandler = null;

function closePopover() {
    if (currentPopover) {
        currentPopover.remove();
        currentPopover = null;
    }
    if (popoverOutsideHandler) {
        document.removeEventListener("mousedown", popoverOutsideHandler, true);
        popoverOutsideHandler = null;
    }
    if (popoverEscHandler) {
        document.removeEventListener("keydown", popoverEscHandler, true);
        popoverEscHandler = null;
    }
    if (popoverScrollHandler) {
        document.removeEventListener("scroll", popoverScrollHandler, true);
        popoverScrollHandler = null;
    }
}

// 将弹窗锚定到触发按钮下方（下方空间不足且上方足够时翻到上方），并贴边校正
function positionPopover(popover, btnEl) {
    // 用户已手动拖拽过：不再重新锚定按钮，仅做贴边校正保持弹窗在视口内
    if (popover._userMoved) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const pw = popover.offsetWidth;
        const ph = popover.offsetHeight;
        let left = parseFloat(popover.style.left) || 0;
        let top = parseFloat(popover.style.top) || 0;
        if (left + pw > vw - 4) left = vw - pw - 4;
        if (left < 4) left = 4;
        if (top + ph > vh - 4) top = Math.max(4, vh - ph - 4);
        if (top < 4) top = 4;
        popover.style.left = left + "px";
        popover.style.top = top + "px";
        return;
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pw = popover.offsetWidth;
    const ph = popover.offsetHeight;
    let left, top;
    if (btnEl && btnEl.getBoundingClientRect) {
        const r = btnEl.getBoundingClientRect();
        left = r.left;
        top = r.bottom + 4;
        // 下方放不下且上方放得下 → 翻到按钮上方
        if (top + ph > vh - 4 && r.top - ph - 4 > 4) {
            top = r.top - ph - 4;
        }
    } else {
        left = (vw - pw) / 2;
        top = (vh - ph) / 2;
    }
    if (left + pw > vw - 4) left = vw - pw - 4;
    if (left < 4) left = 4;
    if (top + ph > vh - 4) top = Math.max(4, vh - ph - 4);
    if (top < 4) top = 4;
    popover.style.left = left + "px";
    popover.style.top = top + "px";
}

// 绑定外部点击 / Esc / 外部滚动关闭（弹窗内部滚动不触发关闭）
function bindPopoverClose(popover, triggerEl) {
    popoverOutsideHandler = (e) => {
        if (popover.contains(e.target)) return;
        if (triggerEl && triggerEl.contains(e.target)) return;
        closePopover();
    };
    popoverEscHandler = (e) => {
        if (e.key === "Escape") { e.preventDefault(); closePopover(); }
    };
    popoverScrollHandler = (e) => {
        // 弹窗内部滚动（如词组列表）不关闭；其余滚动（画布/列表外层）会令弹窗与按钮错位，直接关闭
        if (popover.contains(e.target)) return;
        closePopover();
    };
    document.addEventListener("mousedown", popoverOutsideHandler, true);
    document.addEventListener("keydown", popoverEscHandler, true);
    document.addEventListener("scroll", popoverScrollHandler, true);
}

// 让弹窗可通过拖拽顶部 header 移动位置；拖拽后标记 _userMoved，后续 positionPopover 只做贴边校正不再跳回按钮下方
function makePopoverDraggable(popover, header) {
    header.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return; // 仅左键
        if (e.target.closest(".hezl-popover-close")) return; // 关闭按钮不触发拖拽
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const startLeft = parseFloat(popover.style.left) || 0;
        const startTop = parseFloat(popover.style.top) || 0;
        popover._userMoved = true;
        header.classList.add("dragging");
        document.body.style.userSelect = "none";
        function onMove(ev) {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const pw = popover.offsetWidth;
            let nl = startLeft + (ev.clientX - startX);
            let nt = startTop + (ev.clientY - startY);
            // 至少保留 60px 宽度与 header 可见，保证能拖回
            nl = Math.max(60 - pw, Math.min(vw - 60, nl));
            nt = Math.max(0, Math.min(vh - 40, nt));
            popover.style.left = nl + "px";
            popover.style.top = nt + "px";
        }
        function onUp() {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
            header.classList.remove("dragging");
            document.body.style.userSelect = "";
        }
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    });
}

// ============ 词组选择下拉弹窗 ============
function openLinePopover(node, gi, itemIndex, btnEl) {
    closePopover();
    const state = getState(node);
    const group = state.groups[gi];
    if (!group) return;
    const item = group.items[itemIndex];
    if (!item) return;

    const popover = document.createElement("div");
    popover.className = "hezl-popover";

    // 头部
    const header = document.createElement("div");
    header.className = "hezl-popover-header";
    const title = document.createElement("span");
    title.style.flex = "1";
    title.textContent = item.name + " - 选择词组"
        + ((item.tr_lines || []).length > 0 ? "（译文显示/原文输出）" : "");
    const closeBtn = document.createElement("button");
    closeBtn.className = "hezl-popover-close";
    closeBtn.textContent = "×";
    closeBtn.title = "关闭";
    header.appendChild(title);
    header.appendChild(closeBtn);

    // 工具栏：🌏️ 原文/译文切换 + 搜索框
    const toolbar = document.createElement("div");
    toolbar.className = "hezl-popover-toolbar";
    const hasTr = (item.tr_lines || []).some(l => l.trim());
    let showOriginal = false; // false=显示译文(.tr), true=显示原文(.txt)
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "hezl-rtxt-btn";
    toggleBtn.textContent = "🌏️";
    toggleBtn.title = hasTr ? "当前显示译文，点击切换为原文" : "无译文文件";
    toggleBtn.style.flexShrink = "0";
    if (!hasTr) toggleBtn.style.opacity = "0.4";
    toggleBtn.disabled = !hasTr;
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.className = "hezl-modal-search";
    searchInput.placeholder = "搜索词组...";
    toolbar.appendChild(toggleBtn);
    toolbar.appendChild(searchInput);

    // 列表（独立滚动区，保持头部与搜索框固定）
    const listEl = document.createElement("div");
    listEl.className = "hezl-popover-list";

    popover.appendChild(header);
    popover.appendChild(toolbar);
    popover.appendChild(listEl);
    document.body.appendChild(popover);
    currentPopover = popover;
    makePopoverDraggable(popover, header);

    toggleBtn.addEventListener("click", () => {
        showOriginal = !showOriginal;
        toggleBtn.title = showOriginal ? "当前显示原文，点击切换为译文" : "当前显示译文，点击切换为原文";
        toggleBtn.classList.toggle("all-on", showOriginal);
        renderList(searchInput.value);
        // 切换后内容高度可能变化，重新定位
        positionPopover(popover, btnEl);
    });

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
                item.random = false; // 选词组后切 📌 固定模式，显示选中的词组（🎲 模式显示空）
                closePopover();
                renderGroupItems(node, gi);
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
    // 渲染列表后再定位弹窗，确保使用真实高度；定位后再次把选中项滚到可视中
    positionPopover(popover, btnEl);
    // 搜索防抖，避免大量词组时输入卡顿
    let searchTimer = null;
    searchInput.addEventListener("input", () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            renderList(searchInput.value);
            positionPopover(popover, btnEl);
        }, 150);
    });
    closeBtn.addEventListener("click", closePopover);
    bindPopoverClose(popover, btnEl);
    searchInput.focus();
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

function openSeparatorPopover(node, gi, itemIndex, btnEl) {
    closePopover();
    const state = getState(node);
    const group = state.groups[gi];
    if (!group) return;
    const item = group.items[itemIndex];
    if (!item) return;

    const popover = document.createElement("div");
    popover.className = "hezl-popover";

    // 头部
    const header = document.createElement("div");
    header.className = "hezl-popover-header";
    const title = document.createElement("span");
    title.style.flex = "1";
    title.textContent = `间隔符号 - ${item.name}`;
    const closeBtn = document.createElement("button");
    closeBtn.className = "hezl-popover-close";
    closeBtn.textContent = "×";
    closeBtn.title = "关闭";
    header.appendChild(title);
    header.appendChild(closeBtn);

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
    actions.className = "hezl-popover-actions";
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

    popover.appendChild(header);
    popover.appendChild(hint);
    popover.appendChild(inputWrap);
    popover.appendChild(quick);
    popover.appendChild(actions);
    document.body.appendChild(popover);
    currentPopover = popover;
    makePopoverDraggable(popover, header);

    function commit() {
        item.separator = displayToSep(input.value);
        closePopover();
        renderGroupItems(node, gi);
    }
    okBtn.addEventListener("click", commit);
    cancelBtn.addEventListener("click", closePopover);
    closeBtn.addEventListener("click", closePopover);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); commit(); }
        else if (e.key === "Escape") { e.preventDefault(); closePopover(); }
    });
    bindPopoverClose(popover, btnEl);

    // 定位（基于真实高度）
    positionPopover(popover, btnEl);
    input.focus();
    input.select();
}

// 组间分隔符弹窗：设置本组输出与下一组输出之间的分隔符（操作 group.separator）
function openGroupSeparatorPopover(node, gi, btnEl) {
    closePopover();
    const state = getState(node);
    const group = state.groups[gi];
    if (!group) return;

    const popover = document.createElement("div");
    popover.className = "hezl-popover";

    const header = document.createElement("div");
    header.className = "hezl-popover-header";
    const title = document.createElement("span");
    title.style.flex = "1";
    title.textContent = `组间分隔符 - ${group.name}`;
    const closeBtn = document.createElement("button");
    closeBtn.className = "hezl-popover-close";
    closeBtn.textContent = "×";
    closeBtn.title = "关闭";
    header.appendChild(title);
    header.appendChild(closeBtn);

    const isLast = (gi === state.groups.length - 1);
    const hint = document.createElement("div");
    hint.className = "hezl-sep-hint";
    hint.textContent = isLast
        ? "这是最后一个分组，组间分隔符不会生效（仅在该组后新增分组时才生效）。"
        : "本组输出与下一组输出之间的分隔符。可用 \\n 表示换行，\\t 表示制表符。";

    const inputWrap = document.createElement("div");
    inputWrap.className = "hezl-sep-input-wrap";
    const input = document.createElement("input");
    input.type = "text";
    input.className = "hezl-sep-input";
    input.value = sepToDisplay(group.separator ?? ", ");
    input.placeholder = "如: , 或 ,  或 、 或 \\n";
    inputWrap.appendChild(input);

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

    const actions = document.createElement("div");
    actions.className = "hezl-popover-actions";
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

    popover.appendChild(header);
    popover.appendChild(hint);
    popover.appendChild(inputWrap);
    popover.appendChild(quick);
    popover.appendChild(actions);
    document.body.appendChild(popover);
    currentPopover = popover;
    makePopoverDraggable(popover, header);

    function commit() {
        group.separator = displayToSep(input.value);
        closePopover();
        renderGroupItems(node, gi);
    }
    okBtn.addEventListener("click", commit);
    cancelBtn.addEventListener("click", closePopover);
    closeBtn.addEventListener("click", closePopover);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); commit(); }
        else if (e.key === "Escape") { e.preventDefault(); closePopover(); }
    });
    bindPopoverClose(popover, btnEl);
    positionPopover(popover, btnEl);
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
    addBtn.addEventListener("click", () => addSelectedFiles(node, addBtn));

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

    // 顶部单行：仅预设管理（新增分组按钮已移到分组列表底部的虚线按钮）
    const toolbarRow1 = document.createElement("div");
    toolbarRow1.className = "hezl-rtxt-toolbar-row";
    const presetGroup = document.createElement("div");
    presetGroup.className = "hezl-rtxt-toolbar-group";
    presetGroup.appendChild(presetSelect);
    presetGroup.appendChild(saveBtn);
    presetGroup.appendChild(renameBtn);
    presetGroup.appendChild(deleteBtn);
    toolbarRow1.appendChild(presetGroup);
    toolbar.appendChild(toolbarRow1);
    rightPanel.appendChild(toolbar);

    // 分组列表容器：所有分组栏在此滚动渲染（renderGroups 使用此容器）
    const groupsEl = document.createElement("div");
    groupsEl.className = "hezl-rtxt-items";
    rightPanel.appendChild(groupsEl);
    node._hezl_groups_el = groupsEl;

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
        renderGroups(node);
        await refreshPresets(node);
    })();

    return widget;
}

// ============ 扩展注册 ============
app.registerExtension({
    name: EXTENSION_NAME,

    async init() {
        // 拦截 queuePrompt：在每个分组的"随机种子模式"下，每次执行前为该组生成新种子并写入输入框
        // 这样 PNG 元数据中保存的 config 会包含本次各组实际使用的种子，拖放图片复现时种子一致
        // 预览由 renderGroups 内部用 computePreviewLinesForGroup 基于 group.seed 实时计算，
        // 不修改 item.random / selected_line，保持用户手动固定选择不被覆盖，且 PNG 元数据 item.random 不变
        const origQueuePrompt = app.queuePrompt;
        app.queuePrompt = function (...args) {
            try {
                const graph = app.graph || window.graph;
                if (graph && graph._nodes) {
                    for (const n of graph._nodes) {
                        if (n.type === NODE_NAME) {
                            const st = getState(n);
                            let changed = false;
                            st.groups.forEach((g, gi) => {
                                if (g.seed_mode === "random") {
                                    g.seed = Math.floor(Math.random() * 1000000000);
                                    if (g._seedInput) g._seedInput.value = g.seed;
                                    changed = true;
                                }
                            });
                            if (changed) renderGroups(n);
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
