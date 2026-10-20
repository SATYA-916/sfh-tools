// ToolHub India - All tools run client-side
function fmt(n){return Number(n.toFixed(2)).toLocaleString('en-IN')}

// 1. CGPA
function cgpaToPercentage(cgpa, multiplier){ multiplier = (multiplier===''||multiplier==null||isNaN(multiplier))?9.5:Number(multiplier); return Number(cgpa)*multiplier; }
function calculateCGPA(){
  const cgpa=parseFloat(document.getElementById('cgpaInput').value);
  const mult=parseFloat(document.getElementById('cgpaMultiplier').value);
  const el=document.getElementById('cgpaResult');
  if(isNaN(cgpa)||cgpa<0||cgpa>10){el.textContent='Please enter a valid CGPA between 0 and 10.';return;}
  const pct=cgpaToPercentage(cgpa, mult);
  el.textContent=`CGPA: ${cgpa}  ×  ${isNaN(mult)?9.5:mult}  =  ${fmt(pct)}%\nPercentage: ${fmt(pct)}%`;
}

// 2. BMI
function bmiValue(weightKg, heightCm){ const m=heightCm/100; return weightKg/(m*m); }
function bmiCategory(bmi){ if(bmi<18.5) return 'Underweight'; if(bmi<25) return 'Normal weight'; if(bmi<30) return 'Overweight'; return 'Obese'; }
function calculateBMI(){
  const w=parseFloat(document.getElementById('bmiWeight').value);
  const h=parseFloat(document.getElementById('bmiHeight').value);
  const el=document.getElementById('bmiResult');
  if(isNaN(w)||isNaN(h)||w<=0||h<=0){el.textContent='Please enter valid weight and height.';return;}
  const bmi=bmiValue(w,h);
  el.textContent=`Your BMI: ${fmt(bmi)}\nCategory: ${bmiCategory(bmi)}\nHealthy range: 18.5 – 24.9`;
}

// 3. Age
function ageDiff(dob, now){
  let years=now.getFullYear()-dob.getFullYear();
  let months=now.getMonth()-dob.getMonth();
  let days=now.getDate()-dob.getDate();
  if(days<0){ months--; const prev=new Date(now.getFullYear(), now.getMonth(), 0); days+=prev.getDate(); }
  if(months<0){ years--; months+=12; }
  return {years, months, days};
}
function calculateAge(){
  const val=document.getElementById('dobInput').value;
  const el=document.getElementById('ageResult');
  if(!val){el.textContent='Please select your date of birth.';return;}
  const dob=new Date(val+'T00:00:00'); const now=new Date();
  if(dob>now){el.textContent='Date of birth cannot be in the future.';return;}
  const a=ageDiff(dob, now);
  const totalDays=Math.floor((now-dob)/(1000*60*60*24));
  el.textContent=`Age: ${a.years} years, ${a.months} months, ${a.days} days\nTotal days lived: ${totalDays.toLocaleString('en-IN')}`;
}

// 4. EMI: EMI = P * r * (1+r)^n / ((1+r)^n - 1), r = annual%/12/100
function emiCalc(P, annualRate, n){
  const r=annualRate/12/100;
  if(r===0) return {emi:P/n, total:P, interest:0};
  const pow=Math.pow(1+r,n); const emi=P*r*pow/(pow-1); const total=emi*n;
  return {emi, total, interest: total-P};
}
function calculateEMI(){
  const P=parseFloat(document.getElementById('emiPrincipal').value);
  const rate=parseFloat(document.getElementById('emiRate').value);
  const n=parseInt(document.getElementById('emiMonths').value,10);
  const el=document.getElementById('emiResult');
  if(isNaN(P)||isNaN(rate)||isNaN(n)||P<=0||n<=0||rate<0){el.textContent='Please enter valid loan amount, rate and tenure.';return;}
  const r=emiCalc(P,rate,n);
  el.textContent=`Monthly EMI: ₹${fmt(r.emi)}\nTotal Payment: ₹${fmt(r.total)}\nTotal Interest: ₹${fmt(r.interest)}`;
}

// 5. Word Counter
function wordStats(text){
  const trimmed=text.trim();
  const words=trimmed?trimmed.split(/\s+/).length:0;
  const chars=text.length; const charsNoSpaces=text.replace(/\s/g,'').length;
  const sentences=trimmed?(trimmed.split(/[.!?]+/).filter(s=>s.trim().length>0).length):0;
  const reading=words? (words/200):0;
  return {words, chars, charsNoSpaces, sentences, reading};
}
function countWords(){
  const text=document.getElementById('wordInput').value;
  const s=wordStats(text);
  const rt=s.reading<1? Math.ceil(s.reading*60)+' sec' : s.reading.toFixed(1)+' min';
  document.getElementById('wordResult').textContent=`Words: ${s.words} · Characters: ${s.chars} · Characters (no spaces): ${s.charsNoSpaces} · Sentences: ${s.sentences} · Reading time: ${s.words?rt:'0 min'}`;
}

// 6. Percentage
function percentOf(x,y){ return (x/100)*y; }
function whatPercent(x,y){ return (x/y)*100; }
function calculatePercentOf(){
  const x=parseFloat(document.getElementById('pctX').value); const y=parseFloat(document.getElementById('pctY').value);
  const el=document.getElementById('pctOfResult');
  if(isNaN(x)||isNaN(y)){el.textContent='Enter both values.';return;}
  el.textContent=`${x}% of ${y} = ${fmt(percentOf(x,y))}`;
}
function calculateWhatPercent(){
  const x=parseFloat(document.getElementById('pctA').value); const y=parseFloat(document.getElementById('pctB').value);
  const el=document.getElementById('pctWhatResult');
  if(isNaN(x)||isNaN(y)||y===0){el.textContent='Enter both values (Y cannot be 0).';return;}
  el.textContent=`${x} is ${fmt(whatPercent(x,y))}% of ${y}`;
}

// Export for Node tests (ignored in browser)
if(typeof module!=='undefined' && module.exports){ module.exports={cgpaToPercentage,bmiValue,bmiCategory,ageDiff,emiCalc,wordStats,percentOf,whatPercent}; }

// PWA: register the service worker so the tools install and work offline.
// Browser-only and fully guarded — this block is inert under Node (tests unaffected).
// Service workers require HTTPS (GitHub Pages qualifies) or localhost.
if(typeof window!=='undefined' && 'serviceWorker' in navigator){
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('sw.js').catch(function(err){
      console.warn('Service worker registration failed:', err);
    });
  });
}
