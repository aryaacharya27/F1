import os, json, re
from pathlib import Path
from datetime import datetime, timezone
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"data"/"f1-data.json"
F1="https://www.formula1.com/en/results/2026/drivers"
GNEWS="https://gnews.io/api/v4/search"
HEAD={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36"}
KEY=os.getenv("GNEWS_API_KEY")

def standings():
    r=requests.get(F1,headers=HEAD,timeout=30); r.raise_for_status()
    soup=BeautifulSoup(r.text,"html.parser")
    rows=soup.select("table tbody tr") or soup.select("[class*='resultsarchive'] tr")
    out=[]
    for row in rows:
        v=[c.get_text(" ",strip=True) for c in row.find_all(["td","th"])]
        if len(v)<5: continue
        p=re.sub(r"\D","",v[0])
        pts=re.search(r"\d+",v[4])
        if not p or not pts: continue
        driver=re.sub(r"\s+[A-Z]{3}$","",v[1]).strip()
        out.append({"position":int(p),"driver":driver,"nationality":v[2],"team":v[3],"points":int(pts.group())})
    if len(out)<10: raise RuntimeError("F1 markup changed or scrape failed; refusing to overwrite data.")
    return sorted(out,key=lambda x:x["position"])

def news(s):
    if not KEY: raise RuntimeError("GNEWS_API_KEY missing")
    names=[x["driver"] for x in s[:10]]
    q='"Formula 1" OR "F1 2026" OR '+" OR ".join(f'"{x}"' for x in names)
    r=requests.get(GNEWS,params={"q":q,"lang":"en","max":10,"sortby":"publishedAt","apikey":KEY},timeout=30); r.raise_for_status()
    a=[]
    for x in r.json().get("articles",[])[:5]:
        a.append({"title":x.get("title",""),"description":x.get("description",""),"url":x.get("url","#"),"image":x.get("image",""),"published_at":x.get("publishedAt",""),"source":x.get("source",{}).get("name","")})
    return a

def main():
    s=standings(); n=news(s)
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(json.dumps({"season":2026,"updated_at":datetime.now(timezone.utc).isoformat(),"standings":s,"news":n},indent=2,ensure_ascii=False),encoding="utf-8")
    print("Updated",OUT)

if __name__=="__main__": main()
