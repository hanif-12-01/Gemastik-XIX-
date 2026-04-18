import re

filepath = r"D:\LOMBA\GEMASTIK\echothread-superadmin-app\ecothread_dashboard.jsx"

with open(filepath, "r", encoding="utf-8") as f:
    text = f.read()

# Add missing icons to the import statement
text = re.sub(
    r'} from \'lucide-react\';',
    r', ShieldCheck, Scissors } from \'lucide-react\';',
    text,
    count=1
)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(text)

print("Icons added.")
