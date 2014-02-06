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
    * SERVER CONFIGURATION
    **/
    server : {
        html: {
          index:    'index.html',
          partials: 'partials',
          all :     '**/*.html'
        },
        js:   {
          all: 'js/**/*.js',
          dir: 'js',
        },
        css: {
          all :'css/**/*.css',
          dir: 'css',
          app: 'css/server.css'
        },
        sass: {
          all :'sass/**/*.scss',
          dir: 'sass'
        },
        assets: {
          font:     'font',
          images:   'images'
        },
        nodeServer: {
          server: 'server.js',
          npm:    'package.json',
        }
    },
 
   
    /*
    * TARGET
    **/
    dist:{
      basedir: '../dist/server/'
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
      server:   ['<%= dist.basedir %>']
    },


    /*
    * COPY FILES
    **/
    copy: {
        server: {
            files: [
                { src: '<%= src.basedir %><%= server.html.index %>', dest: '<%= dist.basedir %><%= server.html.index %>' },
                { src: '<%= src.basedir %><%= server.nodeServer.server %>', dest: '<%= dist.basedir %><%= server.nodeServer.server %>' },
                { src: '<%= src.basedir %><%= server.nodeServer.npm %>', dest: '<%= dist.basedir %><%= server.nodeServer.npm %>' },
                {expand: true, cwd: '<%= src.basedir %><%= server.html.partials %>', src: ['**'], dest: '<%= dist.basedir %><%= server.html.partials %>'},
                {expand: true, cwd: '<%= src.basedir %><%= server.assets.font %>', src: ['**'], dest: '<%= dist.basedir %><%= server.assets.font %>'},
                {expand: true, cwd: '<%= src.basedir %><%= server.assets.images %>', src: ['**'], dest: '<%= dist.basedir %><%= server.assets.images %>'}
            ]
            
        }      
    },

    /* Config auto des taches concat, uglify et cssmin */
    useminPrepare: {
      server: {
        src: ['<%= dist.basedir %><%= server.html.index %>'],
        options: {
          dest : '<%= dist.basedir %>',
          root : '<%= src.basedir %>'
        }
        
      }
    },

    /* Usemin task */
    usemin: {
      html:['<%= dist.basedir %><%= server.html.index %>']
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
        
        server:{

            options:{
                sassDir: 'src/sass',
                cssDir : '<%= src.basedir %><%= server.css.dir %>'
            }
        }
        
    },

    // Watch Configuration : compilation sass/compass + livereload 
    watch: {
        server_html: {            
            files: ['<%= src.basedir %><%= server.html.index %>',
                '<%= src.basedir %><%= server.html.all %>'],
            options: {
              livereload: true
            }
        },
        server_css: {
            files: ['<%= src.basedir %><%= server.css.all %>'],
            options: {
              livereload: true
            }
        },
        server_sass: {
            files: ['<%= src.basedir %><%= server.sass.all %>'],
            tasks: ['compass:server']
        },
        server_js: {
            files: ['<%= src.basedir %><%= server.js.all %>'],
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
  /*grunt.loadNpmTasks('grunt-oversprite');*/

  // Déclaration des taches
  /*grunt.registerTask('lint',    ['jshint', 'csslint']);*/
  grunt.registerTask('release',    ['compass', 'clean', 'copy', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'usemin', 'clean:tmp']);
  grunt.registerTask('default', ['release']);

};
