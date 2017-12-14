"use strict";

var num_img, max_grid, max_cards, studentImages, currentStudentId,
currentT, currentS, shifts, shiftsLimit, level, levelLimit,
match, matchLimit, serialT, extra, iDeck, param, objetivo, tiempo, repeticiones,
cvcWord, tWord, wordLenght, barCont, audio, creada, contenedor_array, w, datoWorker;;


$(document).ready(function () {
  preload();
  console.log("preload");
  $('#vidBox').VideoPopUp({
     backgroundColor: "#17212a",
     opener: "video1",
       maxweight: "340",
       idvideo: "v1"
   });
});

function preload() {
  num_img = 8; max_grid=16; max_cards=4; studentImages; currentStudentId=0;
  currentT=0; currentS=0; shifts=0; shiftsLimit=4; level=1; levelLimit=7;
  match=1; matchLimit=2; serialT=0; extra=0; iDeck=0; param = {}; objetivo=true; tiempo=true; repeticiones=true;
  cvcWord; tWord; wordLenght; barCont=1; audio; creada=false;contenedor_array=[];
  preparar();
  $("#student_deck").hide();
  $("#pBar").hide();
  var listaDeAudios=[];
  var ruta = "data/images.json";
  $.getJSON( ruta, function( data ) {
    listaDeAudios = data;
    contenedor_array=data;
    cargarAudioVerbos(listaDeAudios);
    setTimeout(loadGame, 1000);
  });
}


function preparar() {
  //prepararMensaje();
$("#main").append("<div class='contenedor_secundario' id='contenedor'></div>");
$("#contenedor").append("<div id='crono'> </div>");
$("#contenedor").append("<audio id='good' src='audio/ok1.wav' autostart='false'></audio>");
$("#contenedor").append("<audio id='wrong' src='audio/ok2.wav' autostart='false' ></audio>");
$("#contenedor").append("<audio id='ayuda' src='audio/help.mp3' autostart='false'></audio>");
$("#contenedor").append("<audio id='acercaDe' src='audio/about.mp3' autostart='false' ></audio>");
$("#contenedor").append("<audio id='clickear' src='audio/clickboton.wav' autostart='false' ></audio>");
$("#contenedor").append("<div id='paraImagenes' class='divImagenes'></div>");
$("#contenedor").append("<div id='paraNivel' class='divLevel'></div>");
$("#contenedor").append("<img src='interfase/fondo_splash.jpg' id='imgBackground' alt=''>");
$("#contenedor").append("<div class='grupo_audios'> </div>");
$("#contenedor").append("<div class='botonera' id='botones' ></div>");
// $("#botones").append("<img class='cliqueables' onmouseover='sonar("+'"ayuda"'+")' src='interfase/btn_help_activo.png'>");
// $("#contenedor").append("<div id='vidBox'><div id='videCont'><video  id='v1' controls><source src='videos/level1.mp4' type='video/mp4'></video> </div>");

$("#botones").append("<a id='btnHelp' href='videos/level1.mp4' class='html5lightbox' title='Help'</a>");
$("#btnHelp").append("<img class='cliqueables' onmouseover='sonar("+'"ayuda"'+")' src='interfase/btn_help_activo.png'>");
$("#botones").append("<a id='btnAbout' href='interfase/fondo_acerca.jpg' class='html5lightbox' title='About'></a>");
$("#btnAbout").append("<img class='cliqueables' onmouseover='sonar("+'"acercaDe"'+")' src='interfase/btn_about_activo.png'>");
$("#contenedor").append("<div class='mensaje' id='informacion'>");
$("#informacion").append("<img src='interfase/gane_nivel.jpg' id='infoMensaje'>");
$("#contenedor").append("<div class='panelGrande row' id='panelJuego'></div>");
$("#panelJuego").append("<div id='progress'></div>");
$("#progress").append("<img id='pBar' src='interfase/barra0.png'>");
$("#panelJuego").append("<div id='paraTextos' class='divTextos'></div>");
$("#panelJuego").append("<div class='panel' id='teacher_panel' ></div>");
$("#panelJuego").append("<div class='panel' id='student_panel' ></div>");
$("#panelJuego").append("<div class='card_deck' id='student_deck'>");
$("#student_deck").append("<img src='interfase/bnt_left_activo.png' id='btn_left' onclick='cardsBackward()'>");
$("#student_deck").append("<img src='interfase/img_deck.png' id='imgDeck'>");
$("#student_deck").append("<img src='interfase/bnt_right_activo.png' id='btn_right' onclick='cardsForward()'>");
$("#panelJuego").append("<div class='card_deck' id='teacher_deck'></div>");
$("#contenedor").append("<div id='dialogMsg' title=''> </div>");
startWorker();
}

function startWorker() {

  if(typeof(w) == "undefined") {
      w = new Worker("js/crono.js");
  }
    w.onmessage = function(event) {
            datoWorker = event.data;
              // $("#crono").text(datoWorker);

          };
      }


function increasePbar() {
  var imgBarra = "interfase/barra";
  console.log(imgBarra+barCont+".png");
  $("#pBar").attr("src",imgBarra+barCont+".png");
  barCont++;
  if (barCont >= 8) {
	  barCont=0;
  }
}

function setParam() {
	console.log("Setting parameters");
  // set initial parameters
  // orientation and initial position
  var hList = [0,4,8,12];
   var initial = hList[Math.floor((Math.random() * 4) )];
   var orientation="h";
  // Set position for showing teacher´s and student´s cards
   serialT=initial;
   param = {"orientation" : orientation , "initial" : initial};
   extra=2;
}

function loadGame() {
  setParam();
  $("#student_deck").show();
  $("#pBar").show();
    $("#botones").css('visibility', 'visible');
	console.log("Loading...");

  if (level>0) {
    // reset game
    $(".grid").remove();
    $(".cards").remove();
    currentT=0;
    currentS=0;
    studentImages=[];
  }
  // create the GRID
  createGrid();
  // $("#btn_left").attr("src","interfase/bnt_left_inactivo.png");
  // $("#btn_right").attr("src","interfase/bnt_right_inactivo.png");
  // $("#btn_left").attr("onClick","");
  // $("#btn_right").attr("onClick","");
  $("#btn_left").addClass("oculta");
  $("#btn_right").addClass("oculta");
  if (level>=2) {
    $("#btn_left").removeClass("oculta");
    $("#btn_right").removeClass("oculta");
    $("#btn_left").attr("src","interfase/bnt_left_activo.png");
    $("#btn_left").attr("onClick","cardsBackward()");
    $("#btn_left").css('cursor','pointer');
    $("#btn_right").attr("src","interfase/bnt_right_activo.png");
    $("#btn_right").attr("onClick","cardsForward()");
    $("#btn_right").css('cursor','pointer');
  }
  $("#paraNivel").html("<span> LEVEL </span>"+level);
  // Load Json
  switch (level) {
    case 1:
    case 2:
        loadJasonPictures1_2();
    break;
    case 3:
        loadJasonPictures3();
      break;
    case 4:
    case 5:
    case 6:
        loadJasonWords();
      break;
    default:
  }

}

function createGrid() {
	console.log("creating Grid");

  switch (level) {
    case 1:
    case 2:
    case 3:
    // Create background
    $("#imgBackground").attr("src","interfase/fondo.jpg");
    $("#imgBackground").css("z-index","-100");

    // create grid
    for (var i = 0; i < max_grid; i++) {
        $("#teacher_panel").append("<div class='grid'  id='t_grid"+i+"'></div>");
        $("#student_panel").append("<div class='grid'  id='e_grid"+i+"'></div>");
        $("#e_grid"+i).append("<img class='Stud_cards' id='s_grid"+i+"'>");
        $("#t_grid"+i).addClass('width ratio16-9');
        $("#e_grid"+i).addClass('width ratio16-9');
        $("#teacher_panel").addClass("width2 ratio16-9");
        $("#student_panel").addClass("width2 ratio16-9");

    }
    if (creada==false) {
      $("#student_deck").append("<img class='s_cards' id='cardToShow'>");
      creada=true;
    }

    break;
    case 4:
    case 5:
    case 6:
    // $("#imgBackground").attr("src", "interfase/fondo_nivel_4.jpg");
    // $("#imgBackground").css("z-index","-100");
    $("#imgBackground").attr("src","interfase/fondo.jpg");
    $("#imgBackground").css("z-index","-100");

    for (var i = 0; i < max_grid; i++) {
        $("#teacher_panel").append("<div class='grid'  id='t_grid"+i+"'></div>");
        $("#student_panel").append("<div class='grid'  id='s_grid"+i+"'></div>");
        // $("#e_grid"+i).append("<img class='Stud_cards' id='s_grid"+i+"'>");
        $("#t_grid"+i).addClass('width ratio16-9');
        $("#s_grid"+i).addClass('width ratio16-9');
        $("#teacher_panel").addClass("width2 ratio16-9");
        $("#student_panel").addClass("width2 ratio16-9");

     }
    $("#student_deck").remove();
    $("#contenedor").append("<div class='card_deckText' id='student_deck'></div>");

    $("#student_deck").append("<div class='container_scards' id='container0'>");
    $("#container0").append("<div class='s_cards letterCardsStudent' id='cardToShow0'>");

    $("#student_deck").append("<div class='container_scards' id='container1'>");
    $("#container1").append("<div class='s_cards letterCardsStudent' id='cardToShow1'>");

    $("#student_deck").append("<div class='container_scards' id='container2'>");
    $("#container2").append("<div class='s_cards letterCardsStudent' id='cardToShow2'>");

    $("#student_deck").append("<div class='container_scards' id='container3'>");
    $("#container3").append("<div class='s_cards letterCardsStudent' id='cardToShow3'>");

    break;
  default:
  }
}

function cargarAudioVerbos(lista) {
for (var i = 0; i < lista.length; i++) {
      $(".grupo_audios").append("<audio class='audios'  preload='auto' src='audio/"+ lista[i].word +".mp3'  id='"+ lista[i].word +"'></audio>");
}
}

function showInfo(info,cual) {

  $("#imgBackground").css('filter', 'blur(5px)');
  $("#panelJuego").css('filter', 'blur(5px)');
  // $("#student_deck").css('filter', 'blur(5px)');
  // $("#student_deck").attr('visibility', 'hidden');
  // $("#cardToShow0").css('filter', 'blur(5px)');
  // $("#cardToShow1").css('filter', 'blur(5px)');
  // $("#cardToShow2").css('filter', 'blur(5px)');
  // $("#cardToShow3").css('filter', 'blur(5px)');
  $("#botones").css('filter', 'blur(5px)');
  $("#paraNivel").css('filter', 'blur(5px)');
  $("#infoMensaje").attr("src",info);
  $("#informacion").css('visibility', 'visible');
  if (cual != "creditos") {
    $("#cerrar").css('visibility', 'hidden');
  }
  $("#infoMensaje").attr("width","100%");
    setTimeout(function(){
      if (cual != "creditos") {
        $("#student_deck").attr('visibility', 'visible');
        $("#imgBackground").css('filter', 'blur(0px)');
        $("#panelJuego").css('filter', 'blur(0px)');
        // $("#student_deck").css('filter', 'blur(0px)');
        // $("#cardToShow0").css('filter', 'blur(0px)');
        // $("#cardToShow1").css('filter', 'blur(0px)');
        // $("#cardToShow2").css('filter', 'blur(0px)');
        // $("#cardToShow3").css('filter', 'blur(0px)');
        $("#botones").css('filter', 'blur(0px)');
        $("#paraNivel").css('filter', 'blur(0px)');
        $("#informacion").css('visibility', 'hidden');
        $("#cerrar").css('visibility', 'hidden');
      }
    }, 3000);
    if (cual == "creditos") {
      $("#cerrar").css('visibility', 'visible');
    }
    }

function hideInfo() {
  $("#informacion").css('visibility', 'hidden');
  $("#imgBackground").css('filter', 'blur(0px)');
  $("#panelJuego").css('filter', 'blur(0px)');
  $("#student_deck").css('filter', 'blur(0px)');
  $("#botones").css('filter', 'blur(0px)');
  $("#paraNivel").css('filter', 'blur(0px)');
  $("#cerrar").css('visibility', 'hidden');
}

function loadJasonPictures1_2() {
	console.log("Executing: loadJasonPictures1_2");
  var pic=[];
  var pictures=[];
  // $.getJSON( "data/images.json", function( data ) {
      // callback
    var max_array = contenedor_array.length;
    var selector;
    for (var i = 0; i < max_cards; i++) {
      selector = Math.floor((Math.random() * max_array));
      pic = contenedor_array[selector];
    contenedor_array.splice(selector, 1);
      pictures.push(pic);
      console.log(pictures);
      max_array--;
    };

    console.log("******* LOADED jSON *******");
    createTcards(pictures, max_cards);
    createScards(pictures, max_cards);
    // Show the first teacher and student card
      showTeacherCards();
      showStudentCards();
    // Event Listeners
    eventListeners();
  // });

}

function loadJasonPictures3() {
	console.log("Executing: loadJasonPictures3");
  var picture=[];
  var pictureList=[];
  console.log(extra);

  // $.getJSON( "data/images.json", function( data ) {
    var max_array = contenedor_array.length;
    var selector;
    extra=max_cards+extra;
    for (var i = 0; i < extra; i++) {
      selector = Math.floor((Math.random() * max_array));
      picture = contenedor_array[selector];
      contenedor_array.splice(selector, 1);
      pictureList.push(picture);
      max_array--;
     };
    // callback
    createTcards(pictureList, max_cards);
    createScards(pictureList, max_cards);
    // Show the first teacher and student card
      showTeacherCards();
      showStudentCards();
    // Event Listeners
    eventListeners();
  // });

};

function loadJasonWords() {
	console.log("Executing: loadJasonWords");
  $.getJSON( "data/cvc_words.json", function( data ) {
      // callback
    var max_array = data.length;
    var selector = Math.floor((Math.random() * max_array));
    cvcWord = data[selector];
    tWord = cvcWord.name;
    wordLenght = cvcWord.lenght;
    shiftsLimit = wordLenght;
    console.log("******* LOADED WORD IN jSON *******");
    console.log("word: "+tWord+" //// wordLenght: "+wordLenght);

    createTcardsWords(tWord, wordLenght);
    createScardsWords();
    //Show the first teacher and student card
    showTeacherCards();
    //Event Listeners
    eventListeners();
    // sonar(tWord);
  });

}

function createAudio(audioName) {
  audio = new Audio();
  audio.src="/audio/"+audioName+".mp3";
  audio.play();
  // audio.pause();
  console.log("Audio creation");
}

function sonar(que) {
  document.getElementById(que).play();
}

function createTcards(pictures, max_cards) {
  console.log("***Creating Teacher cards");
  var imgPath;
  var pos = param.initial;
  var orientation = param.orientation;
  // console.log(orientation);
  // console.log(pos);
  // TEACHER CARDS
  for (var i = 0; i < max_cards; i++) {
    imgPath = "img/"+pictures[i].name+".png";
    // $("#t_grid"+pos).attr ("style","background-image:url("+imgPath+")");

    $("#t_grid"+pos).append("<img class='cards'  id='t_card"+pos+"'  src='"+imgPath+"' >");
    pos++;
    //console.log(imgPath);
  }
}

function createTcardsWords(word, max_cards) {
  console.log("***Creating Teacher cards");
  var pos = param.initial;
  var orientation = param.orientation;
  // console.log(orientation);
  // console.log(pos);
  // TEACHER CARDS
  for (var i = 0; i < max_cards; i++) {
    $("#t_grid"+pos).append("<div class='cardsL letterCards'  id='t_card"+pos+"'>"+tWord[i]+"</div>");
    pos++;
  }
}

function createScards(pictures, max_cards) {
  // STUDENTS CARDS
  console.log("***Creating students cards");
  var id = param.initial;
  var tmpStudentImages = {id:"", path:""};
  var imgPath;
  switch (level) {
    case 1:
    // console.log("nivel 1");
      for (var i = 0; i < max_cards; i++) {
        imgPath="img/"+pictures[i].name+".png";
        tmpStudentImages = {id:id, path:imgPath};
        studentImages.push(tmpStudentImages);
        //console.log(studentImages[i]);
        id++;
      }
      break;
      case 2:
      /*
      That’s a Fisher-Yates shuffle. It was invented by Ronald Fisher and Frank Yates in 1938,
      originally as a method for researchers to mix stuff up with pencil and paper.
      In 1964, Richard Durstenfeld came up with the modern method as a
      computer algorithm. It has a run time complexity of O(n).
      */
      var i = 0, j = 0, temp = null,  array = [];
      array = pictures;
      for (i = array.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1))
        temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
        // console.log("---------- shuffled array: 2");


      // generating students cards
      for (var i = 0; i < max_cards; i++) {
        imgPath="img/"+array[i].name+".png";
        tmpStudentImages = {id:id, path:imgPath};
        studentImages.push(tmpStudentImages);
        id++;
      }

        break;
        case 3:
        var i = 0, j = 0, temp = null,  array = [];
        array = pictures;
        for (i = array.length - 1; i > 0; i -= 1) {
          j = Math.floor(Math.random() * (i + 1))
          temp = array[i]
          array[i] = array[j]
          array[j] = temp
        }
          // console.log("---------- shuffled array: 3");
          // console.log(array);

        // generating students cards

        for (var i = 0; i < extra; i++) {
          imgPath="img/"+array[i].name+".png";
          tmpStudentImages = {id:id, path:imgPath};
          studentImages.push(tmpStudentImages);
          id++;
        };
        // console.log(studentImages);

    default:
  }
}

function createScardsWords() {
  if (tWord.length<3){
    document.getElementById("cardToShow0").innerHTML=tWord[1];
    document.getElementById("cardToShow1").innerHTML=tWord[0];
    document.getElementById("cardToShow2").style.visibility="hidden";
    document.getElementById("cardToShow3").style.visibility="hidden";
    }

    else {
      var orden = Math.round(Math.random()*2);
      console.log(orden);

      if (orden==0){
        document.getElementById("cardToShow0").innerHTML=tWord[2];
        document.getElementById("cardToShow1").innerHTML=tWord[0];
        document.getElementById("cardToShow2").innerHTML=tWord[1];
      }
      if (orden==1){
        document.getElementById("cardToShow0").innerHTML=tWord[2];
        document.getElementById("cardToShow1").innerHTML=tWord[1];
        document.getElementById("cardToShow2").innerHTML=tWord[0];
      }

      if (orden==2){
        document.getElementById("cardToShow0").innerHTML=tWord[1];
        document.getElementById("cardToShow1").innerHTML=tWord[0];
        document.getElementById("cardToShow2").innerHTML=tWord[2];
      }

      if (tWord[3]!=undefined) {
        document.getElementById("cardToShow3").innerHTML=tWord[3];
      }else {
        document.getElementById("cardToShow3").style.visibility="hidden";
    }
  }
}

function showTeacherCards() {
  $("#t_card"+serialT).fadeIn();
  switch (level) {
    case 1:
    case 2:
    case 3:
      currentT=$("#t_card"+serialT).attr("src");
    break;
    case 4:
    case 5:
    case 6:
      currentT =  $("#t_card"+serialT).html();
      break;
    default:
  }
  // console.log("Showing the first Teacher card: " + currentT);
  serialT++;
}

function showStudentCards() {
    // reload the array with the new objects in the class
    if (level<4) {
      if (studentImages.length>0) {
        document.getElementById("cardToShow").src=studentImages[0].path;
        currentStudentId=studentImages[0].id;
      }
    }
}

function cardsForward() {

      if (iDeck<studentImages.length-1) {
      var sound = document.getElementById("clickear");
      sound.play();
      iDeck++;
      document.getElementById("cardToShow").src=studentImages[iDeck].path;
      currentStudentId=studentImages[iDeck].id;
      // console.log("forward increase: " + iDeck + " --- Id Image: " + currentStudentId);
      // console.log("forw");
      // console.log(studentImages);
    }
}

function cardsBackward() {
  if (iDeck>0) {
    iDeck--;
    var sound = document.getElementById("clickear");
    sound.play();
    document.getElementById("cardToShow").src=studentImages[iDeck].path;
    currentStudentId=studentImages[iDeck].id;
    // console.log("Backward decrease:" + iDeck + "Id Image: " + currentStudentId);
    // console.log("back");
    // console.log(studentImages);
  }
}

function checkPositionCards(cell) {
  var currentCell = cell.id.slice(6);
  var target = serialT-1;
  console.log("-Current Teacher: "+currentT);
  console.log("-Current Student: "+currentS);
  console.log("-Target: "+ target);
  console.log("-Curent student cell position: "+currentCell);
  // console.log("Current id Student Card: " +currentStudentId);
  // console.log("Curent teacher cell position: "+serialT );
  // console.log("Position of array: "+iDeck);
  // If it is correct:
  if (currentT==currentS && target == currentCell) {
    var sound = document.getElementById("good");
          sound.play();

    if (level<4) {
      engraveImage(target);

      var numTemporal = currentT.indexOf("_");
      console.log("posición_ "+numTemporal);
      var temporal = currentT.slice(numTemporal+1, -4);
      sonar(temporal);
              $("#paraTextos").html("<center><p id='textoAMostrar'>"+temporal+"</p></center>");
              if (temporal.length>5) {
                $("#textoAMostrar").removeClass("palabra");
                $("#textoAMostrar").addClass("palabraMediana");
              }
              else {
                $("#textoAMostrar").removeClass("palabraMediana");
                $("#textoAMostrar").addClass("palabra");
              }
              $("#paraTextos").css("visibility","visible");
      setTimeout(function(){
              $("#paraTextos").css("visibility","hidden");
      }, 1000);

    }else {
      engraveWord(target)
      // sonar(temporal);
    }
    //Controler change cards------------------------------------
    //Controler ends of game or change the level
    changeShift();
    } else {
      var sound = document.getElementById("wrong");
          sound.play();
        console.log("error!!!!");
        repeticiones=false;
        console.log(repeticiones);
            // showMessage("Opps! Try Again...");
          if (level>=4) {
            $("#"+currentStudentId).position({
              my: "top",
              at: "center",
              of: "#container"+ currentStudentId.slice(-1),
            });
            $("#cardToShow").removeAttr( 'style' );
          }else {
            $("#cardToShow").position({
              my: "top-11%",
              at: "center",
              of: "#student_deck",
            });
            $("#cardToShow").removeAttr( 'style' );
          }
    }
}

function engraveImage(t) {
  $("#s_grid"+t).attr("src",currentS);
  $("#s_grid"+t).show();
  console.log(currentS);
  studentImages.splice(iDeck,1);
  $("#cardToShow").position({
    my: "top-11%",
    at: "center",
    of: "#student_deck"
  });
  $("#cardToShow").removeAttr( 'style' );
}

function engraveWord(t) {
    $("#s_grid"+t).append("<div class='cardsR letterCards' id='s_card"+t+"'></div>")
    $("#"+currentStudentId).fadeOut();
    $("#s_card"+t).addClass("engravedImages");
    $("#s_card"+t).html(currentS);
  }

function changeShift() {
  // Reset variable to start in the first image
  iDeck=0;
  shifts++;
  console.log("---calling--> changeShift: "+shifts + "  --Level: "+ level);
  if (shifts==shiftsLimit) {
      // reset the image
        $("#cardToShow").attr("src", "interfase/base.png");
      // carga la próxima partida
      shifts=0;
      setTimeout(changeMatch, 1000);

    }else {
      showTeacherCards();
      showStudentCards();
    }
}

function changeMatch() {
    if (level>=4) {
        showImage(tWord);
        sonar(tWord);
    }

    match++;
    console.log("---calling--> changeMatch: "+match);
    increasePbar();


      if (match==matchLimit+1) {
        match=0;
        setTimeout(changeLevel, 2500);
      }
      else {
          setTimeout(loadGame, 2000);
      }

}

function changeLevel() {
  level++;

  if (level==1) {
    $("#btnHelp").attr("href","videos/level1.mp4");
  }
  if ((level==2) || (level==3)){
    $("#btnHelp").attr("href","videos/level2.mp4");
  }
  if (level==4)  {
    $("#btnHelp").attr("href","videos/level3.mp4");
    $("student_deck").removeClass();
  }
  if (level<levelLimit) {
    console.log("---calling--> changeLevel: "+level);
    // showLevel(level);
    showInfo('interfase/gane_nivel.jpg',"cambio")
    loadGame();
    }
    else  {

      $("#imgBackground").css("z-index", "100");
      // showMessage("Congratulations!!!");


        if (datoWorker>240) {
          tiempo=false;
        }
        //termina el worker
        w.terminate();
        $("#contenedor").remove();
        $("#main").append("<div class='contenedor_secundario' id='contenedor'>");
        $("#contenedor").append("<img id='imgBackground' alt=''>");
        $("#contenedor").append("<div id='audiosFinales'><audio class='audios' preload='auto' src='audio/playagain.mp3' id='playagain'></audio></div> ");
        sonar('playagain');
        $("#audiosFinales").append("<audio class='audios' preload='auto' src='audio/yes.mp3' id='yes'></audio>");
        $("#audiosFinales").append("<audio class='audios' preload='auto' src='audio/no.mp3' id='no'></audio>");
        $("#imgBackground").attr("src", "interfase/fondo.jpg");
        // $("#contenedor").append("<div id='confirmarSalida'>Do you want to play again?<div><br>");
        $("#contenedor").append("<div id='resultado'></div>");
        $("#contenedor").append("<div id='premio'></div>");
        $("#resultado").append("<center><div id='star1'></div><div id='star2'></div><div id='star3'></div></center><br>");
        if (objetivo==true) {
            $("#star1").append("<img id='objLogrado' src='interfase/star1-activa.png' alt=''>");
        } else {
            $("#star1").append("<img id='objNoLogrado' src='interfase/star1-inactiva.png' alt=''>");
        }
        if (tiempo==true) {
            $("#star2").append("<img id='tiempoLogrado' src='interfase/star2-activa.png' alt=''>");
        } else {
            $("#star2").append("<img id='tiempoNoLogrado' src='interfase/star2-inactiva.png' alt=''>");
        }
        if (repeticiones==true) {
            $("#star3").append("<img id='repLogrado' src='interfase/star3-activa.png' alt=''>");
        } else {
            $("#star3").append("<img id='repNoLogrado' src='interfase/star3-inactiva.png' alt=''>");
        }
        $("#premio").append("<img id='trofeo' src='interfase/trophy.png' alt=''>");
        $("#contenedor").append("<div id='salir'></div>");
        $("#contenedor").append("<div id='textoSalir'></div>");
        $("#textoSalir").append("<img src='interfase/txt_play_again.png' id='imgTextoSalir'>");
        $("#salir").removeAttr("style");
        $("#salir").addClass("salida");
        $("#salir").append("<img src='interfase/btn_check.png' id='si' onmouseover=sonar('yes') class='enlinea' onClick='refresh()'>");
        $("#salir").append("<img src='interfase/btn_x.png' id='nop' onmouseover=sonar('no') class='enlinea' onClick='despedida()'>");

      }
}

function despedida()
{
  $("#contenedor").remove();
  $("#main").append("<div class='contenedor_secundario' id='contenedor'>");
  $("#contenedor").append("<img id='imgBackground' alt=''>");
  $("#contenedor").append("<div><audio class='audios' preload='auto' src='audio/seeyou.mp3' id='bye'></audio></div> ");
  sonar('bye');
  $("#imgBackground").attr("src", "interfase/fondo_pantalla_see you.jpg");
}

function refresh() {
  location.reload(true);
  // $("#contenedor").remove();
  // preload();
}

function showImage(imgHtml) {
$("#imgBackground").css('filter', 'grayscale(80%)');
$("#panelJuego").css('filter', 'grayscale(80%)');
$("#student_deck").css('filter', 'grayscale(80%)');
$("#botones").css('filter', 'grayscale(80%)');
$("#paraNivel").css('filter','grayscale(80%)');
$("#paraImagenes").css('filter', 'grayscale(0%)');

$("#paraImagenes").html("<img src='img/img_"+imgHtml+".png'><center><p id='palabraPeq'>"+imgHtml+"</p></center>");

$("#paraImagenes").css("visibility","visible");
    setTimeout(function(){
      $("#imgBackground").css('filter', 'grayscale(0%)');
      $("#panelJuego").css('filter', 'grayscale(0%)');
      $("#student_deck").css('filter', 'grayscale(0%)');
      $("#botones").css('filter', 'grayscale(0%)');
      $("#paraNivel").css('filter','grayscale(0%)');
      $("#paraImagenes").css("visibility", "hidden")
    }, 2000);
}

function prepararMensaje() {
  console.log("tratando de mostrar video");
  $('#vidBox').VideoPopUp({
     backgroundColor: "#17212a",
     opener: "video1",
       maxweight: "340",
       idvideo: "v1"
   });
    // $("#dialogMsg").append("<video width='400' controls> <source src='videos/level1.mp4' type='video/mp4> </video>");
    //
    // $( "#dialogMsg" ).dialog({
    //     minWidth: 100,
    //     minHeight: 150,
    //     resizable: false,
    //     modal: true,
    //       width:'auto',
    //     draggable: false,
    //     title: texto
    // });
  // $(".ui-dialog-titlebar" ).css("display", "none" );
  //   setTimeout(function(){
  //       $( "#dialogMsg" ).dialog( "close" );
  //   }, 2000);
}

function showLevel(texto) {
  var ventanaMensaje = ("<center><div id='confirmacion'><p >"+texto+"</p></div></center>");
  $("#main_container").append(ventanaMensaje);
  $("#confirmacion").html("<img src='interfase/gane_nivel.jpg'>");
  $("#confirmacion").attr("visible","visible");
    $("#dialogMsg").html("<img src='interfase/gane_nivel.jpg' id='cambioNivel'>");
    $( "#dialogMsg" ).dialog({

        // height: 800,
        maxWidth: 700,
        // minHeight: 340,
        resizable: false,
        modal: true,
          width:'auto',
        draggable: false,
        title: "Level "+texto
    });
    $(".ui-dialog-titlebar" ).css("display", "none" );
    $( "#dialogMsg" ).dialog({
  position: { my: "center", at: "center", of: "#contenedor" }
});

    setTimeout(function(){
        $( "#dialogMsg" ).dialog( "close" );
    }, 4000);
}


function eventListeners() {

  $(".grid").droppable({
    drop: function () {
      checkPositionCards(this);
      console.log(this);
    }
  });

  $(".s_cards").draggable({
        containment: '#main',
    start: function () {
          currentS=$("#"+this.id).attr("src");
          currentStudentId = this.id;
          if (level>=4) {
            currentS=$("#"+this.id).html();

          }
          console.log("start drag - Current Student: "+currentStudentId);
    }
  });

}
