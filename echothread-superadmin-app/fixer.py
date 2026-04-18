import re

path = 'D:/LOMBA/GEMASTIK/echothread-superadmin-app/ecothread_dashboard.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Fix <aside className={g-white ... \}>
text = re.sub(
    r'<aside className=\{g-white border-r border-gray-100 flex flex-col\s+transition-all duration-300 \\?\}>',
    r'<aside className={g-white border-r border-gray-100 flex flex-col transition-all duration-300 }>',
    text
)

text = re.sub(
    r'<aside className=\{g-white border-r border-gray-100 flex flex-col transition-all duration-300 \\?\}>',
    r'<aside className={g-white border-r border-gray-100 flex flex-col transition-all duration-300 }>',
    text
)

# Fix className={w-full flex items-center ... \}
text = re.sub(
    r'className=\{w-full flex items-center gap-3 px-3 py-2\.5 rounded-xl\s+transition-all \\?\}',
    r'className={w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all }',
    text
)

text = re.sub(
    r'className=\{w-full flex items-center gap-3 px-3 py-2\.5 rounded-xl transition-all \\?\}',
    r'className={w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all }',
    text
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
print("Regex replacements applied")
