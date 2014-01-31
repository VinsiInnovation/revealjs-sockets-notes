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
      basedir: 'src/main/'
    },

    
    /*
    * SERVER CONFIGURATION
    **/
    server : {
        basedir : 'server',  
        html: {
          index:    '<%= server.basedir %>/index.html',
          partials: '<%= server.basedir %>/partials',
          all :     '<%= server.basedir %>/**/*.html'
        },
        js:   {
          all: '<%= server.basedir %>/js/**/*.js',
          dir: '<%= server.basedir %>/js',
        },
        css: {
          all :'<%= server.basedir %>/css/**/*.css',
          dir: '<%= server.basedir %>/css',
          app: '<%= server.basedir %>/css/server.css'
        },
        sass: {
          all :'<%= server.basedir %>/sass/**/*.scss',
          dir: '<%= server.basedir %>/sass'
        },
        assets: {
          font:     '<%= server.basedir %>/font',
          images:   '<%= server.basedir %>/images'
        },
        nodeServer: {
          server: '<%= server.basedir %>/server.js',
          npm:    '<%= server.basedir %>/package.json',
        }
    },

    /*
    * MOBILE CONFIGURATION
    **/
    client : {
        basedir : 'mobile',
        html: {
          index:    '<%= client.basedir %>/notes-speaker.html',
          partials:    '<%= client.basedir %>/partials',
          all : '<%= client.basedir %>/**/*.html'
        },
        js:   {
          all: '<%= client.basedir %>/js/**/*.js',
          dir: '<%= client.basedir %>/js'
        },
        css: {
          all :'<%= client.basedir %>/css/**/*.css',
          dir: '<%= client.basedir %>/css',
          app: '<%= client.basedir %>/css/notes-speaker.css'
        },
        sass: {
          all :'<%= client.basedir %>/sass/**/*.scss',
          dir: '<%= client.basedir %>/sass'
        },
        assets: {
          font:     '<%= client.basedir %>/font',
          images:   '<%= client.basedir %>/images'
        }
    },
   
    /*
    * Commons
    **/

    commons: {
      components: 'components',
      bower_components: 'bower_components',
      conf: 'conf'
    },


    /*
    * TARGET
    **/
    dist:{
      basedir: 'dist/'
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
      tmp:      ['.tmp'],
      all:      ['<%= dist.basedir %> '],
      commons:  ['<%= dist.basedir %><%= commons.components %>',
                '<%= dist.basedir %><%= commons.bower_components %>',
                '<%= dist.basedir %><%= commons.conf %>'],
      server:   ['<%= dist.basedir %><%= server.basedir %>'],
      client:   ['<%= dist.basedir %><%= client.basedir %>']
    },


    /*
    * COPY FILES
    **/
    copy: {
        commons: {
          files: [
            {expand: true, cwd: '<%= src.basedir %><%= commons.components %>', src: ['**'], dest: '<%= dist.basedir %><%= commons.components %>'},
            {expand: true, cwd: '<%= src.basedir %><%= commons.bower_components %>', src: ['**'], dest: '<%= dist.basedir %><%= commons.bower_components %>'},
            {expand: true, cwd: '<%= src.basedir %><%= commons.conf %>', src: ['**'], dest: '<%= dist.basedir %><%= commons.conf %>'}
          ]
        },
        server: {
            files: [
                { src: '<%= src.basedir %><%= server.html.index %>', dest: '<%= dist.basedir %><%= server.html.index %>' },
                { src: '<%= src.basedir %><%= server.nodeServer.server %>', dest: '<%= dist.basedir %><%= server.nodeServer.server %>' },
                { src: '<%= src.basedir %><%= server.nodeServer.npm %>', dest: '<%= dist.basedir %><%= server.nodeServer.npm %>' },
                {expand: true, cwd: '<%= src.basedir %><%= server.html.partials %>', src: ['**'], dest: '<%= dist.basedir %><%= server.html.partials %>'},
                {expand: true, cwd: '<%= src.basedir %><%= server.assets.font %>', src: ['**'], dest: '<%= dist.basedir %><%= server.assets.font %>'},
                {expand: true, cwd: '<%= src.basedir %><%= server.assets.images %>', src: ['**'], dest: '<%= dist.basedir %><%= server.assets.images %>'}
            ]
            
        },
        client: {
            files: [
                { src: '<%= src.basedir %><%= client.html.index %>', dest: '<%= dist.basedir %><%= client.html.index %>' },
                {expand: true, cwd: '<%= src.basedir %><%= client.html.partials %>', src: ['**'], dest: '<%= dist.basedir %><%= client.html.partials %>'},
                {expand: true, cwd: '<%= src.basedir %><%= client.assets.font %>', src: ['**'], dest: '<%= dist.basedir %><%= client.assets.font %>'},
                {expand: true, cwd: '<%= src.basedir %><%= client.assets.images %>', src: ['**'], dest: '<%= dist.basedir %><%= client.assets.images %>'}
            ]            
        }      
    },

    /* Config auto des taches concat, uglify et cssmin */
    useminPrepare: {
      server: {
        src: ['<%= dist.basedir %><%= server.html.index %>'],
        options: {
          dest : '<%= dist.basedir %><%= server.basedir %>',
          root : '<%= src.basedir %><%= server.basedir %>'
        }
        
      },
      client: {
        src: ['<%= dist.basedir %><%= client.html.index %>'],
        options: {
          dest : '<%= dist.basedir %><%= client.basedir %>',
          root : '<%= src.basedir %><%= client.basedir %>'
        }
        
      }
    },

    /* Usemin task */
    usemin: {
      html:['<%= dist.basedir %><%= server.html.index %>',
          '<%= dist.basedir %><%= client.html.index %>']
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
                sassDir: 'src/main/server/sass',
                cssDir : '<%= src.basedir %><%= server.css.dir %>'
            }
        },
        
        client: {
            options:{
                sassDir: 'src/main/mobile/sass',
                cssDir : '<%= src.basedir %><%= client.css.dir %>'
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
        },
        client_html: {
            files: ['<%= src.basedir %><%= client.html.index %>',
                  '<%= src.basedir %><%= client.html.all %>'],
            options: {
              livereload: true
            }
        },
        client_css: {
            files: ['<%= src.basedir %><%= client.css.all %>'],
            options: {
              livereload: true
            }
        },
        client_sass: {
            files: ['<%= src.basedir %><%= client.sass.all %>'],
            tasks: ['compass:client']
        },
        client_js: {
            files: ['<%= src.basedir %><%= client.js.all %>'],
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
  grunt.registerTask('dist_server',    ['compass', 'clean', 'copy:commons', 'copy:server', 'useminPrepare:server', 'concat', 'uglify', 'cssmin', 'usemin', 'clean:tmp']);
  grunt.registerTask('dist_client',    ['compass', 'clean', 'copy:commons', 'copy:client', 'useminPrepare:client', 'concat', 'uglify', 'cssmin', 'usemin', 'clean:tmp']);
  grunt.registerTask('release',    ['compass', 'clean', 'copy', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'usemin', 'clean:tmp']);
  grunt.registerTask('default', ['release']);

};
