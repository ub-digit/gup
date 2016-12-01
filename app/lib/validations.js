var validYearRe = /\d{4}/;
export function validYear(year) {
  //TODO: Check if string, auto-cast to string, or will .test do that?
  return validYearRe.test(year);
}
