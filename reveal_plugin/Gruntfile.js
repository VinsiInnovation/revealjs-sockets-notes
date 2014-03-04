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
        components:   {
          all: 'components/**/*.js',
          dir: 'components',
        },
        css: {
          all :'css/**/*.css',
          dir: 'css',
          app: 'css/server.css'
        },
        font: {
          dir: 'font'
        },
        sass: {
          all :'sass/**/*.scss',
          dir: 'sass'
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
      basedir: '../dist/reveal_plugin/'
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
    * COPY FILES
    **/
    copy: {
        reveal: {
            files: [
                {expand: true, cwd: '<%= src.basedir %><%= reveal.css.dir %>', src: ['**'], dest: '<%= dist.basedir %><%= reveal.css.dir %>'},
                {expand: true, cwd: '<%= src.basedir %><%= reveal.components.dir %>', src: ['**'], dest: '<%= dist.basedir %><%= reveal.components.dir %>'},
                {expand: true, cwd: '<%= src.basedir %><%= reveal.font.dir %>', src: ['**'], dest: '<%= dist.basedir %><%= reveal.font.dir %>'}
            ]
            
        }      
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

    /*
    * Compass Task
    */
    compass:{
        
        reveal:{

            options:{
                sassDir: 'src/sass',
                cssDir : '<%= src.basedir %><%= reveal.css.dir %>'
            }
        },
        reveal_sourcemap:{

            options:{
                sassDir: 'src/sass',
                sourcemap: true,
                cssDir : '<%= src.basedir %><%= reveal.css.dir %>'
            }
        }
        
    },

   
    // Watch Configuration : compilation sass/compass + livereload 
    watch: {
        reveal_js: {
            files: ['<%= src.basedir %><%= reveal.js.all %>'],
            options: {
              livereload: true
            }
        },
        reveal_css: {
            files: ['<%= src.basedir %><%= reveal.css.all %>'],
            options: {
              livereload: true
            }
        },
        reveal_sass: {
            files: ['<%= src.basedir %><%= reveal.sass.all %>'],
            tasks: ['compass:reveal_sourcemap']
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
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  
  // Déclaration des taches
  /*grunt.registerTask('lint',    ['jshint']);*/
  grunt.registerTask('release_build',    ['clean', 'copy', 'uglify', 'clean:tmp']);
  grunt.registerTask('release',    ['compass:reveal', 'clean', 'copy','uglify','clean:tmp']);
  grunt.registerTask('default', ['release']);

};
