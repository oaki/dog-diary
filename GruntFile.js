module.exports = function (grunt)
{
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
        copy: {

            main:{
                files:[
                    {expand: true, cwd: 'bower_components/bootstrap/fonts/', src: ['**'], dest: 'src/fonts/'}
                ]
            }
        },
        karma: {
            unit: {
                options: {
                    configFile: 'karma.conf.js'
                }
            }
        },
		concat: {
			options: {
				separator: "\n\n"
			},
			dist: {
				src: ['src/resources/js/**/*.js', '!src/resources/js/**/*.tests.js'],
				dest: 'src/<%= pkg.name %>.js'
			},
			deps: {
				src: [
					'bower_components/modernizr/modernizr.js',
					'bower_components/jquery/dist/jquery.js',
					'bower_components/bootstrap/dist/js/bootstrap.js',
					'bower_components/angularjs/angular.min.js',
					'bower_components/angular-route/angular-route.min.js',
                    'bower_components/Chart.js/Chart.js',
					'bower_components/angular-chart.js/dist/angular-chart.min.js',

					'bower_components/lodash/lodash.js',
                    'bower_components/angular-google-maps/dist/angular-google-maps.js',
                    'bower_components/angularjs-geolocation/dist/angularjs-geolocation.min.js',
                    'bower_components/angular-loading-bar/build/loading-bar.js',
                    'bower_components/ng-file-upload/ng-file-upload-all.js',


                    'bower_components/moment/moment.js',
                    'bower_components/angular-bootstrap-datetimepicker/src/js/datetimepicker.js',

                    'bower_components/angular-translate/angular-translate.js',
                    'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
				],
				dest: 'src/<%= pkg.name %>-deps.js'
			},
			css: {
				src: [
                    'bower_components/bootstrap/dist/css/bootstrap.min.css',
                    'bower_components/angular-chart.js/dist/dist/angular-chart.css',
                    'bower_components/angular-loading-bar/build/loading-bar.css',


                    'bower_components/angular-bootstrap-datetimepicker/src/css/datetimepicker.css',


						'src/resources/css/styles.css'
				],
				dest: 'src/<%= pkg.name %>.css'
			},
			move: {
				src: ['bower_components/angularjs/angular.min.js.map'],
				dest: 'src/angular.min.js.map'
			}
		},

        ngAnnotate: {
            options:{
                singleQuotes: true
            },
            dist:{
                files:[{
                    'expand': true,
                    'src': 'src/<%= pkg.name %>.js',
                    'ext': '.annotated.js',
                    'extDot': 'last'
                }]
            }
        },

		less: {
			dev: {
				files: {
					'src/resources/css/styles.css': 'src/resources/css/styles.less'
				}
			}
		},

		watch: {
			scripts: {
				files: ['src/resources/js/**/*.js'],
				tasks: ['concat:dist']
			},
			styles: {
				files: ['src/resources/css/*.less'],
				tasks: ['less','concat:css']
			}
		},

        jasmine : {
            // Your project's source files
            src : 'src/**/*.js',
            // Your Jasmine spec files
            specs : 'specs/**/*spec.js',
            // Your spec helper files
            helpers : 'specs/helpers/*.js'
        },
        uglify: {
            my_target: {
                files: {
                    'src/DogDiary-deps.min.js': ['src/DogDiary-deps.js']
                }
            }
        }
	});

	//npm tasks
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-karma');

    //tasks
	grunt.registerTask('default', 'Default Task Alias', ['build']);

	grunt.registerTask('build', 'Build the application', 
		[
            'copy',
            'less:dev',
		    'concat',
		]);

    grunt.registerTask('test', [
        'karma'
    ]);
}