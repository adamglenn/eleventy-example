const { EleventyRenderPlugin } = require("@11ty/eleventy");
const { Liquid } = require("liquidjs");
const yaml = require("js-yaml");
const Image = require("@11ty/eleventy-img");
const eleventyWebcPlugin = require("@11ty/eleventy-plugin-webc");
const { eleventyImagePlugin } = require("@11ty/eleventy-img");

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

    // WebC
	eleventyConfig.addPlugin(eleventyWebcPlugin, {
		components: [
			// …
			// Add as a global WebC component
			"npm:@11ty/eleventy-img/*.webc",
		]
	});

    // Image plugin
	eleventyConfig.addPlugin(eleventyImagePlugin, {
		// Set global default options
		formats: ["webp", "jpeg"],
		urlPath: "/uploads/",

		// Notably `outputDir` is resolved automatically
		// to the project output directory

		defaultAttributes: {
			loading: "lazy",
			decoding: "async"
		}
	});

    return {
        htmlTemplateEngine: "liquid"
    }
};

(async () => {
	let stats = await Image("…", {
		// Array of integers or "auto"
		widths: ["auto"],

		// Array of file format extensions or "auto"
		formats: ["webp", "jpeg"],

		// the URLs in markup are prefixed with this
		urlPath: "/assets/img/",

		// the images are written here
		outputDir: "./assets/img/",

		// skip raster formats if SVG available
		svgShortCircuit: false,

		// allow svg to upscale beyond supplied dimensions?
		svgAllowUpscale: true,

		// the file name hash length
		hashLength: 10,

		// Custom file name callback (see below)
		filenameFormat: function() {},

		// Advanced options passed to eleventy-fetch
		cacheOptions: {},

		// Advanced options passed to sharp
		sharpOptions: {},
		sharpWebpOptions: {},
		sharpPngOptions: {},
		sharpJpegOptions: {},
		sharpAvifOptions: {},

		// Custom full URLs (use with hosted services, see below)
		urlFormat: function() {},
	});
})();