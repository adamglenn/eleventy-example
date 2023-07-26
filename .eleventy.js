const { EleventyRenderPlugin } = require("@11ty/eleventy");
const { Liquid } = require("liquidjs");
const yaml = require("js-yaml");
const Image = require("@11ty/eleventy-img");
const { eleventyImagePlugin } = require("@11ty/eleventy-img");
const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("stylesheets/styles.css");
  eleventyConfig.addPassthroughCopy("admin/config.yml");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("android-chrome-192x192.png");
  eleventyConfig.addPassthroughCopy("android-chrome-512x512.png");
  eleventyConfig.addPassthroughCopy("apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("favicon-16x16.png");
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

  eleventyConfig.addShortcode("thumbnailImage", async function(src, alt) {
		if(alt === undefined) {
			// You bet we throw an error on missing alt (alt="" works okay)
			throw new Error(`Missing \`alt\` on myImage from: ${src}`);
		}

		let metadata = await Image(src, {
			widths: [960],
			formats: ["webp"]
		});

		let data = metadata.webp[metadata.webp.length - 1];
		return `<img src="${data.url}" alt="${alt}" loading="lazy" decoding="async">`;
	});

  // Add within your config module
  const md = new markdownIt({
    html: true,
  });

  eleventyConfig.addFilter("markdown", (content) => {
    return md.render(content);
  });

  eleventyConfig.addShortcode("bgImage", async function(src, alt) {
		if(alt === undefined) {
			// You bet we throw an error on missing alt (alt="" works okay)
			throw new Error(`Missing \`alt\` on myImage from: ${src}`);
		}

		let metadata = await Image(src, {
			widths: [960, 1920],
			formats: ["webp", "jpeg"]
		});

		let data = metadata.webp[metadata.webp.length - 1];
		return `style="background-image:url('${data.url}');`;
	});

  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("img");

  return {
    htmlTemplateEngine: "liquid"
  }
};