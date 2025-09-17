"""
This script fixes the ANTIALIAS deprecation issue in EasyOCR by replacing it with
the new Resampling.LANCZOS constant.
"""
import os
from pathlib import Path

def fix_easyocr_antialias():
    # Get the site-packages directory
    site_packages = str(Path(__file__).parent / '.venv' / 'Lib' / 'site-packages')
    
    # Path to the utils.py file in easyocr
    utils_path = Path(site_packages) / 'easyocr' / 'utils.py'
    
    if not utils_path.exists():
        print(f"Error: Could not find EasyOCR utils.py at {utils_path}")
        return False
        
    # Read the file content
    content = utils_path.read_text(encoding='utf-8')
    
    # Replace ANTIALIAS with Resampling.LANCZOS
    if 'Image.ANTIALIAS' in content:
        content = content.replace(
            'Image.ANTIALIAS',
            'Image.Resampling.LANCZOS'
        )
        
        # Write back the modified content
        utils_path.write_text(content, encoding='utf-8')
        print(f"✅ Successfully patched {utils_path}")
        return True
    else:
        print("⚠️ No ANTIALIAS reference found in the file. It may already be fixed.")
        return False

if __name__ == '__main__':
    fix_easyocr_antialias()