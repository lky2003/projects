

//board 
let board;
let boardwith= 850;
let boardheight= 638;
let context;

//plane
let planewidth=90;
let planeheight=45;
let planeX = boardwith/8;
let planeY = boardheight/2;
let planeimg;


let plane={
    x: planeX,
    y: planeY,
    width : planewidth,
    height : planeheight
}

//buildings
let buildarray = [];
let buildwidth = 53;
let buildheight = 380;
let buildX = boardwith;
let buildY = 0;

let topbuildimg;
let bottombuildimg;


//physics 
let velocityX=-2;
let velocityY = 0;
let gravity = 0.4;

let gameover= false;
let score = 0;



window.onload= function ()
{
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwith;
    context = board.getContext("2d");
    //draw plane
    context.fillStyle = "black";
    context.fillRect(plane.x,plane.y,plane.width,plane.height);
    //load images
    planeimg =new Image();
    planeimg.src = "./klipartz.com.png";
    planeimg.onload = function()
    {
        context.drawImage(planeimg,plane.x,plane.y,plane.width,plane.height);

    }
    topbuildimg=new Image();
    topbuildimg.src="./topbuild.png";

    bottombuildimg = new Image();
    bottombuildimg.src="./pngegg-removebg-preview.png"

    requestAnimationFrame(update);
    setInterval(placebuilds,1500);
    document.addEventListener("keydown",moveBird);
}

function update(){
    requestAnimationFrame(update);
    if (gameover)
    {
        return;
    }
    context.clearRect(0,0,board.width,boardheight);
    
    //bird
    
    velocityY += gravity;
    
    //plane.y+= velocityY;
    plane.y = Math.max(plane.y + velocityY,0);//apply gravity to plane and limit plane.y to top
    context.drawImage(planeimg,plane.x,plane.y,plane.width,plane.height);

    if (plane.y > board.height){
        gameover = true ;
    }
    //buildings 
    for (let i= 0; i<buildarray.length;i++)
    {
        let build = buildarray[i];
        build.x += velocityX;
        context.drawImage(build.img,build.x,build.y,build.width,buildheight);
 
     if (!build.passed && plane.x > build.x+build.width) {
        score+=0.5;
        build.passed = true;

     }
    if(detectCollision (plane,build ) ){
        gameover = true ;

   
    }  
 }
 //clear buildings 
 while(buildarray.length > 0 && buildarray [0].x < -buildwidth){
    buildarray.shift();// removes first element from the array
 }
 //score
 context.fillStyle = "white";
 context.font="45px sans-serif";
 context.fillText(score, 5, 45);

 if (gameover) {
     context.fillText("allahu akbar brother", 5, 90);
 }

}



function placebuilds()
{   

    if (gameover)
    {
        return;
    }
    let randomBuildY = buildY - buildheight/4 - Math.random()*(buildheight/2);
    let openingSpace = board.height/4;

    let topbuild = {
        img : topbuildimg,
        x : buildX,
        y : randomBuildY,
        width : buildwidth,
        height : buildheight,
        passed : false
    }
    buildarray.push (topbuild);

    let bottombuild={
        img : bottombuildimg,
        x : buildX,
        y : randomBuildY + buildheight + openingSpace,
        width : buildwidth,
        height : buildheight,
        passed : false
    }
     buildarray.push(bottombuild);
}

function moveBird(e){
    if (e.code == "Space"|| e.code == "ArrowUp" || e.code== "KeyX"){
       
        //jump
        velocityY = -6;

        //RESET game 
if (gameover)
{
    plane.y = planeY;
    buildarray = [];
    score =0;
    gameover = false ;
}

    }
}

function detectCollision (a,b){
    return a.x < b.x + b.width &&
           a.x + a.width> b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}