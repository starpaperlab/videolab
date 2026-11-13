import {NextResponse} from "next/server";
export const revalidate=86400;
type GoogleFont={family?:string};
export async function GET(){
 try{
  const response=await fetch("https://fonts.google.com/metadata/fonts",{next:{revalidate:86400},headers:{"User-Agent":"Mozilla/5.0 (compatible; VideoLab/1.0)"}});
  if(!response.ok)throw new Error("Google Fonts respondió "+response.status);
  const raw=await response.text();
  const json=JSON.parse(raw.replace(/^\)\]\}'\s*/, ""));
  const entries:GoogleFont[]=Array.isArray(json.familyMetadataList)?json.familyMetadataList:Array.isArray(json.items)?json.items:[];
  const fonts=Array.from(new Set(entries.map(x=>x.family).filter((x):x is string=>typeof x==="string"&&x.length>0))).sort((a,b)=>a.localeCompare(b));
  if(fonts.length<100)throw new Error("Catálogo incompleto");
  return NextResponse.json({fonts,count:fonts.length,source:"Google Fonts",updated:new Date().toISOString()},{headers:{"Cache-Control":"public, s-maxage=86400, stale-while-revalidate=604800"}});
 }catch(e){return NextResponse.json({fonts:[],count:0,error:"No se pudo cargar el catálogo de Google Fonts",detail:e instanceof Error?e.message:"Error desconocido"},{status:503});}
}