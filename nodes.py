import os
import json
import random
from server import PromptServer
from aiohttp import web

# 插件根目录
PLUGIN_DIR = os.path.dirname(os.path.abspath(__file__))
SAVE_TXT_DIR = os.path.join(PLUGIN_DIR, "SaveTXT")
SAVE_PRESET_DIR = os.path.join(PLUGIN_DIR, "SavePreset")

# 确保目录存在
os.makedirs(SAVE_TXT_DIR, exist_ok=True)
os.makedirs(SAVE_PRESET_DIR, exist_ok=True)


def _resolve_txt_path(rel_path):
    """将相对路径解析为绝对路径，防止目录穿越攻击"""
    rel_path = (rel_path or "").replace("\\", "/").strip("/")
    full = os.path.normpath(os.path.join(SAVE_TXT_DIR, *rel_path.split("/")))
    abs_save = os.path.abspath(SAVE_TXT_DIR)
    if not os.path.abspath(full).startswith(abs_save + os.sep) and os.path.abspath(full) != abs_save:
        return None
    return full


def _read_text(full):
    """读取用户 txt，按 BOM 识别编码：UTF-16(BE/LE) 与带 BOM 的 UTF-8 均可读，无 BOM 时按 UTF-8"""
    with open(full, "rb") as f:
        raw = f.read()
    if raw.startswith((b"\xff\xfe", b"\xfe\xff")):
        return raw.decode("utf-16")
    return raw.decode("utf-8-sig")


def _safe_preset_name(name):
    """清理预设名称，移除危险字符"""
    name = (name or "").strip()
    if not name:
        return None
    # 移除路径穿越和系统危险字符
    for ch in ['..', '/', '\\', ':', '<', '>', '"', '|', '?', '*']:
        name = name.replace(ch, "")
    name = name.strip()
    return name if name else None


def build_tree(path):
    """递归构建目录树结构，文件夹优先排序，再排txt文件"""
    folders = []
    files = []
    try:
        entries = sorted(os.listdir(path), key=lambda s: s.lower())
    except Exception:
        entries = []
    for entry in entries:
        full = os.path.join(path, entry)
        if os.path.isdir(full):
            folders.append({
                "name": entry,
                "path": os.path.relpath(full, SAVE_TXT_DIR).replace("\\", "/"),
                "type": "folder",
                "children": build_tree(full)
            })
        elif entry.lower().endswith(".txt"):
            files.append({
                "name": entry,
                "path": os.path.relpath(full, SAVE_TXT_DIR).replace("\\", "/"),
                "type": "file"
            })
    # 文件夹优先于txt文件
    return folders + files


def collect_txt_files(node):
    """递归收集文件夹下所有txt文件"""
    files = []
    if node.get("type") == "file":
        files.append(node)
    elif node.get("type") == "folder":
        for child in node.get("children", []):
            files.extend(collect_txt_files(child))
    return files


# ============ API 路由 ============

@PromptServer.instance.routes.get("/hezl_randomtxt/tree")
async def get_tree(request):
    """获取 SaveTXT 目录树"""
    try:
        tree = build_tree(SAVE_TXT_DIR)
        return web.json_response({"tree": tree})
    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)


@PromptServer.instance.routes.get("/hezl_randomtxt/file")
async def get_file(request):
    """读取指定 txt 文件内容（按行返回），并尝试加载同名 .tr 旁路翻译文件（适配任意语言）。

    与 execute() 保持一致：对每行做 strip() 并过滤空行，.tr 按 .txt 的非空行对齐。
    这样前端缓存的 lines 与后端 execute() 使用的 lines 完全一致，
    使前端能够基于种子预计算随机选取结果（词组按钮预览）。
    """
    try:
        rel_path = request.query.get("path", "")
        full = _resolve_txt_path(rel_path)
        if full is None or not os.path.isfile(full):
            return web.json_response({"error": "File not found"}, status=404)
        raw_lines = _read_text(full).split("\n")
        # 旁路翻译：同名 .txt.tr 文件（行与原文 txt 一一对应，无则返回空数组）
        raw_tr = []
        tr_full = _resolve_txt_path(rel_path + ".tr")
        if tr_full and os.path.isfile(tr_full):
            try:
                raw_tr = _read_text(tr_full).split("\n")
            except Exception:
                raw_tr = []
        # strip + 过滤空行（与 execute() 一致），.tr 按 .txt 非空行对齐
        lines = []
        tr_lines = []
        for i, raw in enumerate(raw_lines):
            stripped = raw.strip()
            if not stripped:
                continue
            lines.append(stripped)
            tr_line = raw_tr[i].strip() if i < len(raw_tr) else ""
            tr_lines.append(tr_line)
        return web.json_response({"lines": lines, "tr_lines": tr_lines})
    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)


@PromptServer.instance.routes.post("/hezl_randomtxt/rename")
async def rename_item(request):
    """重命名 txt 文件或文件夹，并同步重命名同名 .tr 旁路翻译文件"""
    try:
        data = await request.json()
        rel_path = data.get("path", "")
        new_name = (data.get("new_name") or "").strip()
        old_full = _resolve_txt_path(rel_path)
        if old_full is None or not os.path.exists(old_full):
            return web.json_response({"error": "源路径不存在"}, status=404)
        # 名称合法性校验
        if not new_name or "/" in new_name or "\\" in new_name or new_name in (".", ".."):
            return web.json_response({"error": "名称非法"}, status=400)
        if any(c in new_name for c in '<>:"|?*'):
            return web.json_response({"error": "名称含非法字符"}, status=400)
        is_file = os.path.isfile(old_full)
        # txt 文件：自动补 .txt 后缀
        if is_file and not new_name.lower().endswith(".txt"):
            new_name = new_name + ".txt"
        parent = os.path.dirname(old_full)
        new_full = os.path.normpath(os.path.join(parent, new_name))
        abs_save = os.path.abspath(SAVE_TXT_DIR)
        if not os.path.abspath(new_full).startswith(abs_save + os.sep):
            return web.json_response({"error": "目标路径越界"}, status=400)
        if os.path.exists(new_full):
            return web.json_response({"error": "目标名称已存在"}, status=400)
        os.rename(old_full, new_full)
        # txt 文件：同步重命名 .tr 旁路翻译文件
        if is_file and old_full.lower().endswith(".txt"):
            old_tr = old_full + ".tr"
            new_tr = new_full + ".tr"
            if os.path.isfile(old_tr):
                try:
                    os.rename(old_tr, new_tr)
                except Exception:
                    pass
        new_rel = os.path.relpath(new_full, SAVE_TXT_DIR).replace("\\", "/")
        return web.json_response({"ok": True, "new_path": new_rel, "is_file": is_file})
    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)


@PromptServer.instance.routes.get("/hezl_randomtxt/presets")
async def list_presets(request):
    """列出所有预设"""
    try:
        presets = []
        if os.path.isdir(SAVE_PRESET_DIR):
            for f in sorted(os.listdir(SAVE_PRESET_DIR)):
                if f.lower().endswith(".json"):
                    presets.append(f[:-5])
        return web.json_response({"presets": presets})
    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)


@PromptServer.instance.routes.post("/hezl_randomtxt/preset/save")
async def save_preset(request):
    """保存预设"""
    try:
        data = await request.json()
        name = _safe_preset_name(data.get("name", ""))
        if not name:
            return web.json_response({"error": "Invalid name"}, status=400)
        full = os.path.join(SAVE_PRESET_DIR, name + ".json")
        with open(full, "w", encoding="utf-8") as f:
            json.dump(data.get("data", {}), f, ensure_ascii=False, indent=2)
        return web.json_response({"ok": True, "name": name})
    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)


@PromptServer.instance.routes.post("/hezl_randomtxt/preset/load")
async def load_preset(request):
    """加载预设"""
    try:
        data = await request.json()
        name = _safe_preset_name(data.get("name", ""))
        if not name:
            return web.json_response({"error": "Invalid name"}, status=400)
        full = os.path.join(SAVE_PRESET_DIR, name + ".json")
        if not os.path.isfile(full):
            return web.json_response({"error": "Preset not found"}, status=404)
        with open(full, "r", encoding="utf-8") as f:
            preset_data = json.load(f)
        return web.json_response({"data": preset_data})
    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)


@PromptServer.instance.routes.post("/hezl_randomtxt/preset/rename")
async def rename_preset(request):
    """重命名预设"""
    try:
        data = await request.json()
        old = _safe_preset_name(data.get("old", ""))
        new = _safe_preset_name(data.get("new", ""))
        if not old or not new:
            return web.json_response({"error": "Names required"}, status=400)
        old_full = os.path.join(SAVE_PRESET_DIR, old + ".json")
        new_full = os.path.join(SAVE_PRESET_DIR, new + ".json")
        if not os.path.isfile(old_full):
            return web.json_response({"error": "Preset not found"}, status=404)
        os.rename(old_full, new_full)
        return web.json_response({"ok": True, "name": new})
    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)


@PromptServer.instance.routes.post("/hezl_randomtxt/preset/delete")
async def delete_preset(request):
    """删除预设"""
    try:
        data = await request.json()
        name = _safe_preset_name(data.get("name", ""))
        if not name:
            return web.json_response({"error": "Invalid name"}, status=400)
        full = os.path.join(SAVE_PRESET_DIR, name + ".json")
        if os.path.isfile(full):
            os.remove(full)
        return web.json_response({"ok": True})
    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)


# ============ 节点类 ============

class HezlRandomTXT:
    """随机提示词节点：从SaveTXT目录中选择txt文件，随机或指定输出词组"""

    CATEGORY = "Hezl-Node/Prompt"
    FUNCTION = "execute"
    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("text",)
    OUTPUT_NODE = False

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "config": ("STRING", {"default": "{}", "multiline": False}),
            },
        }

    @classmethod
    def IS_CHANGED(cls, config):
        # 始终重新执行，支持随机模式
        return float("nan")

    def execute(self, config):
        try:
            cfg = json.loads(config) if config else {}
        except Exception:
            cfg = {}

        # ====== 旧格式兼容 ======
        # 旧 config 顶层为 {seed, merge_enabled, merge_count, items:[...]}（单组扁平结构）。
        # 新 config 顶层为 {groups:[{name, seed, seed_mode, merge_enabled, merge_count, separator, items:[...]}]}。
        # 检测到旧格式（有 items 无 groups）时包装成单个默认分组，保证旧预设/PNG 元数据可执行。
        if "items" in cfg and "groups" not in cfg:
            groups = [{
                "name": "默认分组",
                "seed": cfg.get("seed", 0),
                "seed_mode": cfg.get("seed_mode", "random"),
                "merge_enabled": cfg.get("merge_enabled", False),
                "merge_count": cfg.get("merge_count", 1),
                "separator": ", ",
                "items": cfg.get("items", []),
            }]
        else:
            groups = cfg.get("groups", [])

        # ====== 逐组处理，每组独立 seed / 合并 / 拼接 ======
        # 每组用各自 seed 构建 RNG：前端在"随机模式"下每次执行前为该组生成新种子并写入 config，
        # "固定模式"下保持不变。PNG 元数据中保存的 seed 即各组实际使用的种子，拖放复现一致。
        group_outputs = []  # [(group_out, group_separator)] 仅收集非空组

        for group in groups:
            seed = int(group.get("seed", 0))
            rng = random.Random(seed)

            # 合并随机输出模式（组内独立）：从本组已启用txt的词组池随机选取 N 个
            merge_enabled = bool(group.get("merge_enabled", False))
            merge_count = int(group.get("merge_count", 1))
            if merge_count < 1:
                merge_count = 1

            enabled = []  # [(line, sep_after)]
            all_lines_pool = []  # 本组词组池

            for item in group.get("items", []):
                if not item.get("enabled", False):
                    continue

                rel_path = item.get("path", "")
                full = _resolve_txt_path(rel_path)
                if full is None or not os.path.isfile(full):
                    continue

                try:
                    lines = [l.strip() for l in _read_text(full).split("\n") if l.strip()]
                except Exception:
                    continue

                if not lines:
                    continue

                all_lines_pool.extend(lines)

                if item.get("random", False):
                    line = rng.choice(lines)
                else:
                    idx = int(item.get("selected_line", 0))
                    if idx < 0 or idx >= len(lines):
                        idx = 0
                    line = lines[idx]

                sep = item.get("separator", ",")
                if sep is None:
                    sep = ","
                enabled.append((line, sep))

            # ====== 组内输出 ======
            if merge_enabled:
                if not all_lines_pool:
                    group_out = ""
                else:
                    n = min(merge_count, len(all_lines_pool))
                    group_out = ", ".join(rng.sample(all_lines_pool, n))
            else:
                if not enabled:
                    group_out = ""
                else:
                    parts = []
                    for i, (line, sep) in enumerate(enabled):
                        parts.append(line)
                        if i < len(enabled) - 1:
                            parts.append(sep)
                    group_out = "".join(parts)

            if group_out:
                gsep = group.get("separator", ", ")
                if gsep is None:
                    gsep = ", "
                group_outputs.append((group_out, gsep))

        # ====== 组间拼接：各组输出按组顺序用各组 separator 连接成单 STRING ======
        if not group_outputs:
            return ("",)
        result_parts = []
        for i, (out, sep) in enumerate(group_outputs):
            result_parts.append(out)
            if i < len(group_outputs) - 1:
                result_parts.append(sep)
        return ("".join(result_parts),)
