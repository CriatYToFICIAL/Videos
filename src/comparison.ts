/** Marker occupies its own slot; neither colored share is hidden beneath it. */
export const comparisonGeometry=(yes:number,no:number,left=699,width=498,markerWidth=48)=>{
 const total=yes+no,share=total?no/total:0,dataWidth=width-markerWidth;
 const greenWidth=total?dataWidth*(1-share):dataWidth/2;
 const redWidth=total?dataWidth*share:dataWidth/2;
 const markerLeft=left+greenWidth;
 const noPercent=total?Math.round(100*no/total):null;
 // Complementary rounding prevents 88% + 13% for an exact 87.5/12.5 split.
 return {total,yesPercent:noPercent===null?null:100-noPercent,noPercent,greenWidth,redWidth,markerLeft,markerCenter:markerLeft+markerWidth/2,redLeft:markerLeft+markerWidth,markerWidth};
};
