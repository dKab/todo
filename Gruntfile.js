/**
 * Created by dmitriy on 14.12.15.
 */
module.exports = function(grunt) {
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
                    baseUrl: "app/",
                    mainConfigFile: 'app/app.js',
                    name: "app",
                    paths: {
                        requireLib: '../bower_components/requirejs/require'
                    },
                    out: "dist/app-built.js",
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
                src: "app/*.js"
            }
        }

    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-strip-code');

    grunt.registerTask('mocha', function() {
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
        'strip_code',
        'requirejs'
    ]);
};