module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['./public/client/app.js', './public/client/createLinkView.js', './public/client/link.js', './public/client/links.js', './public/client/linksView.js', './public/client/linkView.js', './public/client/router.js'],
        dest: './public/client/binder.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: './server.js'
      }
    },

    uglify: {
      my_target: {
        files: {
          './public/client/binder-min.js': './public/client/binder.js',
        }
      }
    },

    eslint: {
      target: [
        './public/client/app.js', './public/client/createLinkView.js', './public/client/link.js', './public/client/links.js', './public/client/linksView.js', './public/client/linkView.js', './public/client/router.js'
      ]
    },

    cssmin: {
      target: {
        files: {
          './public/style-min.css': './public/style.css',
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      command: 'mkdir test',
      // prodServer: {
      // },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });


  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      // add your production server task here
    }
    grunt.task.run([ 'server-dev' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);  

  grunt.registerTask('cats', [
    'concat'
  ]);

  grunt.registerTask('demons', [
    'nodemon'
  ]);

  grunt.registerTask('fugly', [
    'uglify'
  ]);
  
  grunt.registerTask('lints', [
    'eslint'
  ]);

  grunt.registerTask('ceess', [
    'cssmin'
  ]);

  grunt.registerTask('shells', [
    'shell'
  ]);

  grunt.registerTask('build', [
  ]);


  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    // add your deploy tasks here
  ]);


};
