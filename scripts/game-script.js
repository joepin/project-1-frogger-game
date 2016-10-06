console.log('game-script.js linked!');

var gridSize = 17;
var $curPos = null;
var $mainContainer = null;
var genID = null;
var numTrucks = 0;
var gotOutCount = 0;
var allTrucks = {};

$(function() {
  console.log('jQuery works!');
  $(window).on('keydown', checkKey);
  genID = setInterval(generateTruck, 500);
  $mainContainer = $('.main-container').eq(0);
  // generateTruck();
});

function generateSprite(spriteType, spriteLength) {
  var sprite = new Sprite(spriteType);
  sprite.spriteLength = spriteLength;
  sprite.rightColNum = Math.floor((Math.random() * 14) + 3);
  sprite.leftColNum = sprite.rightColNum - sprite.spriteLength;
  console.log(sprite.leftColNum, sprite.rightColNum);
  sprite.cellNum = Math.floor((Math.random() * 6) + 10);
  getCellElems(sprite);
  return sprite;
}

function getCellElems(sprite) {
  // console.log(sprite.leftColNum, sprite.rightColNum, sprite.cellNum);
  var $allCells = $(('.cell-' + sprite.cellNum)).toArray();
  // console.log($allCells);
  // var $goodCells = [];
  for (var i = sprite.leftColNum; i < (sprite.rightColNum); i++){
    sprite.cellsTakenUp.push($allCells[i]);
    // console.log(('allCells ' + i + ': '), $allCells[i]);
  }
  // console.log(sprite.cellsTakenUp);
  // return ($(('.cell-' + this.cellNum + ':lt(' + (this.rightColNum) + '):gt(' + (this.leftColNum - 1) + ')'))).get();
}

function isValidPosition(sprite) {
  var spriteCells = sprite.cellsTakenUp;
  // console.log(spriteCells, spriteCells.length);
  for(var i = 0; i < spriteCells.length; i++) {
    // console.log(i + ': ' + spriteCells[i]);
    // console.log(spriteCells[i].dataset.isallowed);
    if (spriteCells[i].dataset.isallowed == 'no') {
      console.log('not allowed');
      return false;
    }
  }
  return true;
}

function generateTruck() {
  numTrucks++;
  if(numTrucks > 10) {
    clearInterval(genID);
    return;
  }
  var lengthOfTruck = 3;
  var thisTruck = generateSprite('truck', lengthOfTruck);
  var allGood = true;
  var count = 0;
  while (!isValidPosition(thisTruck) && allGood) {
    thisTruck = generateSprite('truck', lengthOfTruck);
    count++;
    if (count >= 5) {
      gotOutCount++;
      console.log('got out ' + gotOutCount + ' times');
      allGood = false;
    }
  }
  if (allGood) {
    for (var i = 0; i < thisTruck.cellsTakenUp.length; i++) {
      thisTruck.cellsTakenUp[i].dataset.isallowed = 'no';
      thisTruck.cellsTakenUp[i].style.backgroundColor = 'red';
    }
    allTrucks[('trucks' + numTrucks)] = thisTruck;
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

  function moveFrogger(nextCol, nextCell) {
    var nextColClass = '.column-' + nextCol;
    var nextCellClass = 'cell-' + nextCell;
    var $nextEl = $(nextColClass).children().eq(nextCell-1);
    if ($nextEl.data('isallowed') == 'no') {
      $mainContainer.css('border-color', 'red');
      $(window).off('keydown', checkKey);
      console.log('Can\'t go there! lives--');
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
