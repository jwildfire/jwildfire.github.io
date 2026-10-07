# Builds quality-checkin-mock.html from the deck's own styles. Mock only: nothing here is in slides.html.
import re
deck=open('../../../slides.html',encoding='utf8').read()
head=deck[deck.index('<link href="https://fonts.googleapis.com'):deck.index('</style>')+len('</style>')]
head=head.replace('url(assets/','url(../../../assets/')
css='''
<style>
  body { overflow: auto; background: #e9e9e6; }
  .deck { position: static; display: block; padding: 30px 0; }
  .slide { position: relative; display: flex; left: auto; top: auto; margin: 0 auto 40px; transform: none; }
  .label { width: 1600px; margin: 0 auto 10px; font: 500 22px/1.3 "IBM Plex Mono", monospace; color: #444; }

  /* Quality check-in (class "s-qc"): Inspector Orange asks the same question at each stage.
     --v is the verdict's colour. People are ink, agents purple, as on the lifecycle slides. */
  .s-qc { padding-top: 92px; }
  .s-qc .kicker { margin-bottom: 22px; }
  .s-qc .qa { display: grid; grid-template-columns: 176px minmax(0, 580px) 1fr; align-items: center; column-gap: 30px; min-height: 203px; }
  .s-qc .insp { width: 176px; height: 203px; background: url(../../../assets/hex/orange-question.png) center / contain no-repeat; }
  .s-qc .bub { position: relative; background: #fbf1e0; border: 3px solid var(--spec-1); border-radius: 26px; padding: 18px 30px 20px; }
  .s-qc .bub::before { content: ""; position: absolute; left: -15px; top: 50%; width: 24px; height: 24px; margin-top: -12px; background: #fbf1e0; border-left: 3px solid var(--spec-1); border-bottom: 3px solid var(--spec-1); transform: rotate(45deg); }
  .s-qc .q { font-family: var(--mono); font-size: 20px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--soft); margin: 0 0 6px; line-height: 1.3; max-width: none; }
  .s-qc .bub .a { font-family: var(--serif); font-size: 58px; line-height: 1.05; margin: 0; white-space: nowrap; }
  .s-qc .verdict { border-left: 10px solid var(--v); padding: 4px 0 6px 30px; margin-left: 14px; }
  .s-qc .verdict .a { font-family: var(--serif); font-size: 78px; line-height: 1.02; margin: 0; max-width: none; }
  .s-qc .rows { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 30px; }
  .s-qc .r { background: var(--panel); border: 2px solid var(--rule); border-top: 8px solid var(--v); border-radius: 20px; padding: 20px 26px 22px; }
  .s-qc .r h3 { font-family: var(--mono); font-size: 22px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--soft); margin: 0 0 12px; }
  .s-qc .r .who { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 12px; }
  .s-qc .chip { font-size: 25px; font-weight: 600; border-radius: 999px; padding: 3px 18px; border: 3px solid var(--ink); color: var(--ink); background: var(--panel); }
  .s-qc .chip.ai { border-color: var(--spec-5); background: var(--spec-5); color: #fff; }
  .s-qc .chip.none { border: 3px dashed var(--faint); color: var(--soft); }
  .s-qc .r p { font-size: 26px; line-height: 1.3; margin: 0; max-width: none; }
  .s-qc .under { font-size: 28px; color: var(--soft); margin: 20px 0 0; max-width: none; }
  .s-qc .arc { list-style: none; margin: 22px 0 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .s-qc .arc li { display: grid; grid-template-columns: 40px 1fr; align-items: center; gap: 12px; padding: 8px 14px; border: 2px solid var(--rule); border-radius: 14px; font-size: 22px; line-height: 1.2; color: var(--faint); }
  .s-qc .arc li i { width: 36px; height: 41px; clip-path: var(--hex-clip); background: var(--rule); display: grid; place-items: center; font: 400 22px/1 var(--serif); font-style: normal; color: #fff; }
  .s-qc .arc li.done { color: var(--soft); } .s-qc .arc li.done i { background: var(--c); }
  .s-qc .arc li.on { color: var(--ink); border: 3px solid var(--c); background: var(--panel); font-weight: 600; } .s-qc .arc li.on i { background: var(--c); }
  .s-qc .arc small { display: block; font-family: var(--mono); font-size: 16px; font-weight: 400; letter-spacing: 0.08em; text-transform: uppercase; color: var(--soft); }
  .s-qc .guess { position: absolute; right: 140px; top: 96px; }

  /* Slide 26: the inspector is waved off. */
  .waved { position: absolute; right: 140px; bottom: 104px; display: grid; grid-template-columns: auto 176px; column-gap: 28px; align-items: center; }
  .waved .insp { width: 176px; height: 203px; background: url(../../../assets/hex/orange-question.png) center / contain no-repeat; grid-row: 1 / span 2; grid-column: 2; }
  .waved .bub { position: relative; background: #fbf1e0; border: 3px solid var(--spec-1); border-radius: 26px; padding: 14px 28px 16px; justify-self: end; }
  .waved .bub::after { content: ""; position: absolute; right: -15px; top: 50%; width: 24px; height: 24px; margin-top: -12px; background: #fbf1e0; border-right: 3px solid var(--spec-1); border-top: 3px solid var(--spec-1); transform: rotate(45deg); }
  .waved .q { font-family: var(--mono); font-size: 18px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--soft); margin: 0 0 4px; }
  .waved .a { font-family: var(--serif); font-size: 50px; line-height: 1.05; margin: 0; }
  .waved .reply { justify-self: end; margin-top: 12px; background: var(--ink); color: #fff; border-radius: 22px; padding: 12px 26px; font-size: 30px; font-weight: 600; }
</style>'''
ARC=[('safetyGraphics','Not really','var(--spec-0)'),('OpenRBQM','Yes, by design','var(--spec-2)'),('OpenRBQM + AI','Yes, same process','var(--spec-2)'),('obot','Not yet','var(--spec-1)')]
def arc(k):
    out=[]
    for i,(who,v,c) in enumerate(ARC):
        cls='on' if i==k else ('done' if i<k else '')
        txt=v if i<=k else '?'
        out.append(f'<li class="{cls}" style="--c: {c}"><i>{i+1}</i><span><small>{who}</small>{txt}</span></li>')
    return '<ol class="arc">'+''.join(out)+'</ol>'
def chip(kind,txt): return f'<span class="chip {kind}">{txt}</span>'
def row(h,chips,p): return f'<div class="r"><h3>{h}</h3><div class="who">{chips}</div><p>{p}</p></div>'
def ci(k,hue,of,verdict,rows,under='',extra=''):
    return f'''<section class="slide s-qc" data-hue="{hue}" style="--v: {ARC[k][2]}" data-foot="R/Pharma 2026 · Jeremy Wildfire">
  <p class="kicker">Quality check-in · {k+1} of 4</p>
  <div class="qa"><div class="insp"></div>
    <div class="bub"><p class="q">Inspector Orange · {of}</p><p class="a">“Is it validated?”</p></div>
    <div class="verdict"><p class="q">The answer</p><p class="a">{verdict}</p></div></div>
  <div class="rows">{''.join(rows)}</div>{under}
  {arc(k)}{extra}
</section>'''
P=chip('', 'People'); A=chip('ai','Agents'); P1=chip('','A person'); N=chip('none','Nobody')
slides=[
('Check-in 1 · a new slide after slide 10. Slide 10 keeps “We showed”, “We didn’t” and the commits chart; its third column becomes this.',
 ci(0,1,'of safetyGraphics','“Not really.<br>It’s exploratory.”',[
   row('Tests',P,'Written by hand, where we had time'),
   row('Review',P,'Peer review, on GitHub'),
   row('Sign-off',N,'No qualified release')],
   extra='<div class="todo guess" style="padding: 10px 20px; font-size: 22px">TODO (Jeremy): the three rows are my guesses</div>')),
('Check-in 2 · slide 15, “GxP is built into the design”, converted. The test-name example and the results table would move to its notes or stay as a slide before this one.',
 ci(1,3,'of OpenRBQM','“Yes.<br>By design.”',[
   row('Tests',P,'Every requirement has a test; the issue number goes in the test name'),
   row('Review',P,'Every test is reviewed and every change approved'),
   row('Sign-off',P1,'Every package ships with evidence, every time')])),
('Check-in 3 · slide 23, “AI-written code still needs a human owner”, converted. Its four “a person…” lines fold into the rows.',
 ci(2,3,'of OpenRBQM, with AI in the loop','“Yes.<br>Same process.”',[
   row('Tests',A+P,'An agent writes the tests; a person reviews them'),
   row('Review',P,'A person must be able to explain why the code works'),
   row('Sign-off',P1,'A person owns the requirements, the risk decision and the release')])),
('Slide 26, unchanged except for the inspector being waved off (on a second press, like the other callouts).',
 '''<section class="slide s-bullets" data-hue="4" data-foot="R/Pharma 2026 · Jeremy Wildfire">
  <p class="kicker">The experiment</p>
  <h2>What are these tools good at right now?</h2>
  <ul><li>Open source</li><li><b style="font-weight: 600">Not GxP</b></li><li>Let's experiment and have some fun …</li></ul>
  <div class="waved"><div class="insp"></div>
    <div class="bub"><p class="q">Inspector Orange</p><p class="a">“Is it validated?”</p></div>
    <div class="reply">Not this time. Come back later.</div></div>
</section>'''),
('Check-in 4 · slide 46, “A lot of tests, and still not GxP”, converted. Same numbers, same closing line.',
 ci(3,5,'of the obot experiment','“Not yet.”',[
   row('Tests',A,'2,627 tests in safety.viz, up from 343 in July'),
   row('Review',A,'40 of 52 agents on the October weekend were reviewers. One caught a bad p-value.'),
   row('Sign-off',P1,'Nothing here has been through qualification')],
   under='<p class="under">Tests and reviews are cheap now. The signature is not.</p>')),
]
body=''.join(f'<p class="label">{i+1}. {lab}</p>\n{sec}\n' for i,(lab,sec) in enumerate(slides))
open('quality-checkin-mock.html','w',encoding='utf8').write('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Quality check-in mock</title>\n'+head+css+'</head><body><div class="deck">\n'+body+'</div></body></html>')
print('ok',len(slides))
