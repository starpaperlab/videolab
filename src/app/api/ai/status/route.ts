import {NextResponse} from "next/server";
export const dynamic="force-dynamic";
export async function GET(){
 return NextResponse.json({providers:[
 {id:"claude",name:"Claude",configured:Boolean(process.env.ANTHROPIC_API_KEY),model:process.env.ANTHROPIC_MODEL||"claude-sonnet-4-5"},
 {id:"openai",name:"OpenAI",configured:Boolean(process.env.OPENAI_API_KEY),model:process.env.OPENAI_MODEL||"gpt-4.1"}
 ],executionEnabled:false,reason:"La ejecución de IA se habilitará al integrar autenticación, límites de uso y permisos por proyecto."},{headers:{"Cache-Control":"no-store"}});
}