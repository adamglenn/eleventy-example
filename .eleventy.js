const { EleventyRenderPlugin } = require("@11ty/eleventy");
const { Liquid } = require("liquidjs");
const yaml = require("js-yaml");
const Image = require("@11ty/eleventy-img");
const eleventyWebcPlugin = require("@11ty/eleventy-plugin-webc");
const { eleventyImagePlugin } = require("@11ty/eleventy-img");

const stringifyAttributes = (attributeMap) => {
  return Object.entries(attributeMap)
  .map(([attribute, value]) => {
    if (typeof value === 'undefined') return '';
    return `${attribute}="${value}"`;
  })
  .join(' ');
};

const outdent = require('outdent');

const imageShortcode = async (
  src,
  alt,
  className = undefined,
  widths = [400, 800, 1280],
  formats = ['webp', 'jpeg'],
  sizes = '100vw'
) => {
  const imageMetadata = await Image(src, {
    widths: [...widths, null],
    formats: [...formats, null],
    outputDir: '_site/assets/img',
    urlPath: '/assets/img',
  });

  const sourceHtmlString = Object.values(imageMetadata)
  // Map each format to the source HTML markup
  .map((images) => {
    // The first entry is representative of all the others
    // since they each have the same shape
    const { sourceType } = images[0];

    // Use our util from earlier to make our lives easier
    const sourceAttributes = stringifyAttributes({
      type: sourceType,
      // srcset needs to be a comma-separated attribute
      srcset: images.map((image) => image.srcset).join(', '),
      sizes,
    });

    // Return one <source> per format
    return `<source ${sourceAttributes}>`;
  })
  .join('\n');

  const getLargestImage = (format) => {
    const images = imageMetadata[format];
    return images[images.length - 1];
  }

  const largestUnoptimizedImg = getLargestImage(formats[0]);
  
  const imgAttributes = stringifyAttributes({
    src: largestUnoptimizedImg.url,
    width: largestUnoptimizedImg.width,
    height: largestUnoptimizedImg.height,
    alt,
    loading: 'lazy',
    decoding: 'async',
  });
  
  const imgHtmlString = `<img ${imgAttributes}>`;

  const pictureAttributes = stringifyAttributes({
    class: className,
  });

  const picture = `<picture ${pictureAttributes}>
    ${sourceHtmlString}
    ${imgHtmlString}
  </picture>`;

  return outdent`${picture}`;
};

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("stylesheets/styles.css");
  eleventyConfig.addPassthroughCopy("admin/config.yml");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));

  let options = {
    extname: ".liquid",
    dynamicPartials: false,
    jsTruthy: true,
    strictFilters: false, // renamed from `strict_filters` in Eleventy 1.0
    root: ["_includes"]
  };

  eleventyConfig.setLibrary("liquid", new Liquid(options));

  eleventyConfig.addShortcode('image', imageShortcode);

  return {
    htmlTemplateEngine: "liquid"
  }
};