module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: "\n", //add a new line after each file
        banner: "", //added before everything
        footer: "" //added after everything
      },
      dist: {
        // the files to concatenate
        src: [
          //include libs
          // 'bower_components/**/*.js', '!bower_components/**/*min.js',
          //own classes and files
          'clientjs/!(main).js',

          //the last script I need
          'clientjs/main.js'
        ],
        // the location of the resulting JS file
        dest: 'public/js/main.js'
      }
    },
    wiredep: {

      task: {

        // Point to the files that should be updated when
        // you run `grunt wiredep`
        src: [
          'views/**/*.hbs'   // .html support...
        ],

        options: {
          // See wiredep's configuration documentation for the options
          // you may pass:
          "directory":"public/vendor/",
          "ignorePath":'public/'
          // https://github.com/taptapship/wiredep#configuration
        }
      }
    },
    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['dev-watch'],
        options: {
          interrupt: true
        }
      }
    },
    removelogging: {
      dist: {
        src: "public/js/main.js",
        dest: "public/js/main.js"
      }
    },
    uglify: {
      options: {
        banner: ""
      },
      build: {
        src: 'public/js/main.js',
        dest: 'public/js/main.js'
      }
    }
  }); 

  //load the packages
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-remove-logging');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-wiredep');


  //register the task
  grunt.registerTask('dev-watch', ['concat:dist']);
  grunt.registerTask('build', ['concat', 'wiredep', 'removelogging', 'uglify']);
  grunt.registerTask('default', ['concat', 'wiredep']);

};