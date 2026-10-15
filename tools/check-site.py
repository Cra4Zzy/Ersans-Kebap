from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,re,subprocess
ROOT=Path(__file__).resolve().parents[1]
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.tags=[];self.h1_count=0;self.ids=[]
 def handle_starttag(self,t,a):
  a=dict(a);self.tags.append((t,a))
  if t=='h1':self.h1_count+=1
  if a.get('id'):self.ids.append(a['id'])
errors=[];pages=[ROOT/'index.html',*sorted((ROOT/'html').glob('*.html'))]
parsed={}
for p in pages:
 parser=Parser();parser.feed(p.read_text());parsed[p.resolve()]=parser
 if parser.h1_count!=1:errors.append(f'{p.name}: expected one h1')
 if len(parser.ids)!=len(set(parser.ids)):errors.append(f'{p.name}: duplicate HTML IDs')
 for t,a in parser.tags:
  if t=='img' and not a.get('alt'):errors.append(f'{p.name}: missing image alt')
  if t=='a' and a.get('target')=='_blank' and 'noopener' not in a.get('rel',''):errors.append(f'{p.name}: missing noopener')
  for attr in ['src','href']:
   v=a.get(attr,'');u=urlsplit(v)
   if not v or u.scheme or u.netloc or not u.path:continue
   local=(p.parent/unquote(u.path)).resolve()
   if not local.exists():errors.append(f'{p.name}: missing asset {v}')
 for v in ['tel:+49XXXXXXXXXX','fonts.googleapis.com','onerror=']:
  if v in p.read_text():errors.append(f'{p.name}: obsolete placeholder/dependency {v}')
for p,parser in parsed.items():
 for t,a in parser.tags:
  if t!='a':continue
  u=urlsplit(a.get('href',''))
  if u.scheme or u.netloc or not u.fragment:continue
  dest=(p.parent/unquote(u.path)).resolve() if u.path else p
  if dest in parsed and u.fragment not in parsed[dest].ids:errors.append(f'{p.name}: missing anchor {a["href"]}')
css=(ROOT/'css/styles.css').read_text()
for url in re.findall(r'url\([\'"]?([^\)\'\"]+)',css):
 if not url.startswith(('http','data:')) and not (ROOT/'css'/url).resolve().exists():errors.append('Missing CSS asset '+url)
menu=json.loads((ROOT/'data/menu.json').read_text());total=sum(len(g['items']) for g in menu)
assert total==64
page=(ROOT/'html/menu.html').read_text()
for g in menu:
 for item in g['items']:
  if item['price'] not in page:errors.append('Missing price '+item['price'])
if page.count('data-menu-item')!=64:errors.append('Wrong rendered menu item count')
if 'https://formspree.io/f/mbdknvvg' not in (ROOT/'html/kontakt.html').read_text():errors.append('Changed form endpoint')
if (ROOT/'CNAME').read_text().strip()!='www.ersans-kebap.de':errors.append('Changed domain')
for image in (ROOT/'img/optimized').glob('*.webp'):
 b=image.read_bytes()
 if b[:4]!=b'RIFF' or b[8:12]!=b'WEBP':errors.append('Invalid WebP '+image.name)
assert not errors,'\n'.join(errors)
print('PASS:',len(pages),'pages; internal routes, anchors, images, fonts and external link attributes')
print('PASS: 64 menu entries, original prices, original form endpoint and domain preserved')
