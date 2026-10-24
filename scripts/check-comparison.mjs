import assert from 'node:assert/strict';
import {comparisonGeometry as bar} from '../src/comparison.ts';
for(const [yes,no] of [[0,0],[7,0],[93,7],[178,14],[0,7],[153,8],[7,1],[199,1]]){
 const b=bar(yes,no);
 assert.ok(Math.abs(b.greenWidth+b.redWidth+b.markerWidth-498)<1e-9);
 assert.ok(Math.abs(b.redLeft+b.redWidth-1197)<1e-9);
 assert.ok(b.redLeft>=b.markerLeft+b.markerWidth);
 if(yes+no)assert.ok(Math.abs(b.redWidth/450-no/(yes+no))<1e-9);
 if(yes+no)assert.equal(b.yesPercent+b.noPercent,100);
}
assert.equal(bar(0,0).noPercent,null);
assert.equal(bar(7,0).yesPercent,100);
assert.equal(bar(93,7).noPercent,7);
assert.ok(Math.abs(bar(93,7).redWidth-31.5)<1e-9);
assert.ok(bar(93,7).markerLeft<bar(100,0).markerLeft);
console.log('Comparison geometry passed: visible shares, reserved VS slot, zero-data and edge cases.');
