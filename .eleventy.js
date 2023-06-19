const { EleventyRenderPlugin } = require("@11ty/eleventy");
const { Liquid } = require("liquidjs");
const yaml = require("js-yaml");

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

    return {
        htmlTemplateEngine: "liquid"
    }
};