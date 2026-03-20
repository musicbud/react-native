import os
import re
import glob

def find_tsx_files(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') and 'SafeImage' not in file:
                yield os.path.join(root, file)

target_files = [
    'src/screens/HomeScreen.tsx',
    'src/screens/DiscoverScreen.tsx',
    'src/screens/DetailsScreen.tsx',
    'src/screens/LibraryScreen.tsx',
    'src/screens/SearchScreen.tsx',
    'src/screens/EventScreen.tsx',
    'src/screens/EventsScreen.tsx',
    'src/screens/ChatScreen.tsx',
    'src/components/common/TrackCard.tsx',
    'src/components/common/MiniPlayer.tsx'
]

for path_rel in target_files:
    path = os.path.join('/home/mahmoud/Documents/GitHub/musicbud/react-native', path_rel)
    if not os.path.exists(path):
        continue
        
    with open(path, 'r') as f:
        content = f.read()
    
    if '<Image' in content:
        # Determine relative path for import
        depth = path_rel.count('/') - 1
        prefix = '../' * depth if depth > 0 else './'
        if 'components/common' in path_rel:
            prefix = './'
        elif 'screens' in path_rel:
            prefix = '../components/common/'
        
        import_stat = f"import {{ SafeImage }} from '{prefix}SafeImage';"
        
        if 'import { SafeImage' not in content:
            # Find the first import statement and append after it
            content = re.sub(r'(import .* from.*)', r'\1\n' + import_stat, content, count=1)
            
        content = content.replace('<Image', '<SafeImage').replace('</Image>', '</SafeImage>')
        
        with open(path, 'w') as f:
            f.write(content)
        print(f"Updated {path}")
