module.exports = function (grunt) {

  // Configuration du build
  grunt.initConfig({

    // Paramétrage

    
    server : {
        basedir : 'server',  
        html: {
          index:    '<%= server.basedir %>/index.html',
          all :     '<%= server.basedir %>/**/*.html'
        },
        js:   '<%= server.basedir %>/js/**/*.js',
        css: {
          all :'<%= server.basedir %>/css/**/*.css',
          dir: '<%= server.basedir %>/css',
          app: '<%= server.basedir %>/css/server.css',
          libs: '<%= server.basedir %>/libs'
        },
        sass: {
          all :'<%= server.basedir %>/sass/**/*.scss',
          dir: '<%= server.basedir %>/sass'
        },
        assets: {
          font:     '<%= server.basedir %>/font',
          images:   '<%= server.basedir %>/images'
        }
    },
    client : {
        basedir : 'client',
        html: {
          index:    '<%= client.basedir %>/index.html',
          all : '<%= client.basedir %>/**/*.html'
        },
        js:   '<%= client.basedir %>/js/**/*.js',
        css: {
          all :'<%= client.basedir %>/css/**/*.css',
          dir: '<%= client.basedir %>/css',
          app: '<%= client.basedir %>/css/client.css',
          libs: '<%= client.basedir %>/libs/'
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
   
    clean: {
      server: {
        css:   '<%= server.css.dir %>'
      },
      client: {
        css:   '<%= client.css.dir %>'
      }
    },

    copy: {
        server: {
            files: [
                {expand: true, cwd: '<%= server.css.libs %>', src: ['**/*.css'], dest: '<%= server.css.dir %>'}
            ]
            
        },
        client: {
            files: [
                {expand: true, cwd: '<%= client.css.libs %>', src: ['**/*.css'], dest: '<%= client.css.dir %>'}
            ]            
        }      
    },

    
    // Configuration du watch
    watch: {
        server_html: {            
            files: ['<%= server.html.all %>'],
            options: {
              livereload: true
            }
        },
        server_css: {
            files: ['<%= server.css.all %>'],
            options: {
              livereload: true
            }
        },
        server_sass: {
            files: ['<%= server.sass.all %>'],
            tasks: ['compass:server']
        },
        server_js: {
            files: ['<%= server.js %>'],
            options: {
              livereload: true
            }
        },
        client_html: {
            files: ['<%= client.html.all %>'],
            options: {
              livereload: true
            }
        },
        client_css: {
            files: ['<%= client.css.all %>'],
            options: {
              livereload: true
            }
        },
        client_sass: {
            files: ['<%= client.sass.all %>'],
            tasks: ['compass:client']
        },
        client_js: {
            files: ['<%= client.js %>'],
            options: {
              livereload: true
            }
        
        }
    },
    
      
    // Sass configuration
      
    compass:{
        
        server:{

            options:{
                sassDir: 'server/sass',
                cssDir : '<%= server.css.dir %>'
            }
        },
        
        client: {
            options:{
                sassDir: 'client/sass',
                cssDir : '<%= client.css.dir %>'
            }
        }
        
    }

  });

  // Chargement des clients
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  /*grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-jshint');*/
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  /*grunt.loadNpmTasks('grunt-oversprite');*/

  // Déclaration des taches
  /*grunt.registerTask('lint',    ['jshint', 'csslint']);*/
  grunt.registerTask('prod',    ['clean', 'copy', 'compass']);
  grunt.registerTask('default', ['prod']);

};
