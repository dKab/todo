/**
 * Created by dmitriy on 14.12.15.
 */
module.exports = function (grunt) {
    grunt.initConfig({
        mocha: {
            reporter: 'dot',
            timeout: '90000', // in ms
            url: 'http://localhost:8080/test'
        },

        shell: {
            mocha: {
                command: 'node ./node_modules/mocha-phantomjs/bin/mocha-phantomjs ' +
                '-R <%= mocha.reporter %> ' +
                '-t <%= mocha.timeout %> ' +
                '<%= mocha.url %>',
                options: {
                    failOnError: true,
                    stdout: true
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    optimize: "none",
                    baseUrl: "app/",
                    mainConfigFile: 'app/app.js',
                    name: "app",
                    paths: {
                        requireLib: '../bower_components/requirejs/require'
                    },
                    out: "dist/concatenated-temp.js",
                    include: ["requireLib"]
                }
            }
        },
        strip_code: {
            options: {
                start_comment: "test-code",
                end_comment: "end-test-code"
            },
            your_target: {
                // a list of files you want to strip code from
                src: "dist/concatenated-temp.js"
            }
        },
        uglify: {
            my_target: {
                files: {
                    'dist/app-built.min.js': ["dist/concatenated-temp.js"]
                }
            }
        },
        clean: {
            dist: ['dist'],
            temp: ["dist/concatenated-temp.js"],
            afterbuild: ['.tmp']
        },
        useminPrepare: {
            html: 'index.html',
            options: {
                dest: 'dist/'
            }
        },
        usemin: {
            html: 'dist/index.html'
        },
        copy: {
            dist: { // in preparation for usemin
                files: [
                    {src: 'index.html', dest: 'dist/'}
                ]
            }
        },
        processhtml: {
            dist: {
                files: {
                    'dist/index1.html': ['dist/index.html']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-strip-code');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-usemin');

    // this task is used to copy index.html into dist/ folder so we can perform usemin on it
    // (usemin replaces references to scripts and links in the file it's operating on - it doesn't create new file)
    grunt.loadNpmTasks('grunt-contrib-copy');

    //these two tasks are used by grunt-usemin. Config blocks for them are generated on the fly and they get names 'generated'
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.loadNpmTasks('grunt-processhtml');

    grunt.registerTask('mocha', function () {
        if (grunt.option('reporter')) {
            grunt.config('mocha.reporter', grunt.option('reporter'));
        }

        if (grunt.option('timeout')) {
            grunt.config('mocha.timeout', grunt.option('timeout'));
        }

        if (grunt.option('url')) {
            grunt.config('mocha.url', grunt.option('url'));
        }

        grunt.task.run('shell:mocha');
    });

    grunt.registerTask('build', [
        'clean:dist', // removing everything from dist folder
        'requirejs', // assembling amd modules in one file and placing it in dist folder
        'strip_code', // stripping test code from the file generated in previous task
        'uglify',    // minifying the file creating minified version
        'clean:temp', //removing non-minified file
        'useminPrepare', //parsing index.html file and generating configs for concat and cssmin tasks
        'copy:dist', //copying index.html into dist/ folder
        'concat:generated', //concatenating css files
        'cssmin:generated', //minifying css files
        'usemin', //replacing scripts and styles in dist/index.html to optimized minified versions
        'processhtml',
        'clean:afterbuild'
    ]);
};