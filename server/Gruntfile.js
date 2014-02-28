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
                { src: '<%= src.basedir %><%= server.nodeServer.server %>', dest: '<%= dist.basedir %><%= server.nodeServer.server %>' },
                { src: '<%= src.basedir %><%= server.nodeServer.npm %>', dest: '<%= dist.basedir %><%= server.nodeServer.npm %>' }
            ]
            
        }      
    }

    
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
    //// DEVELOPMENT TASKS
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////

    
    
    
  });

  // Chargement des clients
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  /*grunt.loadNpmTasks('grunt-oversprite');*/

  // Déclaration des taches
  /*grunt.registerTask('lint',    ['jshint', 'csslint']);*/
  grunt.registerTask('release',    ['clean', 'copy', 'clean:tmp']);
  grunt.registerTask('default', ['release']);

};
