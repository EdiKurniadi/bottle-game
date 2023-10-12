class KumpulanEmber {
  constructor(kapasitasEmber1, kapasitasEmber2, kapasitasEmber3) {
    this.kapasitasEmber = [kapasitasEmber1, kapasitasEmber2, kapasitasEmber3]
    this.volumeEmber = [0,0,0]
  }


  isiPenuhEmber(indexEmber) {
      if(this.volumeEmber[indexEmber] === this.kapasitasEmber[indexEmber]) return false;
      this.volumeEmber[indexEmber] = this.kapasitasEmber[indexEmber];
      return true;
  }

  buangIsiEmber(indexEmber) {
      if(this.volumeEmber[indexEmber] === 0) return false;
      this.volumeEmber[indexEmber] = 0;
      return true;
    }

  pindahkanIsiEmber(dariIndexEmber, keIndexEmber) {
      if(this.volumeEmber[keIndexEmber] === this.kapasitasEmber[keIndexEmber]) return false;
      if(this.volumeEmber[dariIndexEmber] === 0) return false;
      if(this.volumeEmber[keIndexEmber] + this.volumeEmber[dariIndexEmber] > this.kapasitasEmber[keIndexEmber]) {
        this.volumeEmber[dariIndexEmber] = this.volumeEmber[dariIndexEmber] - (this.kapasitasEmber[keIndexEmber]-this.volumeEmber[keIndexEmber]) 
        this.volumeEmber[keIndexEmber] = this.kapasitasEmber[keIndexEmber];
      }
      if(this.volumeEmber[keIndexEmber] + this.volumeEmber[dariIndexEmber] <= this.kapasitasEmber[keIndexEmber]) {
        this.volumeEmber[keIndexEmber] += this.volumeEmber[dariIndexEmber];
        this.volumeEmber[dariIndexEmber] = 0;
      }
      return true;
    }

  getKeadaanEmber() {
    return {"A" : this.volumeEmber[0], "B" : this.volumeEmber[1], "C" : this.volumeEmber[2]}
  }

  getState() {
    return this.volumeEmber[0]+'-'+this.volumeEmber[1]+'-'+this.volumeEmber[2]
  }

  setKeadaanEmber(state) {
    this.volumeEmber[0] = state["A"]
    this.volumeEmber[1] = state["B"]
    this.volumeEmber[2] = state["C"]
  }

}

class TreeSpace {
  constructor(state, operator = "i") {
    this.state = state;
    this.operator = operator;
    this.children = [];
  }

  addChild(state, operator = "") {
    const newChild = new TreeSpace(state, operator);
    this.children.push(newChild);
  }

  getLevel() {
    return this.operator.split("-").length - 1;
  }

  getState() {
    return this.state["A"]+'-'+this.state["B"]+'-'+this.state["C"]
  }


}

class Level{
  constructor(a,b,c){
    this.space = new KumpulanEmber(a,b,c);
    this.operators = [
                  () => {return this.space.isiPenuhEmber(0)}, //0
                  () => {return this.space.isiPenuhEmber(1)}, //1
                  () => {return this.space.isiPenuhEmber(2)}, //2 
                  () => {return this.space.buangIsiEmber(0)}, //3
                  () => {return this.space.buangIsiEmber(1)}, //4
                  () => {return this.space.buangIsiEmber(2)}, //5
                  () => {return this.space.pindahkanIsiEmber(0,1)}, //6
                  () => {return this.space.pindahkanIsiEmber(1,0)}, //7
                  () => {return this.space.pindahkanIsiEmber(0,2)}, //8
                  () => {return this.space.pindahkanIsiEmber(2,0)}, //9
                  () => {return this.space.pindahkanIsiEmber(1,2)}, //10
                  () => {return this.space.pindahkanIsiEmber(2,1)}, //11   
                ];
    this.queueStateSpace = [];
    this.stateHasBeenVisited = [];
    this.treeSpace;
    this.initStateSpace = {
                            "A" : 0,
                            "B" : 0,
                            "C" : 0,
                          }
  }

  BFS() {
    this.treeSpace = new TreeSpace(this.initStateSpace);
    let treeNode = this.treeSpace;
    this.queueStateSpace.push(treeNode);
    this.stateHasBeenVisited.push(treeNode.getState())
    while(true) {
      this.space.setKeadaanEmber(treeNode.state)
      for(let i = 0 ; i < this.operators.length; i++) {
        if(this.operators[i]()) {
            if(!this.stateHasBeenVisited.includes(this.space.getState())) {
              this.stateHasBeenVisited.push(this.space.getState())
              treeNode.addChild(this.space.getKeadaanEmber(), treeNode.operator + '-' + i.toString());
              this.queueStateSpace.push(treeNode.children[treeNode.children.length-1]);
            }
            this.space.setKeadaanEmber(this.queueStateSpace[0].state);
          }
        }
      this.queueStateSpace.shift();
      if(this.queueStateSpace.length === 0) return "sudah capai semuanya";
      treeNode = this.queueStateSpace[0];
    }
  }

  getSortedStateAtLevel(level) {
    let currentNode;
    let stack = [this.treeSpace];
    let levelArray = [];
    while(stack.length > 0) {
      currentNode = stack[stack.length-1];
      if(currentNode.getLevel() === level) {
        levelArray.push({state:currentNode.getState(), solution:currentNode.operator});
        stack.pop();
      } else {
        stack.pop();
        stack = stack.concat(currentNode.children);
      }
    }
    return levelArray;
  }

  getAllLevel() {
    this.BFS();
    let i = 0;
    let index;
    let allLevel = [];
    while(this.getSortedStateAtLevel(i).length !== 0) {
      index = Math.floor(Math.random() * this.getSortedStateAtLevel(i).length);
      allLevel.push(this.getSortedStateAtLevel(i)[index]);
      i++;
    }
    return allLevel
  }
}


// let level = new Level(7,11,11);
// level.BFS();
// console.log(level.getSortedStateAtLevel(20))