Object.defineProperty(exports,"__esModule",{value:!0})
var t=require("vscode"),e=require("fs"),i=require("child_process"),o=require("path"),s=require("url")
function n(t){return"file"===(null==t?void 0:t.document.uri.scheme)}function r(t,e){return`${t} ${e}${1===t?"":"s"}`}function a(e,i){var o
return null!==(o=t.workspace.getConfiguration("gitblame").get(e))&&void 0!==o?o:i}function c(t,e,i){const o=e.valueOf()-i.valueOf()
return Math.round(o/t)}function m(t){const e=t.indexOf(","),i=t.indexOf("|"),o=(e,i)=>t.substring(e,i)
return-1!==e&&-1!==i?{func:o(0,e),param:o(e+1,i),mod:o(i+1)}:-1!==e?{func:o(0,e),param:o(e+1),mod:""}:-1!==i?{func:o(0,i),param:"",mod:o(i+1)}:{func:t,param:"",mod:""}}function u(t,e){const i=c(315576e5,t,e),o=c(26298e5,t,e),s=c(864e5,t,e),n=c(36e5,t,e),a=((t,e)=>c(6e4,t,e))(t,e)
return a<5?"right now":a<60?a+" minutes ago":n<24?r(n,"hour")+" ago":s<31?r(s,"day")+" ago":o<12?r(o,"month")+" ago":r(i,"year")+" ago"}function l(t){const e=new Date,i=new Date(1e3*t.author.timestamp),o=new Date(1e3*t.committer.timestamp),s=t=>()=>t.toString(),n=s(u(e,i)),r=s(u(e,o)),a=s(i.toISOString().slice(0,10)),c=s(o.toISOString().slice(0,10)),m=(t,e)=>i=>{const o=(i||e).toString()
return t.substr(0,parseInt(o,10))}
return{"author.mail":s(t.author.mail),"author.name":s(t.author.name),"author.timestamp":s(t.author.timestamp),"author.tz":s(t.author.tz),"author.date":a,"commit.hash":s(t.hash),"commit.hash_short":m(t.hash,"7"),"commit.summary":m(t.summary,"65536"),"committer.mail":s(t.committer.mail),"committer.name":s(t.committer.name),"committer.timestamp":s(t.committer.timestamp),"committer.tz":s(t.committer.tz),"committer.date":c,"time.ago":n,"time.c_ago":r,"time.from":n,"time.c_from":r}}function h(t,e){const i=(t=>{const e=[]
let i=0,o=0
for(let s=0;s<t.length;s++)if(0===o&&/^\$\{[a-z]$/i.test(t.substr(s,3)))o=1,e.push(t.substring(i,s)),i=s,s+=1
else if(1===o&&"}"===t[s]){o=0
const n=s+1
e.push(m(t.substring(i+2,n-1))),i=n}return e.push(t.substring(i)),e})(t)
let o=""
for(const t of i){let i
"string"==typeof t?o+=t:(i=e[t.func],o+=(s=i?i(t.param):t.func,"u"===(n=t.mod)?s.toUpperCase():"l"===n?s.toLowerCase():n?`${s}|${n}`:""+s))}var s,n
return o}function d(t){return/^0{40}$/.test(t.hash)}class f{constructor(){this.out=t.window.createStatusBarItem(1,a("statusBarPositionPriority")),this.out.show()}update(t){t?d(t)?this.setText(a("statusBarMessageNoCommit","Not Committed Yet"),!1):this.setText((t=>{const e=a("statusBarMessageFormat")
return e?h(e,l(t)):"No configured message format for gitblame"})(t),!0):this.setText("",!1)}activity(){this.setText("$(sync~spin) Waiting for git blame response",!1)}dispose(){this.out.dispose()}setText(t,e){this.out.text="$(git-commit) "+t.trimEnd(),this.out.tooltip="git blame"+(e?"":" - No info about the current line"),this.out.command=e?"gitblame.quickInfo":void 0}}function p(e,...i){return Promise.resolve(t.window.showInformationMessage(e,...i))}function w(e,...i){return Promise.resolve(t.window.showErrorMessage(e,...i))}class g{constructor(){this.out=t.window.createOutputChannel("Extension: gitblame")}static getInstance(){return g.instance||(g.instance=new g),g.instance}info(t){this.write("info",t)}command(t){this.write("command",t)}error(t){this.write("error",t.toString())}critical(t,e){this.write("critical",t.toString()),this.showErrorMessage(e)}dispose(){g.instance=void 0,this.out.dispose()}async showErrorMessage(t){const e="Show Log"
await w(t,e)===e&&this.out.show()}write(t,e){if(a("logNonCritical")||"critical"===t){const i=(new Date).toTimeString().substr(0,8)
this.out.appendLine(`[ ${i} | ${t} ] ${e.trim()}`)}}}class v{constructor(t){g.getInstance().info(`Will not try to blame file "${t}" as it is outside of the current workspace`)}onDispose(){}blame(){return Promise.resolve(void 0)}dispose(){}}function b(){return t.window.activeTextEditor}function y(t){if("file"!==t.document.uri.scheme)return"no-file:-1"
const{document:e,selection:i}=t
return`${e.fileName}:${i.active.line}`}function $(){const e=t.extensions.getExtension("vscode.git")
return(null==e?void 0:e.exports.enabled)?e.exports.getAPI(1).git.path:"git"}async function x(t,e,o){return(async(t,e,o={})=>{const s=g.getInstance()
let n
s.command(`${t} ${e.join(" ")}`)
try{n=i.execFile(t,e,{...o,encoding:"utf8"})}catch(t){return s.error(t),""}if(!n.stdout)return""
let r=""
for await(const t of n.stdout)r+=t
return r.trim()})(t,e,{cwd:o})}function C(t,e=" "){const i=t.indexOf(e[0])
return-1===i?[t,""]:[t.substr(0,i),t.substr(i+1).trim()]}function T(t,e,i){"time"===e?t.timestamp=parseInt(i,10):"tz"===e||"mail"===e?t[e]=i:""===e&&(t.name=i)}function*D(t,e){"EMPTY"===t.hash||e.has(t.hash)||(e.add(t.hash),yield t)}function M(t){return/^\w{40}$/.test(t)}function S(t,e){return M(t)&&/^\d+ \d+ \d+$/.test(e)}function U(t,e,i){return S(t,e)&&/^(author|committer)/.test(i)}function z(t,e,i){"summary"===t?i.summary=e:M(t)?i.hash=t:((t,e,i)=>{const[o,s]=C(t,"-")
"author"===o?T(i.author,s,e):"committer"===o&&T(i.committer,s,e)})(t,e,i)}function*E(t,e){const[,i,o]=e.split(" ").map(Number)
for(let e=0;e<o;e++)yield[i+e,t]}function*I(t,e){let i={author:{mail:"",name:"",timestamp:0,tz:""},committer:{mail:"",name:"",timestamp:0,tz:""},hash:"EMPTY",summary:""},o=void 0
for(const[s,n,r]of function*(t){for(let e=0;e<t.length;e++){const i=t.indexOf("\n",e),o=i+1,s=t.indexOf("\n",o)
yield[...C(t.slice(e,i).toString("utf8")),t.slice(o,s).toString("utf8")],e=i}}(t))S(s,n)?(yield D(i,e),o&&(yield o),o=E(s,n),U(s,n,r)&&(i={author:{mail:"",name:"",timestamp:0,tz:""},committer:{mail:"",name:"",timestamp:0,tz:""},hash:"EMPTY",summary:""},z(s,n,i))):z(s,n,i)
yield D(i,e),o&&(yield o)}class N{async*blame(t){var e,s
if(this.process=(t=>{const e=["blame","--incremental","--",t]
a("ignoreWhitespace")&&e.splice(1,0,"-w")
const s=$()
return g.getInstance().command(`${s} ${e.join(" ")}`),i.spawn(s,e,{cwd:o.dirname(t)})})(t),!(null===(e=this.process)||void 0===e?void 0:e.stdout)||!(null===(s=this.process)||void 0===s?void 0:s.stderr))throw new Error("Unable to setup stdout and/or stderr for git")
const n=new Set
for await(const t of this.process.stdout)yield*I(t,n)
for await(const t of this.process.stderr)throw new Error(t)}dispose(){var t
null===(t=this.process)||void 0===t||t.kill()}}const L=(t,e,i)=>{for(const o of i)Array.isArray(o)?t[o[0]]=e.get(o[1]):e.set(o.hash,o)}
class k{constructor(t){this.terminated=!1,this.fileName=t,this.fsWatch=e.watch(t,()=>this.dispose())}onDispose(t){this.clean=t}async blame(){return this.info||(this.info=this.runBlame()),this.info}dispose(){var t
this.terminate(),null===(t=this.clean)||void 0===t||t.call(this),this.clean=void 0,this.fsWatch.close()}async runBlame(){const t=g.getInstance(),e={},i=new Map
this.blamer=new N
try{const t=this.blamer.blame(this.fileName)
for await(const o of t)L(e,i,o)}catch(e){t.error(e),this.terminate()}if(!this.terminated)return t.info(`Blamed file "${this.fileName}" and found ${i.size} commits`),e}terminate(){var t
null===(t=this.blamer)||void 0===t||t.dispose(),this.blamer=void 0,this.terminated=!0}}class P{constructor(){this.files=new Map}async file(t){return this.get(t)}async getLine(t,e){const i=e+1,o=await this.get(t)
return null==o?void 0:o[i]}async removeDocument(t){const e=await this.files.get(t)
this.files.delete(t),null==e||e.dispose()}dispose(){for(const[t]of this.files)this.removeDocument(t)}async get(t){return(await this.getFile(t)).blame()}getFile(i){const s=this.files.get(i)
if(s)return s
const n=(async({uri:i,fileName:s})=>{if(!t.workspace.getWorkspaceFolder(i))return new v(s)
try{await e.promises.access(s)}catch{return new v(s)}return await(async t=>{const e=await x($(),["rev-parse","--show-toplevel"],o.dirname(t))
return e?o.normalize(e):""})(s)?new k(s):new v(s)})(i)
return n.then(t=>t.onDispose(()=>{this.removeDocument(i)}),t=>g.getInstance().error(t)),this.files.set(i,n),n}}function O(t){return t.replace(/^[a-z-]+:\/\//i,"").replace(/:([a-z_.~+%-][a-z0-9_.~+%-]+)\/?/i,"/$1/").replace(/\.git$/i,"")}function _(t){const{hostname:e}=new s.URL(t)
return t=>""===t?e:e.split(".")[Number(t)]||"invalid-index"}async function q(e){if(!e||d(e))return
const i=a("inferCommitUrl"),r=a("commitUrl",""),c=a("remoteName","origin"),m=(async t=>{const e=b()
if(!n(e))return""
const i=$(),s=o.dirname(e.document.fileName),r=await x(i,["symbolic-ref","-q","--short","HEAD"],s),a=await x(i,["config","--local","--get",`branch.${r}.remote`],s)||t
return await x(i,["config","--local","--get",`remote.${a}.url`],s)})(c),u=await(async t=>{const e=b()
return n(e)?await x($(),["ls-remote","--get-url",t],o.dirname(e.document.fileName)):""})(c),l=await(async()=>{const t=b()
if(!n(t))return""
const{fileName:e}=t.document
return await x($(),["ls-files","--full-name",o.basename(e)],o.dirname(e))})(),f=(t=>{const e=/([a-zA-Z0-9_~%+.-]*?(\.git)?)$/.exec(t)
return e?e[1].replace(".git",""):""})(u),p=O(await m),g=h(r,{hash:()=>e.hash,"project.name":()=>f,"project.remote":()=>p,"gitorigin.hostname":_(u),"file.path":()=>l})
return(t=>{let e
try{e=new s.URL(t)}catch(t){return!1}return e.href===t&&("http:"===e.protocol||"https:"===e.protocol)&&!(!e.hostname||!e.pathname)})(g)?t.Uri.parse(g,!0):!g&&i&&u?((e,i)=>{const o=((t,e)=>{const i=(t=>{const e=/^(https?):/.exec(t)
if(null!==e)return e[1]})(t),o=O(t)
let n
try{n=new s.URL(`${i||"https"}://${o}`)}catch(t){return""}const r="commit"+((t=>{const e=a("isWebPathPlural"),i=a("pluralWebPathSubstrings",[])
return e||i.some(e=>t.includes(e))})(t)?"s":"")
return`${n.protocol}//${n.hostname}${i&&n.port?":"+n.port:""}${n.pathname}/${r}/${e}`})(e,i.hash)
if(o)return t.Uri.parse(o,!0)})(u,e):void(u&&w(`Malformed URL in gitblame.commitUrl. Currently expands to: '${g}'`))}class W{constructor(){this.blame=new P,this.view=new f,this.disposable=this.setupListeners(),this.updateView()}async blameLink(){const e=await this.getCommit(),i=await q(e)
i?t.commands.executeCommand("vscode.open",i):w("Missing gitblame.commitUrl config value.")}async showMessage(){const e=await this.getCommit()
if(!e||d(e))return void this.view.update()
const i=h(a("infoMessageFormat",""),l(e)),o=await q(e),s=[];(null==o?void 0:o.toString())&&s.push({title:"View",action(){t.commands.executeCommand("vscode.open",o)}}),this.view.update(e)
const n=await p(i,...s)
n&&n.action()}async copyHash(){const e=await this.getCommit(!0)
e&&!d(e)&&(await t.env.clipboard.writeText(e.hash),p("Copied hash to clipboard"))}async copyToolUrl(){const e=await this.getCommit(!0),i=await q(e)
i?(await t.env.clipboard.writeText(i.toString()),p("Copied tool URL to clipboard")):w("Missing gitblame.commitUrl config value.")}dispose(){this.view.dispose(),this.disposable.dispose(),this.blame.dispose()}setupListeners(){const e=t=>{const{scheme:e}=t.document.uri
"file"!==e&&"untitled"!==e||this.updateView(t)}
return t.Disposable.from(t.window.onDidChangeActiveTextEditor(t=>{"file"===(null==t?void 0:t.document.uri.scheme)?(this.view.activity(),this.blame.file(t.document),e(t)):this.view.update()}),t.window.onDidChangeTextEditorSelection(({textEditor:t})=>{e(t)}),t.workspace.onDidSaveTextDocument(()=>{this.updateView()}),t.workspace.onDidCloseTextDocument(t=>{this.blame.removeDocument(t)}))}async updateView(t=b()){if(!n(t))return void this.view.update()
this.view.activity()
const e=y(t),i=await this.blame.getLine(t.document,t.selection.active.line),o=y(t)
e!==o&&"no-file:-1"!==o||this.view.update(i)}async getCommit(t=!1){const e=()=>{w("The current editor can not be blamed.")},i=b()
if(!i)return void e()
t||this.view.activity()
const o=await this.blame.getLine(i.document,i.selection.active.line)
return o||e(),o}}const B=(e,i)=>t.commands.registerCommand(e,i)
exports.activate=e=>{if(t.workspace.workspaceFolders){const t=new W
e.subscriptions.push(t,g.getInstance(),B("gitblame.quickInfo",()=>{t.showMessage()}),B("gitblame.online",()=>{t.blameLink()}),B("gitblame.addCommitHashToClipboard",()=>{t.copyHash()}),B("gitblame.addToolUrlToClipboard",()=>{t.copyToolUrl()}))}},exports.deactivate=()=>{}
