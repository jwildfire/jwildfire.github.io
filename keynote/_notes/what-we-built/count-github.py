import subprocess, json, sys
repos="safety.viz gsm.safety bio.viz gsm.bio open.csr open.gismo demo-301 obot.agent obot.roadmap scaffold showlist RPharma2026-AIKeynote safetyGraphics safetyCharts safety-histogram".split()
out={}
for since in ("2026-05-01","2026-06-10"):
    parts=[]
    for i,r in enumerate(repos):
        for k,q in (("pr",f"repo:jwildfire/{r} is:pr is:merged merged:>={since}"),("io",f"repo:jwildfire/{r} is:issue created:>={since}"),("ic",f"repo:jwildfire/{r} is:issue closed:>={since}")):
            parts.append(f'r{i}_{k}: search(query: "{q}", type: ISSUE) {{ issueCount }}')
    q="query {"+"\n".join(parts)+"}"
    res=subprocess.run(["gh","api","graphql","-f","query="+q],capture_output=True,text=True)
    d=json.loads(res.stdout)
    if "data" not in d: print(res.stdout[:400], res.stderr[:400]); sys.exit(1)
    out[since]={r:{k:d["data"][f"r{i}_{k}"]["issueCount"] for k in ("pr","io","ic")} for i,r in enumerate(repos)}
json.dump(out,open("counts.json","w"),indent=1)
for since,v in out.items():
    print(since, "PRs", sum(x["pr"] for x in v.values()), "issues opened", sum(x["io"] for x in v.values()), "closed", sum(x["ic"] for x in v.values()))
    print("  "+", ".join(f"{r} {x['pr']}" for r,x in sorted(v.items(), key=lambda kv:-kv[1]['pr'])))
