import { LexoRank } from '../src/index';

describe('LexoRank', () => {

  it('Min', () => {
    const minRank = LexoRank.min();
    expect(minRank.toString()).toEqual('0|000000:');
  });

  it('Between Min <-> Max', () => {
    const minRank = LexoRank.min();
    const maxRank = LexoRank.max();
    const between = minRank.between(maxRank);
    expect(between.toString()).toEqual('0|hzzzzz:');
    expect(minRank.compareTo(between)).toBeLessThan(0);
    expect(maxRank.compareTo(between)).toBeGreaterThan(0);
  });

  it('Between Min <-> GetNext', () => {
    const minRank = LexoRank.min();
    const nextRank = minRank.genNext();
    const between = minRank.between(nextRank);
    expect(between.toString()).toEqual('0|0i0000:');
    expect(minRank.compareTo(between)).toBeLessThan(0);
    expect(nextRank.compareTo(between)).toBeGreaterThan(0);
  });

  it('Between Max <-> GetPrev', () => {
    const maxRank = LexoRank.max();
    const prevRank = maxRank.genPrev();
    const between = maxRank.between(prevRank);
    expect(between.toString()).toEqual('0|yzzzzz:');
    expect(maxRank.compareTo(between)).toBeGreaterThan(0);
    expect(prevRank.compareTo(between)).toBeLessThan(0);
  });

  it('Max', () => {
    const maxRank = LexoRank.max();
    expect(maxRank.toString()).toEqual('0|zzzzzz:');
  });

  it.each([
    ['0', '1', '0|0i0000:'],
    ['1', '0', '0|0i0000:'],
    ['3', '5', '0|10000o:'],
    ['5', '3', '0|10000o:'],
    ['15', '30', '0|10004s:'],
    ['31', '32', '0|10006s:'],
    ['100', '200', '0|1000x4:'],
    ['200', '100', '0|1000x4:'],
  ])('MoveTo', (prevStep, nextStep, expected) => {
    let prevRank = LexoRank.min();
    const prevStepInt = +prevStep;
    for (let i = 0; i < prevStepInt; i++) {
      prevRank = prevRank.genNext();
    }

    let nextRank = LexoRank.min();
    const nextStepInt = +nextStep;
    for (let i = 0; i < nextStepInt; i++) {
      nextRank = nextRank.genNext();
    }

    const between = prevRank.between(nextRank);
    expect(between.toString()).toEqual(expected);
  });

  it('find the nearest power', () => {
    expect(LexoRank.binaryDepthToInsertRanks(1)).toEqual(1);
    expect(LexoRank.binaryDepthToInsertRanks(2)).toEqual(2);
    expect(LexoRank.binaryDepthToInsertRanks(3)).toEqual(2);
    expect(LexoRank.binaryDepthToInsertRanks(4)).toEqual(3);
    expect(LexoRank.binaryDepthToInsertRanks(5)).toEqual(3);
    expect(LexoRank.binaryDepthToInsertRanks(6)).toEqual(3);
    expect(LexoRank.binaryDepthToInsertRanks(7)).toEqual(3);
    expect(LexoRank.binaryDepthToInsertRanks(8)).toEqual(4);
    expect(LexoRank.binaryDepthToInsertRanks(15)).toEqual(4);
    expect(LexoRank.binaryDepthToInsertRanks(31)).toEqual(5);
    expect(LexoRank.binaryDepthToInsertRanks(63)).toEqual(6);
    expect(LexoRank.binaryDepthToInsertRanks(124)).toEqual(7);
    expect(LexoRank.binaryDepthToInsertRanks(127)).toEqual(7);
  });

  it('find the multipleBetween for 1 lexoRanks to generate', () => {
    const minRank = LexoRank.min();
    const maxRank = LexoRank.max();
    const lexoRanks: LexoRank[] = minRank.multipleBetween(maxRank, 1);
    expect(lexoRanks.length).toEqual(1);
    expect(lexoRanks[0].toString()).toEqual('0|hzzzzz:');
  });

  it('find the multipleBetween for 2 lexoRanks to generate', () => {
    const minRank = LexoRank.min();
    const maxRank = LexoRank.max();
    const lexoRanks: LexoRank[] = minRank.multipleBetween(maxRank, 2);
    expect(lexoRanks.length).toEqual(2);
    expect(lexoRanks[0].toString()).toEqual('0|8zzzzz:');
    expect(lexoRanks[1].toString()).toEqual('0|hzzzzz:');
    expect(checkSortedInAscendingOrder(lexoRanks)).toEqual(true);
  });

  it('find the multipleBetween for 2 lexoRanks when one lexoRank is long in length', () => {
    const maxRank = LexoRank.parse('0|i00006:zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzr');
    const minRank = LexoRank.parse('0|i00006:zzr');
    const lexoRanks: LexoRank[] = minRank.multipleBetween(maxRank, 2);
    expect(lexoRanks.length).toEqual(2);
    expect(lexoRanks[0].toString()).toEqual('0|i00006:zzt');
    expect(lexoRanks[1].toString()).toEqual('0|i00006:zzv');
    expect(checkSortedInAscendingOrder(lexoRanks)).toEqual(true);
  });

  it('find the multipleBetween for 3 lexoRanks to generate', () => {
    const minRank = LexoRank.min();
    const maxRank = LexoRank.max();
    const lexoRanks: LexoRank[] = minRank.multipleBetween(maxRank, 3);
    expect(lexoRanks.length).toEqual(3);
    expect(lexoRanks[0].toString()).toEqual('0|8zzzzz:');
    expect(lexoRanks[1].toString()).toEqual('0|hzzzzz:');
    expect(lexoRanks[2].toString()).toEqual('0|qzzzzz:');
    expect(checkSortedInAscendingOrder(lexoRanks)).toEqual(true);
  });

  it('find the multipleBetween for 4 lexoRanks to generate', () => {
    const minRank = LexoRank.min();
    const maxRank = LexoRank.max();
    const lexoRanks: LexoRank[] = minRank.multipleBetween(maxRank, 4);
    expect(lexoRanks.length).toEqual(4);
    expect(lexoRanks[0].toString()).toEqual('0|4hzzzz:');
    expect(lexoRanks[1].toString()).toEqual('0|8zzzzz:');
    expect(lexoRanks[2].toString()).toEqual('0|dhzzzz:');
    expect(lexoRanks[3].toString()).toEqual('0|hzzzzz:');
    expect(checkSortedInAscendingOrder(lexoRanks)).toEqual(true);
  });

  it('find the multipleBetween for 7 lexoRanks to generate', () => {
    const minRank = LexoRank.min();
    const maxRank = LexoRank.max();
    const lexoRanks: LexoRank[] = minRank.multipleBetween(maxRank, 7);
    expect(lexoRanks.length).toEqual(7);
    expect(lexoRanks[0].toString()).toEqual('0|4hzzzz:');
    expect(lexoRanks[1].toString()).toEqual('0|8zzzzz:');
    expect(lexoRanks[2].toString()).toEqual('0|dhzzzz:');
    expect(lexoRanks[3].toString()).toEqual('0|hzzzzz:');
    expect(lexoRanks[4].toString()).toEqual('0|mhzzzz:');
    expect(lexoRanks[5].toString()).toEqual('0|qzzzzz:');
    expect(lexoRanks[6].toString()).toEqual('0|vhzzzz:');
    expect(checkSortedInAscendingOrder(lexoRanks)).toEqual(true);
  });

  it('find the multipleBetween for 8 lexoRanks when one lexoRank is long in length', () => {
    const maxRank = LexoRank.parse('0|i00006:zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzr');
    const minRank = LexoRank.parse('0|i00006:zzr');
    const lexoRanks: LexoRank[] = minRank.multipleBetween(maxRank, 8);
    expect(lexoRanks.length).toEqual(8);
    expect(lexoRanks[0].toString()).toEqual('0|i00006:zzri');
    expect(lexoRanks[1].toString()).toEqual('0|i00006:zzs');
    expect(lexoRanks[2].toString()).toEqual('0|i00006:zzsi');
    expect(lexoRanks[3].toString()).toEqual('0|i00006:zzt');
    expect(lexoRanks[4].toString()).toEqual('0|i00006:zzti');
    expect(lexoRanks[5].toString()).toEqual('0|i00006:zzu');
    expect(lexoRanks[6].toString()).toEqual('0|i00006:zzui');
    expect(lexoRanks[7].toString()).toEqual('0|i00006:zzv');
    expect(checkSortedInAscendingOrder(lexoRanks)).toEqual(true);
  });

  function checkSortedInAscendingOrder(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        return false;
      }
    }
    return true;
  }
});
