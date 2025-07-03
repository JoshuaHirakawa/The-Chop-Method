export function bpmDivisions(bpm) {
  // edge case requiring bpm to be greater than 0 and less than 251
  if (bpm <= 0 || bpm > 250)
    throw new Error('Bpm must be an integer between 1 and 250');

  // ? defined bar length by dividing 60 by bpm and mulitplying by 4
  const bar = (60 / bpm) * 4;

  // ? create an object that will hold different beat divisions for given bpm
  const divisions = {
    '1/1': bar,
    '1/2': bar / 2,
    '1/4': bar / 4,
    '1/8': bar / 8,
    '1/16': bar / 16,
    '1/32': bar / 32,
    '1/2 dotted': (bar / 2) * 1.5,
    '1/4 dotted': (bar / 4) * 1.5,
    '1/8 dotted': (bar / 8) * 1.5,
    '1/16 dotted': (bar / 16) * 1.5,
    '1/1 triplet': bar / 3,
    '1/2 triplet': bar / 2 / 3,
    '1/4 triplet': bar / 4 / 3,
    '1/8 triplet': bar / 8 / 3,
    '1/16 triplet': bar / 16 / 3,
  };

  return divisions;
}
