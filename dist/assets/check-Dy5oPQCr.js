import{a as s}from"./vendor-motion-Cmo8ZUk4.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),w=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,r,o)=>o?o.toUpperCase():r.toLowerCase()),n=e=>{const t=w(e);return t.charAt(0).toUpperCase()+t.slice(1)},l=(...e)=>e.filter((t,r,o)=>!!t&&t.trim()!==""&&o.indexOf(t)===r).join(" ").trim();/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var h={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=s.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:r=2,absoluteStrokeWidth:o,className:c="",children:a,iconNode:i,...m},u)=>s.createElement("svg",{ref:u,...h,width:t,height:t,stroke:e,strokeWidth:o?Number(r)*24/Number(t):r,className:l("lucide",c),...m},[...i.map(([C,d])=>s.createElement(C,d)),...Array.isArray(a)?a:[a]]));/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=(e,t)=>{const r=s.forwardRef(({className:o,...c},a)=>s.createElement(f,{ref:a,iconNode:t,className:l(`lucide-${p(n(e))}`,`lucide-${e}`,o),...c}));return r.displayName=n(e),r};/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],b=g("check",k);export{b as C,g as c};
