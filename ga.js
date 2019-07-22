class Ga {
  getFintnis(list) {
    console.log("next gen");
    list;
    this.prob = [];
    let sum = 0;
    for (let i = 0; i < list.length; i++) {
      sum += list[i];
    }
    if (sum != 0) {
      for (let i = 0; i < list.length; i++) {
        this.prob[i] = list[i] / sum;
      }
    }
    let record = 0;
    let index = 0;
    for (let i = 0; i < list.length; i++) {
      let versuch = this.prob[i];
      if (versuch > record) {
        record = versuch;
        index = i;
      }
    }
    return index;
  }
  pickOne() {
    let index = 0;
    let r = random(1);

    while (r > 0) {
      r = r - this.prob[index];
      index++;
    }
    index--;
    return index;
  }
  nextgen() {}
}
