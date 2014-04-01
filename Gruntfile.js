module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: ['public/js/*.js']
    },
    watch: {
      files: ['public/js/*.js', 'views/index.jade'],
      tasks: ['jshint'],
      options: {
        livereload: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint']);
};
