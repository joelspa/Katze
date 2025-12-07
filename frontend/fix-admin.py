import re

file_path = r'C:\Users\joela\Documents\UDI\II-2025\Desarrollo de aplicaciones Web\Katze\frontend\src\pages\AdminDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Agregar import si no existe
if 'API_BASE_URL' not in content:
    content = content.replace(
        "import { useAuth } from '../context/AuthContext';",
        "import { useAuth } from '../context/AuthContext';\nimport { API_BASE_URL } from '../config/api';"
    )

# Reemplazar todas las URLs hardcodeadas
content = re.sub(r"'http://localhost:5000", "`${API_BASE_URL}", content)
content = re.sub(r"`http://localhost:5000", "`${API_BASE_URL}", content)

# Corregir comillas mixtas - template literal debe terminar con backtick
content = re.sub(r"`(\$\{API_BASE_URL\}[^'`]*)'", r'`\1`', content)

with open(file_path, 'w', encoding='utf-8', newline='') as f:
    f.write(content)

print("✅ AdminDashboard actualizado correctamente")
