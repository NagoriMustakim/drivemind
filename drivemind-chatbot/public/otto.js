(function(){"use strict";var q,m,ft,I,ht,gt,mt,ot,j,M,xt,nt,rt,it,Y={},J=[],jt=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,G=Array.isArray;function z(t,e){for(var o in e)t[o]=e[o];return t}function at(t){t&&t.parentNode&&t.parentNode.removeChild(t)}function Yt(t,e,o){var r,i,n,s={};for(n in e)n=="key"?r=e[n]:n=="ref"?i=e[n]:s[n]=e[n];if(arguments.length>2&&(s.children=arguments.length>3?q.call(arguments,2):o),typeof t=="function"&&t.defaultProps!=null)for(n in t.defaultProps)s[n]===void 0&&(s[n]=t.defaultProps[n]);return V(t,s,r,i,null)}function V(t,e,o,r,i){var n={type:t,props:e,key:o,ref:r,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:i??++ft,__i:-1,__u:0};return i==null&&m.vnode!=null&&m.vnode(n),n}function H(t){return t.children}function K(t,e){this.props=t,this.context=e}function D(t,e){if(e==null)return t.__?D(t.__,t.__i+1):null;for(var o;e<t.__k.length;e++)if((o=t.__k[e])!=null&&o.__e!=null)return o.__e;return typeof t.type=="function"?D(t):null}function Jt(t){if(t.__P&&t.__d){var e=t.__v,o=e.__e,r=[],i=[],n=z({},e);n.__v=e.__v+1,m.vnode&&m.vnode(n),st(t.__P,n,e,t.__n,t.__P.namespaceURI,32&e.__u?[o]:null,r,o??D(e),!!(32&e.__u),i),n.__v=e.__v,n.__.__k[n.__i]=n,Ct(r,n,i),e.__e=e.__=null,n.__e!=o&&bt(n)}}function bt(t){if((t=t.__)!=null&&t.__c!=null)return t.__e=t.__c.base=null,t.__k.some(function(e){if(e!=null&&e.__e!=null)return t.__e=t.__c.base=e.__e}),bt(t)}function vt(t){(!t.__d&&(t.__d=!0)&&I.push(t)&&!X.__r++||ht!=m.debounceRendering)&&((ht=m.debounceRendering)||gt)(X)}function X(){try{for(var t,e=1;I.length;)I.length>e&&I.sort(mt),t=I.shift(),e=I.length,Jt(t)}finally{I.length=X.__r=0}}function yt(t,e,o,r,i,n,s,d,_,c,p){var a,f,u,x,P,k,h,g=r&&r.__k||J,E=e.length;for(_=Gt(o,e,g,_,E),a=0;a<E;a++)(u=o.__k[a])!=null&&(f=u.__i!=-1&&g[u.__i]||Y,u.__i=a,k=st(t,u,f,i,n,s,d,_,c,p),x=u.__e,u.ref&&f.ref!=u.ref&&(f.ref&&ct(f.ref,null,u),p.push(u.ref,u.__c||x,u)),P==null&&x!=null&&(P=x),(h=!!(4&u.__u))||f.__k===u.__k?(_=kt(u,_,t,h),h&&f.__e&&(f.__e=null)):typeof u.type=="function"&&k!==void 0?_=k:x&&(_=x.nextSibling),u.__u&=-7);return o.__e=P,_}function Gt(t,e,o,r,i){var n,s,d,_,c,p=o.length,a=p,f=0;for(t.__k=new Array(i),n=0;n<i;n++)(s=e[n])!=null&&typeof s!="boolean"&&typeof s!="function"?(typeof s=="string"||typeof s=="number"||typeof s=="bigint"||s.constructor==String?s=t.__k[n]=V(null,s,null,null,null):G(s)?s=t.__k[n]=V(H,{children:s},null,null,null):s.constructor===void 0&&s.__b>0?s=t.__k[n]=V(s.type,s.props,s.key,s.ref?s.ref:null,s.__v):t.__k[n]=s,_=n+f,s.__=t,s.__b=t.__b+1,d=null,(c=s.__i=Vt(s,o,_,a))!=-1&&(a--,(d=o[c])&&(d.__u|=2)),d==null||d.__v==null?(c==-1&&(i>p?f--:i<p&&f++),typeof s.type!="function"&&(s.__u|=4)):c!=_&&(c==_-1?f--:c==_+1?f++:(c>_?f--:f++,s.__u|=4))):t.__k[n]=null;if(a)for(n=0;n<p;n++)(d=o[n])!=null&&!(2&d.__u)&&(d.__e==r&&(r=D(d)),Pt(d,d));return r}function kt(t,e,o,r){var i,n;if(typeof t.type=="function"){for(i=t.__k,n=0;i&&n<i.length;n++)i[n]&&(i[n].__=t,e=kt(i[n],e,o,r));return e}t.__e!=e&&(r&&(e&&t.type&&!e.parentNode&&(e=D(t)),o.insertBefore(t.__e,e||null)),e=t.__e);do e=e&&e.nextSibling;while(e!=null&&e.nodeType==8);return e}function Vt(t,e,o,r){var i,n,s,d=t.key,_=t.type,c=e[o],p=c!=null&&(2&c.__u)==0;if(c===null&&d==null||p&&d==c.key&&_==c.type)return o;if(r>(p?1:0)){for(i=o-1,n=o+1;i>=0||n<e.length;)if((c=e[s=i>=0?i--:n++])!=null&&!(2&c.__u)&&d==c.key&&_==c.type)return s}return-1}function wt(t,e,o){e[0]=="-"?t.setProperty(e,o??""):t[e]=o==null?"":typeof o!="number"||jt.test(e)?o:o+"px"}function Q(t,e,o,r,i){var n,s;t:if(e=="style")if(typeof o=="string")t.style.cssText=o;else{if(typeof r=="string"&&(t.style.cssText=r=""),r)for(e in r)o&&e in o||wt(t.style,e,"");if(o)for(e in o)r&&o[e]==r[e]||wt(t.style,e,o[e])}else if(e[0]=="o"&&e[1]=="n")n=e!=(e=e.replace(xt,"$1")),s=e.toLowerCase(),e=s in t||e=="onFocusOut"||e=="onFocusIn"?s.slice(2):e.slice(2),t.l||(t.l={}),t.l[e+n]=o,o?r?o[M]=r[M]:(o[M]=nt,t.addEventListener(e,n?it:rt,n)):t.removeEventListener(e,n?it:rt,n);else{if(i=="http://www.w3.org/2000/svg")e=e.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(e!="width"&&e!="height"&&e!="href"&&e!="list"&&e!="form"&&e!="tabIndex"&&e!="download"&&e!="rowSpan"&&e!="colSpan"&&e!="role"&&e!="popover"&&e in t)try{t[e]=o??"";break t}catch{}typeof o=="function"||(o==null||o===!1&&e[4]!="-"?t.removeAttribute(e):t.setAttribute(e,e=="popover"&&o==1?"":o))}}function St(t){return function(e){if(this.l){var o=this.l[e.type+t];if(e[j]==null)e[j]=nt++;else if(e[j]<o[M])return;return o(m.event?m.event(e):e)}}}function st(t,e,o,r,i,n,s,d,_,c){var p,a,f,u,x,P,k,h,g,E,T,N,b,w,W,$=e.type;if(e.constructor!==void 0)return null;128&o.__u&&(_=!!(32&o.__u),n=[d=e.__e=o.__e]),(p=m.__b)&&p(e);t:if(typeof $=="function")try{if(h=e.props,g=$.prototype&&$.prototype.render,E=(p=$.contextType)&&r[p.__c],T=p?E?E.props.value:p.__:r,o.__c?k=(a=e.__c=o.__c).__=a.__E:(g?e.__c=a=new $(h,T):(e.__c=a=new K(h,T),a.constructor=$,a.render=Xt),E&&E.sub(a),a.state||(a.state={}),a.__n=r,f=a.__d=!0,a.__h=[],a._sb=[]),g&&a.__s==null&&(a.__s=a.state),g&&$.getDerivedStateFromProps!=null&&(a.__s==a.state&&(a.__s=z({},a.__s)),z(a.__s,$.getDerivedStateFromProps(h,a.__s))),u=a.props,x=a.state,a.__v=e,f)g&&$.getDerivedStateFromProps==null&&a.componentWillMount!=null&&a.componentWillMount(),g&&a.componentDidMount!=null&&a.__h.push(a.componentDidMount);else{if(g&&$.getDerivedStateFromProps==null&&h!==u&&a.componentWillReceiveProps!=null&&a.componentWillReceiveProps(h,T),e.__v==o.__v||!a.__e&&a.shouldComponentUpdate!=null&&a.shouldComponentUpdate(h,a.__s,T)===!1){e.__v!=o.__v&&(a.props=h,a.state=a.__s,a.__d=!1),e.__e=o.__e,e.__k=o.__k,e.__k.some(function(S){S&&(S.__=e)}),J.push.apply(a.__h,a._sb),a._sb=[],a.__h.length&&s.push(a);break t}a.componentWillUpdate!=null&&a.componentWillUpdate(h,a.__s,T),g&&a.componentDidUpdate!=null&&a.__h.push(function(){a.componentDidUpdate(u,x,P)})}if(a.context=T,a.props=h,a.__P=t,a.__e=!1,N=m.__r,b=0,g)a.state=a.__s,a.__d=!1,N&&N(e),p=a.render(a.props,a.state,a.context),J.push.apply(a.__h,a._sb),a._sb=[];else do a.__d=!1,N&&N(e),p=a.render(a.props,a.state,a.context),a.state=a.__s;while(a.__d&&++b<25);a.state=a.__s,a.getChildContext!=null&&(r=z(z({},r),a.getChildContext())),g&&!f&&a.getSnapshotBeforeUpdate!=null&&(P=a.getSnapshotBeforeUpdate(u,x)),w=p!=null&&p.type===H&&p.key==null?$t(p.props.children):p,d=yt(t,G(w)?w:[w],e,o,r,i,n,s,d,_,c),a.base=e.__e,e.__u&=-161,a.__h.length&&s.push(a),k&&(a.__E=a.__=null)}catch(S){if(e.__v=null,_||n!=null)if(S.then){for(e.__u|=_?160:128;d&&d.nodeType==8&&d.nextSibling;)d=d.nextSibling;n[n.indexOf(d)]=null,e.__e=d}else{for(W=n.length;W--;)at(n[W]);lt(e)}else e.__e=o.__e,e.__k=o.__k,S.then||lt(e);m.__e(S,e,o)}else n==null&&e.__v==o.__v?(e.__k=o.__k,e.__e=o.__e):d=e.__e=Kt(o.__e,e,o,r,i,n,s,_,c);return(p=m.diffed)&&p(e),128&e.__u?void 0:d}function lt(t){t&&(t.__c&&(t.__c.__e=!0),t.__k&&t.__k.some(lt))}function Ct(t,e,o){for(var r=0;r<o.length;r++)ct(o[r],o[++r],o[++r]);m.__c&&m.__c(e,t),t.some(function(i){try{t=i.__h,i.__h=[],t.some(function(n){n.call(i)})}catch(n){m.__e(n,i.__v)}})}function $t(t){return typeof t!="object"||t==null||t.__b>0?t:G(t)?t.map($t):t.constructor!==void 0?null:z({},t)}function Kt(t,e,o,r,i,n,s,d,_){var c,p,a,f,u,x,P,k=o.props||Y,h=e.props,g=e.type;if(g=="svg"?i="http://www.w3.org/2000/svg":g=="math"?i="http://www.w3.org/1998/Math/MathML":i||(i="http://www.w3.org/1999/xhtml"),n!=null){for(c=0;c<n.length;c++)if((u=n[c])&&"setAttribute"in u==!!g&&(g?u.localName==g:u.nodeType==3)){t=u,n[c]=null;break}}if(t==null){if(g==null)return document.createTextNode(h);t=document.createElementNS(i,g,h.is&&h),d&&(m.__m&&m.__m(e,n),d=!1),n=null}if(g==null)k===h||d&&t.data==h||(t.data=h);else{if(n=g=="textarea"&&h.defaultValue!=null?null:n&&q.call(t.childNodes),!d&&n!=null)for(k={},c=0;c<t.attributes.length;c++)k[(u=t.attributes[c]).name]=u.value;for(c in k)u=k[c],c=="dangerouslySetInnerHTML"?a=u:c=="children"||c in h||c=="value"&&"defaultValue"in h||c=="checked"&&"defaultChecked"in h||Q(t,c,null,u,i);for(c in h)u=h[c],c=="children"?f=u:c=="dangerouslySetInnerHTML"?p=u:c=="value"?x=u:c=="checked"?P=u:d&&typeof u!="function"||k[c]===u||Q(t,c,u,k[c],i);if(p)d||a&&(p.__html==a.__html||p.__html==t.innerHTML)||(t.innerHTML=p.__html),e.__k=[];else if(a&&(t.innerHTML=""),yt(e.type=="template"?t.content:t,G(f)?f:[f],e,o,r,g=="foreignObject"?"http://www.w3.org/1999/xhtml":i,n,s,n?n[0]:o.__k&&D(o,0),d,_),n!=null)for(c=n.length;c--;)at(n[c]);d&&g!="textarea"||(c="value",g=="progress"&&x==null?t.removeAttribute("value"):x!=null&&(x!==t[c]||g=="progress"&&!x||g=="option"&&x!=k[c])&&Q(t,c,x,k[c],i),c="checked",P!=null&&P!=t[c]&&Q(t,c,P,k[c],i))}return t}function ct(t,e,o){try{if(typeof t=="function"){var r=typeof t.__u=="function";r&&t.__u(),r&&e==null||(t.__u=t(e))}else t.current=e}catch(i){m.__e(i,o)}}function Pt(t,e,o){var r,i;if(m.unmount&&m.unmount(t),(r=t.ref)&&(r.current&&r.current!=t.__e||ct(r,null,e)),(r=t.__c)!=null){if(r.componentWillUnmount)try{r.componentWillUnmount()}catch(n){m.__e(n,e)}r.base=r.__P=null}if(r=t.__k)for(i=0;i<r.length;i++)r[i]&&Pt(r[i],e,o||typeof t.type!="function");o||at(t.__e),t.__c=t.__=t.__e=void 0}function Xt(t,e,o){return this.constructor(t,o)}function Tt(t,e,o){var r,i,n,s;e==document&&(e=document.documentElement),m.__&&m.__(t,e),i=(r=!1)?null:e.__k,n=[],s=[],st(e,t=e.__k=Yt(H,null,[t]),i||Y,Y,e.namespaceURI,i?null:e.firstChild?q.call(e.childNodes):null,n,i?i.__e:e.firstChild,r,s),Ct(n,t,s)}q=J.slice,m={__e:function(t,e,o,r){for(var i,n,s;e=e.__;)if((i=e.__c)&&!i.__)try{if((n=i.constructor)&&n.getDerivedStateFromError!=null&&(i.setState(n.getDerivedStateFromError(t)),s=i.__d),i.componentDidCatch!=null&&(i.componentDidCatch(t,r||{}),s=i.__d),s)return i.__E=i}catch(d){t=d}throw t}},ft=0,K.prototype.setState=function(t,e){var o;o=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=z({},this.state),typeof t=="function"&&(t=t(z({},o),this.props)),t&&z(o,t),t!=null&&this.__v&&(e&&this._sb.push(e),vt(this))},K.prototype.forceUpdate=function(t){this.__v&&(this.__e=!0,t&&this.__h.push(t),vt(this))},K.prototype.render=H,I=[],gt=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,mt=function(t,e){return t.__v.__b-e.__v.__b},X.__r=0,ot=Math.random().toString(8),j="__d"+ot,M="__a"+ot,xt=/(PointerCapture)$|Capture$/i,nt=0,rt=St(!1),it=St(!0);var Qt=0;function l(t,e,o,r,i,n){e||(e={});var s,d,_=e;if("ref"in _)for(d in _={},e)d=="ref"?s=e[d]:_[d]=e[d];var c={type:t,props:_,key:o,ref:s,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--Qt,__i:-1,__u:0,__source:i,__self:n};if(typeof t=="function"&&(s=t.defaultProps))for(d in s)_[d]===void 0&&(_[d]=s[d]);return m.vnode&&m.vnode(c),c}var F,v,dt,At,B=0,Et=[],y=m,zt=y.__b,It=y.__r,Ot=y.diffed,Nt=y.__c,Ht=y.unmount,Dt=y.__;function _t(t,e){y.__h&&y.__h(v,t,B||e),B=0;var o=v.__H||(v.__H={__:[],__h:[]});return t>=o.__.length&&o.__.push({}),o.__[t]}function O(t){return B=1,Zt(Bt,t)}function Zt(t,e,o){var r=_t(F++,2);if(r.t=t,!r.__c&&(r.__=[Bt(void 0,e),function(d){var _=r.__N?r.__N[0]:r.__[0],c=r.t(_,d);_!==c&&(r.__N=[c,r.__[1]],r.__c.setState({}))}],r.__c=v,!v.__f)){var i=function(d,_,c){if(!r.__c.__H)return!0;var p=r.__c.__H.__.filter(function(f){return f.__c});if(p.every(function(f){return!f.__N}))return!n||n.call(this,d,_,c);var a=r.__c.props!==d;return p.some(function(f){if(f.__N){var u=f.__[0];f.__=f.__N,f.__N=void 0,u!==f.__[0]&&(a=!0)}}),n&&n.call(this,d,_,c)||a};v.__f=!0;var n=v.shouldComponentUpdate,s=v.componentWillUpdate;v.componentWillUpdate=function(d,_,c){if(this.__e){var p=n;n=void 0,i(d,_,c),n=p}s&&s.call(this,d,_,c)},v.shouldComponentUpdate=i}return r.__N||r.__}function L(t,e){var o=_t(F++,3);!y.__s&&Ft(o.__H,e)&&(o.__=t,o.u=e,v.__H.__h.push(o))}function pt(t){return B=5,Ut(function(){return{current:t}},[])}function Ut(t,e){var o=_t(F++,7);return Ft(o.__H,e)&&(o.__=t(),o.__H=e,o.__h=t),o.__}function Z(t,e){return B=8,Ut(function(){return t},e)}function te(){for(var t;t=Et.shift();){var e=t.__H;if(t.__P&&e)try{e.__h.some(tt),e.__h.some(ut),e.__h=[]}catch(o){e.__h=[],y.__e(o,t.__v)}}}y.__b=function(t){v=null,zt&&zt(t)},y.__=function(t,e){t&&e.__k&&e.__k.__m&&(t.__m=e.__k.__m),Dt&&Dt(t,e)},y.__r=function(t){It&&It(t),F=0;var e=(v=t.__c).__H;e&&(dt===v?(e.__h=[],v.__h=[],e.__.some(function(o){o.__N&&(o.__=o.__N),o.u=o.__N=void 0})):(e.__h.some(tt),e.__h.some(ut),e.__h=[],F=0)),dt=v},y.diffed=function(t){Ot&&Ot(t);var e=t.__c;e&&e.__H&&(e.__H.__h.length&&(Et.push(e)!==1&&At===y.requestAnimationFrame||((At=y.requestAnimationFrame)||ee)(te)),e.__H.__.some(function(o){o.u&&(o.__H=o.u),o.u=void 0})),dt=v=null},y.__c=function(t,e){e.some(function(o){try{o.__h.some(tt),o.__h=o.__h.filter(function(r){return!r.__||ut(r)})}catch(r){e.some(function(i){i.__h&&(i.__h=[])}),e=[],y.__e(r,o.__v)}}),Nt&&Nt(t,e)},y.unmount=function(t){Ht&&Ht(t);var e,o=t.__c;o&&o.__H&&(o.__H.__.some(function(r){try{tt(r)}catch(i){e=i}}),o.__H=void 0,e&&y.__e(e,o.__v))};var Mt=typeof requestAnimationFrame=="function";function ee(t){var e,o=function(){clearTimeout(r),Mt&&cancelAnimationFrame(e),setTimeout(t)},r=setTimeout(o,35);Mt&&(e=requestAnimationFrame(o))}function tt(t){var e=v,o=t.__c;typeof o=="function"&&(t.__c=void 0,o()),v=e}function ut(t){var e=v;t.__c=t.__(),v=e}function Ft(t,e){return!t||t.length!==e.length||e.some(function(o,r){return o!==t[r]})}function Bt(t,e){return typeof e=="function"?e(t):e}async function oe(t,e){const o=t.getReader(),r=new TextDecoder;let i="";for(;;){const{done:n,value:s}=await o.read();if(n)break;i+=r.decode(s,{stream:!0});let d;for(;(d=i.indexOf(`

`))!==-1;){const _=i.slice(0,d);i=i.slice(d+2);const c=/event: (.*)/.exec(_)?.[1]?.trim(),p=/data: (.*)/.exec(_)?.[1];if(!(!c||p===void 0))try{e(c,JSON.parse(p))}catch{}}}}async function ne(t,e){const o=await fetch(`${t}/session`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({dealerId:e})});if(!o.ok)throw new Error(`session failed (${o.status})`);return(await o.json()).token}async function re(t,e,o,r,i){let n;try{n=await fetch(`${t}/query`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify({message:o,history:r})})}catch{i.onError("Sorry, I couldn't reach the service. Please try again.");return}if(!n.ok||!n.body){i.onError(n.status===503?"The assistant is waking up. Please try again in a moment.":"Something went wrong. Please try again.");return}await oe(n.body,(s,d)=>{s==="delta"?i.onDelta(d.text):s==="result"?i.onResult(d):s==="status"?i.onStatus?.(d.stage,d.count):s==="error"&&i.onError(d.message)})}function ie(t){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(t)}function ae(t){return`${new Intl.NumberFormat("en-US").format(t)} mi`}function se({car:t,index:e=0}){return l("a",{class:"otto-card",href:t.detailUrl,target:"_top",style:`animation-delay:${e*80}ms`,children:[l("div",{class:"media",children:[l("span",{class:"tag",children:t.bodyType}),l("span",{class:"price-badge",children:ie(t.price)}),t.imageUrl?l("img",{src:t.imageUrl,alt:`${t.year} ${t.make} ${t.model}`}):null]}),l("div",{class:"body",children:[l("div",{class:"title",children:[t.year," ",t.make," ",t.model]}),l("div",{class:"meta",children:[ae(t.mileage)," · ",t.bodyType]}),t.why?l("div",{class:"why",children:t.why}):null,l("div",{class:"cta",children:["View details ",l("span",{class:"a",children:"→"})]})]})]})}function le({cars:t}){return t.length===0?null:l("div",{class:"otto-cards",children:t.map((e,o)=>l(se,{car:e,index:o},e.id))})}function ce({items:t,onPick:e}){return t.length===0?null:l("div",{class:"otto-chips",children:t.map(o=>l("button",{class:"otto-chip",onClick:()=>e(o),type:"button",children:o},o))})}const de="Hi, I'm Otto 👋 — your personal car-finding concierge. Tell me what you're after and I'll match it to cars on our floor in seconds.",_e=["A reliable family SUV under $30k","A fun weekend car","Best value low-mileage car","Something for a long commute"],pe="otto:chat:";function R(){return l("span",{class:"otto-mark",children:l("svg",{viewBox:"0 0 32 32",fill:"none","aria-hidden":"true",children:[l("rect",{x:"6",y:"9",width:"20",height:"15",rx:"5",fill:"#fff",opacity:"0.96"}),l("circle",{cx:"12.5",cy:"16.5",r:"2.4",fill:"#E11D2A"}),l("circle",{cx:"19.5",cy:"16.5",r:"2.4",fill:"#E11D2A"}),l("path",{d:"M16 4.5v3.5",stroke:"#fff","stroke-width":"2","stroke-linecap":"round"}),l("circle",{cx:"16",cy:"4",r:"1.8",fill:"#fff"})]})})}function ue(){return l("span",{class:"otto-av user","aria-hidden":"true",children:l("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor","stroke-width":"1.8",children:[l("circle",{cx:"12",cy:"8",r:"3.5"}),l("path",{d:"M4.5 20a7.5 7.5 0 0 1 15 0","stroke-linecap":"round"})]})})}const Lt=["Lining up Otto's top picks…","Weighing up the best fit for you…","Almost there — polishing the details…"];function fe(t,e,o){switch(t){case"searching":return"Searching the showroom…";case"matching":return e&&e>0?`Found ${e} strong match${e>1?"es":""} — sizing them up…`:"Scanning the full inventory…";case"composing":return Lt[o%Lt.length];default:return"Otto is typing…"}}function he({stage:t,count:e}){const[o,r]=O(0);return L(()=>{if(t!=="composing")return;const i=setInterval(()=>r(n=>n+1),1900);return()=>clearInterval(i)},[t]),l("div",{class:"otto-row assistant",children:[l("span",{class:"otto-av",children:l(R,{})}),l("div",{class:"otto-thinking",children:l("div",{class:"bubble",children:[l("span",{class:"otto-dots",children:[l("i",{}),l("i",{}),l("i",{})]}),l("span",{class:"otto-think-label",children:fe(t,e,o)})]})})]})}function ge({message:t,busy:e,isLast:o,onChip:r}){return t.role==="assistant"&&!t.content&&e&&o?l(he,{stage:t.stage,count:t.count}):l(H,{children:[t.content?l("div",{class:`otto-row ${t.role}`,children:[l("span",{class:"otto-av",children:t.role==="assistant"?l(R,{}):null}),t.role==="user"?l(ue,{}):null,l("div",{class:"stack",children:l("div",{class:`otto-msg ${t.role}`,children:t.content})})]}):null,t.cars?l(le,{cars:t.cars}):null,!e&&t.suggestedAnswers?l(ce,{items:t.suggestedAnswers,onPick:r}):null]})}function Rt({config:t}){const e=pe+t.dealerId,[o,r]=O(!1),[i,n]=O(!1),[s,d]=O([]),[_,c]=O(""),[p,a]=O(!1),[f,u]=O(!1),x=pt(null),P=pt(null),k=pt(!1);L(()=>{try{const b=sessionStorage.getItem(e);if(b){const w=JSON.parse(b);Array.isArray(w.messages)&&d(w.messages),w.token&&(x.current=w.token),w.open&&r(!0)}}catch{}k.current=!0},[e]),L(()=>{if(!(!k.current||p))try{const b=s.filter(w=>w.content||w.cars);sessionStorage.setItem(e,JSON.stringify({messages:b,token:x.current,open:o}))}catch{}},[s,o,p,e]),L(()=>{if(o||s.length>0)return;const b=setTimeout(()=>u(!0),6e3);return()=>clearTimeout(b)},[o,s.length]),L(()=>{P.current?.scrollTo({top:P.current.scrollHeight,behavior:"smooth"})},[s,o]);const h=Z(async()=>{if(x.current)return x.current;const b=await ne(t.apiBase,t.dealerId);return x.current=b,b},[t]),g=Z(()=>{u(!1),r(!0)},[]),E=Z(()=>{n(!0),setTimeout(()=>{n(!1),r(!1)},250)},[]),T=Z(async b=>{const w=b.trim();if(!w||p)return;c(""),a(!0);const W=s.filter(S=>S.content).map(S=>({role:S.role,content:S.content}));d(S=>[...S,{role:"user",content:w},{role:"assistant",content:""}]);const $=S=>d(A=>{const C=[...A],U=C[C.length-1];return U&&U.role==="assistant"&&S(U),C});try{const S=await h();await re(t.apiBase,S,w,W,{onStatus:(A,C)=>$(U=>{U.stage=A,C!==void 0&&(U.count=C)}),onDelta:A=>$(C=>{C.content+=A,C.stage=void 0}),onResult:A=>$(C=>{C.content=A.response,C.cars=A.cars,C.suggestedAnswers=A.suggestedAnswers,C.stage=void 0}),onError:A=>$(C=>{C.content=A,C.stage=void 0})})}catch{$(S=>{S.content="Sorry, something went wrong. Please try again.",S.stage=void 0})}finally{a(!1)}},[p,s,h,t]);if(!o)return l(H,{children:[f?l("div",{class:"otto-nudge",role:"status",children:[l("button",{class:"x",onClick:()=>u(!1),"aria-label":"Dismiss",children:"×"}),"Looking for your next car? ",l("b",{children:"Ask Otto"})," — I'll find it in seconds. ","👋"]}):null,l("button",{class:"otto-launcher",onClick:g,"aria-label":"Open Otto, the car assistant",children:[l("span",{class:"av",children:[l(R,{}),l("span",{class:"dot"})]}),"Ask Otto"]})]});const N=s.length===0;return l("div",{class:`otto-panel ${i?"closing":""}`,role:"dialog","aria-label":"Otto car assistant",children:[l("div",{class:"otto-header",children:[l("span",{class:"badge",children:[l(R,{}),l("span",{class:"live"})]}),l("div",{class:"who",children:[l("div",{class:"name",children:"Otto"}),l("div",{class:"sub",children:[l("span",{style:"width:6px;height:6px;border-radius:9999px;background:#22c55e;display:inline-block"}),"Online · Car concierge"]})]}),l("button",{class:"otto-close",onClick:E,"aria-label":"Close",children:"×"})]}),l("div",{class:"otto-messages",ref:P,children:N?l("div",{class:"otto-welcome",children:[l("span",{class:"hero-av",children:l(R,{})}),l("div",{class:"hi",children:["Welcome ","👋"]}),l("p",{class:"lead",children:de}),l("div",{class:"otto-qcards",children:_e.map(b=>l("button",{class:"otto-qcard",onClick:()=>T(b),type:"button",children:[b,l("span",{class:"arr",children:"→"})]},b))})]}):s.map((b,w)=>l(ge,{message:b,busy:p,isLast:w===s.length-1,onChip:T},w))}),l("form",{class:"otto-input",onSubmit:b=>{b.preventDefault(),T(_)},children:[l("input",{value:_,onInput:b=>c(b.target.value),placeholder:"Describe the car you want…","aria-label":"Message Otto",disabled:p}),l("button",{type:"submit",disabled:p||!_.trim(),"aria-label":"Send",children:l("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round",children:[l("path",{d:"M22 2 11 13"}),l("path",{d:"M22 2 15 22l-4-9-9-4 20-7Z"})]})})]})]})}const Wt=`
:host {
  --accent: #E11D2A;
  --accent-bright: #FF3B41;
  --ink: #0B0B0F;
  --coal: #131318;
  --carbon: #1B1B22;
  --steel: #25252E;
  --line: rgba(255,255,255,.08);
  --fog: #C9C9D4;
  --ash: #8A8A97;
  all: initial;
}
:host, * { box-sizing: border-box; }
.otto * { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, system-ui, sans-serif; }

/* ───────────── Launcher ───────────── */
.otto-launcher {
  position: fixed; bottom: 22px; right: 22px; z-index: 2147483000;
  display: flex; align-items: center; gap: 10px;
  background: linear-gradient(135deg, var(--accent), var(--accent-bright));
  color: #fff; border: none; cursor: pointer;
  border-radius: 9999px; padding: 10px 20px 10px 10px;
  font: 600 14.5px system-ui, sans-serif; letter-spacing: .01em;
  box-shadow: 0 10px 30px -6px rgba(225,29,42,.6), 0 4px 12px rgba(0,0,0,.4);
  animation: otto-launch-in .5s cubic-bezier(.16,1,.3,1) both;
  transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s;
}
.otto-launcher:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 16px 40px -8px rgba(225,29,42,.7); }
.otto-launcher:active { transform: translateY(0) scale(.99); }
.otto-launcher .av { position: relative; flex: none; width: 34px; height: 34px; }
.otto-launcher .av::before {
  content: ""; position: absolute; inset: -4px; border-radius: 9999px;
  border: 2px solid rgba(255,255,255,.55); animation: otto-ring 2s ease-out infinite;
}
.otto-launcher .dot {
  position: absolute; top: -2px; right: -2px; width: 11px; height: 11px;
  background: #22c55e; border: 2px solid #fff; border-radius: 9999px;
}

/* one-time nudge bubble so visitors notice Otto */
.otto-nudge {
  position: fixed; bottom: 84px; right: 22px; z-index: 2147482999;
  max-width: 230px; background: #fff; color: #0b0b0f;
  border-radius: 16px 16px 4px 16px; padding: 12px 14px; font: 500 13.5px system-ui, sans-serif;
  box-shadow: 0 14px 40px -10px rgba(0,0,0,.5); animation: otto-rise .45s cubic-bezier(.16,1,.3,1) both;
}
.otto-nudge b { color: var(--accent); }
.otto-nudge .x { position: absolute; top: 6px; right: 8px; cursor: pointer; color: #9ca3af; font-size: 15px; line-height: 1; background: none; border: none; }

/* ───────────── Panel shell ───────────── */
.otto-panel {
  position: fixed; bottom: 22px; right: 22px; z-index: 2147483000;
  width: 392px; max-width: calc(100vw - 24px);
  height: 640px; max-height: calc(100vh - 36px);
  display: flex; flex-direction: column;
  background: var(--ink); color: var(--fog);
  border: 1px solid var(--line); border-radius: 22px; overflow: hidden;
  box-shadow: 0 30px 80px -20px rgba(0,0,0,.7);
  transform-origin: bottom right;
  animation: otto-panel-in .42s cubic-bezier(.16,1,.3,1) both;
}
.otto-panel.closing { animation: otto-panel-out .26s cubic-bezier(.4,0,1,1) both; }

/* ───────────── Header ───────────── */
.otto-header {
  position: relative; display: flex; align-items: center; gap: 12px;
  padding: 16px 16px 16px 18px;
  background: linear-gradient(135deg, #1a0508 0%, var(--coal) 55%);
  border-bottom: 1px solid var(--line);
}
.otto-header .badge { position: relative; flex: none; }
.otto-header .badge .live {
  position: absolute; bottom: 0; right: 0; width: 11px; height: 11px;
  background: #22c55e; border: 2px solid var(--coal); border-radius: 9999px;
}
.otto-header .who { flex: 1; line-height: 1.2; }
.otto-header .who .name { font: 700 16px system-ui, sans-serif; color: #fff; letter-spacing: .01em; }
.otto-header .who .sub { font-size: 12px; color: #6fdc8c; display: flex; align-items: center; gap: 5px; }
.otto-close {
  flex: none; width: 32px; height: 32px; display: grid; place-items: center;
  background: rgba(255,255,255,.06); border: 1px solid var(--line); color: var(--fog);
  cursor: pointer; font-size: 18px; line-height: 1; border-radius: 9999px; transition: all .2s;
}
.otto-close:hover { background: var(--accent); color: #fff; border-color: var(--accent); transform: rotate(90deg); }

/* ───────────── Messages ───────────── */
.otto-messages {
  flex: 1; overflow-y: auto; padding: 18px 16px 8px;
  display: flex; flex-direction: column; gap: 14px;
  background:
    radial-gradient(120% 60% at 50% 0%, rgba(225,29,42,.10), transparent 60%),
    var(--ink);
  scrollbar-width: thin; scrollbar-color: var(--steel) transparent;
}
.otto-messages::-webkit-scrollbar { width: 8px; }
.otto-messages::-webkit-scrollbar-thumb { background: var(--steel); border-radius: 9999px; }

/* welcome hero */
.otto-welcome { text-align: center; padding: 8px 6px 4px; animation: otto-rise .5s cubic-bezier(.16,1,.3,1) both; }
.otto-welcome .hi { font: 800 22px system-ui, sans-serif; color: #fff; margin: 12px 0 4px; letter-spacing: -.01em; }
.otto-welcome .lead { font-size: 13.5px; color: var(--ash); line-height: 1.5; max-width: 280px; margin: 0 auto; }
.otto-qcards { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
.otto-qcard {
  display: flex; align-items: center; justify-content: space-between; gap: 8px; text-align: left;
  background: var(--carbon); border: 1px solid var(--line); color: var(--fog);
  border-radius: 14px; padding: 13px 14px; cursor: pointer; font: 600 13.5px system-ui, sans-serif;
  transition: all .2s cubic-bezier(.16,1,.3,1);
}
.otto-qcard:hover { border-color: var(--accent); color: #fff; transform: translateX(2px); background: var(--steel); }
.otto-qcard .arr { color: var(--accent); font-weight: 700; }

/* message rows with avatars */
.otto-row { display: flex; align-items: flex-end; gap: 8px; max-width: 92%; animation: otto-rise .4s cubic-bezier(.16,1,.3,1) both; }
.otto-row.assistant { align-self: flex-start; }
.otto-row.user { align-self: flex-end; flex-direction: row-reverse; }
.otto-row .stack { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.otto-av { flex: none; width: 30px; height: 30px; border-radius: 9999px; overflow: hidden; }
.otto-av.user { display: grid; place-items: center; background: var(--steel); color: var(--fog); }

.otto-msg { padding: 10px 13px; border-radius: 16px; line-height: 1.5; white-space: pre-wrap; font-size: 14px; word-wrap: break-word; }
.otto-msg.assistant { background: var(--carbon); color: #ECECF1; border: 1px solid var(--line); border-bottom-left-radius: 5px; }
.otto-msg.user { background: linear-gradient(135deg, var(--accent), var(--accent-bright)); color: #fff; border-bottom-right-radius: 5px; }

/* ───────────── Thinking / status ───────────── */
.otto-thinking { display: flex; align-items: center; gap: 10px; }
.otto-thinking .bubble {
  display: inline-flex; align-items: center; gap: 9px;
  background: var(--carbon); border: 1px solid var(--line);
  padding: 11px 14px; border-radius: 16px; border-bottom-left-radius: 5px;
}
.otto-dots { display: inline-flex; gap: 4px; }
.otto-dots i { width: 6px; height: 6px; border-radius: 9999px; background: var(--accent); display: block; animation: otto-bounce 1.2s infinite ease-in-out; }
.otto-dots i:nth-child(2) { animation-delay: .15s; }
.otto-dots i:nth-child(3) { animation-delay: .3s; }
.otto-think-label {
  font-size: 13px; color: var(--fog);
  background: linear-gradient(90deg, var(--ash) 0%, #fff 50%, var(--ash) 100%);
  background-size: 200% 100%; -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; animation: otto-shimmer 1.8s linear infinite;
}

/* ───────────── Cards ───────────── */
.otto-cards { display: flex; flex-direction: column; gap: 10px; align-self: flex-start; width: 100%; max-width: 100%; }
.otto-card {
  display: block; text-decoration: none; color: inherit; overflow: hidden;
  background: var(--carbon); border: 1px solid var(--line); border-radius: 16px;
  transition: transform .3s cubic-bezier(.16,1,.3,1), border-color .3s, box-shadow .3s;
  animation: otto-rise .45s cubic-bezier(.16,1,.3,1) both;
}
.otto-card:hover { transform: translateY(-3px); border-color: rgba(225,29,42,.5); box-shadow: 0 18px 40px -16px rgba(0,0,0,.8); }
.otto-card .media { position: relative; height: 132px; background: var(--steel); overflow: hidden; }
.otto-card .media img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
.otto-card:hover .media img { transform: scale(1.08); }
.otto-card .media::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to top, rgba(11,11,15,.85), transparent 55%); }
.otto-card .tag {
  position: absolute; top: 10px; left: 10px; z-index: 1;
  background: rgba(0,0,0,.55); backdrop-filter: blur(4px); color: #fff;
  font: 600 10px system-ui, sans-serif; text-transform: uppercase; letter-spacing: .08em;
  padding: 4px 9px; border-radius: 9999px;
}
.otto-card .price-badge {
  position: absolute; bottom: 10px; right: 10px; z-index: 1;
  background: var(--accent); color: #fff; font: 700 14px system-ui, sans-serif;
  padding: 5px 11px; border-radius: 9999px;
}
.otto-card .body { padding: 12px 14px 14px; }
.otto-card .title { font: 700 14.5px system-ui, sans-serif; color: #fff; }
.otto-card .meta { font-size: 11.5px; color: var(--ash); margin-top: 3px; }
.otto-card .why { color: var(--fog); font-size: 12.5px; margin-top: 8px; line-height: 1.45; display: flex; gap: 6px; }
.otto-card .why::before { content: ""; flex: none; width: 3px; border-radius: 9999px; background: var(--accent); }
.otto-card .cta { margin-top: 10px; font: 700 11px system-ui, sans-serif; text-transform: uppercase; letter-spacing: .1em; color: var(--accent); display: flex; align-items: center; gap: 5px; }
.otto-card:hover .cta .a { transform: translateX(3px); }
.otto-card .cta .a { transition: transform .25s; }

/* ───────────── Chips ───────────── */
.otto-chips { display: flex; flex-wrap: wrap; gap: 7px; align-self: flex-start; padding-left: 38px; max-width: 100%; }
.otto-chip {
  background: transparent; color: var(--fog); border: 1px solid var(--line);
  border-radius: 9999px; padding: 7px 13px; font: 600 12.5px system-ui, sans-serif; cursor: pointer;
  transition: all .2s;
}
.otto-chip:hover { background: rgba(225,29,42,.12); border-color: var(--accent); color: #fff; }

/* ───────────── Input ───────────── */
.otto-input { display: flex; gap: 9px; padding: 12px 14px 10px; border-top: 1px solid var(--line); background: var(--coal); }
.otto-input input {
  flex: 1; padding: 11px 15px; border: 1px solid var(--line); border-radius: 9999px;
  font: 14px system-ui, sans-serif; outline: none; background: var(--carbon); color: #fff;
  transition: border-color .2s;
}
.otto-input input::placeholder { color: var(--ash); }
.otto-input input:focus { border-color: var(--accent); }
.otto-input button {
  flex: none; width: 42px; height: 42px; display: grid; place-items: center;
  background: linear-gradient(135deg, var(--accent), var(--accent-bright)); color: #fff;
  border: none; border-radius: 9999px; cursor: pointer; transition: transform .2s, opacity .2s;
}
.otto-input button:hover:not(:disabled) { transform: scale(1.08); }
.otto-input button:disabled { opacity: .4; cursor: default; }
.otto-foot { text-align: center; font-size: 10.5px; color: var(--ash); padding: 0 0 9px; background: var(--coal); }
.otto-foot b { color: var(--fog); font-weight: 600; }

/* ───────────── Otto avatar mark ───────────── */
.otto-mark {
  display: grid; place-items: center; width: 100%; height: 100%; border-radius: 9999px;
  background: linear-gradient(135deg, var(--accent), var(--accent-bright));
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.14);
}
.otto-mark svg { width: 60%; height: 60%; display: block; }
.otto-header .badge { width: 44px; height: 44px; }
.otto-welcome .hero-av { width: 66px; height: 66px; margin: 0 auto; }

/* ───────────── Keyframes ───────────── */
@keyframes otto-launch-in { 0% { opacity: 0; transform: translateY(20px) scale(.8); } 100% { opacity: 1; transform: none; } }
@keyframes otto-ring { 0% { transform: scale(1); opacity: .7; } 100% { transform: scale(1.5); opacity: 0; } }
@keyframes otto-panel-in { 0% { opacity: 0; transform: translateY(24px) scale(.92); } 100% { opacity: 1; transform: none; } }
@keyframes otto-panel-out { 0% { opacity: 1; transform: none; } 100% { opacity: 0; transform: translateY(24px) scale(.92); } }
@keyframes otto-rise { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: none; } }
@keyframes otto-bounce { 0%,80%,100% { transform: translateY(0); opacity: .5; } 40% { transform: translateY(-6px); opacity: 1; } }
@keyframes otto-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

@media (max-width: 480px) {
  .otto-panel { width: 100vw; height: 100dvh; max-height: 100dvh; bottom: 0; right: 0; border-radius: 0; border: none; }
  .otto-nudge { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .otto-launcher, .otto-panel, .otto-panel.closing, .otto-row, .otto-card, .otto-welcome, .otto-nudge { animation: none !important; }
  .otto-launcher .av::before, .otto-dots i, .otto-think-label { animation: none !important; }
}
`;function me(){const t=document.currentScript??document.querySelector("script[data-dealer-id]"),e=t?.dataset.dealerId,o=(t?.dataset.api??"").replace(/\/$/,""),r=t?.dataset.mode==="iframe"?"iframe":"shadow";return e?{dealerId:e,apiBase:o,mode:r}:(console.warn("[otto] missing data-dealer-id; widget not mounted"),null)}function qt(t){const e=document.createElement("div");e.id="drivemind-otto-root",document.body.appendChild(e);const o=e.attachShadow({mode:"open"}),r=document.createElement("style");r.textContent=Wt,o.appendChild(r);const i=document.createElement("div");o.appendChild(i),Tt(l(Rt,{config:t}),i)}function xe(t){const e=document.createElement("iframe");e.id="drivemind-otto-frame",e.setAttribute("title","Otto car assistant"),Object.assign(e.style,{position:"fixed",bottom:"0",right:"0",width:"420px",height:"640px",maxWidth:"100vw",border:"none",background:"transparent",zIndex:"2147483000"}),document.body.appendChild(e);const o=e.contentDocument;if(!o){qt(t);return}const r=o.createElement("style");r.textContent="html,body{margin:0;background:transparent}"+Wt,o.head.appendChild(r);const i=o.createElement("div");o.body.appendChild(i),Tt(l(Rt,{config:t}),i)}const et=me();et&&(et.mode==="iframe"?xe(et):qt(et))})();
