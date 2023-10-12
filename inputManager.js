class InputManager {
  constructor(game, gameRender) {
    this.game = game;
    this.gameRender = gameRender;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.gameRender.canvas.addEventListener("click", (event) => {
      if(!this.gameRender.animateState) {
        if(this.isClickInsideGlass(0, event)) {
           this.game.selectedGlass === 0 ? this.game.unselectGlass() : this.game.selectGlass(0);
        };

        if(this.isClickInsideGlass(1, event)) {
           this.game.selectedGlass === 1 ? this.game.unselectGlass() : this.game.selectGlass(1);
        };

        if(this.isClickInsideGlass(2, event)) {
           this.game.selectedGlass === 2 ? this.game.unselectGlass() : this.game.selectGlass(2);
        };        
      };

      if(this.game.selectedGlass > -1 && !this.gameRender.animateState) {
        if(this.isClickTempButtons(0, event)) {
          this.game.fill();
          this.game.unselectGlass();
        }

        if(this.isClickTempButtons(1, event)) {
          this.game.clear();
          this.game.unselectGlass();
        }

        if(this.isClickTempButtons(2, event)) {
          let IndexUnselectedGlass = this.game.getIndexUnselectedGlasses()[0];
          this.game.transfer(IndexUnselectedGlass);
          this.game.unselectGlass();
        }

        if(this.isClickTempButtons(3, event)) {
          let IndexUnselectedGlass = this.game.getIndexUnselectedGlasses()[1];
          this.game.transfer(IndexUnselectedGlass);
          this.game.unselectGlass();
        }
        
      }

      if(this.isClickUndoButton(event)) {
        this.game.undo();
        this.gameRender.animateState = false;
      }

    });
  }

  isClickInsideGlass(glassIndex, event) {
    if( 
      event.clientX > this.game.glasses[glassIndex].position.x && 
      event.clientY > this.game.glasses[glassIndex].position.y &&
      event.clientX < this.game.glasses[glassIndex].position.x + this.game.glasses[glassIndex].width &&
      event.clientY < this.game.glasses[glassIndex].position.y + this.game.glasses[glassIndex].height
      ) return true;
    return false;
  }

  isClickTempButtons(tempButtonIndex, event) {
   if( 
      event.clientX > this.gameRender.getTempButtonsPos(this.game.selectedGlass)[tempButtonIndex].x && 
      event.clientY > this.gameRender.getTempButtonsPos(this.game.selectedGlass)[tempButtonIndex].y &&
      event.clientX < this.gameRender.getTempButtonsPos(this.game.selectedGlass)[tempButtonIndex].x + this.gameRender.tempButtonSize.width &&
      event.clientY < this.gameRender.getTempButtonsPos(this.game.selectedGlass)[tempButtonIndex].y + this.gameRender.tempButtonSize.height
      ) return true;
    return false;
  }

  isClickUndoButton(event) {
    if( 
      event.clientX > this.gameRender.undoButtonPos.x && 
      event.clientY > this.gameRender.undoButtonPos.y &&
      event.clientX < this.gameRender.undoButtonPos.x + this.gameRender.undoButtonSize.width &&
      event.clientY < this.gameRender.undoButtonPos.y + this.gameRender.undoButtonSize.height
      ) return true;
    return false;
  }
}

let input = new InputManager(game, gameRender);