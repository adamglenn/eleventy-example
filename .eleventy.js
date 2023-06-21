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
	let url = "https://images.unsplash.com/photo-1608178398319-48f814d0750c";
	let stats = await Image(url, {
		widths: [300]
	});

	console.log( stats );
})();