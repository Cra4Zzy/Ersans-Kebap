"""Guard contact-form CSS breakpoints. Static cascade check, not browser rendering."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def rules(css, viewport):
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    pos = 0
    while (opening := css.find('{', pos)) != -1:
        selector = css[pos:opening].strip()
        depth, end = 1, opening + 1
        while depth and end < len(css):
            depth += (css[end] == '{') - (css[end] == '}')
            end += 1
        assert depth == 0, 'Unbalanced CSS block'
        body = css[opening + 1:end - 1]
        if selector.startswith('@media'):
            bounds = re.findall(r'(min|max)-width:\s*([\d.]+)px', selector)
            if bounds and all(viewport >= float(v) if k == 'min' else viewport <= float(v) for k, v in bounds):
                yield from rules(body, viewport)
        elif not selector.startswith('@'):
            yield [s.strip() for s in selector.split(',')], dict(
                (key.strip(), value.strip()) for declaration in body.split(';')
                if ':' in declaration for key, value in [declaration.split(':', 1)]
            )
        pos = end


def computed(css, selector, viewport):
    result = {}
    for selectors, declarations in rules(css, viewport):
        if selector in selectors:
            result.update(declarations)
    return result


css = (ROOT / 'css/styles.css').read_text()
for width in [320, 360, 390, 430, 640, 768, 900]:
    tracks = computed(css, '.contact-section', width)['grid-template-columns']
    assert tracks == 'minmax(0, 1fr)', f'{width}px contact layout has extra columns: {tracks}'
    assert computed(css, '.form-grid', width)['grid-template-columns'] in ['1fr', 'minmax(0, 1fr)']
    assert computed(css, '.preorder-panel', width)['width'] == '100%'
    if width <= 640:
        assert computed(css, '.form-footer', width)['flex-direction'] == 'column'
        assert computed(css, '.form-footer .button', width)['width'] == '100%'
for width in [1024, 1280, 1600]:
    assert computed(css, '.contact-section', width)['grid-template-columns'] == 'minmax(0, 1fr) minmax(0, 1.5fr)'
page = (ROOT / 'html/kontakt.html').read_text()
assert page.index('id="preorder-notice"') < page.index('id="preorderForm"')
assert 'Mindestens 1 Tag vorher bestellen.' in page
assert 'Unsere persönliche Bestätigung abwarten.' in page
assert 'aria-describedby="preorder-notice"' in page
print('PASS: contact/form CSS cascade at 320–1600px; full-width mobile submit; visible advance-order and confirmation notice')
