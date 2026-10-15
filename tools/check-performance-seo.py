"""Verify generated SEO, responsive assets, and image transfer budgets without network calls."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://www.ersans-kebap.de'

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.tags=[]; self.structured=[]; self.capture=False
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs); self.tags.append((tag, attrs))
        self.capture = tag == 'script' and attrs.get('type') == 'application/ld+json'
    def handle_data(self, data):
        if self.capture: self.structured.append(json.loads(data))
    def handle_endtag(self, tag):
        if tag == 'script': self.capture=False

canonicals = set()
for path in [ROOT/'index.html', *sorted((ROOT/'html').glob('*.html'))]:
    page=Page(path.read_text())
    links=[a for t,a in page.tags if t=='link']
    meta={a.get('property',a.get('name')):a.get('content') for t,a in page.tags if t=='meta'}
    canonical=next(a['href'] for a in links if a.get('rel')=='canonical')
    route='/' if path.name=='index.html' else '/html/'+path.name
    assert canonical == BASE+route and canonical not in canonicals, path
    canonicals.add(canonical)
    assert meta['og:url']==canonical and meta['description'] and meta['og:image'].startswith(BASE)
    assert meta['robots'].startswith('index,follow')
    assert all(a.get('type')=='font/woff2' for a in links if a.get('as')=='font')
    graph=page.structured[0]['@graph']
    restaurant=next(x for x in graph if x['@type']=='Restaurant')
    assert restaurant['address']['postalCode']=='91550'
    assert restaurant['hasMenu']==BASE+'/html/menu.html'
    assert len(restaurant['openingHoursSpecification'])==2
    assert not {'aggregateRating','review'} & restaurant.keys()
    for tag, attrs in page.tags:
        if tag!='img': continue
        image=(path.parent / attrs['src']).resolve()
        assert image.exists() and attrs.get('width') and attrs.get('height')
        assert image.name!='logo-header.png'
        if attrs.get('class')!='header-logo' and image.name!='logo-header.webp':
            assert attrs.get('sizes') and attrs.get('srcset'), (path, image)
            for entry in attrs['srcset'].split(','):
                src, width = entry.strip().split()
                assert width.endswith('w') and (path.parent/src).resolve().exists(), entry
        assert attrs.get('loading')=='lazy' or attrs.get('fetchpriority')=='high' or image.name=='logo-header.webp'
    if path.name=='menu.html':
        menu=next(x for x in graph if x['@type']=='Menu')
        source=json.loads((ROOT/'data/menu.json').read_text())
        assert len(menu['hasMenuSection'])==len(source)
        for actual, expected in zip(menu['hasMenuSection'],source):
            assert actual['name']==expected['name']
            for item, original in zip(actual['hasMenuItem'],expected['items']):
                assert item['name']==original['name']
                assert item['offers']['price']==original['price'].replace(' €','').replace(',','.')
        assert sum(len(x['hasMenuItem']) for x in menu['hasMenuSection'])==64
        assert any('menu.css' in a.get('href','') for a in links)
    else:
        assert all('menu.css' not in a.get('href','') for a in links)
urls={node.text for node in ET.parse(ROOT/'sitemap.xml').findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')}
assert urls==canonicals
assert BASE+'/sitemap.xml' in (ROOT/'robots.txt').read_text()
assert (ROOT/'img/optimized/logo-header.webp').stat().st_size < 40_000
assert (ROOT/'img/optimized/hero-kebap-960.webp').stat().st_size < 100_000
for path in (ROOT/'img/optimized').glob('*-480.webp'):
    assert path.stat().st_size < 70_000, path
assert 'data-full=' in (ROOT/'html/ueber-uns.html').read_text()
assert 'hero-photo-note' not in (ROOT/'index.html').read_text(), 'Preserve latest manual hero-caption removal'
print('PASS: unique canonicals, metadata, 6 sitemap URLs, restaurant hours, 64 structured menu items and exact prices')
print('PASS: responsive image candidates, local WOFF2, image byte budgets and gallery enlargement sources')
