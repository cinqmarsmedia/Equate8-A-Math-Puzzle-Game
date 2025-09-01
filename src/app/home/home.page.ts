import { AfterViewInit, ApplicationRef, ChangeDetectorRef, Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { NgZone } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { MenuController, Platform } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationOptimizerService } from '../services/animation-optimizer.service';

//import * as math from 'mathjs'
import { evaluate } from 'mathjs';

import { daily, challenges,tutorialDB,endlessMedals,tutDat} from "../../constants";
// this is a test

import * as _ from 'lodash';
//import * as Hammer from 'hammerjs';

let db:any={}
//const db:any={}
let gens:any={}

let genCopy:any={}
let genRez:any={}

const storagePrefix="equate8_"
const ezModeMoves=9

import { Howl, Howler } from 'howler';

const permanence=["userData","gamestate","genResults","genLvl"]

const debug=false

//const blitzSuppress=true // sept 15th

const genLock=20

const steam: "demo" | "full" | boolean = "demo"//"full" //'demo' 
const itch=false;
const version="1.5.0"

const tillEzTut=25
const dayOffset=0 // should be zero

const restoreDonation=false

const attas = [  "Way to go!",
  "Hooray!",
  "Great job!",
  "Congrats!",
  "You did it!",
  "Fantastic!",
  "Bravo!",
  "Keep it up!",
  "Awesome!",
  "Well done!",
  "Nice work!",
  "Terrific!",
  "Excellent!",
  "Outstanding!",
  "Superb!",
  "Nailed it!",
  "Yes!",
  "Amazing!",
  "High five!",
 ]

const tutorial=true;

const geist = new FontFace('Geist', 'url(assets/Geist-Regular.ttf)');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  //@ViewChild('numBtn', { read: ElementRef }) buttonRef: ElementRef;
  expression: any;
  testing:any=[0,1,2,3,4,5,6,7,8,9]
  //color:any={grid:100,num:100,moves:0}

  colors:any={
    "-1":"White",
    "0":"Blue",
    "30":"Purple",
    "90":"Pink",
    "130":"Red",
    "160":"Orange",
    "280":"Green",
    "320":"Teal"
  }

  anims:any=["None","Only Gradient","Equals+Squares","Lines","Shimmer","Infinity","Numbers"]
  currentDate:any=this.getCurrentDate()
  today:any=this.currentDate.toLocaleDateString('en-US')
  challenges:any=challenges
  medalThresh:any=[9,18]
  mthThresh:any=5
  debugMode:any=debug
  //ezShadowRef:any=null
  restoreDonation:any=restoreDonation
  /*
  lottieSizing:any={
    num:"17vmin",
    equal:"",
    unequal:"",
    ops:"",
    caret:"",
    mod:""
  }
  */
  blitzSuppress:any=Date.now() < new Date("2025-09-15T00:00:00").getTime()
  genLock:any=genLock
  sharePrompt:any=false
  debugIncr:any=0;
  shareImg:any
  fullscreenState:any=false
  suppress:any=false;
  ydisp:any={0:-2,1:-4,2:-1,3:-1,4:-7,5:-1,6:0,7:-3,8:-2,9:-2}
  xdisp:any={0:0,1:0,2:0,3:0,4:-4,5:0,6:0,7:0,8:0,9:0}
  userData:any={blitzRelease:"2025-09-15T00:00:00",lastDaily:null,blitzEZ:null,review:0,version:version,prevTut:-1,tutDat:{ezPrompt:false,skip:false,daily:false,mod:false,easy:false,lock:false},hideAnim:false,challUnlocks:0,newChall:[false,false],diff:null,month:[],medals:[0,0,0,0],cosmetics:{grid:[],num:[],op:[],bck:[],lock:[],anim:[],tot:0},color:{grid:'0',num:'320',lock:'160',op:'-1',bck:'30',anim:'Equals+Squares'},monthReward:false,gamestateArchive:{endless:[]},settings:{easyMode:false,shuffle:false,mute:false,haptic:true},tutorial:-1,donated:steam=='full',streak:0,endlessPlayed:{'easy':[],'medium':[],'hard':[],'mod':[]},genIndx:0,blitzScore:0,blitzBest:0,endlessIndx:{'easy':0,'medium':0,'hard':0,'mod':0}}
  gamestate:any={orig:null,dailyDone:false,dailyWon:false,medal:null,solution:null,numGrid:null,id:null,lvlWon:false,isLost:false,ezLost:false,ezAttempt:false,ops:null,opsGrid:null,mode:"daily",numMoves:0,dailySeen:this.currentDate,locked:[],focus:[]}
  streakType:any="Starting";
  tutViz:any=true;
  //gamestate.mode:any="daily";
  device:any=1;
  popovers:any={debug:false,load:false,donate:false,generate:false}
  gameData:any={}
  splash:any=true;
  //suppressEZ:any=false;
  oneLeft:any=false;
  string:any=String;
  update:any=false;
  medalCombos=[0,0,0,0]
  snapLockCount=3;
  blitzreleaseTemp:any=false

  //lvlState:any=-1;
  //gamestate.lvlWon:any=false;
  resizeTimeout:any=[0,false]
  sortable: any;
  menuState:any='closed';
  othersortable: any;
  layerErrors: any = [];
  layerEquals: any = [];
  state: any
  oldTotal:any=0;
  atta:any=attas[Math.floor((attas.length - 1) * Math.random())]
  blitzAtta:any=false

  //daily:any=true;
  //dailyDone:any=false;
  days:any
  menuHidden:any=false
  sortTimeStart: number;
  clickDurationThresholdMS: number = 300;
  swapPair = [];
    aspectRatio:any=window.innerWidth/window.innerHeight
  lineCount: any = 0;
  loadDiff:any="easy"
  loadNum:any
  shake: any = -1;
  hint: any = -1;
  hintOrder: any = [0, 1, 2, 3, 4, 5, 6, 7, 8]
  equalState: any;
  //solution: any
  //currentLevel: any = "0";
  currentSortStartIndex: number;
  shakeTimeout: any
  expressionLines: any = [false, false, false, false, false, false, false, false]
  difficulty: any = "medium"
  selected: any = [-1, true];
  showWrong: any = true
  numSortable: any
  opSortable: any
  level: any
  resizeTimer:any
  //numGrid: any
  //ops: any
  opSwitch: any
  animations:any={}
  history:any=[]
  endlessMedals:any=endlessMedals
  //string:any=String
 tutDB:any
 blitzMoves:any=Math.floor(this.userData.blitzScore/10)+1
  //opsGrid: any

android:any=(/Android/i).test(navigator.userAgent)
iOS:any=(/iPhone|iPad|iPod/i).test(navigator.userAgent) && !(/Chrome/i).test(navigator.userAgent);
mobile:any=this.android || this.iOS || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
steam:any=this.mobile?false:steam;
renderCanvas:any=this.android//this.android
numOrder: any
opsOrder: any
showGrid: boolean = true;
Math = Math;
genLvl:any={min:1,max:99,ops:[true,true,true,true,false,false],moves:4,unique:9,opKind:"only",avgKind:"min",avg:5}
genNums:any=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90]
genResults:any=[]

  constructor(public menuCtrl: MenuController,public alertController: AlertController, public storage: Storage, private changeDetectorRef: ChangeDetectorRef, public appRef: ApplicationRef, public platform: Platform, private animationOptimizer: AnimationOptimizerService, public loadingCtrl: LoadingController,public http: HttpClient) {
    //this.init();
    window["home"] = this;



//this.android=true

//console.error(this.shuffleNMoves([1,1,1,1,1,1,1,1,9],5))

//this.genLvls()
//this.popovers.generate=true

    this.http.get<any>('assets/json/db.json').subscribe(data => {
      db=data
      //console.log(data)
    });


if (this.android) {
  // Enable WebView optimizations
  if (window['AndroidWebView']) {
    window['AndroidWebView'].setLayerType(
      window['AndroidWebView'].LAYER_TYPE_HARDWARE, null
    );
  }
}

//console.log(daily,db)
//this.userData.tutorial=0

if (!this.mobile){
    addEventListener("resize", (event) => {
      //this.aspectRatio=window.innerWidth/window.innerHeight
      //this.innerOuter=window.innerHeight/window.outerHeight;
      //this.height=window.innerHeight

      //this.widthHeight=[window.innerWidth,window.innerHeight]
      if (this.userData.tutorial!==-1){

        this.tutViz=false
        clearTimeout(this.resizeTimer);
    this.changeDetectorRef.markForCheck()
  // Set a new timer that will execute after 500ms of no resize events
  this.resizeTimer = setTimeout(() => {
    // Put your code here - this will only run after resizing has stopped for 500ms
  this.tutViz=true;
    
    // Your actual resize-complete logic goes here
    // For example: updateLayout(), recalculatePositions(), etc.
  this.changeDetectorRef.markForCheck()
  }, 300);
       
      }



    });

}
    //this.genLvl()

    /*
    var output=[];
        for (let i=0;i<5;i++){//9999
          var rez=this.shuffle(this.problemGen());
        if (this.chk(rez[0],rez[1])){
           output.push(rez)
        }
        }
        console.log(output)
       */
  }


skipEndless(){
  alert('skip');
}

promptRating(){
let medals=this.userData.medals[0]+this.userData.medals[1]+this.userData.medals[2]+this.userData.medals[3]

if (medals%5==0 && medals>0){

this.userData.review++

if (this.userData.review>2){
this.userData.review=-1;
this.writeStorage();
}
if (!!window["cordova"]){
  if (window["LaunchReview"]){
    window["LaunchReview"].rating()
  }
}



}


}


confetti(){
  window["confetti"]({particleCount:70,spread:70,ticks:500})
}

menuBackBtn(){

  if (this.userData.tutorial==9 || this.userData.tutorial==10){return}

 this.haptic();


if (this.menuState=='main'){
  this.menuCtrl.close();
}else{
  this.menuState='main'
}
  


}

start(){
  this.playSFX('bubble.wav');
  this.splash=false;
  if (tutorial){
  this.initTutorial()
}else{
this.initNewDaily()
}
this.changeDetectorRef.markForCheck()
}



donate(){
this.incTut(33);

if (debug){
    this.betaDonate()
}else if(this.steam){
  this.steamDonate()
}else{
  this.iapDonate()
}

}


async betaDonate(){

const alert = document.createElement('ion-alert');
    alert.header = 'One Time Donation';
    alert.subHeader = 'The daily puzzle will always be free along with challenges unlocked from earned medals. To access unlimited levels and difficulties, consider making a one time donation to our non-profit. Beta testers are not charged';
    alert.buttons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
      },
    },
    {
      text: 'Continue Free',
      role: 'confirm',
      handler: () => {

this.userData.donated=true
this.userData.tutorial=-1




if (this.gamestate.mode=='blitz'){
this.restartEZ()

}else{

this.menuState='endless';
this.changeDetectorRef.markForCheck()

this.menuCtrl.open()
}

this.writeStorage();
      },
    }];

    document.body.appendChild(alert);
    await alert.present();
}


 async noInternet() {

this.haptic(0)
    const alert = document.createElement('ion-alert');
    alert.header = 'Please Connect to Internet';
    alert.subHeader = "You must have an internet connection to use this feature";
    alert.buttons = [
    {
      text: 'Ok',
      role: 'cancel',
      handler: () => {
       
      },
    }
    ];

    document.body.appendChild(alert);
    await alert.present();


  }

resetPuzzle(){
if (!this.userData.settings.easyMode){
  this.gamestate.numMoves=0; 
}

   this.revertOrig();
  this.gamestate.isLost=false;
  this.gamestate.lvlWon=false;

}

iapDonate(){
    if (window.navigator.onLine) {
                window["store"].get("eqdonate").getOffer().order()
            } else {
              this.noInternet();
            }
}

async steamDonate(){

const alert = document.createElement('ion-alert');
    alert.header = 'Get Full Version';
    alert.subHeader = 'To access unlimited levels and difficulties, consider making a donation to our non-profit by purchasing the full game. Any progress will transfer over.';
    alert.buttons = [
    {
      text: 'Later',
      role: 'cancel',
      handler: () => {
      },
    },
    {
      text: 'Check It Out',
      role: 'confirm',
      handler: () => {
let url="https://store.steampowered.com/app/3693730"
window["electron"].openLink(url);

      },
    }];

    document.body.appendChild(alert);
    await alert.present();
}

restorePurchase(){

  window["store"].update();
  window["store"].restorePurchases();


/*
          window["store"].initialize([window["CdvPurchase"].store.defaultPlatform()]).then(() => {
            window["store"].update();
            window["store"].restorePurchases();
          });
*/
}


debugMenu(){
  this.popovers.debug=true
}

/*
lottieOptions(path,autoplay,loop){

return {
  path:'assets/lottie/'+path,
  autoplay:autoplay,
  loop:loop
}


  renderer: 'svg', // Use SVG renderer for better iOS performance
    rendererSettings: {progressiveLoad: true,preserveAspectRatio: 'xMidYMid meet'}
 

}
*/

nxtGen(){
  this.userData.genIndx++
  this.initLevel(this.genResults[this.userData.genIndx])
}

loadLvls(){
this.genResults.map((a:any)=>{
  if (this.genLvl.moves>0){
a[0]=this.shuffleNMoves(a[2],this.genLvl.moves)
}else{
  a[0]=a[2]
}
  
})

this.popovers.generate=false
this.menuCtrl.close();

this.gamestate.mode="gen"
this.userData.genIndx=0
this.initLevel(this.genResults[0])


}

deterministicShuffleNMoves(ar:any,N:any,seed:any){
let indexes=[0,1,2,3,4,5,6,7,8]
let ans=_.cloneDeep(ar)
/// upto 4

if (N>4){
  return this.shuffleNMoves(ans,N)
}

// simple seedable PRNG (Mulberry32)
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

// shuffle with seed
function shuffle(array, seed) {
  let rand = mulberry32(seed);
  let result = array.slice(); // copy
  for (let i = result.length - 1; i > 0; i--) {
    let j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function swap(arr, a, b) {
  [arr[a], arr[b]] = [arr[b], arr[a]];
  return arr;
}

let order=shuffle(indexes,seed)


for (let i=0;i<N*2;i=i+2){
swap(ans,i,i+1)
}

return ans
}

shuffleNMoves(arr:any,N:any=2){


  function randomSwaps(A, N) {
  const arr = [...A]; // copy so original not modified
  for (let i = 0; i < N; i++) {
    const i1 = Math.floor(Math.random() * arr.length);
    const i2 = Math.floor(Math.random() * arr.length);
    [arr[i1], arr[i2]] = [arr[i2], arr[i1]];
  }
  return arr;
}



// Generate random permutations until we find one exactly N swaps away
  let result, attempts = 0;

if (N==1){
  result=randomSwaps(arr, 1)
}else{


  let broken=false
   // Helper to calculate minimum swaps needed between two permutations
  const minSwaps = (a, b) => {
    let visited = new Array(9).fill(false);
    let cycles = 0;
    
    // Create position mapping
    let pos = {};
    b.forEach((v, i) => {
      if (!pos[v]) pos[v] = [];
      pos[v].push(i);
    });
    
    // Find cycles
    for (let i = 0; i < 9; i++) {
      if (!visited[i]) {
        let j = i, len = 0;
        while (!visited[j]) {
          visited[j] = true;
          // Find where a[j] should go in b
          let next = pos[a[j]].shift();
          j = next;
          len++;
        }
        if (len > 1) cycles += len - 1;
      }
    }
    return cycles;
  };
  
  
  do {
    result = [...arr];
    // Fisher-Yates shuffle
    for (let i = 8; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    attempts++;
    // Prevent infinite loop for impossible cases
    if (attempts > 500000){ broken=true; break};
  } while (minSwaps(arr, result) !== N);



if (broken){
    result=randomSwaps(arr, N)
}

}


/*
const oneSwapAway = (a, b) => {
  const d = a.reduce((r, v, i) => (v !== b[i] && r.push(i), r), []);
  return a.length === b.length && d.length === 2 && a[d[0]] === b[d[1]] && a[d[1]] === b[d[0]];
};

if (N==1 && !oneSwapAway(result,arr)){
console.error("catastrophe")
console.error(broken,result,arr)
}
  */

function arraysEqual(a, b) {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}

if (arraysEqual(arr,result)){
  console.log('redo');
return this.shuffleNMoves(arr,N)
}

//console.log(arr,result)
  return result;
}

cancelGens(event:any){

//if (event && event.role!=='backdrop'){return}
this.genLvl=genCopy
this.genResults=genRez

this.popovers.generate=false
this.changeDetectorRef.markForCheck();
}

loadGens(){

if (this.userData.medals[endlessMedals.mod[0]]<this.genLock){
  this.insufficientMedals(1,this.genLock-this.userData.medals[endlessMedals.mod[0]])
  return
}

genCopy=_.cloneDeep(this.genLvl)
genRez=_.cloneDeep(this.genResults)
this.http.get<any>('assets/json/gens.json').subscribe(data => {
      gens=data

      this.genLvls();
      this.popovers.generate=true
    this.changeDetectorRef.markForCheck();

    });


}

genLvls(){

/*
let dailies=[]
Object.keys(daily).forEach((key:any)=>{
  dailies.push(daily[key])
})
*/



let sanGens=[]

for (let n=0;n<gens.length;n++){
  let op=gens[n][9]
  let arr=gens[n].slice(0,-1)
  //console.log(arr)
  sanGens.push([arr,op,arr])
}
//console.log(sanGens)

let combined=[...db.easy, ...db.medium,...db.hard,...db.mod,...sanGens]


//console.log(combined)
// deduplicate

let filtered = combined.filter((lvl:any)=>{


let max=Math.max(...lvl[0])
let min=Math.min(...lvl[0])
let unique=new Set(lvl[0]).size
let avg = lvl[0].reduce((a, b) => a + b, 0) / lvl[0].length;


let match = max<=this.genLvl.max && min>=this.genLvl.min

match=match && unique==this.genLvl.unique


if (this.genLvl.avgKind=="max"){
match=match && avg<=this.genLvl.avg
}else{
match=match && avg>=this.genLvl.avg
}



let opsMatch

if (this.genLvl.opKind=="any"){

opsMatch =
  (this.genLvl.ops[0] && lvl[1].includes("+")) ||
  (this.genLvl.ops[1] && lvl[1].includes("-")) ||
  (this.genLvl.ops[2] && lvl[1].includes("*")) ||
  (this.genLvl.ops[3] && lvl[1].includes("/")) ||
  (this.genLvl.ops[4] && lvl[1].includes("^")) ||
  (this.genLvl.ops[5] && lvl[1].includes("%"));

}else if (this.genLvl.opKind=="all"){

opsMatch = this.genLvl.ops[0] == lvl[1].includes("+") && this.genLvl.ops[1] == lvl[1].includes("-") && this.genLvl.ops[2] == lvl[1].includes("*") && this.genLvl.ops[3] == lvl[1].includes("/") && this.genLvl.ops[4] == lvl[1].includes("^") && this.genLvl.ops[5] == lvl[1].includes("%")

}else{

opsMatch = this.genLvl.ops[0] == lvl[1].includes("+") && this.genLvl.ops[1] == lvl[1].includes("-") && this.genLvl.ops[2] == lvl[1].includes("*") && this.genLvl.ops[3] == lvl[1].includes("/") && this.genLvl.ops[4] == lvl[1].includes("^") && this.genLvl.ops[5] == lvl[1].includes("%")
}




if (match && opsMatch){return lvl}

})


// Simple seeded random number generator
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function dailyShuffle(arr) {
  // Use YYYYMMDD as a seed
  let date = new Date();
  let seed = parseInt(
    date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    date.getDate().toString().padStart(2, "0")
  );

  let newArr = arr.slice(); // clone array
  for (let i = newArr.length - 1; i > 0; i--) {
    let j = Math.floor(seededRandom(seed + i) * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}
// randomize
this.genResults=dailyShuffle(filtered)

}


monthReward(){
//console.log('yo');
let opts=["grid","num","op","bck","lock"]
let nums=["-1","0","30","90","130","160","280","320"]

let num=nums.length
let tot=0

opts.forEach((e)=>{
tot+=this.userData.cosmetics[e].length
})
this.userData.cosmetics.tot=tot;
//console.log(this.userData.cosmetics);
//console.log(tot,num*opts.length);


if (!this.userData.cosmetics.anim.includes('Lines')){

this.userData.cosmetics.anim.push('Lines')
this.userData.color.anim='Lines'

this.writeStorage()
return
}

if (tot==4){
this.userData.cosmetics.op.push("90")
this.userData.color.op="90"
return;
}else if (tot==5){
this.userData.cosmetics.grid.push("30")
this.userData.color.grid="30"
return;
}



if (tot>12 && !this.userData.cosmetics.anim.includes('Shimmer')){

this.userData.cosmetics.anim.push('Shimmer')
this.userData.color.anim='Shimmer'

this.writeStorage()
return
}


if (tot>33 && !this.userData.cosmetics.anim.includes('Infinity')){

this.userData.cosmetics.anim.push('Infinity')
this.userData.color.anim='Infinity'

this.writeStorage()
return
}


//console.log(num*opts.length, tot)

if (tot==40){

if (!this.userData.cosmetics.anim.includes('Numbers')){
  this.userData.cosmetics.anim.push('Numbers')
this.userData.color.anim='Numbers'

this.writeStorage()

}else{
   console.error("all cosmetics unlocked!");
}


return
}





for (let x=0;x<9999;x++){

let c:any=Math.floor(Math.random()*5)
c=opts[c]

if (this.userData.cosmetics[c].length<num){

let miss=this.findMissingElements(this.userData.cosmetics[c],nums)

let toAdd=miss[Math.floor(Math.random()*miss.length)]

this.userData.cosmetics[c].push(toAdd)
this.userData.color[c]=toAdd

break

}


}


this.writeStorage()

}


async comingSoon(){
const alert = document.createElement('ion-alert');
    alert.header = 'Blitz Mode';
    alert.subHeader = 'Puzzles in rapid succession where you start 1 move away from victory, then 2, then 3. One wrong move and your run is over! Sign up for our newsletter to get notified upon release.';
    alert.buttons = [
    {
      text: 'Later',
      role: 'cancel',
      handler: () => {
      },
    },
    {
      text: 'Sign-Up',
      role: 'confirm',
      handler: () => {

        this.openLink('https://buttondown.com/cinqmarsmedia')
      
      },
    }];

    document.body.appendChild(alert);
    await alert.present();
}

genInfo(){
  console.error('info about generated lvls?');
}

blitzInfo(){
  this.userData.tutorial=42
  this.changeDetectorRef.markForCheck();
}

restoreSnapMode(){
  //this.saveStateArchive()
  this.currentDate=this.getCurrentDate()
  if (this.gamestate!=='blitz' && this.userData.blitzEZ !== null){
  this.userData.settings.easyMode=this.userData.blitzEZ
  this.userData.blitzEZ=null
}
}

loadGamestateArchive(type:any){
let obj

this.restoreSnapMode()

  if (type == "endless"){
    obj=this.userData.gamestateArchive.endless[1]
  }else{
    obj=this.userData.gamestateArchive[type]
  }

obj.dailyDone=this.gamestate.dailyDone
obj.dailySeen=this.gamestate.dailySeen
obj.dailyWon=this.gamestate.dailyWon
obj.blitzAttempt=this.gamestate.blitzAttempt


this.gamestate=_.cloneDeep(obj)
this.writeStorage()

}

blitz(reset:any=false,nav:any=false){
/*
if (!this.debugMode){
  this.comingSoon()
  return
}
*/

  if (this.userData.tutorial>-1 && this.userData.tutorial<15){
this.confirmSkipTut()
return
}

if (this.blitzSuppress && !this.debugMode){
this.comingSoon()
  return
}


this.gamestate.mode="blitz"

if (nav){
this.userData.blitzEZ=this.userData.settings.easyMode
}

this.userData.settings.easyMode=false


let diffDay=this.gamestate.blitzAttempt!==this.currentDate.toLocaleDateString('en-US')

if (diffDay){reset=true;this.userData.blitzScore=0}



if (!this.gamestate.blitzAttempt){

  this.userData.tutorial=38
  this.gamestate.focus=[]
  this.changeDetectorRef.markForCheck();

}


this.gamestate.blitzAttempt=this.currentDate.toLocaleDateString('en-US')

//console.error(this.gamestate.blitzAttempt)

this.blitzMoves=Math.floor(this.userData.blitzScore/10)+1

if (this.userData.gamestateArchive.blitz && !reset){
// load

this.loadGamestateArchive("blitz")

}else{

let n=this.blitzMoves

if (diffDay){
  this.gamestate.dailyBlitz=true
}
//console.error('testing');

let combined=[...db.easy, ...db.medium,...db.hard]

if (this.userData.blitzBest>13 && !this.gamestate.dailyBlitz){
  combined.push(...db.mod)
}


let lvl

if (this.gamestate.dailyBlitz){

const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24)); 
const s = this.userData.blitzScore

 let seed = Math.abs((day * 73856093) ^ (s * 19349663));

 const index = seed % combined.length;

 lvl=combined[index]
console.error(index,day,s)

lvl[0]=this.deterministicShuffleNMoves(lvl[2],n,seed)

}else{
 lvl = combined[Math.floor(Math.random() * combined.length)];
 lvl[0]=this.shuffleNMoves(lvl[2],n)
}




this.initLevel(lvl)
}
this.menuCtrl.close();


}



getLottieOptions(file: string, loop: boolean = false, autoplay: boolean = true): any {
  let path=`assets/lottie/${file}`
  console.log(path)
  return {
    path: path,
    autoplay: autoplay,
    loop: loop,
    renderer: this.android ? 'canvas' : 'svg',
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid meet',
      clearCanvas: this.android,
      progressiveLoad: true,
      quality:0.7,
      hideOnTransparent: this.android,
      viewBoxOnly: !this.android,
      className: 'lottie-animation'
    }
  };
}

findMissingElements(A:any, B:any) {
    return B.filter(element => !A.includes(element));
}

endless(){
  if (!this.userData.donated){
this.donate()
  }else{
//f (this.userData.tutorial>-1 && this.userData.tutorial<15){return}
if (this.userData.tutorial>-1 && this.userData.tutorial<15){
this.confirmSkipTut()
}else{
  this.menuState='endless';
}
  }

    this.haptic(0);
}

alert(str){
alert(str);
}




loadChallenge(chall){

if (this.userData.tutorial!==-1){

if (chall.i==1){this.incTut(10)}else{
return;
}


}




if (this.medalCombos[chall.medals[0]]<chall.medals[1]){
this.insufficientMedals(chall.medals[0],chall.medals[1]-this.medalCombos[chall.medals[0]])
  return
}



let title=[chall.title]
let txtTitle=chall.title
if (chall.i){
  title.push(chall.i)
  txtTitle+=chall.i
}
//console.error(txtTitle,this.userData.gamestateArchive)
if (this.userData.gamestateArchive[txtTitle]){


this.loadGamestateArchive(txtTitle)
this.userData.settings.easyMode=this.gamestate.ezAttempt

if (this.gamestate.lvlWon){
 this.revertOrig()
 this.gamestate.replay=true
}else{
  this.evalBoard()
}


}else{
this.gamestate.mode=title
this.initLevel(chall.lvl)
}

//this.userData.chall[txtTitle]=



//

//chall.lvl


this.menuCtrl.close();

}




// electron
toggleFullScreen(){
  this.fullscreenState=!this.fullscreenState
  window["electron"].fullscreen();
}
quitGame(){
  this.loading()
  window["electron"].quit();
}
minimize(){
  window["electron"].minimise();
}


  async loading() {
    const loading = await this.loadingCtrl.create({
      message: 'Equate8 is now shutting down....',
      duration: 3000,
    });

    loading.present();
  }


checkValidLvl(){

if (this.loadDiff!=='easy' && this.medalCombos[this.endlessMedals[this.loadDiff][0]]<endlessMedals[this.loadDiff][1]){return false}
  
  return db[this.loadDiff][this.loadNum-1]
}

loadEndless(diff:any=this.userData.diff,indx:any=-1){

this.gamestate.mode="endless"
if (diff=='random'){

this.userData.diff='random';

let pool=['easy']

if (this.medalCombos[this.endlessMedals['medium'][0]]>=endlessMedals['medium'][1]){
pool.push('medium')
}

if (this.medalCombos[this.endlessMedals['hard'][0]]>=endlessMedals['hard'][1]){
pool.push('hard')
}

if (this.medalCombos[this.endlessMedals['mod'][0]]>=endlessMedals['mod'][1] && (this.userData.tutDat.skip || this.userData.tutDat.mod)){
pool.push('mod')
}


let sel=pool[Math.floor(Math.random()*pool.length)]

let lvl=db[sel][Math.floor(Math.random()*db[sel].length)]
this.initLevel(lvl)
console.log(lvl)
this.menuCtrl.close();

}else{

if (diff!=='easy' && this.medalCombos[this.endlessMedals[diff][0]]<endlessMedals[diff][1]){

this.insufficientMedals(endlessMedals[diff][0],endlessMedals[diff][1]-this.medalCombos[this.endlessMedals[diff][0]])
//alert('you do not have enough medals')
return;
}
/*
if (diff=='mod'){
let nvm=this.userData.tutDat.mod //this.userData.tutDat.skip || 

if (!nvm){
  this.userData.tutorial=18
  this.userData.tutDat.mod=true
}



}
*/
console.log(this.userData.endlessPlayed[diff],this.userData.endlessIndx[diff],indx)
if (indx==-1){



if (this.userData.settings.shuffle){
let choices=[]

for (let n=0;n<db[diff].length;n++){
  choices.push(n);
}

let avail=choices.filter(lvl=>!this.userData.endlessPlayed[diff].includes(lvl))

indx=Math.floor(Math.random()*avail.length)

}else{

for (let z=0;z<db[diff].length;z++){
  if (!this.userData.endlessPlayed[diff].includes(z)){
indx=z
break
  }
}

}

}
console.log(indx);

if (indx==-1){
  console.error("OUT OF LEVELS,RESET");
  this.userData.endlessPlayed[diff]=[]

  this.loadEndless(diff)
  return;
}

this.userData.endlessIndx[diff]=indx


let lvl=db[diff][indx]

this.userData.diff=diff

let id=this.userData.diff+this.userData.endlessIndx[this.userData.diff]


if (this.userData.gamestateArchive.endless[0]==id){
console.error(this.userData.gamestateArchive)

this.loadGamestateArchive("endless")
//this.userData.gamestateArchive.endless[1]
this.userData.settings.easyMode=this.gamestate.ezAttempt
this.evalBoard()
}else{

 console.error(id)
this.initLevel(lvl)
}






this.menuCtrl.close();

}





}

getTitle(){
let title="Equate8_"

if (this.gamestate.mode=="daily"){
  title+=this.gamestate.dailySeen
}else if (this.gamestate.mode=="endless"){
title+=this.userData.endlessIndx[this.userData.diff]

}else if (this.gamestate.mode=='gen'){
title+="generatedPuzzle"
}else if (this.gamestate.mode=='blitz'){
title+="randomBlitz"
}else{
title+=this.gamestate.mode[0]+"_"+this.gamestate.mode[1]
}

return title
}

mobileShare(){
this.haptic()
if (!!window["cordova"]){
this.shareNative(this.shareImg);

}else if (this.mobile && this.steam==false){
if (navigator.share) {


         let name=this.getTitle()

      navigator.share({
        //title: "blah",
        url: 'https://cinqmarsmedia.com/equate8',
        files: [this.dataURLtoFile(this.shareImg,name+".jpg")]
      }).then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      console.log('Web Share API not available. Unable to share.');
    }

}else{
  console.error('uh-oh; not working');
}
}

async genShare() {

this.incTut(35)


this.createPuzzleCanvas({
    moves: this.gamestate.numMoves,
    numbers: this.gamestate.orig,
    ops:this.gamestate.ops
  }).then((canvas:any) => {
this.shareImg=canvas.toDataURL('image/jpg');
//document.body.removeChild(ele);

const img = new Image();
  img.onload = () => {
    this.sharePrompt = true;
    this.changeDetectorRef.markForCheck();
  };
  img.src = this.shareImg;



})




}

createPuzzleCanvas(options:any = {}) {
  // Extract options or use defaults

  const moves = options.moves
  const canvasWidth = 1200;
  const canvasHeight = 1530;
  const numbers = options.numbers
  const ops = options.ops
  const bgColor = 'rgb(58,48,78)';
  const gridImageSrc = 'assets/grid_blue.png';
  const bgImg = 'assets/sharebck.jpg';
  
  return new Promise((resolve, reject) => {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    
    // Fill background
    //ctx.fillStyle = bgColor;
    //ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    

      const backgroundImage = new Image();
    backgroundImage.crossOrigin = 'Anonymous';
    backgroundImage.onload = () => {
      // Draw background image to cover the entire canvas
      ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
geist.load().then(g => {
  //@ts-ignore
  document.fonts.add(g);



    // Draw the grid image
    const gridImage = new Image();
    gridImage.crossOrigin = 'Anonymous';
    gridImage.onload = () => {

      let vdisp=100
      // Draw grid image
      ctx.drawImage(gridImage, 0, vdisp, canvasWidth, gridImage.height * (canvasWidth / gridImage.width));




      for (let n=0;n<ops.length;n++){
        if (ops[n]=='/'){ops[n]='÷'}
        if (ops[n]=='*'){ops[n]='×'}
        if (ops[n]=='^'){ops[n]='∧'}
      }

    
      
      // Draw the number
      ctx.font = '200px Geist';
      ctx.fillStyle = 'rgb(3,160,176)';
      ctx.textAlign = 'center';

      const rows=[200,600,1000]
      const cols=[270+vdisp,660+vdisp,1060+vdisp]

      ctx.fillText(numbers[0], rows[0], cols[0]);
      ctx.fillText(numbers[1], rows[1], cols[0]);
      ctx.fillText(numbers[2], rows[2], cols[0]);
      ctx.fillText(numbers[3], rows[0], cols[1]);
      ctx.fillText(numbers[4], rows[1], cols[1]);
      ctx.fillText(numbers[5], rows[2], cols[1]);
      ctx.fillText(numbers[6], rows[0], cols[2]);
      ctx.fillText(numbers[7], rows[1], cols[2]);
      ctx.fillText(numbers[8], rows[2], cols[2]);

      ctx.font = '140px Geist';
      ctx.fillStyle = 'white';

      ctx.fillText(ops[0], 403, 242+vdisp);

      ctx.fillText(ops[1], 203, 445+vdisp);
      ctx.fillText(ops[2], 403, 445+vdisp);
      ctx.fillText(ops[3], 603, 445+vdisp);
      ctx.fillText(ops[4], 1000, 445+vdisp);

      ctx.fillText(ops[5], 403, 640+vdisp);

      ctx.fillText(ops[6], 403, 840+vdisp);

      ctx.fillText(ops[7], 403, 1040+vdisp);





      ctx.font = '140px Geist';
      ctx.fillStyle = 'rgb(172,66,53)';

      ctx.fillText("≠", 800, 244+vdisp);
      ctx.fillText("≠", 800, 644+vdisp);
      ctx.fillText("≠", 800, 1030+vdisp);

      ctx.save();
      ctx.translate(203, 844)
      ctx.rotate(91 * Math.PI / 180);
      ctx.fillText("≠", -40+vdisp,30);
      ctx.restore()
      ctx.save();
      ctx.translate(603, 844)
      ctx.rotate(91 * Math.PI / 180);
      ctx.fillText("≠", -40+vdisp,35);
      ctx.restore()
      ctx.save();
      ctx.translate(1003, 844)
      ctx.rotate(91 * Math.PI / 180);
      ctx.fillText("≠", -40+vdisp,45);

      ctx.restore()
      ctx.save();
      ctx.translate(800, 445)
      ctx.rotate(-45 * Math.PI / 180);
      ctx.fillText("≠", 30-vdisp/1.5,10+vdisp/1.5);

      ctx.restore()
      ctx.save();
      ctx.translate(800, 844)
      ctx.rotate(45 * Math.PI / 180);
      ctx.fillText("≠", -20+vdisp/1.5,10+vdisp/1.5);

      ctx.restore()

      //ctx.fillText("≠", 800, 644);
      //ctx.fillText("≠", 800, 1030);


      
      // Draw the instruction text
      ctx.font = 'bold 51px Geist';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'white';
      const instructionText = `Can you rearrange the numbers to balance all 8 equations? I did it in just ${moves} moves!`;
      this.wrapText(ctx, instructionText, canvasWidth/2, canvasHeight - 160, canvasWidth - 50, 60);
      
let lvl=""

if (this.gamestate.mode=="endless"){
  lvl=this.userData.diff+" #"+this.userData.endlessIndx[this.userData.diff]+1
}else if (this.gamestate.mode=="daily"){
lvl=`${new Date().getMonth() + 1}/${new Date().getDate()}`
}else{
lvl=this.gamestate.mode[0]

if (this.gamestate.mode[1]){
  lvl+=" #"+this.gamestate.mode[1]
}
}
      
          ctx.font = 'bold 53px Geist';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('Equate 8: A Math Puzzle | '+lvl, canvasWidth/2,  70);

      // Draw the game title
      ctx.font = '8000 47px Geist';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText('Download Free: cinqmarsmedia.org/equate8', canvasWidth/2, canvasHeight - 30);
      
      resolve(canvas);
    };
    

    
    gridImage.src = gridImageSrc;
    })
  }
  backgroundImage.src = bgImg;
  });
}

// Helper function to wrap text in canvas
wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  
  for(let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    }
    else {
      line = testLine;
    }
  }
  
  context.fillText(line, x, y);
}

dataURLtoFile(dataurl: string, filename: string) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[arr.length - 1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

async shareBtn(
    title: string = 'Check this out!', 
    text: string = "blah", 
    url: string = "https://cinqmarsmedia.com/equate8"
  ): Promise<boolean> {
      // Web Share API is available in modern browsers except desktop Firefox

        await navigator.share({
          title,
          text,
          url,
        });
        return true;
     } 

shareNative(str) {
    window["plugins"]["socialsharing"].share(null, "Equate 8",str);
  }





gotoEndless(){
  this.loadEndless(this.loadDiff,this.loadNum-1)
  this.popovers.load=false
}

goto(str:any){

//first number is mode
//second two number are sub index
//rest is index

let mode=str[0]  // 0 - daily 1 - chall - 2 - endless
let sub=str.substring(1, 3)
let indx=str.substring(3);

if (mode=='0'){ // daily
console.error('not done yet');
}else if (mode=='1'){ //chall
console.error('not done yet');
}else if(mode=='2'){ // endless

let mde = sub=='0'?'easy':(sub=='1'?'medium':(sub=='2'?'hard':'mod'))
this.loadEndless(mde,parseInt(indx))

}

}

async thankyou(){
  const alert = document.createElement('ion-alert');
    alert.header = "Thank you!";
    alert.subHeader = "Your support of our educational non-profit is deeply appreciated. Enjoy the full experience!";
    alert.buttons = [
    {
      text: 'Ok',
      role: 'confirm',
      handler: () => {
    
      },
    }];

    document.body.appendChild(alert);
    await alert.present();
}

async insufficientMedals(type:any,deficit){

let medal=type==2?'Bronze':(type==1?'Gold':(type==0?'Silver':'Streak'))

let txt=deficit + " " + medal.toLowerCase() + " medal"+(deficit==1?'':'s')

if (medal!=='Gold'){
  txt+=" (or better)"
}

txt+=" are still required to unlock."

if (medal=='Streak'){
  txt="Improve best streak by "+deficit+" day"+(deficit==1?'':'s')+" to unlock"
}

  const alert = document.createElement('ion-alert');
    alert.header = "Locked Content";
    alert.subHeader = txt;
    alert.buttons = [
    {
      text: 'Ok',
      role: 'confirm',
      handler: () => {
    
      },
    }];

    document.body.appendChild(alert);
    await alert.present();
}

async confirmSkipTut(){

const alert = document.createElement('ion-alert');
    alert.header = 'Skip Tutorial?';
    alert.subHeader = 'The tutorial is brief and concise. Are you sure you wish to skip it?';
    alert.buttons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
      },
    },
    {
      text: 'YES',
      role: 'confirm',
      handler: () => {
          this.skipTut()
      },
    }];

    document.body.appendChild(alert);
    await alert.present();

}

  async resetStorage(wipe:any=false){


this.haptic(1);

     const alert = document.createElement('ion-alert');
    alert.header = 'Reset Progress?';
    alert.subHeader = 'Are you sure you wish to delete all progress and earned badges? A donation will persist. This cannot be undone.'+(window["cordova"]?" The app will quit and need to be relaunched.":"");
    alert.buttons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
      },
    },
    {
      text: 'YES',
      role: 'confirm',
      handler: () => {

this.haptic(1);

let didDonate=this.userData.donated

this.storage.clear().then(()=>{
  if (didDonate && !wipe){
    this.storage.set(storagePrefix+"userData",true).then(()=>{
      this.refreshApp()
    })
  }else{
    this.refreshApp()
  }


});
      },
    }];

    document.body.appendChild(alert);
    await alert.present();


  }




refreshApp(){



    if (this.android){
      window.location.href = window.location.origin;



    }else{

    var url=window.location.href
    url=url.replace('/home','/index.html');

window.location.href=url;
}
/*
setTimeout(()=>{
  this.appRef.tick();
        this.changeDetectorRef.markForCheck();
        this.changeDetectorRef.detectChanges();
},1000)
*/

if (window["cordova"] && window["cordova"]["plugins"] && window.window["cordova"]["plugins"]["exit"]) {
  window.window["cordova"]["plugins"].exit();
} else {

  navigator['app'].exitApp();
}
}


  rndShuffle() {

    //this.gamestate.numGrid.sort(() => { return Math.random() - 0.5 })

    this.evalBoard(true)
    //this.gamestate.numMoves=0;
    // op shuffle?

  }




randomize(){

  if (this.userData.cosmetics.tot<=6){return}


this.userData.color.num=this.getRand(this.userData.cosmetics.num)

this.userData.color.grid=this.getRand(this.userData.cosmetics.grid)

this.userData.color.op=this.getRand(this.userData.cosmetics.op)
this.userData.color.bck=this.getRand(this.userData.cosmetics.bck)

this.userData.color.lock=this.getRand(this.userData.cosmetics.lock)

//this.menuCtrl.close();

}


getRand(arr){
return arr[Math.floor(Math.random()*arr.length)]
}


animationCreated(anim:any,id:any){
  if (id){
    this.animations[id]=anim;
    // Register animation with optimizer service for better performance
    this.animationOptimizer.registerAnimation(id, anim);
  }
}

themeBtn(){
  this.menuState='cosmetics';
  console.log(this.userData.cosmetics.tot);
  this.haptic(0);
}


async haptic(lvl:any=0){
  //console.trace()
//console.error(window["cordova"])
//console.error(window["TapticEngine"]);
  if (this.userData.settings.haptic){
if(!!window["cordova"]){

if (lvl>1){
window["TapticEngine"].notification({
  type: lvl==2?"success":"error" // this heavy and other one medium?
});
lvl=2
}else{
window["TapticEngine"].impact({
  style:(lvl==0?"light":"heavy") // light, medium, heavy
})
}



if (lvl==0){
  lvl=window["plugins"]["deviceFeedback"].KEYBOARD_TAP
}else if (lvl==1){
  lvl=window["plugins"]["deviceFeedback"].LONG_PRESS
}else{
  lvl=window["plugins"]["deviceFeedback"].VIRTUAL_KEY
}

window["plugins"]["deviceFeedback"].haptic(lvl);

}
}
}


  chk(shuff, ans) {

    console.log(shuff, ans);
    return true
    //@ts-ignore
    //return eval(shuff.split('=')[0])!==eval(shuff.split('=')[1]) && eval(ans.split('=')[0])==eval(ans.split('=')[1]);


  }


  createCalendar() {
    const now = this.getCurrentDate();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    // Add empty days at start
    this.days = Array(firstDay).fill({ empty: true });
    
    // Add actual days
    for (let i = 1; i <= totalDays; i++) {
      // For demo purposes, randomly assign medals
      // Replace this with your actual game data
      /*
      const random = Math.random();
      let medal = null;
      if (random < 0.2) {
        medal = random < 0.1 ? 'gold' : random < 0.15 ? 'silver' : 'bronze';
      }
      */

     let medal= this.userData.month.find((d)=>{

          return d.day==i
        })

     if (medal){
       medal=medal.medal
     }
      
      this.days.push({
        date: i,
        medal: medal,
        today:this.currentDate.getDate()==i
      });
    }


    
    // Add empty days at end
    const lastDay = new Date(year, month, totalDays).getDay();
    const remainingDays = Array(6 - lastDay).fill({ empty: true });
    this.days.push(...remainingDays);
  }




  newHint(){


    if (this.gamestate.lvlWon || this.gamestate.dailyDone){return}
this.playSFX('newLvl')

this.gamestate.locked=[]

for (let n=0;n<9;n++){

if (this.gamestate.numGrid[n][0]==this.gamestate.solution[n]){
  this.gamestate.locked.push(this.reverseGridIndex(n))
}

}
this.popovers.debug=false

this.menuCtrl.close()


  }

  setSolution(){
   //console.log(this.gamestate.solution)
    //console.log(this.gamestate.numGrid);
    
     this.gamestate.solution.forEach((e:any,i:any)=>{
       this.gamestate.numGrid[i][0]=e
     })
     this.evalBoard()
     this.popovers.debug=false
     this.menuCtrl.close()
  }

  getHint(hideMenu:any=false) {
//this.animations['hint'].stop()
//this.animations['hint'].play()
//console.log(this.levelWon,this.gamestate.dailyDone)
if (this.gamestate.lvlWon || this.gamestate.dailyDone){return}
this.playSFX('newLvl')


    console.log(this.gamestate.solution)
    console.log(this.gamestate.numGrid);


let grid=[]
this.gamestate.numGrid.forEach((n)=>{
grid.push(n[0])
})

console.log(grid,this.gamestate.solution)
let rez=this.findSwapIndices(grid,this.gamestate.solution)

let a=rez[0]
let b=rez[1]

    for (let n = 0; n < 9; n++) {

      let i = this.hintOrder[n]

      if (this.gamestate.solution[i][0] !== this.gamestate.numGrid[i][0] && a == -1) {
        a = i
      } else if (a > -1) {
        //console.log(this.gamestate.numGrid[i],this.solution[a],i)
        if (this.gamestate.numGrid[i][0] == this.gamestate.solution[a][0]) {
          b = i
          break
        }

      }

    }

  if (a==-1 || b==-1){console.error('not found');return}


//this.history.push([...this.gamestate.numGrid])
 //let temp=[...this.gamestate.numGrid[a]]

  this.swapNumByIndexes(a,b)
      //this.gamestate.numGrid[a][0]=this.gamestate.solution[a]
     // this.gamestate.numGrid[b][0]=this.gamestate.solution[b]
      //this.gamestate.numGrid[b]=[...temp];

    //this.hint = [a, b];

if (this.gamestate.solution[a]==this.gamestate.numGrid[a]){
  this.hint=a
}else if (this.gamestate.solution[b]==this.gamestate.numGrid[b]){
  this.hint=b
}else{
  console.error('CATASTROPHE calling again');
  this.getHint(hideMenu)
  return;
}

  this.hint = (this.hint % 3) * 2 + this.hint * 2;
//console.log(this.hint);

    this.gamestate.numMoves++

    if (this.userData.settings.easyMode){
  this.gamestate.ezAttempt=true 
}
    //console.log(this.hint);
//console.log(this.gamestate.numGrid);

    if (hideMenu){
      this.menuCtrl.close()
    }
     this.playSFX('swap')
     this.haptic()

    this.evalBoard()

  }

  confirmDonate(){
//setTimeout(()=>{},0)
if (this.userData.donated==false){

this.userData.donated=true


if (this.gamestate.mode=='blitz'){
this.restartEZ()

}else{
this.menuState='endless';
this.changeDetectorRef.markForCheck()
}





//this.loadingPop.dismiss();
this.writeStorage()
 this.playSFX('confirm.mp3');
 this.haptic(2);
 this.confetti()
}else{
  console.warn("purchase restored")
}

}




  indexTransform(i:any){
    return (i % 3) * 2 + i * 2;
  }

  skipTut(){
this.userData.tutorial=-1
this.userData.tutDat.skip=true
this.menuHidden=false;
this.initNewDaily()
  }

findSwapIndices(A:any, B:any) {
    // Validate input arrays
    if (A.length !== B.length) {
        return null; // Arrays must be same length
    }
    
    // If arrays are identical, no swap needed
    if (JSON.stringify(A) === JSON.stringify(B)) {
        return null;
    }
    
    // Find first mismatch
    let x = -1;
    for (let i = 0; i < A.length; i++) {
        if (A[i] !== B[i]) {
            x = i;
            break;
        }
    }
    
    // Find where A[x] should go (position in B)
    let y = -1;
    for (let i = 0; i < B.length; i++) {
        if (B[i] === A[x]) {
            y = i;
            break;
        }
    }
    
    // Verify this swap would be valid
    const tempA = [...A];
    [tempA[x], tempA[y]] = [tempA[y], tempA[x]];
    
    // Count how many positions are correct after swap
    let correctPositions = 0;
    for (let i = 0; i < tempA.length; i++) {
        if (tempA[i] === B[i]) {
            correctPositions++;
        }
    }
    
    // Return indices if swap improves the situation
    if (correctPositions > 0) {
        return [x, y];
    }
    
    return null;
}

undo(){

this.gamestate.numGrid=[...this.history[this.history.length-1]]

this.history.pop()
}


  clck(i, num) {
    if (!num) { return }
    this.hint = [-1, -1];
    if (this.selected[0] == -1) {
      this.selected = [i, num]
    } else {

      if (this.selected[0] !== i && this.selected[1] == num) {
        //console.log(this.gamestate.numGrid);
        let temp = this.gamestate.numGrid[i]
        this.gamestate.numGrid[i] = this.gamestate.numGrid[this.selected[0]]
        this.gamestate.numGrid[this.selected[0]] = temp

        // SWAP i and this.selected[0] for num
        this.gamestate.numMoves++

        if (this.userData.settings.easyMode){
  this.gamestate.ezAttempt=true 
}


        this.evalBoard()
        
      }
      this.selected = [-1, false]
    }


  }


// Add this property to track last stored values
private _lastStoredValues: { [key: string]: string } = {};

// Optimized storage method with proper typing and efficient change detection
writeStorage = _.throttle(function() {

  //console.log(this.userData.tutorial)
  if (this.userData.tutorial > -1 && this.userData.tutorial < 7) return;
  
  const dataToStore: { [key: string]: any } = {};
  
  for (let i = 0; i < permanence.length; i++) {
    // Only store what's changed
    const key = permanence[i];
    const value = this[key];
    
    // Stringify the current value to compare with previous stored value
    const stringifiedValue = JSON.stringify(value);
    
    if (this._lastStoredValues[key] !== stringifiedValue) {
      dataToStore[key] = value;
      this._lastStoredValues[key] = stringifiedValue;
    }
  }
  
  // Only make storage calls if we have data to store
  if (Object.keys(dataToStore).length > 0) {
    Object.entries(dataToStore).forEach(async ([key, value]) => {
      await this.storage.set(storagePrefix + key, _.cloneDeep(value));
    });
  }
}.bind(this), 1000);


reloadDaily(){
let daily=this.userData.gamestateArchive["daily"]

if (daily){

this.loadGamestateArchive("daily")
this.userData.settings.easyMode=this.gamestate.ezAttempt
this.checkNewDaily()
}else{
this.initNewDaily()
}

this.menuCtrl.close();
}

incTut(ifNum:any=[],skip:any=false,btn:any=false,bckDismiss:any=false){
//console.log(ifNum)

if (this.userData.tutorial==-1){return}



if (btn){
this.playSFX('bubble.wav');
}

if (typeof ifNum =='number'){ifNum=[ifNum]}

  var temp=this.userData.tutorial
//console.log(ifNum)
if (!skip){
if (ifNum.length!==0 && !ifNum.includes(this.userData.tutorial)){
  return;
}
}else{
if (ifNum.length==1 && this.userData.tutorial<=ifNum[0]){
temp=ifNum[0]
//console.error(temp);
}else{return}

}



if (temp+1==15 || temp+1==17 || temp+1==19 || temp+1==29 || temp+1==34 || temp+1==39 || temp+1==41 || temp+1==43){
this.userData.tutorial=-1
this.writeStorage()
  return;
}


if (temp+1==21 || temp+1==23){
  this.userData.tutorial=this.userData.prevTut
  this.gamestate.focus=[]
  this.writeStorage()
  return;
}


if (this.gameData.tutorialDB[temp][6] || skip || bckDismiss){
this.tutViz=false
this.changeDetectorRef.markForCheck()
setTimeout(()=>{
  this.tutViz=true
    this.userData.tutorial=temp+1
    this.changeDetectorRef.markForCheck();
},0)
}else{
   this.userData.tutorial=temp+1
}


setTimeout(()=>{
  if (tutorialDB[this.userData.tutorial][7] && typeof tutorialDB[this.userData.tutorial][7] !=="string"){
  this.gamestate.focus=tutorialDB[this.userData.tutorial][7]
}else{this.gamestate.focus=[]}
  this.changeDetectorRef.markForCheck()
},0)

this.writeStorage()
//console.log(this.gamestate.focus);

//console.log(this.userData.tutorial,this.tutViz)
}

dc(){

if (this.iOS){
this.openLink('https://apps.apple.com/us/app/the-devils-calculator/id1447599858');
}else if (this.android){
this.openLink('https://play.google.com/store/apps/details?id=com.cinqmarsmedia.devilscalc');
}else{
this.openLink('https://store.steampowered.com/app/1014280/The_Devils_Calculator/');
}


}

donateLink(){

this.openLink('https://www.paypal.com/donate/?hosted_button_id=YPHN7ZB52YAHW');
}

  genOps() {

/*
    return [

      "",
      this.opSwitch[0] ? this.gamestate.ops[0] : "=",
      "",
      this.opSwitch[0] ? "=" : this.gamestate.ops[0],
      "",

      this.opSwitch[3] ? this.gamestate.ops[1] : "=",
      this.opSwitch[6] ? this.gamestate.ops[2] : "=",
      this.opSwitch[4] ? this.gamestate.ops[3] : "=",
      this.opSwitch[7] ? "=" : this.gamestate.ops[6],
      this.opSwitch[5] ? this.gamestate.ops[4] : "=",

      "",
      this.opSwitch[1] ? this.gamestate.ops[5] : "=",
      "",
      this.opSwitch[1] ? "=" : this.gamestate.ops[5],
      "",

      this.opSwitch[3] ? "=" : this.gamestate.ops[1],
      this.opSwitch[7] ? this.gamestate.ops[6] : "=",
      this.opSwitch[4] ? "=" : this.gamestate.ops[3],
      this.opSwitch[6] ? "=" : this.gamestate.ops[2],
      this.opSwitch[5] ? "=" : this.gamestate.ops[4],

      "",
      this.opSwitch[2] ? this.gamestate.ops[7] : "=",
      "",
      this.opSwitch[2] ? "=" : this.gamestate.ops[7],
      ""

    ]
    */




    return [
"",
this.gamestate.ops[0],
"",
"=",
"",
this.gamestate.ops[1],
this.gamestate.ops[2],
this.gamestate.ops[3],
"=",
this.gamestate.ops[4],
"",
this.gamestate.ops[5],
"",
"=",
"",
"=",
this.gamestate.ops[6],
"=",
"=",
"=",
"",
this.gamestate.ops[7],
"",
"=",
""
      ]
    //this.gamestate.opsGrid=["","+","","=","","-","+","*","=","/","","-","","=","","=","+","=","=","=","","/","","=",""]
    //console.log(this.gamestate.opsGrid)
    //  
  }


  skipTutorial(){}


 navigateMenu(state:any) {
    if (this.userData.tutorial !== -1 && state !== 'main') return;
    
    // Add a small delay to prevent UI freezing
    setTimeout(() => {
      this.menuState = state;
      this.changeDetectorRef.markForCheck()
      this.haptic(0);
    }, 10);
  }

  share(){
    if (this.userData.tutorial<13){return}
    alert('share?')
  }

  medalDebug(n:any=3){

    this.userData.medals[0]=this.userData.medals[0]+n
    this.userData.medals[1]=this.userData.medals[1]+n
    this.userData.medals[2]=this.userData.medals[2]+n

this.medalCalc()
  }

medalCalc(){
  this.medalCombos[2]=this.userData.medals[2]+this.userData.medals[1]+this.userData.medals[0]

  this.medalCombos[1]=this.userData.medals[2]

  this.medalCombos[0]=this.userData.medals[1]+this.userData.medals[2]
  this.medalCombos[3]=this.userData.medals[3]

  //------------------------------------------
let challUnlocks=0


challenges.forEach((chall:any)=>{

if (this.medalCombos[chall.medals[0]]>=chall.medals[1]){
challUnlocks++
}


})


let newChalls=this.userData.challUnlocks<challUnlocks


if (newChalls){
this.userData.challUnlocks=challUnlocks
this.userData.newChall=[true,true]
this.writeStorage()
}

}

challBtn(){


if (this.userData.tutorial==13){
  this.confirmSkipTut()
  return;
}

  this.userData.newChall=[false,false];
  
  setTimeout(()=>{
    this.incTut(9);
    this.changeDetectorRef.markForCheck()
  },5)

  this.menuState='challenges';
  this.haptic(0);
}

  menuBtn(){
    if (this.userData.tutorial<8 && this.userData.tutorial>0){return}
      
      this.incTut(30)
      setTimeout(()=>{
     this.incTut(8) 
     this.changeDetectorRef.markForCheck()
      },200)
     
    this.userData.newChall[0]=false
    this.menuState='main'
     if (this.clickSwapInProgress){
    this.onNumClick(this.reverseGridIndex(this.clickSwapStartIndex))
  }



 
    //this.ezShadowRef=this.userData.settings.easyMode
      this.changeDetectorRef.markForCheck()

 requestAnimationFrame(() => {
    this.menuCtrl.open('menu');
  });
         //this.menuCtrl.open('menu');



    
  }

  playSFX(name) {

 let volMult=0.8

    if (this.userData.settings.mute) { return }
    var vol = 1

    if (name == 'hover') {
      vol = 0.2
    }
    var sound = new Howl({
      src: ['assets/sfx/' + name + (name.includes('.wav')?'':'.mp3')],
      volume: vol*volMult
    });

    sound.play();
  }



  onHov(i) {

    /*
      if (this.isIndexDraggable(i) && !this.isAlone(i)) {
    this.playSFX('hover')
    }else{
    //this.shakeIndex(i)
    }
    */

  }

  isTutCellDisabled(i:any){
    //console.error(i,this.userData.tutorial);
//this.gamestate.numGrid[getGridIndex(i)][0]
if (this.userData.tutorial>0 && this.userData.tutorial<4 && i!==4 && i!==0){
      return true
    } 
if (this.userData.tutorial==3 && i!==10 && i!==12){
      return true
    } 

    if (this.userData.tutorial==22 && i!==4){return true}
    if (this.userData.tutorial==24 && i!==14){return true}


      return false
  

  }

  equalConv(i:any){

let rez

if (i==3){
  rez=0
}else if (i==8){ 
 rez=7
}else if (i==13){
 rez=1
}else if (i==15){
 rez=3
}else if (i==17){
 rez=4
}else if (i==18){
 rez=6
}else if (i==19){
 rez=5
}else if (i==23){
 rez=2
}

return rez


  }




  evalBoard(init:any=false) {
    //console.log(this.gamestate.opsGrid);
    // ONLY WORKS FOR REGULAR OPSWITCH (all true)
    //console.log(String(this.gamestate.numGrid[0])+(this.gamestate.ops[0]=="^"?"**":this.gamestate.ops[0])+String(this.gamestate.numGrid[1]),eval(String(this.gamestate.numGrid[0])+(this.gamestate.ops[0]=="^"?"**":this.gamestate.ops[0])+String(this.gamestate.numGrid[1])),this.gamestate.numGrid[2])

/*

   if (ops[n]=='/'){ops[n]='÷'}
        if (ops[n]=='*'){ops[n]='×'}
        if (ops[n]=='^'){ops[n]='∧'}

        */
    // Helper function for safe math operations
    const calculate = (a, op, b) => {
      a = Number(a);
      b = Number(b);
      switch(op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '×': return a * b;
        case '/': return a / b;
        case '÷': return a / b;
        case '%': return a % b;
        case '^': return Math.pow(a, b);
        case '∧': return Math.pow(a, b);
        default: return 0;
      }
    };

    let rez = [
      calculate(this.gamestate.numGrid[0][0], this.gamestate.ops[0], this.gamestate.numGrid[1][0]),
      calculate(this.gamestate.numGrid[3][0], this.gamestate.ops[5], this.gamestate.numGrid[4][0]),

      calculate(this.gamestate.numGrid[6][0], this.gamestate.ops[7], this.gamestate.numGrid[7][0]),

      calculate(this.gamestate.numGrid[0][0], this.gamestate.ops[1], this.gamestate.numGrid[3][0]),
      calculate(this.gamestate.numGrid[1][0], this.gamestate.ops[3], this.gamestate.numGrid[4][0]),
      calculate(this.gamestate.numGrid[2][0], this.gamestate.ops[4], this.gamestate.numGrid[5][0]),

      calculate(this.gamestate.numGrid[0][0], this.gamestate.ops[2], this.gamestate.numGrid[4][0]),
      calculate(this.gamestate.numGrid[6][0], this.gamestate.ops[6], this.gamestate.numGrid[4][0])
    ]
//console.log(this.gamestate.numGrid[3][0], this.gamestate.ops[5], this.gamestate.numGrid[4][0])
//console.log(rez)

    let lines = [
      rez[0] == this.gamestate.numGrid[2][0],
      rez[1] == this.gamestate.numGrid[5][0],
      rez[2] == this.gamestate.numGrid[8][0],

      rez[3] == this.gamestate.numGrid[6][0],
      rez[4] == this.gamestate.numGrid[7][0],
      rez[5] == this.gamestate.numGrid[8][0],

      rez[6] == this.gamestate.numGrid[8][0],
      rez[7] == this.gamestate.numGrid[2][0]
    ]


    this.expressionLines = lines

    let total = 0;

    lines.forEach((y) => {
      if (y) { total++ }
    })


    this.lineCount = total

   // this.opBugCheck()


    //console.log(this.lineCount)
    this.update=false;
setTimeout(()=>{
    this.update=true;
    this.changeDetectorRef.markForCheck();
  },50)
/*
if (total>3 && rnd){
  this.rndShuffle()
  return;
}
*/




/*
if (!init){
this.saveStateArchive()
this.writeStorage()
}
*/
    if (total == 8 && !this.gamestate.lvlWon) {
      this.levelWon();
      return;
    }else if (this.userData.settings.easyMode && this.gamestate.numMoves==ezModeMoves){
console.error('lost!! increment ez mode here?');
this.gamestate.ezLost=true;
this.gamestate.isLost=true;
    }else if (this.gamestate.mode=='blitz' && this.gamestate.numMoves>0 && this.gamestate.numMoves>=this.blitzMoves){
      //console.error("blitz loss")

this.gamestate.isLost=true;

//this.revertOrig()
 
this.gamestate.numGrid=[]
this.gamestate.orig.forEach((a,n)=>{

this.gamestate.numGrid.push([a,n])

})
//console.log(this.gamestate.numGrid)
//this.evalBoard(true)
if (this.gamestate.lines){
  this.expressionLines=this.gamestate.lines
}


    }else if (total>this.oldTotal){
this.oldTotal=total;
      this.playSFX('equal');
    }

if (this.gamestate.numMoves>=tillEzTut && total<5 && !this.userData.tutDat.ezPrompt && !this.userData.tutDat.easy && this.userData.tutorial!==7 && this.userData.tutorial!==13){
this.userData.prevTut=this.userData.tutorial;
this.userData.tutorial=30;
this.userData.tutDat.ezPrompt=true;

}

//console.log(this.gamestate.numGrid)
if (this.userData.tutorial==13 && !this.userData.tutDat.lock && !this.gamestate.lvlWon){
//console.log(this.gamestate.numGrid)
if (this.gamestate.numGrid[2][0]==6){
  setTimeout(()=>{
    this.userData.tutorial=22;
    this.changeDetectorRef.markForCheck()
  },100)

}else if (this.gamestate.numGrid[5][0]==3){
  setTimeout(()=>{
    this.userData.tutorial=24;
    this.changeDetectorRef.markForCheck()
  },100)
}

}

if (!init){
this.saveStateArchive()
this.writeStorage()
}



  }

  processExpression(expression, lockedTokens: any = false) { }


  async ngOnInit() {

this.platform.ready().then(() => {



 this.platform.resume.subscribe(() => {
this.currentDate=this.getCurrentDate()
this.today=this.currentDate.toLocaleDateString('en-US')
this.checkNewDaily()
})

 this.platform.pause.subscribe(() => {
this.saveStateArchive()
this.writeStorage()
});


 if(!!window["cordova"]){

if (this.android){
  window["StatusBar"].overlaysWebView(false);

    // Hide the status bar completely
    window["StatusBar"].hide();
    
    // Alternative: If you want to keep status bar but not overlay
    // window["StatusBar"].overlaysWebView(false);
    // window["StatusBar"].backgroundColorByHexString("#000000");
    
    // Remove the CSS approach for Android - it's not needed when status bar is hidden
    // If you still need margin adjustments, use a simpler approach:
    const style = document.createElement('style');
    style.textContent = `
        body {
            margin-top: 0 !important;
            padding-top: 0 !important;
        }
    `;
    document.head.appendChild(style);
        
}

if (!this.userData.donated){
const store = window["CdvPurchase"].store;
        window["store"] = store;
        store.verbosity = 4;
        const platform = window["CdvPurchase"].Platform;
        window["platform"] = platform;



window["store"].register({
          id: "eqdonate",
          type: window["store"].CONSUMABLE,
          platform: store.defaultPlatform()
});

const init = () => {
          window["store"].initialize([store.defaultPlatform()]).then(() => {
            window["store"].update();
            window["store"].restorePurchases();
          });
        };

        init();
        init();


         const onApproval = (transaction) => {

console.log(transaction)

if (transaction.isConsumed){return}

this.confirmDonate()


          transaction.finish();



        }

window["store"].when()
          .productUpdated(() => {
            console.log('updated');
            console.log(this.userData.donated)
            //const product = store.get(iapID);
            const donated=store.findInLocalReceipts(store.get("eqdonate"));
 
            if (donated.status == window["CdvPurchase"].TransactionState.APPROVED) {
             onApproval(donated);
            }

            if (donated.owned) {
            this.userData.donated=true
            }
            this.changeDetectorRef.markForCheck()
            this.writeStorage()


            })
          .approved((transaction) => {
           // alert('hi');
            onApproval(transaction);
          })

}

}


})










  await this.storage.create();
  await this.syncRemoteJSON()

let init=true;
let temp={}


this.userData.cosmetics={lock:[this.userData.color.lock],grid:[this.userData.color.grid],num:[this.userData.color.num],op:[this.userData.color.op],bck:[this.userData.color.bck],anim:[this.userData.color.anim,"None","Only Gradient"],tot:5}


for (let i=0;i<permanence.length;i++){
      temp[permanence[i]] = await this.storage.get(storagePrefix+permanence[i]);
//console.error(temp[permanence[i]],permanence[i])

if (typeof temp[permanence[i]] !== 'undefined' && temp[permanence[i]] !== null){

  if (permanence[i]=="userData" && typeof temp[permanence[i]]==="boolean"){
this.userData.donated=true
}else{

    if (permanence[i]=="userData" && temp["userData"].tutorial>-1 && temp["userData"].tutorial<10){
    break
  }

    this[permanence[i]]=temp[permanence[i]];
  init=false
 }
}

if (typeof this.gamestate.focus == 'undefined'){
  this.gamestate.focus=[]
}


    }


if (typeof this.userData.blitzEZ == 'undefined'){
this.userData.blitzEZ=null
}

if (typeof this.userData.lastDaily == 'undefined'){
this.userData.lastDaily=null
}

if (!this.userData.review){
this.userData.review=0
}

if (!this.userData.genIndx){
this.userData.genIndx=0
}

if (!this.userData.blitzScore){
this.userData.blitzScore=0
}

if (!this.userData.blitzBest){
this.userData.blitzBest=0
}


if (this.blitzreleaseTemp){
  this.userData.blitzRelease=this.blitzreleaseTemp
}
this.blitzSuppress=Date.now() < new Date(this.userData.blitzRelease).getTime()



if ((!this.userData.version || this.userData.version!==version) && debug){
this.storage.clear().then(()=>{
this.refreshApp()
});
    }

  //this.ezShadowRef=this.userData.settings.easyMode


if (steam=="full" && !this.userData.donated){
  this.userData.donated=true
  this.thankyou()
  this.writeStorage()
}




if (!init){
this.splash=false
   this.medalCalc()
  this.createCalendar()



if (this.userData.tutorial==38){this.userData.tutorial=-1}
if (this.userData.tutorial==40){this.userData.tutorial=-1}

if (this.userData.tutorial==31){this.userData.tutorial=30}

console.error('tut break log:'+this.userData.tutorial)
if (this.userData.tutorial==35 || this.userData.tutorial==36){this.userData.tutorial=13;this.menuHidden=false}

if (this.userData.tutorial==22 || this.userData.tutorial==24){
this.userData.tutorial=13
}

  if (this.gamestate.numGrid && this.gamestate.numGrid.length>0){
this.checkNewDaily()
}else{
  this.splash=true;
  console.error('no numbgrid');
  //alert('no numgrid? Screenshot?');

}
console.log(this.userData.tutorial);
this.changeDetectorRef.markForCheck()
}else{
this.splash=true;

  /*
if (tutorial){
  this.initTutorial()
}else{
this.initNewDaily()
}
*/
}



}


ngOnDestroy() {
  // Enhanced cleanup
  Object.entries(this.animations).forEach(([id, anim]) => {
    console.log(id)
    if (anim) {
      try{
      (anim as any).pause();
      (anim as any).destroy();
      this.animationOptimizer.unregisterAnimation(id);
    } catch(error){
      console.error(`Failed to cleanup animation ${id}:`, error);
    }
    }
  });
  this.animations = {};
  
  // Clear all timeouts
  if (this.resizeTimer) clearTimeout(this.resizeTimer);
  if (this.shakeTimeout) clearTimeout(this.shakeTimeout);
  
  this.writeStorage()

  if (typeof Howler !== 'undefined') {
    Howler.unload();
  }
  
  // Remove any lingering event listeners
  if (this.platform?.resume) {
    this.platform.resume.unsubscribe();
  }
  
  if (this.platform?.pause) {
    this.platform.pause.unsubscribe();
  }
  
  // Clear any references that might prevent garbage collection
  this.gamestate = null;
  this.userData = null;
  this.genResults = null;
  
  // Unsubscribe from all subscriptions
  //this.destroy$.next();
  //this.destroy$.complete();
}


getCurrentDate(){
   const date = new Date();
  
  // Add or subtract n days (n can be positive or negative)

   if (debug){
  date.setDate(date.getDate() + dayOffset);
  }
  // Return the new date
  return date;
}

checkNewDaily(){

if (this.userData.tutorial==36){return}
//this.currentDate.setDate(this.currentDate.getDate() + 1);
let today=this.currentDate.toLocaleDateString('en-US')

if (today!==this.gamestate.dailySeen && ((this.userData.tutorial>13 && this.userData.tutorial!==35) || this.userData.tutorial==-1)){

 this.initNewDaily()

}else{
  this.evalBoard()
}






}




initTutorial(){

this.menuHidden=true;
this.userData.tutorial=0;
this.userData.prevTut=0;

this.initLevel(tutDat[0])


}

initNewDaily(){

  let today=this.currentDate.toLocaleDateString('en-US')

  this.gamestate.mode="daily"
  this.gamestate.numMoves=0;
  this.gamestate.dailySeen=today

let lvl=daily[today]

if (!lvl){
  let combined=[...db.easy, ...db.medium,...db.hard]

  const tod = new Date().toISOString().slice(0,10);

  // Convert date string into a number (simple hash)
  let hash = 0;
  for (let i = 0; i < tod.length; i++) {
    hash = tod.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Use the hash to pick an index
  const index = Math.abs(hash) % combined.length;

lvl=combined[index]
}

console.log(lvl)
this.gamestate.dailyDone=false;
this.gamestate.dailyWon=false;

//console.log(today,daily)
this.initLevel(lvl)


}

opBugCheck(){

//if (!debug){return}
let ops=['-','+','*','/','^','%']

if (!ops.includes(this.gamestate.opsGrid[1])){
  alert('screenshot this:'+this.gamestate.opsGrid[1]+':'+this.gamestate.ops[0]);
}


}

initLevel(lvl:any){


this.restoreSnapMode()

this.hint=-1
this.gamestate.lvlWon=false
this.gamestate.replay=false
this.gamestate.dailyDone=false;
this.gamestate.isLost=false
this.gamestate.ezLost=false
this.gamestate.locked=[]
this.gamestate.ezAttempt=false

if (this.gamestate.mode!=='endless'){this.userData.diff=null}

this.gamestate.numMoves=0;

this.gamestate.solution = lvl[2]

this.gamestate.numGrid =[]

lvl[0].forEach((a,n)=>{

this.gamestate.numGrid.push([a,n])

})

this.gamestate.orig=lvl[0]

//this.hammerInit()

    this.gamestate.ops = this.processOps(lvl[1])
    this.opSwitch = this.processSwitch('11111111')
    this.gamestate.opsGrid = this.genOps()


if (lvl[1].includes('%') && !this.userData.tutDat.mod){
  this.userData.tutorial=18
  this.gamestate.focus=[]
  this.userData.tutDat.mod=true
}
/*
let nvm=this.userData.tutDat.mod //this.userData.tutDat.skip || 

if (!nvm){
  
}*/

      this.evalBoard(true)

if (this.gamestate.mode=='blitz'){
  this.gamestate.lines=_.cloneDeep(this.expressionLines)
}
//console.error(lvl);
//if (this.userData.tutorial==-1){}
this.playSFX('save.wav');


this.writeStorage()


}

isOrig(): boolean {

let curr=this.gamestate.numGrid.map((e:any)=>{return e[0]})

console.log(curr)

  return JSON.stringify(curr) === JSON.stringify(this.gamestate.orig);
}

revertOrig(){
 
this.gamestate.numGrid=[]
this.gamestate.orig.forEach((a,n)=>{

this.gamestate.numGrid.push([a,n])

})
//console.log(this.gamestate.numGrid)
this.evalBoard()
}

  reOrder(e, type: any = 'num', override: any = false) {

    if (!override) {
      let regxRm = new RegExp(/\sxx(\d\d?)\s/g);
      var start = regxRm.exec(e.data.over.classList.value)
      regxRm = new RegExp(/\sxx(\d\d?)\s/g);
      var end = regxRm.exec(e.data.source.classList.value)
    } else {
      let start = [null, String(e[0])]
      let end = [null, String(e[1])]
    }

    if (start && end) {
      let a = parseInt(start[1])
      let b = parseInt(end[1])


var temp
      if (a !== b) {
        if (type == 'num') {
          temp = this.numOrder[b];
          this.numOrder[b] = this.numOrder[a];
          this.numOrder[a] = temp;
        } else {

          temp = this.opsOrder[b];
          this.opsOrder[b] = this.opsOrder[a];
          this.opsOrder[a] = temp;

        }


      }
    }
  }

  resolveMath(e: any) {
    //console.log(this.gamestate.numGrid, e);
    this.gamestate.numMoves++
  }


  onTokenClick(index: number) {
    console.log(`token ${index} was just clicked`)
    this.playSFX('sel')
    this.swapPair.push(index);
  }

  onSortStart(index: number, container: any) {
    console.log(`sort started: index = ${index}`)
  }

  onSort(e) {
    if (this.isAlone(this.currentSortStartIndex)) {
      e.cancel();
    }
  }

  onSortEnd(oldIndex: number, newIndex: number) {
    console.log(`sort ended: oldIndex = ${oldIndex}, newIndex = ${newIndex}`)
  }

  onDragEnd() {
    //console.log("sort animation ended")
    this.readTokens();


    if (this.swapPair.length == 2) {
      this.swapIndices(this.swapPair[0], this.swapPair[1]);
      this.swapPair = [];
      //this.playSFX('swap')


    } else if (this.swapPair.length == 0) {
      //this.playSFX('drop')
    }
    this.evalState();


  }

  isError(index) {

    var rung = (this.expression.join("").substr(0, index).match(/=/g) || []).length;

    return this.layerErrors.includes(rung)
  }

  isEqual(index, bool) {

    if (this.layerErrors.length > 0) { return }

    var rung = (this.expression.join("").substr(0, index).match(/=/g) || []).length;

    //console.log(this.layerEquals[rung] ? !bool : bool);
    return this.layerEquals[rung] ? bool : !bool
  }

  readTokens() {
    let tokens = Array.from(document.getElementsByClassName('container')[0].childNodes).filter((x: any) => x.tagName == 'DIV' || x.tagName == "SPAN").filter((x: any) => x.classList.value.includes('token')).map((x: any) => x.innerText.trim())
    console.log(tokens);
    var reg = /^\d+$/;



    let tokenEls = Array.from(document.getElementsByClassName('container')[0].children);
    let lockedTokens = [];
    tokenEls.forEach((token, i) => { if (token.classList.value.includes('locked')) { lockedTokens.push(i) } });




    var oldExp = this.expression;

    this.expression = tokens.map(x => {
      if (reg.test(x)) {
        return +x;
      }
      return x;
    })

    if (oldExp.join('') !== this.expression.join('')) {
      this.gamestate.numMoves++
      if (this.userData.settings.easyMode){
  this.gamestate.ezAttempt=true 
}
    } else {
      return
    }


    this.state = this.processExpression(this.expression, lockedTokens);
  }

  swapIndices(index1: number, index2: number) {
    if (index1 == index2) {
      return;
    }

    let temp = this.expression[index1];
    this.expression[index1] = this.expression[index2];
    this.expression[index2] = temp;

    let tokenEls = Array.from(document.getElementsByClassName('container')[0].children);
    let lockedTokens = [];
    tokenEls.forEach((token, i) => { if (token.classList.value.includes('locked')) { lockedTokens.push(i) } });

    this.gamestate.numMoves++
    if (this.userData.settings.easyMode){
  this.gamestate.ezAttempt=true 
}
    this.state = this.processExpression(this.expression, lockedTokens);

    this.writeStorage()
  }


  shakeIndex(index) {
    if (this.shakeTimeout && this.shake > -1) {
      clearTimeout(this.shakeTimeout);
      this.shake = -1
    }
    this.shake = index;


    this.shakeTimeout = setTimeout(() => {
      this.shake = -1;
      this.changeDetectorRef.markForCheck()
    }, 500)

  }


openLink(url:any='https://www.cinqmarsmedia.com'){

  if(!!window["cordova"]){

window["cordova"]["InAppBrowser"].open(url,'_system')

  }else{

      if (this.steam && window["electron"]){
        window["electron"].openLink(url);
  }else{
window.open(url,"_blank", 'location=yes')
    //window.open(url,"_blank", "frame=true,nodeIntegration=no");
  }

  }
}

moreLvls(){

this.menuBtn()

setTimeout(()=>{
  this.userData.tutorial=33
  this.changeDetectorRef.markForCheck()
},200)



}


async easyModeVerif(){
   const alert = document.createElement('ion-alert');
    alert.header = 'Easy Mode';
    alert.subHeader = 'You sure?';
    alert.buttons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {

      },
    },
    {
      text: 'Easy Mode',
      role: 'confirm',
      handler: () => {

      },
    }];

    document.body.appendChild(alert);
await alert.present();

}



toggleEasyMode(event:any){

let stop = this.userData.tutorial==9 || this.userData.tutorial==13 || this.gamestate.dailyDone || this.gamestate.lvlWon


if (stop){return}

if (this.userData.tutorial>0 && this.userData.tutorial<13){return}


let tut=false
//console.log(e);
  if (!this.userData.tutDat.easy){
      this.menuCtrl.close();
    tut=true
setTimeout(()=>{

 this.userData.prevTut=this.userData.tutorial
 this.tutViz=false
this.changeDetectorRef.markForCheck()
setTimeout(()=>{
  this.tutViz=true
    this.userData.tutorial=26;
    this.gamestate.focus=[]
    this.changeDetectorRef.markForCheck()
},0)

this.userData.tutDat.easy=true;


},500)

  }else if (this.userData.tutorial==31){
     this.userData.tutorial=-1
  }

// clear locks

if (!this.userData.settings.easyMode){
  this.gamestate.locked=[]
}



this.userData.settings.easyMode=!this.userData.settings.easyMode;



if (this.userData.settings.easyMode && !this.gamestate.ezAttempt){

if (!tut){
  this.gamestate.ezAttempt=true
}

 //if (this.gamestate.numMoves>0){}
  this.gamestate.numMoves=0;
   this.revertOrig();
this.gamestate.locked=[]


}else{
  this.gamestate.isLost=false;
}



  this.haptic(1);

  this.writeStorage()



}


async restartEZ(){

  if (this.gamestate.mode=='blitz'){

if (this.gamestate.blitzAttempt==this.currentDate.toLocaleDateString('en-US') && !this.userData.donated){

const alert = document.createElement('ion-alert');
    alert.header = 'Unlimited Blitz';
    alert.subHeader = 'Make a donation to play unlimited blitz. Otherwise you may attempt the daily blitz puzzle each day for free.';
    alert.buttons = [
    {
      text: 'Not Now',
      role: 'cancel',
      handler: () => {},
    },
    {
      text: 'Donate',
      role: 'confirm',
      handler: () => {
         this.donate()
      },
    }];

    document.body.appendChild(alert);
await alert.present();

return
}

this.userData.blitzScore=0
this.gamestate.dailyBlitz=false
this.blitz(true)

return;
  }

if (!this.userData.donated){
      // this.suppressEZ=true
    const alert = document.createElement('ion-alert');
    alert.header = 'Restart Level';
    alert.subHeader = 'Make a donation to restart levels in easy mode, otherwise you may restart in normal mode to attempt a bronze medal.';
    alert.buttons = [
    {
      text: 'Normal Mode',
      role: 'cancel',
      handler: () => {
 
  this.gamestate.numMoves=0;
   this.revertOrig();
  this.gamestate.isLost=false;
  //this.ezShadowRef=!this.ezShadowRef
  this.userData.settings.easyMode=false

this.changeDetectorRef.markForCheck()
//this.suppressEZ=false
//console.error('above line causes app to crash. commented out for now');
    },},
    {
      text: 'Donate',
      role: 'confirm',
      handler: () => {
         this.donate()
 //this.suppressEZ=false
         //console.error('above line causes crash. REFACTOR');

      },
    }];

    document.body.appendChild(alert);
await alert.present();

}else{
this.gamestate.numMoves=0;
 this.revertOrig();
this.gamestate.isLost=false;

}

}


  async downImg(dataURL) {

 const anchor = document.createElement('a');
  anchor.href = dataURL;


let name:any=this.getTitle()


  anchor.download = name

  // Simulate a click on the anchor element to trigger the download
  anchor.click();

  }


  async copyImgClip(dataURL) {


    try {
      // Convert the data URL to a Blob
      const response = await fetch(dataURL);
      const blob = await response.blob();

      // Create a ClipboardItem
      const item = new ClipboardItem({ 'image/jpg': blob });

      // Write the ClipboardItem to the clipboard
      await navigator.clipboard.write([item]);

    } catch (err) {
      console.error('Failed to copy image: ', err);

    }
  }

  isAlone(index) {
    var isAlone = true;
    var after = this.expression.join("")[index + 1]
    var before = this.expression.join("")[index - 1]

    if (after && after !== '=') {
      isAlone = false;
    }

    if (before && before !== '=') {
      isAlone = false
    }
    return isAlone;
  }
  isIndexDraggable(index) {
    return !(this.state[index].locked);
  }

  sanLayer(layer) {
    var san = layer.replace(/×/g, '*');
    san = san.replace(/÷/g, '/')
    return san
  }

  testLayer(layer) {
    var san = layer.replace(/\+/g, '/');
    san = san.replace(/\-/g, '/')
    return san

  }


  randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  randNum(digits: any = 2) {

    var running = '';

    for (let d = 0; d < digits; d++) {
      running += String(Math.floor(Math.random() * 10))
    }

    return parseInt(running);

  }

  shuffle(exp) {
    var shuffled = exp;
    var realShuff = '';

    var ops = shuffled.match(/\*|-|\+|\//g);

    ops.sort(() => Math.random() - 0.5);

    shuffled = shuffled.replace(/\*|-|\+|\//g, '_');

    var nums = shuffled.match(/\d/g);

    nums.sort(() => Math.random() - 0.5);

    shuffled = shuffled.replace(/\d/g, ';');

    var equals = shuffled.split('=');

    equals.sort(() => Math.random() - 0.5);

    equals.forEach((sub, i) => {
      if (Math.random() > .6) {
        equals[i] = equals[i].split('').reverse().join('')
      }
    })

    shuffled = equals.join('=');
    //console.log(shuffled);
    var numIndex = 0;
    var opsIndex = 0;

    shuffled.split('').forEach((char) => {

      if (char == ';') {
        realShuff += nums[numIndex];
        numIndex++
      } else if (char == '_') {
        realShuff += ops[opsIndex];
        opsIndex++
      } else {
        realShuff += char
      }
    })




    //console.log(ops,nums,shuffled);



    // randomly swap all the digits, including
    //console.log(shuffled);
    return [realShuff, exp]

  }




lock(i:any,sfx:any=false){
    console.log('lock');
    
    if (this.clickSwapInProgress){
      this.onNumClick(this.reverseGridIndex(this.clickSwapStartIndex))
    }
    if(this.userData.settings.easyMode){return}
    if (this.userData.tutorial>-1 && this.userData.tutorial<16 && !this.userData.tutDat.lock){return}

    this.suppress=true;
    setTimeout(()=>{
      this.suppress=false
      this.changeDetectorRef.markForCheck()
    },500)

    if (this.gamestate.locked.includes(i)){

      this.gamestate.locked.splice(this.gamestate.locked.indexOf(i), 1);

    }else{
      this.gamestate.locked.push(i);

      if (this.userData.tutorial==22 || this.userData.tutorial==24){
        this.userData.tutDat.lock=true     
        this.userData.tutorial=13
      }
    }

    if (sfx){
      this.playSFX('hover')
    }

    this.writeStorage()
  }


  getFactors(num) {
    // This is a faster version of the getFactors function from earlier
    const factors = [];
    const sqrt = Math.sqrt(num);
    
    // Find factors up to square root
    for (let i = 1; i <= sqrt; i++) {
      if (num % i === 0) {
        factors.push(i);
        // Don't add duplicate for perfect squares
        if (i !== num / i) {
          factors.push(num / i);
        }
      }
    }
    
    // Sort the factors numerically
    return factors.sort((a, b) => a - b);
  }


  expValidator(expression) {

    return Boolean((expression.match(/^[\*\+\-\/\d]+=[\*\+\-\/\d]+(=[\*\+\-\/\d]+)?(=[\*\+\-\/\d]+)?(=[\*\+\-\/\d]+)?$/g) || []).length);
  }

  processSwitch(str) {
    let arr = []
    str.split('').forEach((t) => {

      arr.push(t == '1')

    });

    return arr
  }

  processOps(str) {
    return str.split('')
  }


  changeAnim(){
let d=this.userData.color.anim

    if (d=='None' || d=='Only Gradient'){
this.userData.hideAnim=true
    }else if (d=='Equals+Squares'){
this.userData.hideAnim=false
    }

    this.writeStorage()
  }

  levelWon() {
    this.confetti()
    //this.gamestate.numMoves++
 
if (this.userData.tutorial==7){
  this.menuHidden=false;
  this.menuState='closed'
  this.changeDetectorRef.markForCheck()
  setTimeout(()=>{this.incTut(7);this.changeDetectorRef.markForCheck()},1000)
}

if (this.userData.tutorial==13){
  this.menuHidden=true;
  this.changeDetectorRef.markForCheck()
  setTimeout(()=>{this.userData.tutorial=35;this.changeDetectorRef.markForCheck()},100)
}


this.playSFX('winLvl')


if (this.gamestate.mode=='blitz'){

this.userData.blitzScore++

if (this.userData.blitzScore>this.userData.blitzBest){
  this.userData.blitzBest=this.userData.blitzScore

  if (this.userData.blitzScore==10){
    this.userData.tutorial=40
    this.changeDetectorRef.markForCheck();
  }
}

this.blitzAtta=attas[Math.floor((attas.length - 1) * Math.random())]
this.changeDetectorRef.markForCheck()

setTimeout(()=>{
this.blitzAtta=false
this.changeDetectorRef.markForCheck()


},1500)






this.blitz(true)

  return;
}




if (this.gamestate.mode=='gen'){
  
this.saveStateArchive()
this.writeStorage()
  return
}







if (this.userData.settings.easyMode){
  this.gamestate.ezAttempt=true 
}

this.atta=attas[Math.floor((attas.length - 1) * Math.random())]






if (this.gamestate.mode=="daily" && this.gamestate.dailyWon){
  console.log('not awarding medal again')
}else{
  console.log(this.gamestate)
if (this.gamestate.numMoves<=this.medalThresh[0] && !this.gamestate.ezAttempt){
  //gold
  this.gamestate.medal='gold'
  this.userData.medals[2]++
}else if (this.gamestate.numMoves>this.medalThresh[0] && this.gamestate.numMoves<=this.medalThresh[1] && !this.gamestate.ezAttempt){
  //silver
  this.gamestate.medal='silver'
  this.userData.medals[1]++
}else{
  this.gamestate.medal='bronze'
    this.userData.medals[0]++
}



  
}

if (this.gamestate.mode=="daily"){
  this.gamestate.dailyWon=true



if (!this.gamestate.lvlWon){
  let medal=(this.gamestate.numMoves<=this.medalThresh[0]?'gold':(this.gamestate.numMoves>this.medalThresh[1]?'bronze':'silver'))
//this.userData.month=[]

if (this.gamestate.ezAttempt){
  medal='bronze'
}

let last=this.userData.month?.[this.userData.month.length-1]?.date

this.streakType=this.getStreakType(this.userData.streak)


if (last && this.currentDate.getMonth()!==new Date(last).getMonth()){
 this.userData.month=[] 
 this.userData.monthReward=0;
}

this.userData.month.push({date:this.currentDate.toISOString(),medal:medal,day:this.currentDate.getDate()})


function areConsecutive(date1Str, date2Str) {
  const d1:any = new Date(date1Str);
  const d2:any = new Date(date2Str);
  
  const diff:any = Math.abs(d2 - d1);
  const oneDay = 24 * 60 * 60 * 1000;
  
  return diff === oneDay;
}

console.log(this.userData.streak)

if (this.userData.streak>0 && this.userData.lastDaily && areConsecutive(this.userData.lastDaily,this.currentDate.toLocaleDateString('en-US'))){
  this.userData.streak++
}else{
  this.userData.streak=1
}




this.userData.lastDaily=this.currentDate.toLocaleDateString('en-US')



}

}


this.gamestate.lvlWon=true;


this.saveStateArchive()

if (this.gamestate.mode=="endless" && this.userData.diff!=='random'){
  //this.userData.endlessIndx[this.userData.diff]=this.userData.endlessIndx[this.userData.diff]+1
 // this.userData.endlessIndx
  this.userData.endlessPlayed[this.userData.diff].push(this.userData.endlessIndx[this.userData.diff])
}


this.medalCalc()



this.writeStorage()
    
  }

  saveStateArchive(){
     let id


if (this.userData.tutorial>-1 && this.userData.tutorial<11){return}

if (this.gamestate.mode!=='endless'){
 id=this.gamestate.mode

 if (Array.isArray(id)){id=id[0]+(id[1]?id[1]:'')}

this.userData.gamestateArchive[id]=_.cloneDeep(this.gamestate)

if (id=="blitz"){
  console.error(this.gamestate);
}

//console.log(this.userData.gamestateArchive[id].mode)
}else{

  id=this.userData.diff+this.userData.endlessIndx[this.userData.diff]

  this.userData.gamestateArchive.endless[0]=id;
  this.userData.gamestateArchive.endless[1]=_.cloneDeep(this.gamestate)

}



  }

getStreakType(streak){

let responses=["Starting","Super","Hyper","Ultra","Mega","Giga"]
let rez=responses[Math.floor(streak/5)]

if (!rez){
  rez="Maximum"
}

return rez

}

menuClose(){
this.incTut(33)
  if (this.userData.tutorial==9 || this.userData.tutorial==10 ){

this.menuCtrl.open()

return;
  }

  this.menuState='closed'
}


checkDailyTut(){
  if (this.userData.tutDat.skip || this.userData.tutDat.daily){return}
this.userData.tutorial=16;
this.userData.tutDat.daily=true;
}
/*
checkMod(){
  if (this.userData.tutDat.skip || this.userData.tutDat.mod){return}
if (this.gamestate.ops.includes('%')){
 alert('mod tut'); 
}
}
*/
  nextPuzzle(){

    if (this.userData.tutorial!==-1 && this.userData.tutorial<13){return}

    if (this.userData.tutorial==13 || this.userData.tutorial==36){

// Check if share modal
  this.sharePrompt=false
this.menuHidden=false;
  this.changeDetectorRef.markForCheck()

setTimeout(()=>{
      this.initNewDaily()
      this.userData.tutorial=13
      this.incTut()
},0)
      return;
    }

    //console.error(this.userData.tutorial);

if (this.gamestate.mode=="daily"){

/**/

let streak=1
for (let h=this.userData.month.length-2;h>-1;h--){

console.log(this.userData.month[h+1].day,this.userData.month[h].day==1)
if (this.userData.month[h+1].day-this.userData.month[h].day==1){
  streak++
}else{
  break
}

}

if (streak>this.userData.streak){
  this.userData.streak=streak
}


if (this.userData.streak>this.userData.medals[3]){
  this.userData.medals[3]=this.userData.streak
}


  this.createCalendar();
  this.checkDailyTut()
  this.gamestate.dailyDone=true
this.saveStateArchive()
this.writeStorage()

if(this.userData.monthReward+this.mthThresh-this.userData.month.length==0){
this.userData.monthReward=this.userData.monthReward+this.mthThresh
this.monthReward()
this.writeStorage()

}

}else if (this.gamestate.mode=='endless'){
this.loadEndless()
}else if (this.gamestate.mode=='gen'){
//next gen logic ()()
}else if (this.gamestate.mode=='blitz'){
// will never fire because blitz mode moves on instantly
}else{

this.openChallenges()


}

  }


openChallenges(){
  this.userData.newChall[1]=false;
  this.menuState='challenges';
  this.menuCtrl.open()
}


  evalState() {
    this.shake = -1;
    this.layerErrors = [];

    let expression = this.state.map(tok => tok.value).join('').split('=');

    var results = [];
    expression.forEach((layer, i) => {
      var sanitizedLayer = this.sanLayer(layer);
      var tstlayer = this.testLayer(sanitizedLayer)
      try {
        var testRez = evaluate(tstlayer)
        var realRez = evaluate(sanitizedLayer)
        results.push(realRez)
      } catch {
        this.layerErrors.push(i)
      }

    })

    function allEqual(array) {
      const result = array.every(element => {
        if (element === array[0]) {
          return true;
        }
      });

      return result;
    }

    if (this.layerErrors.length == 0 && allEqual(results)) {
      //this.levelWon()
    }
    var lyrEql = []
    results.forEach((val, i) => {

      if (i + 1 < results.length) {
        lyrEql.push(val == results[i + 1])
      }

    })

    this.layerEquals = lyrEql;


    console.log(this.layerEquals);
    console.log(this.layerErrors);
    console.log(results);


  }


  ngAfterViewInit() {
  }


  async snapLockPop(){

if (this.userData.tutorial!==-1){return}

this.snapLockCount++

if (this.snapLockCount%5!==0){return}






  const alert = document.createElement('ion-alert');
    alert.header = 'Snap Mode';
    alert.subHeader = 'In snap mode, numbers are circled and locked when correct. '+(this.mobile?'Tap':'Click')+' in the upper left corner to change modes.';
    alert.buttons = [

    {
      text: 'Got it!',
      role: 'confirm',
      handler: () => {

      },
    }];

    document.body.appendChild(alert);
    await alert.present();



  }


  onSwap({ from, to }: { from: number, to: number },i:any) {

    if (from == to || this.gamestate.locked.includes(this.reverseGridIndex(to))) {
      return;
    }

    if (this.userData.settings.easyMode && this.gamestate.solution[to]==this.gamestate.numGrid[to][0]){
      this.snapLockPop()
    return
    }

    // Temporarily pause animations during swap for better performance <leading to bugs>
    //this.animationOptimizer.pauseAllAnimations();

    this.swapNumByIndexes(from,to);
    //this.animationOptimizer.processPendingAnimations();
    

    if (this.gamestate.numGrid[from][0]!==this.gamestate.numGrid[to][0]){
      this.gamestate.numMoves++;
      if (this.userData.settings.easyMode){
  this.gamestate.ezAttempt=true 
}
      this.playSFX('swap');
      this.haptic();

      if (this.userData.tutorial==1){
        this.incTut(2,true);
      }

      this.incTut(4);
      this.evalBoard();
    } else {
      this.playSFX('neg.wav');
    }

    setTimeout(() => {
      this.animationOptimizer.resumeVisibleAnimations();
    }, 50);
  }

 reverseGridIndex(index:number) {
  // Reverse the row factor calculation
  let row = Math.floor(index / 3);

  // Reverse the column factor calculation
  let column = (index % 3) * 2;

  // Combine to get the original index
  return row * 10 + column;
}

  private memoizedGetGridIndex = _.memoize((i: number) => {
    return (3 * (Math.floor(i / 10))) + Math.floor((i % 10) / 2);
  });

  getGridIndex(i: number) {
    return this.memoizedGetGridIndex(i);
  }


  sanTut(){

  var temp=this.gameData.tutorialDB

  Object.keys(temp).forEach((e)=>{
    if (temp[e] && typeof temp[e][0] !=='string'){

      if (e=='14' || e=='16' || e=='33'){
        temp[e][0]=temp[e][0][this.userData.donated?0:1]
      }else{
        temp[e][0]=temp[e][0][this.mobile?0:1]
      }
      
    }   
  
  })
return temp

}


 syncRemoteJSON() {
    // sync remote JSON
    console.log("sync to remote server")
    /**/

//UPDATE IF APPLICABLE
/*
this.gameData.packs=Packs
this.gameData.daily=Daily
this.gameData.db={...Database,...synDatabase}
this.gameData.monthly=this.genArchive()

this.gameData.tipDB=tipDB
*/
this.gameData.tutorialDB=tutorialDB
this.tutDB=this.sanTut()
console.error(this.tutDB)


return new Promise((resolve,reject)=>{


    var modified:any
    fetch("URL_HERE")
      .then((response) => {
        console.log(response)
        modified=response.headers.get("Last-Modified");
return response.json()
        })
      .then((data) => {
        console.error(data)


if (data && data.blitzRelease){
this.userData.blitzRelease=data.blitzRelease
this.blitzreleaseTemp=data.blitzRelease
this.blitzSuppress=Date.now() < new Date(data.blitzRelease).getTime()

}


      })
      .catch(console.error);



//this.gameData.MonthlyPacks=Object.keys(this.gameData.MonthlyArchive);

resolve(true)


})

// do all the fetching!!!!!
}

  getGridLineClass(i: number) {
    if (this.expressionLines[i]) {
      return 'correct-grid-line';
    } else if (this.showWrong || this.lineCount > 6) {
      return 'incorrect-grid-line';
    }
    return '';
  }



  private clickSwapStartIndex: number;
  private clickSwapInProgress: boolean = false;









  onNumClick(i: number) {

if (this.suppress){return}

if (this.userData.tutorial==4 || this.userData.tutorial==22 || this.userData.tutorial==24){return}
if (this.userData.tutorial==1){
  if (i==4){this.incTut()}else{return}

}

if (this.userData.tutorial==2){
  if (i==0){
    this.incTut()
  }else{return}
}

if (this.gamestate.locked.includes(i)){
  //this.lock(i);

/* android HACK
  if (!this.gamestate.easyMode && this.android){
    this.lock(i)
  }
*/

  return
}


if (this.userData.settings.easyMode && this.gamestate.solution[this.getGridIndex(i)]==this.gamestate.numGrid[this.getGridIndex(i)][0]){
this.snapLockPop()
return
}

//is lock switched?


    i = this.getGridIndex(i);


let idL=String(this.gamestate.numGrid[i][0])[0]+'_'+String(this.gamestate.numGrid[i][1])+'_0'
let idR=String(this.gamestate.numGrid[i][0])[1]+'_'+String(this.gamestate.numGrid[i][1])+'_1'

//console.log(idL,idR)

    if (!this.clickSwapInProgress) {
//console.log(this.animations[this.gamestate.numGrid[i]+'_0']);
/*
 Object.values(this.animations).forEach((anim:any) => {
   console.log(anim)
      if (anim.loop) {
        anim.loop = false;
        anim.stop();
      }
    });
*/

this.animations[idL].stop()
this.animations[idL].loop=true;

if (this.gamestate.numGrid[i][0]>9){

 this.animations[idR].stop()
this.animations[idR].loop=true;
 this.animations[idR].play()
}
this.animations[idL].play()
//this.animations[this.gamestate.numGrid[i]+'_0'].stop()



      this.clickSwapInProgress = true;
      this.clickSwapStartIndex = i;
      this.playSFX('sel');
    } else {
      this.clickSwapInProgress = false;
      const from = this.clickSwapStartIndex;
      const to = i;
    

  //this.changeDetectorRef.markForCheck()

  if (from == to) {

//this.animations[idL].stop()
this.animations[idL].loop=false
//this.animations[idL].play()

if (this.gamestate.numGrid[i][0]>10){
 //this.animations[idR].stop()
this.animations[idR].loop=false;
 //this.animations[idR].play()
}

        this.clickSwapInProgress = false;
/**/

this.stopLoops()


this.playSFX('sel')
        return;
      }

      //[this.gamestate.numGrid[from][0], this.gamestate.numGrid[to][0]] = [this.gamestate.numGrid[to][0], this.gamestate.numGrid[from][0]];
      //this.history.push([...this.gamestate.numGrid])
      //let temp=[...this.gamestate.numGrid[a]]
     // this.gamestate.numGrid[from]=[...this.gamestate.numGrid[to]]
      //this.gamestate.numGrid[to]=[...temp];

this.swapNumByIndexes(from,to)



idL=String(this.gamestate.numGrid[to][0])[0]+'_'+String(this.gamestate.numGrid[to][1])+'_0'
idR=String(this.gamestate.numGrid[to][0])[1]+'_'+String(this.gamestate.numGrid[to][1])+'_1'
//console.log(to,from,i)

//console.log(this.animations[idL].isPaused)
if (this.animations[idL]){
this.animations[idL].loop=false
}
/*
this.animations[idR].loop=false;
console.log(this.animations[idL])

this.animations[idL].stop()
this.animations[idL].loop=false

if (this.gamestate.numGrid[i][0]>10){
 this.animations[idR].stop()
this.animations[idR].loop=false;
}
*/





      this.evalBoard();
      if (this.gamestate.numGrid[from][0]!==this.gamestate.numGrid[to][0]){
        this.gamestate.numMoves++;
        if (this.userData.settings.easyMode){
  this.gamestate.ezAttempt=true 
}
      }
      
      this.playSFX('swap')
      this.haptic()


  //this.gamestate.numMoves=this.gamestate.numMoves+99





    }
  }

  stopLoops(){
    Object.values(this.animations).forEach((anim:any) => {
  if (!anim.isPaused){}
        anim.loop = false;
    });
  }

  swapNumByIndexes(a:any,b:any){
    // Swap the elements using destructuring assignment
    //[this.gamestate.numGrid[a], this.gamestate.numGrid[b]] = [this.gamestate.numGrid[b], this.gamestate.numGrid[a]];

    [this.gamestate.numGrid[a][0], this.gamestate.numGrid[b][0]] = [this.gamestate.numGrid[b][0], this.gamestate.numGrid[a][0]];

    this.hint=-1
      //  console.log(this.gamestate.numGrid[a])

this.stopLoops()

  }

  getOpGridIndex(i: number) {
    return this.gamestate.opsGrid.slice(0, i).filter(op => op != '').length + 1;
  }

  trackByFn(index: number, item: any): any {
    if (item && item.id !== undefined) {
      return item.id;
    }
    
    if (typeof item !== 'object' || item === null) {
      return index + '-' + String(item);
    }
    
    return index;
  }

  getGridClasses() {
    const classes = ['op-grid', 'hardware-accelerated'];
    
    if (this.gamestate.lvlWon && !this.gamestate.replay) {
      classes.push('noTouch');
    }
    
    if (this.userData.color.grid === '-1') {
      classes.push('whiteFilterGrid');
    }
    
    return classes.join(' ');
  }
}



