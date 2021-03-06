const path = require("path");
const fs = require("fs");
const del = require("del");
const { src, dest, series, parallel } = require("gulp");
const spawn = require("child_process").spawnSync;
const glob = require("glob");

const paths = {
    node_modules: "./node_modules",
    plugin_dirs: [
        "../config/plugins/{visualizations,interactive_environments}/*/static/**/*",
        "../config/plugins/{visualizations,interactive_environments}/*/*/static/**/*"
    ],
    /*
     * We'll want a flexible glob down the road, but for now there are no
     * un-built visualizations in the repository; for performance and
     * simplicity just add them one at a time until we upgrade older viz's.
     */
    //plugin_build_dirs: [
    //    "../config/plugins/{visualizations,interactive_environments}/*/package.json",
    //    "../config/plugins/{visualizations,interactive_environments}/*/*/package.json"
    //],
    plugin_build_dirs: [
        "../config/plugins/visualizations/{annotate_image,openlayers}/package.json",
    ],
    lib_locs: {
        // This is a stepping stone towards having all this staged
        // automatically.  Eventually, this dictionary and staging step will
        // not be necessary.
        backbone: ["backbone.js", "backbone.js"],
        "bootstrap-tour": ["build/js/bootstrap-tour.js", "bootstrap-tour.js"],
        "bibtex-parse-js": ["bibtexParse.js", "bibtexParse.js"],
        jquery: ["dist/jquery.js", "jquery/jquery.js"],
        "jquery.complexify": ["jquery.complexify.js", "jquery/jquery.complexify.js"],
        "jquery.cookie": ["jquery.cookie.js", "jquery/jquery.cookie.js"],
        "jquery-migrate": ["dist/jquery-migrate.js", "jquery/jquery.migrate.js"],
        "jquery-mousewheel": ["jquery.mousewheel.js", "jquery/jquery.mousewheel.js"],
        "raven-js": ["dist/raven.js", "raven.js"],
        requirejs: ["require.js", "require.js"],
        underscore: ["underscore.js", "underscore.js"]
    },
    libs: ["galaxy/scripts/libs/**/*.js"]
};

function stageLibs(callback) {
    Object.keys(paths.lib_locs).forEach(lib => {
        var p1 = path.resolve(path.join(paths.node_modules, lib, paths.lib_locs[lib][0]));
        var p2 = path.resolve(path.join("galaxy", "scripts", "libs", paths.lib_locs[lib][1]));
        if (fs.existsSync(p1)) {
            del.sync(p2);
            fs.createReadStream(p1).pipe(fs.createWriteStream(p2));
        } else {
            callback(
                p1 +
                    " does not exist, yet it is a required library.  This is an error.  Check that the package in question exists in node_modules."
            );
        }
    });
    return callback();
}

function fonts() {
    return src(path.resolve(path.join(paths.node_modules, "font-awesome/fonts/**/*"))).pipe(
        dest("../static/images/fonts")
    );
}

function stagePlugins() {
    return src(paths.plugin_dirs).pipe(dest("../static/plugins/"));
}

function buildPlugins(callback){
    /*
     * Walk plugin build glob and attempt to build anything with a package.json 
     * */
    paths.plugin_build_dirs.map( build_dir => {
        glob(build_dir, {}, (er, files) => {
            files.map( file => {
                const f = path.join(process.cwd(), file).slice(0, -12);
                console.log("Building ", f);
                spawn('yarn', [], { cwd: f, stdio: 'inherit' });
                spawn('yarn', ['build'], { cwd: f, stdio: 'inherit' });
            });
        });
    });
    return callback();
}

function cleanPlugins() {
    return del(["../static/plugins/{visualizations,interactive_environments}/*"], { force: true });
}

module.exports.fonts = fonts;
module.exports.stageLibs = stageLibs;
module.exports.cleanPlugins = cleanPlugins;
module.exports.buildPlugins = buildPlugins;
module.exports.plugins = series(cleanPlugins, buildPlugins, stagePlugins);
module.exports.default = parallel(stageLibs, fonts, module.exports.plugins);
