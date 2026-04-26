"""
Redimensionne tous les PNG de npc-ennemis/monstres (et sous-dossiers) en 128x128
et les déplace à la racine de monstres/.
Usage : python resize_portraits.py
"""

from PIL import Image
import os
import shutil

SRC = r"G:\GITHUB\arcanumSite\arcanum\docs\img\portraits\npc-ennemis\monstres\HD"
DST = r"G:\GITHUB\arcanumSite\arcanum\docs\img\portraits\npc-ennemis\monstres"
SIZE = (128, 128)

processed = []
skipped = []

for root, dirs, files in os.walk(SRC):
    for fname in files:
        if not fname.lower().endswith(".png"):
            continue
        src_path = os.path.join(root, fname)
        dst_path = os.path.join(DST, fname.lower())

        try:
            with Image.open(src_path) as img:
                img = img.convert("RGBA")
                img = img.resize(SIZE, Image.LANCZOS)
                img.save(dst_path, "PNG", optimize=True)

            # Supprime le fichier source HD après conversion
            os.remove(src_path)

            processed.append(fname.lower())
            print(f"  OK  {fname} -> {dst_path}  ({SIZE[0]}x{SIZE[1]})")

        except Exception as e:
            skipped.append((fname, str(e)))
            print(f"  ERR {fname} : {e}")

# Supprime le dossier HD s'il est vide
if os.path.isdir(SRC) and not os.listdir(SRC):
    os.rmdir(SRC)
    print(f"  Dossier HD supprimé (vide)")

print(f"\nTerminé : {len(processed)} fichier(s) redimensionné(s), {len(skipped)} erreur(s).")
if skipped:
    for name, err in skipped:
        print(f"  - {name} : {err}")
