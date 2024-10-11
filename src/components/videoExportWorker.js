let canvas;
let context;
let isMobile = false;
let subtitle = '',
  captionStyle = {},
  showCaption = false;

// @description: wrapText wraps HTML canvas text onto a canvas of fixed width
// @param ctx - the context for the canvas we want to wrap text on
// @param text - the text we want to wrap.
// @param x - the X starting point of the text on the canvas.
// @param y - the Y starting point of the text on the canvas.
// @param maxWidth - the width at which we want line breaks to begin - i.e. the maximum width of the canvas.
// @param lineHeight - the height of each line, so we can space them below each other.
// @returns an array of [ lineText, x, y ] for all lines
const wrapText = function (ctx, text, x, y, maxWidth, lineHeight) {
  // First, start by splitting all of our text into words, but splitting it into an array split by spaces
  let words = text.split(' ');
  let line = ''; // This will store the text of the current line
  let testLine = ''; // This will store the text when we add a word, to test if it's too long
  let lineArray = []; // This is an array of lines, which the function will return

  // Lets iterate over each word
  for (var n = 0; n < words.length; n++) {
    // Create a test line, and measure it..
    testLine += `${words[n]} `;
    let metrics = ctx.measureText(testLine);
    let testWidth = metrics.width;
    // If the width of this test line is more than the max width
    if (testWidth > maxWidth && n > 0) {
      // Then the line is finished, push the current line into "lineArray"
      lineArray.push([line, x, y]);
      // Increase the line height, so a new line is started
      y += lineHeight;
      // Update line and test line to use this word as the first word on the next line
      line = `${words[n]} `;
      testLine = `${words[n]} `;
    } else {
      // If the test line is still less than the max width, then add the word to the current line
      line += `${words[n]} `;
    }
    // If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something
    if (n === words.length - 1) {
      lineArray.push([line, x, y]);
    }
  }
  // Return the line array
  return lineArray;
};

addEventListener('message', (event) => {
  if (event.data.offscreen) {
    canvas = event.data.offscreen;
    context = canvas.getContext('2d');
  } else if (event.data.isMobile) {
    if (event.data.isMobile === 'true') {
      isMobile = true;
    } else {
      isMobile = false;
    }
  } else if (event.data.subtitle) {
    subtitle = event.data.subtitle;
    captionStyle = event.data.captionStyle;
    showCaption = event.data.showCaption;
  } else if (event.data.imageBitmap && context) {
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    let maxSubtitleWidth = canvas.width;
    if (
      event.data.imageBitmap.height / event.data.imageBitmap.width <
      canvas.height / canvas.width
    ) {
      const width =
        (event.data.imageBitmap.height * canvas.width) / canvas.height;
      context.drawImage(
        event.data.imageBitmap,
        (event.data.imageBitmap.width - width) / 2,
        0,
        width,
        event.data.imageBitmap.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
    } else {
      if (isMobile) {
        const scaledWidth =
          (event.data.imageBitmap.width * canvas.height) /
          event.data.imageBitmap.height;
        context.drawImage(
          event.data.imageBitmap,
          0,
          0,
          event.data.imageBitmap.width,
          event.data.imageBitmap.height,
          (canvas.width - scaledWidth) / 2,
          0,
          scaledWidth,
          canvas.height
        );
      } else {
        const height =
          (event.data.imageBitmap.width * canvas.height) / canvas.width;
        context.drawImage(
          event.data.imageBitmap,
          0,
          (event.data.imageBitmap.height - height) / 2,
          event.data.imageBitmap.width,
          height,
          0,
          0,
          canvas.width,
          canvas.height
        );
      }
    }
    if (isMobile) {
      context.fillStyle = '#2D333FCC';
      const maskWidth = (canvas.width - (canvas.height * 9) / 16) / 2;
      context.fillRect(0, 0, maskWidth, canvas.height);
      context.fillRect(canvas.width - maskWidth, 0, maskWidth, canvas.height);

      maxSubtitleWidth = canvas.width - maskWidth * 2;
    }

    // if (showCaption) {
    //   context.font = `${captionStyle.italic ? 'italic' : ''} ${
    //     captionStyle.fontWeight
    //   } ${captionStyle.fontSize} "${captionStyle.font}"`.trim();
    //   context.textAlign = captionStyle.textAlign; // start, end, left, right or center

    //   // context.font = '100px serif';
    //   // context.textAlign = 'left'; // start, end, left, right or center
    //   context.fillStyle = 'white';
    //   context.textBaseline = 'bottom';
    //   const wrappedText = wrapText(
    //     context,
    //     subtitle,
    //     0,
    //     0,
    //     maxSubtitleWidth,
    //     parseFloat(captionStyle.fontSize) * 1.2
    //   );
    //   let baseX = 0,
    //     baseY = canvas.height;
    //   switch (captionStyle.textAlign) {
    //     case 'left':
    //       baseX = (canvas.width - maxSubtitleWidth) / 2;
    //       break;
    //     case 'right':
    //       baseX = (canvas.width + maxSubtitleWidth) / 2;
    //       break;
    //     case 'center':
    //       baseX = canvas.width / 2;
    //       break;
    //   }
    //   baseY -= wrappedText[wrappedText.length - 1][2];
    //   for (let i = 0; i < wrappedText.length; i++) {
    //     context.fillText(
    //       wrappedText[i][0],
    //       baseX + wrappedText[i][1],
    //       baseY + wrappedText[i][2]
    //     );
    //   }
    // }
  }
});
