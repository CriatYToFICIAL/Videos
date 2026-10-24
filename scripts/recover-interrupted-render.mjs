// Recover a video-only Remotion pre-encode MP4 interrupted before its moov atom.
// Never modifies the damaged source; requires a matching reference render.
import fs from 'node:fs';
const [damaged,reference,output]=process.argv.slice(2);
if(!output)throw Error('Usage: recover-interrupted-render.mjs damaged.mp4 reference.mp4 recovered.h264');
const ref=fs.readFileSync(reference),avc=ref.indexOf(Buffer.from('avcC'));
if(avc<0)throw Error('Reference lacks avcC');
let p=avc+4;
if(ref[p]!==1||(ref[p+4]&3)!==3)throw Error('Unsupported AVC configuration');
const headers=[];
let count=ref[p+5]&31;p+=6;
for(let i=0;i<count;i++){const n=ref.readUInt16BE(p);p+=2;headers.push(ref.subarray(p,p+n));p+=n;}
count=ref[p++];
for(let i=0;i<count;i++){const n=ref.readUInt16BE(p);p+=2;headers.push(ref.subarray(p,p+n));p+=n;}
const data=fs.readFileSync(damaged),start=data.indexOf(Buffer.from('mdat'))+4;
if(start<4)throw Error('No mdat');
const fd=fs.openSync(output,'wx'),prefix=Buffer.from([0,0,0,1]);
for(const h of headers){fs.writeSync(fd,prefix);fs.writeSync(fd,h);}
let offset=start,frames=0,nals=0;
while(offset+4<=data.length){
  const length=data.readUInt32BE(offset);offset+=4;
  if(!length||offset+length>data.length)break;
  const nal=data.subarray(offset,offset+length),type=nal[0]&31;
  if(type<1||type>12)throw Error(`Unexpected NAL ${type} at ${offset}`);
  fs.writeSync(fd,prefix);fs.writeSync(fd,nal);offset+=length;nals++;
  if(type===1||type===5)frames++;
}
fs.closeSync(fd);
console.log(JSON.stringify({frames,nals,seconds:frames/30,bytesRecovered:offset-start,remainingBytes:data.length-offset}));
