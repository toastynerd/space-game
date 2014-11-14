module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    jshint: {
      src: ['server.js', 'app/js/**/*.js'],
      options: {
        jshintrc: true
      }
    },

    clean: {
      dev: {
        src: ['build/']
      }
    },

    copy: {
      socketio: {
        nonull: true,
        expand: true,
        flatten: true,
        src: 'node_modules/socket.io-client/socket.io.js',
        dest: 'app/lib',
        rename: function(dest, src) {
          return dest + '/socketio-client.js'
        }
      },

      dev: {
        expand: true,
        flatten: true,
        src: ['app/index.html'],
        dest: 'build/'
      }
    },

    browserify: {
      dev: {
        src: ['app/js/**/*.js'],
        dest: 'build/client.js',
        options: {
          transform: ['debowerify']
        }
      }
    }
  });

  grunt.registerTask('build', ['jshint','copy:socketio', 'clean:dev', 'browserify:dev', 'copy:dev']);
};
