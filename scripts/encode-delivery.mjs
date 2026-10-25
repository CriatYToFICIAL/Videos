import {spawn} from 'node:child_process';
import {access,mkdtemp,mkdir} from 'node:fs/promises';
import {join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
const [input,output,recoveryTail,recoveryAudio,trimArg,totalArg]=process.argv.slice(2);
if(!input||!output)throw Error('Usage: node scripts/encode-delivery.mjs input.mp4 output.mp4');
await access(input);await mkdir(dirname(output),{recursive:true});
const stats=join(await mkdtemp(join(tmpdir(),'map-video-encode-')),'stats');
const run=args=>new Promise((resolve,reject)=>{const p=spawn('ffmpeg',args,{stdio:'inherit'});p.on('error',reject);p.on('exit',code=>code===0?resolve():reject(Error(`FFmpeg exit ${code}`)));});
// Allocate bits to camera travel rather than imposing the delivery average as
// an instantaneous ceiling. Preserve 1080p/30 and allow 7 Mbps motion bursts.
const video=['-c:v','libx264','-threads','5','-preset','medium','-b:v','1300k','-maxrate','7000k','-bufsize','14000k','-pix_fmt','yuv420p','-r','30'];
// Optional splice mode: default is the original TikTok recovery; explicit
// trim/total frame arguments also support a newly rendered closing segment.
// Rebuild timestamps and reuse the unchanged full-length sound-effects track.
const inputs=recoveryTail?['-r','30','-i',input,'-i',recoveryTail,'-i',recoveryAudio]:['-i',input];
const trimFrames=trimArg?Number(trimArg):13200,totalFrames=totalArg?Number(totalArg):16560;
if(!Number.isInteger(trimFrames)||!Number.isInteger(totalFrames)||trimFrames<=0||totalFrames<=trimFrames)throw Error('Invalid splice frame counts');
const mapping=recoveryTail?['-filter_complex',`[0:v]trim=end_frame=${trimFrames},setpts=N/(30*TB)[a];[1:v]setpts=N/(30*TB)[b];[a][b]concat=n=2:v=1:a=0[v]`,'-map','[v]','-frames:v',String(totalFrames)]:['-map','0:v:0'];
const audioMapping=recoveryTail?'2:a:0':'0:a:0';
console.log('Delivery encoding: analysis pass 1/2');
await run(['-hide_banner','-v','warning',...inputs,...mapping,'-an',...video,'-pass','1','-passlogfile',stats,'-f','null','-']);
console.log('Delivery encoding: final pass 2/2');
await run(['-y','-hide_banner','-v','warning',...inputs,...mapping,'-map',audioMapping,...video,'-pass','2','-passlogfile',stats,'-af','volume=4','-c:a','aac','-b:a','64k','-movflags','+faststart',output]);
console.log(`Delivery ready: ${output}`);
