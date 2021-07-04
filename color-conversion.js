function parseHSL(hslString) {
  let sep = hslString.indexOf(",") > -1 ? "," : " ";
  hslString = hslString.substr(4).split(")")[0].split(sep);

  const h = +hslString[0];
  const s = +hslString[1].substr(0, hslString[1].length - 1);
  const l = +hslString[2].substr(0, hslString[2].length - 1);

  return [h, s, l];
}
