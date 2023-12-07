type ColorDataFromBackendType = {
  color_question_data_id: number;
  first_color: string;
  second_color: string;
};

const hexToDeximalPairConvertor = (hexNumberPair: string[]) => {
  const acceptableValues = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
  ];

  if (hexNumberPair.length !== 2) {
    return 0;
  } else {
    const decimalValues = hexNumberPair.map((value, index) => {
      if (acceptableValues.includes(value)) {
        switch (value.toLocaleLowerCase()) {
          case "a":
            return 16 ** index * 10;
          case "b":
            return 16 ** index * 11;

          case "c":
            return 16 ** index * 12;

          case "d":
            return 16 ** index * 13;

          case "e":
            return 16 ** index * 14;

          case "f":
            return 16 ** index * 15;

          default:
            return 16 ** index * +value;
        }
      } else {
        return 0;
      }
    });

    return decimalValues[1] + decimalValues[0];
  }
};

export const hexColorToArrayConverter = (colorString: string) => {
  const splitColorString = colorString.split("");

  if (splitColorString.length === 7) {
    const colorDigitArray: number[] = [0, 0, 0];
    splitColorString.splice(0, 1);

    const firstColorDigitPair = splitColorString.slice(0, 2);
    colorDigitArray[0] = hexToDeximalPairConvertor(firstColorDigitPair);

    const secondColorDigitPair = splitColorString.slice(2, 4);
    colorDigitArray[1] = hexToDeximalPairConvertor(secondColorDigitPair);
    const thirdColorDigitPair = splitColorString.slice(4, 6);
    colorDigitArray[2] = hexToDeximalPairConvertor(thirdColorDigitPair);

    return colorDigitArray;
  } else {
    return [0, 0, 0];
  }
};

const colorChannelMixer = (
  colorChannelA: number,
  colorChannelB: number,
  amountToMix: number
) => {
  const channelA = colorChannelA * amountToMix;
  const channelB = colorChannelB * (1 - amountToMix);
  return channelA + channelB;
};
//rgbA and rgbB are arrays, amountToMix ranges from 0.0 to 1.0
//example (red): rgbA = [255,0,0]
const colorMixer = (rgbA: number[], rgbB: number[], amountToMix: number) => {
  const r = colorChannelMixer(rgbA[0], rgbB[0], amountToMix);
  const g = colorChannelMixer(rgbA[1], rgbB[1], amountToMix);
  const b = colorChannelMixer(rgbA[2], rgbB[2], amountToMix);

  return { r, g, b };
};

export const colorDataRefactor = (
  retrievedData: ColorDataFromBackendType[]
) => {
  const colorErrorWindow = 150;
  return retrievedData.map((dataEntry, index) => {
    console.log(dataEntry.first_color);
    const convertedColorOne = hexColorToArrayConverter(dataEntry.first_color);
    const convertedColorTwo = hexColorToArrayConverter(dataEntry.second_color);
    console.log(convertedColorOne);
    console.log(convertedColorTwo);
    const resultColor = colorMixer(convertedColorOne, convertedColorTwo, 0.5);
    const lowerResultColor = {
      r:
        resultColor.r - colorErrorWindow < 0
          ? 0
          : resultColor.r - colorErrorWindow,
      g:
        resultColor.g - colorErrorWindow < 0
          ? 0
          : resultColor.g - colorErrorWindow,
      b:
        resultColor.b - colorErrorWindow < 0
          ? 0
          : resultColor.b - colorErrorWindow,
    };
    const higherResultColor = {
      r:
        resultColor.r + colorErrorWindow > 255
          ? 255
          : resultColor.r + colorErrorWindow,
      g:
        resultColor.g + colorErrorWindow > 255
          ? 255
          : resultColor.g + colorErrorWindow,
      b:
        resultColor.b + colorErrorWindow > 255
          ? 255
          : resultColor.b + colorErrorWindow,
    };
    const seperatedFirstColorToMix = hexColorToArrayConverter(
      dataEntry.first_color
    );
    const seperatedSecondColorToMix = hexColorToArrayConverter(
      dataEntry.second_color
    );
    const convertedFirstColorToMix = `rgb(${seperatedFirstColorToMix[0]},${seperatedFirstColorToMix[1]},${seperatedFirstColorToMix[2]})`;
    const convertedSecondColorToMix = `rgb(${seperatedSecondColorToMix[0]},${seperatedSecondColorToMix[1]},${seperatedSecondColorToMix[2]})`;

    return {
      firstColor: convertedFirstColorToMix,
      secondColor: convertedSecondColorToMix,
      resultColor: `rgb(${resultColor.r},${resultColor.g},${resultColor.b})`,
      resultRangeStartColor: {
        r: lowerResultColor.r,
        g: lowerResultColor.g,
        b: lowerResultColor.b,
      },

      resultRangeEndColor: {
        r: higherResultColor.r,
        g: higherResultColor.g,
        b: higherResultColor.b,
      },

      questionType: "color",
      id: `color-question-${index}`,
    };
  });
};
