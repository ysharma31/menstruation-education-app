const map = [
  ['ksh', 'क्ष'], ['gya', 'ज्ञ'], ['thr', 'थ्र'], ['shr', 'श्र'],
  ['ch', 'च'], ['sh', 'श'], ['th', 'थ'], ['ph', 'फ'], ['bh', 'भ'],
  ['gh', 'घ'], ['dh', 'ध'], ['kh', 'ख'], ['jh', 'झ'], ['nh', 'ञ'],
  ['ng', 'ङ'], ['ny', 'ञ'],
  ['aa', 'आ'], ['ee', 'ई'], ['ii', 'ई'], ['oo', 'ऊ'], ['uu', 'ऊ'],
  ['ai', 'ऐ'], ['au', 'औ'], ['ou', 'औ'],
  ['a', 'अ'], ['b', 'ब'], ['c', 'क'], ['d', 'द'], ['e', 'ए'],
  ['f', 'फ'], ['g', 'ग'], ['h', 'ह'], ['i', 'इ'], ['j', 'ज'],
  ['k', 'क'], ['l', 'ल'], ['m', 'म'], ['n', 'न'], ['o', 'ओ'],
  ['p', 'प'], ['q', 'क'], ['r', 'र'], ['s', 'स'], ['t', 'त'],
  ['u', 'उ'], ['v', 'व'], ['w', 'व'], ['x', 'क्स'], ['y', 'य'],
  ['z', 'ज'],
];

export function transliterateToDevanagari(text) {
  if (!text) return text;
  return text
    .split(' ')
    .map((word) => {
      let result = '';
      let i = 0;
      const lower = word.toLowerCase();
      while (i < lower.length) {
        let matched = false;
        for (const [latin, dev] of map) {
          if (lower.startsWith(latin, i)) {
            result += dev;
            i += latin.length;
            matched = true;
            break;
          }
        }
        if (!matched) {
          result += word[i];
          i++;
        }
      }
      return result;
    })
    .join(' ');
}
