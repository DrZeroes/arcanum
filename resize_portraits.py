"""
Redimensionne tous les PNG des dossiers HD en 128x128
et les déplace dans le dossier parent.

  monstres/HD  -> monstres/
  unique/HD    -> unique/

Usage : python resize_portraits.py
"""

from PIL import Image
import os

BASE = r"G:\GITHUB\arcanumSite\arcanum\docs\img\portraits\npc-ennemis"

JOBS = [
    (os.path.join(BASE, "monstres", "HD"), os.path.join(BASE, "monstres")),
    (os.path.join(BASE, "unique",   "HD"), os.path.join(BASE, "unique")),
]

SIZE = (128, 128)

total_ok  = 0
total_err = 0

for SRC, DST in JOBS:
    if not os.path.isdir(SRC):
        print(f"  SKIP  {SRC}  (dossier absent)")
        continue

    print(f"\n-- {SRC}")
    processed, skipped = [], []

    for root, dirs, files in os.walk(SRC):
        for fname in files:
            if not fname.lower().endswith(".png"):
                continue
            src_path = os.path.join(root, fname)
            dst_path = os.path.join(DST, fname)

            try:
                with Image.open(src_path) as img:
                    img = img.convert("RGBA")
                    img = img.resize(SIZE, Image.LANCZOS)
                    img.save(dst_path, "PNG", optimize=True)
                os.remove(src_path)
                processed.append(fname)
                print(f"  OK   {fname}")
            except Exception as e:
                skipped.append((fname, str(e)))
                print(f"  ERR  {fname} : {e}")

    if os.path.isdir(SRC) and not os.listdir(SRC):
        os.rmdir(SRC)
        print(f"  Dossier HD supprimé (vide)")

    print(f"  -> {len(processed)} OK, {len(skipped)} erreur(s)")
    total_ok  += len(processed)
    total_err += len(skipped)

print(f"\nTotal : {total_ok} converti(s), {total_err} erreur(s).")
