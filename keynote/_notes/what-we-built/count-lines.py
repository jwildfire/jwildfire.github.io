import subprocess, sys, re, collections, json
CODE={'.js','.mjs','.cjs','.ts','.r','.py','.sh','.css','.scss','.yml','.yaml','.qmd','.rmd','.html','.toml','.zsh','.bash'}
DOC={'.md'}
EXC_DIR=re.compile(r'(^|/)(dist|node_modules|vendor|_site|docs/evidence|docs/requirements|__snapshots__|_snaps|man|inst/htmlwidgets/lib|pkgdown|renv|\.claude/worktrees|data|data-raw/.*\.(csv|json)|fixtures|test-results|playwright-report|diary|drafts)(/|$)')
EXC_FILE=re.compile(r'(package-lock\.json|renv\.lock|yarn\.lock|\.min\.(js|css)|\.map|\.Rd|evidence\.json|NAMESPACE)$')
def cat(path):
    low=path.lower()
    ext='.'+low.rsplit('.',1)[-1] if '.' in low.rsplit('/',1)[-1] else ''
    if EXC_DIR.search(path) or EXC_FILE.search(path): return 'excluded'
    istest=bool(re.search(r'(^|/)(tests?|testthat|e2e|__tests__)(/|$)|\.(test|spec)\.(m?js|ts)$|(^|/)test[-_][^/]*\.(r|R|py)$',path))
    if ext in DOC: return 'docs'
    if ext in CODE:
        if ext=='.html': return 'html'
        return 'tests' if istest else 'code'
    return 'other'
def run(repo, ref):
    files=subprocess.run(['git','-C',repo,'ls-tree','-r','--name-only',ref],capture_output=True,text=True).stdout.split('\n')
    tot=collections.Counter(); nfiles=collections.Counter(); bydir=collections.defaultdict(collections.Counter)
    for f in files:
        if not f: continue
        c=cat(f)
        if c in('excluded','other'):
            nfiles[c]+=1; continue
        blob=subprocess.run(['git','-C',repo,'show',f'{ref}:{f}'],capture_output=True).stdout
        if b'\0' in blob[:8000]: continue
        n=blob.count(b'\n')
        tot[c]+=n; nfiles[c]+=1
        top='/'.join(f.split('/')[:2]) if '/' in f else '.'
        bydir[c][top]+=n
    return tot,nfiles,bydir
if __name__=='__main__':
    res={}
    for arg in sys.argv[1:]:
        name,repo,ref=arg.split('|')
        tot,nf,bd=run(repo,ref)
        res[name]=dict(tot)
        print(f"{name} @{ref}: code={tot['code']:,} tests={tot['tests']:,} docs={tot['docs']:,} html={tot['html']:,} | files code={nf['code']} tests={nf['tests']} docs={nf['docs']} html={nf['html']} excluded={nf['excluded']} other={nf['other']}")
        for c in ('code','tests','html'):
            print('   ',c,', '.join(f"{d} {n:,}" for d,n in bd[c].most_common(7)))
    json.dump(res,open('loc.json','w'),indent=1)
