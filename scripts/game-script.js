console.log('game-script.js linked!');

var totRan = 0;

$(function() {
  console.log('jQuery works!');
  getAllParameters();
  $(window).on('keydown', checkKey);
  for (var i = 0; i < maxTrucks; i++) {
    var newTruck = generateTruck('rand');
    numTrucks++;
    totRan++;
  }
  $mainContainer = $('.main-container').eq(0);
  $body = $('body');
  // generateTruck();
  moveTrucksID = setInterval(moveTrucks, 1000);
  checkTrucksID = setInterval(checkTrucks, 1000);
  setInterval(function(){
    var $frogger = $('#frogger');
    if ($frogger.attr('data-isallowed') == 'no') {
      console.log('true');
      doLoss();
    }
  }, 10);
});

function getAllParameters() {
  // get and parse the url
  var fullURL = window.location.href;
  if (!fullURL.includes('?')) {
    return;
  }
  var queryString = fullURL.split('?')[1];
  // split query string into an array of key-value pair strings
  var paramsAndVals = queryString.split('&');
  for (var i = 0; i < (paramsAndVals.length); i++) {
    var thisPair = paramsAndVals[i].split('=');
    console.log(thisPair[0] + ': ' + thisPair[1]);
  }
}

function moveTrucks() {
  for (var truck in allTrucks) {
    allTrucks[truck].move();
  }
}

function checkTrucks() {
      console.log('object size: ' + Object.keys(allTrucks).length);

  for (var truck in allTrucks) {
    if (allTrucks[truck].offBoard) {
      // console.log('OFFBOARD: ' + allTrucks[truck]);
      delete allTrucks[truck];
      numTrucks--;
    }
    if (Object.keys(allTrucks).length < (1.5 * maxTrucks)) {
      console.log('true totRan: ' + totRan);
      allTrucks[('trucks' + totRan)] = generateTruck('ordered');
      numTrucks++;
      totRan++;
    }
  }
}

function generateSprite(spriteType, randOrOrdered) {
  var typeObj = new spriteType(randOrOrdered);
  var sprite = new Sprite(typeObj);
  sprite.cellsTakenUp = sprite.getCellElems(sprite.type.cellNum, sprite.type.leftColNum, sprite.type.rightColNum);
  // console.log(sprite.cellsTakenUp);
  return sprite;
}


function isValidPosition(sprite) {
  var spriteCells = sprite.cellsTakenUp;
  for(var i = 0; i < spriteCells.length; i++) {
    if (spriteCells[i] && spriteCells[i].dataset.isallowed == 'no') {
      console.log('not allowed');
      return false;
    }
  }
  return true;
}

var gotOutCount = 0;
function generateTruck(randOrOrdered) {
  var thisTruck = generateSprite(Truck, randOrOrdered);
  var allGood = true;
  var count = 0;
  while (!isValidPosition(thisTruck) && allGood) {
    thisTruck = generateSprite(Truck, randOrOrdered);
    count++;
    if (count >= 5) {
      gotOutCount++;
      console.log('got out ' + gotOutCount + ' times');
      allGood = false;
    }
  }
  if (allGood) {
    // console.log(thisTruck);
    for (var i = 0; i < thisTruck.cellsTakenUp.length; i++) {
      if (thisTruck.cellsTakenUp[i]){
        thisTruck.cellsTakenUp[i].dataset.isallowed = 'no';
        thisTruck.cellsTakenUp[i].style.backgroundColor = 'red';
      }
    }
    allTrucks[('trucks' + numTrucks)] = thisTruck;
    return thisTruck;
  }
}

  function checkKey(e) {
    $curPos = $('#frogger');
    switch(e.key) {
      case 'ArrowRight':
        moveFroggerRight();
        break;
      case 'ArrowUp':
        moveFroggerUp();
        break;
      case 'ArrowLeft':
        moveFroggerLeft();
        break;
      case 'ArrowDown':
        moveFroggerDown();
        break;
      default:
        // console.log(e.key);
    }
  }

  function doLoss() {
    $mainContainer.css('border-color', 'white');
    $body.css('background', 'darkred');
    $(window).off('keydown', checkKey);
    console.log('Can\'t go there! lives--');
    clearInterval(moveTrucksID);
    $('#frogger').attr('id', '');
  }

  function moveFrogger(nextCol, nextCell) {
    var nextColClass = '.column-' + nextCol;
    var nextCellClass = 'cell-' + nextCell;
    var $nextEl = $(nextColClass).children().eq(nextCell-1);
    if ($nextEl.data('isallowed') == 'no') {
      doLoss();
      return;
    }
    $curPos.removeAttr('id');
    $nextEl.attr('id', 'frogger');
  }

  function getCurrentColumn() {
    return (parseInt($curPos.parent().attr('class').split('-')[1]));
  }

  function getCurrentCell() {
    return (parseInt($curPos.attr('class').split('-')[1]));
  }

  function moveFroggerRight() {
    var curCol = getCurrentColumn();;
    var curCell = getCurrentCell();
    if (curCol == gridSize) {
      return;
    }
    var nextCol = curCol + 1;
    var nextCell = curCell;
    moveFrogger(nextCol, nextCell);
  }

  function moveFroggerLeft() {
    var curCol = getCurrentColumn();;
    var curCell = getCurrentCell();
    if (curCol == 1) {
      return;
    }
    var nextCol = curCol - 1;
    var nextCell = curCell;
    moveFrogger(nextCol, nextCell);
  }

  function moveFroggerUp() {
    var curCol = getCurrentColumn();;
    var curCell = getCurrentCell();
    if (curCell == 1) {
      return;
    }
    var nextCol = curCol;
    var nextCell = curCell - 1;
    moveFrogger(nextCol, nextCell);
  }

  function moveFroggerDown() {
    var curCol = getCurrentColumn();;
    var curCell = getCurrentCell();
    if (curCell == gridSize) {
      return;
    }
    var nextCol = curCol;
    var nextCell = curCell + 1;
    moveFrogger(nextCol, nextCell);
  }

