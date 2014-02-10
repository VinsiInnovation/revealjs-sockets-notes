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
    * REMOTE CONFIGURATION
    **/
    remote : {
        html: {
          index:    'notes-speaker.html',
          partials:    'partials',
          all : '**/*.html'
        },
        js:   {
          all: 'js/**/*.js',
          dir: 'js'
        },
        css: {
          all :'css/**/*.css',
          dir: 'css',
          app: 'css/notes-speaker.css'
        },
        sass: {
          all :'sass/**/*.scss',
          dir: 'sass'
        },
        assets: {
          font:     'font',
          images:   'images'
        }
    },
   
    
    /*
    * TARGET
    **/
    dist:{
      basedir: '../dist/remote/'
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
      remote:   ['<%= dist.basedir %> ']
    },


    /*
    * COPY FILES
    **/
    copy: {
        remote: {
            files: [
                { src: '<%= src.basedir %><%= remote.html.index %>', dest: '<%= dist.basedir %><%= remote.html.index %>' },
                {expand: true, cwd: '<%= src.basedir %><%= remote.html.partials %>', src: ['**'], dest: '<%= dist.basedir %><%= remote.html.partials %>'},
                {expand: true, cwd: '<%= src.basedir %><%= remote.assets.font %>', src: ['**'], dest: '<%= dist.basedir %><%= remote.assets.font %>'},
                {expand: true, cwd: '<%= src.basedir %><%= remote.assets.images %>', src: ['**'], dest: '<%= dist.basedir %><%= remote.assets.images %>'}
            ]            
        }      
    },

    /* Config auto des taches concat, uglify et cssmin */
    useminPrepare: {
      remote: {
        src: ['<%= dist.basedir %><%= remote.html.index %>'],
        options: {
          dest : '<%= dist.basedir %>',
          root : '<%= src.basedir %>'
        }
        
      }
    },

    /* Usemin task */
    usemin: {
      html:['<%= dist.basedir %><%= remote.html.index %>']
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
        
        remote: {
            options:{
                sassDir: 'src/sass',
                cssDir : '<%= src.basedir %><%= remote.css.dir %>'
            }
        },
        remote_sourcemap: {
            options:{
                sassDir: 'src/sass',
                sourcemap: true,
                cssDir : '<%= src.basedir %><%= remote.css.dir %>'
            }
        }
        
    },

    // Watch Configuration : compilation sass/compass + livereload 
    watch: {
        remote_html: {
            files: ['<%= src.basedir %><%= remote.html.index %>',
                  '<%= src.basedir %><%= remote.html.all %>'],
            options: {
              livereload: true
            }
        },
        remote_css: {
            files: ['<%= src.basedir %><%= remote.css.all %>'],
            options: {
              livereload: true
            }
        },
        remote_sass: {
            files: ['<%= src.basedir %><%= remote.sass.all %>'],
            tasks: ['compass:remote_sourcemap']
        },
        remote_js: {
            files: ['<%= src.basedir %><%= remote.js.all %>'],
            options: {
              livereload: true
            }
        
        }
    },
    
  });

  // Chargement des remotes
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
  /*grunt.loadNpmTasks('grunt-oversprite');*/

  // Déclaration des taches
  /*grunt.registerTask('lint',    ['jshint', 'csslint']);*/
  grunt.registerTask('release_build',    ['clean', 'copy', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'usemin', 'clean:tmp']);
  grunt.registerTask('release',    ['compass:remote', 'clean', 'copy', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'usemin', 'clean:tmp']);
  grunt.registerTask('default', ['release']);

};
