(this["webpackJsonpkobo-gunman"]=this["webpackJsonpkobo-gunman"]||[]).push([[0],{46:function(t,e,n){},47:function(t,e,n){},78:function(t,e,n){"use strict";n.r(e);var o=n(6),i=n.n(o),c=n(38),a=n.n(c),s=(n(46),n(23)),r=(n(47),n(2));var l,u=function(t){var e=t.pictId,n=void 0===e?0:e,o=t.x,i=void 0===o?0:o,c=t.y,a=void 0===c?0:c,s=t.onClick,l=(document.body.clientWidth-672)/2,u=(document.documentElement.clientHeight-672)/2,d=Math.floor(n%8),f=Math.floor(n/8);return Object(r.jsx)("div",{style:{position:"absolute",top:32*a+u,left:32*i+l,display:"inline-block",overflow:"hidden",width:32,height:32,imageRendering:"pixelated",userSelect:"none"},onClick:s,children:Object(r.jsx)("img",{style:{position:"relative",left:32*-d,top:32*-f,pointerEvents:"none"},src:"characters.png",alt:""})})};!function(t){t[t.SPACE=0]="SPACE",t[t.GROUND=17]="GROUND",t[t.ROCK=10]="ROCK",t[t.PLAYER=1]="PLAYER",t[t.KEY=11]="KEY",t[t.COIN=33]="COIN",t[t.BULLET=9]="BULLET",t[t.CROSS=25]="CROSS",t[t.CACTUS=18]="CACTUS"}(l||(l={}));var d=function(t){var e=t.className,n=t.children,o=t.offsetY,i=t.offsetX;return Object(r.jsx)("div",{className:e,style:{width:672,height:672,top:o,left:i},children:n})};var f,h,p=function(t){var e=(document.body.clientWidth-672)/2,n=(document.documentElement.clientHeight-672)/2,o=t.game,c=o.bgData,a=o.mapData,f=o.objects,h=o.time,p=i.a.useState("title"),v=Object(s.a)(p,2),m=v[0],b=v[1],j=i.a.useState(0),g=Object(s.a)(j,2),O=(g[0],g[1]);i.a.useEffect((function(){setInterval((function(){O((function(t){return t+1}))}),100)}),[]),i.a.useEffect((function(){var t=function(t){switch(t.code){case"Space":b("play"),o.startSound()}};return window.addEventListener("keydown",t),function(){window.removeEventListener("keydown",t)}}),[o]);var y=function(t){return{color:t.color,fontSize:t.size,paddingTop:t.y}};return Object(r.jsxs)("div",{children:["title"===m&&Object(r.jsxs)(d,{className:"title",offsetX:e,offsetY:n,children:[Object(r.jsx)("div",{style:y({color:"orange",size:96,y:200}),children:"GUNMAN"}),Object(r.jsx)("div",{className:"blink",style:y({color:"white",size:32,y:50}),children:"PUSH SPACE KEY"})]}),"play"===m&&Object(r.jsxs)(r.Fragment,{children:[c.map((function(t,e){return t.map((function(t,n){return Object(r.jsx)(u,{pictId:l.GROUND,x:n,y:e},"".concat(n,"-").concat(e))}))})),a.map((function(t,e){return t.map((function(t,n){return Object(r.jsx)(u,{pictId:t,x:n,y:e},"".concat(n,"-").concat(e))}))})),f.map((function(t,e){return Object(r.jsx)(u,{pictId:t.pictId,x:t.x,y:t.y},e)})),Object(r.jsx)(d,{className:"time",offsetX:e,offsetY:n-52,children:Object(r.jsx)("div",{style:y({color:"white",size:48,y:0}),children:h})})]})]})},v=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,79)).then((function(e){var n=e.getCLS,o=e.getFID,i=e.getFCP,c=e.getLCP,a=e.getTTFB;n(t),o(t),i(t),c(t),a(t)}))},m=n(41),b=n(39),j=n(22),g=window.SOUND;!function(t){t.start="@0-0 o5 l16 v0 cd",t.move="@0-0 o5 l16 v12 cd",t.shot="@0-5 o8 l4 v12 c",t.dead="@0-0 o5 l16 v12 gfdc",t.coin="@0-0 o8 l4 v12 ab",t.broken="@0-0 o3 l16 v12 abcrc"}(f||(f={})),function(t){t.UPDATE="update",t.SOUND="sound"}(h||(h={}));var O=function(){for(var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{width:21,height:21},e=[],n=t.width,o=t.height,i=0;i<o;i++){for(var c=[],a=0;a<n;a++)c.push(l.SPACE);e.push(c)}return e},y=function(){function t(){Object(j.a)(this,t),this.bgData=[],this.mapData=[],this.mapSize={width:21,height:21},this.objects=[],this.time="",this.bgData=O(this.mapSize),this.mapData=O(this.mapSize)}return Object(b.a)(t,[{key:"control",value:function(t){var e=t.action;if(e===h.UPDATE){var n=t.mapData,o=t.objects,i=t.time;this.objects=Object(m.a)(o),this.mapData=n,this.time=i}if(e===h.SOUND){var c=t.sound;g.play(c,0)}}},{key:"startSound",value:function(){g.play(f.start,0)}}]),t}(),S=n(40),w=n.n(S),x=new y;!function t(){var e,n=new w.a("/controller");n.onopen=function(){console.log("open"),e=setInterval((function(){n.send(JSON.stringify({type:"heatbeet"}))}),3e3)},n.onmessage=function(t){if("string"!==typeof t.data||"ok"!==t.data){var e=JSON.parse(t.data);x.control(e)}},n.onerror=function(){console.log("error")},n.onclose=function(){clearInterval(e),console.log("close"),setTimeout((function(){t()}),3e3)}}(),a.a.render(Object(r.jsx)(i.a.StrictMode,{children:Object(r.jsx)(p,{game:x})}),document.getElementById("root")),v()}},[[78,1,2]]]);
//# sourceMappingURL=main.5be4dba9.chunk.js.map