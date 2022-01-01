var jogo={};
var velocidadeInimigo = 5;
var velocidadeAmigo = 3;
var podeAtirar = true;
var pontos = 0 ;
var salvos = 0;
var perdidos = 0;
var energiaAtual = 3;
var playerkey = 0;
var fimdejogo = false;
var timerInimigo2 = null;
var timerAmigo = null;

//SONS
var somDisparo=document.getElementById("somDisparo");
var somExplosao=document.getElementById("somExplosao");
var musica=document.getElementById("musica");
var somGameover=document.getElementById("somGameover");
var somPerdido=document.getElementById("somPerdido");
var somResgate=document.getElementById("somResgate");

function start(){
    //hide the dive start
    $('#inicio').hide();

    //add the player and other elements

    $("#fundogame").append("<div id='amigo' class='anima3'></div>");
    $("#fundogame").append("<div id='jogador' class='anima1'></div>");
    $("#fundogame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundogame").append("<div id='inimigo2'></div>");
    $("#fundogame").append("<div id='placar'></div>");
    $("#fundogame").append("<div id='energia'></div>");
    $("#fundogame").focus();

    $("#fundogame").on("keydown",playerAction);

    jogo.timer = setInterval(loop,30);

    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
    musica.play();

    function loop(){
        moveFundo();
        moveInimigo1();
        moveInimigo2();
        moveAmigo();
        moveJogador();
        moveBullet();
        colisao();
        placar();
        energia();
    }

}

function energia(){
	
		if (energiaAtual==3) {		
			$("#energia").css("background-image", "url(/assets/imgs/energia3.png)");
		}
		if (energiaAtual==2) {	
			$("#energia").css("background-image", "url(/assets/imgs/energia2.png)");
		}
		if (energiaAtual==1) {	
			$("#energia").css("background-image", "url(/assets/imgs/energia1.png)");
		}
		if (energiaAtual==0) {	
			$("#energia").css("background-image", "url(/assets/imgs/energia0.png)");

            gameOver();
			//Game Over
		}
}

function placar() {
    $("#placar").html("<h2>Pontos: "+pontos+" Salvos: "+salvos+" Perdidos: "+perdidos+"</h2>");
}

function colisao(){
    //jogador x inimigos
    let colisao1 = $("#jogador").collision($("#inimigo1"));
    let colisao2 = $("#jogador").collision($("#inimigo2")); 

    //disparo x inimigos
    let colisao3 = $("#inimigo1").collision($("#disparo"));
    let colisao4 = $("#inimigo2").collision($("#disparo"));

    //amigo
    let colisao5 = $("#jogador").collision($("#amigo"));
    let colisao6 = $("#inimigo2").collision($("#amigo"));

    if(colisao1.length>0){
        energiaAtual--;
        var x = parseInt($("#inimigo1").css("left"));
        var y = parseInt($("#inimigo1").css("top"));

        reposicionaInimigo1();

        explosao(x, y);
    }

    if(colisao2.length> 0){
        energiaAtual--;
        var x = parseInt($("#inimigo2").css("left"));
        var y = parseInt($("#inimigo2").css("top"));

        reposicionaInimigo2();

        explosao(x, y);
    }
    
    if(colisao3.length> 0){
        pontos+=100;
        velocidadeInimigo+=0.3;
        var x = parseInt($("#inimigo1").css("left"));
        var y = parseInt($("#inimigo1").css("top"));

        reposicionaInimigo1();
        $("#disparo").remove();
        podeAtirar = true;
        hitExplosion(x,y);
    }

    if(colisao4.length>0){

        pontos+=50;
        var x = parseInt($("#inimigo2").css("left"));
        var y = parseInt($("#inimigo2").css("top"));

        reposicionaInimigo2();
        $("#disparo").remove();
        podeAtirar = true;
        hitExplosion(x, y);

        console.log(colisao4);
    }

    if(colisao5.length>0){
        salvos++;
        somResgate.play();
        $("#amigo").remove();
        reposicionaAmigo();
    }

    if(colisao6.length>0){
        somPerdido.play();
        perdidos++;

        amigoX = parseInt($("#amigo").css("left"));
        amigoY = parseInt($("#amigo").css("top"));
        explosao3(amigoX,amigoY);
        $("#amigo").remove();
		
        reposicionaAmigo();
    }

}

function explosao3(amigoX,amigoY) {
    $("#fundogame").append("<div id='explosao3' class='anima4'></div");
    $("#explosao3").css("top",amigoY);
    $("#explosao3").css("left",amigoX);
    var tempoExplosao3=window.setInterval(resetaExplosao3,1000);
    function resetaExplosao3() {
    $("#explosao3").remove();
    window.clearInterval(tempoExplosao3);
    tempoExplosao3=null;      
    }
}

function reposicionaAmigo(){
        if(timerAmigo ==null) timerAmigo=setInterval(reviveAmigo, 3000);

        function reviveAmigo(){
            clearInterval(timerAmigo);
            timerAmigo=null;
            if(!fimdejogo)$("#fundogame").append("<div id='amigo' class='anima3'></div>");
        }
}

function reposicionaInimigo2() {
            $("#inimigo2").remove();
            if(timerInimigo2 == null)timerInimigo2=setInterval(restartInimigo2, 5000);

            function restartInimigo2(){
                clearInterval(timerInimigo2);
                timerInimigo2 = null;
                if(!fimdejogo){
                    $("#fundogame").append("<div id='inimigo2'></div>");
                }
            }
}

function reposicionaInimigo1() {
    if(!fimdejogo){
        $("#inimigo1").css("left", 689);
        $("#inimigo1").css("top", Math.floor(Math.random() * 253));
    }
}

function explosao(x, y){
    somExplosao.play();
    $("#fundogame").append("<div id='explosao'></div>");
    $("#explosao").css("background-image", "url(/assets/imgs/explosao.png)");
    var div= $("#explosao");

    div.css("left", x);
    div.css("top", y);
    div.animate({width:200, opacity:0}, "slow");

    var timer= setInterval(removeExplosao, 1000);

    function removeExplosao(){
        clearInterval(timer);
        timer = null;
        div.remove();
    }
}

function hitExplosion(x, y){
    const hitexplosion = {
        div:null,
        removeExplosao:function(){
            var timer = setInterval(() => {
                clearInterval(timer);
                timer = null;
                this.div.remove();
                },600)}
    };

    var div = document.createElement("div");
    div.classList.add("explosaohit");
    div.style.backgroundImage = "url(/assets/imgs/explosao.png)";
    div.style.left = x+"px";
    div.style.top = y+"px";

    $("#fundogame").append(div);
    
    setTimeout(() => {div.classList.add("expandedExplosion")}, 100);

    var explosion = Object.create(hitexplosion);
    explosion.div= div;
    explosion.removeExplosao();
}

function moveFundo(){
    esquerda = parseInt($("#fundogame").css("background-position"));
    $("#fundogame").css("background-position", esquerda-1);
}

function moveInimigo1(){
    var actualPosition = parseInt($("#inimigo1").css("left"));
    if(actualPosition<0) {
        reposicionaInimigo1();
    }else{
        $("#inimigo1").css("left",actualPosition-velocidadeInimigo);
    }
}

function moveInimigo2(){
    var actualPosition = parseInt($("#inimigo2").css("left"));
    if(actualPosition<0) reposicionaInimigo2();
    else{
        $("#inimigo2").css("left",actualPosition-velocidadeInimigo);
    }
}

function moveAmigo(){
    let posicaoX= parseInt($("#amigo").css("left"));
    $("#amigo").css("left",posicaoX + velocidadeAmigo);
    if(posicaoX >906) $("#amigo").css("left", 0);
}

function moveBullet(){
    let posicaoX= parseInt($("#disparo").css("left"));
    $("#disparo").css("left",posicaoX +20);
    if(posicaoX >906) {
        $("#disparo").remove();
        podeAtirar = true;
    }
}

function moveJogador(){
    let moveUp = function(){
        let actualPosition=parseInt($("#jogador").css("top"));
        if(actualPosition>0)$("#jogador").css("top",actualPosition-10);
    };

    let moveDown = function(){
        let actualPosition=parseInt($("#jogador").css("top"));
        if(actualPosition<400)$("#jogador").css("top",actualPosition+10);
    }

    switch(playerkey){
        case "w":
            moveUp();
        break;
        case "s":
             moveDown();
        break;
    }
}

function playerAction(event){
    let shoot = function(){ 
        if(podeAtirar){
            somDisparo.play();
            $("#fundogame").append("<div id='disparo'></div>");
            $("#disparo").css("left", parseInt($("#jogador").css("left"))+180);
            $("#disparo").css("top", parseInt($("#jogador").css("top"))+40);
            podeAtirar =  false;
        }
    };

    if(event.key == "d") shoot();
    else{
        playerkey = event.key;
    }
}

function gameOver() {
	fimdejogo=true;
	musica.pause();
	somGameover.play();
	
	window.clearInterval(jogo.timer);
	jogo.timer=null;
	
	$("#jogador").remove();
	$("#inimigo1").remove();
	$("#inimigo2").remove();
	$("#amigo").remove();
    $("#disparo").remove();
    $("#explosao").remove();
    $("#placar").remove();
    $("#energia").remove();
	
	$("#fundogame").append("<div id='fim'></div>");
	
	$("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=restart()><h3>Jogar Novamente</h3></div>");
}

function restart(){
    jogo={};
    velocidadeInimigo = 5;
    velocidadeAmigo = 3;
    podeAtirar = true;
    pontos = 0 ;
    salvos = 0;
    perdidos = 0;
    energiaAtual = 3;
    playerkey = 0;
    fimdejogo = false;
    
    if(timerAmigo!=null){
        clearInterval(timerAmigo);
        timerAmigo = null;
    }

    if(timerInimigo2!=null){
        clearInterval(timerInimigo2);
        timerAmigo = null;     
    }

    somGameover.pause();

    $("#fim").remove();

    start();
}
