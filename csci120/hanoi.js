const THICKNESS=60;
const TOPWIDTH=100;
const INDENT=10;
const GAP=20;
var RATIO=0.1;
N=8;
function pillar(n,i)
{
    let x=i*(screen.width-TOPWIDTH)/2.5 + (n-1)*INDENT;
    let y=THICKNESS;
    let width= TOPWIDTH/2;
    let height=THICKNESS*(1+n);
    let ele=document.createElement("div");
    ele.className="layer";
    ele.style.left=x+'px';
    ele.style.top=y+'px';
    ele.style.width=width+'px';
    ele.style.height=(height)+'px';
    ele.id="pillar"+i;
    ele.innerHTML=disk(width,height,i);
    ele.style.backgroundColor='transparent';
    document.body.appendChild(ele);
}
function layer(n,i)
{
    let x=i*INDENT;
    let y=(n-i+1)*THICKNESS;
    let width=2*(n-i-1)*INDENT+TOPWIDTH;
    let height=THICKNESS;
    let ele=document.createElement("div");
    ele.className="layer";
    ele.style.left=x+'px';
    ele.style.top=y+'px';
    ele.style.width=width+'px';
    ele.style.height=(height)+'px';
    ele.id="layer"+i;
    ele.innerHTML=disk(width,height,i);
    ele.style.backgroundColor='transparent';
    document.body.appendChild(ele);
}

function tower(n)
{
    for(let i=0;i<n;i++)
        layer(n,i);
    for(let i=0;i<3;i++)
        pillar(n,i);
    for(let i=0;i<n;i++)
    {
        let disk=document.getElementById('layer'+i);
   //     Drag.init(disk);
    }
    
}

function move(i,x,y)
{
    let ele=document.getElementById("layer"+i);
    ele.style.left=x+'px';
    ele.style.top=y+'px';
}

function disk(w,h,i)
{
    let h1=w*RATIO;
    //let color=colors[i];
    let color='rgb('+Math.floor(Math.random()*256)+","
                            +Math.floor(Math.random()*256)+","
                            +Math.floor(Math.random()*256)+")";
    let s='<div style="margin-top: '+h1+'px;width:'+w+'px;height:'+h+'px;background-color:'+color+'"></div>'
        +'<div style="margin:-'+h1/2+'px 0px -'+(h1+h)+'px 0px;width:'+w+'px;height:'+h1+'px;background-color:'+color+';border-radius:'+(w/2)+'px/'+h1/2+'px"></div>'
        +'<div style="width:'+(w-2)+'px;height:'+h1+'px;background-image: radial-gradient(#101010,#305020,15%,yellow,'+color+');border-radius: '+(w/2-1)+'px/'+h1/2+'px;border:1px red solid;"></div>';
       return s;
}

function moveDisk(i)
{
    let disk=document.getElementById('layer'+i);
    disk.style.animation='diskmove 2s 1';
}
//tower(N);
//moveDisk(2);
//setTimeout('moveDisk(4)',2000);

var alldiv=document.querySelectorAll('div');
for(let j=0;j<alldiv.length;j++)
    alldiv[j].classList.add('cls1');

var My={
    println:function(x){document.writeln(x+'<br>');},
    $:function(x){return document.getElementById(x);}
};

let instructions=[];
function move(n,source,destin,temp)
{
    if(n===1)
        instructions.push([source,destin]);
    else
    {
        move(n-1,source,temp,destin);
        instructions.push([source,destin]);
        move(n-1,temp,destin,source);
    }
}
//move(N,0,1,2);
//for(let p of instructions)
//My.println(p[0]+"-->"+p[1]);

let stack=[];
stack[0]=[];for(let i=0;i<N;i++)stack[0].push(i);
stack[1]=[];
stack[2]=[];
//move(1,2)means:disk poped from 1,read out its (x0,y0)
//read out(x1,y1)from top of pier 2
//push the disk to the pier 2
function movedisk(k) //k-th instruction
{
    let p=instructions[k];
    let s=p[0];
    let d=p[1];
    let topid=stack[s].pop();
    let disk=My.$('layer'+topid);
    let x0=disk.style.left;
    let y0=disk.style.top;
	
    let x1=((screen.width-TOPWIDTH)/2.5*d)+'px';
    let y1=(N*THICKNESS)+'px';
    let q=stack[d];
    if (q.length>0)
    {
        let topid1=q[q.length-1];
        let disk1=My.$('layer'+topid1);
        x1=disk1.style.left;
        y1=disk1.style.top;
        y1=(parseInt(y1.substring(0,y1.length-2))-THICKNESS)+'px';
	let w1=parseInt(disk1.style.width.replace(/px/,''));
	let w=parseInt(disk.style.width.replace(/px/,''));
	let diff=(w1-w)/2;
	x1=(parseInt(x1.replace(/px/,''))+diff)+'px';
    }
    
    q.push(topid);
    
let kftext="@keyframes diskmoveK{0%{left:X;top:Y}\n30%{left:X;top:0px}\n70%{left:U;top:0px}\n100%{left:U;top:V}}";
    My.$('dynamic').innerHTML =kftext.replace(/K/,k).replace(/X/g,x0).replace(/Y/,y0).replace(/U/g,x1).replace(/V/,y1);
    disk.style.animation="diskmove"+ k +" " + readtime() + "s 1";
    disk.style.left=x1;
    disk.style.top=y1;
}
//movedisk(0);
//for(let i=1;i<instructions.length;i++)
//setTimeout('movedisk('+i+')',i*1010);


let s =document.getElementById('numdisks');

for(let n=0; n<=8;n++)
     s.options[n]=new Option(n+2,n+2);
 
s.selectedIndex=0;

s=document.getElementById('period');

for (let n=0; n <=5; n++)
s.options[n]=new Option((1+n)*0.5,(1+n)*0.5);

function showhint(hint,key)
{
	let dv=document.createElement('div');
	dv.id=key;
	dv.style.cssText='background-color:yellow;color:purple;box-shadow:3px 3px #6;'
	dv.className='cnmae';
	dv.innerHTML=hint;
	document.body.appendChild(dv);
}
function hidehint(key)
{ 	
	let dv=document.getElementById(key);
	dv.parentNode.removeChild(dv);
}
var orderOfInstructions = 0;
var handle;
function startgame()
{
	let s=document.getElementById('numdisks');
   	let nd=s.options[s.selectedIndex].value;
	N=parseInt(nd);
	tower(N);
        move(N,0,1,2);
        orderOfInstructions = 0;
	moveasch();
}
function readtime()
{
    let s = document.getElementById('period');
    let v = s.options[s.selectedIndex].value;
    let n = parseFloat(v);
    return n;
}
function moveasch()
{
    movedisk(orderOfInstructions);
    orderOfInstructions++;
    if (orderOfInstructions < instructions.length)
    {  
        let n = readtime();
        handle = setTimeout(moveasch, n*1000);
    }
}
function stopgame()
{
    let b = document.getElementById('pausebtn'); 
    if (b.value === 'Pause')
    {
        clearTimeout(handle);
    }
    b.value = 'Pause';
    
}
function pausegame()
{
    let b = document.getElementById('pausebtn');
    if (b.value === 'Pause')
    {
        clearTimeout(handle);
        b.value = 'Resume';
    }
    else
    {
        if (orderOfInstructions < instructions.length)
           moveasch();
        b.value = 'Pause';
    }
}
function resumegame()
{
	movedisk(orderOfInstruction);
}
 
 


