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
    plugin : {
        basedir : 'plugin',
        html: {
          index:    '<%= plugin.basedir %>/index.html',
          all : '<%= plugin.basedir %>/**/*.html'
        },
        js:   '<%= plugin.basedir %>/js/**/*.js',
        css: {
          all :'<%= plugin.basedir %>/css/**/*.css',
          dir: '<%= plugin.basedir %>/css',
          app: '<%= plugin.basedir %>/css/plugin.css',
          libs: '<%= plugin.basedir %>/libs/'
        },
        sass: {
          all :'<%= plugin.basedir %>/sass/**/*.scss',
          dir: '<%= plugin.basedir %>/sass'
        },
        assets: {
          font:     '<%= plugin.basedir %>/font',
          images:   '<%= plugin.basedir %>/images'
        }
    },
   
    clean: {
      server: {
        css:   '<%= server.css.dir %>'
      },
      plugin: {
        css:   '<%= plugin.css.dir %>'
      }
    },

    copy: {
        server: {
            files: [
                {expand: true, cwd: '<%= server.css.libs %>', src: ['**/*.css'], dest: '<%= server.css.dir %>'}
            ]
            
        },
        plugin: {
            files: [
                {expand: true, cwd: '<%= plugin.css.libs %>', src: ['**/*.css'], dest: '<%= plugin.css.dir %>'}
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
        plugin_html: {
            files: ['<%= plugin.html.all %>'],
            options: {
              livereload: true
            }
        },
        plugin_css: {
            files: ['<%= plugin.css.all %>'],
            options: {
              livereload: true
            }
        },
        plugin_sass: {
            files: ['<%= plugin.sass.all %>'],
            tasks: ['compass:plugin']
        },
        plugin_js: {
            files: ['<%= plugin.js %>'],
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
        
        plugin: {
            options:{
                sassDir: 'plugin/sass',
                cssDir : '<%= plugin.css.dir %>'
            }
        }
        
    }

  });

  // Chargement des plugins
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
