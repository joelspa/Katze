import os

files_to_fix = [
    r'C:\Users\joela\Documents\UDI\II-2025\Desarrollo de aplicaciones Web\Katze\frontend\src\pages\Profile.tsx',
    r'C:\Users\joela\Documents\UDI\II-2025\Desarrollo de aplicaciones Web\Katze\frontend\src\pages\PublishCat.tsx',
    r'C:\Users\joela\Documents\UDI\II-2025\Desarrollo de aplicaciones Web\Katze\frontend\src\pages\RescuerDashboard.tsx',
    r'C:\Users\joela\Documents\UDI\II-2025\Desarrollo de aplicaciones Web\Katze\frontend\src\pages\Statistics.tsx',
    r'C:\Users\joela\Documents\UDI\II-2025\Desarrollo de aplicaciones Web\Katze\frontend\src\pages\TrackingDashboard.tsx'
]

import_line = "import { API_BASE_URL } from '../config/api';\n"

for file_path in files_to_fix:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'API_BASE_URL' not in content:
        # Find the last import statement
        lines = content.split('\n')
        import_index = -1
        for i, line in enumerate(lines):
            if line.startswith('import '):
                import_index = i
        
        if import_index >= 0:
            lines.insert(import_index + 1, import_line.rstrip())
            content = '\n'.join(lines)
            
            with open(file_path, 'w', encoding='utf-8', newline='') as f:
                f.write(content)
            print(f"✅ {os.path.basename(file_path)}")

print("\n✅ Todos los imports agregados correctamente")
