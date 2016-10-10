console.log('game-script.js linked!');
$(function() {
  console.log('jQuery works!');
  getAllParameters();
  // timerID = setInterval(function() {
  //   // console.log(++timer);
  // }, 1000);
  $(window).on('keydown', checkKey);
  playGame();
  $mainContainer = $('.main-container').eq(0);
  $body = $('body').eq(0);
});

function playGame() {
  for (var i = 0; i < maxTrucks; i++) {
    var newTruck = generateTruck('rand');
    numTrucks++;
  }

  for (var i = 0; i < maxLogs; i++) {
    var newLog = generateLog('rand');
    numLogs++;
  }


  moveTrucksID = setInterval(moveTrucks, 1000);
  checkTrucksID = setInterval(checkTrucks, 1000);
  moveLogsID = setInterval(moveLogs, 1000);
  checkLogsID = setInterval(checkLogs, 1000);


  checkFroggerID = setInterval(function(){
    var $frogger = $('#frogger');
    if ($frogger.attr('data-isallowed') == 'no') {
      doLoss();
    }
    if ($frogger.attr('class').includes('finish')){
      doWin();
    }
  }, 10);
}

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
  for (var i = 0; i < allTrucks.length; i++) {
    allTrucks[i].move();
  }
}

function checkTrucks() {
  for (var i = 0; i < allTrucks.length; i++) {
    if (allTrucks[i].offBoard) {
      // console.log('deleting', allTrucks[i])
      allTrucks.splice(i, 1);
      numTrucks--;
    }
  }
  for (var i = numTrucks; i < maxTrucks; i++) {
    generateTruck('ordered');
    numTrucks++;
  }
}

function moveLogs() {
  for (var i = 0; i < allLogs.length; i++) {
    allLogs[i].move();
  }
}

function checkLogs() {
  for (var i = 0; i < allLogs.length; i++) {
    if (allLogs[i].offBoard) {
      // console.log('deleting', allLogs[i])
      allLogs.splice(i, 1);
      numLogs--;
    }
  }
  for (var i = numLogs; i < 1.5 * maxLogs; i++) {
    generateLog('ordered');
    numLogs++;
  }
}

function generateSprite(spriteType, randOrOrdered) {
  var typeObj = new spriteType(randOrOrdered);
  var sprite = new Sprite(typeObj);
  sprite.type.parent = sprite;
  sprite.offBoard = sprite.isOffBoard();
  return sprite;
}


function isValidPosition(sprite, allSprites) {
  var notAllowedRange = sprite.type.spriteLength + 1;
  for (var key in allSprites) {
    var diff = Math.abs(sprite.type.rightColNum - allSprites[key].type.rightColNum);
    if (diff < notAllowedRange  && sprite.type.cellNum == allSprites[key].type.cellNum) {
      // console.log(sprite, allSprites[key], diff);
      return false;
    }
  }
  return true;
}

// var gotOutCount = 0;
function generateTruck(randOrOrdered) {
  var thisTruck = generateSprite(Truck, randOrOrdered);
  var allGood = true;
  var count = 0;
  while (!isValidPosition(thisTruck, allTrucks) && allGood) {
    thisTruck = generateSprite(Truck, randOrOrdered);
    count++;
    if (count >= 5) {
      // gotOutCount++;
      // console.log('got out ' + gotOutCount + ' times');
      allGood = false;
      return null;
    }
  }
  if (allGood) {
    // console.log(thisTruck);
    for (var i = 0; i < thisTruck.cellsTakenUp.length; i++) {
      if (thisTruck.cellsTakenUp[i]){
        thisTruck.cellsTakenUp[i].dataset.isallowed = thisTruck.type.canHoldFrogger;
        var curClass = thisTruck.cellsTakenUp[i].getAttribute('class');
        thisTruck.cellsTakenUp[i].setAttribute('class', (curClass + ' ' + thisTruck.type.typeClass));
        // thisTruck.cellsTakenUp[i].setAttribute('class', (curClass + ' ' + thisTruck.type.typeClass + '-' + i));
      }
    }
    allTrucks.push(thisTruck);
    return thisTruck;
  }
}

// var gotOutCount = 0;
function generateLog(randOrOrdered) {
  var thisLog = generateSprite(Log, randOrOrdered);
  var allGood = true;
  var count = 0;
  while (!isValidPosition(thisLog, allLogs) && allGood) {
    thisLog = generateSprite(Log, randOrOrdered);
    count++;
    if (count >= 5) {
      // gotOutCount++;
      // console.log('got out ' + gotOutCount + ' times');
      allGood = false;
      return null;
    }
  }
  if (allGood) {
    // console.log(thisLog);
    for (var i = 0; i < thisLog.cellsTakenUp.length; i++) {
      if (thisLog.cellsTakenUp[i]){
        thisLog.cellsTakenUp[i].dataset.isallowed = thisLog.type.canHoldFrogger;
        var curClass = thisLog.cellsTakenUp[i].getAttribute('class');
        thisLog.cellsTakenUp[i].setAttribute('class', (curClass + ' ' + thisLog.type.typeClass));
        // thisLog.cellsTakenUp[i].setAttribute('class', (curClass + ' ' + thisLog.type.typeClass + '-' + i));
      }
    }
    allLogs.push(thisLog);
    return thisLog;
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
      case '1':
        clearInterval(moveTrucksID);
        clearInterval(checkTrucksID);
        clearInterval(timerID);
        break;
      case '2':
        clearInterval(moveLogsID);
        clearInterval(checkLogsID);
        clearInterval(timerID);
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
    clearInterval(moveLogsID);
    clearInterval(checkFroggerID);
    $('#frogger').attr('id', '');
  }

  function doWin() {
    console.log('Win!');
    $('#frogger').attr('id', '');
    $('.start').eq(0).attr('id', 'frogger');
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

