import{useState,useCallback}from"react";
import{getH2H,VENUE_INTEL}from"./matchIntel.js";

const TC={RCB:{bg:"#C8102E",dk:"#FFD700"},SRH:{bg:"#FF822A",dk:"#1B1B1B"},MI:{bg:"#004BA0",dk:"#fff"},KKR:{bg:"#3A225D",dk:"#FFD700"},CSK:{bg:"#F5C600",dk:"#003566"},RR:{bg:"#2D0A6B",dk:"#E91E8C"},PBKS:{bg:"#ED1B24",dk:"#fff"},GT:{bg:"#1B3A6B",dk:"#B5985A"},LSG:{bg:"#A72056",dk:"#fff"},DC:{bg:"#00008B",dk:"#fff"}};

const TABS=["H2H","Toss","Venue","AI Pick"];

const secStyle={
  fontFamily:"'Barlow Condensed',sans-serif",
  fontWeight:700,fontSize:11,letterSpacing:2,
  textTransform:"uppercase",color:"#1D428A",
  margin:"0 0 10px",paddingBottom:6,
  borderBottom:"1px solid #e2e8f0"
};

function StatRow({label,value,highlight}){
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
      padding:"6px 0",borderBottom:"1px solid #f1f5f9"}}>
      <span style={{fontSize:12,color:"#64748b"}}>{label}</span>
      <span style={{fontSize:12,fontWeight:600,color:highlight||"#1a2540",
        textAlign:"right",maxWidth:"58%"}}>{value}</span>
    </div>
  );
}

function MiniStat({label,value,color}){
  return(
    <div style={{flex:1,background:"#f8faff",borderRadius:10,padding:"10px 6px",textAlign:"center",
      border:"1px solid #e2e8f0"}}>
      <p style={{fontSize:17,fontWeight:700,color:color||"#1a2540",margin:0,
        fontFamily:"'Barlow Condensed',sans-serif"}}>{value}</p>
      <p style={{fontSize:9,color:"#94a3b8",marginTop:3,lineHeight:1.3}}>{label}</p>
    </div>
  );
}

function FactItem({icon,text}){
  return(
    <div style={{display:"flex",alignItems:"flex-start",gap:8,
      padding:"7px 0",borderBottom:"1px solid #f1f5f9"}}>
      <span style={{fontSize:13,flexShrink:0,marginTop:1}}>{icon}</span>
      <span style={{fontSize:12,color:"#64748b",lineHeight:1.55}}>{text}</span>
    </div>
  );
}

function SuggestedPick({label,team,color,textColor,note}){
  return(
    <div style={{flex:1,background:"#f8faff",border:"1px solid #e2e8f0",
      borderRadius:10,padding:"10px 6px",textAlign:"center"}}>
      <p style={{fontSize:9,color:"#94a3b8",textTransform:"uppercase",
        letterSpacing:.5,margin:"0 0 6px"}}>{label}</p>
      <div style={{width:30,height:30,borderRadius:7,background:color,
        display:"flex",alignItems:"center",justifyContent:"center",
        color:textColor,fontSize:9,fontWeight:700,
        margin:"0 auto 5px",fontFamily:"'Barlow Condensed',sans-serif"}}>{team}</div>
      <p style={{fontSize:11,fontWeight:600,color:"#1a2540",margin:"0 0 2px"}}>{team}</p>
      <p style={{fontSize:9,color:"#22c55e",margin:0}}>{note}</p>
    </div>
  );
}

function Shimmer(){
  return(
    <div style={{background:"#f8faff",border:"1px solid #e2e8f0",
      borderRadius:10,padding:"14px"}}>
      {[88,72,80,65,76,60].map((w,i)=>(
        <div key={i} style={{height:11,borderRadius:4,background:"#e2e8f0",
          width:w+"%",marginBottom:i<5?8:0,
          animation:"ipl-shimmer 1.3s ease-in-out infinite",
          animationDelay:(i*0.1)+"s"}}/>
      ))}
      <style>{`@keyframes ipl-shimmer{0%,100%{opacity:.35}50%{opacity:.85}}`}</style>
    </div>
  );
}

export default function MatchIntelPanel({m}){
  const[open,setOpen]=useState(false);
  const[tab,setTab]=useState("H2H");
  const[aiText,setAiText]=useState("");
  const[aiLoading,setAiLoading]=useState(false);
  const[aiDone,setAiDone]=useState(false);
  const[aiError,setAiError]=useState(false);

  const h2h=getH2H(m.home,m.away);
  const venue=VENUE_INTEL[m.venue]||null;
  const hc=TC[m.home]||{bg:"#333",dk:"#fff"};
  const ac=TC[m.away]||{bg:"#555",dk:"#fff"};

  const h2hWinPct=h2h?h2h.homeWinPct:50;
  const confidenceLabel=h2h
    ?Math.abs(h2h.wA-h2h.wB)<=2?"Low":Math.abs(h2h.wA-h2h.wB)<=5?"Med":"High"
    :"Low";
  const suggestedWinner=h2hWinPct>=50?m.home:m.away;
  const suggestedWinnerC=h2hWinPct>=50?hc:ac;
  const suggestedWinPct=Math.max(h2hWinPct,100-h2hWinPct);

  const loadAI=useCallback(async()=>{
    if(aiDone||aiLoading)return;
    setAiLoading(true);setAiError(false);
    try{
      const prompt=`You are a concise cricket analyst for an IPL fantasy game. Write exactly 3 short paragraphs (no bullet points, no headers, plain text only). Each paragraph max 40 words.

Match: ${m.home} vs ${m.away}
Venue: ${m.venue}
${h2h?`H2H all time: ${m.home} ${h2h.wA} wins, ${m.away} ${h2h.wB} wins from ${h2h.matches} matches. Recent: ${h2h.streak}. ${m.home} home win rate vs ${m.away}: ${h2h.homeWinPct}%.`:"No H2H data."}
${venue?`Venue: avg 1st innings ${venue.avgFirst}, chase win rate ${venue.chaseWin}%, toss preference ${venue.tossChoice}.`:"No venue data."}

Paragraph 1: H2H summary — who has the edge and why.
Paragraph 2: Toss — who is likely to win it, what they will choose, and why.
Paragraph 3: Match winner pick with one clear reason.`;

      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "x-api-key":import.meta.env.VITE_ANTHROPIC_KEY||"",
          "anthropic-version":"2023-06-01",
          "anthropic-dangerous-direct-browser-access":"true"
        },
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:300,
          messages:[{role:"user",content:prompt}]
        })
      });
      if(!res.ok)throw new Error("API error "+res.status);
      const data=await res.json();
      const text=(data.content||[]).map(b=>b.text||"").join("").trim();
      if(!text)throw new Error("Empty response");
      setAiText(text);setAiDone(true);
    }catch(e){
      console.error("AI Pick error",e);
      setAiError(true);
    }
    setAiLoading(false);
  },[m,h2h,venue,aiDone,aiLoading]);

  const handleTab=useCallback((t)=>{
    setTab(t);
    if(t==="AI Pick")loadAI();
  },[loadAI]);

  if(!open)return(
    <button onClick={()=>setOpen(true)} style={{
      width:"100%",padding:"10px 14px",
      background:"#f8faff",border:"1px solid #e2e8f0",
      borderRadius:10,cursor:"pointer",
      display:"flex",justifyContent:"space-between",alignItems:"center",
      marginTop:8,fontFamily:"'Barlow',sans-serif",transition:"background .15s"}}>
      <span style={{fontSize:12,fontWeight:600,color:"#1D428A"}}>🔍 Match Intel</span>
      <span style={{fontSize:11,color:"#94a3b8"}}>Show ↓</span>
    </button>
  );

  return(
    <div style={{marginTop:8}}>
      {/* Toggle button — open state */}
      <button onClick={()=>setOpen(false)} style={{
        width:"100%",padding:"10px 14px",
        background:"#EBF0FA",border:"1px solid #1D428A40",
        borderRadius:10,cursor:"pointer",
        display:"flex",justifyContent:"space-between",alignItems:"center",
        marginBottom:10,fontFamily:"'Barlow',sans-serif"}}>
        <span style={{fontSize:12,fontWeight:600,color:"#1D428A"}}>🔍 Match Intel</span>
        <span style={{fontSize:11,color:"#1D428A"}}>Hide ↑</span>
      </button>

      {/* Tab bar */}
      <div style={{display:"flex",background:"#f1f5f9",borderRadius:8,
        padding:3,marginBottom:14,border:"1px solid #e2e8f0"}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>handleTab(t)} style={{
            flex:1,padding:"7px 2px",border:"none",borderRadius:6,
            cursor:"pointer",fontFamily:"'Barlow',sans-serif",
            fontWeight:600,fontSize:10,textTransform:"uppercase",letterSpacing:.3,
            transition:"all .15s",
            background:tab===t?"#fff":"transparent",
            color:tab===t?"#1D428A":"#94a3b8",
            boxShadow:tab===t?"0 1px 3px rgba(0,0,0,.08)":"none"}}>
            {t}
          </button>
        ))}
      </div>

      {/* ── H2H TAB ── */}
      {tab==="H2H"&&(
        h2h?(
          <div>
            <p style={secStyle}>Head to head · IPL 2008–2025</p>

            {/* H2H bar */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <div style={{textAlign:"center",minWidth:40}}>
                <p style={{fontSize:22,fontWeight:700,color:hc.bg,margin:0,
                  fontFamily:"'Barlow Condensed',sans-serif"}}>{h2h.wA}</p>
                <p style={{fontSize:9,color:"#94a3b8",margin:0}}>{m.home}</p>
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",height:10,borderRadius:5,overflow:"hidden"}}>
                  <div style={{
                    width:Math.round(h2h.wA/Math.max(h2h.matches,1)*100)+"%",
                    background:hc.bg,borderRadius:"5px 0 0 5px"}}/>
                  <div style={{
                    flex:1,background:ac.bg,borderRadius:"0 5px 5px 0"}}/>
                </div>
                <p style={{textAlign:"center",fontSize:10,color:"#94a3b8",
                  margin:"4px 0 0"}}>{h2h.matches} matches played</p>
              </div>
              <div style={{textAlign:"center",minWidth:40}}>
                <p style={{fontSize:22,fontWeight:700,color:ac.bg,margin:0,
                  fontFamily:"'Barlow Condensed',sans-serif"}}>{h2h.wB}</p>
                <p style={{fontSize:9,color:"#94a3b8",margin:0}}>{m.away}</p>
              </div>
            </div>

            <StatRow label="Last result" value={h2h.lastResult}/>
            <StatRow label={`${m.home} home win rate`} value={h2h.homeWinPct+"% vs "+m.away}
              highlight={h2h.homeWinPct>=55?"#15803d":h2h.homeWinPct<=45?"#dc2626":undefined}/>
            <StatRow label={`${m.home} best score`} value={h2h.highA}/>
            <StatRow label={`${m.away} best score`} value={h2h.highB}/>
            <div style={{display:"flex",justifyContent:"space-between",
              alignItems:"center",padding:"6px 0"}}>
              <span style={{fontSize:12,color:"#64748b"}}>Current streak</span>
              <span style={{fontSize:10,fontWeight:600,padding:"2px 10px",
                borderRadius:20,
                background:h2h.streak.startsWith(m.home)?hc.bg+"22":
                           h2h.streak.startsWith(m.away)?ac.bg+"22":"#f1f5f9",
                color:h2h.streak.startsWith(m.home)?hc.bg:
                      h2h.streak.startsWith(m.away)?ac.bg:"#64748b"}}>
                {h2h.streak}
              </span>
            </div>
          </div>
        ):(
          <div style={{textAlign:"center",padding:"24px 16px"}}>
            <p style={{fontSize:28,margin:"0 0 8px"}}>📊</p>
            <p style={{color:"#94a3b8",fontSize:12}}>No H2H data for this fixture yet.</p>
          </div>
        )
      )}

      {/* ── TOSS TAB ── */}
      {tab==="Toss"&&(
        venue?(
          <div>
            <p style={secStyle}>Toss stats · {m.venue.split(",")[0]}</p>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              <MiniStat label="Toss winner preference" value={venue.tossChoice.split("(")[0].trim()}/>
              <MiniStat label="Chase win rate" value={venue.chaseWin+"%"}
                color={venue.chaseWin>=55?"#15803d":venue.chaseWin<=45?"#dc2626":undefined}/>
              <MiniStat label="Dew factor" value={venue.dewFactor}
                color={venue.dewFactor==="High"?"#d97706":
                       venue.dewFactor==="None"?"#15803d":undefined}/>
            </div>
            {venue.facts.map((f,i)=>(
              <FactItem key={i}
                icon={["🎯","🌙","🏏","📊"][i]||"💡"}
                text={f}/>
            ))}
          </div>
        ):(
          <div style={{textAlign:"center",padding:"24px 16px"}}>
            <p style={{fontSize:28,margin:"0 0 8px"}}>🏟️</p>
            <p style={{color:"#94a3b8",fontSize:12}}>No toss data for this venue yet.</p>
          </div>
        )
      )}

      {/* ── VENUE TAB ── */}
      {tab==="Venue"&&(
        venue?(
          <div>
            <p style={secStyle}>{m.venue.split(",")[0]} · IPL stats</p>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              <MiniStat label="Avg 1st innings" value={venue.avgFirst}/>
              <MiniStat label="Chase win %" value={venue.chaseWin+"%"}
                color={venue.chaseWin>=55?"#15803d":venue.chaseWin<=45?"#dc2626":undefined}/>
              <MiniStat label="Highest total" value={venue.highest.split(" ")[0]}/>
            </div>
            {venue.facts.map((f,i)=>(
              <FactItem key={i}
                icon={["🏟️","🌿","📈","🎳"][i]||"💡"}
                text={f}/>
            ))}
          </div>
        ):(
          <div style={{textAlign:"center",padding:"24px 16px"}}>
            <p style={{fontSize:28,margin:"0 0 8px"}}>🏟️</p>
            <p style={{color:"#94a3b8",fontSize:12}}>No venue data available.</p>
          </div>
        )
      )}

      {/* ── AI PICK TAB ── */}
      {tab==="AI Pick"&&(
        <div>
          <p style={secStyle}>AI prediction insight</p>

          {/* Loading */}
          {aiLoading&&<Shimmer/>}

          {/* Error */}
          {!aiLoading&&aiError&&(
            <div style={{background:"#fef2f2",border:"1px solid #fecaca",
              borderRadius:10,padding:"14px",textAlign:"center"}}>
              <p style={{fontSize:13,color:"#dc2626",margin:"0 0 10px"}}>
                Could not load AI insight.
              </p>
              <button onClick={()=>{setAiError(false);loadAI();}} style={{
                padding:"7px 16px",borderRadius:8,
                background:"#1D428A",color:"#fff",border:"none",
                cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",
                fontWeight:700,fontSize:12,textTransform:"uppercase"}}>
                Retry
              </button>
            </div>
          )}

          {/* AI text */}
          {!aiLoading&&!aiError&&aiText&&(
            <div style={{background:"#f8faff",border:"1px solid #e2e8f0",
              borderRadius:10,padding:"13px 14px",
              fontSize:12,color:"#475569",lineHeight:1.7,marginBottom:14}}>
              {aiText.split("\n\n").filter(Boolean).map((para,i)=>(
                <p key={i} style={{margin:i<aiText.split("\n\n").filter(Boolean).length-1?"0 0 10px":"0"}}>
                  {para}
                </p>
              ))}
              <p style={{fontSize:10,color:"#94a3b8",marginTop:10,
                paddingTop:8,borderTop:"1px solid #e2e8f0"}}>
                Based on IPL data 2008–2025 · For entertainment only
              </p>
            </div>
          )}

          {/* Prompt to load */}
          {!aiLoading&&!aiError&&!aiText&&(
            <div style={{textAlign:"center",padding:"20px 16px"}}>
              <p style={{fontSize:28,margin:"0 0 8px"}}>🤖</p>
              <p style={{color:"#94a3b8",fontSize:12,margin:"0 0 12px"}}>
                Get an AI-powered prediction for this match.
              </p>
              <button onClick={loadAI} style={{
                padding:"9px 20px",borderRadius:10,
                background:"linear-gradient(135deg,#1D428A,#2a5bbf)",
                color:"#fff",border:"none",cursor:"pointer",
                fontFamily:"'Barlow Condensed',sans-serif",
                fontWeight:800,fontSize:13,textTransform:"uppercase",
                letterSpacing:.5}}>
                Generate Insight
              </button>
            </div>
          )}

          {/* Data-suggested picks */}
          {(h2h||venue)&&(
            <div>
              <p style={secStyle}>Data-suggested picks</p>
              <div style={{display:"flex",gap:8}}>
                <SuggestedPick
                  label="Toss"
                  team={m.home}
                  color={hc.bg}
                  textColor={hc.dk}
                  note="Home advantage"
                />
                <SuggestedPick
                  label="Winner"
                  team={suggestedWinner}
                  color={suggestedWinnerC.bg}
                  textColor={suggestedWinnerC.dk}
                  note={suggestedWinPct+"% H2H rate"}
                />
                <div style={{flex:1,background:"#f8faff",border:"1px solid #e2e8f0",
                  borderRadius:10,padding:"10px 6px",textAlign:"center"}}>
                  <p style={{fontSize:9,color:"#94a3b8",textTransform:"uppercase",
                    letterSpacing:.5,margin:"0 0 6px"}}>Confidence</p>
                  <p style={{fontSize:18,fontWeight:700,color:"#1a2540",
                    margin:"4px 0 2px",fontFamily:"'Barlow Condensed',sans-serif"}}>
                    {confidenceLabel}
                  </p>
                  <p style={{fontSize:9,
                    color:confidenceLabel==="High"?"#15803d":
                          confidenceLabel==="Med"?"#d97706":"#94a3b8",
                    margin:0}}>
                    {h2h?.streak||"No streak data"}
                  </p>
                </div>
              </div>
              <p style={{fontSize:10,color:"#94a3b8",textAlign:"center",
                marginTop:10}}>
                Suggestions based on historical data only · Not financial advice
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
