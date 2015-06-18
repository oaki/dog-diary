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
		concat: {
			options: {
				separator: "\n\n"
			},
			dist: {
				src: ['src/resources/js/**/*.js'],
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
                    'bower_components/angularjs-geolocation/dist/angularjs-geolocation.min.js'
				],
				dest: 'src/<%= pkg.name %>-deps.js'
			},
			css: {
				src: [
                    'bower_components/bootstrap/dist/css/bootstrap.min.css',
                    'bower_components/angular-chart.js/dist/dist/angular-chart.css',
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
        }
	});

	//npm tasks
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-ng-annotate');

	//tasks
	grunt.registerTask('default', 'Default Task Alias', ['build']);

	grunt.registerTask('build', 'Build the application', 
		[
            'copy',
            'less:dev',
		    'concat'
		]);
}