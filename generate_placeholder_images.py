"""
生成示例占位图片，用于演示网站效果
"""
import os

# 使用 SVG 生成示例图片（作为 HTML 占位图，无需 PIL）
selectable_dir = r"C:\Users\DELL\WorkBuddy\20260501160532\my-website\images\selectable"
results_dir = r"C:\Users\DELL\WorkBuddy\20260501160532\my-website\images\results"

os.makedirs(selectable_dir, exist_ok=True)
os.makedirs(results_dir, exist_ok=True)

# 可选图片配置
selectables = [
    ("a", "图片 A", "#FF6B6B"),
    ("b", "图片 B", "#4ECDC4"),
    ("c", "图片 C", "#45B7D1"),
    ("d", "图片 D", "#96CEB4"),
]

# 结果图片配置
results = [
    ("ab", "A + B", "#FF9A9E"),
    ("ac", "A + C", "#A8EDEA"),
    ("ad", "A + D", "#FFECD2"),
    ("bc", "B + C", "#D4FC79"),
    ("bd", "B + D", "#96E6A1"),
    ("cd", "C + D", "#F093FB"),
]

def make_svg(label, bg_color, emoji="🖼️"):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <rect width="200" height="200" fill="{bg_color}" rx="10"/>
  <text x="100" y="85" text-anchor="middle" font-size="48" font-family="serif">{emoji}</text>
  <text x="100" y="130" text-anchor="middle" font-size="20" font-family="Arial" fill="white" font-weight="bold">{label}</text>
  <text x="100" y="155" text-anchor="middle" font-size="12" font-family="Arial" fill="rgba(255,255,255,0.8)">示例图片</text>
</svg>'''

emojis = ["🌸", "🌿", "🌊", "🍁", "✨", "🎨", "🦋", "🌟", "🍀", "🌙"]

# 生成可选图片（SVG 格式）
for i, (name, label, color) in enumerate(selectables):
    svg_path = os.path.join(selectable_dir, f"{name}.svg")
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(make_svg(label, color, emojis[i % len(emojis)]))
    print(f"✅ 生成可选图片: {svg_path}")

# 生成结果图片（SVG 格式）
result_emojis = ["💫", "🌈", "🎭", "🎪", "🎠", "🎡"]
for i, (name, label, color) in enumerate(results):
    svg_path = os.path.join(results_dir, f"{name}.svg")
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(make_svg(label, color, result_emojis[i % len(result_emojis)]))
    print(f"✅ 生成结果图片: {svg_path}")

print("\n所有示例图片生成完毕！")
