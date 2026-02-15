"""
Extract KEY FACTS from RAG PDFs and create a condensed knowledge base.
Focus on: nutrition stats, WHO guidelines, POSHAN data, treatment protocols.
"""
import pdfplumber
import os
import re

folder = r'c:\Users\omkar\OneDrive\Documents\diyacniszipped\cnis-app\public\pdf_of_rag'
output = r'c:\Users\omkar\OneDrive\Documents\diyacniszipped\cnis-app\src\data\ragPdfKnowledge.js'

# Keywords that indicate important health/nutrition content
HEALTH_KEYWORDS = [
    'stunting', 'wasting', 'underweight', 'malnutrition', 'malnourished',
    'anemia', 'anaemia', 'breastfeeding', 'complementary feeding',
    'micronutrient', 'vitamin', 'iron', 'zinc', 'iodine', 'calcium', 'folate', 'folic',
    'immunization', 'vaccination', 'polio', 'measles', 'bcg',
    'diarrhea', 'diarrhoea', 'pneumonia', 'fever', 'dehydration',
    'ors', 'oral rehydration', 'therapeutic food', 'rutf',
    'sam', 'mam', 'severe acute', 'moderate acute',
    'muac', 'mid-upper arm', 'bmi', 'z-score', 'weight-for-height', 'height-for-age',
    'nfhs', 'poshan', 'icds', 'anganwadi', 'asha',
    'who', 'unicef', 'guideline', 'recommendation', 'protocol',
    'mortality', 'morbidity', 'prevalence', 'incidence',
    'infant', 'child', 'newborn', 'neonatal', 'maternal',
    'protein', 'calorie', 'energy', 'nutrient', 'diet', 'food',
    'growth', 'development', 'anthropometric',
    'india', 'indian', 'rural', 'urban', 'tribal',
    'maharashtra', 'uttar pradesh', 'bihar', 'madhya pradesh', 'rajasthan',
    'district', 'state', 'national',
    'percentage', 'percent', '%',
]

def relevance_score(text):
    """Score how relevant a paragraph is to child nutrition/health."""
    text_lower = text.lower()
    score = 0
    for kw in HEALTH_KEYWORDS:
        count = text_lower.count(kw)
        score += count
    # Bonus for sentences with numbers/percentages (stats)
    numbers = len(re.findall(r'\d+\.?\d*\s*%', text))
    score += numbers * 3
    return score

def extract_key_content(pdf_path, max_chars=15000):
    """Extract the most relevant paragraphs from a PDF."""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            all_paragraphs = []
            for page in pdf.pages:
                text = page.extract_text()
                if not text:
                    continue
                # Split into paragraphs
                paras = re.split(r'\n\s*\n', text)
                for para in paras:
                    para = ' '.join(para.split())  # Normalize whitespace
                    if len(para) > 50:  # Skip tiny fragments
                        score = relevance_score(para)
                        if score > 2:  # Only keep somewhat relevant content
                            all_paragraphs.append((score, para))
            
            # Sort by relevance and take top content
            all_paragraphs.sort(key=lambda x: -x[0])
            
            result = []
            total_len = 0
            for score, para in all_paragraphs:
                if total_len + len(para) > max_chars:
                    break
                result.append(para)
                total_len += len(para)
            
            return result
    except Exception as e:
        print(f"  ERROR: {e}")
        return []

# Process all PDFs
all_knowledge = []
print("Extracting key health/nutrition content from PDFs...\n")

for f in sorted(os.listdir(folder)):
    if not f.endswith('.pdf'):
        continue
    path = os.path.join(folder, f)
    print(f"  {f}...", end=" ")
    paragraphs = extract_key_content(path, max_chars=12000)
    if paragraphs:
        all_knowledge.append({
            'filename': f,
            'paragraphs': paragraphs
        })
        total_chars = sum(len(p) for p in paragraphs)
        print(f"OK ({len(paragraphs)} key paragraphs, {total_chars} chars)")
    else:
        print("No relevant content found")

# Build JS file
js_lines = []
js_lines.append('/**')
js_lines.append(' * RAG Knowledge Base - Key health/nutrition facts extracted from PDFs')
js_lines.append(' * Sources: WHO guidelines, NFHS-5 reports, POSHAN Abhiyaan, UNICEF, FAO')
js_lines.append(' * Auto-generated - contains only the most relevant paragraphs')
js_lines.append(' */')
js_lines.append('')
js_lines.append('export const ragKnowledgeBase = [')

for doc in all_knowledge:
    js_lines.append('  {')
    fname = doc['filename'].replace("'", "\\'")
    js_lines.append(f"    source: '{fname}',")
    js_lines.append(f"    paragraphs: [")
    for para in doc['paragraphs']:
        # Escape for JS
        escaped = para.replace('\\', '\\\\').replace("'", "\\'").replace('\n', ' ')
        js_lines.append(f"      '{escaped}',")
    js_lines.append(f"    ],")
    js_lines.append('  },')

js_lines.append('];')
js_lines.append('')
js_lines.append('/**')
js_lines.append(' * Search the knowledge base for relevant content')
js_lines.append(' * Uses keyword matching to find the most relevant paragraphs')
js_lines.append(' * @param {string} query - User question')
js_lines.append(' * @param {number} maxResults - Max paragraphs to return')
js_lines.append(' * @returns {Array} Top matching paragraphs with source info')
js_lines.append(' */')
js_lines.append('export function searchRagKnowledge(query, maxResults = 5) {')
js_lines.append('  const words = query.toLowerCase().split(/\\s+/).filter(w => w.length > 2);')
js_lines.append('  const results = [];')
js_lines.append('')
js_lines.append('  for (const doc of ragKnowledgeBase) {')
js_lines.append('    for (const para of doc.paragraphs) {')
js_lines.append('      const paraLower = para.toLowerCase();')
js_lines.append('      let score = 0;')
js_lines.append("      for (const w of words) {")
js_lines.append("        const matches = (paraLower.match(new RegExp(w, 'g')) || []).length;")
js_lines.append('        score += matches;')
js_lines.append('      }')
js_lines.append('      if (score > 0) {')
js_lines.append('        results.push({ score, source: doc.source, text: para });')
js_lines.append('      }')
js_lines.append('    }')
js_lines.append('  }')
js_lines.append('')
js_lines.append('  results.sort((a, b) => b.score - a.score);')
js_lines.append('  return results.slice(0, maxResults);')
js_lines.append('}')

js_content = '\n'.join(js_lines) + '\n'

with open(output, 'w', encoding='utf-8') as f:
    f.write(js_content)

total_paras = sum(len(d['paragraphs']) for d in all_knowledge)
file_size = len(js_content) / 1024
print(f"\n✅ Written: {output}")
print(f"   Documents: {len(all_knowledge)}")
print(f"   Key paragraphs: {total_paras}")
print(f"   File size: {file_size:.0f} KB")
