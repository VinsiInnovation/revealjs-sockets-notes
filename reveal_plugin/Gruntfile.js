module.exports = function (grunt) {

  // Build configuration
  grunt.initConfig({

    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
    //// PARAMETERS FOR TASK
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////


    /*
    * SOURCE
    **/
    src: {
      basedir: 'src/'
    },

    
    /*
    * REVEAL CONFIGURATION
    **/
    reveal : {
        js:   {
          all: 'js/**/*.js',
          dir: 'js',
        },
        plugins: {
          all:     'plugins/**/*.js',
          dir:   'plugins'
        }
    },

    /*
    * TARGET
    **/
    dist:{
      basedir: '../dist/reveal_plugin'
    },

    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
    //// BUILD TASKS
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////

    /*
    * CLEAN DIRECTORIES
    **/

    clean: {
      options: { force: true },
      tmp:      ['.tmp'],
      all:      ['<%= dist.basedir %> '],
      reveal:   ['<%= dist.basedir %>']
    },


    /*
    * UGLIFY THE FILES DIRECTORIES
    **/

    uglify: {
      my_target: {
        files: [{
            expand: true,
            cwd: '<%= src.basedir %>',
            src: '**/*.js',
            dest: '<%= dist.basedir %>'
        }]
      }
    },


    
    
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
    //// DEVELOPMENT TASKS
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////

   
    // Watch Configuration : compilation sass/compass + livereload 
    watch: {
        reveal_js: {
            files: ['<%= src.basedir %><%= reveal.js.all %>'],
            options: {
              livereload: true
            }
        },
        reveal_plugins: {
            files: ['<%= src.basedir %><%= reveal.plugins.all %>'],
            options: {
              livereload: true
            }
        }
    },
    
  });

  // Chargement des clients
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  // Déclaration des taches
  /*grunt.registerTask('lint',    ['jshint']);*/
  grunt.registerTask('release',    ['clean', 'uglify']);
  grunt.registerTask('default', ['release']);

};
