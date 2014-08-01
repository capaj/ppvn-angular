module.exports = function(grunt) {
    var env = grunt.option('env') || 'dev';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('bower.json'),
        connect: {
            dev: {
                options: {
                    port: 10001,
                    livereload: 10002,
                    keepalive: true
                }
            }
        },
        uglify: {
            options: {
                banner: '//<%= pkg.name %> version <%= pkg.version %> \n'
            },
            build: {
                src: './dist/<%= pkg.name %>.annotated.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        less: {
			development: {
				files: {
					'./dist/ppvn-angular.css': "./less/ppvn-angular.less"
				}
			}
        },
        ngAnnotate: {
            app: {
                src: './dist/<%= pkg.name %>.js',
                dest: './dist/<%= pkg.name %>.annotated.js'
            }
        },
        watch: {
            options: {
                livereload: 10002
            },
            files: ['./**/*.html', './**/*.css'],
            JSSources: {
                files: './js/**.js',
                tasks: []
            },
            less: {
                files: './less/**/*.less',
                tasks: ['less']
            }

        },
        concat: {
            options: {
                banner: '//<%= pkg.name %> version <%= pkg.version %> \n'
            },
            dist: {
                src: ['./src/module.js', './src/*.js'],
                dest: './dist/<%= pkg.name %>.js'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-karma');

    // Default task(s).
	grunt.registerTask('dev', ['connect', 'watch']);
	grunt.registerTask('default', ['less', 'concat', 'ngAnnotate', 'uglify']);


};