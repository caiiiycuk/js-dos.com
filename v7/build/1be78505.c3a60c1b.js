(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{133:function(e,t,a){"use strict";var n=a(2),c=a(0),s=a.n(c),i=a(98),r=a(137),l=a(134),o=a.n(l),u=a(135),h=a.n(u),d=a(95),p=a(136),g=a(96),m=a(62),j=a.n(m),b=/{([\d,-]+)}/,f=function(e){void 0===e&&(e=["js","jsBlock","jsx","python","html"]);var t={js:{start:"\\/\\/",end:""},jsBlock:{start:"\\/\\*",end:"\\*\\/"},jsx:{start:"\\{\\s*\\/\\*",end:"\\*\\/\\s*\\}"},python:{start:"#",end:""},html:{start:"\x3c!--",end:"--\x3e"}},a=["highlight-next-line","highlight-start","highlight-end"].join("|"),n=e.map((function(e){return"(?:"+t[e].start+"\\s*("+a+")\\s*"+t[e].end+")"})).join("|");return new RegExp("^\\s*(?:"+n+")\\s*$")},y=/title=".*"/;t.a=function(e){var t=e.children,a=e.className,l=e.metastring,u=Object(d.a)().siteConfig.themeConfig.prism,m=void 0===u?{}:u,v=Object(c.useState)(!1),k=v[0],B=v[1],E=Object(c.useState)(!1),O=E[0],x=E[1];Object(c.useEffect)((function(){x(!0)}),[]);var w=[],N="",T=Object(p.a)();if(l&&b.test(l)){var C=l.match(b)[1];w=h.a.parse(C).filter((function(e){return e>0}))}l&&y.test(l)&&(N=l.match(y)[0].split("title=")[1].replace(/"+/g,""));var L=a&&a.replace(/language-/,"");!L&&m.defaultLanguage&&(L=m.defaultLanguage);var R=N?Object(g.a)(N):"",S=Object(c.useState)(t),W=S[0],$=S[1];Object(c.useEffect)((function(){if(R.length>0){var e=new XMLHttpRequest;e.open("GET",R,!0),e.onreadystatechange=function(){4===e.readyState&&200===e.status&&$(e.responseText)},e.send()}}),[]);var J=(t=W).replace(/\n$/,"");if(0===w.length&&void 0!==L){for(var P,q="",F=function(e){switch(e){case"js":case"javascript":case"ts":case"typescript":return f(["js","jsBlock"]);case"jsx":case"tsx":return f(["js","jsBlock","jsx"]);case"html":return f(["js","jsBlock","html"]);case"python":case"py":return f(["python"]);default:return f()}}(L),G=t.replace(/\n$/,"").split("\n"),H=0;H<G.length;){var I=H+1,M=G[H].match(F);if(null!==M){switch(M.slice(1).reduce((function(e,t){return e||t}),void 0)){case"highlight-next-line":q+=I+",";break;case"highlight-start":P=I;break;case"highlight-end":q+=P+"-"+(I-1)+","}G.splice(H,1)}else H+=1}w=h.a.parse(q),J=G.join("\n")}var X=function(){o()(J),B(!0),setTimeout((function(){return B(!1)}),2e3)};return s.a.createElement(r.a,Object(n.a)({},r.b,{key:O,theme:T,code:J,language:L}),(function(e){var t,a,c,r=e.className,l=e.style,o=e.tokens,u=e.getLineProps,h=e.getTokenProps;return s.a.createElement(s.a.Fragment,null,N&&s.a.createElement("div",{style:l,className:j.a.codeBlockTitle},N),s.a.createElement("div",{className:j.a.codeBlockContent},s.a.createElement("a",{type:"button","aria-label":"Run in new tab",className:Object(i.a)(j.a.copyButton,(t={},t[j.a.copyButtonWithTitle]=N,t)),style:{visibility:R.length>0?"visible":"hidden",background:"rgba(0, 255, 0, 0.3)",opacity:1,paddingBottom:"0.2rem",paddingTop:"0.2rem"},href:R,target:"_blank"},"Run"),s.a.createElement("button",{type:"button","aria-label":"Copy code to clipboard",className:Object(i.a)(j.a.copyButton,(a={},a[j.a.copyButtonWithTitle]=N,a)),style:{marginRight:R.length>0?"50px":"0"},onClick:X},k?"Copied":"Copy"),s.a.createElement("div",{tabIndex:"0",className:Object(i.a)(r,j.a.codeBlock,(c={},c[j.a.codeBlockWithTitle]=N,c))},s.a.createElement("div",{className:j.a.codeBlockLines,style:l},o.map((function(e,t){1===e.length&&""===e[0].content&&(e[0].content="\n");var a=u({line:e,key:t});return w.includes(t+1)&&(a.className=a.className+" docusaurus-highlight-code-line"),s.a.createElement("div",Object(n.a)({key:t},a),e.map((function(e,t){return s.a.createElement("span",Object(n.a)({key:t},h({token:e,key:t})))})))}))))))}))}}}]);