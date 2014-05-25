module.exports = function(grunt) {
    var env = grunt.option('env') || 'dev';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            dev: {
                options: {
                    port: 9001,
                    livereload: 9002,
                    keepalive: true
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        less: {
            src: '',
            dest: './css/ppvn-angular'
        },
        ngAnnotate: {
            app: {
                src: '',
                dest: ''
            }
        },
        watch: {
            options: {
                livereload: 9002
            },
            files: ['./**/*.html', './**/*.css'],
            JSSources: {
                files: './js/**.js',
                tasks: []
            },
            less: {
                files: 'public/less/**/*.less',
                tasks: ['less' + env]
            }

        }

    });


    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    if (env === 'dev') {
        grunt.registerTask('default', ['connect', 'watch']);
    } else {
        grunt.registerTask('default', ['less']);
    }

};