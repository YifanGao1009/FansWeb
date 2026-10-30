export type Lang = "en";
export type Rhythm = "steady" | "pulsing";
export type Origin = "A" | "B" | "blend";
export type Words = { en: string };
export type Genes = { strength: number; rhythm: Rhythm; cycleSeconds: number; sweep: number };
export type Preset = Genes & { id: string; name: Words; description: Words };
export const PRESETS: Preset[] = [
  {id:"gentle",name:{en:"Gentle"},description:{en:"Soft, steady air. Content to stay close."},strength:35,rhythm:"steady",cycleSeconds:6,sweep:6},
  {id:"restless",name:{en:"Restless"},description:{en:"Strong pulses. Always looking around."},strength:75,rhythm:"pulsing",cycleSeconds:4,sweep:30},
  {id:"reserved",name:{en:"Reserved"},description:{en:"A quiet presence, with a very narrow focus."},strength:25,rhythm:"steady",cycleSeconds:7,sweep:4},
  {id:"curious",name:{en:"Curious"},description:{en:"Changing air that explores a wider space."},strength:50,rhythm:"pulsing",cycleSeconds:6,sweep:40},
  {id:"assertive",name:{en:"Assertive"},description:{en:"A strong, consistent breeze with clear direction."},strength:85,rhythm:"steady",cycleSeconds:4,sweep:12},
  {id:"dreamy",name:{en:"Dreamy"},description:{en:"Soft waves, slow changes, a wandering gaze."},strength:30,rhythm:"pulsing",cycleSeconds:9,sweep:18},
];
export type ParentChoice = { presetId: string; note: string };
export type Pair = { a: ParentChoice; b: ParentChoice };
export const DEFAULT_PAIR: Pair = {a:{presetId:"gentle",note:""},b:{presetId:"restless",note:""}};
export const presetFor = (id: string) => PRESETS.find(p=>p.id===id) || PRESETS[0];
export const validPair = (p: unknown): p is Pair => {
  if(!p||typeof p!=="object")return false;
  return ["a","b"].every(k=>{const v=(p as Record<string,unknown>)[k] as ParentChoice;return v&&PRESETS.some(p=>p.id===v.presetId)&&typeof v.note==="string"&&v.note.length<=180;});
};
type NumberGene = {value:number;source:Origin;reason:Words};
export type Analysis = {personality:Words;summary:Words;tension:Words;genes:{strength:NumberGene;rhythm:{value:Rhythm;cycleSeconds:number;source:Origin;reason:Words};sweep:NumberGene}};
export type Offspring = {recordId:string;createdAt:string;parents:Pair;analysis:Analysis;model:string};
export const genesFrom = (a:Analysis):Genes => ({strength:a.genes.strength.value,rhythm:a.genes.rhythm.value,cycleSeconds:a.genes.rhythm.cycleSeconds,sweep:a.genes.sweep.value});
export function validAnalysis(value:unknown,pair?:Pair):value is Analysis {
  if(!value||typeof value!=="object")return false;const a=value as Analysis;
  const words=(w:unknown):w is Words=>!!w&&typeof w==="object"&&["en"].every(k=>typeof (w as Record<string,unknown>)[k]==="string"&&(w as Record<string,string>)[k].trim().length>0&&(w as Record<string,string>)[k].length<=1600);
  if(![a.personality,a.summary,a.tension].every(words)||!a.genes)return false;
  for(const key of ["strength","rhythm","sweep"] as const){const g=a.genes[key];if(!g||!["A","B","blend"].includes(g.source)||!words(g.reason))return false;}
  if(!Number.isInteger(a.genes.strength.value)||a.genes.strength.value<15||a.genes.strength.value>90)return false;
  if(!Number.isInteger(a.genes.sweep.value)||a.genes.sweep.value<0||a.genes.sweep.value>45)return false;
  if(!["steady","pulsing"].includes(a.genes.rhythm.value)||!Number.isFinite(a.genes.rhythm.cycleSeconds)||a.genes.rhythm.cycleSeconds<3||a.genes.rhythm.cycleSeconds>10)return false;
  if(pair){const pa=presetFor(pair.a.presetId),pb=presetFor(pair.b.presetId);for(const k of ["strength","sweep"] as const){const g=a.genes[k];if(g.value<Math.min(pa[k],pb[k])||g.value>Math.max(pa[k],pb[k]))return false;if(g.source==="A"&&g.value!==pa[k])return false;if(g.source==="B"&&g.value!==pb[k])return false;}
    const r=a.genes.rhythm;if(![pa.rhythm,pb.rhythm].includes(r.value)||r.cycleSeconds<Math.min(pa.cycleSeconds,pb.cycleSeconds)||r.cycleSeconds>Math.max(pa.cycleSeconds,pb.cycleSeconds))return false;
    if(r.source==="A"&&(r.value!==pa.rhythm||r.cycleSeconds!==pa.cycleSeconds))return false;if(r.source==="B"&&(r.value!==pb.rhythm||r.cycleSeconds!==pb.cycleSeconds))return false;
  }return true;
}
export const validOffspring=(p:unknown):p is Offspring=>{if(!p||typeof p!=="object")return false;const x=p as Offspring;return typeof x.recordId==="string"&&/^KIN-[0-9a-z-]{1,40}$/i.test(x.recordId)&&typeof x.createdAt==="string"&&typeof x.model==="string"&&validPair(x.parents)&&validAnalysis(x.analysis,x.parents);};
