import {validPair} from "@/lib/fan-model";
import {breed,BreedingError} from "@/lib/breeding";
export const dynamic="force-dynamic";
const active=new Set<string>();
const recent=new Map<string,number>();
const messages:Record<string,{en:string}>={
 invalid:{en:"Choose valid personalities for both parents, then try again."},
 forbidden:{en:"Please request the analysis from this site's breeding room."},
 rate_limit:{en:"Please wait a moment before breeding another individual."},
 quota:{en:"The API account has reached its credit or usage limit. Your parent choices are preserved."},
 timeout:{en:"The AI took too long. Your parent choices are preserved. Please try again."},
 unavailable:{en:"The AI could not complete this analysis. Your parent choices are preserved. Please try again."}
};
function fail(code:string,status:number){return Response.json({code,message:messages[code]||messages.unavailable},{status,headers:{"Cache-Control":"private, no-store"}});}
export async function POST(request:Request){
 const url=new URL(request.url),origin=request.headers.get("Origin");
 if(origin!==url.origin)return fail("forbidden",403);
 if(!request.headers.get("Content-Type")?.startsWith("application/json"))return fail("invalid",415);
 if(Number(request.headers.get("Content-Length")||0)>4096)return fail("invalid",413);
 let data:unknown;try{const text=await request.text();if(text.length>4096)return fail("invalid",413);data=JSON.parse(text);}catch{return fail("invalid",400);}
 if(!data||typeof data!=="object"||!("parents" in data)||!validPair(data.parents))return fail("invalid",400);
 const key=process.env.OPENAI_API_KEY;if(!key)return fail("not_configured",503);
 // The deployed Site is owner-private; its access boundary is enforced by Sites.
 const visitor=request.headers.get("oai-authenticated-user-id")||"private-preview";
 const now=Date.now();for(const [id,time] of recent)if(now-time>60000)recent.delete(id);
 if(active.has(visitor)||now-(recent.get(visitor)||0)<6000)return fail("rate_limit",429);
 active.add(visitor);recent.set(visitor,now);
 try{return Response.json({offspring:await breed(data.parents,key)},{headers:{"Cache-Control":"private, no-store"}});}catch(e){return fail(e instanceof BreedingError?e.code:"unavailable",e instanceof BreedingError?e.status:503);}finally{active.delete(visitor);}
}
