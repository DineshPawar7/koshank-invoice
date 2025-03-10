const incrementString = (string) => {
  // Convert pass args to string
  const str = string.toString();
  // Extract string's number
  let number = str.match(/\d+/) === null ? 0 : str.match(/\d+/)[0];

  const numberLength = number.length;

  number = (parseInt(number) + 1).toString();

  while (number.length < numberLength) {
    number = '0' + number;
  }

  return str.replace(/[0-9]/g, '').concat(number);
};

export default incrementString;
