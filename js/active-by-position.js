//=========================================================================================
// https://www.aelatgt.org/position-based-rendering/js/active-by-position.js
//=========================================================================================

//Query user elements
const cameraEl = document.querySelector("#avatar-rig"); //query the user
//const cameraEl = APP.scene.camera; //query the user
const playerHUD = document.querySelector("#avatar-pov-node"); //query the HUD
//const sceneEl = document.querySelector('a-scene');

// Create your A-Frame entities
const cubeQuad1 = document.createElement('a-box');
const cubeQuad2 = document.createElement('a-box');
const cubeQuad3 = document.createElement('a-box');
const cubeQuad4 = document.createElement('a-box');

// Create HUD Text
const posText = document.createElement('a-entity');
const angleText = document.createElement('a-entity');
const quadText = document.createElement('a-entity');
const strataText = document.createElement('a-entity');

// 1 Cube per Quadrant
cubeQuad1.setAttribute('position', { x: 5, y: 1, z: -5 });
cubeQuad1.setAttribute('scale', { x: 1, y: 1, z: 1 });
cubeQuad1.setAttribute('material', { color: 'red', shader: 'flat' });
cubeQuad1.setAttribute('class', 'quad1');
cubeQuad1.setAttribute('visible', false);

cubeQuad2.setAttribute('position', { x: -5, y: 1, z: -5 });
cubeQuad2.setAttribute('scale', { x: 1, y: 1, z: 1 });
cubeQuad2.setAttribute('material', { color: 'blue', shader: 'flat' });
cubeQuad2.setAttribute('class', 'quad2');
cubeQuad2.setAttribute('visible', false);

cubeQuad3.setAttribute('position', { x: -5, y: 1, z: 5 });
cubeQuad3.setAttribute('scale', { x: 1, y: 1, z: 1 });
cubeQuad3.setAttribute('material', { color: 'green', shader: 'flat' });
cubeQuad3.setAttribute('class', 'quad3');
cubeQuad3.setAttribute('visible', false);

cubeQuad4.setAttribute('position', { x: 5, y: 1, z: 5 });
cubeQuad4.setAttribute('scale', { x: 1, y: 1, z: 1 });
cubeQuad4.setAttribute('material', { color: 'yellow', shader: 'flat' });
cubeQuad4.setAttribute('class', 'quad4');
cubeQuad4.setAttribute('visible', false);

// Position HUD Text
posText.setAttribute('position', { x: 0, y: 2, z: -4 });
posText.setAttribute('rotation', {x: 0, y: 0, z: 0});
posText.setAttribute('text', {value: 'Pos Text'});
posText.setAttribute('scale', { x: 5, y: 5, z: 5 });
posText.setAttribute('opacity', 0.5);
posText.setAttribute('id', 'pos-text');

// Angle HUD Text
angleText.setAttribute('position', { x: 0, y: 1.5, z: -4 });
angleText.setAttribute('rotation', {x: 0, y: 0, z: 0});
angleText.setAttribute('text', {value: 'Angle Text'});
angleText.setAttribute('scale', { x: 5, y: 5, z: 5 });
angleText.setAttribute('opacity', 0.5);
angleText.setAttribute('id', 'angle-text');

// Quad HUD Text
quadText.setAttribute('position', { x: 0, y: 1, z: -4 });
quadText.setAttribute('rotation', {x: 0, y: 0, z: 0});
quadText.setAttribute('text', {value: 'Quad Text'});
quadText.setAttribute('scale', { x: 5, y: 5, z: 5 });
quadText.setAttribute('opacity', 0.5);
quadText.setAttribute('id', 'quad-text');

// Strata HUD Text
strataText.setAttribute('position', { x: 0, y: .5, z: -4 });
strataText.setAttribute('rotation', {x: 0, y: 0, z: 0});
strataText.setAttribute('text', {value: 'Strata Text'});
strataText.setAttribute('scale', { x: 5, y: 5, z: 5 });
strataText.setAttribute('opacity', 0.5);
strataText.setAttribute('id', 'strata-text');

// Add HUD Text to the Hubs scene
playerHUD.appendChild(posText);
playerHUD.appendChild(angleText);
playerHUD.appendChild(quadText);
playerHUD.appendChild(strataText);

//Code for testing on Mozilla Hubs
APP.scene.appendChild(cubeQuad1);
APP.scene.appendChild(cubeQuad2);
APP.scene.appendChild(cubeQuad3);
APP.scene.appendChild(cubeQuad4);

// //Code for testing on A-Frame
// document.querySelector("a-scene").appendChild(cubeQuad1);
// document.querySelector("a-scene").appendChild(cubeQuad2);
// document.querySelector("a-scene").appendChild(cubeQuad3);
// document.querySelector("a-scene").appendChild(cubeQuad4);



//==================================================================================================


//Query all interactable networked elements
let interactablesBefore = document.querySelectorAll("[gltf-model-plus][networked], [media-video][networked], [media-image][networked], [media-pdf][networked]").length;
console.log("interactables on start: " + interactablesBefore);


//Query all entity assets
let allEntityArray = document.querySelectorAll("[gltf-model-plus][networked], [media-video][networked], [media-image][networked], [media-pdf][networked]");

const ORIGIN_X = 0;
const ORIGIN_Z = 0;

let userCurrQuad = null;
let userPrevQuad = null;

let userCurrStrata = 0;
let userPrevStrata = 0;

determineUserQuad();

// assignQuadsToEntity(allEntityArray);
allEntityArray.forEach(assignQuadsToEntity);

//Continously update scene info
setInterval(function() {
  //Get update on user position and current quadrant
  determineUserQuad();

  //let interactablesAfter = document.querySelectorAll(".interactable").length;
  let interactablesAfter = document.querySelectorAll("[gltf-model-plus][networked], [media-video][networked], [media-image][networked], [media-pdf][networked]").length;
  if (interactablesAfter != interactablesBefore){
    interactablesBefore = interactablesAfter;
    allEntityArray = document.querySelectorAll("[gltf-model-plus][networked], [media-video][networked], [media-image][networked], [media-pdf][networked]");

    // assignQuadsToEntity(allEntityArray);
    allEntityArray.forEach(assignQuadsToEntity);
    updateVisible(userCurrQuad, userPrevQuad);
  }
  
  //Check if user left the quadrant
  if(userPrevQuad != userCurrQuad){
    //Update visible assets
    updateVisible(userCurrQuad, userPrevQuad); 
    userPrevQuad = userCurrQuad;
  }   
  
  //Check if user left the strata
  if(userPrevStrata != userCurrStrata){ 
    userPrevStrata = userCurrStrata;
  }
}, 1000/80);

function assignQuadsToEntity(currEntity){

  //Calculate and assign corresponding "quad" class to each entity 
  
    let entityPos = currEntity.getAttribute('position');
    let entityAngle = calcAngle(ORIGIN_X, ORIGIN_Z, entityPos.x, entityPos.z);  
    let entityQuad = calcQuad(entityAngle);

    if( entityQuad === 1 ){
      currEntity.classList.remove("quad1", "quad2", "quad3", "quad4");
      currEntity.classList.add("quad1");      
      if(userCurrQuad != 1){
        currEntity.setAttribute("visible", false)
      }
    }
    else if( entityQuad === 2){
      currEntity.classList.remove("quad1", "quad2", "quad3", "quad4")
      currEntity.classList.add("quad2");
      if(userCurrQuad != 2){
        currEntity.setAttribute("visible", false)
      }
    }
    else if( entityQuad === 3){
      currEntity.classList.remove("quad1", "quad2", "quad3", "quad4")
      currEntity.classList.add("quad3");
      if(userCurrQuad != 3){
        currEntity.setAttribute("visible", false)
      }
    }
    else if( entityQuad === 4){
      currEntity.classList.remove("quad1", "quad2", "quad3", "quad4")
      currEntity.classList.add("quad4");
      if(userCurrQuad != 4){
        currEntity.setAttribute("visible", false)
      }
    }
    else{
      console.log("Could not determine quadrant");
    }

    //Reassign quadrant class if the object moved location
    currEntity.addEventListener('componentchanged', function (evt) {
      // console.log('Event name: ' + evt.detail.name);
      if (evt.detail.name === 'body-helper') {
        // console.log('Entity has moved from', evt.detail.oldData, 'to', evt.detail.newData, '!');
        assignQuadsToEntity(this);
      }
    });
    
    updateVisible(userCurrQuad, userPrevQuad); 
}

function determineUserQuad(){
  let playerPos = cameraEl.object3D.getWorldPosition();
 
  //Calculate user current angle and quadrant
  let currAngle = calcAngle(ORIGIN_X, ORIGIN_Z, playerPos.x, playerPos.z).toFixed(2);
  userCurrQuad = calcQuad(currAngle);

  //Calculate user current strata
  userCurrStrata = calcStrata(playerPos.y);

  // Update the user's HUD
  updateHUDText(playerPos, currAngle, userCurrQuad, userCurrStrata);
}

function updateHUDText(playerPos, currAngle, userCurrQuad, userStrata){
  posText.setAttribute('text', {value: "Position: " + playerPos.x.toFixed(2) + ", " + playerPos.y.toFixed(2) + ", " + playerPos.z.toFixed(2) + " "});
  angleText.setAttribute('text', {value: "Angle: " + currAngle});
  quadText.setAttribute('text', {value: "Quadrant: " + userCurrQuad});
  strataText.setAttribute('text', {value: "Strata: " + userStrata});
}

//Calculate user's angle respective to origin
function calcAngle(x1, z1, x2, z2) {
    var result = Math.atan2(z1 - z2, x2 - x1) * (180 / Math.PI);
    return result > 0 ? result : 360 + result;
}

//Calculate the visited strata
function calcStrata(userHeight){
  let resultStrata = null;

  if(userHeight > 0 && userHeight <= 2.5){
    resultStrata = 0;
  }
  else if(userHeight > 2.5 && userHeight <= 5.0){
    resultStrata = 1;
  }
  else if(userHeight > 5.0 && userHeight <= 7.5){
    resultStrata = 2;
  }
  else if(userHeight > 7.5 && userHeight <= 10.0){
    resultStrata = 3;
  }
  else{
    resultStrata = null;
  }  
  return resultStrata;
}

//Calculate the visited quadrant
function calcQuad(userAngle){
  let resultQuad = null;
  
  if(userAngle > 0 && userAngle <= 90){
    resultQuad = 1;
  }
  else if(userAngle > 90 && userAngle <= 180){
    resultQuad = 2;
  }
  else if(userAngle > 180 && userAngle <= 270){
    resultQuad = 3;
  }
  else if(userAngle > 270 && userAngle <= 360){
    resultQuad = 4;
  }
  else{
    resultQuad = null;
  }  
  return resultQuad;
}

//Activate assets in current quadrant and deactivate those in previous quad
function updateVisible(quadCurr, quadPrev){

    let quadCurrArray = document.querySelectorAll(`.quad${quadCurr}`);
    let quadPrevArray = document.querySelectorAll(`.quad${quadPrev}`);

    for(let i = 0; i < quadPrevArray.length; i++){
      quadPrevArray[i].setAttribute("visible", false);
    }

    for(let i = 0; i < quadCurrArray.length; i++){
      quadCurrArray[i].setAttribute("visible", true);     
    }    
}
  




