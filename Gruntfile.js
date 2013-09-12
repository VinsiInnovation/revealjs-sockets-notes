module.exports = function (grunt) {

  // Configuration du build
  grunt.initConfig({

    // Paramétrage

    
    server : {
        basedir : 'server',  
        html: {
          index:    '<%= server.basedir %>/index.html',
          all :     "<%= server.basedir %>/**/*.html"
        },
        js:   ['<%= server.basedir %>/js/**/*.js'],
        css: {
          all :'<%= server.basedir %>/css/**/*.css',
          dir: '<%= server.basedir %>/css/',
          app: '<%= server.basedir %>/css/server.css',
          libs: '<%= server.basedir %>/lib/'
        },
        sass: {
          all :'<%= server.basedir %>/scss/**/*.scss',
          dir: '<%= server.basedir %>/scss'
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
          all :     "<%= plugin.basedir %>/**/*.html"
        },
        js:   ['<%= plugin.basedir %>/js/**/*.js'],
        css: {
          all :'<%= plugin.basedir %>/css/**/*.css',
          dir: '<%= plugin.basedir %>/css/',
          app: '<%= plugin.basedir %>/css/plugin.css',
          libs: '<%= plugin.basedir %>/lib/'
        },
        sass: {
          all :'<%= plugin.basedir %>/scss/**/*.scss',
          dir: '<%= plugin.basedir %>/scss'
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
            css: {
                files: [
                    {expand: true, cwd: '<%= server.css.libs %>', src: ['**/*.css'], dest: '<%= server.css.dir %>'}
                ]
            }
        },
        plugin: {
            css: {
                files: [
                    {expand: true, cwd: '<%= plugin.css.libs %>', src: ['**/*.css'], dest: '<%= plugin.css.dir %>'}
                ]
            }
        }      
    },

    
    // Configuration du watch
    watch: {
        server: {            
            html: {
                files: ['<%= server.html.all %>'],
                options: {
                  livereload: true
                }
            },
            css: {
                files: ['<%= server.css.all %>'],
                options: {
                  livereload: true
                }
            },
            sass: {
                files: ['<%= server.sass.all %>'],
                task: 'compass.server'
            },
            js: {
                files: ['<%= server.js %>'],
                options: {
                  livereload: true
                }
            }
        },
        plugin: {
            html: {
                files: ['<%= plugin.html.all %>'],
                options: {
                  livereload: true
                }
            },
            css: {
                files: ['<%= plugin.css.all %>'],
                options: {
                  livereload: true
                }
            },
            sass: {
                files: ['<%= plugin.sass.all %>'],
                task: 'compass.server'
            },
            js: {
                files: ['<%= plugin.js %>'],
                options: {
                  livereload: true
                }
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
