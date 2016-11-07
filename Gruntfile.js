// Grunt configuration

module.exports = function(grunt){
    'use strict';
    var packageName = 'bootstrap';
    var sourceRoot = 'bootstrap-src/';
    var finalDistributionFolder = 'public/bootstrap/css/';


    grunt.initConfig({
        less: {
            compileCore: {
                options: {
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: packageName + '.css.map',
                    sourceMapFilename: sourceRoot + 'dist/'+ packageName +'.css.map'
                },
                src: sourceRoot + '/less/bootstrap.less',
                dest: sourceRoot+'/dist/' + packageName + '.css'
            },
            compileTheme: {
                options: {
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: packageName + '-theme.css.map',
                    sourceMapFilename: sourceRoot + 'dist/'+ packageName + '-theme.css.map'
                },
                src: sourceRoot + 'less/theme.less',
                dest: sourceRoot + 'dist/' + packageName + '-theme.css'
            }
        },

        autoprefixer: {
            core: {
                options: {
                    map: true
                },
                src: sourceRoot + 'dist/' + packageName + '.css'
            },
            theme: {
                options: {
                    map: true
                },
                src: sourceRoot + 'dist/' + packageName + '-theme.css'
            }
        },

        cssmin: {
            options: {
                // TODO: disable `zeroUnits` optimization once clean-css 3.2 is released
                //    and then simplify the fix for https://github.com/twbs/bootstrap/issues/14837 accordingly
                compatibility: 'ie8',
                keepSpecialComments: '*',
                sourceMap: true,
                sourceMapInlineSources: true,
                advanced: false
            },
            minifyCore: {
                src: sourceRoot + 'dist/'+packageName+'.css',
                dest: finalDistributionFolder + packageName+'.min.css'
            },
            minifyTheme: {
                src: sourceRoot + 'dist/'+packageName+'-theme.css',
                dest: finalDistributionFolder + packageName+'-theme.min.css'
            }
        },

        csscomb: {
            options: {
                config: sourceRoot+'less/.csscomb.json'
            },
            dist: {
                expand: true,
                cwd: finalDistributionFolder,
                src: ['*.css', '!*.min.css'],
                dest: finalDistributionFolder
            }
        }
    });

    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
    require('time-grunt')(grunt);

    // CSS distribution task.
    grunt.registerTask('less-compile', ['less:compileCore', 'less:compileTheme']);
    grunt.registerTask('dist-css', ['less-compile', 'autoprefixer:core', 'autoprefixer:theme', 'csscomb:dist', 'cssmin:minifyCore', 'cssmin:minifyTheme']);
};